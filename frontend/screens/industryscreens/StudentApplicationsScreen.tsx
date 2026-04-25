import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";

import { CONSTANT } from "@/constants/constant";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

const API = `${CONSTANT.API_BASE_URL}/api/industry`;

// ─── Types ────────────────────────────────────────────────────────────────────
type IndustryStatus = "pending" | "approved" | "rejected";

interface ResolvedStudent {
  _id?: string;
  name: string;
  email: string;
  department?: string;
  semester?: string;
  phone?: string;
  cgpa?: string;
  rollNumber?: string;
  cvUrl?: string;
  profileImage?: string;
}

interface ResolvedInternship {
  _id?: string;
  title: string;
  company: string;
  type?: string;
  requiredSkills?: string[];
  description?: string;
  deadline?: string;
}

interface Application {
  _id: string;
  studentId: ResolvedStudent;
  internshipId: ResolvedInternship;
  status: string;
  industryStatus: IndustryStatus;
  matchScore?: number;
  matchingSkills?: string[];
  missingSkills?: string[];
  appliedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  studentEmail?: string;
  cvSnapshot?: string;
  internshipInchargeApproval?: { remarks?: string; approvedAt?: string };
  industryLiaisonApproval?: { remarks?: string };
  industryApproval?: { remarks?: string; approvedAt?: string };
}

