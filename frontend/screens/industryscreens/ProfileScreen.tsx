import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator, Alert, Image, Platform,
  ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View
} from "react-native";
import { BASE, broadcastLogo, broadcastUser, C, sharedStyles, useIndustryLogo, useToast, useUser } from "./shared";

// ── Color Theme (CollaXion) ───────────────────────────────────
const T = {
  bg:        "#F0F4F8",
  header:    "#0D2E3E",
  card:      "#FFFFFF",
  navy:      "#0D2E3E",
  teal:      "#1A3C4E",
  text:      "#0D2E3E",
  sub:       "#5A7A8A",
  border:    "#E2E8F0",
  gold:      "#F59E0B",
  white:     "#FFFFFF",
  inputBg:   "#F8FAFC",
};

export function ProfileScreen() {
  const nav = useNavigation<any>();
  const { user, updateUser, refreshUser, setLogo, ax } = useUser();
  const liveLogo = useIndustryLogo();
  const toast = useToast();
  const [ld, setLd] = useState(false);
  const [fetching, setFetching] = useState(true);
  // Initialise form with user data PLUS fall back to whatever the rest of the
  // app is showing (broadcast / cached logo). So when the user lands on this
  // screen the avatar matches the dashboard / drawer immediately.
  const [form, setForm] = useState({ ...user, logo: (user?.logo || liveLogo || "") });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.email) { setFetching(false); return; }
      try {
        const { data } = await ax().get(
          `${BASE}/api/industry/auth/profile?email=${encodeURIComponent(user.email)}`
        );
        if (data?.company) {
          // Merge server data, but preserve a renderable logo if the
          // backend's value is missing / stale (file://) — pick the live
          // broadcast or cached value instead.
          const validBackend = typeof data.company.logo === "string" &&
            (data.company.logo.startsWith("data:") || /^https?:\/\//i.test(data.company.logo));
          const bestLogo = validBackend ? data.company.logo : (liveLogo || form.logo || "");
          setForm({ ...data.company, logo: bestLogo });
          updateUser({ ...data.company, logo: bestLogo });
        }
      } catch (err: any) {
        console.error("Load profile error:", err?.response?.data || err.message);
      } finally {
        setFetching(false);
      }
    };
    loadProfile();
  }, []);

  // Convert any local URI → base64 data URI (JS fallback when picker.base64 missing)
  const uriToDataUri = (uri: string): Promise<string> =>
    new Promise(async (resolve, reject) => {
      try {
        const r = await fetch(uri);
        const b = await r.blob();
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(b);
      } catch (e) { reject(e); }
    });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera roll access required.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
      base64: true,
    });
    if (res.canceled) return;
    const asset = res.assets[0];

    // ALWAYS produce a real data URI — file:// is never accepted.
    let dataUri: string | null = asset.base64
      ? `data:image/jpeg;base64,${asset.base64}`
      : null;
    if (!dataUri) {
      try { dataUri = await uriToDataUri(asset.uri); }
      catch (e) { console.log("Logo encode failed:", e); }
    }
    if (!dataUri || !dataUri.startsWith("data:")) {
      Alert.alert("Image error", "Could not read this image. Please try a different one.");
      return;
    }

    setForm((f: any) => ({ ...f, logo: dataUri }));
    broadcastLogo(dataUri);   // instant preview on dashboard / drawer
  };

  const save = async () => {
    // Always key off the canonical account email (from context), never a
    // value typed into the form — that's how an edit becomes an update of
    // the SAME Profile document instead of accidentally upserting a new one.
    const accountEmail = (user?.email || form.email || "").trim().toLowerCase();
    if (!accountEmail) {
      toast("No email found — cannot save", "error");
      return;
    }
    setLd(true);
    try {
      // Build payload — whitelist canonical fields only so we don't ship _id /
      // verified / timestamps back to the server. Logo is included only when
      // it's renderable (data URI or http URL); a stray file:// is dropped.
      const payload: any = {
        email:    accountEmail,
        name:     (form.name     ?? "").trim(),
        industry: (form.industry ?? "").trim(),
        website:  (form.website  ?? "").trim(),
        address:  (form.address  ?? "").trim(),
        about:    (form.about    ?? "").trim(),
        phone:    (form.phone    ?? "").trim(),
      };
      if (typeof form.logo === "string" &&
          (form.logo.startsWith("data:") || /^https?:\/\//i.test(form.logo))) {
        payload.logo = form.logo;
      }

      const resp = await ax().put(`${BASE}/api/industry/auth/profile`, payload);
      const data = resp.data;

      // ── Adopt the server's canonical record so local state matches DB ──
      const serverLogo = data?.company?.logo || "";
      if (serverLogo) {
        broadcastLogo(serverLogo);
        setLogo?.(serverLogo);
        setForm((f: any) => ({ ...f, ...data.company, logo: serverLogo }));
      } else {
        setForm((f: any) => ({ ...f, ...data.company }));
      }
      updateUser(data.company);

      // Fire global event → every screen using useUser() re-pulls fresh data
      // (dashboard, drawer, post cards, etc.) so the UI matches the DB.
      broadcastUser();

      await refreshUser?.();
      toast("Your profile has been updated", "success");
      Alert.alert("Profile Updated", "Your profile has been updated successfully.");
    } catch (err: any) {
      const msg =
        err?.response?.status
          ? `HTTP ${err.response.status}: ${err?.response?.data?.message || ""}`
          : err?.message || "Unknown error";
      console.error("Save error:", msg);
      Alert.alert("Save failed", msg);
      toast("Update failed", "error");
    } finally {
      setLd(false);
    }
  };

  const initials = (n: string) =>
    n?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "CX";

  if (fetching) {
    return (
      <View style={{ flex: 1, backgroundColor: T.bg, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={T.navy} />
        <Text style={{ marginTop: 12, color: T.navy, fontWeight: "600" }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={styles.hdr}>
        <TouchableOpacity onPress={() => nav.navigate("Dashboard")} style={styles.hdrBtn}>
          <Ionicons name="arrow-back" size={24} color={T.white} />
        </TouchableOpacity>
        <Text style={styles.hdrTitle} numberOfLines={1}>My Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {/* Banner */}
        <View style={styles.profBanner}>
          <TouchableOpacity onPress={pickImage} style={styles.profAvatarWrap}>
            {(() => {
              const src = form.logo || liveLogo;
              return src
                ? <Image key={src.slice(0,32)} source={{ uri: src }} style={styles.profAvatarImg} />
                : <Text style={styles.profAvatarTxt}>{initials(form.name)}</Text>;
            })()}
            <View style={styles.profCamBtn}>
              <Ionicons name="camera" size={14} color={T.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.profName}>{form.name}</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={12} color={"#0f7737"} />
            <Text style={styles.verifiedTxt}>Verified Partner</Text>
          </View>
        </View>

        <View style={styles.profForm}>
          <Text style={styles.profSection}>Company Info</Text>
          {[
            { lbl: "Company Name",    key: "name" },
            { lbl: "Industry Sector", key: "industry" },
            { lbl: "Website",         key: "website",  kbType: "url" },
            { lbl: "Address",         key: "address" },
          ].map((f) => (
            <View key={f.key} style={styles.fieldWrap}>
              <Text style={styles.fieldLbl}>{f.lbl}</Text>
              <TextInput
                style={styles.fieldInput}
                value={(form as any)[f.key] ?? ""}
                onChangeText={(v) => setForm((x: any) => ({ ...x, [f.key]: v }))}
                keyboardType={(f as any).kbType || "default"}
              />
            </View>
          ))}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLbl}>About Us</Text>
            <TextInput
              style={[styles.fieldInput, { height: 90, textAlignVertical: "top" }]}
              value={form.about ?? ""}
              onChangeText={(v) => setForm((x: any) => ({ ...x, about: v }))}
              multiline
            />
          </View>

          <Text style={[styles.profSection, { marginTop: 20 }]}>Contact</Text>
          {/* Email is the unique account key — read-only here. */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLbl}>Email</Text>
            <TextInput
              style={[styles.fieldInput, { backgroundColor: "#EEF2F7", color: T.sub }]}
              value={form.email ?? ""}
              editable={false}
              selectTextOnFocus={false}
            />
          </View>
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLbl}>Phone</Text>
            <TextInput
              style={styles.fieldInput}
              value={form.phone ?? ""}
              onChangeText={(v) => setForm((x: any) => ({ ...x, phone: v }))}
              keyboardType="phone-pad"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={ld}>
            {ld ? (
              <ActivityIndicator color={T.white} />
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="checkmark-circle" size={18} color={T.white} />
                <Text style={styles.saveBtnTxt}>Save Changes</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hdr: {
    backgroundColor: T.header,
    paddingTop: Platform.OS === "ios" ? 52 : 42,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hdrBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center", alignItems: "center",
  },
  hdrTitle: {
    fontSize: 18, fontWeight: "800", color: T.white, flex: 1, textAlign: "center",
  },
  profBanner: {
    backgroundColor: T.header,
    paddingTop: 24,
    paddingBottom: 28,
    alignItems: "center",
    gap: 8,
  },
  profAvatarWrap:  { position: "relative", marginBottom: 4 },
  profAvatarImg:   { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: "#ffffff" },
  profAvatarTxt:   {
    fontSize: 32, fontWeight: "900", color: T.white,
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: "#ffffff", textAlign: "center", lineHeight: 96,
    borderWidth: 3, borderColor: T.gold,
  },
  profCamBtn: {
    position: "absolute", bottom: 2, right: 2,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: "#49616d", justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: "#ffffff",
  },
  profName:      { fontSize: 20, fontWeight: "800", color: T.white },
  verifiedBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "#dee78a",
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
  },
  verifiedTxt:  { fontSize: 12, color: "#248a20", fontWeight: "600" },
  profForm:     { padding: 20 },
  profSection:  {
    fontSize: 14, fontWeight: "800", color: T.navy,
    marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8,
  },
  fieldWrap:    { marginBottom: 14 },
  fieldLbl:     { fontSize: 12, fontWeight: "700", color: T.sub, marginBottom: 6 },
  fieldInput:   {
    backgroundColor: T.card, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1.5, borderColor: T.border,
    fontSize: 14, color: T.text, fontWeight: "500",
  },
  saveBtn: {
    backgroundColor: T.navy,
    borderRadius: 14, paddingVertical: 16,
    alignItems: "center", justifyContent: "center",
    marginTop: 10,
  },
  saveBtnTxt: { fontSize: 15, fontWeight: "800", color: T.white },
});