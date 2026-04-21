import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import {
  Alert, Animated, Image, KeyboardAvoidingView, Platform,
  ScrollView, StatusBar, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from "react-native";
import { C, useUser } from "./shared";

// ── Color Theme (CollaXion) ───────────────────────────────────
const T = {
  bg:       "#F0F4F8",
  header:   "#0D2E3E",
  card:     "#FFFFFF",
  border:   "#E2E8F0",
  navy:     "#0D2E3E",
  teal:     "#1A3C4E",
  text:     "#0D2E3E",
  sub:      "#5A7A8A",
  muted:    "#94A3B8",
  white:    "#FFFFFF",
  green:    "#059669",
  greenDark:"#047857",
  inputBg:  "#F8FAFC",
  placeholder: "#94A3B8",
};

type PostType = "Internship" | "Project" | "Workshop";

const POST_TYPES: { label: PostType; icon: string; color: string; bg: string; desc: string }[] = [
  { label: "Internship", icon: "briefcase", color: "#0D2E3E", bg: "#EFF6FF", desc: "Paid/unpaid work experience" },
  { label: "Project",    icon: "flask",     color: "#0D2E3E", bg: "#FAF5FF", desc: "Research or development project" },
  { label: "Workshop",   icon: "school",    color: "#0D2E3E", bg: "#FFF7ED", desc: "Training or bootcamp event" },
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
  const [step, setStep]             = useState<1 | 2>(1);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85, aspect: [16, 9],
    });
    if (!res.canceled) setPoster(res.assets[0].uri);
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
        poster: poster || null,
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

  const typeConfig = POST_TYPES.find((p) => p.label === type)!;

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={T.header} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={T.white} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.headerTitle}>Post Opportunity</Text>
            <Text style={styles.headerSub}>Reach hundreds of students</Text>
          </View>
          {step === 2 && (
            <TouchableOpacity onPress={() => setStep(1)} style={styles.stepBackBtn}>
              <Text style={styles.stepBackTxt}>← Details</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Step indicator */}
        <View style={styles.stepRow}>
          {["Type & Info", "Preview & Post"].map((label, i) => (
            <View key={i} style={styles.stepItem}>
              <View style={[styles.stepDot,
                step > i ? styles.stepDotDone :
                i === step - 1 ? styles.stepDotActive :
                styles.stepDotInactive]}>
                {step > i + 1
                  ? <Ionicons name="checkmark" size={12} color={T.white} />
                  : <Text style={styles.stepDotTxt}>{i + 1}</Text>}
              </View>
              <Text style={[styles.stepLabel, step === i + 1 && { color: T.white }]}>{label}</Text>
              {i < 1 && <View style={[styles.stepLine, step > 1 && styles.stepLineDone]} />}
            </View>
          ))}
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>

          {step === 1 ? (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

              {/* Type Selector */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Opportunity Type</Text>
                <View style={styles.typeRow}>
                  {POST_TYPES.map((pt) => (
                    <TouchableOpacity key={pt.label}
                      style={[styles.typeTile, type === pt.label && { borderColor: pt.color, borderWidth: 2 }]}
                      onPress={() => setType(pt.label)} activeOpacity={0.85}>
                      <View style={[styles.typeTileIcon, { backgroundColor: type === pt.label ? pt.color : "#F1F5F9" }]}>
                        <Ionicons name={pt.icon as any} size={22}
                          color={type === pt.label ? T.white : T.muted} />
                      </View>
                      <Text style={[styles.typeTileLabel, type === pt.label && { color: pt.color, fontWeight: "800" }]}>
                        {pt.label}
                      </Text>
                      <Text style={styles.typeTileDesc}>{pt.desc}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Banner */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Banner Image (Optional)</Text>
                <TouchableOpacity onPress={pickImage} activeOpacity={0.88}>
                  {poster ? (
                    <View style={styles.posterPreviewWrap}>
                      <Image source={{ uri: poster }} style={styles.posterPreview} />
                      <TouchableOpacity style={styles.posterRemove} onPress={() => setPoster(null)}>
                        <Ionicons name="close-circle" size={22} color={T.white} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={[styles.posterPlaceholder, { backgroundColor: typeConfig.color }]}>
                      <Ionicons name="image-outline" size={32} color="rgba(255,255,255,0.6)" />
                      <Text style={styles.posterPlaceholderTxt}>Tap to upload banner</Text>
                      <Text style={styles.posterPlaceholderSub}>16:9 recommended</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Title */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Title *</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    style={styles.input}
                    placeholder={`e.g. ${type === "Internship" ? "Frontend Developer Intern" : type === "Project" ? "AI Research Project" : "Data Science Bootcamp"}`}
                    placeholderTextColor={T.placeholder} value={title}
                    onChangeText={setTitle} maxLength={80}
                  />
                </View>
              </View>

              {/* Description */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Description *</Text>
                <View style={[styles.inputBox, { padding: 0 }]}>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe the role, responsibilities, and what students will learn..."
                    placeholderTextColor={T.placeholder} value={description}
                    onChangeText={setDesc} multiline numberOfLines={5} textAlignVertical="top"
                  />
                </View>
              </View>

              {/* Stipend + Duration */}
              <View style={[styles.section, { flexDirection: "row", gap: 12 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionLabel}>Stipend / Fee</Text>
                  <View style={styles.inputBox}>
                    <TextInput style={styles.input} placeholder="e.g. PKR 25,000/mo"
                      placeholderTextColor={T.placeholder} value={stipend} onChangeText={setStipend} />
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionLabel}>Duration</Text>
                  <View style={styles.inputBox}>
                    <TextInput style={styles.input} placeholder="e.g. 3 Months"
                      placeholderTextColor={T.placeholder} value={duration} onChangeText={setDuration} />
                  </View>
                </View>
              </View>

              {/* Seats + Deadline */}
              <View style={[styles.section, { flexDirection: "row", gap: 12 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionLabel}>Open Seats</Text>
                  <View style={styles.inputBox}>
                    <TextInput style={styles.input} placeholder="e.g. 5"
                      placeholderTextColor={T.placeholder} value={seats} onChangeText={setSeats} keyboardType="numeric" />
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionLabel}>Application Deadline</Text>
                  <View style={styles.inputBox}>
                    <TextInput style={styles.input} placeholder="e.g. 30 Jun 2025"
                      placeholderTextColor={T.placeholder} value={deadline} onChangeText={setDeadline} />
                  </View>
                </View>
              </View>

              {/* Mode */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Work Mode</Text>
                <View style={styles.modeRow}>
                  {(["Onsite", "Remote", "Hybrid"] as const).map((m) => (
                    <TouchableOpacity key={m}
                      style={[styles.modeChip, mode === m && { borderColor: T.navy, backgroundColor: "#EFF6FF" }]}
                      onPress={() => setMode(m)}>
                      <Text style={[styles.modeChipTxt, mode === m && { color: T.navy, fontWeight: "700" }]}>{m}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Location */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Location</Text>
                <View style={[styles.inputBox, { flexDirection: "row", alignItems: "center", gap: 8 }]}>
                  <Ionicons name="location-outline" size={18} color={T.placeholder} />
                  <TextInput style={[styles.input, { flex: 1 }]} placeholder="City, Building, or 'Remote'"
                    placeholderTextColor={T.placeholder} value={location} onChangeText={setLocation} />
                </View>
              </View>

              {/* Skills */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Required Skills</Text>
                <View style={[styles.inputBox, { flexDirection: "row", alignItems: "center", gap: 8 }]}>
                  <TextInput style={[styles.input, { flex: 1 }]} placeholder="Type a skill and press +"
                    placeholderTextColor={T.placeholder} value={skillInput}
                    onChangeText={setSkillInput} onSubmitEditing={() => addSkill(skillInput)} />
                  <TouchableOpacity onPress={() => addSkill(skillInput)} style={styles.addSkillBtn}>
                    <Ionicons name="add" size={20} color={T.white} />
                  </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                  {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s)).map((s) => (
                    <TouchableOpacity key={s} onPress={() => addSkill(s)} style={styles.suggestionChip}>
                      <Text style={styles.suggestionTxt}>+ {s}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                {skills.length > 0 && (
                  <View style={styles.selectedSkillsRow}>
                    {skills.map((s) => (
                      <View key={s} style={styles.selectedChip}>
                        <Text style={styles.selectedChipTxt}>{s}</Text>
                        <TouchableOpacity onPress={() => removeSkill(s)}>
                          <Ionicons name="close-circle" size={16} color={T.navy} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* Next */}
              <TouchableOpacity style={styles.nextBtn}
                onPress={() => {
                  if (!title.trim() || !description.trim()) {
                    Alert.alert("Required", "Fill in title and description."); return;
                  }
                  setStep(2);
                }} activeOpacity={0.88}>
                <View style={styles.nextBtnInner}>
                  <Text style={styles.nextBtnTxt}>Preview Post</Text>
                  <Ionicons name="arrow-forward" size={18} color={T.white} />
                </View>
              </TouchableOpacity>
            </ScrollView>

          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
              <View style={styles.previewLabel}>
                <Ionicons name="eye-outline" size={16} color={T.sub} />
                <Text style={styles.previewLabelTxt}>How students will see your post</Text>
              </View>

              <View style={styles.previewCard}>
                <View style={styles.postHeader}>
                  <View style={styles.postAvatarWrap}>
                    {user?.logo
                      ? <Image source={{ uri: user.logo }} style={styles.postAvatar} />
                      : <Text style={styles.postAvatarTxt}>
                          {user?.name?.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase() || "CX"}
                        </Text>}
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.previewOrgName}>{user?.name || "Your Company"}</Text>
                    <Text style={styles.previewTime}>Just now</Text>
                  </View>
                  <View style={[styles.typeBadge, {
                    backgroundColor: type === "Internship" ? "#EFF6FF" : type === "Project" ? "#FAF5FF" : "#FFF7ED"
                  }]}>
                    <View style={[styles.typeDot, {
                      backgroundColor: type === "Internship" ? "#1D4ED8" : type === "Project" ? "#7C3AED" : "#C2410C"
                    }]} />
                    <Text style={[styles.typeBadgeTxt, {
                      color: type === "Internship" ? "#1D4ED8" : type === "Project" ? "#7C3AED" : "#C2410C"
                    }]}>{type}</Text>
                  </View>
                </View>

                {poster ? (
                  <Image source={{ uri: poster }} style={styles.previewBanner} />
                ) : (
                  <View style={[styles.previewBannerFlat, { backgroundColor: typeConfig.color }]}>
                    <Ionicons name={typeConfig.icon as any} size={40} color="rgba(255,255,255,0.25)" style={{ marginBottom: 10 }} />
                    <Text style={styles.bannerTitle}>{title || "Your Post Title"}</Text>
                    <View style={styles.bannerMetaRow}>
                      {duration ? <View style={styles.bannerMeta}>
                        <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.7)" />
                        <Text style={styles.bannerMetaTxt}>{duration}</Text></View> : null}
                      {stipend ? <View style={styles.bannerMeta}>
                        <Ionicons name="cash-outline" size={12} color="rgba(255,255,255,0.7)" />
                        <Text style={styles.bannerMetaTxt}>{stipend}</Text></View> : null}
                    </View>
                  </View>
                )}

                <View style={styles.postBody}>
                  <Text style={styles.previewTitle}>{title || "Your Post Title"}</Text>
                  <Text style={styles.previewDesc}>{description || "Your description..."}</Text>
                  <View style={styles.metaRow}>
                    {mode ? <View style={styles.metaChip}>
                      <Ionicons name="location-outline" size={12} color={T.navy} />
                      <Text style={styles.metaChipTxt}>{mode}</Text></View> : null}
                    {seats ? <View style={styles.metaChip}>
                      <Ionicons name="people-outline" size={12} color={T.navy} />
                      <Text style={styles.metaChipTxt}>{seats} seats</Text></View> : null}
                    {deadline ? <View style={styles.metaChip}>
                      <Ionicons name="calendar-outline" size={12} color={T.navy} />
                      <Text style={styles.metaChipTxt}>Due {deadline}</Text></View> : null}
                  </View>
                  {skills.length > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                      {skills.map((sk) => (
                        <View key={sk} style={styles.skillChip}>
                          <Text style={styles.skillChipTxt}>{sk}</Text>
                        </View>
                      ))}
                    </ScrollView>
                  )}
                  <View style={styles.postFooter}>
                    <View style={styles.postFooterLeft}>
                      <Ionicons name="people-outline" size={15} color={T.sub} />
                      <Text style={styles.postFooterTxt}>0 applicants</Text>
                    </View>
                    <View style={styles.applyChip}>
                      <Text style={styles.applyChipTxt}>Apply Now</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Publish Button */}
              <TouchableOpacity
                style={[styles.nextBtn, { marginTop: 8 }]}
                onPress={handlePost} activeOpacity={0.88} disabled={loading}>
                <View style={[styles.nextBtnInner, {
                  backgroundColor: loading ? T.muted : T.green,
                }]}>
                  <Ionicons name="paper-plane" size={18} color={T.white} />
                  <Text style={styles.nextBtnTxt}>{loading ? "Publishing..." : "Publish Post"}</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: T.header,
    paddingTop: Platform.OS === "ios" ? 58 : 46,
    paddingHorizontal: 20, paddingBottom: 24,
  },
  headerRow:  { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backBtn:    { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.1)", justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: T.white },
  headerSub:   { fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 },
  stepBackBtn: { backgroundColor: "rgba(255,255,255,0.12)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  stepBackTxt: { fontSize: 12, color: T.white, fontWeight: "600" },
  stepRow: { flexDirection: "row", alignItems: "center" },
  stepItem: { flexDirection: "row", alignItems: "center", flex: 1 },
  stepDot: { width: 26, height: 26, borderRadius: 13, justifyContent: "center", alignItems: "center", marginRight: 8 },
  stepDotActive:   { backgroundColor: "rgba(255,255,255,0.3)" },
  stepDotDone:     { backgroundColor: "#059669" },
  stepDotInactive: { backgroundColor: "rgba(255,255,255,0.1)" },
  stepDotTxt:  { fontSize: 12, fontWeight: "800", color: T.white },
  stepLabel:   { fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: "600", flex: 1 },
  stepLine:    { height: 2, flex: 0.4, backgroundColor: "rgba(255,255,255,0.15)", marginHorizontal: 8, borderRadius: 1 },
  stepLineDone:{ backgroundColor: "#059669" },

  section: { paddingHorizontal: 16, paddingTop: 18 },
  sectionLabel: { fontSize: 13, fontWeight: "700", color: T.text, marginBottom: 10 },

  typeRow: { flexDirection: "row", gap: 10 },
  typeTile: { flex: 1, backgroundColor: T.card, borderRadius: 16, padding: 14, alignItems: "center", borderWidth: 1.5, borderColor: T.border, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  typeTileIcon:  { width: 48, height: 48, borderRadius: 14, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  typeTileLabel: { fontSize: 12, fontWeight: "700", color: T.text, textAlign: "center" },
  typeTileDesc:  { fontSize: 10, color: T.muted, textAlign: "center", marginTop: 3 },

  posterPreviewWrap: { borderRadius: 16, overflow: "hidden", position: "relative" },
  posterPreview:     { width: "100%", height: 180, borderRadius: 16 },
  posterRemove: { position: "absolute", top: 8, right: 8, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 12 },
  posterPlaceholder: { height: 160, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  posterPlaceholderTxt: { fontSize: 14, fontWeight: "700", color: "rgba(255,255,255,0.8)", marginTop: 8 },
  posterPlaceholderSub: { fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4 },

  inputBox: { backgroundColor: T.card, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1.5, borderColor: T.border, shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  input: { fontSize: 14, color: T.text, fontWeight: "500" },
  textArea: { height: 110, paddingTop: 12 },

  modeRow: { flexDirection: "row", gap: 10 },
  modeChip: { flex: 1, paddingVertical: 10, borderRadius: 14, borderWidth: 1.5, borderColor: T.border, backgroundColor: T.card, alignItems: "center" },
  modeChipTxt: { fontSize: 13, fontWeight: "600", color: T.sub },

  addSkillBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: T.navy, justifyContent: "center", alignItems: "center" },
  suggestionChip: { backgroundColor: "#F1F5F9", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, borderWidth: 1, borderColor: T.border },
  suggestionTxt: { fontSize: 11, fontWeight: "600", color: T.sub },
  selectedSkillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  selectedChip: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#EFF6FF", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "#BFDBFE" },
  selectedChipTxt: { fontSize: 12, fontWeight: "700", color: T.navy },

  nextBtn: { marginHorizontal: 16, marginTop: 24, borderRadius: 18, overflow: "hidden" },
  nextBtnInner: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 17, backgroundColor: T.navy, borderRadius: 18 },
  nextBtnTxt: { fontSize: 16, fontWeight: "800", color: T.white },

  previewLabel: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, paddingVertical: 14 },
  previewLabelTxt: { fontSize: 13, color: T.sub, fontWeight: "600" },
  previewCard: { marginHorizontal: 16, backgroundColor: T.card, borderRadius: 20, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 14, elevation: 4 },
  postHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14 },
  postAvatarWrap: { width: 42, height: 42, borderRadius: 21, backgroundColor: T.navy, justifyContent: "center", alignItems: "center", overflow: "hidden" },
  postAvatar:    { width: 42, height: 42, borderRadius: 21 },
  postAvatarTxt: { fontSize: 15, fontWeight: "900", color: T.white },
  previewOrgName:{ fontSize: 13, fontWeight: "700", color: T.text },
  previewTime:   { fontSize: 11, color: T.muted, marginTop: 1 },
  typeBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  typeDot:     { width: 6, height: 6, borderRadius: 3 },
  typeBadgeTxt:{ fontSize: 11, fontWeight: "700" },
  previewBanner:    { width: "100%", height: 180 },
  previewBannerFlat:{ height: 180, justifyContent: "flex-end", paddingHorizontal: 20, paddingBottom: 18 },
  bannerTitle:    { fontSize: 20, fontWeight: "900", color: T.white, marginBottom: 8 },
  bannerMetaRow:  { flexDirection: "row", gap: 16 },
  bannerMeta:     { flexDirection: "row", alignItems: "center", gap: 4 },
  bannerMetaTxt:  { fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: "600" },
  postBody:  { padding: 16 },
  previewTitle:{ fontSize: 16, fontWeight: "800", color: T.text },
  previewDesc: { fontSize: 13, color: T.sub, marginTop: 6, lineHeight: 20 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  metaChip: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#EFF6FF", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  metaChipTxt: { fontSize: 11, fontWeight: "600", color: T.navy },
  skillChip: { backgroundColor: "#EFF6FF", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginRight: 8, borderWidth: 1, borderColor: "#BFDBFE" },
  skillChipTxt:  { fontSize: 11, fontWeight: "700", color: T.navy },
  postFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderColor: "#F1F5F9" },
  postFooterLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  postFooterTxt:  { fontSize: 13, color: T.sub, fontWeight: "600" },
  applyChip: { backgroundColor: T.navy, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  applyChipTxt: { fontSize: 12, color: T.white, fontWeight: "700" },
});