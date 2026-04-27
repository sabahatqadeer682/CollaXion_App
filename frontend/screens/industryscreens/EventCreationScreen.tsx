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
  Modal,
  Platform,
  Pressable,
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

// ── Auto-suggestion datasets — keyed by event type so the chips track context.
const TITLE_SUGGESTIONS: Record<EventType, string[]> = {
  Seminar:    ["Industry-Academia Seminar", "Career Insights Seminar", "AI in Industry Seminar", "Future of Software Engineering"],
  "Job Fair": ["Annual Job Fair 2026", "Tech Recruitment Drive", "Spring Career Fair", "Internship & Placement Day"],
  Workshop:   ["Flutter Workshop 2026", "React Native Bootcamp", "Cloud Fundamentals Workshop", "UI/UX Hands-on Workshop"],
  "Tech Talk":["AI Trends Tech Talk", "DevOps Tech Talk", "Cybersecurity 101", "Building Scalable APIs"],
  Hackathon:  ["24-Hour Innovation Hackathon", "AI Hackathon 2026", "Open-Source Hack Day", "FinTech Hackathon"],
  Networking: ["Industry Mixer Night", "Alumni Networking Evening", "Tech Leaders Meetup", "Founders & Builders Connect"],
};

const DESCRIPTION_TEMPLATES: Record<EventType, string[]> = {
  Seminar: [
    "Join us for an interactive seminar where industry leaders share trends, case studies, and career advice. Open Q&A and refreshments included.",
    "An informative session on the latest developments in our domain. Attendees will leave with actionable insights and networking opportunities.",
  ],
  "Job Fair": [
    "Meet our hiring team in person. Bring your CV — we'll be conducting on-spot interviews for internships and full-time roles.",
    "Connect with multiple teams across engineering, product, and design. Limited capacity — RSVP early to confirm a slot.",
  ],
  Workshop: [
    "Hands-on workshop covering fundamentals to project work. Bring your laptop. Certificate awarded on completion.",
    "Practical training session with real datasets and exercises. Suitable for intermediate participants. Limited seats.",
  ],
  "Tech Talk": [
    "A focused 45-minute talk by a senior engineer, followed by Q&A. Walk away with practical tips you can apply immediately.",
    "Deep-dive technical session with code walkthroughs and live demos. Open to all students interested in the topic.",
  ],
  Hackathon: [
    "Pitch, build, and demo in 24 hours. Cash prizes for top three teams. Mentors from industry on hand throughout.",
    "Theme-based hackathon — form teams of up to 4. Food, swag, and judging panel from leading companies.",
  ],
  Networking: [
    "Casual networking evening with industry professionals, alumni, and fellow students. Snacks and drinks provided.",
    "Connect, share, and grow. Speed-networking rounds followed by free-form mingling.",
  ],
};

const LOCATION_SUGGESTIONS = [
  "Riphah International University, Islamabad",
  "Riphah International University, Lahore",
  "Conference Hall, Main Campus",
  "Auditorium, Block A",
  "Karachi Expo Center",
  "Lahore Expo Center",
  "Online (Zoom)",
];

const CAPACITY_SUGGESTIONS = ["30", "50", "100", "150", "200", "300", "500"];

