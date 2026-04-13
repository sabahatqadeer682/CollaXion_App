/**
 * EventsManageScreen.tsx
 * Dashboard par events dikhata hai — created time, edited time,
 * edit / hide / delete actions, color theme #193648
 */

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "./shared";   // adjust path if needed

const { width } = Dimensions.get("window");

// ── colour theme ─────────────────────────────────────────────────
const THEME = {
  bg:       "#0D1F2D",
  card:     "#142736",
  border:   "#1E3448",
  accent:   "#2196F3",
  green:    "#22C55E",
  red:      "#EF4444",
  amber:    "#F59E0B",
  muted:    "#4A6174",
  text:     "#E8F0F7",
  sub:      "#7A9BB5",
  white:    "#FFFFFF",
};

const TYPE_COLORS: Record<string, { grad: [string, string]; icon: string }> = {
  Seminar:    { grad: ["#1565C0", "#0D47A1"], icon: "mic" },
  "Job Fair": { grad: ["#1B5E20", "#2E7D32"], icon: "briefcase" },
  Workshop:   { grad: ["#E65100", "#BF360C"], icon: "build" },
  "Tech Talk":{ grad: ["#4A148C", "#6A1B9A"], icon: "code-slash" },
  Hackathon:  { grad: ["#B71C1C", "#C62828"], icon: "trophy" },
  Networking: { grad: ["#006064", "#00838F"], icon: "people-circle" },
};

// ── time helpers ─────────────────────────────────────────────────
function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7)  return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
}

function formatTimestamp(iso: string | null | undefined, label: string): string {
  if (!iso) return "";
  return `${label} ${timeAgo(iso)}`;
}