interface Stats {
  total: number; pending: number; approved: number; rejected: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (iso?: string) => {
  if (!iso) return "—";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const initials = (name = "") =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

const resolveImgUri = (path?: string) => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${CONSTANT.API_BASE_URL}${path}`;
};

// ─── Color Palette (matching screenshot) ──────────────────────────────────────
const NAVY = "#0D1B2A";        // primary dark navy
const NAVY_MID = "#1B2A3B";   // slightly lighter navy for cards in header
const WHITE = "#FFFFFF";
const OFF_WHITE = "#F5F7FA";
const BORDER = "#E8ECF0";

// ─── Status / Type configs ────────────────────────────────────────────────────
const SC: Record<IndustryStatus, { color: string; bg: string; icon: string; label: string }> = {
  pending:  { color: "#B45309", bg: "#FEF3C7", icon: "time-outline",         label: "Pending Review" },
  approved: { color: "#047857", bg: "#D1FAE5", icon: "checkmark-circle",     label: "Approved"       },
  rejected: { color: "#B91C1C", bg: "#FEE2E2", icon: "close-circle-outline", label: "Rejected"       },
};

const TC: Record<string, { color: string; bg: string }> = {
  Internship: { color: "#0D1B2A", bg: "#E8ECF0" },
  Project:    { color: "#5B21B6", bg: "#EDE9FE" },
  Workshop:   { color: "#C2410C", bg: "#FFEDD5" },
  Research:   { color: "#0E7490", bg: "#CFFAFE" },
};
const getTC = (type?: string) => TC[type ?? ""] ?? TC.Internship;

// ─────────────────────────────────────────────────────────────────────────────
// Detail Modal (bottom sheet)
// ─────────────────────────────────────────────────────────────────────────────
interface DetailModalProps {
  app: Application | null;
  onClose: () => void;
  onApprove: (id: string, remarks: string) => void;
  onReject: (id: string, remarks: string) => void;
  actionLoading: boolean;
}

function DetailModal({ app, onClose, onApprove, onReject, actionLoading }: DetailModalProps) {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: app ? 0 : height,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
    if (!app) setRemarks("");
  }, [app]);

  if (!app) return null;

  const sc = SC[app.industryStatus] ?? SC.pending;
  const tc = getTC(app.internshipId?.type);
  const stu = app.studentId;
  const int = app.internshipId;
  const isPending = app.industryStatus === "pending";

  const openCV = async () => {
    const url = resolveImgUri(stu.cvUrl) ?? resolveImgUri(app.cvSnapshot);
    if (!url) { Alert.alert("CV not available"); return; }
    try { await WebBrowser.openBrowserAsync(url); }
    catch { await Linking.openURL(url); }
  };

  const confirm = (action: "approve" | "reject") => {
    const isApprove = action === "approve";
    Alert.alert(
      isApprove ? "Accept Application" : "Reject Application",
      isApprove
        ? `Accept ${stu.name}'s application? A selection email will be sent automatically.`
        : `Reject ${stu.name}'s application?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: isApprove ? "Accept & Email" : "Reject",
          style: isApprove ? "default" : "destructive",
          onPress: () =>
            isApprove ? onApprove(app._id, remarks) : onReject(app._id, remarks),
        },
      ]
    );
  };

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <View style={m.overlay}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} activeOpacity={1} />

        <Animated.View style={[m.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={m.handle} />
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

            {/* ── Hero ── */}
            <View style={m.hero}>
              <TouchableOpacity onPress={onClose} style={m.closeBtn}>
                <Ionicons name="close" size={17} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>

              <View style={m.heroAvatar}>
                {stu.profileImage
                  ? <Image source={{ uri: resolveImgUri(stu.profileImage)! }} style={m.heroAvatarImg} />
                  : <Text style={m.heroAvatarTxt}>{initials(stu.name)}</Text>}
              </View>

              <Text style={m.heroName}>{stu.name}</Text>
              <Text style={m.heroDeg}>
                {[stu.department, stu.semester].filter(Boolean).join(" · ")}
              </Text>

              <View style={[m.statusBadge, { backgroundColor: sc.bg }]}>
                <Ionicons name={sc.icon as any} size={13} color={sc.color} />
                <Text style={[m.statusBadgeTxt, { color: sc.color }]}>{sc.label}</Text>
              </View>
            </View>

            <View style={m.body}>

              {/* ── Applied for ── */}
              <View style={[m.infoBox, { backgroundColor: tc.bg }]}>
                <Text style={[m.infoLabel, { color: tc.color }]}>Applied For</Text>
                <Text style={[m.infoTitle, { color: tc.color }]}>{int.title}</Text>
                <Text style={[m.infoCompany, { color: tc.color, opacity: 0.75 }]}>{int.company}</Text>
                {int.type && (
                  <View style={[m.typePill, { backgroundColor: tc.color + "22" }]}>
                    <Text style={[m.typePillTxt, { color: tc.color }]}>{int.type}</Text>
                  </View>
                )}
              </View>

              {/* ── Stats row ── */}
              <View style={m.statsRow}>
                {[
                  { val: stu.cgpa || "—", key: "CGPA" },
                  {
                    val: app.matchScore != null ? `${app.matchScore}%` : "—",
                    key: "Match",
                    color: app.matchScore != null
                      ? (app.matchScore >= 70 ? "#047857" : "#B45309")
                      : undefined,
                  },
                  { val: fmt(app.appliedAt ?? app.createdAt), key: "Applied" },
                ].map((st, i) => (
                  <View key={i} style={[m.statBox, i === 1 && m.statBoxBorder]}>
                    <Text style={[m.statVal, st.color ? { color: st.color } : {}]}>{st.val}</Text>
                    <Text style={m.statKey}>{st.key}</Text>
                  </View>
                ))}
              </View>

              {/* ── Required skills ── */}
              {(int.requiredSkills?.length ?? 0) > 0 && (
                <View style={m.sec}>
                  <Text style={m.secTitle}>Required Skills</Text>
                  <View style={m.skillsWrap}>
                    {int.requiredSkills!.map((sk, i) => {
                      const matched = app.matchingSkills?.some(
                        (ms) => ms.toLowerCase() === sk.toLowerCase()
                      );
                      return (
                        <View key={i} style={[m.skillChip, matched && m.skillChipMatch]}>
                          <Text style={[m.skillChipTxt, matched && m.skillChipMatchTxt]}>{sk}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* ── Contact ── */}
              <View style={m.sec}>
                <Text style={m.secTitle}>Student Contact</Text>
                {(
                  [
                    stu.email      && { icon: "mail-outline",    val: stu.email,                 link: `mailto:${stu.email}` },
                    stu.phone      && { icon: "call-outline",    val: stu.phone,                 link: `tel:${stu.phone}` },
                    stu.rollNumber && { icon: "id-card-outline", val: `Roll: ${stu.rollNumber}`, link: null },
                  ] as any[]
                ).filter(Boolean).map((c, i) => (
                  <TouchableOpacity
                    key={i}
                    style={m.contactRow}
                    onPress={() => c.link && Linking.openURL(c.link)}
                    activeOpacity={c.link ? 0.7 : 1}
                  >
                    <View style={m.contactIcon}>
                      <Ionicons name={c.icon} size={15} color={NAVY} />
                    </View>
                    <Text style={m.contactTxt} numberOfLines={1}>{c.val}</Text>
                    {c.link && <Ionicons name="open-outline" size={13} color="#94A3B8" />}
                  </TouchableOpacity>
                ))}
              </View>

              {/* ── Liaison note ── */}
              {!!app.industryLiaisonApproval?.remarks && (
                <View style={m.sec}>
                  <Text style={m.secTitle}>Liaison Note</Text>
                  <View style={m.noteBox}>
                    <Text style={m.noteBoxTxt}>{app.industryLiaisonApproval.remarks}</Text>
                  </View>
                </View>
              )}

              {/* ── Incharge note ── */}
              {!!app.internshipInchargeApproval?.remarks && (
                <View style={m.sec}>
                  <Text style={m.secTitle}>Incharge Note</Text>
                  <View style={m.noteBox}>
                    <Text style={m.noteBoxTxt}>{app.internshipInchargeApproval.remarks}</Text>
                  </View>
                </View>
              )}

              {/* ── Your decision note (already decided) ── */}
              {!!app.industryApproval?.remarks && !isPending && (
                <View style={m.sec}>
                  <Text style={m.secTitle}>Your Remarks</Text>
                  <View style={[m.noteBox, { backgroundColor: sc.bg, borderColor: sc.color + "40" }]}>
                    <Text style={[m.noteBoxTxt, { color: sc.color }]}>{app.industryApproval.remarks}</Text>
                  </View>
                </View>
              )}

              {/* ── CV ── */}
              {(stu.cvUrl || app.cvSnapshot) && (
                <TouchableOpacity style={m.cvBtn} onPress={openCV} activeOpacity={0.88}>
                  <View style={m.cvBtnInner}>
                    <Ionicons name="document-text" size={22} color={WHITE} />
                    <View style={{ flex: 1 }}>
                      <Text style={m.cvBtnTitle}>View CV / Resume</Text>
                      <Text style={m.cvBtnSub}>Opens PDF in browser</Text>
                    </View>
                    <Ionicons name="open-outline" size={17} color="rgba(255,255,255,0.7)" />
                  </View>
                </TouchableOpacity>
              )}

              {/* ── Remarks + action buttons (pending only) ── */}
              {isPending && (
                <>
                  <View style={m.sec}>
                    <Text style={m.secTitle}>Add Remarks (optional)</Text>
                    <TextInput
                      style={m.remarksInput}
                      placeholder="e.g. Strong candidate, report Monday 9am..."
                      placeholderTextColor="#94A3B8"
                      value={remarks}
                      onChangeText={setRemarks}
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  {actionLoading ? (
                    <View style={{ alignItems: "center", padding: 24 }}>
                      <ActivityIndicator size="large" color={NAVY} />
                      <Text style={{ color: "#64748B", marginTop: 8, fontSize: 13 }}>
                        Processing...
                      </Text>
                    </View>
                  ) : (
                    <View style={m.actionRow}>
                      <TouchableOpacity style={m.rejectBtn} onPress={() => confirm("reject")}>
                        <Ionicons name="close-circle-outline" size={17} color="#B91C1C" />
                        <Text style={m.rejectBtnTxt}>Reject</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={m.approveBtn} onPress={() => confirm("approve")}>
                        <Ionicons name="checkmark-circle-outline" size={17} color={WHITE} />
                        <Text style={m.approveBtnTxt}>Accept & Email Student</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}

              <View style={{ height: 24 }} />
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────────────────────
export function StudentApplicationsScreen() {
  const nav = useNavigation<any>();

  const [applications,  setApplications]  = useState<Application[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [refreshing,    setRefreshing]    = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selected,      setSelected]      = useState<Application | null>(null);
  const [filter,        setFilter]        = useState<"All" | IndustryStatus>("All");
  const [typeFilter,    setTypeFilter]    = useState("All");
  const [stats,         setStats]         = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [error,         setError]         = useState<string | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchApplications = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/applications`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error("API returned failure");
      setApplications(json.data ?? []);
      setStats(json.stats ?? { total: 0, pending: 0, approved: 0, rejected: 0 });
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    } catch (err: any) {
      setError(err.message ?? "Failed to fetch applications");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  // ── Approve ────────────────────────────────────────────────────────────────
  const handleApprove = async (appId: string, remarks: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/applications/${appId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remarks }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Approval failed");

      setApplications((prev) =>
        prev.map((a) =>
          a._id === appId
            ? { ...a, industryStatus: "approved" as const, industryApproval: { remarks } }
            : a
        )
      );
      setSelected(null);
      Alert.alert(
        "Accepted!",
        json.emailSent
          ? "Application accepted. Selection email sent to the student."
          : "Application accepted. (Email not sent — check server EMAIL_USER/EMAIL_PASS.)"
      );
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Reject ─────────────────────────────────────────────────────────────────
  const handleReject = async (appId: string, remarks: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/applications/${appId}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remarks }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Rejection failed");

      setApplications((prev) =>
        prev.map((a) =>
          a._id === appId
            ? { ...a, industryStatus: "rejected" as const, industryApproval: { remarks } }
            : a
        )
      );
      setSelected(null);
      Alert.alert("Rejected", "Application has been rejected.");
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Filtered list + available types ───────────────────────────────────────
  const filtered = applications.filter((a) => {
    const statusOk = filter === "All" || a.industryStatus === filter;
    const typeOk = typeFilter === "All" || a.internshipId?.type === typeFilter;
    return statusOk && typeOk;
  });

  const availableTypes = [
    "All",
    ...Array.from(new Set(applications.map((a) => a.internshipId?.type).filter(Boolean) as string[])),
  ];

  // ── Card ───────────────────────────────────────────────────────────────────
  const renderCard = ({ item }: { item: Application }) => {
    const sc = SC[item.industryStatus] ?? SC.pending;
    const tc = getTC(item.internshipId?.type);
    const stu = item.studentId;
    const int = item.internshipId;
    const isPending = item.industryStatus === "pending";

    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={s.card}>
          <View style={[s.cardStripe, { backgroundColor: tc.color }]} />

          <View style={s.cardInner}>
            {/* Head */}
            <View style={s.cardHead}>
              <View style={s.avatar}>
                {stu.profileImage
                  ? <Image source={{ uri: resolveImgUri(stu.profileImage)! }} style={s.avatarImg} />
                  : <Text style={s.avatarTxt}>{initials(stu.name)}</Text>}
              </View>

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={s.studentName}>{stu.name}</Text>
                <Text style={s.studentSub}>{stu.department || "—"}</Text>
                <Text style={s.studentEmail} numberOfLines={1}>{stu.email}</Text>
              </View>

              <View style={{ alignItems: "flex-end", gap: 6 }}>
                <View style={[s.statusPill, { backgroundColor: sc.bg }]}>
                  <Ionicons name={sc.icon as any} size={11} color={sc.color} />
                  <Text style={[s.statusPillTxt, { color: sc.color }]}>{sc.label}</Text>
                </View>
                {!!stu.cgpa && <Text style={s.cgpa}>⭐ {stu.cgpa}</Text>}
              </View>
            </View>

            {/* Internship */}
            <View style={s.oppRow}>
              <View style={[s.oppTag, { backgroundColor: tc.bg }]}>
                <Text style={[s.oppTagTxt, { color: tc.color }]}>{int.type || "Internship"}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.oppTitle} numberOfLines={1}>{int.title}</Text>
                <Text style={s.oppCompany} numberOfLines={1}>{int.company}</Text>
              </View>
            </View>

            {/* Skills */}
            {(int.requiredSkills?.length ?? 0) > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                {int.requiredSkills!.slice(0, 5).map((sk, i) => (
                  <View key={i} style={s.skillPill}>
                    <Text style={s.skillPillTxt}>{sk}</Text>
                  </View>
                ))}
                {int.requiredSkills!.length > 5 && (
                  <View style={[s.skillPill, { backgroundColor: "#F1F5F9" }]}>
                    <Text style={[s.skillPillTxt, { color: "#64748B" }]}>
                      +{int.requiredSkills!.length - 5}
                    </Text>
                  </View>
                )}
              </ScrollView>
            )}

            {/* Match bar */}
            {!!item.matchScore && item.matchScore > 0 && (
              <View style={s.matchRow}>
                <Text style={s.matchLabel}>Match</Text>
                <View style={s.matchBar}>
                  <View
                    style={[
                      s.matchFill,
                      {
                        width: `${item.matchScore}%` as any,
                        backgroundColor: item.matchScore >= 70 ? "#047857" : "#B45309",
                      },
                    ]}
                  />
                </View>
                <Text style={[s.matchPct, { color: item.matchScore >= 70 ? "#047857" : "#B45309" }]}>
                  {item.matchScore}%
                </Text>
              </View>
            )}

            {/* Footer */}
            <View style={s.cardFoot}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Ionicons name="time-outline" size={12} color="#94A3B8" />
                <Text style={s.footTime}>{fmt(item.appliedAt ?? item.createdAt)}</Text>
              </View>
              <TouchableOpacity style={s.reviewBtn} onPress={() => setSelected(item)}>
                <Text style={s.reviewBtnTxt}>Review</Text>
                <Ionicons name="chevron-forward" size={12} color={NAVY} />
              </TouchableOpacity>
            </View>

            {/* Inline quick-actions (pending only) */}
            {isPending && (
              <View style={s.inlineActions}>
                <TouchableOpacity
                  style={s.inlineReject}
                  onPress={() => setSelected(item)}
                >
                  <Ionicons name="close-circle-outline" size={15} color="#B91C1C" />
                  <Text style={s.inlineRejectTxt}>Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={s.inlineApproveWrap}
                  onPress={() =>
                    Alert.alert(
                      "Accept Application",
                      `Accept ${stu.name}'s application? Email will be sent automatically.`,
                      [
                        { text: "Cancel", style: "cancel" },
                        { text: "Accept & Email", onPress: () => handleApprove(item._id, "") },
                      ]
                    )
                  }
                >
                  <View style={s.inlineApprove}>
                    <Ionicons name="checkmark-circle-outline" size={15} color={WHITE} />
                    <Text style={s.inlineApproveTxt}>Accept</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: OFF_WHITE }}>
      <StatusBar barStyle="light-content" backgroundColor={NAVY} />

      {/* ── Header ── */}
      <View style={s.header}>
        <View style={s.headerRow}>
          <TouchableOpacity onPress={() => nav.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={21} color={WHITE} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={s.headerTitle}>Student Applications</Text>
            <Text style={s.headerSub}>
              {loading ? "Loading..." : `${stats.total} forwarded by liaison`}
            </Text>
          </View>
          {stats.pending > 0 && (
            <View style={s.newBadge}>
              <Text style={s.newBadgeTxt}>{stats.pending} pending</Text>
            </View>
          )}
        </View>

        <View style={s.statsRow}>
          {[
            { lbl: "Total",    n: stats.total,    textColor: WHITE },
            { lbl: "Pending",  n: stats.pending,  textColor: "#FFD166" },
            { lbl: "Accepted", n: stats.approved, textColor: "#6EE7B7" },
            { lbl: "Rejected", n: stats.rejected, textColor: "#FCA5A5" },
          ].map((st, i) => (
            <View key={i} style={s.statCard}>
              <Text style={[s.statN, { color: st.textColor }]}>{st.n}</Text>
              <Text style={s.statLbl}>{st.lbl}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Status filter chips ── */}
      <View style={s.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 14, gap: 8 }}>
          {(["All", "pending", "approved", "rejected"] as const).map((f) => {
            const label =
              f === "All"      ? `All (${stats.total})`        :
              f === "pending"  ? `Pending (${stats.pending})`  :
              f === "approved" ? `Accepted (${stats.approved})`:
              `Rejected (${stats.rejected})`;
            return (
              <TouchableOpacity
                key={f}
                style={[s.filterChip, filter === f && s.filterChipActive]}
                onPress={() => setFilter(f)}
              >
                <Text style={[s.filterChipTxt, filter === f && s.filterChipTxtActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Type filter tabs (only if >1 type exists) ── */}
      {availableTypes.length > 2 && (
        <View style={s.typeRow}>
          {availableTypes.map((t) => (
            <TouchableOpacity
              key={t}
              style={[s.typeTab, typeFilter === t && s.typeTabActive]}
              onPress={() => setTypeFilter(t)}
            >
              <Text style={[s.typeTabTxt, typeFilter === t && s.typeTabTxtActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── Error banner ── */}
      {!!error && (
        <View style={s.errorBanner}>
          <Ionicons name="alert-circle-outline" size={16} color="#B91C1C" />
          <Text style={s.errorTxt} numberOfLines={2}>{error}</Text>
          <TouchableOpacity onPress={() => fetchApplications()}>
            <Text style={s.retryTxt}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Content ── */}
      {loading ? (
        <View style={s.centerLoader}>
          <ActivityIndicator size="large" color={NAVY} />
          <Text style={s.loadingTxt}>Fetching applications...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={s.empty}>
          <View style={s.emptyIcon}>
            <Ionicons name="people-outline" size={38} color="#94A3B8" />
          </View>
          <Text style={s.emptyTxt}>
            {applications.length === 0
              ? "No applications forwarded yet"
              : "No applications match filter"}
          </Text>
          <Text style={s.emptySub}>
            {applications.length === 0
              ? "Applications appear here once the liaison forwards them"
              : "Try a different status or type filter"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={renderCard}
          contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchApplications(true); }}
              tintColor={NAVY}
            />
          }
        />
      )}

      {/* ── Detail Modal ── */}
      <DetailModal
        app={selected}
        onClose={() => setSelected(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        actionLoading={actionLoading}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Header — solid navy, no gradient
  header:      { backgroundColor: "#193648", paddingTop: Platform.OS === "ios" ? 56 : 44, paddingHorizontal: 18, paddingBottom: 22 },
  headerRow:   { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  backBtn:     { width: 36, height: 36, borderRadius: 8, backgroundColor: "rgba(255, 255, 255, 0.38)", justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 19, fontWeight: "900", color: WHITE },
  headerSub:   { fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 },
  newBadge:    { backgroundColor: "#FFD166", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  newBadgeTxt: { fontSize: 11, fontWeight: "900", color: NAVY },

  // Stats — flat cards inside navy header
  statsRow: { flexDirection: "row", gap: 8 },
  statCard: { flex: 1, backgroundColor: "#69788159", borderRadius: 10, paddingVertical: 11, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  statN:    { fontSize: 18, fontWeight: "900" },
  statLbl:  { fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 2, fontWeight: "600" },

  // Filters
  filterBar:           { backgroundColor: WHITE, paddingVertical: 10, borderBottomWidth: 1, borderColor: BORDER },
  filterChip:          { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 6, backgroundColor: OFF_WHITE, borderWidth: 1.5, borderColor: BORDER },
  filterChipActive:    { backgroundColor: "#193648", borderColor: "#193648" },
  filterChipTxt:       { fontSize: 12, fontWeight: "600", color: "#64748B" },
  filterChipTxtActive: { color: WHITE, fontWeight: "700" },

  typeRow:          { flexDirection: "row", flexWrap: "wrap", backgroundColor: WHITE, paddingHorizontal: 14, paddingBottom: 10, gap: 8, borderBottomWidth: 1, borderColor: BORDER },
  typeTab:          { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 6, backgroundColor: OFF_WHITE },
  typeTabActive:    { backgroundColor: "#193648" },
  typeTabTxt:       { fontSize: 12, fontWeight: "600", color: "#64748B" },
  typeTabTxtActive: { color: WHITE, fontWeight: "700" },

  // Error
  errorBanner: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#FEE2E2", paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderColor: "#FECACA" },
  errorTxt:    { flex: 1, fontSize: 13, color: "#B91C1C" },
  retryTxt:    { fontSize: 13, fontWeight: "700", color: "#B91C1C", textDecorationLine: "underline" },

  // Loading / empty
  centerLoader: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  loadingTxt:   { fontSize: 14, color: "#64748B" },
  empty:        { flex: 1, justifyContent: "center", alignItems: "center", paddingBottom: 80 },
  emptyIcon:    { width: 76, height: 76, borderRadius: 12, backgroundColor: "#EEF2F7", justifyContent: "center", alignItems: "center", marginBottom: 14 },
  emptyTxt:     { fontSize: 15, fontWeight: "700", color: "#334155" },
  emptySub:     { fontSize: 13, color: "#94A3B8", marginTop: 4, textAlign: "center", paddingHorizontal: 40 },

  // Card — flat, no shadow drama, clean white
  card:      { backgroundColor: WHITE, borderRadius: 14, overflow: "hidden", flexDirection: "row", shadowColor: "#0D1B2A", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  cardStripe:{ width: 4, alignSelf: "stretch" },
  cardInner: { flex: 1, padding: 14 },
  cardHead:  { flexDirection: "row", alignItems: "flex-start" },
  avatar:    { width: 48, height: 48, borderRadius: 10, backgroundColor: NAVY, justifyContent: "center", alignItems: "center", overflow: "hidden" },
  avatarImg: { width: 48, height: 48, borderRadius: 10 },
  avatarTxt: { fontSize: 16, fontWeight: "900", color: WHITE },
  studentName:  { fontSize: 14, fontWeight: "800", color: NAVY },
  studentSub:   { fontSize: 12, color: "#475569", marginTop: 2 },
  studentEmail: { fontSize: 11, color: "#94A3B8", marginTop: 1 },
  statusPill:   { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusPillTxt:{ fontSize: 10, fontWeight: "700" },
  cgpa:         { fontSize: 11, fontWeight: "700", color: "#B45309" },

  oppRow:    { flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: 10 },
  oppTag:    { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  oppTagTxt: { fontSize: 11, fontWeight: "700" },
  oppTitle:  { fontSize: 13, fontWeight: "700", color: "#193648" },
  oppCompany:{ fontSize: 12, color: "#64748B", marginTop: 2 },

  skillPill:    { backgroundColor: "#EEF2F7", borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6 },
  skillPillTxt: { fontSize: 11, fontWeight: "600", color: NAVY },

  matchRow:  { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 },
  matchLabel:{ fontSize: 11, color: "#94A3B8", fontWeight: "600", width: 36 },
  matchBar:  { flex: 1, height: 5, backgroundColor: "#EEF2F7", borderRadius: 99, overflow: "hidden" },
  matchFill: { height: "100%", borderRadius: 99 },
  matchPct:  { fontSize: 11, fontWeight: "700", width: 34, textAlign: "right" },

  cardFoot:    { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: BORDER },
  footTime:    { fontSize: 11, color: "#94A3B8" },
  reviewBtn:   { flexDirection: "row", alignItems: "center", gap: 2 },
  reviewBtnTxt:{ fontSize: 12, fontWeight: "700", color: NAVY },

  inlineActions:    { flexDirection: "row", gap: 8, marginTop: 12 },
  inlineReject:     { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "#FEE2E2", borderRadius: 8, borderWidth: 1.5, borderColor: "#FECACA" },
  inlineRejectTxt:  { fontSize: 12, fontWeight: "700", color: "#B91C1C" },
  inlineApproveWrap:{ flex: 1, borderRadius: 8, overflow: "hidden" },
  inlineApprove:    { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, paddingVertical: 10, backgroundColor: "#193648", borderRadius: 8 },
  inlineApproveTxt: { fontSize: 12, fontWeight: "700", color: WHITE },
});

const m = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "#193648", justifyContent: "flex-end" },
  sheet:   { backgroundColor: WHITE, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: height * 0.93, overflow: "hidden" },
  handle:  { width: 40, height: 4, borderRadius: 2, backgroundColor: "#E2E8F0", alignSelf: "center", marginTop: 12 },

  // Hero — solid navy, no gradient
  hero:       { backgroundColor: "#193648", paddingTop: 22, paddingHorizontal: 22, paddingBottom: 26, alignItems: "center" },
  closeBtn:   { position: "absolute", top: 14, right: 14, width: 30, height: 30, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.12)", justifyContent: "center", alignItems: "center" },
  heroAvatar: { width: 78, height: 78, borderRadius: 14, backgroundColor: NAVY_MID, justifyContent: "center", alignItems: "center", overflow: "hidden", borderWidth: 2, borderColor: "rgba(255,255,255,0.15)", marginBottom: 12 },
  heroAvatarImg: { width: 78, height: 78, borderRadius: 14 },
  heroAvatarTxt: { fontSize: 25, fontWeight: "900", color: WHITE },
  heroName:   { fontSize: 19, fontWeight: "900", color: WHITE, textAlign: "center" },
  heroDeg:    { fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 4, textAlign: "center" },
  statusBadge:    { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 13, paddingVertical: 6, borderRadius: 8, marginTop: 12 },
  statusBadgeTxt: { fontSize: 12, fontWeight: "700" },

  body:       { padding: 18 },
  infoBox:    { borderRadius: 12, padding: 15, marginBottom: 16 },
  infoLabel:  { fontSize: 11, fontWeight: "700", opacity: 0.7 },
  infoTitle:  { fontSize: 16, fontWeight: "800", marginTop: 3 },
  infoCompany:{ fontSize: 13, fontWeight: "600", marginTop: 2 },
  typePill:   { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginTop: 7 },
  typePillTxt:{ fontSize: 11, fontWeight: "700" },

  statsRow:   { flexDirection: "row", backgroundColor: OFF_WHITE, borderRadius: 12, marginBottom: 18, borderWidth: 1, borderColor: BORDER, overflow: "hidden" },
  statBox:    { flex: 1, padding: 15, alignItems: "center" },
  statBoxBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: BORDER },
  statVal:    { fontSize: 15, fontWeight: "900", color: NAVY },
  statKey:    { fontSize: 11, color: "#94A3B8", marginTop: 3, fontWeight: "600" },

  sec:        { marginBottom: 18 },
  secTitle:   { fontSize: 13, fontWeight: "800", color: NAVY, marginBottom: 9 },
  skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  skillChip:      { backgroundColor: "#EEF2F7", borderRadius: 6, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: BORDER },
  skillChipTxt:   { fontSize: 12, fontWeight: "700", color: NAVY },
  skillChipMatch: { backgroundColor: "#D1FAE5", borderColor: "#6EE7B7" },
  skillChipMatchTxt: { color: "#065F46" },

  contactRow:  { flexDirection: "row", alignItems: "center", gap: 9, paddingVertical: 11, borderBottomWidth: 1, borderColor: BORDER },
  contactIcon: { width: 34, height: 34, borderRadius: 8, backgroundColor: "#EEF2F7", justifyContent: "center", alignItems: "center" },
  contactTxt:  { flex: 1, fontSize: 13, color: "#334155", fontWeight: "500" },

  noteBox:    { backgroundColor: "#F0F4FF", borderRadius: 10, padding: 14, borderWidth: 1, borderColor: "#C7D2FE" },
  noteBoxTxt: { fontSize: 13, color: "#3730A3", lineHeight: 20 },

  // CV button — solid navy
  cvBtn:      { borderRadius: 12, overflow: "hidden", marginBottom: 18 },
  cvBtnInner: { flexDirection: "row", alignItems: "center", backgroundColor: "#193648", paddingHorizontal: 16, paddingVertical: 15, gap: 11, borderRadius: 12 },
  cvBtnTitle: { fontSize: 14, fontWeight: "800", color: WHITE },
  cvBtnSub:   { fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 2 },

  remarksInput: { borderWidth: 1.5, borderColor: BORDER, borderRadius: 10, padding: 12, fontSize: 14, color: "#0F172A", minHeight: 80, textAlignVertical: "top", backgroundColor: OFF_WHITE },

  actionRow:    { flexDirection: "row", gap: 10, marginBottom: 8 },
  rejectBtn:    { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 18, paddingVertical: 14, backgroundColor: "#FEE2E2", borderRadius: 10, borderWidth: 1.5, borderColor: "#FECACA" },
  rejectBtnTxt: { fontSize: 13, fontWeight: "700", color: "#B91C1C" },
  approveBtn:   { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 10, backgroundColor: "#193648"},
  approveBtnTxt:{ fontSize: 13, fontWeight: "700", color: WHITE },
});