const INVITE_MESSAGE_TEMPLATES = [
  "We'd love to host your students at this event. Looking forward to a productive session together.",
  "You are cordially invited to participate. Please share this with your students and faculty.",
  "Limited seats available — kindly confirm participation by the RSVP deadline.",
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

  // ── Picker visibility ───────────────────────────────────────────
  const [dateModalOpen,     setDateModalOpen]     = useState(false);
  const [deadlineModalOpen, setDeadlineModalOpen] = useState(false);
  const [timeModalOpen,     setTimeModalOpen]     = useState(false);

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
      // Only keep the existing banner if it's a real renderable URI
      // (data URI or http URL). Stale file:// paths from old saves are
      // dropped so the user is prompted to re-upload.
      const b = eventData.banner;
      const validB = typeof b === "string" && (b.startsWith("data:") || /^https?:\/\//i.test(b));
      setBanner(validB ? b : null);
      setTags(eventData.tags || []);
      setSelectedUnis(eventData.invitedUniversities || []);
      setInviteMsg(eventData.inviteMessage || "");
    }
  }, [editMode, eventData]);

  // ── Helpers ─────────────────────────────────────────────────────
  const pickBanner = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      aspect: [16, 9],
      base64: true,                      // native base64 — reliable on RN
    });
    if (!res.canceled) {
      const a = res.assets[0];
      setBanner(a.base64 ? `data:image/jpeg;base64,${a.base64}` : a.uri);
    }
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
      // Only send banner to backend if it's a valid data URI or http URL —
      // never a stale file:// path.
      const safeBanner =
        typeof banner === "string" && (banner.startsWith("data:") || /^https?:\/\//i.test(banner))
          ? banner
          : null;

      const payload = {
        industryId: user?._id, companyName: user?.name,
        eventType, title, description, date, time, location, mode,
        capacity: capacity ? Number(capacity) : null, deadline,
        banner: safeBanner,
        tags, invitedUniversities: selectedUnis, inviteMessage: inviteMsg,
      };

      const a = ax();
      if (editMode && eventData?._id) {
        await a.put(`/api/industry/events/${eventData._id}`, payload, { headers });
        setLoading(false);
        Alert.alert("Updated ✏️", "Event successfully updated!", [
          { text: "OK", onPress: () => nav.goBack() },
        ]);
      } else {
        await a.post("/api/industry/events", payload, { headers });
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
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled" style={{ marginTop: 8 }}>
                  {TITLE_SUGGESTIONS[eventType]
                    .filter((sg) => sg.toLowerCase() !== title.trim().toLowerCase())
                    .map((sg) => (
                      <TouchableOpacity key={sg} onPress={() => setTitle(sg)} style={evChip.chip}>
                        <Ionicons name="sparkles-outline" size={12} color={THEME.text} />
                        <Text style={evChip.txt}>{sg}</Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
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
                  maxLength={1000}
                />
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled" style={{ marginTop: 8 }}>
                  {DESCRIPTION_TEMPLATES[eventType].map((tpl, i) => (
                    <TouchableOpacity key={i} onPress={() => setDesc(tpl)} style={evChip.chip}>
                      <Ionicons name="document-text-outline" size={12} color={THEME.text} />
                      <Text style={evChip.txt}>Template {i + 1}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={s.divider} />

              {/* Date & Time — tap to pick */}
              <View style={s.row}>
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>Date <Text style={s.req}>*</Text></Text>
                  <TouchableOpacity style={s.inputRow} onPress={() => setDateModalOpen(true)} activeOpacity={0.85}>
                    <Ionicons name="calendar-outline" size={15} color={THEME.sub} style={s.inputIcon} />
                    <Text style={[s.inputField, { flex: 1, paddingVertical: 12, color: date ? THEME.text : THEME.muted }]}>
                      {date || "Tap to pick date"}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color={THEME.muted} />
                  </TouchableOpacity>
                </View>
                <View style={{ width: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>Time</Text>
                  <TouchableOpacity style={s.inputRow} onPress={() => setTimeModalOpen(true)} activeOpacity={0.85}>
                    <Ionicons name="time-outline" size={15} color={THEME.sub} style={s.inputIcon} />
                    <Text style={[s.inputField, { flex: 1, paddingVertical: 12, color: time ? THEME.text : THEME.muted }]}>
                      {time || "Tap to pick time"}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color={THEME.muted} />
                  </TouchableOpacity>
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
                {mode !== "Virtual" && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled" style={{ marginTop: 8 }}>
                    {LOCATION_SUGGESTIONS
                      .filter((sg) => sg.toLowerCase() !== location.trim().toLowerCase())
                      .map((sg) => (
                        <TouchableOpacity key={sg} onPress={() => setLocation(sg)} style={evChip.chip}>
                          <Ionicons name="location-outline" size={12} color={THEME.text} />
                          <Text style={evChip.txt}>{sg}</Text>
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                )}
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
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled" style={{ marginTop: 6 }}>
                    {CAPACITY_SUGGESTIONS
                      .filter((sg) => sg !== capacity)
                      .map((sg) => (
                        <TouchableOpacity key={`cap-${sg}`} onPress={() => setCapacity(sg)} style={evChip.chip}>
                          <Ionicons name="people-outline" size={12} color={THEME.text} />
                          <Text style={evChip.txt}>{sg}</Text>
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </View>
                <View style={{ width: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={s.label}>RSVP Deadline</Text>
                  <TouchableOpacity style={s.inputRow} onPress={() => setDeadlineModalOpen(true)} activeOpacity={0.85}>
                    <Ionicons name="hourglass-outline" size={15} color={THEME.sub} style={s.inputIcon} />
                    <Text style={[s.inputField, { flex: 1, paddingVertical: 12, color: deadline ? THEME.text : THEME.muted }]}>
                      {deadline || "Tap to pick"}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color={THEME.muted} />
                  </TouchableOpacity>
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
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled" style={{ marginTop: 8 }}>
                  {INVITE_MESSAGE_TEMPLATES.map((tpl, i) => (
                    <TouchableOpacity key={i} onPress={() => setInviteMsg(tpl)} style={evChip.chip}>
                      <Ionicons name="chatbubble-ellipses-outline" size={12} color={THEME.text} />
                      <Text style={evChip.txt}>Template {i + 1}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
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

      {/* ── Date picker modal (Event Date) ── */}
      <DatePickerModal
        visible={dateModalOpen}
        title="Select Event Date"
        initial={date}
        onClose={() => setDateModalOpen(false)}
        onPick={(v) => { setDate(v); setDateModalOpen(false); }}
      />

      {/* ── Date picker modal (RSVP Deadline) ── */}
      <DatePickerModal
        visible={deadlineModalOpen}
        title="Select RSVP Deadline"
        initial={deadline}
        onClose={() => setDeadlineModalOpen(false)}
        onPick={(v) => { setDeadline(v); setDeadlineModalOpen(false); }}
      />

      {/* ── Time picker modal ── */}
      <TimePickerModal
        visible={timeModalOpen}
        initial={time}
        onClose={() => setTimeModalOpen(false)}
        onPick={(v) => { setTime(v); setTimeModalOpen(false); }}
      />
    </View>
  );
}

// ════════════════════════════════════════════════════════════════
//  Date Picker Modal — month grid, no extra deps
// ════════════════════════════════════════════════════════════════
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const WEEKDAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function fmtDate(y: number, m: number, d: number) {
  return `${String(d).padStart(2,"0")} ${MONTHS[m]} ${y}`;
}
function parseDate(s: string): { y: number; m: number; d: number } | null {
  if (!s) return null;
  const parts = s.trim().split(/\s+/);
  if (parts.length < 3) return null;
  const d = parseInt(parts[0], 10);
  const m = MONTHS.indexOf(parts[1]);
  const y = parseInt(parts[2], 10);
  if (isNaN(d) || isNaN(y) || m < 0) return null;
  return { y, m, d };
}

function DatePickerModal({
  visible, title, initial, onClose, onPick,
}: {
  visible: boolean; title: string; initial: string;
  onClose: () => void; onPick: (v: string) => void;
}) {
  const today = new Date();
  const init  = parseDate(initial) || { y: today.getFullYear(), m: today.getMonth(), d: today.getDate() };
  const [year,  setYear]  = React.useState(init.y);
  const [month, setMonth] = React.useState(init.m);
  const [day,   setDay]   = React.useState(init.d);

  React.useEffect(() => {
    if (visible) {
      const i = parseDate(initial) || { y: today.getFullYear(), m: today.getMonth(), d: today.getDate() };
      setYear(i.y); setMonth(i.m); setDay(i.d);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const firstDow   = new Date(year, month, 1).getDay();
  const daysInMo   = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMo }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={dp.backdrop} onPress={onClose}>
        <Pressable style={dp.card} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={dp.head}>
            <Text style={dp.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color="#5B7080" />
            </TouchableOpacity>
          </View>

          {/* Month / Year nav */}
          <View style={dp.navRow}>
            <TouchableOpacity onPress={prevMonth} style={dp.navBtn}>
              <Ionicons name="chevron-back" size={20} color="#193648" />
            </TouchableOpacity>
            <Text style={dp.navLbl}>{MONTHS[month]} {year}</Text>
            <TouchableOpacity onPress={nextMonth} style={dp.navBtn}>
              <Ionicons name="chevron-forward" size={20} color="#193648" />
            </TouchableOpacity>
          </View>

          {/* Weekday header */}
          <View style={dp.gridRow}>
            {WEEKDAYS.map((w) => (
              <Text key={w} style={dp.dow}>{w}</Text>
            ))}
          </View>

          {/* Day cells */}
          <View style={dp.grid}>
            {cells.map((d, i) => {
              if (d === null) return <View key={i} style={dp.cell} />;
              const selected = d === day;
              return (
                <TouchableOpacity key={i} style={[dp.cell, selected && dp.cellActive]} onPress={() => setDay(d)}>
                  <Text style={[dp.cellTxt, selected && dp.cellTxtActive]}>{d}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Footer */}
          <View style={dp.footer}>
            <TouchableOpacity style={dp.cancelBtn} onPress={onClose}>
              <Text style={dp.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={dp.okBtn} onPress={() => onPick(fmtDate(year, month, day))}>
              <Text style={dp.okTxt}>OK</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ════════════════════════════════════════════════════════════════
//  Time Picker Modal — hour / minute / AM-PM
// ════════════════════════════════════════════════════════════════
function parseTime(s: string): { h: number; m: number; ampm: "AM" | "PM" } | null {
  if (!s) return null;
  const match = s.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  return { h: parseInt(match[1], 10), m: parseInt(match[2], 10), ampm: match[3].toUpperCase() as "AM" | "PM" };
}

function TimePickerModal({
  visible, initial, onClose, onPick,
}: {
  visible: boolean; initial: string;
  onClose: () => void; onPick: (v: string) => void;
}) {
  const init = parseTime(initial) || { h: 10, m: 0, ampm: "AM" as const };
  const [hour,   setHour]   = React.useState(init.h);
  const [minute, setMinute] = React.useState(init.m);
  const [ampm,   setAmpm]   = React.useState<"AM" | "PM">(init.ampm);

  React.useEffect(() => {
    if (visible) {
      const i = parseTime(initial) || { h: 10, m: 0, ampm: "AM" as const };
      setHour(i.h); setMinute(i.m); setAmpm(i.ampm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const HOURS   = Array.from({ length: 12 }, (_, i) => i + 1);
  const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);   // 5-minute intervals

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={dp.backdrop} onPress={onClose}>
        <Pressable style={dp.card} onPress={(e) => e.stopPropagation()}>
          <View style={dp.head}>
            <Text style={dp.title}>Select Time</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color="#5B7080" />
            </TouchableOpacity>
          </View>

          <View style={tp.preview}>
            <Text style={tp.previewTxt}>
              {String(hour).padStart(2,"0")}:{String(minute).padStart(2,"0")} {ampm}
            </Text>
          </View>

          <View style={tp.cols}>
            <ScrollView style={tp.col}>
              {HOURS.map((h) => (
                <TouchableOpacity key={h} style={[tp.opt, hour===h && tp.optActive]} onPress={() => setHour(h)}>
                  <Text style={[tp.optTxt, hour===h && tp.optTxtActive]}>{h}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <ScrollView style={tp.col}>
              {MINUTES.map((m) => (
                <TouchableOpacity key={m} style={[tp.opt, minute===m && tp.optActive]} onPress={() => setMinute(m)}>
                  <Text style={[tp.optTxt, minute===m && tp.optTxtActive]}>{String(m).padStart(2,"0")}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={tp.col}>
              {(["AM","PM"] as const).map((p) => (
                <TouchableOpacity key={p} style={[tp.opt, ampm===p && tp.optActive]} onPress={() => setAmpm(p)}>
                  <Text style={[tp.optTxt, ampm===p && tp.optTxtActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={dp.footer}>
            <TouchableOpacity style={dp.cancelBtn} onPress={onClose}>
              <Text style={dp.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={dp.okBtn}
              onPress={() => onPick(`${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")} ${ampm}`)}>
              <Text style={dp.okTxt}>OK</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── Date / Time picker styles ───────────────────────────────────
const dp = StyleSheet.create({
  backdrop:{ flex:1, backgroundColor:"rgba(13,31,45,0.55)", justifyContent:"center", alignItems:"center", padding:18 },
  card:    { width:"100%", maxWidth:340, backgroundColor:"#FFFFFF", borderRadius:18, padding:18 },
  head:    { flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginBottom:12 },
  title:   { fontSize:15, fontWeight:"800", color:"#0D1F2D" },
  navRow:  { flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginBottom:8 },
  navBtn:  { width:34, height:34, borderRadius:9, backgroundColor:"#EEF3F7", justifyContent:"center", alignItems:"center" },
  navLbl:  { fontSize:14, fontWeight:"700", color:"#0D1F2D" },
  gridRow: { flexDirection:"row", marginTop:8, marginBottom:6 },
  dow:     { flex:1, textAlign:"center", fontSize:11, fontWeight:"700", color:"#5B7080" },
  grid:    { flexDirection:"row", flexWrap:"wrap" },
  cell:    { width:`${100/7}%`, aspectRatio:1, justifyContent:"center", alignItems:"center", padding:2 },
  cellActive:{ },
  cellTxt: { fontSize:13, color:"#0D1F2D" },
  cellTxtActive:{ color:"#fff", fontWeight:"800", backgroundColor:"#193648", width:34, height:34, borderRadius:17, textAlign:"center", lineHeight:34, overflow:"hidden" },
  footer:  { flexDirection:"row", gap:10, marginTop:14 },
  cancelBtn:{ flex:1, paddingVertical:12, borderRadius:10, borderWidth:1, borderColor:"#E2E8F0", alignItems:"center" },
  cancelTxt:{ fontSize:13, fontWeight:"700", color:"#5B7080" },
  okBtn:   { flex:1, paddingVertical:12, borderRadius:10, backgroundColor:"#193648", alignItems:"center" },
  okTxt:   { fontSize:13, fontWeight:"800", color:"#fff" },
});

const tp = StyleSheet.create({
  preview: { alignItems:"center", paddingVertical:12, marginBottom:10, backgroundColor:"#EEF3F7", borderRadius:12 },
  previewTxt:{ fontSize:22, fontWeight:"900", color:"#193648", letterSpacing:1 },
  cols:    { flexDirection:"row", gap:8, height:200 },
  col:     { flex:1, backgroundColor:"#F7FAFC", borderRadius:10, paddingVertical:6 },
  opt:     { paddingVertical:10, alignItems:"center", borderRadius:6, marginHorizontal:6 },
  optActive:{ backgroundColor:"#193648" },
  optTxt:  { fontSize:14, fontWeight:"600", color:"#0D1F2D" },
  optTxtActive:{ color:"#fff", fontWeight:"800" },
});

// ── Chip styles for the auto-suggestion rows ──
const evChip = StyleSheet.create({
  chip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#EEF3F7",
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6,
    marginRight: 8, borderWidth: 1, borderColor: "#E2EAF0",
  },
  txt: { fontSize: 11, fontWeight: "700", color: "#193648" },
});

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