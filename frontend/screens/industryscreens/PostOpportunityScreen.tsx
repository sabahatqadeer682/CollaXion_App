/**
 * PostOpportunityScreen.tsx
 * Industries can post Internships, Projects, or Workshops.
 * Posts appear on the dashboard feed like social media posts.
 */

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Alert, Animated, Image, KeyboardAvoidingView, Platform,
  ScrollView, StatusBar, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from "react-native";
import { C, useUser } from "./shared";

type PostType = "Internship" | "Project" | "Workshop";

const POST_TYPES: { label: PostType; icon: string; grad: readonly [string, string]; desc: string }[] = [
  { label: "Internship", icon: "briefcase",  grad: ["#0066CC", "#004999"] as const, desc: "Paid/unpaid work experience" },
  { label: "Project",    icon: "flask",       grad: ["#6A1B9A", "#4A148C"] as const, desc: "Research or development project" },
  { label: "Workshop",   icon: "school",      grad: ["#E65100", "#BF360C"] as const, desc: "Training or bootcamp event" },
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
      Alert.alert("Required", "Please fill title and description.");
      return;
    }
    setLoading(true);
    try {
      // Replace with real API endpoint
      // await ax().post("/api/opportunities", { type, title, description, skills, stipend, duration, seats, deadline, location, mode, poster });
      Alert.alert("Posted! 🎉", "Your opportunity is live on the feed.", [
        { text: "OK", onPress: () => nav.goBack() },
      ]);
    } catch (e) {
      Alert.alert("Error", "Failed to post. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const typeConfig = POST_TYPES.find((p) => p.label === type)!;

  return (
    <View style={{ flex: 1, backgroundColor: "#F0F4F8" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1628" />

      {/* Header */}
      <LinearGradient colors={["#0A1628", "#0D2137"]} style={styles.header}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.headerDecor} />
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => nav.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
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
              <View style={[styles.stepDot, step > i ? styles.stepDotDone : i === step - 1 ? styles.stepDotActive : styles.stepDotInactive]}>
                {step > i + 1
                  ? <Ionicons name="checkmark" size={12} color="#fff" />
                  : <Text style={styles.stepDotTxt}>{i + 1}</Text>}
              </View>
              <Text style={[styles.stepLabel, step === i + 1 && { color: "#fff" }]}>{label}</Text>
              {i < 1 && <View style={[styles.stepLine, step > 1 && styles.stepLineDone]} />}
            </View>
          ))}
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>

          {step === 1 ? (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

              {/* Type Selector */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Opportunity Type</Text>
                <View style={styles.typeRow}>
                  {POST_TYPES.map((pt) => (
                    <TouchableOpacity key={pt.label}
                      style={[styles.typeTile, type === pt.label && styles.typeTileActive]}
                      onPress={() => setType(pt.label)} activeOpacity={0.85}>
                      <LinearGradient
                        colors={type === pt.label ? pt.grad : ["#F1F5F9", "#E2E8F0"]}
                        style={styles.typeTileGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                        <Ionicons name={pt.icon as any} size={22}
                          color={type === pt.label ? "#fff" : "#64748B"} />
                      </LinearGradient>
                      <Text style={[styles.typeTileLabel, type === pt.label && { color: "#0066CC", fontWeight: "800" }]}>
                        {pt.label}
                      </Text>
                      <Text style={styles.typeTileDesc}>{pt.desc}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Poster / Banner */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Banner Image (Optional)</Text>
                <TouchableOpacity onPress={pickImage} activeOpacity={0.88}>
                  {poster ? (
                    <View style={styles.posterPreviewWrap}>
                      <Image source={{ uri: poster }} style={styles.posterPreview} />
                      <TouchableOpacity style={styles.posterRemove} onPress={() => setPoster(null)}>
                        <Ionicons name="close-circle" size={22} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <LinearGradient colors={typeConfig.grad} style={styles.posterPlaceholder}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                      <Ionicons name="image-outline" size={32} color="rgba(255,255,255,0.6)" />
                      <Text style={styles.posterPlaceholderTxt}>Tap to upload banner</Text>
                      <Text style={styles.posterPlaceholderSub}>16:9 recommended</Text>
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              </View>

              {/* Title */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Title *</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    style={styles.input} placeholder={`e.g. ${type === "Internship" ? "Frontend Developer Intern" : type === "Project" ? "AI Research Project" : "Data Science Bootcamp"}`}
                    placeholderTextColor="#94A3B8" value={title}
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
                    placeholderTextColor="#94A3B8" value={description}
                    onChangeText={setDesc} multiline numberOfLines={5}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              {/* Row: Stipend + Duration */}
              <View style={[styles.section, { flexDirection: "row", gap: 12 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionLabel}>Stipend / Fee</Text>
                  <View style={styles.inputBox}>
                    <TextInput
                      style={styles.input} placeholder="e.g. PKR 25,000/mo"
                      placeholderTextColor="#94A3B8" value={stipend} onChangeText={setStipend}
                    />
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionLabel}>Duration</Text>
                  <View style={styles.inputBox}>
                    <TextInput
                      style={styles.input} placeholder="e.g. 3 Months"
                      placeholderTextColor="#94A3B8" value={duration} onChangeText={setDuration}
                    />
                  </View>
                </View>
              </View>

              {/* Row: Seats + Deadline */}
              <View style={[styles.section, { flexDirection: "row", gap: 12 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionLabel}>Open Seats</Text>
                  <View style={styles.inputBox}>
                    <TextInput
                      style={styles.input} placeholder="e.g. 5"
                      placeholderTextColor="#94A3B8" value={seats} onChangeText={setSeats}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionLabel}>Application Deadline</Text>
                  <View style={styles.inputBox}>
                    <TextInput
                      style={styles.input} placeholder="e.g. 30 Jun 2025"
                      placeholderTextColor="#94A3B8" value={deadline} onChangeText={setDeadline}
                    />
                  </View>
                </View>
              </View>

              {/* Mode */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Work Mode</Text>
                <View style={styles.modeRow}>
                  {(["Onsite", "Remote", "Hybrid"] as const).map((m) => (
                    <TouchableOpacity key={m} style={[styles.modeChip, mode === m && styles.modeChipActive]}
                      onPress={() => setMode(m)}>
                      <Text style={[styles.modeChipTxt, mode === m && styles.modeChipTxtActive]}>{m}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Location */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Location</Text>
                <View style={[styles.inputBox, { flexDirection: "row", alignItems: "center", gap: 8 }]}>
                  <Ionicons name="location-outline" size={18} color="#94A3B8" />
                  <TextInput
                    style={[styles.input, { flex: 1 }]} placeholder="City, Building, or 'Remote'"
                    placeholderTextColor="#94A3B8" value={location} onChangeText={setLocation}
                  />
                </View>
              </View>

              {/* Skills */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Required Skills</Text>
                <View style={[styles.inputBox, { flexDirection: "row", alignItems: "center", gap: 8 }]}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]} placeholder="Type a skill and press +"
                    placeholderTextColor="#94A3B8" value={skillInput}
                    onChangeText={setSkillInput}
                    onSubmitEditing={() => addSkill(skillInput)}
                  />
                  <TouchableOpacity onPress={() => addSkill(skillInput)} style={styles.addSkillBtn}>
                    <Ionicons name="add" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>

                {/* Skill Suggestions */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                  {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s)).map((s) => (
                    <TouchableOpacity key={s} onPress={() => addSkill(s)} style={styles.suggestionChip}>
                      <Text style={styles.suggestionTxt}>+ {s}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Selected Skills */}
                {skills.length > 0 && (
                  <View style={styles.selectedSkillsRow}>
                    {skills.map((s) => (
                      <View key={s} style={styles.selectedChip}>
                        <Text style={styles.selectedChipTxt}>{s}</Text>
                        <TouchableOpacity onPress={() => removeSkill(s)}>
                          <Ionicons name="close-circle" size={16} color="#1D4ED8" />
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
                    Alert.alert("Required", "Fill in title and description.");
                    return;
                  }
                  setStep(2);
                }} activeOpacity={0.88}>
                <LinearGradient colors={["#0066CC", "#004999"]} style={styles.nextBtnGrad}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.nextBtnTxt}>Preview Post</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>

            </ScrollView>
          ) : (
            /* ── Step 2: Preview ── */
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
              <View style={styles.previewLabel}>
                <Ionicons name="eye-outline" size={16} color="#64748B" />
                <Text style={styles.previewLabelTxt}>How students will see your post</Text>
              </View>

              {/* Preview Card */}
              <View style={styles.previewCard}>
                {/* Header */}
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
                    backgroundColor: type === "Internship" ? "#E8F4FF" : type === "Project" ? "#F3E5F5" : "#FFF3E0"
                  }]}>
                    <View style={[styles.typeDot, {
                      backgroundColor: type === "Internship" ? "#2196F3" : type === "Project" ? "#9C27B0" : "#FF9800"
                    }]} />
                    <Text style={[styles.typeBadgeTxt, {
                      color: type === "Internship" ? "#0066CC" : type === "Project" ? "#6A1B9A" : "#E65100"
                    }]}>{type}</Text>
                  </View>
                </View>

                {/* Banner */}
                {poster ? (
                  <Image source={{ uri: poster }} style={styles.previewBanner} />
                ) : (
                  <LinearGradient colors={typeConfig.grad} style={styles.previewBannerGrad}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <View style={styles.bannerDecorCircle} />
                    <Ionicons name={typeConfig.icon as any} size={40}
                      color="rgba(255,255,255,0.25)" style={{ marginBottom: 10 }} />
                    <Text style={styles.bannerTitle}>{title || "Your Post Title"}</Text>
                    <View style={styles.bannerMetaRow}>
                      {duration ? (
                        <View style={styles.bannerMeta}>
                          <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.7)" />
                          <Text style={styles.bannerMetaTxt}>{duration}</Text>
                        </View>
                      ) : null}
                      {stipend ? (
                        <View style={styles.bannerMeta}>
                          <Ionicons name="cash-outline" size={12} color="rgba(255,255,255,0.7)" />
                          <Text style={styles.bannerMetaTxt}>{stipend}</Text>
                        </View>
                      ) : null}
                    </View>
                  </LinearGradient>
                )}

                <View style={styles.postBody}>
                  <Text style={styles.previewTitle}>{title || "Your Post Title"}</Text>
                  <Text style={styles.previewDesc}>{description || "Your description..."}</Text>

                  {/* Meta chips */}
                  <View style={styles.metaRow}>
                    {mode ? (
                      <View style={styles.metaChip}>
                        <Ionicons name="location-outline" size={12} color="#0066CC" />
                        <Text style={styles.metaChipTxt}>{mode}</Text>
                      </View>
                    ) : null}
                    {seats ? (
                      <View style={styles.metaChip}>
                        <Ionicons name="people-outline" size={12} color="#0066CC" />
                        <Text style={styles.metaChipTxt}>{seats} seats</Text>
                      </View>
                    ) : null}
                    {deadline ? (
                      <View style={styles.metaChip}>
                        <Ionicons name="calendar-outline" size={12} color="#0066CC" />
                        <Text style={styles.metaChipTxt}>Due {deadline}</Text>
                      </View>
                    ) : null}
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
                      <Ionicons name="people-outline" size={15} color="#64748B" />
                      <Text style={styles.postFooterTxt}>0 applicants</Text>
                    </View>
                    <View style={styles.applyChip}>
                      <Text style={styles.applyChipTxt}>Apply Now</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Post Button */}
              <TouchableOpacity
                style={[styles.nextBtn, { marginTop: 8 }]}
                onPress={handlePost} activeOpacity={0.88} disabled={loading}>
                <LinearGradient
                  colors={loading ? ["#94A3B8", "#64748B"] : ["#059669", "#047857"]}
                  style={styles.nextBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Ionicons name="paper-plane" size={18} color="#fff" />
                  <Text style={styles.nextBtnTxt}>{loading ? "Publishing..." : "Publish Post"}</Text>
                </LinearGradient>
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
    paddingTop: Platform.OS === "ios" ? 58 : 46,
    paddingHorizontal: 20, paddingBottom: 24, overflow: "hidden",
  },
  headerDecor: {
    position: "absolute", width: 200, height: 200, borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.03)", top: -80, right: -60,
  },
  headerRow:  { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backBtn:    {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#fff" },
  headerSub:   { fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 },
  stepBackBtn: {
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  stepBackTxt: { fontSize: 12, color: "#fff", fontWeight: "600" },
  stepRow: { flexDirection: "row", alignItems: "center" },
  stepItem: { flexDirection: "row", alignItems: "center", flex: 1 },
  stepDot: {
    width: 26, height: 26, borderRadius: 13,
    justifyContent: "center", alignItems: "center", marginRight: 8,
  },
  stepDotActive:   { backgroundColor: "#0066CC" },
  stepDotDone:     { backgroundColor: "#059669" },
  stepDotInactive: { backgroundColor: "rgba(255,255,255,0.15)" },
  stepDotTxt:  { fontSize: 12, fontWeight: "800", color: "#fff" },
  stepLabel:   { fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: "600", flex: 1 },
  stepLine:    { height: 2, flex: 0.4, backgroundColor: "rgba(255,255,255,0.15)", marginHorizontal: 8, borderRadius: 1 },
  stepLineDone:{ backgroundColor: "#059669" },

  section: { paddingHorizontal: 16, paddingTop: 18 },
  sectionLabel: { fontSize: 13, fontWeight: "700", color: "#334155", marginBottom: 10 },

  typeRow: { flexDirection: "row", gap: 10 },
  typeTile: {
    flex: 1, backgroundColor: "#fff", borderRadius: 16, padding: 14, alignItems: "center",
    borderWidth: 2, borderColor: "#E2E8F0",
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  typeTileActive: { borderColor: "#0066CC" },
  typeTileGrad:  {
    width: 48, height: 48, borderRadius: 14,
    justifyContent: "center", alignItems: "center", marginBottom: 8,
  },
  typeTileLabel: { fontSize: 12, fontWeight: "700", color: "#334155", textAlign: "center" },
  typeTileDesc:  { fontSize: 10, color: "#94A3B8", textAlign: "center", marginTop: 3 },

  posterPreviewWrap: { borderRadius: 16, overflow: "hidden", position: "relative" },
  posterPreview:     { width: "100%", height: 180, borderRadius: 16 },
  posterRemove: {
    position: "absolute", top: 8, right: 8,
    backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 12,
  },
  posterPlaceholder: {
    height: 160, borderRadius: 16,
    justifyContent: "center", alignItems: "center",
  },
  posterPlaceholderTxt: { fontSize: 14, fontWeight: "700", color: "rgba(255,255,255,0.8)", marginTop: 8 },
  posterPlaceholderSub: { fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4 },

  inputBox: {
    backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1.5, borderColor: "#E2E8F0",
    shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  input: { fontSize: 14, color: "#0A1628", fontWeight: "500" },
  textArea: { height: 110, paddingTop: 12 },

  modeRow: { flexDirection: "row", gap: 10 },
  modeChip: {
    flex: 1, paddingVertical: 10, borderRadius: 14,
    borderWidth: 1.5, borderColor: "#E2E8F0",
    backgroundColor: "#fff", alignItems: "center",
  },
  modeChipActive:  { borderColor: "#0066CC", backgroundColor: "#EFF6FF" },
  modeChipTxt:     { fontSize: 13, fontWeight: "600", color: "#64748B" },
  modeChipTxtActive:{ color: "#0066CC", fontWeight: "700" },

  addSkillBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "#0066CC",
    justifyContent: "center", alignItems: "center",
  },
  suggestionChip: {
    backgroundColor: "#F1F5F9", borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6, marginRight: 8,
    borderWidth: 1, borderColor: "#E2E8F0",
  },
  suggestionTxt: { fontSize: 11, fontWeight: "600", color: "#475569" },
  selectedSkillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  selectedChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#EFF6FF", borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: "#BFDBFE",
  },
  selectedChipTxt: { fontSize: 12, fontWeight: "700", color: "#1D4ED8" },

  nextBtn: { marginHorizontal: 16, marginTop: 24, borderRadius: 18, overflow: "hidden" },
  nextBtnGrad: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, paddingVertical: 17,
  },
  nextBtnTxt: { fontSize: 16, fontWeight: "800", color: "#fff" },

  // Preview
  previewLabel: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  previewLabelTxt: { fontSize: 13, color: "#64748B", fontWeight: "600" },
  previewCard: {
    marginHorizontal: 16, backgroundColor: "#fff", borderRadius: 20, overflow: "hidden",
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 14, elevation: 5,
  },
  postHeader: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 14,
  },
  postAvatarWrap: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: "#0E7490",
    justifyContent: "center", alignItems: "center", overflow: "hidden",
  },
  postAvatar:    { width: 42, height: 42, borderRadius: 21 },
  postAvatarTxt: { fontSize: 15, fontWeight: "900", color: "#fff" },
  previewOrgName:{ fontSize: 13, fontWeight: "700", color: "#0A1628" },
  previewTime:   { fontSize: 11, color: "#94A3B8", marginTop: 1 },
  typeBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  typeDot:     { width: 6, height: 6, borderRadius: 3 },
  typeBadgeTxt:{ fontSize: 11, fontWeight: "700" },
  previewBanner:    { width: "100%", height: 180 },
  previewBannerGrad:{
    height: 180, justifyContent: "flex-end",
    paddingHorizontal: 20, paddingBottom: 18, overflow: "hidden",
  },
  bannerDecorCircle:  {
    position: "absolute", width: 160, height: 160, borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.05)", top: -40, right: -40,
  },
  bannerTitle:    { fontSize: 20, fontWeight: "900", color: "#fff", marginBottom: 8 },
  bannerMetaRow:  { flexDirection: "row", gap: 16 },
  bannerMeta:     { flexDirection: "row", alignItems: "center", gap: 4 },
  bannerMetaTxt:  { fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: "600" },
  postBody:  { padding: 16 },
  previewTitle:{ fontSize: 16, fontWeight: "800", color: "#0A1628" },
  previewDesc: { fontSize: 13, color: "#475569", marginTop: 6, lineHeight: 20 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  metaChip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#EFF6FF", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  metaChipTxt: { fontSize: 11, fontWeight: "600", color: "#0066CC" },
  skillChip: {
    backgroundColor: "#EFF6FF", borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5, marginRight: 8,
    borderWidth: 1, borderColor: "#BFDBFE",
  },
  skillChipTxt:  { fontSize: 11, fontWeight: "700", color: "#1D4ED8" },
  postFooter: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", marginTop: 14,
    paddingTop: 14, borderTopWidth: 1, borderColor: "#F1F5F9",
  },
  postFooterLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  postFooterTxt:  { fontSize: 13, color: "#64748B", fontWeight: "600" },
  applyChip: {
    backgroundColor: "#0066CC",
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
  },
  applyChipTxt: { fontSize: 12, color: "#fff", fontWeight: "700" },
});