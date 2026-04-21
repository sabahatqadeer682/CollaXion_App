import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "./shared";

const { width } = Dimensions.get("window");

// ── CollaXion Color Theme ─────────────────────────────────────────
const THEME = {
  headerBg:   "#0D1F2D",
  headerMid:  "#132D40",
  headerEnd:  "#193648",
  bg:         "#F0F4F8",
  card:       "#FFFFFF",
  border:     "#E2E8F0",
  accent:     "#0D1F2D",
  accentBlue: "#1B3A52",
  text:       "#0D1F2D",
  sub:        "#64748B",
  muted:      "#94A3B8",
  required:   "#EF4444",
};

type EventType = "Seminar" | "Job Fair" | "Workshop" | "Tech Talk" | "Hackathon" | "Networking";
type EventMode = "Physical" | "Virtual" | "Hybrid";

const EVENT_TYPES: { label: EventType; icon: string }[] = [
  { label: "Seminar",    icon: "mic" },
  { label: "Job Fair",   icon: "briefcase" },
  { label: "Workshop",   icon: "build" },
  { label: "Tech Talk",  icon: "code-slash" },
  { label: "Hackathon",  icon: "trophy" },
  { label: "Networking", icon: "people-circle" },
];

const UNIVERSITIES = ["Riphah International University"];

const SUGGESTED_TAGS = [
  "AI/ML", "Web Dev", "Mobile", "Cloud", "Cybersecurity",
  "Data Science", "Internship", "Research", "Networking", "Design",
];

