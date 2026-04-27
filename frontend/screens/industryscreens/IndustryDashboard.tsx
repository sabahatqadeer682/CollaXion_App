import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated, Dimensions, Easing, Image, ImageBackground, Modal, Platform, Pressable,
  ScrollView, StatusBar, StyleSheet, Text,
  TouchableOpacity, Vibration, View, RefreshControl,
} from "react-native";

import { AIChatbotScreen, CXbotFloatingButton } from "./AIChatbotScreen";
import { InternshipsMainScreen, PostNewInternshipScreen } from "./InternshipScreens";
import { ChatScreen, MessagesScreen } from "./MessageScreens";
import { CreateMoUScreen, MoUScreen, MouDetailScreen } from "./MouScreens";
import { PostNewProjectScreen, ManageProjectsScreen } from "./ProjectScreens";
import { ProfileScreen } from "./ProfileScreen";
import { PostOpportunityScreen } from "./PostOpportunityScreen";
import { StudentApplicationsScreen } from "./StudentApplicationsScreen";
import { InvitationsScreen } from "./InvitationsScreen";
import { MyPostsScreen, EditPostScreen } from "./Mypostsscreen";
import { EventCreationScreen } from "./EventCreationScreen";
import { EventsManageScreen } from "./EventsManageScreen";
import socket from "../studentscreens/utils/Socket";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  API_INT, API_MOU, API_PROJ, BASE, C, SBadge,
  ToastProvider, UserProvider, fmtDate,
  sharedStyles, useIndustryLogo, useUser, width,
} from "./shared";

const { height } = Dimensions.get("window");
const SCREEN_WIDTH = width;

// ── THEME — exactly matching the student dashboard look ────────
const THEME = {
  navy:      "#0D1B2A",
  navyMid:   "#122333",
  navyLight: "#1A3045",
  bg:        "#F0F4F8",
  card:      "#FFFFFF",
  teal:      "#1A6B72",
  tealLight: "#E8F4F5",
  accent:    "#2A5068",
  steel:     "#5B8FA8",
  textPri:   "#0D1B2A",
  textSec:   "#5B7080",
  textMute:  "#9BB0BC",
  green:     "#27AE60",
  amber:     "#E67E22",
  red:       "#E74C3C",
  border:    "#E3ECF0",
  headerBg:  "#193648",
  iconBg:    "#EEF3F7",
};

// ─── NOTIFICATION TYPE → UI STYLE MAP ───────────────────────────
const NOTE_STYLE: Record<string, { icon: string; color: string; bg: string }> = {
  mou:         { icon: "document-text",    color: THEME.teal,   bg: THEME.tealLight },
  application: { icon: "people",           color: THEME.accent, bg: "#E8EEF3" },
  invitation:  { icon: "mail-unread",      color: THEME.amber,  bg: "#FDF3E7" },
  event:       { icon: "calendar",         color: THEME.green,  bg: "#E8F6EE" },
  general:     { icon: "notifications",    color: THEME.teal,   bg: THEME.tealLight },
};

const timeAgoShort = (iso?: string) => {
  if (!iso) return "Just now";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const mapNote = (raw: any) => {
  const cfg = NOTE_STYLE[raw?.type] || NOTE_STYLE.general;
  return {
    _id:   raw?._id || `rt-${Date.now()}-${Math.random()}`,
    icon:  cfg.icon,
    color: cfg.color,
    bg:    cfg.bg,
    title: raw?.title || "Notification",
    body:  raw?.message || "",
    time:  timeAgoShort(raw?.createdAt),
    read:  !!raw?.isRead,
    meta:  raw?.meta || null,
    raw,
  };
};

// ─── REAL-TIME NOTIFICATION TOAST OVERLAY ────────────────────────
type Notif = { _id?:string; title:string; message:string; type?:string; meta?: any };

const TYPE_ICON: Record<string, { icon: string; color: string }> = {
  application: { icon: "briefcase-check", color: "#2563EB" },
  event:       { icon: "calendar-star",   color: "#7C3AED" },
  deadline:    { icon: "clock-alert",     color: "#DC2626" },
  general:     { icon: "bell-ring",       color: "#059669" },
};

const TOP_OFFSET = Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) + 8 : 50;

