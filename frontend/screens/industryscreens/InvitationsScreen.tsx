import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert, Animated, Dimensions, FlatList, Modal,
  Platform, RefreshControl, ScrollView, StatusBar,
  StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { useUser } from "./shared";

const { width, height } = Dimensions.get("window");

// ─── COLOR THEME — matches CollaXion industry dashboard ──────────
const THEME = {
  headerDark:   "#193648",
  headerMid:    "#1A3045",
  headerLight:  "#2A5068",
  bg:           "#F0F4F8",
  cardBg:       "#FFFFFF",
  primary:      "#193648",
  primaryLight: "#2A5068",
  textDark:     "#0D1B2A",
  textMid:      "#5B7080",
  textLight:    "#9BB0BC",
  border:       "#E3ECF0",
  iconBg:       "#EEF3F7",
};

type InviteType = "MOU" | "Event" | "Collaboration" | "Workshop";
type InviteStatus = "Pending" | "Accepted" | "Declined";

interface Invitation {
  _id: string; type: InviteType; title: string; fromName: string; fromRole: string;
  fromEmail?: string; fromPhone?: string; description: string; date?: string;
  endDate?: string; time?: string; location?: string; deadline: string;
  status: InviteStatus; receivedAt: string; tags: string[]; benefits?: string[];
  agenda?: string[]; capacity?: number; mode?: "Physical" | "Virtual" | "Hybrid";
}

const RIPHAH = "Riphah International University";

const MOCK_INVITATIONS: Invitation[] = [
  {
    _id: "i1", type: "MOU", title: "Academic Partnership MOU",
    fromName: RIPHAH, fromRole: "Industry Liaison Office",
    fromEmail: "industry.liaison@riphah.edu.pk", fromPhone: "+92-51-289-1835",
    description:
      "Riphah International University invites you to formalize a Memorandum of Understanding covering student internships, joint research collaboration, and faculty development workshops for the academic year 2026-27.",
    deadline: "30 May 2026", status: "Pending",
    receivedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    tags: ["Partnership", "Internship", "Research"],
    benefits: [
      "Access to 1500+ CS / SE graduates annually",
      "Co-branding on university publications",
      "Priority booth at the annual career fair",
      "Joint research paper opportunities",
    ],
    agenda: [
      "MOU signing ceremony at Riphah main campus",
      "Campus tour for HR team",
      "Meet-and-greet with department heads",
    ],
  },
  {
    _id: "i2", type: "Event", title: "Riphah Tech Expo 2026",
    fromName: RIPHAH, fromRole: "Event Organizing Committee",
    fromEmail: "techexpo@riphah.edu.pk",
    description:
      "You are invited to showcase your company at the annual Riphah Tech Expo. Set up a branded booth, interact with 500+ students, and recruit top talent directly.",
    date: "15 Jun 2026", endDate: "16 Jun 2026", time: "09:00 AM – 05:00 PM",
    location: "Riphah Main Campus, Auditorium Block, Islamabad",
    mode: "Physical", deadline: "05 Jun 2026",
    capacity: 500, status: "Pending",
    receivedAt: new Date(Date.now() - 86400000).toISOString(),
    tags: ["Expo", "Networking", "Recruitment"],
    benefits: [
      "Branded booth space (10×10 ft)",
      "Logo placement on all event materials",
      "Access to student CV database",
      "Slot in panel discussion",
    ],
    agenda: [
      "Day 1: Booth setup & student interactions",
      "Day 2: Panel discussions & live demos",
      "Evening: Networking dinner with faculty",
    ],
  },
  {
    _id: "i3", type: "Collaboration", title: "AI Research Collaboration",
    fromName: RIPHAH, fromRole: "Department of Computer Science",
    fromEmail: "cs.dept@riphah.edu.pk",
    description:
      "Riphah's CS department invites industry partners to co-supervise 3 final-year AI research projects and potentially co-author and publish joint research papers.",
    deadline: "20 May 2026", status: "Accepted",
    receivedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    tags: ["AI", "Research", "Joint Project"],
    benefits: [
      "Access to AI research outputs and IP",
      "3 dedicated student researchers",
      "Co-authorship on published papers",
      "University lab access for your team",
    ],
    agenda: [
      "Kickoff meeting with project supervisors",
      "Monthly progress reviews",
      "Final presentation and publication submission",
    ],
  },
  {
    _id: "i4", type: "Workshop", title: "Industry-Led Flutter Workshop",
    fromName: RIPHAH, fromRole: "CS Department",
    fromEmail: "workshops@riphah.edu.pk", fromPhone: "+92-51-289-1835",
    description:
      "Riphah requests your development team to conduct a 1-day Flutter development workshop for 60 final-year CS students.",
    date: "22 May 2026", time: "10:00 AM – 04:00 PM",
    location: "Riphah Main Campus, Dept. of CS, Room 301",
    mode: "Physical",
    capacity: 60, deadline: "18 May 2026", status: "Declined",
    receivedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    tags: ["Flutter", "Workshop", "Mentorship"],
    benefits: [
      "Brand visibility with 60 final-year students",
      "Lunch and hospitality provided by Riphah",
      "Certificate of appreciation",
    ],
    agenda: [
      "Morning: Flutter fundamentals & architecture",
      "Afternoon: Hands-on project building",
      "Wrap-up: Q&A and career talk",
    ],
  },
];

