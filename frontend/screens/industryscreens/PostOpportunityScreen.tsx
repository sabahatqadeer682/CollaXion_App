import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert, Animated, Image, KeyboardAvoidingView, Platform,
  ScrollView, StatusBar, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from "react-native";
import { useUser } from "./shared";

// ── Theme — matches CollaXion industry dashboard ───────────────────
const T = {
  bg:          "#F0F4F8",
  header:      "#193648",
  card:        "#FFFFFF",
  border:      "#E2EAF0",
  navy:        "#193648",
  text:        "#0D1B2A",
  sub:         "#5B7080",
  muted:       "#94A3B8",
  white:       "#FFFFFF",
  green:       "#059669",
  iconBg:      "#EEF3F7",
  inputBg:     "#FFFFFF",
  placeholder: "#9BB0BC",
  chipBg:      "#EEF3F7",
};

type PostType = "Internship" | "Project" | "Workshop";

const POST_TYPES: { label: PostType; icon: string; desc: string }[] = [
  { label: "Internship", icon: "briefcase-outline", desc: "Paid / unpaid work experience" },
  { label: "Project",    icon: "flask-outline",    desc: "Research or development" },
  { label: "Workshop",   icon: "school-outline",   desc: "Training or bootcamp" },
];

const SKILL_SUGGESTIONS = [
  "React Native", "Python", "UI/UX", "Machine Learning", "Data Science",
  "JavaScript", "Node.js", "Flutter", "TensorFlow", "SQL", "Figma",
  "C++", "Java", "Swift", "Kotlin", "DevOps", "Cloud Computing",
];

