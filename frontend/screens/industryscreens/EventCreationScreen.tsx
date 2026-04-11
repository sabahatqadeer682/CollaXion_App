/**
 * EventCreationScreen.tsx
 * Multi-step event creation screen for industry partners.
 * Step 1 → Event Details (type, title, description, date/time, location, mode, capacity)
 * Step 2 → Media & Tags (banner image, tags)
 * Step 3 → Invite Universities (select unis + custom invite message, then publish)
 */

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
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

type EventType = "Seminar" | "Job Fair" | "Workshop" | "Tech Talk" | "Hackathon" | "Networking";
type EventMode = "Physical" | "Virtual" | "Hybrid";

const EVENT_TYPES: {
  label: EventType;
  icon: string;
  grad: readonly [string, string];
  desc: string;
}[] = [
  { label: "Seminar",    icon: "mic",           grad: ["#0066CC", "#004999"], desc: "Expert talk" },
  { label: "Job Fair",   icon: "briefcase",     grad: ["#059669", "#047857"], desc: "Recruitment" },
  { label: "Workshop",   icon: "build",         grad: ["#D97706", "#B45309"], desc: "Hands-on" },
  { label: "Tech Talk",  icon: "code-slash",    grad: ["#7C3AED", "#5B21B6"], desc: "Tech session" },
  { label: "Hackathon",  icon: "trophy",        grad: ["#DC2626", "#B91C1C"], desc: "Competitive" },
  { label: "Networking", icon: "people-circle", grad: ["#0891B2", "#0E7490"], desc: "Connect" },
];

const UNIVERSITIES = [
  "Riphah International University",
];

const SUGGESTED_TAGS = [
  "AI/ML", "Web Dev", "Mobile", "Cloud", "Cybersecurity",
  "Data Science", "Internship", "Research", "Networking", "Design",
];

const STEPS = ["Event Details", "Media & Tags", "Invite Unis"];

