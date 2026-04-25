import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
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
import { useUser } from "./shared";

const { width } = Dimensions.get("window");

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
  red:      "#DC2626",
  amber:    "#D97706",
  blue:     "#2563EB",
  accent:   "#1A3C4E",
};

const TYPE_COLORS: Record<string, { bg: string; textColor: string; icon: string }> = {
  Seminar:     { bg: "#EFF6FF", textColor: "#1D4ED8", icon: "mic" },
  "Job Fair":  { bg: "#F0FDF4", textColor: "#15803D", icon: "briefcase" },
  Workshop:    { bg: "#FFF7ED", textColor: "#C2410C", icon: "build" },
  "Tech Talk": { bg: "#FAF5FF", textColor: "#7C3AED", icon: "code-slash" },
  Hackathon:   { bg: "#FEF2F2", textColor: "#B91C1C", icon: "trophy" },
  Networking:  { bg: "#ECFEFF", textColor: "#0E7490", icon: "people-circle" },
};

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

  const handleEdit = (event: any) => {
    nav.navigate("EventCreation", { editMode: true, eventData: event });
  };

  const renderEmpty = () => (
    <View style={s.emptyWrap}>
      <View style={s.emptyCard}>
        <View style={s.emptyIconBox}>
          <Ionicons name="calendar-outline" size={34} color={T.navy} />
        </View>
        <Text style={s.emptyTitle}>Koi Event Nahi</Text>
        <Text style={s.emptySub}>Pehla event create karein aur universities ko invite karein</Text>
        <TouchableOpacity
          style={s.emptyBtn}
          onPress={() => nav.navigate("EventCreation")}
        >
          <View style={s.emptyBtnInner}>
            <Ionicons name="add" size={16} color={T.white} />
            <Text style={s.emptyBtnTxt}>Event Create Karein</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCard = (event: any) => {
    const tc      = TYPE_COLORS[event.eventType] || TYPE_COLORS["Seminar"];
    const hidden  = event.status === "hidden";
    const isEdited = !!event.lastEditedAt;

    return (
      <View key={event._id} style={[s.card, hidden && s.cardHidden]}>
        {/* Top stripe */}
        <View style={[s.stripe, { backgroundColor: hidden ? T.muted : tc.textColor }]} />

        <View style={s.cardBody}>
          {(() => {
            const validBanner =
              typeof event.banner === "string" &&
              (event.banner.startsWith("data:") || /^https?:\/\//i.test(event.banner));
            if (validBanner) {
              return (
                <Image
                  key={event.banner.slice(0,32)}
                  source={{ uri: event.banner }}
                  style={{ width: "100%", height: 160, borderRadius: 12, marginBottom: 10 }}
                />
              );
            }
            // Fallback when banner is missing OR a stale file:// path
            return (
              <View style={{
                width:"100%", height:160, borderRadius:12, marginBottom:10,
                backgroundColor: tc.bg,
                justifyContent:"center", alignItems:"center",
                borderWidth:1, borderColor:"#E2E8F0",
              }}>
                <Ionicons name={tc.icon as any} size={36} color={tc.textColor} />
                <Text style={{ color: tc.textColor, fontWeight:"800", marginTop:6, fontSize:13 }}>
                  {event.title}
                </Text>
                {event.banner ? (
                  <Text style={{ color:"#94A3B8", fontSize:10, marginTop:2 }}>
                    Banner unavailable — edit to re-upload
                  </Text>
                ) : null}
              </View>
            );
          })()}

          {/* Row 1: type badge + status */}
          <View style={s.cardRow}>
            <View style={[s.typeBadge, { backgroundColor: hidden ? "#F1F5F9" : tc.bg }]}>
              <Ionicons name={tc.icon as any} size={11} color={hidden ? T.muted : tc.textColor} />
              <Text style={[s.typeBadgeTxt, { color: hidden ? T.muted : tc.textColor }]}>
                {event.eventType}
              </Text>
            </View>
            <View style={[s.statusBadge, { backgroundColor: hidden ? "#F1F5F9" : "#F0FDF4" }]}>
              <View style={[s.statusDot, { backgroundColor: hidden ? T.muted : T.green }]} />
              <Text style={[s.statusTxt, { color: hidden ? T.muted : T.green }]}>
                {hidden ? "Hidden" : "Published"}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text style={[s.cardTitle, hidden && { color: T.muted }]} numberOfLines={2}>
            {event.title}
          </Text>

          {/* Meta row */}
          <View style={s.metaRow}>
            {event.date ? (
              <View style={s.metaItem}>
                <Ionicons name="calendar-outline" size={11} color={T.sub} />
                <Text style={s.metaTxt}>{event.date}{event.time ? ` · ${event.time}` : ""}</Text>
              </View>
            ) : null}
            {event.location ? (
              <View style={s.metaItem}>
                <Ionicons name="location-outline" size={11} color={T.sub} />
                <Text style={s.metaTxt} numberOfLines={1}>{event.location}</Text>
              </View>
            ) : null}
            {event.invitedUniversities?.length > 0 && (
              <View style={s.metaItem}>
                <Ionicons name="school-outline" size={11} color={T.sub} />
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

          {/* Timestamps */}
          <View style={s.timeRow}>
            <Ionicons name="time-outline" size={11} color={T.muted} />
            <Text style={s.timeTxt}>
              Posted {timeAgo(event.createdAt)}
              {isEdited ? ` · Edited ${timeAgo(event.lastEditedAt)}` : ""}
            </Text>
          </View>

          {/* Action buttons */}
          <View style={s.actions}>
            <TouchableOpacity style={s.actionBtn} onPress={() => handleEdit(event)}>
              <Ionicons name="create-outline" size={14} color={T.blue} />
              <Text style={[s.actionTxt, { color: T.blue }]}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.actionBtn, { borderColor: hidden ? "#BBF7D0" : "#FDE68A" }]}
              onPress={() => handleToggleHide(event)}
            >
              <Ionicons
                name={hidden ? "eye-outline" : "eye-off-outline"}
                size={14}
                color={hidden ? T.green : T.amber}
              />
              <Text style={[s.actionTxt, { color: hidden ? T.green : T.amber }]}>
                {hidden ? "Show" : "Hide"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.actionBtn, { borderColor: "#FECACA" }]}
              onPress={() => handleDelete(event)}
            >
              <Ionicons name="trash-outline" size={14} color={T.red} />
              <Text style={[s.actionTxt, { color: T.red }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={T.header} />

      {/* Header */}
      <View style={[s.header, { paddingTop: Platform.OS === "ios" ? 56 : 44 + (insets.top || 0) }]}>
        <View style={s.headerRow}>
          <TouchableOpacity onPress={() => nav.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={20} color={T.white} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={s.headerTitle}>My Events</Text>
            <Text style={s.headerSub}>{events.length} event{events.length !== 1 ? "s" : ""}</Text>
          </View>
          <TouchableOpacity
            style={s.createBtn}
            onPress={() => nav.navigate("EventCreation")}
          >
            <View style={s.createBtnInner}>
              <Ionicons name="add" size={16} color={T.white} />
              <Text style={s.createBtnTxt}>New</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      {loading ? (
        <View style={s.loadingWrap}>
          <Text style={{ color: T.sub, fontSize: 14 }}>Events load ho rahe hain...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={T.navy}
            />
          }
        >
          {events.length === 0 ? renderEmpty() : events.map(renderCard)}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  header: { backgroundColor: T.header, paddingHorizontal: 18, paddingBottom: 18 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: T.white },
  headerSub:   { fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 },
  createBtn:   { borderRadius: 12, overflow: "hidden" },
  createBtnInner: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 14, paddingVertical: 9,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
  },
  createBtnTxt:  { fontSize: 13, fontWeight: "700", color: T.white },

  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },

  card: {
    backgroundColor: T.card, borderRadius: 18, marginBottom: 14,
    borderWidth: 1, borderColor: T.border, overflow: "hidden",
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
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

  cardTitle: { fontSize: 15, fontWeight: "800", color: T.text, marginBottom: 10, lineHeight: 21 },

  metaRow:  { gap: 6, marginBottom: 10 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaTxt:  { fontSize: 12, color: T.sub },

  tagRow:    { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 },
  tagChip:   { backgroundColor: "#F1F5F9", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: T.border },
  tagChipTxt:{ fontSize: 11, fontWeight: "600", color: T.sub },
  tagMore:   { fontSize: 11, color: T.muted, alignSelf: "center" },

  timeRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 12 },
  timeTxt: { fontSize: 11, color: T.muted, fontStyle: "italic" },

  actions: { flexDirection: "row", gap: 8 },
  actionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5,
    paddingVertical: 9, borderRadius: 11,
    backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: T.border,
  },
  actionTxt: { fontSize: 12, fontWeight: "700" },

  emptyWrap: { paddingTop: 40, paddingHorizontal: 16 },
  emptyCard: {
    backgroundColor: T.card, borderRadius: 20, padding: 32,
    alignItems: "center", borderWidth: 1, borderColor: T.border,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  emptyIconBox: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: "#EFF6FF",
    justifyContent: "center", alignItems: "center", marginBottom: 16,
  },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: T.text, marginBottom: 6 },
  emptySub:   { fontSize: 13, color: T.sub, textAlign: "center", lineHeight: 19, marginBottom: 20 },
  emptyBtn:   { borderRadius: 12, overflow: "hidden" },
  emptyBtnInner: {
    flexDirection: "row", alignItems: "center", gap: 7,
    paddingHorizontal: 20, paddingVertical: 12,
    backgroundColor: T.navy, borderRadius: 12,
  },
  emptyBtnTxt:  { fontSize: 14, fontWeight: "700", color: T.white },
});