// ─────────────────────────────────────────────────────────────────
export function EventsManageScreen() {
  const nav    = useNavigation<any>();
  const { user, ax } = useUser();
  const insets = useSafeAreaInsets();

  const [events,     setEvents]     = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const a = ax();
      const res = await a.get("/api/industry/events/mine", {
        headers: { "x-industry-id": user?._id, "x-company-name": user?.name },
      });
      setEvents(res.data?.events || []);
    } catch (e: any) {
      console.log("EventsManage load error:", e?.response?.status, e?.response?.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?._id]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => { setRefreshing(true); load(); };

  // ── Delete ──────────────────────────────────────────────────────
  const handleDelete = (event: any) => {
    Alert.alert(
      "Delete Event",
      `"${event.title}" permanently delete ho jayega. Sure ho?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const a = ax();
              await a.delete(`/api/industry/events/${event._id}`, {
                headers: { "x-industry-id": user?._id },
              });
              setEvents((prev) => prev.filter((e) => e._id !== event._id));
            } catch (err: any) {
              Alert.alert("Error", err?.response?.data?.message || "Delete failed");
            }
          },
        },
      ]
    );
  };

  // ── Hide / Show toggle ──────────────────────────────────────────
  const handleToggleHide = async (event: any) => {
    try {
      const a = ax();
      const res = await a.patch(`/api/industry/events/${event._id}/hide`, {}, {
        headers: { "x-industry-id": user?._id },
      });
      const newStatus = res.data?.status;
      setEvents((prev) =>
        prev.map((e) => (e._id === event._id ? { ...e, status: newStatus } : e))
      );
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Toggle failed");
    }
  };

  // ── Edit → navigate to EventCreationScreen with prefilled data ──
  const handleEdit = (event: any) => {
    nav.navigate("EventCreation", { editMode: true, eventData: event });
  };

  // ── Empty state ─────────────────────────────────────────────────
  const renderEmpty = () => (
    <View style={s.emptyWrap}>
      <LinearGradient colors={["#142736", "#1E3448"]} style={s.emptyCard}>
        <View style={s.emptyIconBox}>
          <Ionicons name="calendar-outline" size={34} color={THEME.accent} />
        </View>
        <Text style={s.emptyTitle}>Koi Event Nahi</Text>
        <Text style={s.emptySub}>Pehla event create karein aur universities ko invite karein</Text>
        <TouchableOpacity
          style={s.emptyBtn}
          onPress={() => nav.navigate("EventCreation")}
        >
          <LinearGradient colors={["#1565C0", "#0D47A1"]} style={s.emptyBtnGrad}>
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={s.emptyBtnTxt}>Event Create Karein</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  // ── Event card ──────────────────────────────────────────────────
  const renderCard = (event: any) => {
    const tc      = TYPE_COLORS[event.eventType] || TYPE_COLORS["Seminar"];
    const hidden  = event.status === "hidden";
    const isEdited = !!event.lastEditedAt;

    return (
      <View key={event._id} style={[s.card, hidden && s.cardHidden]}>
        {/* Top stripe */}
        <LinearGradient colors={hidden ? ["#2A3D4D", "#1E3448"] : tc.grad} style={s.stripe} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />

       <View style={s.cardBody}>

  {event.banner && (
    <Image
      source={{ uri: event.banner }}
      style={{
        width: "100%",
        height: 160,
        borderRadius: 12,
        marginBottom: 10,
      }}
    />
  )}
            
          {/* Row 1: type badge + status */}
          <View style={s.cardRow}>
            <View style={[s.typeBadge, { backgroundColor: tc.grad[0] + (hidden ? "40" : "25") }]}>
              <Ionicons name={tc.icon as any} size={11} color={hidden ? THEME.muted : tc.grad[0]} />
              <Text style={[s.typeBadgeTxt, { color: hidden ? THEME.muted : tc.grad[0] }]}>
                {event.eventType}
              </Text>
            </View>
            <View style={[s.statusBadge, { backgroundColor: hidden ? "#2A3D4D" : "#1B5E20" + "40" }]}>
              <View style={[s.statusDot, { backgroundColor: hidden ? THEME.muted : THEME.green }]} />
              <Text style={[s.statusTxt, { color: hidden ? THEME.muted : THEME.green }]}>
                {hidden ? "Hidden" : "Published"}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text style={[s.cardTitle, hidden && { color: THEME.muted }]} numberOfLines={2}>
            {event.title}
          </Text>

          {/* Meta row */}
          <View style={s.metaRow}>
            {event.date ? (
              <View style={s.metaItem}>
                <Ionicons name="calendar-outline" size={11} color={THEME.sub} />
                <Text style={s.metaTxt}>{event.date}{event.time ? ` · ${event.time}` : ""}</Text>
              </View>
            ) : null}
            {event.location ? (
              <View style={s.metaItem}>
                <Ionicons name="location-outline" size={11} color={THEME.sub} />
                <Text style={s.metaTxt} numberOfLines={1}>{event.location}</Text>
              </View>
            ) : null}
            {event.invitedUniversities?.length > 0 && (
              <View style={s.metaItem}>
                <Ionicons name="school-outline" size={11} color={THEME.sub} />
                <Text style={s.metaTxt}>{event.invitedUniversities.length} uni(s) invited</Text>
              </View>
            )}
          </View>

          {/* Tags */}
          {event.tags?.length > 0 && (
            <View style={s.tagRow}>
              {event.tags.slice(0, 4).map((t: string) => (
                <View key={t} style={s.tagChip}>
                  <Text style={s.tagChipTxt}>{t}</Text>
                </View>
              ))}
              {event.tags.length > 4 && (
                <Text style={s.tagMore}>+{event.tags.length - 4}</Text>
              )}
            </View>
          )}

          {/* Timestamps — Facebook style */}
          <View style={s.timeRow}>
            <Ionicons name="time-outline" size={11} color={THEME.muted} />
            <Text style={s.timeTxt}>
              Posted {timeAgo(event.createdAt)}
              {isEdited
                ? ` · Edited ${timeAgo(event.lastEditedAt)}`
                : ""}
            </Text>
          </View>

          {/* Action buttons */}
          <View style={s.actions}>
            <TouchableOpacity style={s.actionBtn} onPress={() => handleEdit(event)}>
              <Ionicons name="create-outline" size={14} color={THEME.accent} />
              <Text style={[s.actionTxt, { color: THEME.accent }]}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.actionBtn, { borderColor: hidden ? THEME.green + "50" : THEME.amber + "50" }]}
              onPress={() => handleToggleHide(event)}
            >
              <Ionicons
                name={hidden ? "eye-outline" : "eye-off-outline"}
                size={14}
                color={hidden ? THEME.green : THEME.amber}
              />
              <Text style={[s.actionTxt, { color: hidden ? THEME.green : THEME.amber }]}>
                {hidden ? "Show" : "Hide"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.actionBtn, { borderColor: THEME.red + "50" }]}
              onPress={() => handleDelete(event)}
            >
              <Ionicons name="trash-outline" size={14} color={THEME.red} />
              <Text style={[s.actionTxt, { color: THEME.red }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: THEME.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.bg} />

      {/* Header */}
      <LinearGradient
        colors={["#0A1929", "#112030", "#193648"]}
        style={[s.header, { paddingTop: Platform.OS === "ios" ? 56 : 44 + (insets.top || 0) }]}
      >
        <View style={s.headerRow}>
          <TouchableOpacity onPress={() => nav.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={20} color={THEME.text} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={s.headerTitle}>My Events</Text>
            <Text style={s.headerSub}>{events.length} event{events.length !== 1 ? "s" : ""}</Text>
          </View>
          <TouchableOpacity
            style={s.createBtn}
            onPress={() => nav.navigate("EventCreation")}
          >
            <LinearGradient colors={["#1565C0", "#0D47A1"]} style={s.createBtnGrad}>
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={s.createBtnTxt}>New</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* List */}
      {loading ? (
        <View style={s.loadingWrap}>
          <Text style={{ color: THEME.sub, fontSize: 14 }}>Events load ho rahe hain...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={THEME.accent}
            />
          }
        >
          {events.length === 0 ? renderEmpty() : events.map(renderCard)}
        </ScrollView>
      )}
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  header: { paddingHorizontal: 18, paddingBottom: 18 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.07)",
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: THEME.text },
  headerSub:   { fontSize: 12, color: THEME.sub, marginTop: 2 },
  createBtn:   { borderRadius: 12, overflow: "hidden" },
  createBtnGrad: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 14, paddingVertical: 9 },
  createBtnTxt:  { fontSize: 13, fontWeight: "700", color: "#fff" },

  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },

  card: {
    backgroundColor: THEME.card, borderRadius: 18, marginBottom: 14,
    borderWidth: 1, borderColor: THEME.border, overflow: "hidden",
  },
  cardHidden: { opacity: 0.65 },
  stripe: { height: 4 },
  cardBody: { padding: 14 },

  cardRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },

  typeBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  typeBadgeTxt: { fontSize: 11, fontWeight: "700" },

  statusBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusDot:   { width: 6, height: 6, borderRadius: 3 },
  statusTxt:   { fontSize: 11, fontWeight: "700" },

  cardTitle: { fontSize: 15, fontWeight: "800", color: THEME.text, marginBottom: 10, lineHeight: 21 },

  metaRow:  { gap: 6, marginBottom: 10 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaTxt:  { fontSize: 12, color: THEME.sub },

  tagRow:    { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 },
  tagChip:   { backgroundColor: "#1E3448", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: "#2A4A62" },
  tagChipTxt:{ fontSize: 11, fontWeight: "600", color: THEME.sub },
  tagMore:   { fontSize: 11, color: THEME.muted, alignSelf: "center" },

  timeRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 12 },
  timeTxt: { fontSize: 11, color: THEME.muted, fontStyle: "italic" },

  actions: { flexDirection: "row", gap: 8 },
  actionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5,
    paddingVertical: 9, borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: THEME.border,
  },
  actionTxt: { fontSize: 12, fontWeight: "700" },

  emptyWrap: { paddingTop: 40, paddingHorizontal: 16 },
  emptyCard: { borderRadius: 20, padding: 32, alignItems: "center", borderWidth: 1, borderColor: THEME.border },
  emptyIconBox: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: "rgba(33,150,243,0.12)",
    justifyContent: "center", alignItems: "center", marginBottom: 16,
  },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: THEME.text, marginBottom: 6 },
  emptySub:   { fontSize: 13, color: THEME.sub, textAlign: "center", lineHeight: 19, marginBottom: 20 },
  emptyBtn:   { borderRadius: 12, overflow: "hidden" },
  emptyBtnGrad: { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 20, paddingVertical: 12 },
  emptyBtnTxt:  { fontSize: 14, fontWeight: "700", color: "#fff" },
});