export function EventCreationScreen() {
  const nav = useNavigation<any>();
  const { user } = useUser();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  /* ── Step 1 fields ── */
  const [eventType, setEventType] = useState<EventType>("Seminar");
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState<EventMode>("Physical");
  const [capacity, setCapacity] = useState("");
  const [deadline, setDeadline] = useState("");

  /* ── Step 2 fields ── */
  const [banner, setBanner] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

  /* ── Step 3 fields ── */
  const [selectedUnis, setSelectedUnis] = useState<string[]>(["Riphah International University"]);
  const [inviteMsg, setInviteMsg] = useState("");
  const [loading, setLoading] = useState(false);

  /* ────────────────────────── helpers ─────────────────────────── */
  const animateStep = (next: 1 | 2 | 3) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
    setStep(next);
  };

  const pickBanner = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      aspect: [16, 9],
    });
    if (!res.canceled) setBanner(res.assets[0].uri);
  };

  const toggleTag = (t: string) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const addCustomTag = () => {
    const trimmed = customTag.trim();
    if (trimmed && !tags.includes(trimmed)) { setTags((p) => [...p, trimmed]); }
    setCustomTag("");
  };

  const toggleUni = (u: string) =>
    setSelectedUnis((prev) => (prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u]));

  const validateStep1 = () => {
    if (!title.trim()) { Alert.alert("Required", "Event title is required."); return false; }
    if (!description.trim()) { Alert.alert("Required", "Description is required."); return false; }
    if (!date.trim()) { Alert.alert("Required", "Event date is required."); return false; }
    if (!location.trim() && mode !== "Virtual") {
      Alert.alert("Required", "Location is required for physical/hybrid events."); return false;
    }
    return true;
  };

  const handlePublish = async () => {
    if (selectedUnis.length === 0) {
      Alert.alert("No Universities", "Select at least one university to invite."); return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Event Published 🎉",
        `Your event has been published and invitations sent to ${selectedUnis.length} university(s).`,
        [{ text: "OK", onPress: () => nav.goBack() }]
      );
    }, 1400);
  };

  const typeConfig = EVENT_TYPES.find((e) => e.label === eventType)!;

  /* ────────────────────────── sub-renders ─────────────────────── */
  const renderStepIndicator = () => (
    <View style={s.stepIndicator}>
      {STEPS.map((lbl, i) => {
        const n = i + 1;
        const done = step > n;
        const active = step === n;
        return (
          <React.Fragment key={n}>
            <View style={s.stepItem}>
              <View style={[s.stepCircle, active && s.stepCircleActive, done && s.stepCircleDone]}>
                {done
                  ? <Ionicons name="checkmark" size={13} color="#fff" />
                  : <Text style={[s.stepCircleTxt, active && { color: "#fff" }]}>{n}</Text>
                }
              </View>
              <Text style={[s.stepLbl, active && s.stepLblActive]}>{lbl}</Text>
            </View>
            {i < STEPS.length - 1 && (
              <View style={[s.stepLine, done && s.stepLineDone]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );

  /* ── STEP 1 ── */
  const renderStep1 = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* Event type */}
      <View style={s.sec}>
        <Text style={s.secLabel}>Event Type <Text style={s.required}>*</Text></Text>
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
                <LinearGradient colors={et.grad} style={s.typeTileIcon}>
                  <Ionicons name={et.icon as any} size={20} color="#fff" />
                </LinearGradient>
                <Text style={[s.typeTileLbl, active && { color: "#0066CC" }]}>{et.label}</Text>
                <Text style={s.typeTileDesc}>{et.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Title */}
      <View style={s.sec}>
        <Text style={s.secLabel}>Event Title <Text style={s.required}>*</Text></Text>
        <TextInput
          style={s.input}
          placeholder="e.g. Flutter Development Workshop 2025"
          placeholderTextColor="#94A3B8"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* Description */}
      <View style={s.sec}>
        <Text style={s.secLabel}>Description <Text style={s.required}>*</Text></Text>
        <TextInput
          style={[s.input, s.textarea]}
          placeholder="Describe the event, agenda, and what attendees will gain..."
          placeholderTextColor="#94A3B8"
          value={description}
          onChangeText={setDesc}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Date & Time */}
      <View style={[s.sec, { flexDirection: "row", gap: 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={s.secLabel}>Date <Text style={s.required}>*</Text></Text>
          <View style={s.inputIcon}>
            <Ionicons name="calendar-outline" size={16} color="#64748B" style={s.inputIconImg} />
            <TextInput
              style={s.inputWithIcon}
              placeholder="DD MMM YYYY"
              placeholderTextColor="#94A3B8"
              value={date}
              onChangeText={setDate}
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.secLabel}>Time</Text>
          <View style={s.inputIcon}>
            <Ionicons name="time-outline" size={16} color="#64748B" style={s.inputIconImg} />
            <TextInput
              style={s.inputWithIcon}
              placeholder="e.g. 10:00 AM"
              placeholderTextColor="#94A3B8"
              value={time}
              onChangeText={setTime}
            />
          </View>
        </View>
      </View>

      {/* Mode */}
      <View style={s.sec}>
        <Text style={s.secLabel}>Event Mode</Text>
        <View style={s.modeRow}>
          {(["Physical", "Virtual", "Hybrid"] as EventMode[]).map((m) => (
            <TouchableOpacity
              key={m}
              style={[s.modeBtn, mode === m && s.modeBtnActive]}
              onPress={() => setMode(m)}
            >
              <Ionicons
                name={m === "Physical" ? "location" : m === "Virtual" ? "videocam" : "git-merge"}
                size={14}
                color={mode === m ? "#fff" : "#64748B"}
              />
              <Text style={[s.modeBtnTxt, mode === m && { color: "#fff" }]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Location */}
      {mode !== "Virtual" && (
        <View style={s.sec}>
          <Text style={s.secLabel}>
            Location <Text style={s.required}>*</Text>
          </Text>
          <View style={s.inputIcon}>
            <Ionicons name="location-outline" size={16} color="#64748B" style={s.inputIconImg} />
            <TextInput
              style={s.inputWithIcon}
              placeholder="Venue name, city"
              placeholderTextColor="#94A3B8"
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </View>
      )}
      {mode === "Virtual" && (
        <View style={s.sec}>
          <Text style={s.secLabel}>Meeting Link</Text>
          <View style={s.inputIcon}>
            <Ionicons name="link-outline" size={16} color="#64748B" style={s.inputIconImg} />
            <TextInput
              style={s.inputWithIcon}
              placeholder="https://zoom.us/j/..."
              placeholderTextColor="#94A3B8"
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </View>
      )}

      {/* Capacity & Deadline */}
      <View style={[s.sec, { flexDirection: "row", gap: 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={s.secLabel}>Capacity</Text>
          <View style={s.inputIcon}>
            <Ionicons name="people-outline" size={16} color="#64748B" style={s.inputIconImg} />
            <TextInput
              style={s.inputWithIcon}
              placeholder="e.g. 100"
              placeholderTextColor="#94A3B8"
              value={capacity}
              onChangeText={setCapacity}
              keyboardType="number-pad"
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.secLabel}>RSVP Deadline</Text>
          <View style={s.inputIcon}>
            <Ionicons name="hourglass-outline" size={16} color="#64748B" style={s.inputIconImg} />
            <TextInput
              style={s.inputWithIcon}
              placeholder="DD MMM YYYY"
              placeholderTextColor="#94A3B8"
              value={deadline}
              onChangeText={setDeadline}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );

  /* ── STEP 2 ── */
  const renderStep2 = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* Banner */}
      <View style={s.sec}>
        <Text style={s.secLabel}>Event Banner</Text>
        <TouchableOpacity style={s.bannerPicker} onPress={pickBanner} activeOpacity={0.8}>
          {banner ? (
            <Image source={{ uri: banner }} style={s.bannerImg} />
          ) : (
            <View style={s.bannerPlaceholder}>
              <View style={s.bannerIconBox}>
                <Ionicons name="image-outline" size={28} color="#94A3B8" />
              </View>
              <Text style={s.bannerPlaceholderTxt}>Tap to upload banner</Text>
              <Text style={s.bannerPlaceholderSub}>Recommended: 1200 × 675 px (16:9)</Text>
            </View>
          )}
          {banner && (
            <View style={s.bannerOverlay}>
              <Ionicons name="camera-outline" size={20} color="#fff" />
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600", marginTop: 4 }}>Change</Text>
            </View>
          )}
        </TouchableOpacity>
        {banner && (
          <TouchableOpacity onPress={() => setBanner(null)} style={s.removeBannerBtn}>
            <Ionicons name="trash-outline" size={14} color="#DC2626" />
            <Text style={{ fontSize: 12, color: "#DC2626", fontWeight: "600" }}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tags */}
      <View style={s.sec}>
        <Text style={s.secLabel}>Tags</Text>
        <Text style={s.secHint}>Help universities find your event</Text>
        <View style={s.tagGrid}>
          {SUGGESTED_TAGS.map((tag) => {
            const active = tags.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                style={[s.tagChip, active && s.tagChipActive]}
                onPress={() => toggleTag(tag)}
              >
                {active && <Ionicons name="checkmark" size={11} color="#0066CC" />}
                <Text style={[s.tagChipTxt, active && s.tagChipTxtActive]}>{tag}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom tag input */}
        <View style={s.customTagRow}>
          <TextInput
            style={[s.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Add custom tag..."
            placeholderTextColor="#94A3B8"
            value={customTag}
            onChangeText={setCustomTag}
            onSubmitEditing={addCustomTag}
            returnKeyType="done"
          />
          <TouchableOpacity style={s.addTagBtn} onPress={addCustomTag}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Selected custom tags */}
        {tags.filter((t) => !SUGGESTED_TAGS.includes(t)).length > 0 && (
          <View style={[s.tagGrid, { marginTop: 10 }]}>
            {tags
              .filter((t) => !SUGGESTED_TAGS.includes(t))
              .map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[s.tagChip, s.tagChipActive]}
                  onPress={() => toggleTag(t)}
                >
                  <Ionicons name="close" size={11} color="#0066CC" />
                  <Text style={[s.tagChipTxt, s.tagChipTxtActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
          </View>
        )}
      </View>

      {/* Preview card */}
      <View style={s.sec}>
        <Text style={s.secLabel}>Preview</Text>
        <View style={s.previewCard}>
          <LinearGradient colors={typeConfig.grad} style={s.previewStripe} />
          <View style={{ padding: 14 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <LinearGradient colors={typeConfig.grad} style={s.previewTypeIcon}>
                <Ionicons name={typeConfig.icon as any} size={14} color="#fff" />
              </LinearGradient>
              <View style={[s.typeBadge, { backgroundColor: typeConfig.grad[0] + "20" }]}>
                <Text style={[s.typeBadgeTxt, { color: typeConfig.grad[0] }]}>{eventType}</Text>
              </View>
            </View>
            <Text style={s.previewTitle} numberOfLines={1}>{title || "Event Title"}</Text>
            {date ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 6 }}>
                <Ionicons name="calendar-outline" size={12} color="#64748B" />
                <Text style={s.previewMeta}>{date}{time ? ` · ${time}` : ""}</Text>
              </View>
            ) : null}
            {location ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 }}>
                <Ionicons name="location-outline" size={12} color="#64748B" />
                <Text style={s.previewMeta}>{location}</Text>
              </View>
            ) : null}
            {tags.length > 0 && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                {tags.slice(0, 4).map((t) => (
                  <View key={t} style={s.previewTag}>
                    <Text style={s.previewTagTxt}>{t}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );

  /* ── STEP 3 ── */
  const renderStep3 = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={s.sec}>
        <Text style={s.secLabel}>Select Universities</Text>
        <Text style={s.secHint}>
          {selectedUnis.length === 0
            ? "Tap to select universities to invite"
            : `${selectedUnis.length} university(s) selected`}
        </Text>

        {/* Select all / Clear */}
        <View style={s.uniActions}>
          <TouchableOpacity
            style={s.uniActionBtn}
            onPress={() => setSelectedUnis([...UNIVERSITIES])}
          >
            <Ionicons name="checkmark-done-outline" size={14} color="#0066CC" />
            <Text style={s.uniActionTxt}>Select All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.uniActionBtn}
            onPress={() => setSelectedUnis([])}
          >
            <Ionicons name="close-circle-outline" size={14} color="#DC2626" />
            <Text style={[s.uniActionTxt, { color: "#DC2626" }]}>Clear</Text>
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
              <View style={[s.uniCheckBox, sel && s.uniCheckBoxActive]}>
                {sel && <Ionicons name="checkmark" size={13} color="#fff" />}
              </View>
              <View style={s.uniAvatarBox}>
                <Ionicons name="school" size={16} color={sel ? "#0066CC" : "#64748B"} />
              </View>
              <Text style={[s.uniName, sel && { color: "#0A1628", fontWeight: "700" }]}>{u}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Invite message */}
      <View style={s.sec}>
        <Text style={s.secLabel}>Invitation Message</Text>
        <Text style={s.secHint}>Personalise the message sent to universities</Text>
        <TextInput
          style={[s.input, s.textarea]}
          placeholder={`Dear [University Name],\n\nWe would like to invite your students to our event...`}
          placeholderTextColor="#94A3B8"
          value={inviteMsg}
          onChangeText={setInviteMsg}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
      </View>

      {/* Summary before publish */}
      {selectedUnis.length > 0 && (
        <View style={s.sec}>
          <View style={s.summaryCard}>
            <Text style={s.summaryTitle}>Ready to Publish</Text>
            <View style={s.summaryRow}>
              <Ionicons name="calendar" size={14} color="#0066CC" />
              <Text style={s.summaryTxt}>{title || "Untitled Event"}</Text>
            </View>
            <View style={s.summaryRow}>
              <Ionicons name="school" size={14} color="#0066CC" />
              <Text style={s.summaryTxt}>
                {selectedUnis.length} universit{selectedUnis.length > 1 ? "ies" : "y"} will receive invitations
              </Text>
            </View>
            {tags.length > 0 && (
              <View style={s.summaryRow}>
                <Ionicons name="pricetag" size={14} color="#0066CC" />
                <Text style={s.summaryTxt}>{tags.join(", ")}</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </Animated.View>
  );

  /* ─────────────────────────── main render ─────────────────────── */
  return (
    <View style={{ flex: 1, backgroundColor: "#F0F4F8" }}>
      <StatusBar barStyle="light-content" backgroundColor="#050D1A" />

      {/* ── Header ── */}
      <LinearGradient
        colors={["#050D1A", "#0A1628", "#0D2137"]}
        style={s.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={s.headerRow}>
          <TouchableOpacity onPress={() => nav.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={21} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={s.headerTitle}>Create Event</Text>
            <Text style={s.headerSub}>Step {step} of {STEPS.length} — {STEPS[step - 1]}</Text>
          </View>
          {/* Type badge in header */}
          <LinearGradient colors={typeConfig.grad} style={s.headerTypeBadge}>
            <Ionicons name={typeConfig.icon as any} size={14} color="#fff" />
            <Text style={s.headerTypeTxt}>{eventType}</Text>
          </LinearGradient>
        </View>
        {renderStepIndicator()}
      </LinearGradient>

      {/* ── Content ── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Bottom nav ── */}
      <View style={[s.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : 16 }]}>
        {step > 1 && (
          <TouchableOpacity
            style={s.backStepBtn}
            onPress={() => animateStep((step - 1) as 1 | 2 | 3)}
          >
            <Ionicons name="chevron-back" size={18} color="#334155" />
            <Text style={s.backStepTxt}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[s.nextBtn, { flex: step > 1 ? 1 : undefined, width: step === 1 ? "100%" : undefined }]}
          activeOpacity={0.88}
          onPress={() => {
            if (step === 1) {
              if (validateStep1()) animateStep(2);
            } else if (step === 2) {
              animateStep(3);
            } else {
              handlePublish();
            }
          }}
          disabled={loading}
        >
          <LinearGradient
            colors={loading ? ["#94A3B8", "#94A3B8"] : typeConfig.grad}
            style={s.nextBtnGrad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <>
                <Text style={s.nextBtnTxt}>Publishing...</Text>
              </>
            ) : step < 3 ? (
              <>
                <Text style={s.nextBtnTxt}>Continue</Text>
                <Ionicons name="chevron-forward" size={18} color="#fff" />
              </>
            ) : (
              <>
                <Ionicons name="send" size={16} color="#fff" />
                <Text style={s.nextBtnTxt}>Publish & Send Invites</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ═══════════════════════════════ styles ═══════════════════════════════ */
const s = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === "ios" ? 56 : 44,
    paddingHorizontal: 18,
    paddingBottom: 20,
  },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.09)",
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: { fontSize: 19, fontWeight: "900", color: "#fff" },
  headerSub: { fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 },
  headerTypeBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
  },
  headerTypeTxt: { fontSize: 12, fontWeight: "700", color: "#fff" },

  /* Step indicator */
  stepIndicator: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14, padding: 12,
  },
  stepItem: { alignItems: "center", gap: 5 },
  stepCircle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center", alignItems: "center",
  },
  stepCircleActive: { backgroundColor: "#0066CC" },
  stepCircleDone: { backgroundColor: "#059669" },
  stepCircleTxt: { fontSize: 12, fontWeight: "700", color: "rgba(255,255,255,0.5)" },
  stepLbl: { fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: "600" },
  stepLblActive: { color: "#fff" },
  stepLine: {
    flex: 1, height: 2, backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 2, marginHorizontal: 4, marginBottom: 14,
  },
  stepLineDone: { backgroundColor: "#059669" },

  /* Sections */
  sec: { paddingHorizontal: 16, paddingTop: 18 },
  secLabel: { fontSize: 13, fontWeight: "700", color: "#0A1628", marginBottom: 8 },
  secHint: { fontSize: 12, color: "#64748B", marginBottom: 10, marginTop: -4 },
  required: { color: "#DC2626" },

  /* Type grid */
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  typeTile: {
    backgroundColor: "#fff", borderRadius: 16, padding: 12,
    alignItems: "center", borderWidth: 2, borderColor: "#E2E8F0",
  },
  typeTileActive: { borderColor: "#0066CC", backgroundColor: "#EFF6FF" },
  typeTileIcon: { width: 46, height: 46, borderRadius: 13, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  typeTileLbl: { fontSize: 11, fontWeight: "700", color: "#334155" },
  typeTileDesc: { fontSize: 9, color: "#94A3B8", textAlign: "center", marginTop: 2 },
  typeBadge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 },
  typeBadgeTxt: { fontSize: 11, fontWeight: "700" },

  /* Inputs */
  input: {
    backgroundColor: "#fff", borderRadius: 12, borderWidth: 1.5,
    borderColor: "#E2E8F0", paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: "#0A1628", marginBottom: 0,
  },
  textarea: { minHeight: 100, paddingTop: 12 },
  inputIcon: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 12,
    borderWidth: 1.5, borderColor: "#E2E8F0", overflow: "hidden",
  },
  inputIconImg: { paddingLeft: 14 },
  inputWithIcon: { flex: 1, paddingHorizontal: 10, paddingVertical: 12, fontSize: 14, color: "#0A1628" },

  /* Mode */
  modeRow: { flexDirection: "row", gap: 10 },
  modeBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 10, borderRadius: 12,
    backgroundColor: "#F8FAFC", borderWidth: 1.5, borderColor: "#E2E8F0",
  },
  modeBtnActive: { backgroundColor: "#0A1628", borderColor: "#0A1628" },
  modeBtnTxt: { fontSize: 12, fontWeight: "700", color: "#64748B" },

  /* Banner */
  bannerPicker: {
    height: 180, borderRadius: 16, backgroundColor: "#F8FAFC",
    borderWidth: 2, borderColor: "#E2E8F0", borderStyle: "dashed",
    overflow: "hidden", justifyContent: "center",
  },
  bannerImg: { width: "100%", height: "100%", resizeMode: "cover" },
  bannerPlaceholder: { alignItems: "center", justifyContent: "center", padding: 20 },
  bannerIconBox: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: "#EFF6FF",
    justifyContent: "center", alignItems: "center", marginBottom: 10,
  },
  bannerPlaceholderTxt: { fontSize: 14, fontWeight: "700", color: "#334155" },
  bannerPlaceholderSub: { fontSize: 12, color: "#94A3B8", marginTop: 4 },
  bannerOverlay: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center",
    justifyContent: "center", paddingVertical: 10,
  },
  removeBannerBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    marginTop: 8, alignSelf: "flex-end",
  },

  /* Tags */
  tagGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tagChip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    backgroundColor: "#F1F5F9", borderWidth: 1.5, borderColor: "#E2E8F0",
  },
  tagChipActive: { backgroundColor: "#EFF6FF", borderColor: "#0066CC" },
  tagChipTxt: { fontSize: 12, fontWeight: "600", color: "#64748B" },
  tagChipTxtActive: { color: "#0066CC" },
  customTagRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 },
  addTagBtn: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: "#0066CC",
    justifyContent: "center", alignItems: "center",
  },

  /* Preview card */
  previewCard: {
    backgroundColor: "#fff", borderRadius: 16, overflow: "hidden",
    borderWidth: 1, borderColor: "#E2E8F0",
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  previewStripe: { height: 4, width: "100%" },
  previewTypeIcon: { width: 30, height: 30, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  previewTitle: { fontSize: 15, fontWeight: "800", color: "#0A1628" },
  previewMeta: { fontSize: 12, color: "#64748B" },
  previewTag: { backgroundColor: "#F1F5F9", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  previewTagTxt: { fontSize: 11, fontWeight: "600", color: "#475569" },

  /* Universities */
  uniActions: { flexDirection: "row", gap: 10, marginBottom: 12 },
  uniActionBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10,
    backgroundColor: "#F1F5F9", borderWidth: 1, borderColor: "#E2E8F0",
  },
  uniActionTxt: { fontSize: 12, fontWeight: "600", color: "#0066CC" },
  uniRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    backgroundColor: "#fff", borderRadius: 13, marginBottom: 8,
    borderWidth: 1.5, borderColor: "#E2E8F0",
  },
  uniRowActive: { borderColor: "#0066CC", backgroundColor: "#EFF6FF" },
  uniCheckBox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2,
    borderColor: "#CBD5E1", justifyContent: "center", alignItems: "center",
  },
  uniCheckBoxActive: { backgroundColor: "#0066CC", borderColor: "#0066CC" },
  uniAvatarBox: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: "#F1F5F9",
    justifyContent: "center", alignItems: "center",
  },
  uniName: { flex: 1, fontSize: 13, fontWeight: "600", color: "#475569" },

  /* Summary card */
  summaryCard: {
    backgroundColor: "#EFF6FF", borderRadius: 14,
    padding: 16, borderWidth: 1.5, borderColor: "#BFDBFE",
  },
  summaryTitle: { fontSize: 13, fontWeight: "800", color: "#0A1628", marginBottom: 10 },
  summaryRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  summaryTxt: { fontSize: 13, color: "#334155", flex: 1 },

  /* Bottom bar */
  bottomBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 12,
    borderTopWidth: 1, borderColor: "#F1F5F9",
    flexDirection: "row", gap: 10,
  },
  backStepBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 16, paddingVertical: 14,
    borderRadius: 14, backgroundColor: "#F1F5F9", borderWidth: 1.5, borderColor: "#E2E8F0",
  },
  backStepTxt: { fontSize: 14, fontWeight: "700", color: "#334155" },
  nextBtn: { borderRadius: 14, overflow: "hidden" },
  nextBtnGrad: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 14, paddingHorizontal: 24,
  },
  nextBtnTxt: { fontSize: 15, fontWeight: "800", color: "#fff" },
});