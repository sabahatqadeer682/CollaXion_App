import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator, Alert, Image, Platform,
  ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View
} from "react-native";
import { BASE, C, FieldInput, sharedStyles, useToast, useUser } from "./shared";

// ═══════════════════════════════════════════════════════════════
//  PROFILE SCREEN
// ═══════════════════════════════════════════════════════════════
export function ProfileScreen() {
  const nav = useNavigation<any>();
  const { user, updateUser, ax } = useUser();
  const toast = useToast();
  const [ld, setLd] = useState(false);
  const [form, setForm] = useState({ ...user });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") { Alert.alert("Permission needed", "Camera roll access required."); return; }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!res.canceled) {
      const newLogo = res.assets[0].uri;
      setForm((f: any) => ({ ...f, logo: newLogo }));
      updateUser({ logo: newLogo });
    }
  };

  const save = async () => {
    setLd(true);
    try {
      try { await ax().put(`${BASE}/api/industry/auth/profile`, form); } catch {}
      updateUser(form);
      toast("Profile updated!", "success");
    } catch { toast("Update failed", "error"); }
    finally { setLd(false); }
  };

  const initials = (n: string) => n?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "CX";

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Custom header with drawer-aware back button */}
      <View style={sharedStyles.hdr}>
        <TouchableOpacity onPress={() => nav.navigate("Dashboard")} style={sharedStyles.hdrBtn}>
          <Ionicons name="arrow-back" size={24} color={C.navy} />
        </TouchableOpacity>
        <Text style={sharedStyles.hdrTitle} numberOfLines={1}>Company Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {/* Profile Header */}
        <View style={styles.profBanner}>
          <TouchableOpacity onPress={pickImage} style={styles.profAvatarWrap}>
            {form.logo
              ? <Image source={{ uri: form.logo }} style={styles.profAvatarImg} />
              : <Text style={styles.profAvatarTxt}>{initials(form.name)}</Text>}
            <View style={styles.profCamBtn}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.profName}>{form.name}</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={12} color={C.teal} />
            <Text style={styles.verifiedTxt}>Verified Partner</Text>
          </View>
        </View>

        <View style={styles.profForm}>
          <Text style={styles.profSection}>Company Info</Text>
          {[
            { lbl: "Company Name", key: "name" },
            { lbl: "Industry Sector", key: "industry" },
            { lbl: "Website", key: "website", kbType: "url" },
            { lbl: "Address", key: "address" },
          ].map(f => (
            <View key={f.key} style={styles.fieldWrap}>
              <Text style={sharedStyles.fieldLbl}>{f.lbl}</Text>
              <TextInput style={sharedStyles.fieldInput} value={(form as any)[f.key]}
                onChangeText={(v) => setForm((x: any) => ({ ...x, [f.key]: v }))}
                keyboardType={(f as any).kbType || "default"} />
            </View>
          ))}
          <View style={styles.fieldWrap}>
            <Text style={sharedStyles.fieldLbl}>About Us</Text>
            <TextInput style={[sharedStyles.fieldInput, { height: 90, textAlignVertical: "top" }]}
              value={form.about} onChangeText={(v) => setForm((x: any) => ({ ...x, about: v }))} multiline />
          </View>

          <Text style={[styles.profSection, { marginTop: 20 }]}>Contact</Text>
          {[
            { lbl: "Email", key: "email", kbType: "email-address" },
            { lbl: "Phone", key: "phone", kbType: "phone-pad" },
          ].map(f => (
            <View key={f.key} style={styles.fieldWrap}>
              <Text style={sharedStyles.fieldLbl}>{f.lbl}</Text>
              <TextInput style={sharedStyles.fieldInput} value={(form as any)[f.key]}
                onChangeText={(v) => setForm((x: any) => ({ ...x, [f.key]: v }))}
                keyboardType={(f as any).kbType || "default"} autoCapitalize="none" />
            </View>
          ))}

          <TouchableOpacity style={sharedStyles.saveBtn} onPress={save} disabled={ld}>
            {ld ? <ActivityIndicator color="#fff" /> : (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={sharedStyles.saveBtnTxt}>Save Changes</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  profBanner: { backgroundColor: C.navy, paddingTop: Platform.OS === "ios" ? 52 : 42, paddingBottom: 28,
    alignItems: "center", gap: 8 },
  profAvatarWrap: { position: "relative", marginBottom: 4 },
  profAvatarImg: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: C.gold },
  profAvatarTxt: { fontSize: 32, fontWeight: "900", color: "#fff", width: 96, height: 96,
    borderRadius: 48, backgroundColor: C.teal, textAlign: "center", lineHeight: 96,
    borderWidth: 3, borderColor: C.gold },
  profCamBtn: { position: "absolute", bottom: 2, right: 2, width: 30, height: 30, borderRadius: 15,
    backgroundColor: C.gold, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: C.navy },
  profName: { fontSize: 20, fontWeight: "800", color: "#fff" },
  verifiedBadge: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(13,115,119,0.3)",
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  verifiedTxt: { fontSize: 12, color: C.tealLight, fontWeight: "600" },
  profForm: { padding: 20 },
  profSection: { fontSize: 14, fontWeight: "800", color: C.navy, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 },
  fieldWrap: { marginBottom: 14 },
});