// ─────────────────────────────────────────────────────────────────
export function EventCreationScreen() {
  const nav    = useNavigation<any>();
  const route  = useRoute<any>();
  const { user, ax } = useUser();
  const insets = useSafeAreaInsets();

  const editMode  = route.params?.editMode  || false;
  const eventData = route.params?.eventData || null;

  // ── Form state ──────────────────────────────────────────────────
  const [eventType,    setEventType]    = useState<EventType>("Seminar");
  const [title,        setTitle]        = useState("");
  const [description,  setDesc]         = useState("");
  const [date,         setDate]         = useState("");
  const [time,         setTime]         = useState("");
  const [location,     setLocation]     = useState("");
  const [mode,         setMode]         = useState<EventMode>("Physical");
  const [capacity,     setCapacity]     = useState("");
  const [deadline,     setDeadline]     = useState("");
  const [banner,       setBanner]       = useState<string | null>(null);
  const [tags,         setTags]         = useState<string[]>([]);
  const [customTag,    setCustomTag]    = useState("");
  const [selectedUnis, setSelectedUnis] = useState<string[]>(["Riphah International University"]);
  const [inviteMsg,    setInviteMsg]    = useState("");
  const [loading,      setLoading]      = useState(false);

  // ── Prefill when editing ────────────────────────────────────────
  useEffect(() => {
    if (editMode && eventData) {
      setEventType(eventData.eventType || "Seminar");
      setTitle(eventData.title || "");
      setDesc(eventData.description || "");
      setDate(eventData.date || "");
      setTime(eventData.time || "");
      setLocation(eventData.location || "");
      setMode(eventData.mode || "Physical");
      setCapacity(eventData.capacity ? String(eventData.capacity) : "");
      setDeadline(eventData.deadline || "");
      setBanner(eventData.banner || null);
      setTags(eventData.tags || []);
      setSelectedUnis(eventData.invitedUniversities || []);
      setInviteMsg(eventData.inviteMessage || "");
    }
  }, [editMode, eventData]);

  // ── Helpers ─────────────────────────────────────────────────────
  const pickBanner = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      aspect: [16, 9],
    });
    if (!res.canceled) setBanner(res.assets[0].uri);
  };

  const toggleTag = (t: string) =>
    setTags((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  const addCustomTag = () => {
    const tr = customTag.trim();
    if (tr && !tags.includes(tr)) setTags((p) => [...p, tr]);
    setCustomTag("");
  };

  const toggleUni = (u: string) =>
    setSelectedUnis((p) => (p.includes(u) ? p.filter((x) => x !== u) : [...p, u]));

  // ── Validate ─────────────────────────────────────────────────────
  const validate = () => {
    if (!title.trim())       { Alert.alert("Required", "Event title is required.");       return false; }
    if (!description.trim()) { Alert.alert("Required", "Description is required.");       return false; }
    if (!date.trim())        { Alert.alert("Required", "Event date is required.");        return false; }
    if (!location.trim() && mode !== "Virtual") {
      Alert.alert("Required", "Location is required for physical/hybrid events.");        return false;
    }
    if (selectedUnis.length === 0) {
      Alert.alert("Required", "Select at least one university to invite.");               return false;
    }
    return true;
  };

  // ── Submit ──────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    const headers = {
      "x-industry-id":  user?._id,
      "x-company-name": user?.name || "Partner",
    };

    try {
      const a = ax();

      if (editMode && eventData?._id) {
        const payload = {
          industryId: user?._id, companyName: user?.name,
          eventType, title, description, date, time, location, mode,
          capacity: capacity ? Number(capacity) : null, deadline,
          banner, tags, invitedUniversities: selectedUnis, inviteMessage: inviteMsg,
        };
        await a.put(`/api/industry/events/${eventData._id}`, payload, { headers });
        setLoading(false);
        Alert.alert("Updated ✏️", "Event successfully updated!", [
          { text: "OK", onPress: () => nav.goBack() },
        ]);
      } else {
        const formData = new FormData();
        formData.append("industryId",   user?._id);
        formData.append("companyName",  user?.name);
        formData.append("eventType",    eventType);
        formData.append("title",        title);
        formData.append("description",  description);
        formData.append("date",         date);
        formData.append("time",         time);
        formData.append("location",     location);
        formData.append("mode",         mode);
        formData.append("capacity",     capacity);
        formData.append("deadline",     deadline);
        formData.append("tags",              JSON.stringify(tags));
        formData.append("invitedUniversities", JSON.stringify(selectedUnis));
        formData.append("inviteMessage", inviteMsg);
        if (banner) {
          formData.append("banner", { uri: banner, name: "event.jpg", type: "image/jpeg" } as any);
        }
        await a.post("/api/industry/events", formData, {
          headers: { ...headers, "Content-Type": "multipart/form-data" },
        });
        setLoading(false);
        Alert.alert("Published 🎉", "Event created and invitations sent!", [
          { text: "OK", onPress: () => nav.goBack() },
        ]);
      }
    } catch (err: any) {
      setLoading(false);
      Alert.alert("Error", err?.response?.data?.message || err?.message || "Submit failed");
    }
  };

  // ═══════════════════════════════════════════════════════════════
  return (
    <View style={{ flex: 1, backgroundColor: THEME.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.headerBg} />

      {/* ── Header ── */}
      <LinearGradient
        colors={[THEME.headerBg, THEME.headerMid, THEME.headerEnd]}
        style={[s.header, { paddingTop: Platform.OS === "ios" ? 56 : 44 }]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <View style={s.headerRow}>
          <TouchableOpacity onPress={() => nav.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={21} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={s.headerTitle}>{editMode ? "Edit Event" : "Create Event"}</Text>
            <Text style={s.headerSub}>Fill in the details below</Text>
          </View>
          <View style={s.headerBadge}>
            <Ionicons name="calendar" size={15} color="#fff" />
          </View>
        </View>
      </LinearGradient>

      {/* ── Form ── */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 110 + insets.bottom }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── Section: Event Type ── */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Event Type</Text>
            <View style={s.typeGrid}>
              {EVENT_TYPES.map((et) => {
                const active = eventType === et.label;
                return (
                  <TouchableOpacity
                    key={et.label}
                    style={[s.typeTile, { width: (width - 56) / 3 }, active && s.typeTileActive]}
                    onPress={() => setEventType(et.label)}
                    activeOpacity={0.8}
                  >
                    <View style={[s.typeTileIcon, active && s.typeTileIconActive]}>
                      <Ionicons name={et.icon as any} size={20} color={active ? "#fff" : THEME.sub} />
                    </View>
                    <Text style={[s.typeTileLabel, active && { color: THEME.accent, fontWeight: "700" }]}>
                      {et.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Section: Basic Details ── */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Event Details</Text>
            <View style={s.card}>

              {/* Title */}
              <View style={s.fieldWrap}>
                <Text style={s.label}>Event Title <Text style={s.req}>*</Text></Text>
                <View style={s.inputRow}>
                  <Ionicons name="text-outline" size={16} color={THEME.sub} style={s.inputIcon} />
                  <TextInput
                    style={s.inputField}
                    placeholder="e.g. Flutter Workshop 2025"
                    placeholderTextColor={THEME.muted}
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>
              </View>

              <View style={s.divider} />

              {/* Description */}
              <View style={s.fieldWrap}>
                <Text style={s.label}>Description <Text style={s.req}>*</Text></Text>
                <TextInput
                  style={[s.inputField, s.textarea]}
                  placeholder="Describe the event, agenda, what attendees will gain..."
                  placeholderTextColor={THEME.muted}
                  value={description}
                  onChangeText={setDesc}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={s.divider} />

              {/* Date & Time */}
              <View style={s.row}>
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>Date <Text style={s.req}>*</Text></Text>
                  <View style={s.inputRow}>
                    <Ionicons name="calendar-outline" size={15} color={THEME.sub} style={s.inputIcon} />
                    <TextInput
                      style={[s.inputField, { flex: 1 }]}
                      placeholder="DD MMM YYYY"
                      placeholderTextColor={THEME.muted}
                      value={date}
                      onChangeText={setDate}
                    />
                  </View>
                </View>
                <View style={{ width: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>Time</Text>
                  <View style={s.inputRow}>
                    <Ionicons name="time-outline" size={15} color={THEME.sub} style={s.inputIcon} />
                    <TextInput
                      style={[s.inputField, { flex: 1 }]}
                      placeholder="10:00 AM"
                      placeholderTextColor={THEME.muted}
                      value={time}
                      onChangeText={setTime}
                    />
                  </View>
                </View>
              </View>

              <View style={s.divider} />

              {/* Mode */}
              <View style={s.fieldWrap}>
                <Text style={s.label}>Event Mode</Text>
                <View style={s.modeRow}>
                  {(["Physical", "Virtual", "Hybrid"] as EventMode[]).map((m) => (
                    <TouchableOpacity
                      key={m}
                      style={[s.modeBtn, mode === m && s.modeBtnActive]}
                      onPress={() => setMode(m)}
                    >
                      <Ionicons
                        name={m === "Physical" ? "location" : m === "Virtual" ? "videocam" : "git-merge"}
                        size={13}
                        color={mode === m ? "#fff" : THEME.sub}
                      />
                      <Text style={[s.modeBtnTxt, mode === m && { color: "#fff" }]}>{m}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={s.divider} />

              {/* Location */}
              <View style={s.fieldWrap}>
                <Text style={s.label}>
                  {mode === "Virtual" ? "Meeting Link" : "Location"}
                  {mode !== "Virtual" && <Text style={s.req}> *</Text>}
                </Text>
                <View style={s.inputRow}>
                  <Ionicons
                    name={mode === "Virtual" ? "link-outline" : "location-outline"}
                    size={15}
                    color={THEME.sub}
                    style={s.inputIcon}
                  />
                  <TextInput
                    style={[s.inputField, { flex: 1 }]}
                    placeholder={mode === "Virtual" ? "https://zoom.us/j/..." : "Venue name, city"}
                    placeholderTextColor={THEME.muted}
                    value={location}
                    onChangeText={setLocation}
                  />
                </View>
              </View>

              <View style={s.divider} />

              {/* Capacity & Deadline */}
              <View style={s.row}>
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>Capacity</Text>
                  <View style={s.inputRow}>
                    <Ionicons name="people-outline" size={15} color={THEME.sub} style={s.inputIcon} />
                    <TextInput
                      style={[s.inputField, { flex: 1 }]}
                      placeholder="e.g. 100"
                      placeholderTextColor={THEME.muted}
                      value={capacity}
                      onChangeText={setCapacity}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>
                <View style={{ width: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>RSVP Deadline</Text>
                  <View style={s.inputRow}>
                    <Ionicons name="hourglass-outline" size={15} color={THEME.sub} style={s.inputIcon} />
                    <TextInput
                      style={[s.inputField, { flex: 1 }]}
                      placeholder="DD MMM YYYY"
                      placeholderTextColor={THEME.muted}
                      value={deadline}
                      onChangeText={setDeadline}
                    />
                  </View>
                </View>
              </View>

            </View>
          </View>

          {/* ── Section: Banner ── */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Event Banner</Text>
            <TouchableOpacity style={s.bannerPicker} onPress={pickBanner} activeOpacity={0.85}>
              {banner ? (
                <>
                  <Image source={{ uri: banner }} style={s.bannerImg} />
                  <View style={s.bannerOverlay}>
                    <Ionicons name="camera-outline" size={20} color="#fff" />
                    <Text style={s.bannerOverlayTxt}>Change</Text>
                  </View>
                </>
              ) : (
                <View style={s.bannerPlaceholder}>
                  <View style={s.bannerIconBox}>
                    <Ionicons name="image-outline" size={28} color={THEME.sub} />
                  </View>
                  <Text style={s.bannerPlaceholderTxt}>Tap to upload banner</Text>
                  <Text style={s.bannerPlaceholderSub}>Recommended: 1200 × 675 px</Text>
                </View>
              )}
            </TouchableOpacity>
            {banner && (
              <TouchableOpacity onPress={() => setBanner(null)} style={s.removeBtn}>
                <Ionicons name="trash-outline" size={13} color={THEME.required} />
                <Text style={{ fontSize: 12, color: THEME.required, fontWeight: "600" }}>Remove Banner</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ── Section: Tags ── */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Tags</Text>
            <View style={s.card}>
              <View style={s.tagGrid}>
                {SUGGESTED_TAGS.map((tag) => {
                  const active = tags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[s.tagChip, active && s.tagChipActive]}
                      onPress={() => toggleTag(tag)}
                    >
                      {active && <Ionicons name="checkmark" size={11} color="#fff" />}
                      <Text style={[s.tagChipTxt, active && { color: "#fff" }]}>{tag}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={[s.divider, { marginTop: 12 }]} />
              <View style={s.customTagRow}>
                <TextInput
                  style={[s.inputField, { flex: 1 }]}
                  placeholder="Add custom tag..."
                  placeholderTextColor={THEME.muted}
                  value={customTag}
                  onChangeText={setCustomTag}
                  onSubmitEditing={addCustomTag}
                  returnKeyType="done"
                />
                <TouchableOpacity style={s.addTagBtn} onPress={addCustomTag}>
                  <Ionicons name="add" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ── Section: Invite Universities ── */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>
              Invite Universities <Text style={s.req}>*</Text>
            </Text>
            <View style={s.card}>
              <View style={s.uniActions}>
                <TouchableOpacity
                  style={s.uniActionBtn}
                  onPress={() => setSelectedUnis([...UNIVERSITIES])}
                >
                  <Ionicons name="checkmark-done-outline" size={13} color={THEME.accentBlue} />
                  <Text style={[s.uniActionTxt, { color: THEME.accentBlue }]}>Select All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.uniActionBtn}
                  onPress={() => setSelectedUnis([])}
                >
                  <Ionicons name="close-circle-outline" size={13} color={THEME.required} />
                  <Text style={[s.uniActionTxt, { color: THEME.required }]}>Clear</Text>
                </TouchableOpacity>
              </View>
              {UNIVERSITIES.map((u) => {
                const sel = selectedUnis.includes(u);
                return (
                  <TouchableOpacity
                    key={u}
                    style={[s.uniRow, sel && s.uniRowActive]}
                    onPress={() => toggleUni(u)}
                    activeOpacity={0.8}
                  >
                    <View style={[s.checkbox, sel && s.checkboxActive]}>
                      {sel && <Ionicons name="checkmark" size={12} color="#fff" />}
                    </View>
                    <Ionicons name="school-outline" size={16} color={sel ? THEME.accent : THEME.sub} />
                    <Text style={[s.uniName, sel && { color: THEME.accent, fontWeight: "700" }]}>{u}</Text>
                  </TouchableOpacity>
                );
              })}
              <View style={s.divider} />
              <View style={s.fieldWrap}>
                <Text style={s.label}>Invitation Message</Text>
                <TextInput
                  style={[s.inputField, s.textarea]}
                  placeholder={`Dear [University],\n\nWe would like to invite your students...`}
                  placeholderTextColor={THEME.muted}
                  value={inviteMsg}
                  onChangeText={setInviteMsg}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Submit Button ── */}
      <View style={[s.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : 16 }]}>
        <TouchableOpacity
          style={s.submitBtn}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={loading ? ["#94A3B8", "#94A3B8"] : [THEME.headerBg, THEME.headerEnd]}
            style={s.submitBtnGrad}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <Text style={s.submitBtnTxt}>{editMode ? "Updating..." : "Publishing..."}</Text>
            ) : (
              <>
                <Ionicons name={editMode ? "save-outline" : "send-outline"} size={17} color="#fff" />
                <Text style={s.submitBtnTxt}>
                  {editMode ? "Save Changes" : "Publish Event"}
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ════════════════════════════════════════════════════════════════
const s = StyleSheet.create({
  header: { paddingHorizontal: 18, paddingBottom: 20 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: { fontSize: 19, fontWeight: "900", color: "#fff" },
  headerSub:   { fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 },
  headerBadge: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center", alignItems: "center",
  },
  section: { paddingHorizontal: 16, paddingTop: 20 },
  sectionTitle: {
    fontSize: 13, fontWeight: "800", color: THEME.text,
    textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10,
  },
  card: {
    backgroundColor: THEME.card, borderRadius: 16,
    borderWidth: 1, borderColor: THEME.border,
    paddingHorizontal: 14, paddingVertical: 10,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  divider: { height: 1, backgroundColor: THEME.border, marginVertical: 10 },
  fieldWrap: { paddingVertical: 4 },
  label: { fontSize: 12, fontWeight: "700", color: THEME.sub, marginBottom: 7 },
  req:   { color: THEME.required },
  row:   { flexDirection: "row", paddingVertical: 4 },
  inputRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: THEME.bg, borderRadius: 10,
    borderWidth: 1.5, borderColor: THEME.border,
  },
  inputIcon:  { paddingLeft: 12 },
  inputField: {
    flex: 1, paddingHorizontal: 10, paddingVertical: 11,
    fontSize: 14, color: THEME.text,
  },
  textarea: { minHeight: 90, paddingTop: 10, paddingHorizontal: 12 },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  typeTile: {
    backgroundColor: THEME.card, borderRadius: 14, paddingVertical: 12,
    alignItems: "center", borderWidth: 1.5, borderColor: THEME.border,
  },
  typeTileActive: { borderColor: THEME.accent, backgroundColor: "#EEF2F7" },
  typeTileIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: THEME.bg,
    justifyContent: "center", alignItems: "center", marginBottom: 7,
  },
  typeTileIconActive: { backgroundColor: THEME.accent },
  typeTileLabel: { fontSize: 10, fontWeight: "600", color: THEME.sub, textAlign: "center" },
  modeRow: { flexDirection: "row", gap: 8 },
  modeBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 5, paddingVertical: 9, borderRadius: 10,
    backgroundColor: THEME.bg, borderWidth: 1.5, borderColor: THEME.border,
  },
  modeBtnActive: { backgroundColor: THEME.accent, borderColor: THEME.accent },
  modeBtnTxt:    { fontSize: 12, fontWeight: "700", color: THEME.sub },
  bannerPicker: {
    height: 170, borderRadius: 16, backgroundColor: THEME.bg,
    borderWidth: 2, borderColor: THEME.border, borderStyle: "dashed",
    overflow: "hidden", justifyContent: "center",
  },
  bannerImg:  { width: "100%", height: "100%", resizeMode: "cover" },
  bannerPlaceholder: { alignItems: "center", justifyContent: "center", padding: 20 },
  bannerIconBox: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: "#EEF2F7",
    justifyContent: "center", alignItems: "center", marginBottom: 10,
  },
  bannerPlaceholderTxt: { fontSize: 14, fontWeight: "700", color: THEME.text },
  bannerPlaceholderSub: { fontSize: 12, color: THEME.muted, marginTop: 4 },
  bannerOverlay: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(0,0,0,0.42)",
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 9,
  },
  bannerOverlayTxt: { color: "#fff", fontSize: 13, fontWeight: "700" },
  removeBtn: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 8, alignSelf: "flex-end" },
  tagGrid:      { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingVertical: 4 },
  tagChip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    backgroundColor: THEME.bg, borderWidth: 1.5, borderColor: THEME.border,
  },
  tagChipActive: { backgroundColor: THEME.accent, borderColor: THEME.accent },
  tagChipTxt:    { fontSize: 12, fontWeight: "600", color: THEME.sub },
  customTagRow:  { flexDirection: "row", alignItems: "center", gap: 8, paddingTop: 4 },
  addTagBtn:     {
    width: 42, height: 42, borderRadius: 10, backgroundColor: THEME.accent,
    justifyContent: "center", alignItems: "center",
  },
  uniActions: { flexDirection: "row", gap: 10, marginBottom: 12 },
  uniActionBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
    backgroundColor: THEME.bg, borderWidth: 1, borderColor: THEME.border,
  },
  uniActionTxt: { fontSize: 12, fontWeight: "600" },
  uniRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingVertical: 12, paddingHorizontal: 4,
    borderRadius: 10, marginBottom: 6,
    borderWidth: 1.5, borderColor: "transparent",
  },
  uniRowActive: { backgroundColor: "#EEF2F7", borderColor: THEME.accent, borderRadius: 10 },
  checkbox: {
    width: 20, height: 20, borderRadius: 5, borderWidth: 2,
    borderColor: THEME.border, justifyContent: "center", alignItems: "center",
  },
  checkboxActive: { backgroundColor: THEME.accent, borderColor: THEME.accent },
  uniName: { flex: 1, fontSize: 13, fontWeight: "600", color: THEME.sub },
  bottomBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: THEME.card, paddingHorizontal: 16, paddingTop: 12,
    borderTopWidth: 1, borderColor: THEME.border,
  },
  submitBtn:     { borderRadius: 14, overflow: "hidden" },
  submitBtnGrad: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 15,
  },
  submitBtnTxt: { fontSize: 15, fontWeight: "800", color: "#fff" },
});