function NotificationOverlay({ onIncoming }: { onIncoming?: (n: Notif) => void }) {
  const nav = useNavigation<any>();
  const [current, setCurrent] = useState<Notif | null>(null);
  const translateY = useRef(new Animated.Value(-160)).current;
  const opacity   = useRef(new Animated.Value(0)).current;
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = () => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    Animated.parallel([
      Animated.timing(translateY, { toValue: -160, duration: 220, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
      Animated.timing(opacity,    { toValue: 0,    duration: 200, useNativeDriver: true }),
    ]).start(() => setCurrent(null));
  };

  const show = (notif: Notif) => {
    setCurrent(notif);
    try { Vibration.vibrate(Platform.OS === "android" ? [0, 80, 60, 80] : 250); } catch {}
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(()=>{});
    translateY.setValue(-160); opacity.setValue(0);
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
      Animated.timing(opacity,    { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    dismissTimer.current = setTimeout(hide, 4200);
  };

  useEffect(() => {
    const handler = (data: any) => {
      if (!data) return;
      const n: Notif = {
        _id: data._id,
        title: data.title || "Notification",
        message: data.message || "",
        type: data.type || "general",
        meta: data.meta || data.raw?.meta,
      };
      show(n);
      onIncoming?.(n);
    };
    socket.on("newNotification", handler);
    return () => {
      socket.off("newNotification", handler);
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, []);

  if (!current) return null;
  const cfg = TYPE_ICON[current.type || "general"] || TYPE_ICON.general;

  const onPressBanner = () => {
    const mouId = current.meta?.mouId;
    hide();
    if (mouId) {
      try { nav.navigate("MouDetail", { mouId }); } catch {}
    }
  };

  return (
    <Animated.View pointerEvents="box-none" style={[ov.wrap, { opacity, transform: [{ translateY }] }]}>
      <Pressable onPress={onPressBanner} style={ov.banner} android_ripple={{ color: "#1E3A4A" }}>
        <View style={[ov.iconBg, { backgroundColor: cfg.color + "22" }]}>
          <MaterialCommunityIcons name={cfg.icon as any} size={22} color={cfg.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={ov.title} numberOfLines={1}>{current.title}</Text>
          <Text style={ov.body}  numberOfLines={2}>{current.message}</Text>
        </View>
        <Pressable hitSlop={10} onPress={hide} style={ov.closeBtn}>
          <MaterialCommunityIcons name="close" size={16} color="#9CA3AF" />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

// ─── NOTIFICATION SLIDE-IN PANEL (preserved) ─────────────────────
function NotificationPanel({
  visible,
  onClose,
  notes,
  onMarkAllRead,
  onMarkOneRead,
  onOpenNote,
}: {
  visible: boolean;
  onClose: () => void;
  notes: any[];
  onMarkAllRead: () => void;
  onMarkOneRead: (id: string) => void;
  onOpenNote?: (note: any) => void;
}) {
  const slideAnim = useRef(new Animated.Value(-width * 0.88)).current;
  const unread = notes.filter((n) => !n.read).length;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : -width * 0.88,
      useNativeDriver: true, tension: 65, friction: 11,
    }).start();
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={{ flex:1, flexDirection:"row" }}>
        <Animated.View style={[nS.panel, { transform:[{ translateX: slideAnim }] }]}>
          <LinearGradient colors={["#193648", "#193648"]} style={nS.panelHeader}>
            <View style={nS.panelHeaderRow}>
              <View>
                <Text style={nS.panelTitle}>Notifications</Text>
                <Text style={nS.panelSub}>{unread > 0 ? `${unread} unread` : "All caught up"}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={nS.closeBtn}>
                <Ionicons name="close" size={17} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            </View>
            {unread > 0 && (
              <TouchableOpacity onPress={onMarkAllRead} style={nS.markAllBtn}>
                <Ionicons name="checkmark-done" size={13} color="rgba(255,255,255,0.8)" />
                <Text style={nS.markAllTxt}>Mark all as read</Text>
              </TouchableOpacity>
            )}
          </LinearGradient>

          <ScrollView style={{ flex:1, backgroundColor:THEME.bg }} showsVerticalScrollIndicator={false}>
            {notes.length === 0 && (
              <View style={{ alignItems: "center", paddingVertical: 60, paddingHorizontal: 24 }}>
                <Ionicons name="notifications-off-outline" size={42} color={THEME.textMute} />
                <Text style={{ fontSize: 14, fontWeight: "700", color: THEME.textPri, marginTop: 12 }}>You&apos;re all caught up</Text>
                <Text style={{ fontSize: 12, color: THEME.textSec, marginTop: 4, textAlign: "center" }}>
                  Updates from the Industry Liaison and platform events will appear here.
                </Text>
              </View>
            )}
            {notes.map((n) => (
              <TouchableOpacity key={n._id}
                style={[nS.card, !n.read && nS.cardUnread]}
                onPress={() => { onMarkOneRead(n._id); onOpenNote?.(n); }}>
                <View style={[nS.iconBox, { backgroundColor: n.bg }]}>
                  <Ionicons name={n.icon as any} size={18} color={n.color} />
                </View>
                <View style={{ flex:1 }}>
                  <View style={{ flexDirection:"row", alignItems:"center", gap:6 }}>
                    <Text style={nS.cardTitle}>{n.title}</Text>
                    {!n.read && <View style={nS.unreadDot} />}
                  </View>
                  <Text style={nS.cardBody} numberOfLines={2}>{n.body}</Text>
                  <Text style={nS.cardTime}>{n.time}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <View style={{ height:40 }} />
          </ScrollView>
        </Animated.View>
        <TouchableOpacity style={{ flex:1 }} onPress={onClose} activeOpacity={1} />
      </View>
    </Modal>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────
const DASHBOARD_HERO_IMAGES = [
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=1200&auto=format&fit=crop",
];

function DashboardScreen() {
  const nav = useNavigation<any>();
  const { user, refreshUser, ax, logo, setLogo } = useUser();
  const liveLogo = useIndustryLogo();
  const [mouCount, setMouCount] = useState(0);
  const [pending,  setPending]  = useState(0);
  const [recentMous, setRecentMous] = useState<any[]>([]);
  const [posts,   setPosts]  = useState<any[]>([]);
  const [events,  setEvents] = useState<any[]>([]);
  // Derive counts from the live arrays so the numbers can never drift away
  // from the actual cards being rendered.
  const counts = {
    mous:    mouCount,
    pending,
    events:  events.length,
    posts:   posts.length + events.length,
  };
  const [refreshing, setRefreshing] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);
  const [heroIdx, setHeroIdx] = useState(0);
  const unreadCount = notes.filter((n)=>!n.read).length;

  useEffect(() => {
    const id = setInterval(() => {
      setHeroIdx((i) => (i + 1) % DASHBOARD_HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const loadNotifications = async () => {
    if (!user?.email) return;
    try {
      const r = await ax().get(`/api/industry/notifications/${encodeURIComponent(user.email)}`);
      const list = Array.isArray(r.data) ? r.data : [];
      setNotes(list.map(mapNote));
    } catch (e: any) {
      console.log("loadNotifications error:", e?.response?.status);
    }
  };

  const markAllRead = async () => {
    if (!user?.email) return;
    setNotes((prev) => prev.map((n) => ({ ...n, read: true })));
    try { await ax().patch(`/api/industry/notifications/${encodeURIComponent(user.email)}/read-all`); } catch {}
  };

  const markOneRead = async (id: string) => {
    setNotes((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
    if (typeof id === "string" && !id.startsWith("rt-")) {
      try { await ax().patch(`/api/industry/notifications/${id}/read`); } catch {}
    }
  };
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const loadProfile = async () => { await refreshUser?.(); };

  const loadData = async () => {
    const a = ax();
    const headers = { "x-industry-id": user?._id, "x-company-name": user?.name };
    try {
      const [m, postsRes, eventsRes] = await Promise.all([
        a.get(`${API_MOU}/mine`, { headers }).catch(()=>({ data:[] })),
        a.get("/api/industry/posts/mine", { headers }).catch(()=>({ data:[] })),
        a.get("/api/industry/events/mine", { headers }).catch(()=>({ data:[] })),
      ]);
      const mous      = m.data || [];
      const allPosts  = postsRes.data || [];
      const allEvents = Array.isArray(eventsRes.data) ? eventsRes.data : (eventsRes.data?.events || []);
      const liveEvents = allEvents.filter((e:any) => e.status === "published");

      // Dedupe by _id so server-side $or matching can never multiply rows.
      const dedupe = (arr: any[]) => {
        const seen = new Set<string>();
        const out: any[] = [];
        for (const x of arr) {
          const id = x?._id ? String(x._id) : "";
          if (!id || seen.has(id)) continue;
          seen.add(id);
          out.push(x);
        }
        return out;
      };

      const uniquePosts = dedupe(allPosts).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const uniqueEvents = dedupe(liveEvents);

      const pendingCount = mous.filter((x:any)=>
        ["Sent to Industry Laison Incharge","Changes Proposed"].includes(x.status)
      ).length;

      setMouCount(mous.length);
      setPending(pendingCount);
      setRecentMous(mous.slice(0,3));
      setPosts(uniquePosts);
      setEvents(uniqueEvents);
    } catch(e:any) {
      console.log("loadData error:", e?.response?.status, e?.response?.data);
    }
  };

  // ── Real-time WebSocket connection ──
  useEffect(() => {
    if (!user?.email) return;
    try { socket.disconnect(); } catch {}
    socket.connect(BASE, user.email, user?.name, "industry");

    const handleNewNotification = (data: any) => {
      const note = mapNote({ ...data, isRead: false, createdAt: data?.createdAt || new Date().toISOString() });
      setNotes((prev) => {
        if (note._id && prev.some((p) => p._id === note._id)) return prev;
        return [note, ...prev];
      });
    };

    socket.on("newNotification", handleNewNotification);

    // Real-time post add/update — keeps "Your Posts" in sync without refresh.
    // Counts are derived from the posts array so we don't need a separate
    // increment that could drift out of sync with the canonical DB count.
    const handleNewPost = (data: any) => {
      if (!data?._id) return;
      setPosts((prev) => {
        if (prev.some((p) => p._id === data._id)) return prev;
        return [data, ...prev];
      });
    };
    const handlePostUpdated = (data: any) => {
      if (!data?._id) return;
      setPosts((prev) => prev.map((p) => (p._id === data._id ? { ...p, ...data } : p)));
    };
    const handleNewEvent = (data: any) => {
      if (!data?._id) return;
      // Only published events show on dashboard counts.
      if (data.status && data.status !== "published") return;
      setEvents((prev) => {
        if (prev.some((e) => e._id === data._id)) return prev;
        return [data, ...prev];
      });
    };
    socket.on("newPost", handleNewPost);
    socket.on("postUpdated", handlePostUpdated);
    socket.on("newEvent", handleNewEvent);

    return () => {
      socket.off("newNotification", handleNewNotification);
      socket.off("newPost", handleNewPost);
      socket.off("postUpdated", handlePostUpdated);
      socket.off("newEvent", handleNewEvent);
    };
  }, [user?.email]);

  // ── FIX 2: Reliable focus listener — refetches on every navigation return
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue:1, duration:700, useNativeDriver:true }),
      Animated.timing(slideAnim, { toValue:0, duration:600, useNativeDriver:true }),
    ]).start();

    const refreshAll = () => {
      loadProfile();
      loadData();
      loadNotifications();
      AsyncStorage.getItem("industryLogo").then((cached: string | null) => {
        if (cached) setLogo?.(cached);
      }).catch(() => {});
    };

    // Initial load
    refreshAll();

    // Fires every time you return to dashboard — via drawer tap, back button, anything
    const unsubFocus = nav.addListener("focus", refreshAll);

    return () => { unsubFocus(); };
  }, [nav]);

  // Once the canonical industry user is discovered (e.g. /profile/any seeded
  // it after first paint, or the user just edited the profile), re-pull
  // dashboard data so MOUs/posts/events use the correct industry headers
  // and the greeting matches the DB — no manual refresh needed.
  useEffect(() => {
    if (!user?._id) return;
    loadProfile();
    loadData();
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, user?.email, user?.name]);

  const onRefresh = async () => { setRefreshing(true); await Promise.all([loadProfile(), loadData()]); setRefreshing(false); };
  const initials  = (n:string) => n?.split(" ").map((w:string)=>w[0]).slice(0,2).join("").toUpperCase()||"CX";

  const typeColor = (t:string) =>
    t==="Internship" ? { bg:THEME.tealLight, txt:THEME.teal,  dot:THEME.teal,  grad:[THEME.teal, THEME.navyLight] as const } :
    t==="Workshop"   ? { bg:"#FDF3E7",       txt:THEME.amber, dot:THEME.amber, grad:[THEME.amber,"#CA6F1E"] as const } :
                       { bg:"#E8EEF3",       txt:THEME.accent,dot:THEME.accent,grad:[THEME.accent,THEME.navy] as const };

  const timeAgo = (iso:string) => {
    const h = Math.floor((Date.now()-new Date(iso).getTime())/3600000);
    if(h<1) return "Just now"; if(h<24) return `${h}h ago`; return `${Math.floor(h/24)}d ago`;
  };

  const QUICK_ACTIONS = [
    { icon:"search",    label:"Browse Opportunities",  desc:"Find & post internships",   screen:"PostOpportunity" },
    { icon:"sparkles",  label:"AI Recommend",          desc:"Personalized suggestions",  screen:"AIRecommend" },
    { icon:"people",    label:"Student Applications",  desc:"Applications received",    screen:"StudentApplications" },
    { icon:"calendar",  label:"Events",                desc:"Job fairs & seminars",      screen:"EventCreation" },
  ];

  const MORE_FEATURES = [
    { icon:"mail-unread-outline",     title:"Invitations",     desc:"University requests",  screen:"Invitations" },
    { icon:"document-text-outline",   title:"MOU Management",  desc:"Manage agreements",     screen:"MoUs" },
    { icon:"calendar-number-outline", title:"My Events",       desc:"View your events",      screen:"EventsManage" },
    { icon:"newspaper-outline",       title:"My Posts",        desc:"View & manage posts",   screen:"MyPosts" },
    { icon:"person-circle-outline",   title:"My Profile",      desc:"Update company info",   screen:"Profile" },
  ];

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h >= 20 || h < 3)  return "Good Night";
    if (h >= 3  && h < 12) return "Good Morning";
    if (h >= 12 && h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <View style={{ flex:1, backgroundColor:THEME.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.headerBg} />
      <NotificationPanel
        visible={notifOpen}
        onClose={() => setNotifOpen(false)}
        notes={notes}
        onMarkAllRead={markAllRead}
        onMarkOneRead={markOneRead}
        onOpenNote={(n) => {
          const mouId = n?.meta?.mouId;
          if (!mouId) return;
          setNotifOpen(false);
          try { nav.navigate("MouDetail", { mouId }); } catch {}
        }}
      />

      {/* ── Top Navigation Bar ── matches student header style ── */}
      <View style={d.header}>
        <View style={{ flexDirection:"row", alignItems:"center", gap:10 }}>
          <TouchableOpacity onPress={()=>nav.openDrawer()} style={d.menuBtn}>
            <MaterialCommunityIcons name="menu" size={26} color="#fff"/>
          </TouchableOpacity>
          <View style={d.logoBox}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={{ width: 28, height: 28 }}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={{ flex:1 }}/>

        <View style={{ flexDirection:"row", alignItems:"center", gap:8 }}>
          <TouchableOpacity onPress={()=>setNotifOpen(true)} style={d.headerIconBtn}>
            <MaterialCommunityIcons name="bell-outline" size={22} color="#fff"/>
            {unreadCount>0 && (
              <View style={d.badge}>
                <Text style={d.badgeTxt}>{unreadCount > 99 ? "99+" : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>nav.navigate("Profile")} style={d.avatarBtn}>
            {(() => {
              const src = liveLogo || logo || user?.logo;
              return src
                ? <Image key={src.slice(0,32)} source={{uri: src}} style={d.avatarImg}/>
                : <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png" }} style={d.avatarImg}/>;
            })()}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:110}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.teal}/>}>
        <Animated.View style={{opacity:fadeAnim, transform:[{translateY:slideAnim}]}}>

          {/* ── Hero (with cycling video-like background) ── */}
          <View style={d.heroSection}>
            {DASHBOARD_HERO_IMAGES.map((uri, i) => (
              <View
                key={uri}
                style={[StyleSheet.absoluteFillObject, { opacity: heroIdx === i ? 1 : 0 }]}
                pointerEvents="none"
              >
                <ImageBackground source={{ uri }} style={{ flex: 1 }} resizeMode="cover" />
              </View>
            ))}
            <View style={d.heroOverlay} pointerEvents="none" />

            <View style={d.heroDots}>
              {DASHBOARD_HERO_IMAGES.map((_, i) => (
                <View
                  key={i}
                  style={[d.heroDot, heroIdx === i && d.heroDotActive]}
                />
              ))}
            </View>

            <View style={d.heroTopRow}>
              <View style={d.heroContent}>
                <View style={d.greetingPill}>
                  <View style={d.greetingDot}/>
                  <Text style={d.greetingBadge}>{getGreeting()}</Text>
                </View>
                <Text style={d.nameText} numberOfLines={1}>
                  {user?.name?.split(" ")[0] || "Industry"}
                </Text>
                <Text style={d.heroSubText}>
                  Empowering talent connections - manage MOUs, opportunities & events.
                </Text>
              </View>
            </View>

            <View style={d.heroStatsRow}>
              {[
                { n:counts.mous,    lbl:"MOUs",    screen:"MoUs"         },
                { n:counts.posts,   lbl:"Posts",   screen:"MyPosts"      },
                { n:counts.events,  lbl:"Events",  screen:"EventsManage" },
                { n:counts.pending, lbl:"Pending", screen:"MoUs"         },
              ].map((stat,i,arr)=>(
                <React.Fragment key={i}>
                  <TouchableOpacity
                    style={d.heroStat}
                    onPress={()=>nav.navigate(stat.screen)}
                    activeOpacity={0.7}>
                    <Text style={d.heroStatNum}>{stat.n}</Text>
                    <Text style={d.heroStatLbl}>{stat.lbl}</Text>
                  </TouchableOpacity>
                  {i < arr.length - 1 && <View style={d.heroStatDivider}/>}
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* ── Pending MOU alert ── */}
          {counts.pending>0 && (
            <TouchableOpacity onPress={()=>nav.navigate("MoUs")} style={d.alertBanner} activeOpacity={0.85}>
              <View style={d.alertLeft}>
                <View style={d.alertIconBg}>
                  <MaterialCommunityIcons name="alert-circle-outline" size={20} color="#fff"/>
                </View>
                <View style={{ marginLeft:12, flex:1 }}>
                  <Text style={d.alertTitle}>{counts.pending} MOU{counts.pending>1?"s":""} Need Attention</Text>
                  <Text style={d.alertSub}>Tap to review pending agreements ✨</Text>
                </View>
              </View>
              <MaterialCommunityIcons name="arrow-right" size={18} color={THEME.headerBg}/>
            </TouchableOpacity>
          )}

          {/* ── Quick Actions ── */}
          <View style={d.section}>
            <View style={d.sectionHeader}>
              <Text style={d.sectionTitle}>Quick Actions</Text>
              <View style={d.sectionAccent}/>
            </View>
            <View style={d.actionsGrid}>
              {QUICK_ACTIONS.map((a,i)=>(
                <TouchableOpacity key={i} style={d.actionCard}
                  onPress={()=>nav.navigate(a.screen)} activeOpacity={0.85}>
                  <View style={d.actionIconBg}>
                    <Ionicons name={a.icon as any} size={24} color={THEME.headerBg}/>
                  </View>
                  <Text style={d.actionTitle} numberOfLines={1}>{a.label}</Text>
                  <Text style={d.actionDesc} numberOfLines={2}>{a.desc}</Text>
                  <View style={d.actionArrow}>
                    <MaterialCommunityIcons name="arrow-right" size={12} color={THEME.headerBg}/>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── More Features ── */}
          <View style={d.section}>
            <View style={d.sectionHeader}>
              <Text style={d.sectionTitle}>More Features</Text>
              <View style={d.sectionAccent}/>
            </View>
            {MORE_FEATURES.map((f,i)=>(
              <TouchableOpacity key={i} style={d.featureRow}
                onPress={()=>nav.navigate(f.screen)} activeOpacity={0.85}>
                <View style={d.featureIcon}>
                  <Ionicons name={f.icon as any} size={22} color={THEME.headerBg}/>
                </View>
                <View style={{ flex:1 }}>
                  <Text style={d.featureTitle}>{f.title}</Text>
                  <Text style={d.featureDesc} numberOfLines={1}>{f.desc}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={THEME.headerBg}/>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Recent MOUs ── */}
          {recentMous.length>0 && (
            <View style={d.section}>
              <View style={d.sectionHeader}>
                <Text style={d.sectionTitle}>Recent MOUs</Text>
                <View style={d.sectionAccent}/>
                <TouchableOpacity onPress={()=>nav.navigate("MoUs")}>
                  <Text style={d.seeAll}>View all</Text>
                </TouchableOpacity>
              </View>
              {recentMous.map((m)=>(
                <TouchableOpacity key={m._id} style={d.mouCard}
                  onPress={()=>nav.navigate("MouDetail",{mouId:m._id})} activeOpacity={0.88}>
                  <View style={[d.mouStripe, {backgroundColor:THEME.headerBg}]}/>
                  <View style={{flex:1, marginLeft:14, paddingVertical:14}}>
                    <Text style={d.mouTitle} numberOfLines={1}>{m.title||m.university}</Text>
                    <Text style={d.mouSub}>{m.collaborationType}</Text>
                    <Text style={d.mouDate}>{fmtDate(m.endDate)}</Text>
                  </View>
                  <View style={{paddingRight:14, justifyContent:"center"}}>
                    <SBadge status={m.status}/>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ── Your Posts ── */}
          <View style={d.section}>
            <View style={d.sectionHeader}>
              <Text style={d.sectionTitle}>Your Posts</Text>
              <View style={d.sectionAccent}/>
              <TouchableOpacity onPress={()=>nav.navigate("MyPosts")}>
                <Text style={d.seeAll}>View all</Text>
              </TouchableOpacity>
            </View>

            {posts.length===0 ? (
              <TouchableOpacity style={d.emptyCard} onPress={()=>nav.navigate("PostOpportunity")}>
                <View style={[d.emptyIcon, {backgroundColor:THEME.iconBg}]}>
                  <Ionicons name="add-circle-outline" size={30} color={THEME.headerBg}/>
                </View>
                <Text style={d.emptyTxt}>Post your first opportunity</Text>
                <Text style={d.emptySub}>Internships • Projects • Workshops</Text>
              </TouchableOpacity>
            ) : (
              posts.slice(0,3).map((post)=>{
                const tc=typeColor(post.type);
                return (
                  <View key={post._id} style={d.postCard}>
                    <View style={d.postCardHead}>
                      <View style={[d.postAvatar, {backgroundColor:THEME.headerBg}]}>
                        {(() => {
                          const src = liveLogo || logo || user?.logo;
                          return src
                            ? <Image key={src.slice(0,32)} source={{uri: src}} style={{width:40,height:40,borderRadius:20}}/>
                            : <Text style={d.postAvatarTxt}>{initials(user?.name||"CX")}</Text>;
                        })()}
                      </View>
                      <View style={{flex:1, marginLeft:10}}>
                        <Text style={d.postOrg}>{user?.name||"Your Company"}</Text>
                        <Text style={d.postWhen}>{timeAgo(post.createdAt || post.postedAt)}</Text>
                      </View>
                      <View style={[d.typeTag, {backgroundColor:tc.bg}]}>
                        <View style={[d.typeDot, {backgroundColor:tc.dot}]}/>
                        <Text style={[d.typeTagTxt, {color:tc.txt}]}>{post.type}</Text>
                      </View>
                    </View>
                    {post.poster ? (
                      <Image source={{uri: post.poster}} style={[d.postBanner, {width:"100%"}]} resizeMode="cover"/>
                    ) : (
                      <LinearGradient colors={tc.grad} style={d.postBanner} start={{x:0,y:0}} end={{x:1,y:1}}>
                        <View style={d.bannerC1}/><View style={d.bannerC2}/>
                        <Ionicons name={post.type==="Internship"?"briefcase":post.type==="Workshop"?"school":"flask"}
                          size={36} color="rgba(255,255,255,0.25)" style={{marginBottom:8}}/>
                        <Text style={d.bannerTitle}>{post.title}</Text>
                        <View style={{flexDirection:"row",gap:16,marginTop:6}}>
                          <View style={{flexDirection:"row",alignItems:"center",gap:4}}>
                            <Ionicons name="time-outline" size={11} color="rgba(255,255,255,0.7)"/>
                            <Text style={d.bannerMeta}>{post.duration}</Text>
                          </View>
                          <View style={{flexDirection:"row",alignItems:"center",gap:4}}>
                            <Ionicons name="cash-outline" size={11} color="rgba(255,255,255,0.7)"/>
                            <Text style={d.bannerMeta}>{post.stipend}</Text>
                          </View>
                        </View>
                      </LinearGradient>
                    )}
                    <View style={d.postBody}>
                      <Text style={d.postTitle}>{post.title}</Text>
                      <Text style={d.postDesc} numberOfLines={2}>{post.description}</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:10}}>
                        {(post.skills||[]).map((sk:string,idx:number)=>(
                          <View key={idx} style={d.skillPill}>
                            <Text style={d.skillPillTxt}>{sk}</Text>
                          </View>
                        ))}
                      </ScrollView>
                      <View style={d.postFoot}>
                        <View style={{flexDirection:"row",alignItems:"center",gap:5}}>
                          <Ionicons name="people-outline" size={14} color={THEME.textSec}/>
                          <Text style={d.postFootTxt}>{post.applicants} applicants</Text>
                        </View>
                        <TouchableOpacity style={d.viewAppsBtn} onPress={()=>nav.navigate("StudentApplications")}>
                          <Text style={d.viewAppsTxt}>View Applications</Text>
                          <Ionicons name="arrow-forward" size={12} color={THEME.headerBg}/>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>

          {/* ── AI Badge ── */}
          <TouchableOpacity style={d.aiBadge} onPress={()=>nav.navigate("AIChatbot")} activeOpacity={0.85}>
            <Image source={require("../../assets/images/logo.png")} style={d.aiBadgeLogo}/>
            <View style={{ flex:1 }}>
              <Text style={d.aiText}>Powered by CollaXion AI</Text>
              <Text style={d.aiSubText}>Tap to chat with CXbot 🤖</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="rgba(255,255,255,0.6)"/>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>

      {/* ── Real-time toast banner overlay ── */}
      <NotificationOverlay />

      {/* ── CXbot Floating Button ── */}
      <CXbotFloatingButton />
    </View>
  );
}

// ─── CUSTOM DRAWER ──
function CustomDrawer(props: DrawerContentComponentProps) {
  const { user, refreshUser, logo, setLogo } = useUser();
  const liveLogo = useIndustryLogo();
  const drawerNav = props.navigation;
  const initials = (n:string) => n?.split(" ").map((w)=>w[0]).slice(0,2).join("").toUpperCase()||"CX";

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue:1, duration:300, useNativeDriver:true }),
      Animated.spring(slideAnim, { toValue:0, tension:90, friction:11, useNativeDriver:true }),
    ]).start();
    refreshUser?.();
    AsyncStorage.getItem("industryLogo").then((cached: string | null) => {
      if (cached) setLogo?.(cached);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const unsub = (drawerNav as any).addListener?.("drawerOpen", () => {
      AsyncStorage.getItem("industryLogo").then((cached: string | null) => {
        if (cached) setLogo?.(cached);
      }).catch(() => {});
      refreshUser?.();
    });
    return unsub;
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => {
            drawerNav.closeDrawer();
            // Sign-out lands on the Roles selection screen so the user can
            // pick their role again (Student / Industry) instead of jumping
            // straight back into the industry login.
            drawerNav.getParent()?.reset?.({
              index: 0,
              routes: [{ name: "RolesScreen" }],
            }) ?? drawerNav.reset({
              index: 0,
              routes: [{ name: "RolesScreen" }],
            });
          },
        },
      ]
    );
  };

  return (
    <DrawerContentScrollView
      {...props}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={dr.scrollContent}>
      <StatusBar backgroundColor="#111D26" barStyle="light-content"/>

      <Animated.View
        style={[dr.profileCard, { opacity:fadeAnim, transform:[{translateY:slideAnim}] }]}>
        <TouchableOpacity
          onPress={()=>{ drawerNav.navigate("Profile"); drawerNav.closeDrawer(); }}
          activeOpacity={0.7}
          style={dr.avatarTouch}>
          <View style={dr.avatarWrapper}>
            {(() => {
              const src = liveLogo || logo || user?.logo;
              return src
                ? <Image key={src.slice(0,32)} source={{uri: src}} style={dr.avatar}/>
                : <View style={[dr.avatar, dr.avatarFallback]}>
                    <Text style={dr.avatarTxt}>{initials(user?.name||"CX")}</Text>
                  </View>;
            })()}
            <View style={dr.cameraBadge}>
              <MaterialCommunityIcons name="camera" size={12} color="#fff"/>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={dr.studentName} numberOfLines={1}>{user?.name||"Industry Partner"}</Text>
        <Text style={dr.studentEmail} numberOfLines={1}>{user?.email||"loading..."}</Text>

        <View style={dr.onlinePill}>
          <View style={dr.onlineDot}/>
          <Text style={dr.onlineText}>Active</Text>
        </View>
      </Animated.View>

      <View style={dr.sep}/>

      <View style={dr.whiteSection}>
        <Animated.View style={{ opacity:fadeAnim }}>
          <DrawerItemList {...props}/>
        </Animated.View>

        <View style={dr.sepWhite}/>

        <Animated.View style={{ opacity:fadeAnim }}>
          <TouchableOpacity style={dr.logoutRow} onPress={handleLogout} activeOpacity={0.8}>
            <View style={dr.logoutIcon}>
              <MaterialIcons name="logout" color="#EF4444" size={17}/>
            </View>
            <Text style={dr.logoutTxt}>Sign Out</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[dr.footer, { opacity:fadeAnim }]}>
          <Image source={require("../../assets/images/logo.png")}
            style={dr.footerLogo} resizeMode="contain"/>
          <Text style={dr.footerBrand}>CollaXion • Where Collaboration Meets Innovation</Text>
        </Animated.View>
      </View>
    </DrawerContentScrollView>
  );
}

// ─── DRAWER NAVIGATOR ────────────────────────────────────────────
const Drawer = createDrawerNavigator();

const ac = (color: string) => ({
  drawerActiveTintColor: color,
  drawerActiveBackgroundColor: color + "18",
  drawerInactiveTintColor: "#555",
});

function IndustryDrawer() {
  const drawerWidth = Math.min(Math.round(SCREEN_WIDTH * 0.78), 295);
  return (
    <Drawer.Navigator
      drawerContent={(props)=><CustomDrawer {...props}/>}
      screenOptions={{
        headerShown:false,
        drawerStyle: { backgroundColor: "#111D26", width: drawerWidth },
        drawerLabelStyle: { fontSize: 14, fontWeight: "600", marginLeft: -4 },
        drawerItemStyle: { borderRadius: 10, marginHorizontal: 10, marginVertical: 1 },
      }}>
      <Drawer.Screen name="Dashboard" component={DashboardScreen}
        options={{ ...ac("#193648"), drawerLabel: "Dashboard",
          drawerIcon: ({ color, size }) => <MaterialIcons name="dashboard" color={color} size={size}/> }}/>

      <Drawer.Screen name="PostOpportunity" component={PostOpportunityScreen}
        options={{ ...ac("#193648"), drawerLabel: "Post Opportunity",
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="plus-circle-outline" color={color} size={size}/> }}/>

      <Drawer.Screen name="StudentApplications" component={StudentApplicationsScreen}
        options={{ ...ac("#193648"), drawerLabel: "Applications",
          drawerIcon: ({ color, size }) => <MaterialIcons name="work-history" color={color} size={size}/> }}/>

      <Drawer.Screen name="Invitations" component={InvitationsScreen}
        options={{ ...ac("#193648"), drawerLabel: "Invitations",
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="email-outline" color={color} size={size}/> }}/>

      <Drawer.Screen name="EventCreation" component={EventCreationScreen}
        options={{ ...ac("#193648"), drawerLabel: "Create Event",
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="calendar-star" color={color} size={size}/> }}/>

      <Drawer.Screen name="MoUs" component={MoUScreen}
        options={{ ...ac("#193648"), drawerLabel: "MOU Management",
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="file-document-outline" color={color} size={size}/> }}/>

      {/* Internships drawer entry hidden — keep the screen registered (height 0)
          so deep-links / nav.navigate("InternshipsMain") still work. */}
      <Drawer.Screen name="InternshipsMain" component={InternshipsMainScreen}
        options={{ drawerItemStyle: { height: 0 } }}/>

      {/* Projects drawer entry hidden — same rationale as above. */}
      <Drawer.Screen name="ManageProjects" component={ManageProjectsScreen}
        options={{ drawerItemStyle: { height: 0 } }}/>

      <Drawer.Screen name="AIChatbot" component={AIChatbotScreen}
        options={{ ...ac("#193648"), drawerLabel: "CXbot AI",
          drawerIcon: ({ color, size }) => <MaterialIcons name="psychology" color={color} size={size}/> }}/>

      <Drawer.Screen name="Profile" component={ProfileScreen}
        options={{ ...ac("#193648"), drawerLabel: "My Profile",
          drawerIcon: ({ color, size }) => <MaterialIcons name="person" color={color} size={size}/> }}/>

      <Drawer.Screen name="MyPosts" component={MyPostsScreen}
        options={{ ...ac("#193648"), drawerLabel: "My Posts",
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="newspaper-variant-outline" color={color} size={size}/> }}/>

      <Drawer.Screen name="EventsManage" component={EventsManageScreen}
        options={{ ...ac("#193648"), drawerLabel: "My Events",
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="calendar-month" color={color} size={size}/> }}/>

      {/* Hidden screens */}
      <Drawer.Screen name="MessagesMain"      component={MessagesScreen}          options={{ drawerItemStyle:{ height:0 } }}/>
      <Drawer.Screen name="CreateMoU"         component={CreateMoUScreen}         options={{ drawerItemStyle:{ height:0 } }}/>
      <Drawer.Screen name="PostNewInternship" component={PostNewInternshipScreen} options={{ drawerItemStyle:{ height:0 } }}/>
      <Drawer.Screen name="PostNewProject"    component={PostNewProjectScreen}    options={{ drawerItemStyle:{ height:0 } }}/>
      <Drawer.Screen name="EditPost"          component={EditPostScreen}          options={{ drawerItemStyle:{ height:0 } }}/>
      <Drawer.Screen name="ChatScreen"        component={ChatScreen}              options={{ drawerItemStyle:{ height:0 } }}/>
    </Drawer.Navigator>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

export default function IndustryDashboard() {
  return (
    <UserProvider>
      <ToastProvider>
        <Stack.Navigator screenOptions={{ headerShown:false }}>
          <Stack.Screen name="IndustryDrawer" component={IndustryDrawer}/>
          <Stack.Screen name="MouDetail"      component={MouDetailScreen}/>
        </Stack.Navigator>
      </ToastProvider>
    </UserProvider>
  );
}

// ─── REAL-TIME OVERLAY STYLES ────────────────────────────────────
const ov = StyleSheet.create({
  wrap: { position:"absolute", top:TOP_OFFSET, left:12, right:12, zIndex:9999, elevation:30 },
  banner: {
    flexDirection:"row", alignItems:"center", backgroundColor:"#fff",
    borderRadius:14, paddingVertical:12, paddingHorizontal:14, gap:12,
    shadowColor:"#000", shadowOffset:{width:0,height:6}, shadowOpacity:0.18, shadowRadius:14,
    borderWidth:1, borderColor:"#EEF1F4",
  },
  iconBg:   { width:38, height:38, borderRadius:19, justifyContent:"center", alignItems:"center" },
  title:    { fontSize:14, fontWeight:"800", color:"#111827" },
  body:     { fontSize:12.5, color:"#4B5563", marginTop:2 },
  closeBtn: { width:24, height:24, borderRadius:12, backgroundColor:"#F3F4F6",
              justifyContent:"center", alignItems:"center" },
});

// ─── NOTIFICATION PANEL STYLES ───────────────────────────────────
const nS = StyleSheet.create({
  panel: {
    width:width*0.86, height:"100%", backgroundColor:THEME.bg,
    shadowColor:"#000", shadowOpacity:0.18, shadowRadius:20, elevation:12,
  },
  panelHeader: { paddingTop:Platform.OS==="ios"?56:44, paddingHorizontal:18, paddingBottom:16 },
  panelHeaderRow: { flexDirection:"row", alignItems:"flex-start", justifyContent:"space-between" },
  panelTitle: { fontSize:20, fontWeight:"800", color:"#fff" },
  panelSub:   { fontSize:12, color:"rgba(255,255,255,0.5)", marginTop:3 },
  closeBtn:   { width:32, height:32, borderRadius:16, backgroundColor:"rgba(255,255,255,0.12)",
    justifyContent:"center", alignItems:"center" },
  markAllBtn: { flexDirection:"row", alignItems:"center", gap:5, marginTop:12,
    backgroundColor:"rgba(255,255,255,0.1)", paddingHorizontal:12, paddingVertical:7,
    borderRadius:20, alignSelf:"flex-start" },
  markAllTxt: { fontSize:12, color:"rgba(255,255,255,0.7)", fontWeight:"600" },
  card: { flexDirection:"row", alignItems:"flex-start", gap:12,
    paddingHorizontal:16, paddingVertical:14,
    borderBottomWidth:1, borderColor:THEME.border, backgroundColor:THEME.card },
  cardUnread: { backgroundColor:"#F5FAFB" },
  iconBox: { width:42, height:42, borderRadius:12, justifyContent:"center", alignItems:"center", marginTop:2 },
  cardTitle: { fontSize:13, fontWeight:"700", color:THEME.textPri },
  unreadDot: { width:7, height:7, borderRadius:4, backgroundColor:THEME.teal },
  cardBody:  { fontSize:12, color:THEME.textSec, marginTop:3, lineHeight:17 },
  cardTime:  { fontSize:11, color:THEME.textMute, marginTop:4, fontWeight:"500" },
});

// ─── DASHBOARD STYLES ──────────────────────────────────────────
const d = StyleSheet.create({
  header: {
    flexDirection:"row",
    alignItems:"center",
    backgroundColor:THEME.headerBg,
    paddingTop: Platform.OS==="ios" ? 52 : 38,
    paddingBottom:12,
    paddingHorizontal:14,
  },
  menuBtn: { width:32, height:32, justifyContent:"center", alignItems:"center" },
  logoBox: {
    width: 28, height: 28, borderRadius: 6,
    backgroundColor: "#fff",
    justifyContent: "center", alignItems: "center",
    overflow:"hidden",
  },
  logoCenterWrap: {
    position:"absolute", left:0, right:0, top:0, bottom:0,
    alignItems:"center", justifyContent:"center",
    paddingTop: Platform.OS === "ios" ? 52 : 38,
  },
  headerIconBtn: {
    padding:7, borderRadius:10,
    backgroundColor:"rgba(255,255,255,0.1)",
    justifyContent:"center", alignItems:"center",
  },
  badge: {
    position:"absolute", top:-3, right:-3,
    minWidth:15, height:15, borderRadius:8,
    backgroundColor:"#EF4444",
    justifyContent:"center", alignItems:"center",
    borderWidth:1.5, borderColor: THEME.headerBg,
    paddingHorizontal:3,
  },
  badgeTxt: { fontSize:8, fontWeight:"800", color:"#fff" },
  avatarBtn: {
    width:32, height:32, borderRadius:15,
    borderWidth:2, borderColor:"rgba(255,255,255,0.3)",
    overflow:"hidden",
  },
  avatarImg: { width:"100%", height:"100%" },

  heroSection: {
    backgroundColor: THEME.headerBg,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingTop: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 15,
    elevation: 10,
    shadowColor: "#193648",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    overflow: "hidden",
    position: "relative",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(25, 54, 72, 0.90)",
  },
  heroDots: {
    position: "absolute",
    bottom: 16,
    right: SCREEN_WIDTH * 0.05,
    flexDirection: "row",
    gap: 4,
    zIndex: 5,
  },
  heroDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  heroDotActive: {
    width: 14,
    backgroundColor: "#FFFFFF",
  },
  heroTopRow: { flexDirection:"row", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 },
  heroContent: { flex:1, paddingRight:10 },
  greetingPill: {
    flexDirection:"row", alignItems:"center",
    backgroundColor:"rgba(255,255,255,0.1)",
    alignSelf:"flex-start",
    paddingHorizontal:10, paddingVertical:4, borderRadius:20,
    marginBottom:8,
  },
  greetingDot:    { width:6, height:6, borderRadius:3, backgroundColor:"#34D399", marginRight:6 },
  greetingBadge:  { color:"rgba(255,255,255,0.9)", fontSize:11, fontWeight:"600" },
  nameText:       { color:"#fff", fontSize:SCREEN_WIDTH*0.065, fontWeight:"800", marginBottom:4 },
  heroSubText:    { color:"rgba(255,255,255,0.6)", fontSize:12, lineHeight:18 },

  heroStatsRow: {
    flexDirection:"row",
    backgroundColor:"rgba(255,255,255,0.08)",
    borderRadius:20, paddingVertical:15, paddingHorizontal:10,
  },
  heroStat:        { flex:1, alignItems:"center" },
  heroStatNum:     { color:"#fff", fontSize:18, fontWeight:"800" },
  heroStatLbl:     { color:"rgba(255,255,255,0.5)", fontSize:10, marginTop:2 },
  heroStatDivider: { width:1, backgroundColor:"rgba(255,255,255,0.1)", height:"70%", alignSelf:"center" },

  alertBanner: {
    marginHorizontal:16, marginBottom:20,
    backgroundColor:"#fff", borderRadius:16,
    padding:15,
    flexDirection:"row", alignItems:"center",
    borderLeftWidth:4, borderLeftColor:THEME.headerBg,
    elevation:2,
  },
  alertLeft:    { flex:1, flexDirection:"row", alignItems:"center" },
  alertIconBg:  { width:36, height:36, borderRadius:10, backgroundColor:THEME.headerBg, justifyContent:"center", alignItems:"center" },
  alertTitle:   { fontSize:14, fontWeight:"700", color:THEME.headerBg },
  alertSub:     { fontSize:11, color:"#6B7280", marginTop:2 },

  section:        { marginHorizontal:16, marginBottom:25 },
  sectionHeader:  { flexDirection:"row", alignItems:"center", marginBottom:15 },
  sectionTitle:   { fontSize:16, fontWeight:"800", color:"#111827", marginRight:10 },
  sectionAccent:  { flex:1, height:1, backgroundColor:"#E5E7EB" },
  seeAll:         { fontSize:13, color:THEME.headerBg, fontWeight:"700", marginLeft:10 },

  actionsGrid: { flexDirection:"row", flexWrap:"wrap", justifyContent:"space-between" },
  actionCard:  {
    width: (SCREEN_WIDTH - 44) / 2,
    backgroundColor: "#fff", borderRadius: 20,
    padding: 16, marginBottom: 12,
    elevation: 3,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10,
  },
  actionIconBg: { width:44, height:44, borderRadius:12, backgroundColor:THEME.iconBg,
                  justifyContent:"center", alignItems:"center", marginBottom:12 },
  actionTitle:  { fontSize:13, fontWeight:"700", color:THEME.headerBg, marginBottom:4 },
  actionDesc:   { fontSize:11, color:"#6B7280", lineHeight:15 },
  actionArrow:  { position:"absolute", top:15, right:15, width:22, height:22, borderRadius:6,
                  backgroundColor:THEME.iconBg, justifyContent:"center", alignItems:"center" },

  featureRow: {
    flexDirection:"row", alignItems:"center",
    backgroundColor:"#fff", borderRadius:16,
    padding:12, marginBottom:10,
    elevation:1,
  },
  featureIcon:   { width:42, height:42, borderRadius:12, backgroundColor:THEME.iconBg,
                   justifyContent:"center", alignItems:"center", marginRight:12 },
  featureTitle:  { fontSize:14, fontWeight:"700", color:"#111827" },
  featureDesc:   { fontSize:11, color:"#6B7280", marginTop:2 },

  mouCard: {
    marginBottom:10,
    backgroundColor: THEME.card, borderRadius:16,
    flexDirection:"row", alignItems:"center", overflow:"hidden",
    borderWidth:1, borderColor: THEME.border,
    shadowColor:"#000", shadowOpacity:0.04, shadowRadius:5, elevation:1,
  },
  mouStripe: { width:5, alignSelf:"stretch" },
  mouTitle:  { fontSize:14, fontWeight:"700", color:THEME.textPri },
  mouSub:    { fontSize:12, color:THEME.textSec, marginTop:2 },
  mouDate:   { fontSize:11, color:THEME.textMute, marginTop:3 },

  emptyCard: {
    backgroundColor:THEME.card, borderRadius:20, padding:32,
    alignItems:"center", borderWidth:2, borderColor:THEME.border, borderStyle:"dashed",
  },
  emptyIcon: { width:60, height:60, borderRadius:30, justifyContent:"center", alignItems:"center", marginBottom:12 },
  emptyTxt:  { fontSize:15, fontWeight:"700", color:THEME.textPri },
  emptySub:  { fontSize:12, color:THEME.textMute, marginTop:4 },

  postCard: {
    marginBottom:14,
    backgroundColor:THEME.card, borderRadius:20, overflow:"hidden",
    borderWidth:1, borderColor:THEME.border,
    shadowColor:"#000", shadowOpacity:0.05, shadowRadius:8, elevation:3,
  },
  postCardHead: { flexDirection:"row", alignItems:"center", paddingHorizontal:14, paddingVertical:12 },
  postAvatar:   { width:40, height:40, borderRadius:20, justifyContent:"center", alignItems:"center", overflow:"hidden" },
  postAvatarTxt:{ fontSize:14, fontWeight:"800", color:"#fff" },
  postOrg:      { fontSize:13, fontWeight:"700", color:THEME.textPri },
  postWhen:     { fontSize:11, color:THEME.textMute, marginTop:1 },
  typeTag:      { flexDirection:"row", alignItems:"center", gap:5,
                  paddingHorizontal:10, paddingVertical:5, borderRadius:20 },
  typeDot:      { width:6, height:6, borderRadius:3 },
  typeTagTxt:   { fontSize:11, fontWeight:"700" },
  postBanner:   { height:155, justifyContent:"flex-end", paddingHorizontal:16, paddingBottom:14, overflow:"hidden" },
  bannerC1:     { position:"absolute", width:140, height:140, borderRadius:70,
                  backgroundColor:"rgba(255,255,255,0.06)", top:-35, right:-35 },
  bannerC2:     { position:"absolute", width:80, height:80, borderRadius:40,
                  backgroundColor:"rgba(255,255,255,0.04)", bottom:-20, left:-15 },
  bannerTitle:  { fontSize:17, fontWeight:"800", color:"#fff" },
  bannerMeta:   { fontSize:11, color:"rgba(255,255,255,0.75)", fontWeight:"600" },
  postBody:     { padding:14 },
  postTitle:    { fontSize:15, fontWeight:"700", color:THEME.textPri },
  postDesc:     { fontSize:13, color:THEME.textSec, marginTop:5, lineHeight:18 },
  skillPill:    { backgroundColor:THEME.iconBg, borderRadius:20, paddingHorizontal:10, paddingVertical:4,
                  marginRight:7, borderWidth:1, borderColor:"#DCE4EC" },
  skillPillTxt: { fontSize:11, fontWeight:"700", color:THEME.headerBg },
  postFoot:     { flexDirection:"row", alignItems:"center", justifyContent:"space-between",
                  marginTop:12, paddingTop:12, borderTopWidth:1, borderColor:THEME.border },
  postFootTxt:  { fontSize:12, color:THEME.textSec, fontWeight:"600" },
  viewAppsBtn:  { flexDirection:"row", alignItems:"center", gap:4, backgroundColor:THEME.iconBg,
                  paddingHorizontal:12, paddingVertical:7, borderRadius:20 },
  viewAppsTxt:  { fontSize:12, color:THEME.headerBg, fontWeight:"700" },

  aiBadge: {
    flexDirection:"row", alignItems:"center",
    backgroundColor:THEME.headerBg,
    marginHorizontal:16, padding:16, borderRadius:20, marginBottom:12,
    shadowColor:THEME.headerBg, shadowOffset:{width:0, height:4}, shadowOpacity:0.25, shadowRadius:10, elevation:5,
  },
  aiBadgeLogo: { width:38, height:38, borderRadius:12, marginRight:12, backgroundColor:"#FFFFFF", padding:4 },
  aiText:      { color:"#fff", fontSize:14, fontWeight:"700" },
  aiSubText:   { color:"rgba(255,255,255,0.55)", fontSize:11, marginTop:2 },
});

// ─── DRAWER STYLES ──────────────────────────────────────────────
const STATUS_H = Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 44;
const isSmallScreen = height < 680;
const AVATAR = isSmallScreen ? 64 : 76;

const dr = StyleSheet.create({
  scrollContent: { flexGrow:1, backgroundColor:"#193648", paddingBottom:0 },

  profileCard: {
    alignItems:"center",
    paddingTop: STATUS_H + (isSmallScreen ? 12 : 20),
    paddingBottom: isSmallScreen ? 14 : 20,
    paddingHorizontal:16,
    backgroundColor:"#193648",
  },
  avatarTouch: { marginBottom: isSmallScreen ? 8 : 12, zIndex:10 },
  avatarWrapper: { position:"relative", width:AVATAR, height:AVATAR },
  avatar: {
    width:AVATAR, height:AVATAR, borderRadius:AVATAR/2,
    borderWidth:2.5, borderColor:"#f0f2f5",
    backgroundColor:"#1E3A4A",
  },
  avatarFallback: { justifyContent:"center", alignItems:"center" },
  avatarTxt: { fontSize:24, fontWeight:"900", color:"#fff" },
  cameraBadge: {
    position:"absolute", bottom:2, right:2,
    width:24, height:24, borderRadius:12,
    backgroundColor:"#193648",
    justifyContent:"center", alignItems:"center",
    borderWidth:2, borderColor:"#111D26",
  },
  studentName:  { color:"#fff", fontSize:16, fontWeight:"700", marginBottom:3 },
  studentEmail: { color:"rgba(255,255,255,0.42)", fontSize:12, marginBottom:12 },
  onlinePill: {
    flexDirection:"row", alignItems:"center",
    backgroundColor:"rgba(52,211,153,0.1)",
    paddingHorizontal:10, paddingVertical:4, borderRadius:20,
  },
  onlineDot:  { width:6, height:6, borderRadius:3, backgroundColor:"#72da6f", marginRight:5 },
  onlineText: { color:"#eef0f0", fontSize:11, fontWeight:"600" },

  sep: { height:1, backgroundColor:"#193648", marginHorizontal:0, marginVertical:0 },

  whiteSection: {
    flex:1, backgroundColor:"#ffffff",
    paddingTop:8, paddingBottom:12,
  },
  item: {
    flexDirection:"row", alignItems:"center",
    paddingVertical:11, paddingHorizontal:14,
    borderRadius:10, marginHorizontal:10, marginVertical:1,
  },
  itemActive:    { backgroundColor:"#19364818" },
  itemLbl:       { fontSize:14, fontWeight:"600", color:"#555" },
  itemLblActive: { color:"#193648", fontWeight:"700" },

  sepWhite: { height:1, backgroundColor:"#F0F0F0", marginHorizontal:14, marginVertical:8 },

  logoutRow: {
    flexDirection:"row", alignItems:"center", gap:12,
    marginHorizontal:10, paddingVertical:12, paddingHorizontal:14,
    borderRadius:10, backgroundColor:"rgba(239,68,68,0.07)",
  },
  logoutIcon: {
    width:28, height:28, borderRadius:8,
    backgroundColor:"rgba(239,68,68,0.12)",
    justifyContent:"center", alignItems:"center",
  },
  logoutTxt: { color:"#EF4444", fontWeight:"700", fontSize:14 },

  footer:      { alignItems:"center", gap:5, paddingVertical:18 },
  footerLogo:  { width:24, height:24, borderRadius:6 },
  footerBrand: { color:"rgba(0,0,0,0.25)", fontSize:10 },
});