const TYPE_CONFIG: Record<InviteType, { color: string; bg: string; icon: string; grad: readonly [string, string] }> = {
  MOU:           { color: THEME.primary, bg: THEME.iconBg, icon: "document-text", grad: [THEME.headerDark, THEME.headerLight] },
  Event:         { color: "#C26B12",     bg: "#FDF3E7",   icon: "calendar",      grad: ["#E67E22", "#C26B12"] },
  Collaboration: { color: "#5B3A8E",     bg: "#F0E8F8",   icon: "people",        grad: ["#7C3AED", "#5B21B6"] },
  Workshop:      { color: "#2A5068",     bg: "#E8EEF3",   icon: "school",        grad: [THEME.primaryLight, THEME.headerDark] },
};

const STATUS_CONFIG: Record<InviteStatus, { color: string; bg: string; icon: string }> = {
  Pending:  { color: THEME.primary,  bg: "#E8EEF3", icon: "time-outline"     },
  Accepted: { color: "#059669",      bg: "#D1FAE5", icon: "checkmark-circle" },
  Declined: { color: "#DC2626",      bg: "#FEE2E2", icon: "close-circle"     },
};

function timeAgo(iso: string) {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function InvitationDetailModal({
  invite, visible, onClose, onAccept, onDecline,
}: {
  invite: Invitation | null; visible: boolean; onClose: () => void;
  onAccept: (id: string) => void; onDecline: (id: string) => void;
}) {
  if (!invite) return null;
  const tc = TYPE_CONFIG[invite.type];
  const sc = STATUS_CONFIG[invite.status];
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }).start();
    } else {
      Animated.timing(slideAnim, { toValue: height, duration: 250, useNativeDriver: true }).start();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={ms.backdrop} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[ms.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={ms.dragHandle} />
        <LinearGradient colors={tc.grad} style={ms.sheetHeader} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={ms.sheetHeaderDecor} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <View style={ms.sheetTypeIcon}>
              <Ionicons name={tc.icon as any} size={22} color="#fff" />
            </View>
            <View>
              <View style={ms.sheetTypeBadge}>
                <Text style={ms.sheetTypeBadgeTxt}>{invite.type}</Text>
              </View>
              <Text style={ms.sheetTimeAgo}>{timeAgo(invite.receivedAt)}</Text>
            </View>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={ms.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={ms.sheetTitle}>{invite.title}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 }}>
            <Ionicons name="business-outline" size={13} color="rgba(255,255,255,0.7)" />
            <Text style={ms.sheetFromName}>{invite.fromName}</Text>
            <Text style={ms.sheetFromRole}>· {invite.fromRole}</Text>
          </View>
          <View style={[ms.statusPill, { backgroundColor: sc.bg }]}>
            <Ionicons name={sc.icon as any} size={12} color={sc.color} />
            <Text style={[ms.statusPillTxt, { color: sc.color }]}>{invite.status}</Text>
          </View>
        </LinearGradient>

        <ScrollView style={ms.sheetBody} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          {(invite.fromEmail || invite.fromPhone) && (
            <View style={ms.section}>
              <Text style={ms.sectionTitle}>Contact</Text>
              {invite.fromEmail && (
                <View style={ms.infoRow}>
                  <View style={[ms.infoIconBox, { backgroundColor: tc.bg }]}>
                    <Ionicons name="mail-outline" size={14} color={tc.color} />
                  </View>
                  <Text style={ms.infoTxt}>{invite.fromEmail}</Text>
                </View>
              )}
              {invite.fromPhone && (
                <View style={ms.infoRow}>
                  <View style={[ms.infoIconBox, { backgroundColor: tc.bg }]}>
                    <Ionicons name="call-outline" size={14} color={tc.color} />
                  </View>
                  <Text style={ms.infoTxt}>{invite.fromPhone}</Text>
                </View>
              )}
            </View>
          )}

          {(invite.date || invite.location || invite.mode || invite.capacity) && (
            <View style={ms.section}>
              <Text style={ms.sectionTitle}>Event Details</Text>
              <View style={ms.detailGrid}>
                {invite.date && (
                  <View style={ms.detailItem}>
                    <Ionicons name="calendar-outline" size={16} color={tc.color} />
                    <Text style={ms.detailItemLbl}>Date</Text>
                    <Text style={ms.detailItemVal}>{invite.date}{invite.endDate ? ` – ${invite.endDate}` : ""}</Text>
                  </View>
                )}
                {invite.time && (
                  <View style={ms.detailItem}>
                    <Ionicons name="time-outline" size={16} color={tc.color} />
                    <Text style={ms.detailItemLbl}>Time</Text>
                    <Text style={ms.detailItemVal}>{invite.time}</Text>
                  </View>
                )}
                {invite.location && (
                  <View style={[ms.detailItem, { width: "100%" }]}>
                    <Ionicons name="location-outline" size={16} color={tc.color} />
                    <Text style={ms.detailItemLbl}>Venue</Text>
                    <Text style={ms.detailItemVal}>{invite.location}</Text>
                  </View>
                )}
                {invite.mode && (
                  <View style={ms.detailItem}>
                    <Ionicons name={invite.mode === "Virtual" ? "videocam-outline" : "location-outline"} size={16} color={tc.color} />
                    <Text style={ms.detailItemLbl}>Mode</Text>
                    <Text style={ms.detailItemVal}>{invite.mode}</Text>
                  </View>
                )}
                {invite.capacity && (
                  <View style={ms.detailItem}>
                    <Ionicons name="people-outline" size={16} color={tc.color} />
                    <Text style={ms.detailItemLbl}>Capacity</Text>
                    <Text style={ms.detailItemVal}>{invite.capacity} attendees</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          <View style={ms.section}>
            <Text style={ms.sectionTitle}>About This Invitation</Text>
            <Text style={ms.descTxt}>{invite.description}</Text>
          </View>

          {invite.benefits && invite.benefits.length > 0 && (
            <View style={ms.section}>
              <Text style={ms.sectionTitle}>What You Get</Text>
              {invite.benefits.map((b, i) => (
                <View key={i} style={ms.bulletRow}>
                  <View style={[ms.bulletDot, { backgroundColor: tc.color }]} />
                  <Text style={ms.bulletTxt}>{b}</Text>
                </View>
              ))}
            </View>
          )}

          {invite.agenda && invite.agenda.length > 0 && (
            <View style={ms.section}>
              <Text style={ms.sectionTitle}>Agenda</Text>
              {invite.agenda.map((a, i) => (
                <View key={i} style={ms.agendaRow}>
                  <View style={[ms.agendaNum, { backgroundColor: tc.bg }]}>
                    <Text style={[ms.agendaNumTxt, { color: tc.color }]}>{i + 1}</Text>
                  </View>
                  <Text style={ms.agendaTxt}>{a}</Text>
                </View>
              ))}
            </View>
          )}

          {invite.tags.length > 0 && (
            <View style={ms.section}>
              <Text style={ms.sectionTitle}>Tags</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {invite.tags.map((t) => (
                  <View key={t} style={[ms.tag, { backgroundColor: tc.bg }]}>
                    <Text style={[ms.tagTxt, { color: tc.color }]}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={[ms.section, { marginBottom: 0 }]}>
            <View style={ms.deadlineBox}>
              <Ionicons name="hourglass-outline" size={16} color="#DC2626" />
              <View style={{ marginLeft: 10 }}>
                <Text style={ms.deadlineLbl}>Response Deadline</Text>
                <Text style={ms.deadlineVal}>{invite.deadline}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={ms.footer}>
          {invite.status === "Pending" ? (
            <>
              <TouchableOpacity style={ms.declineBtn} onPress={() => { onClose(); setTimeout(() => onDecline(invite._id), 300); }}>
                <Ionicons name="close-circle-outline" size={17} color="#DC2626" />
                <Text style={ms.declineTxt}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity style={ms.acceptBtnWrap} onPress={() => { onClose(); setTimeout(() => onAccept(invite._id), 300); }}>
                <LinearGradient colors={tc.grad} style={ms.acceptBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Ionicons name="checkmark-circle-outline" size={17} color="#fff" />
                  <Text style={ms.acceptTxt}>Accept Invitation</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          ) : (
            <View style={[ms.resolvedBanner, { backgroundColor: sc.bg }]}>
              <Ionicons name={sc.icon as any} size={16} color={sc.color} />
              <Text style={[ms.resolvedBannerTxt, { color: sc.color }]}>
                You {invite.status.toLowerCase()} this invitation
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
}

export function InvitationsScreen() {
  const nav = useNavigation<any>();
  const { user } = useUser();
  const [invites, setInvites] = useState<Invitation[]>(MOCK_INVITATIONS);
  const [filter, setFilter] = useState<"All" | InviteType>("All");
  const [statusF, setStatusF] = useState<"All" | InviteStatus>("All");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<Invitation | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const openDetail = (inv: Invitation) => {
    setSelectedInvite(inv);
    setDetailVisible(true);
  };

  const handleAccept = (id: string) => {
    Alert.alert("Accept Invitation", "Are you sure you want to accept this invitation?", [
      { text: "Cancel", style: "cancel" },
      { text: "Accept", onPress: () => setInvites((prev) => prev.map((x) => (x._id === id ? { ...x, status: "Accepted" } : x))) },
    ]);
  };

  const handleDecline = (id: string) => {
    Alert.alert("Decline Invitation", "Are you sure you want to decline?", [
      { text: "Cancel", style: "cancel" },
      { text: "Decline", style: "destructive", onPress: () => setInvites((prev) => prev.map((x) => (x._id === id ? { ...x, status: "Declined" } : x))) },
    ]);
  };

  const filtered = invites.filter((inv) => {
    const matchType = filter === "All" || inv.type === filter;
    const matchStatus = statusF === "All" || inv.status === statusF;
    return matchType && matchStatus;
  });

  const pending = invites.filter((i) => i.status === "Pending").length;

  const renderCard = ({ item }: { item: Invitation }) => {
    const tc = TYPE_CONFIG[item.type];
    const sc = STATUS_CONFIG[item.status];
    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity style={s.card} onPress={() => openDetail(item)} activeOpacity={0.88}>
          <LinearGradient colors={tc.grad} style={s.cardStripe} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
          <View style={s.cardBody}>
            <View style={s.cardHead}>
              <View style={[s.typeIconBox, { backgroundColor: tc.bg }]}>
                <Ionicons name={tc.icon as any} size={20} color={tc.color} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <View style={[s.typeBadge, { backgroundColor: tc.bg }]}>
                    <Text style={[s.typeBadgeTxt, { color: tc.color }]}>{item.type}</Text>
                  </View>
                  <Text style={s.timeAgoTxt}>{timeAgo(item.receivedAt)}</Text>
                </View>
                <View style={[s.statusBadgePill, { backgroundColor: sc.bg }]}>
                  <Ionicons name={sc.icon as any} size={11} color={sc.color} />
                  <Text style={[s.statusBadgeTxt, { color: sc.color }]}>{item.status}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
            </View>

            <Text style={s.cardTitle}>{item.title}</Text>
            <View style={s.fromRow}>
              <Ionicons name="business-outline" size={13} color={THEME.textMid} />
              <Text style={s.fromTxt}>{item.fromName}</Text>
              <Text style={s.fromRole}>· {item.fromRole}</Text>
            </View>
            <Text style={s.cardDesc} numberOfLines={2}>{item.description}</Text>

            {(item.date || item.location) && (
              <View style={s.detailRow}>
                {item.date && (
                  <View style={s.detailChip}>
                    <Ionicons name="calendar-outline" size={12} color={tc.color} />
                    <Text style={[s.detailChipTxt, { color: tc.color }]}>{item.date}</Text>
                  </View>
                )}
                {item.location && (
                  <View style={s.detailChip}>
                    <Ionicons name="location-outline" size={12} color={tc.color} />
                    <Text style={[s.detailChipTxt, { color: tc.color }]} numberOfLines={1}>{item.location}</Text>
                  </View>
                )}
              </View>
            )}

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
              {item.tags.map((tag) => (
                <View key={tag} style={s.tagChip}>
                  <Text style={s.tagChipTxt}>{tag}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={s.cardFooterRow}>
              <View style={s.deadlineRow}>
                <Ionicons name="time-outline" size={13} color="#DC2626" />
                <Text style={s.deadlineTxt}>Respond by {item.deadline}</Text>
              </View>
              <Text style={s.tapDetailTxt}>Tap for details →</Text>
            </View>

            {item.status === "Pending" && (
              <View style={s.actionRow}>
                <TouchableOpacity style={s.declineBtn} onPress={() => handleDecline(item._id)}>
                  <Ionicons name="close-circle-outline" size={15} color="#DC2626" />
                  <Text style={s.declineBtnTxt}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.acceptBtnWrap} onPress={() => handleAccept(item._id)}>
                  <LinearGradient colors={tc.grad} style={s.acceptBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Ionicons name="checkmark-circle-outline" size={15} color="#fff" />
                    <Text style={s.acceptBtnTxt}>Accept</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {item.status !== "Pending" && (
              <View style={[s.resolvedRow, { backgroundColor: sc.bg }]}>
                <Ionicons name={sc.icon as any} size={14} color={sc.color} />
                <Text style={[s.resolvedTxt, { color: sc.color }]}>
                  You {item.status.toLowerCase()} this invitation
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: THEME.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.headerDark} />

      <LinearGradient colors={[THEME.headerDark, THEME.headerMid, THEME.headerLight]} style={s.header}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={s.headerDecor} />
        <View style={s.headerRow}>
          <TouchableOpacity onPress={() => nav.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={21} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={s.headerTitle}>Invitations</Text>
            <Text style={s.headerSub}>
              {pending > 0 ? `${pending} pending response${pending > 1 ? "s" : ""}` : "All caught up"}
            </Text>
          </View>
          {pending > 0 && (
            <View style={s.pendingBadge}>
              <Text style={s.pendingBadgeTxt}>{pending}</Text>
            </View>
          )}
        </View>

        <View style={s.statsRow}>
          {[
            { lbl: "Total",    n: invites.length,                                   c: "#A8C8E8" },
            { lbl: "Pending",  n: invites.filter((i) => i.status === "Pending").length,   c: "#BCD4E8" },
            { lbl: "Accepted", n: invites.filter((i) => i.status === "Accepted").length,  c: "#A5D6A7" },
            { lbl: "Declined", n: invites.filter((i) => i.status === "Declined").length,  c: "#EF9A9A" },
          ].map((s2, i) => (
            <View key={i} style={s.statCard}>
              <Text style={[s.statN, { color: s2.c }]}>{s2.n}</Text>
              <Text style={s.statLbl}>{s2.lbl}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={s.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, gap: 8 }}>
          {(["All", "MOU", "Event", "Collaboration", "Workshop"] as const).map((f) => (
            <TouchableOpacity key={f} style={[s.filterChip, filter === f && s.filterChipActive]} onPress={() => setFilter(f)}>
              {f !== "All" && (
                <Ionicons name={TYPE_CONFIG[f as InviteType]?.icon as any} size={12} color={filter === f ? "#fff" : THEME.textMid} />
              )}
              <Text style={[s.filterChipTxt, filter === f && s.filterChipTxtActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={s.statusFilterRow}>
        {(["All", "Pending", "Accepted", "Declined"] as const).map((sf) => (
          <TouchableOpacity key={sf} style={[s.statusTab, statusF === sf && s.statusTabActive]} onPress={() => setStatusF(sf)}>
            <Text style={[s.statusTabTxt, statusF === sf && s.statusTabTxtActive]}>{sf}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.length === 0 ? (
        <View style={s.empty}>
          <View style={s.emptyIcon}>
            <Ionicons name="mail-open-outline" size={38} color={THEME.textLight} />
          </View>
          <Text style={s.emptyTxt}>No invitations found</Text>
          <Text style={s.emptySub}>Adjust your filters or check back later</Text>
        </View>
      ) : (
        <FlatList
          data={filtered} keyExtractor={(item) => item._id} renderItem={renderCard}
          contentContainerStyle={{ padding: 16, paddingBottom: 50 }} showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.primary} />}
        />
      )}

      <InvitationDetailModal
        invite={selectedInvite} visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        onAccept={handleAccept} onDecline={handleDecline}
      />
    </View>
  );
}

const s = StyleSheet.create({
  header:      { paddingTop: Platform.OS === "ios" ? 56 : 44, paddingHorizontal: 18, paddingBottom: 22, overflow: "hidden" },
  headerDecor: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.03)", top: -70, right: -60 },
  headerRow:   { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  backBtn:     { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.1)", justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 19, fontWeight: "900", color: "#fff" },
  headerSub:   { fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 },
  pendingBadge:    { backgroundColor: "#EF4444", paddingHorizontal: 11, paddingVertical: 5, borderRadius: 20 },
  pendingBadgeTxt: { fontSize: 12, fontWeight: "900", color: "#fff" },
  statsRow: { flexDirection: "row", gap: 8 },
  statCard: { flex: 1, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 13, paddingVertical: 11, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.07)" },
  statN:    { fontSize: 18, fontWeight: "900" },
  statLbl:  { fontSize: 9, color: "rgba(255,255,255,0.45)", marginTop: 2, fontWeight: "600" },
  filterBar:        { backgroundColor: "#fff", paddingVertical: 10, borderBottomWidth: 1, borderColor: THEME.border },
  filterChip:       { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: "#EBF0F5", borderWidth: 1.5, borderColor: THEME.border },
  filterChipActive: { backgroundColor: THEME.primary, borderColor: THEME.primary },
  filterChipTxt:    { fontSize: 12, fontWeight: "600", color: THEME.textMid },
  filterChipTxtActive: { color: "#fff", fontWeight: "700" },
  statusFilterRow: { flexDirection: "row", backgroundColor: "#fff", paddingHorizontal: 14, paddingBottom: 10, gap: 8, borderBottomWidth: 1, borderColor: THEME.border },
  statusTab:       { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10, backgroundColor: "#F5F8FB" },
  statusTabActive: { backgroundColor: THEME.primary },
  statusTabTxt:    { fontSize: 12, fontWeight: "600", color: THEME.textMid },
  statusTabTxtActive: { color: "#fff", fontWeight: "700" },
  card:        { backgroundColor: "#fff", borderRadius: 18, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  cardStripe:  { height: 4, width: "100%" },
  cardBody:    { padding: 16 },
  cardHead:    { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  typeIconBox: { width: 44, height: 44, borderRadius: 13, justifyContent: "center", alignItems: "center" },
  typeBadge:   { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 },
  typeBadgeTxt:{ fontSize: 11, fontWeight: "700" },
  timeAgoTxt:  { fontSize: 11, color: THEME.textLight, fontWeight: "500" },
  statusBadgePill: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20, alignSelf: "flex-start", marginTop: 5 },
  statusBadgeTxt:  { fontSize: 11, fontWeight: "700" },
  cardTitle:   { fontSize: 16, fontWeight: "800", color: THEME.textDark, marginBottom: 6 },
  fromRow:     { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 10 },
  fromTxt:     { fontSize: 12, fontWeight: "700", color: THEME.textMid },
  fromRole:    { fontSize: 12, color: THEME.textLight },
  cardDesc:    { fontSize: 13, color: THEME.textMid, lineHeight: 20 },
  detailRow:   { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  detailChip:  { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#F5F8FB", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: THEME.border, maxWidth: (width - 80) / 2 },
  detailChipTxt: { fontSize: 11, fontWeight: "600" },
  tagChip:     { backgroundColor: "#EBF0F5", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginRight: 7 },
  tagChipTxt:  { fontSize: 11, fontWeight: "600", color: THEME.textMid },
  cardFooterRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12 },
  deadlineRow:   { flexDirection: "row", alignItems: "center", gap: 5 },
  deadlineTxt:   { fontSize: 12, fontWeight: "700", color: "#DC2626" },
  tapDetailTxt:  { fontSize: 11, fontWeight: "600", color: THEME.textLight },
  actionRow:     { flexDirection: "row", gap: 10, marginTop: 14 },
  declineBtn:    { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, paddingVertical: 11, backgroundColor: "#FEE2E2", borderRadius: 13, borderWidth: 1.5, borderColor: "#FECACA" },
  declineBtnTxt: { fontSize: 13, fontWeight: "700", color: "#DC2626" },
  acceptBtnWrap: { flex: 1, borderRadius: 13, overflow: "hidden" },
  acceptBtn:     { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 11 },
  acceptBtnTxt:  { fontSize: 13, fontWeight: "700", color: "#fff" },
  resolvedRow:   { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 12, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12 },
  resolvedTxt:   { fontSize: 12, fontWeight: "700" },
  empty:     { flex: 1, justifyContent: "center", alignItems: "center", paddingBottom: 80 },
  emptyIcon: { width: 76, height: 76, borderRadius: 38, backgroundColor: "#EBF0F5", justifyContent: "center", alignItems: "center", marginBottom: 14 },
  emptyTxt:  { fontSize: 15, fontWeight: "700", color: THEME.textDark },
  emptySub:  { fontSize: 13, color: THEME.textLight, marginTop: 4 },
});

const ms = StyleSheet.create({
  backdrop:   { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)" },
  sheet:      { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: height * 0.92, overflow: "hidden" },
  dragHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#D0DCE8", alignSelf: "center", marginTop: 12, marginBottom: 4 },
  sheetHeader:     { padding: 20, paddingBottom: 24, overflow: "hidden" },
  sheetHeaderDecor:{ position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.06)", top: -80, right: -60 },
  sheetTypeIcon:   { width: 46, height: 46, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.18)", justifyContent: "center", alignItems: "center" },
  sheetTypeBadge:  { backgroundColor: "rgba(255,255,255,0.25)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  sheetTypeBadgeTxt: { fontSize: 11, fontWeight: "700", color: "#fff" },
  sheetTimeAgo:    { fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 },
  closeBtn:        { width: 34, height: 34, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.18)", justifyContent: "center", alignItems: "center" },
  sheetTitle:      { fontSize: 20, fontWeight: "900", color: "#fff", lineHeight: 26 },
  sheetFromName:   { fontSize: 12, fontWeight: "700", color: "rgba(255,255,255,0.85)" },
  sheetFromRole:   { fontSize: 12, color: "rgba(255,255,255,0.55)" },
  statusPill:      { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, alignSelf: "flex-start", marginTop: 12 },
  statusPillTxt:   { fontSize: 12, fontWeight: "700" },
  sheetBody:    { flex: 1 },
  section:      { paddingHorizontal: 20, paddingTop: 20, marginBottom: 4 },
  sectionTitle: { fontSize: 13, fontWeight: "800", color: THEME.textDark, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 },
  infoRow:    { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10, padding: 12, backgroundColor: "#F5F8FB", borderRadius: 12, borderWidth: 1, borderColor: THEME.border },
  infoIconBox:{ width: 32, height: 32, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  infoTxt:    { fontSize: 13, color: THEME.textMid, fontWeight: "600" },
  detailGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  detailItem: { width: "46%", backgroundColor: "#F5F8FB", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: THEME.border, gap: 4 },
  detailItemLbl: { fontSize: 10, fontWeight: "700", color: THEME.textLight, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4 },
  detailItemVal: { fontSize: 13, fontWeight: "700", color: THEME.textDark },
  descTxt:    { fontSize: 14, color: THEME.textMid, lineHeight: 22 },
  bulletRow:  { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 10 },
  bulletDot:  { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  bulletTxt:  { flex: 1, fontSize: 13, color: THEME.textMid, lineHeight: 20 },
  agendaRow:  { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 10 },
  agendaNum:  { width: 26, height: 26, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  agendaNumTxt: { fontSize: 12, fontWeight: "800" },
  agendaTxt:  { flex: 1, fontSize: 13, color: THEME.textMid, lineHeight: 20, paddingTop: 4 },
  tag:     { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  tagTxt:  { fontSize: 12, fontWeight: "700" },
  deadlineBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#FEF2F2", padding: 14, borderRadius: 14, borderWidth: 1.5, borderColor: "#FECACA" },
  deadlineLbl: { fontSize: 11, color: "#DC2626", fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  deadlineVal: { fontSize: 15, fontWeight: "900", color: "#DC2626" },
  footer:      { flexDirection: "row", gap: 10, paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderColor: THEME.border, paddingBottom: Platform.OS === "ios" ? 32 : 16, backgroundColor: "#fff" },
  declineBtn:  { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 20, paddingVertical: 14, backgroundColor: "#FEE2E2", borderRadius: 14, borderWidth: 1.5, borderColor: "#FECACA" },
  declineTxt:  { fontSize: 14, fontWeight: "700", color: "#DC2626" },
  acceptBtnWrap: { flex: 1, borderRadius: 14, overflow: "hidden" },
  acceptBtn:   { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14 },
  acceptTxt:   { fontSize: 14, fontWeight: "800", color: "#fff" },
  resolvedBanner:    { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 14 },
  resolvedBannerTxt: { fontSize: 14, fontWeight: "700" },
});