export function PostOpportunityScreen() {
  const nav = useNavigation<any>();
  const { user, ax } = useUser();

  const [type, setType]             = useState<PostType>("Internship");
  const [title, setTitle]           = useState("");
  const [description, setDesc]      = useState("");
  const [skills, setSkills]         = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [stipend, setStipend]       = useState("");
  const [duration, setDuration]     = useState("");
  const [seats, setSeats]           = useState("");
  const [deadline, setDeadline]     = useState("");
  const [location, setLocation]     = useState("");
  const [mode, setMode]             = useState<"Onsite" | "Remote" | "Hybrid">("Onsite");
  const [poster, setPoster]         = useState<string | null>(null);
  const [loading, setLoading]       = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5, aspect: [16, 9],
      base64: true,                       // native base64 — reliable on RN
    });
    if (!res.canceled) {
      const a = res.assets[0];
      setPoster(a.base64 ? `data:image/jpeg;base64,${a.base64}` : a.uri);
    }
  };

  const addSkill = (sk: string) => {
    const s = sk.trim();
    if (s && !skills.includes(s)) setSkills([...skills, s]);
    setSkillInput("");
  };

  const removeSkill = (sk: string) => setSkills(skills.filter((s) => s !== sk));

  const handlePost = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Required", "Title aur description zaroori hain.");
      return;
    }
    if (!user?._id) {
      Alert.alert("Error", "Session khatam ho gaya. Dobara login karein.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        type, title: title.trim(), description: description.trim(),
        skills, stipend, duration, seats, deadline, location, mode,
        poster,                          // already a data URI from the picker
      };
      const response = await ax().post("/api/industry/posts", payload);
      console.log("✅ Post created:", response.data?._id);
      Alert.alert("Posted! 🎉", `Your ${type} post is live!`, [
        { text: "OK", onPress: () => nav.goBack() },
      ]);
    } catch (e: any) {
      console.error("❌ Post error:", e?.response?.status, e?.response?.data || e?.message);
      let msg = "Post Creation Failed.";
      if (!e?.response) {
        msg = "Not connected to server.\n\nCheck:\n• Is the server running?\n• Check your internet connection.";
      } else if (e.response.status === 401) {
        msg = "401: Industry ID not found. Please log in again.";
      } else if (e.response.status === 404) {
        msg = "404: Route not found. Please update the server.";
      } else if (e.response.status === 400) {
        msg = e.response.data?.message || "400: Some required fields are missing.";
      } else if (e.response.status === 500) {
        msg = "500: Server error. Please check backend logs.";
      }
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={T.header} />

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => nav.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={T.white} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={s.headerTitle}>Post Opportunity</Text>
          <Text style={s.headerSub}>Reach hundreds of students</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}>

        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{ paddingBottom: 140 }}>

            {/* ── Type Selector ── */}
            <View style={s.section}>
              <Text style={s.sectionLabel}>Opportunity Type</Text>
              <View style={s.typeRow}>
                {POST_TYPES.map((pt) => {
                  const active = type === pt.label;
                  return (
                    <TouchableOpacity key={pt.label}
                      style={[s.typeTile, active && s.typeTileActive]}
                      onPress={() => setType(pt.label)} activeOpacity={0.85}>
                      <View style={[s.typeTileIcon, active && { backgroundColor: T.navy }]}>
                        <Ionicons name={pt.icon as any} size={20}
                          color={active ? T.white : T.navy} />
                      </View>
                      <Text style={[s.typeTileLabel, active && { color: T.navy, fontWeight: "800" }]}>
                        {pt.label}
                      </Text>
                      <Text style={s.typeTileDesc} numberOfLines={2}>{pt.desc}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* ── Banner ── */}
            <View style={s.section}>
              <Text style={s.sectionLabel}>Banner Image (Optional)</Text>
              <TouchableOpacity onPress={pickImage} activeOpacity={0.88}>
                {poster ? (
                  <View style={s.posterPreviewWrap}>
                    <Image source={{ uri: poster }} style={s.posterPreview} />
                    <TouchableOpacity style={s.posterRemove} onPress={() => setPoster(null)}>
                      <Ionicons name="close-circle" size={24} color={T.white} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={s.posterPlaceholder}>
                    <View style={s.posterIconCircle}>
                      <Ionicons name="image-outline" size={26} color={T.navy} />
                    </View>
                    <Text style={s.posterPlaceholderTxt}>Tap to upload banner</Text>
                    <Text style={s.posterPlaceholderSub}>16:9 recommended</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* ── Title ── */}
            <View style={s.section}>
              <Text style={s.sectionLabel}>Title <Text style={s.required}>*</Text></Text>
              <View style={s.inputBox}>
                <Ionicons name="bookmark-outline" size={18} color={T.muted} />
                <TextInput
                  style={s.input}
                  placeholder={
                    type === "Internship" ? "e.g. Frontend Developer Intern" :
                    type === "Project"    ? "e.g. AI Research Project" :
                                            "e.g. Data Science Bootcamp"
                  }
                  placeholderTextColor={T.placeholder} value={title}
                  onChangeText={setTitle} maxLength={80}
                />
              </View>
            </View>

            {/* ── Description ── */}
            <View style={s.section}>
              <Text style={s.sectionLabel}>Description <Text style={s.required}>*</Text></Text>
              <View style={[s.inputBox, s.textAreaBox]}>
                <TextInput
                  style={[s.input, s.textArea]}
                  placeholder="Describe the role, responsibilities, and what students will learn..."
                  placeholderTextColor={T.placeholder} value={description}
                  onChangeText={setDesc} multiline numberOfLines={5} textAlignVertical="top"
                />
              </View>
              <Text style={s.charCount}>{description.length} / 1000</Text>
            </View>

            {/* ── Stipend + Duration ── */}
            <View style={[s.section, s.rowSection]}>
              <View style={{ flex: 1 }}>
                <Text style={s.sectionLabel}>Stipend / Fee</Text>
                <View style={s.inputBox}>
                  <Ionicons name="cash-outline" size={18} color={T.muted} />
                  <TextInput style={s.input} placeholder="PKR 25,000/mo"
                    placeholderTextColor={T.placeholder} value={stipend} onChangeText={setStipend} />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.sectionLabel}>Duration</Text>
                <View style={s.inputBox}>
                  <Ionicons name="time-outline" size={18} color={T.muted} />
                  <TextInput style={s.input} placeholder="3 Months"
                    placeholderTextColor={T.placeholder} value={duration} onChangeText={setDuration} />
                </View>
              </View>
            </View>

            {/* ── Seats + Deadline ── */}
            <View style={[s.section, s.rowSection]}>
              <View style={{ flex: 1 }}>
                <Text style={s.sectionLabel}>Open Seats</Text>
                <View style={s.inputBox}>
                  <Ionicons name="people-outline" size={18} color={T.muted} />
                  <TextInput style={s.input} placeholder="5"
                    placeholderTextColor={T.placeholder} value={seats} onChangeText={setSeats}
                    keyboardType="numeric" />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.sectionLabel}>Deadline</Text>
                <View style={s.inputBox}>
                  <Ionicons name="calendar-outline" size={18} color={T.muted} />
                  <TextInput style={s.input} placeholder="30 Jun 2026"
                    placeholderTextColor={T.placeholder} value={deadline} onChangeText={setDeadline} />
                </View>
              </View>
            </View>

            {/* ── Mode ── */}
            <View style={s.section}>
              <Text style={s.sectionLabel}>Work Mode</Text>
              <View style={s.modeRow}>
                {(["Onsite", "Remote", "Hybrid"] as const).map((m) => {
                  const active = mode === m;
                  return (
                    <TouchableOpacity key={m}
                      style={[s.modeChip, active && s.modeChipActive]}
                      onPress={() => setMode(m)} activeOpacity={0.85}>
                      <Ionicons
                        name={m === "Onsite" ? "business-outline" : m === "Remote" ? "wifi-outline" : "swap-horizontal-outline"}
                        size={15} color={active ? T.white : T.sub} />
                      <Text style={[s.modeChipTxt, active && { color: T.white, fontWeight: "800" }]}>{m}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* ── Location ── */}
            <View style={s.section}>
              <Text style={s.sectionLabel}>Location</Text>
              <View style={s.inputBox}>
                <Ionicons name="location-outline" size={18} color={T.muted} />
                <TextInput style={s.input} placeholder="City, Building, or 'Remote'"
                  placeholderTextColor={T.placeholder} value={location} onChangeText={setLocation} />
              </View>
            </View>

            {/* ── Skills ── */}
            <View style={s.section}>
              <Text style={s.sectionLabel}>Required Skills</Text>
              <View style={s.inputBox}>
                <Ionicons name="sparkles-outline" size={18} color={T.muted} />
                <TextInput style={s.input} placeholder="Type a skill and press +"
                  placeholderTextColor={T.placeholder} value={skillInput}
                  onChangeText={setSkillInput} onSubmitEditing={() => addSkill(skillInput)}
                  returnKeyType="done" />
                <TouchableOpacity onPress={() => addSkill(skillInput)} style={s.addSkillBtn}>
                  <Ionicons name="add" size={18} color={T.white} />
                </TouchableOpacity>
              </View>

              {/* Suggestions */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled" style={{ marginTop: 10 }}>
                {SKILL_SUGGESTIONS.filter((sk) => !skills.includes(sk)).map((sk) => (
                  <TouchableOpacity key={sk} onPress={() => addSkill(sk)} style={s.suggestionChip}>
                    <Ionicons name="add-circle-outline" size={13} color={T.navy} />
                    <Text style={s.suggestionTxt}>{sk}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Selected */}
              {skills.length > 0 && (
                <View style={s.selectedSkillsRow}>
                  {skills.map((sk) => (
                    <View key={sk} style={s.selectedChip}>
                      <Text style={s.selectedChipTxt}>{sk}</Text>
                      <TouchableOpacity onPress={() => removeSkill(sk)}>
                        <Ionicons name="close-circle" size={16} color={T.navy} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* ── Tip card ── */}
            <View style={s.tipCard}>
              <View style={s.tipIcon}>
                <Ionicons name="bulb-outline" size={18} color={T.navy} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.tipTitle}>Tip</Text>
                <Text style={s.tipBody}>
                  A clear title and 2-3 sentence description usually doubles the number of applicants.
                </Text>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* ── Sticky publish bar ── */}
      <View style={s.publishBar}>
        <TouchableOpacity
          style={[s.publishBtn, (!title.trim() || !description.trim() || loading) && s.publishBtnDisabled]}
          onPress={handlePost}
          activeOpacity={0.88}
          disabled={loading || !title.trim() || !description.trim()}>
          {loading ? (
            <>
              <ActivityIndicator color={T.white} />
              <Text style={s.publishBtnTxt}>Publishing…</Text>
            </>
          ) : (
            <>
              <Ionicons name="paper-plane" size={18} color={T.white} />
              <Text style={s.publishBtnTxt}>Publish Post</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  // ── Header ──
  header: {
    backgroundColor: T.header,
    paddingTop: Platform.OS === "ios" ? 56 : 42,
    paddingHorizontal: 18, paddingBottom: 22,
    flexDirection: "row", alignItems: "center",
    borderBottomLeftRadius: 22, borderBottomRightRadius: 22,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: T.white },
  headerSub:   { fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 },

  // ── Sections ──
  section: { paddingHorizontal: 16, paddingTop: 16 },
  rowSection: { flexDirection: "row", gap: 10 },
  sectionLabel: { fontSize: 12, fontWeight: "800", color: T.text, marginBottom: 8, letterSpacing: 0.3, textTransform: "uppercase" },
  required: { color: "#DC2626" },

  // ── Type tiles ──
  typeRow: { flexDirection: "row", gap: 10 },
  typeTile: {
    flex: 1, backgroundColor: T.card, borderRadius: 16,
    padding: 12, alignItems: "center",
    borderWidth: 1.5, borderColor: T.border,
  },
  typeTileActive: { borderColor: T.navy, backgroundColor: "#F5F9FB" },
  typeTileIcon: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: T.iconBg,
    justifyContent: "center", alignItems: "center",
    marginBottom: 8,
  },
  typeTileLabel: { fontSize: 12, fontWeight: "700", color: T.text, textAlign: "center" },
  typeTileDesc:  { fontSize: 10, color: T.muted, textAlign: "center", marginTop: 3, lineHeight: 13 },

  // ── Banner ──
  posterPreviewWrap: { borderRadius: 16, overflow: "hidden", position: "relative" },
  posterPreview:     { width: "100%", height: 170, borderRadius: 16 },
  posterRemove: {
    position: "absolute", top: 8, right: 8,
    backgroundColor: "rgba(0,0,0,0.55)", borderRadius: 14,
  },
  posterPlaceholder: {
    height: 150, borderRadius: 16,
    backgroundColor: T.card,
    justifyContent: "center", alignItems: "center",
    borderWidth: 1.5, borderColor: T.border, borderStyle: "dashed",
  },
  posterIconCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: T.iconBg,
    justifyContent: "center", alignItems: "center",
    marginBottom: 8,
  },
  posterPlaceholderTxt: { fontSize: 13, fontWeight: "700", color: T.text },
  posterPlaceholderSub: { fontSize: 11, color: T.muted, marginTop: 3 },

  // ── Inputs ──
  inputBox: {
    backgroundColor: T.inputBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 48,
    borderWidth: 1.5, borderColor: T.border,
    flexDirection: "row", alignItems: "center", gap: 10,
  },
  textAreaBox: { paddingTop: 10, paddingBottom: 10, alignItems: "flex-start" },
  input: { flex: 1, fontSize: 14, color: T.text, paddingVertical: 0 },
  textArea: { minHeight: 100, textAlignVertical: "top" },
  charCount: { fontSize: 11, color: T.muted, alignSelf: "flex-end", marginTop: 4 },

  // ── Mode ──
  modeRow: { flexDirection: "row", gap: 8 },
  modeChip: {
    flex: 1, paddingVertical: 11, borderRadius: 12,
    borderWidth: 1.5, borderColor: T.border,
    backgroundColor: T.card,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
  },
  modeChipActive: { borderColor: T.navy, backgroundColor: T.navy },
  modeChipTxt: { fontSize: 13, fontWeight: "700", color: T.sub },

  // ── Skills ──
  addSkillBtn: {
    width: 32, height: 32, borderRadius: 9,
    backgroundColor: T.navy,
    justifyContent: "center", alignItems: "center",
  },
  suggestionChip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: T.chipBg,
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6,
    marginRight: 8, borderWidth: 1, borderColor: T.border,
  },
  suggestionTxt: { fontSize: 11, fontWeight: "700", color: T.navy },
  selectedSkillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  selectedChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: T.navy,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
  },
  selectedChipTxt: { fontSize: 12, fontWeight: "700", color: T.white },

  // ── Tip ──
  tipCard: {
    flexDirection: "row", alignItems: "flex-start", gap: 12,
    marginHorizontal: 16, marginTop: 18, padding: 14,
    backgroundColor: "#FFF8E1", borderRadius: 14,
    borderWidth: 1, borderColor: "#FCE8A6",
  },
  tipIcon: {
    width: 32, height: 32, borderRadius: 9,
    backgroundColor: "#FDF1C2",
    justifyContent: "center", alignItems: "center",
  },
  tipTitle: { fontSize: 12, fontWeight: "800", color: "#7A5D00", marginBottom: 2 },
  tipBody:  { fontSize: 12, color: "#8A6A00", lineHeight: 17 },

  // ── Sticky publish bar ──
  publishBar: {
    position: "absolute", left: 0, right: 0, bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 30 : 14,
    backgroundColor: T.card,
    borderTopWidth: 1, borderTopColor: T.border,
  },
  publishBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
    backgroundColor: T.navy,
    paddingVertical: 16, borderRadius: 16,
    shadowColor: T.navy, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 10, elevation: 4,
  },
  publishBtnDisabled: { backgroundColor: T.muted, shadowOpacity: 0 },
  publishBtnTxt: { fontSize: 15, fontWeight: "800", color: T.white },
});
