import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator, DrawerContentComponentProps } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated, Dimensions, Image, Modal, Platform,
  ScrollView, StatusBar, StyleSheet, Text,
  TouchableOpacity, View, RefreshControl,
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

import {
  API_INT, API_MOU, API_PROJ, C, SBadge,
  ToastProvider, UserProvider, fmtDate,
  sharedStyles, useUser, width,
} from "./shared";

const { height } = Dimensions.get("window");

// ── THEME — exactly matching the student dashboard screenshot ────
const THEME = {
  // Dark navy used in header & hero (matches screenshot top section)
  navy:      "#0D1B2A",
  navyMid:   "#122333",
  navyLight: "#1A3045",
  // Page background — light cool gray (matches screenshot body)
  bg:        "#F0F2F5",
  card:      "#FFFFFF",
  // Teal accent (matches the CX logo box border tint & active states)
  teal:      "#1A6B72",
  tealLight: "#E8F4F5",
  // Supporting accents
  accent:    "#2A5068",
  steel:     "#5B8FA8",
  // Text
  textPri:   "#0D1B2A",
  textSec:   "#5B7080",
  textMute:  "#9BB0BC",
  // Status colours
  green:     "#27AE60",
  amber:     "#E67E22",
  red:       "#E74C3C",
  // Borders
  border:    "#E3ECF0",
  // Header bg (same as navy — matches screenshot)
  headerBg:  "#193648",
};

// ─── MOCK NOTIFICATIONS ──────────────────────────────────────────
const INITIAL_NOTIFICATIONS = [
  { _id:"n1", icon:"people",           color:THEME.teal,   bg:THEME.tealLight, title:"New Application",    body:"Ayesha Tariq applied for Frontend Intern",        time:"2m ago",  read:false },
  { _id:"n2", icon:"document-text",    color:THEME.green,  bg:"#E8F6EE",       title:"MOU Status Updated", body:"Your MOU with NUCES moved to Review stage",       time:"1h ago",  read:false },
  { _id:"n3", icon:"mail-unread",      color:THEME.accent, bg:"#E8EEF3",       title:"Invitation Received",body:"QAU invited you to a collaboration workshop",     time:"3h ago",  read:true  },
  { _id:"n4", icon:"checkmark-circle", color:THEME.amber,  bg:"#FDF3E7",       title:"Event Approved",     body:"Your AI Summit event was published successfully", time:"1d ago",  read:true  },
  { _id:"n5", icon:"people",           color:THEME.red,    bg:"#FDEBEA",       title:"Application Accepted",body:"Hassan Ali Mir was accepted for AI Project",     time:"2d ago",  read:true  },
];

// ─── NOTIFICATION PANEL ──────────────────────────────────────────
function NotificationPanel({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const slideAnim = useRef(new Animated.Value(-width * 0.88)).current;
  const [notes, setNotes] = useState(INITIAL_NOTIFICATIONS);
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
              <TouchableOpacity onPress={() => setNotes(notes.map((n) => ({ ...n, read:true })))}
                style={nS.markAllBtn}>
                <Ionicons name="checkmark-done" size={13} color="rgba(255,255,255,0.8)" />
                <Text style={nS.markAllTxt}>Mark all as read</Text>
              </TouchableOpacity>
            )}
          </LinearGradient>

          <ScrollView style={{ flex:1, backgroundColor:THEME.bg }} showsVerticalScrollIndicator={false}>
            {notes.map((n) => (
              <TouchableOpacity key={n._id}
                style={[nS.card, !n.read && nS.cardUnread]}
                onPress={() => setNotes(notes.map((x) => x._id===n._id ? { ...x, read:true } : x))}>
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
function DashboardScreen() {
  const nav = useNavigation<any>();
  const { user, ax } = useUser();
  const [counts, setCounts] = useState({ mous:0, internships:0, projects:0, pending:0 });
  const [recentMous, setRecentMous] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount] = useState(INITIAL_NOTIFICATIONS.filter((n)=>!n.read).length);
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const loadData = async () => {
    const a = ax();
    const headers = { "x-industry-id": user?._id, "x-company-name": user?.name };
    try {
      const [m, postsRes] = await Promise.all([
        a.get(`${API_MOU}/mine`, { headers }).catch(()=>({ data:[] })),
        a.get("/api/industry/posts/mine", { headers }).catch(()=>({ data:[] })),
      ]);
      const mous = m.data || [];
      const allPosts = postsRes.data || [];
      const pending = mous.filter((x:any)=>
        ["Sent to Industry Laison Incharge","Changes Proposed"].includes(x.status)
      ).length;
      const internshipCount = allPosts.filter((x:any) => x.type === "Internship").length;
      const projectCount = allPosts.filter((x:any) => x.type === "Project").length;
      setCounts({ mous:mous.length, internships:internshipCount, projects:projectCount, pending });
      setRecentMous(mous.slice(0,3));
      setPosts(allPosts);
    } catch(e:any) {
      console.log("loadData error:", e?.response?.status, e?.response?.data);
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue:1, duration:700, useNativeDriver:true }),
      Animated.timing(slideAnim, { toValue:0, duration:600, useNativeDriver:true }),
    ]).start();
    loadData();
  }, []);

  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };
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
    { icon:"search",               label:"Browse\nOpportunities",  screen:"PostOpportunity",     color:"#193648"},
    { icon:"sparkles",             label:"AI\nRecommend",          screen:"AIRecommend",         color: "#193648" },
    { icon:"people",               label:"My\nApplications",       screen:"StudentApplications", color:"#193648" },
    { icon:"calendar",              label:"Events",                 screen:"EventCreation",       color:"#193648"  },
    { icon:"mail-unread",          label:"Invitations",            screen:"Invitations",         color:"#193648"  },
    { icon:"document-text",        label:"MOU\nManagement",        screen:"MoUs",                color:"#193648"  },
    { icon:"calendar-number",      label:"My\nEvents",             screen:"EventsManage",        color:"#193648"},
    { icon:"newspaper",            label:"My\nPosts",              screen:"MyPosts",             color:"#193648"   },
  ];

  const getGreeting = () => {
    const h = new Date().getHours();
    if(h<12) return "Good Morning";
    if(h<17) return "Good Afternoon";
    return "Good Night";
  };

  return (
    <View style={{ flex:1, backgroundColor:THEME.bg }}>
      {/* Status bar light — matches screenshot white text on dark header */}
      <StatusBar barStyle="light-content" backgroundColor={THEME.headerBg} />
      <NotificationPanel visible={notifOpen} onClose={() => setNotifOpen(false)} />

      {/* ── Top Navigation Bar — dark navy, matches screenshot exactly ── */}
      <View style={d.header}>
        {/* CX logo box — leftmost position */}
        <View style={d.logoBox}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={{ width: 40, height: 40 }}
          />
        </View>

        {/* Hamburger menu — right after logo box */}
        <TouchableOpacity onPress={()=>nav.openDrawer()} style={d.menuBtn}>
          <Ionicons name="menu" size={26} color="#fff"/>
        </TouchableOpacity>

        <View style={{ flex:1 }}/>

        <View style={{ flexDirection:"row", alignItems:"center", gap:10 }}>
          {/* Bell icon — outline, white, matches screenshot */}
          <TouchableOpacity onPress={()=>setNotifOpen(true)} style={d.headerIconBtn}>
            <Ionicons name="notifications-outline" size={24} color="#fff"/>
            {unreadCount>0 && (
              <View style={d.badge}>
                <Text style={d.badgeTxt}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          {/* Avatar circle — matches screenshot grey circle */}
          <TouchableOpacity onPress={()=>nav.navigate("Profile")} style={d.avatarBtn}>
            {user?.logo
              ? <Image source={{uri:user.logo}} style={d.avatarImg}/>
              : <Ionicons name="person-circle" size={36} color="rgba(255,255,255,0.55)"/>}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:100}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.teal}/>}>
        <Animated.View style={{opacity:fadeAnim, transform:[{translateY:slideAnim}]}}>

          {/* ── Hero Section — dark navy with rounded bottom corners, matches screenshot ── */}
          <View style={d.heroSection}>
            {/* Greeting pill + Messages button row */}
            <View style={d.heroTopRow}>
              {/* "Good Night" pill — semi-transparent, green dot, matches screenshot */}
              <View style={d.greetingPill}>
                <View style={d.onlineDot}/>
                <Text style={d.greetingTxt}>{getGreeting()}</Text>
              </View>
             
            </View>

            {/* Company name — large bold white, matches "amna" in screenshot */}
            <Text style={d.heroName} numberOfLines={1}>{user?.name||"Industry Partner"}</Text>
            {user?.industry
              ? <Text style={d.heroSub}>{user.industry} · Empowering talent connections</Text>
              : <Text style={d.heroSub}>Your industry portal for talent & collaboration</Text>}

            {/* Stat strip — 4 columns with dividers, matches screenshot exactly */}
            <View style={d.heroStats}>
              {[
                { n:counts.mous,        lbl:"MOUs"       },
                { n:counts.internships, lbl:"Internships" },
                { n:counts.projects,    lbl:"Projects"    },
                { n:counts.pending,     lbl:"Pending"     },
              ].map((s,i)=>(
                <React.Fragment key={i}>
                  {i>0 && <View style={d.statDivider}/>}
                  <View style={d.heroStatItem}>
                    <Text style={[d.heroStatN, s.lbl==="Pending"&&counts.pending>0&&{color:"#FF6B6B"}]}>{s.n}</Text>
                    <Text style={d.heroStatLbl}>{s.lbl}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* ── Icon Stat Cards — white cards overlapping hero bottom, matches screenshot ── */}
          <View style={d.iconCardsRow}>
            {[
              { n:counts.mous,        lbl:"MOUs",        icon:"document-text-outline" },
              { n:counts.internships, lbl:"Internships", icon:"briefcase-outline"     },
              { n:counts.projects,    lbl:"Projects",    icon:"flask-outline"         },
              { n:counts.pending,     lbl:"Pending",     icon:"time-outline"          },
            ].map((s,i)=>(
              <View key={i} style={d.iconCard}>
                {/* Icon in slightly tinted bg circle — matches screenshot style */}
                <View style={d.iconCardCircle}>
                  <Ionicons name={s.icon as any} size={24} color={
                    s.lbl==="Pending" && counts.pending>0 ? THEME.red : THEME.textSec
                  }/>
                </View>
                <Text style={[d.iconCardN, s.lbl==="Pending"&&counts.pending>0&&{color:THEME.red}]}>{s.n}</Text>
                <Text style={d.iconCardLbl}>{s.lbl.toUpperCase()}</Text>
              </View>
            ))}
          </View>

          {/* ── Profile Completion CTA — white card, dark icon box, matches screenshot ── */}
          <TouchableOpacity style={d.ctaCard} onPress={()=>nav.navigate("Profile")} activeOpacity={0.88}>
            <View style={d.ctaIconBox}>
              <Ionicons name="document-attach-outline" size={22} color="#fff"/>
            </View>
            <View style={{flex:1, marginLeft:14}}>
              <Text style={d.ctaTitle}>Complete Your Profile</Text>
              <Text style={d.ctaSub}>Add company details to attract top talent ✨</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={"#193648"}/>
          </TouchableOpacity>

          {/* ── Pending MOU Alert ── */}
          {counts.pending>0 && (
            <TouchableOpacity onPress={()=>nav.navigate("MoUs")} style={d.alertCard} activeOpacity={0.88}>
              <View style={d.alertInner}>
                <Ionicons name="alert-circle" size={18} color={THEME.red}/>
                <Text style={d.alertTxt}>{counts.pending} MOU{counts.pending>1?"s":""} need your attention</Text>
                <Ionicons name="chevron-forward" size={14} color={THEME.red}/>
              </View>
            </TouchableOpacity>
          )}

          {/* ── Quick Actions section header ── */}
          <View style={d.secHeader}>
            <Text style={d.secTitle}>Quick Actions</Text>
          </View>

          {/* ── 2-column Quick Actions grid — white cards, matches screenshot style exactly ── */}
          <View style={d.actionsGrid}>
            {QUICK_ACTIONS.map((a,i)=>(
              <TouchableOpacity key={i} style={d.actionCard} onPress={()=>nav.navigate(a.screen)} activeOpacity={0.82}>
                {/* Arrow in top-right — light gray circle like screenshot */}
                <View style={d.actionArrow}>
                  <Ionicons name="arrow-forward" size={14} color={THEME.textMute}/>
                </View>
                {/* Icon box — light bg, dark icon — matches screenshot */}
                <View style={d.actionIconBox}>
                  <Ionicons name={a.icon as any} size={28} color={THEME.textPri}/>
                </View>
                <Text style={d.actionLabel}>{a.label.replace("\n"," ")}</Text>
                <Text style={d.actionSub}>{
                  a.screen==="PostOpportunity"    ? "Find & post internships" :
                  a.screen==="AIRecommend"        ? "Personalized suggestions" :
                  a.screen==="StudentApplications"? "Track applicant status" :
                  a.screen==="EventCreation"      ? "Job fairs & seminars" :
                  a.screen==="Invitations"        ? "University requests" :
                  a.screen==="MoUs"               ? "Manage agreements" :
                  a.screen==="EventsManage"       ? "View your events" :
                                                    "View & manage"
                }</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Recent MOUs ── */}
          {recentMous.length>0 && (
            <>
              <View style={d.secHeader}>
                <Text style={d.secTitle}>Recent MOUs</Text>
                <TouchableOpacity onPress={()=>nav.navigate("MoUs")}>
                  <Text style={d.seeAll}>View all</Text>
                </TouchableOpacity>
              </View>
              {recentMous.map((m)=>(
                <TouchableOpacity key={m._id} style={d.mouCard}
                  onPress={()=>nav.navigate("MouDetail",{mouId:m._id})} activeOpacity={0.88}>
                  <View style={[d.mouStripe, {backgroundColor:THEME.teal}]}/>
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
            </>
          )}

          {/* ── Your Posts ── */}
          <View style={d.secHeader}>
            <Text style={d.secTitle}>Your Posts</Text>
            <TouchableOpacity onPress={()=>nav.navigate("MyPosts")}>
              <Text style={d.seeAll}>View all</Text>
            </TouchableOpacity>
          </View>

          {posts.length===0 ? (
            <TouchableOpacity style={d.emptyCard} onPress={()=>nav.navigate("PostOpportunity")}>
              <View style={[d.emptyIcon, {backgroundColor:THEME.tealLight}]}>
                <Ionicons name="add-circle-outline" size={30} color={THEME.teal}/>
              </View>
              <Text style={d.emptyTxt}>Post your first opportunity</Text>
              <Text style={d.emptySub}>Internships • Projects • Workshops</Text>
            </TouchableOpacity>
          ) : (
            posts.map((post)=>{
              const tc=typeColor(post.type);
              return (
                <View key={post._id} style={d.postCard}>
                  <View style={d.postCardHead}>
                    <View style={[d.postAvatar, {backgroundColor:THEME.teal}]}>
                      {user?.logo
                        ? <Image source={{uri:user.logo}} style={{width:40,height:40,borderRadius:20}}/>
                        : <Text style={d.postAvatarTxt}>{initials(user?.name||"CX")}</Text>}
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
                        <Ionicons name="arrow-forward" size={12} color={THEME.teal}/>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}

          {/* ── Company Card ── */}
          <View style={d.coCard}>
            <LinearGradient colors={["#193648", "#193648"]} style={d.coCardGrad}
              start={{x:0,y:0}} end={{x:1,y:1}}>
              <View style={d.coDecor}/>
              <View style={{flexDirection:"row", alignItems:"center"}}>
                <View style={d.coLogo}>
                  {user?.logo
                    ? <Image source={{uri:user.logo}} style={{width:54,height:54,borderRadius:15}}/>
                    : <Text style={d.coLogoTxt}>{initials(user?.name||"CX")}</Text>}
                </View>
                <View style={{flex:1, marginLeft:14}}>
                  <Text style={d.coName}>{user?.name||"Your Company"}</Text>
                  <Text style={d.coSub}>{user?.industry}</Text>
                  {user?.address&&<Text style={d.coAddr}>📍 {user.address}</Text>}
                </View>
                <TouchableOpacity onPress={()=>nav.navigate("Profile")} style={d.coEditBtn}>
                  <Ionicons name="pencil" size={13} color={THEME.tealLight}/>
                  <Text style={d.coEditTxt}>Edit</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

        </Animated.View>
      </ScrollView>

      {/* ── CXbot Floating Button — circular, matches screenshot bottom-right ── */}
      <CXbotFloatingButton />
    </View>
  );
}

// ─── CUSTOM DRAWER ───────────────────────────────────────────────
function CustomDrawer(props: DrawerContentComponentProps) {
  const { user, setUser } = useUser();
  const drawerNav = props.navigation;
  const initials = (n:string) => n?.split(" ").map((w)=>w[0]).slice(0,2).join("").toUpperCase()||"CX";

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            drawerNav.closeDrawer();
            drawerNav.reset({
              index: 0,
              routes: [{ name: "IndustryLogin" }],
            });
          },
        },
      ]
    );
  };

  const ITEMS = [
    { screen:"Dashboard",           icon:"grid-outline",            label:"Dashboard",        color:THEME.teal   },
    { screen:"PostOpportunity",     icon:"add-circle-outline",      label:"Post Opportunity", color:THEME.teal   },
    { screen:"StudentApplications", icon:"people-outline",          label:"Applications",     color:THEME.green  },
    { screen:"Invitations",         icon:"mail-outline",            label:"Invitations",      color:THEME.accent },
    { screen:"EventCreation",       icon:"calendar-outline",        label:"Create Event",     color:THEME.red    },
    { screen:"MoUs",                icon:"document-text-outline",   label:"MOU Management",   color:THEME.steel  },
    { screen:"InternshipsMain",     icon:"briefcase-outline",       label:"Internships",      color:THEME.amber  },
    { screen:"ManageProjects",      icon:"flask-outline",           label:"Projects",         color:THEME.accent },
    { screen:"AIChatbot",           icon:"sparkles-outline",        label:"CXbot AI",         color:THEME.amber  },
    { screen:"Profile",             icon:"person-circle-outline",   label:"My Profile",       color:THEME.steel  },
    { screen:"MyPosts",             icon:"newspaper-outline",       label:"My Posts",         color:THEME.amber  },
    { screen:"EventsManage",        icon:"calendar-number-outline", label:"My Events",        color:THEME.teal   },
  ];

  const current = props.state?.routes[props.state?.index]?.name;

  return (
    <View style={{flex:1, backgroundColor:THEME.bg}}>
      <LinearGradient colors={['#193648', '#193648']} style={dr.header}
        start={{x:0,y:0}} end={{x:1,y:1}}>
        <View style={dr.decor}/>
        <View style={dr.topRow}>
          <View style={{flexDirection:"row", alignItems:"center", gap:10}}>
            {/* Logo box — white rounded square, unchanged */}
            <View style={dr.logoBox}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={{ width: 40, height: 40 }}
              />
            </View>
            <Text style={dr.brand}>Colla<Text style={{color:"#ffffff"}}>X</Text>ion</Text>
          </View>
          <TouchableOpacity onPress={()=>drawerNav.closeDrawer()} style={dr.closeBtn}>
            <Ionicons name="close" size={18} color="rgba(255,255,255,0.7)"/>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={dr.profileRow}
          onPress={()=>{ drawerNav.navigate("Profile"); drawerNav.closeDrawer(); }}>
          <View style={dr.avatar}>
            {user?.logo
              ? <Image source={{uri:user.logo}} style={dr.avatarImg}/>
              : <Text style={dr.avatarTxt}>{initials(user?.name||"CX")}</Text>}
          </View>
          <View style={{flex:1, marginLeft:12}}>
            <Text style={dr.uName} numberOfLines={1}>{user?.name||"Partner"}</Text>
            <View style={{flexDirection:"row", alignItems:"center", gap:5, marginTop:3}}>
              <View style={dr.onlineDot}/>
              <Text style={dr.uSub}>{user?.industry||"Industry Partner"}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.3)"/>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={{flex:1}}>
        <View style={{paddingHorizontal:14, paddingTop:16}}>
          {ITEMS.map((item,i)=>{
            const active = current===item.screen;
            return (
              <TouchableOpacity key={i}
                style={[dr.item, active && {backgroundColor:item.color+"12", borderColor:item.color+"30"}]}
                onPress={()=>{ drawerNav.navigate(item.screen); drawerNav.closeDrawer(); }}>
                <View style={[dr.itemIcon, {backgroundColor: active ? item.color+"20" : "#EEF2F5"}]}>
                  <Ionicons name={item.icon as any} size={18} color={active ? item.color : THEME.textSec}/>
                </View>
                <Text style={[dr.itemLbl, active && {color:item.color, fontWeight:"700"}]}>{item.label}</Text>
                {active && <View style={[dr.activePip, {backgroundColor:item.color}]}/>}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{paddingHorizontal:14, paddingTop:8, paddingBottom:8}}>
          <TouchableOpacity style={dr.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
            <View style={dr.logoutIconBox}>
              <Ionicons name="log-out-outline" size={20} color={THEME.red}/>
            </View>
            <Text style={dr.logoutTxt}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={dr.footer}>
          <Text style={dr.footerBrand}>CollaXion v2.0</Text>
          <Text style={dr.footerSub}>Industry Portal</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── DRAWER NAVIGATOR ────────────────────────────────────────────
const Drawer = createDrawerNavigator();

function IndustryDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props)=><CustomDrawer {...props}/>}
      screenOptions={{ headerShown:false, drawerStyle:{ width:width*0.82 } }}>
      <Drawer.Screen name="Dashboard"           component={DashboardScreen}/>
      <Drawer.Screen name="PostOpportunity"     component={PostOpportunityScreen}/>
      <Drawer.Screen name="StudentApplications" component={StudentApplicationsScreen}/>
      <Drawer.Screen name="Invitations"         component={InvitationsScreen}/>
      <Drawer.Screen name="EventCreation"       component={EventCreationScreen}/>
      <Drawer.Screen name="MoUs"                component={MoUScreen}/>
      <Drawer.Screen name="InternshipsMain"     component={InternshipsMainScreen}/>
      <Drawer.Screen name="ManageProjects"      component={ManageProjectsScreen}/>
      <Drawer.Screen name="MessagesMain"        component={MessagesScreen}/>
      <Drawer.Screen name="AIChatbot"           component={AIChatbotScreen}/>
      <Drawer.Screen name="Profile"             component={ProfileScreen}/>
      <Drawer.Screen name="CreateMoU"           component={CreateMoUScreen}         options={{drawerItemStyle:{display:"none"}}}/>
      <Drawer.Screen name="PostNewInternship"   component={PostNewInternshipScreen} options={{drawerItemStyle:{display:"none"}}}/>
      <Drawer.Screen name="PostNewProject"      component={PostNewProjectScreen}    options={{drawerItemStyle:{display:"none"}}}/>
      <Drawer.Screen name="MyPosts"             component={MyPostsScreen}/>
      <Drawer.Screen name="EditPost"            component={EditPostScreen}          options={{drawerItemStyle:{display:"none"}}}/>
      <Drawer.Screen name="EventsManage"        component={EventsManageScreen}/>
      <Drawer.Screen name="ChatScreen"          component={ChatScreen}              options={{drawerItemStyle:{display:"none"}}}/>
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

// ─── NOTIFICATION STYLES ─────────────────────────────────────────
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

// ─── DASHBOARD STYLES ────────────────────────────────────────────
const d = StyleSheet.create({

  // ── Header — dark navy, matches screenshot top bar exactly ──
  header: {
    flexDirection:"row",
    alignItems:"center",
    backgroundColor:'#193648' ,          // deep navy — matches screenshot
    paddingTop: Platform.OS==="ios" ? 52 : 38,
    paddingBottom:14,
    paddingHorizontal:16,
    gap:10,
  },
  menuBtn: { width:36, height:36, justifyContent:"center", alignItems:"center" },

  // White rounded square logo box — UNCHANGED as instructed
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize:18, fontWeight:"800", color:"#fff" },
  headerIconBtn: {
    width:40, height:40, borderRadius:20,
    justifyContent:"center", alignItems:"center",
  },
  // Red notification badge
  badge: {
    position:"absolute", top:4, right:4,
    width:16, height:16, borderRadius:8,
    backgroundColor: THEME.red,
    justifyContent:"center", alignItems:"center",
    borderWidth:1.5, borderColor: THEME.headerBg,
  },
  badgeTxt: { fontSize:9, fontWeight:"900", color:"#fff" },
  // Avatar — no border, just icon like screenshot
  avatarBtn: {
    width:36, height:36, borderRadius:18,
    justifyContent:"center", alignItems:"center", overflow:"hidden",
  },
  avatarImg: { width:36, height:36, borderRadius:18 },

  // ── Hero — dark navy with rounded bottom, matches screenshot ──
  heroSection: {
    backgroundColor: THEME.headerBg,
    paddingHorizontal:20,
    paddingTop:16,
    paddingBottom:32,                         // extra bottom for card overlap
    borderBottomLeftRadius:30,
    borderBottomRightRadius:30,
  },
  heroTopRow: {
    flexDirection:"row", alignItems:"center",
    justifyContent:"space-between", marginBottom:16,
  },
  // "Good Night" pill — semi-transparent white, matches screenshot
  greetingPill: {
    flexDirection:"row", alignItems:"center", gap:6,
    backgroundColor:"rgba(255,255,255,0.1)",
    paddingHorizontal:13, paddingVertical:7, borderRadius:20,
  },
  onlineDot: { width:7, height:7, borderRadius:4, backgroundColor:"#2ECC71" },
  greetingTxt: { fontSize:13, color:"rgba(255,255,255,0.9)", fontWeight:"600" },
  // "Messages" button — semi-transparent, badge
  msgBtn: {
    flexDirection:"row", alignItems:"center", gap:6,
    backgroundColor:"rgba(255,255,255,0.13)",
    paddingHorizontal:13, paddingVertical:8, borderRadius:22,
  },
  msgTxt:      { fontSize:13, color:"#fff", fontWeight:"700" },
  msgBadge:    {
    width:18, height:18, borderRadius:9,
    backgroundColor: THEME.red,
    justifyContent:"center", alignItems:"center",
  },
  msgBadgeTxt: { fontSize:9, fontWeight:"900", color:"#fff" },
  // Large bold white name — matches "amna" in screenshot
  heroName:    { fontSize:32, fontWeight:"900", color:"#fff", marginBottom:5 },
  heroSub:     { fontSize:13, color:"rgba(255,255,255,0.5)", lineHeight:18 },

  // Stat strip — frosted dark bg, 4 columns with thin dividers
  heroStats: {
    flexDirection:"row", alignItems:"center",
    backgroundColor:"rgba(255,255,255,0.07)",
    borderRadius:20, marginTop:22,
    paddingVertical:18, paddingHorizontal:8,
  },
  heroStatItem: { flex:1, alignItems:"center" },
  heroStatN:    { fontSize:22, fontWeight:"900", color:"#fff" },
  heroStatLbl:  { fontSize:10, color:"rgba(255,255,255,0.45)", marginTop:3, fontWeight:"600" },
  statDivider:  { width:1, height:32, backgroundColor:"rgba(255,255,255,0.12)" },

  // ── Icon Stat Cards — white, overlap hero bottom edge (matches screenshot) ──
  iconCardsRow: {
    flexDirection:"row",
    gap:10,
    paddingHorizontal:14,
    marginTop:-20,                            // pull up to overlap hero
    marginBottom:16,
  },
  iconCard: {
    flex:1,
    backgroundColor: THEME.card,
    borderRadius:20,
    paddingVertical:18,
    alignItems:"center",
    shadowColor:"#000", shadowOpacity:0.07, shadowRadius:10, elevation:4,
    borderWidth:1, borderColor: THEME.border,
  },
  // Small icon container inside each card
  iconCardCircle: {
    width:44, height:44, borderRadius:22,
    backgroundColor:"#F0F2F5",
    justifyContent:"center", alignItems:"center",
    marginBottom:8,
  },
  iconCardN:   { fontSize:20, fontWeight:"900", color:THEME.textPri },
  iconCardLbl: {
    fontSize:9, color:THEME.textSec,
    marginTop:2, fontWeight:"700", letterSpacing:0.5,
  },

  // ── CTA Card — white, dark icon box left, chevron right (matches screenshot) ──
  ctaCard: {
    marginHorizontal:14, marginBottom:14,
    backgroundColor: THEME.card,
    borderRadius:20,
    flexDirection:"row", alignItems:"center",
    paddingHorizontal:16, paddingVertical:18,
    borderWidth:1, borderColor: THEME.border,
    shadowColor:"#000", shadowOpacity:0.04, shadowRadius:6, elevation:2,
  },
  ctaIconBox: {
    width:46, height:46, borderRadius:14,
    backgroundColor: "#193648",
    justifyContent:"center", alignItems:"center",
  },
  ctaTitle: { fontSize:15, fontWeight:"800", color:THEME.textPri },
  ctaSub:   { fontSize:12, color:THEME.textSec, marginTop:3 },

  // ── Alert ──
  alertCard:  { marginHorizontal:14, marginBottom:14 },
  alertInner: {
    flexDirection:"row", alignItems:"center",
    backgroundColor:"#FDEBEA",
    borderRadius:14, paddingHorizontal:14, paddingVertical:13, gap:10,
    borderWidth:1, borderColor:"#F5C6C2",
  },
  alertTxt: { flex:1, fontSize:13, color:THEME.red, fontWeight:"700" },

  // ── Section header ──
  secHeader: {
    flexDirection:"row", justifyContent:"space-between", alignItems:"center",
    paddingHorizontal:16, paddingTop:20, paddingBottom:12,
  },
  secTitle: { fontSize:17, fontWeight:"800", color:THEME.textPri },
  seeAll:   { fontSize:13, color:THEME.teal, fontWeight:"700" },

  // ── Quick Actions 2-col grid — white cards, matches screenshot style ──
  actionsGrid: {
    paddingHorizontal:14, flexDirection:"row", flexWrap:"wrap", gap:12, marginBottom:4,
  },
  actionCard: {
    width: (width - 28 - 12) / 2,
    backgroundColor: THEME.card,
    borderRadius:22,
    padding:18,
    borderWidth:1, borderColor: THEME.border,
    shadowColor:"#000", shadowOpacity:0.05, shadowRadius:8, elevation:2,
    position:"relative",
  },
  // Arrow circle top-right — light gray, matches screenshot
  actionArrow: {
    position:"absolute", top:14, right:14,
    width:30, height:30, borderRadius:15,
    backgroundColor:"#F0F2F5",
    justifyContent:"center", alignItems:"center",
  },
  // Icon box — light bg square — matches screenshot
  actionIconBox: {
    width:50, height:50, borderRadius:14,
    backgroundColor:"#F0F2F5",
    justifyContent:"center", alignItems:"center",
    marginBottom:12,
  },
  actionLabel: { fontSize:14, fontWeight:"800", color:THEME.textPri, marginBottom:4 },
  actionSub:   { fontSize:11, color:THEME.textSec, lineHeight:15 },

  // ── MOU cards ──
  mouCard: {
    marginHorizontal:14, marginBottom:10,
    backgroundColor: THEME.card, borderRadius:16,
    flexDirection:"row", alignItems:"center", overflow:"hidden",
    borderWidth:1, borderColor: THEME.border,
    shadowColor:"#000", shadowOpacity:0.04, shadowRadius:5, elevation:1,
  },
  mouStripe: { width:5, alignSelf:"stretch" },
  mouTitle:  { fontSize:14, fontWeight:"700", color:THEME.textPri },
  mouSub:    { fontSize:12, color:THEME.textSec, marginTop:2 },
  mouDate:   { fontSize:11, color:THEME.textMute, marginTop:3 },

  // ── Empty state ──
  emptyCard: {
    marginHorizontal:14, backgroundColor:THEME.card, borderRadius:20, padding:32,
    alignItems:"center", borderWidth:2, borderColor:THEME.border, borderStyle:"dashed",
  },
  emptyIcon: { width:60, height:60, borderRadius:30, justifyContent:"center", alignItems:"center", marginBottom:12 },
  emptyTxt:  { fontSize:15, fontWeight:"700", color:THEME.textPri },
  emptySub:  { fontSize:12, color:THEME.textMute, marginTop:4 },

  // ── Post cards ──
  postCard: {
    marginHorizontal:14, marginBottom:14,
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
  skillPill:    { backgroundColor:THEME.tealLight, borderRadius:20, paddingHorizontal:10, paddingVertical:4,
    marginRight:7, borderWidth:1, borderColor:"#BDE0E2" },
  skillPillTxt: { fontSize:11, fontWeight:"700", color:THEME.teal },
  postFoot:     { flexDirection:"row", alignItems:"center", justifyContent:"space-between",
    marginTop:12, paddingTop:12, borderTopWidth:1, borderColor:THEME.border },
  postFootTxt:  { fontSize:12, color:THEME.textSec, fontWeight:"600" },
  viewAppsBtn:  { flexDirection:"row", alignItems:"center", gap:4, backgroundColor:THEME.tealLight,
    paddingHorizontal:12, paddingVertical:7, borderRadius:20 },
  viewAppsTxt:  { fontSize:12, color:THEME.teal, fontWeight:"700" },

  // ── Company Card ──
  coCard:    { margin:14, borderRadius:20, overflow:"hidden" },
  coCardGrad:{ padding:18, overflow:"hidden" },
  coDecor:   { position:"absolute", width:200, height:200, borderRadius:100,
    backgroundColor:"#193648", top:-60, right:-60 },
  coLogo:    { width:54, height:54, borderRadius:15, backgroundColor:"rgba(255,255,255,0.12)",
    justifyContent:"center", alignItems:"center", overflow:"hidden",
    borderWidth:1, borderColor:"rgba(255,255,255,0.15)" },
  coLogoTxt: { fontSize:17, fontWeight:"900", color:"#fff" },
  coName:    { fontSize:14, fontWeight:"800", color:"#fff" },
  coSub:     { fontSize:12, color:"rgba(255,255,255,0.5)", marginTop:2 },
  coAddr:    { fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:2 },
  coEditBtn: { flexDirection:"row", alignItems:"center", gap:4,
    backgroundColor:"#84898b", paddingHorizontal:12, paddingVertical:8, borderRadius:20 },
  coEditTxt: { fontSize:12, color:THEME.tealLight, fontWeight:"700" },
});

// ─── DRAWER STYLES ───────────────────────────────────────────────
const dr = StyleSheet.create({
  header:     {
    paddingTop:Platform.OS==="ios"?56:44, paddingHorizontal:18, paddingBottom:20, overflow:"hidden",
  },
  decor:      { position:"absolute", width:180, height:180, borderRadius:90,
    backgroundColor:"rgba(255,255,255,0.03)", top:-50, right:-50 },
  topRow:     { flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:16 },
  // White rounded square logo box — UNCHANGED
  logoBox:    {
    width:36, height:36, borderRadius:10, backgroundColor:"#fff",
    justifyContent:"center", alignItems:"center",
  },
  logoTxt:    { fontSize:12, fontWeight:"900", color:"#fff" },
  brand:      { fontSize:17, fontWeight:"800", color:"#fff" },
  closeBtn:   { width:32, height:32, borderRadius:16, backgroundColor:"rgba(255,255,255,0.1)",
    justifyContent:"center", alignItems:"center" },
  profileRow: { flexDirection:"row", alignItems:"center", backgroundColor:"rgba(255,255,255,0.08)",
    borderRadius:14, padding:12 },
  avatar:     { width:46, height:46, borderRadius:23, backgroundColor:THEME.teal,
    justifyContent:"center", alignItems:"center", overflow:"hidden",
    borderWidth:2, borderColor:"rgba(255,255,255,0.2)" },
  avatarImg:  { width:46, height:46, borderRadius:23 },
  avatarTxt:  { fontSize:16, fontWeight:"900", color:"#fff" },
  onlineDot:  { width:7, height:7, borderRadius:4, backgroundColor:"#2ECC71" },
  uName:      { fontSize:14, fontWeight:"800", color:"#fff" },
  uSub:       { fontSize:11, color:"rgba(255,255,255,0.45)", fontWeight:"500" },
  item:       { flexDirection:"row", alignItems:"center", paddingVertical:11, paddingHorizontal:10,
    borderRadius:14, marginBottom:3, gap:10, borderWidth:1, borderColor:"transparent" },
  itemIcon:   { width:38, height:38, borderRadius:12, justifyContent:"center", alignItems:"center" },
  itemLbl:    { flex:1, fontSize:14, fontWeight:"600", color:THEME.textSec },
  activePip:  { width:6, height:6, borderRadius:3 },
  logoutBtn: {
    flexDirection:"row", alignItems:"center", gap:10,
    paddingVertical:12, paddingHorizontal:12,
    borderRadius:14, marginBottom:4,
    backgroundColor:"#FEF0EE",
    borderWidth:1, borderColor:"#F9D0CB",
  },
  logoutIconBox: {
    width:38, height:38, borderRadius:12,
    backgroundColor:"#FDEBE8",
    justifyContent:"center", alignItems:"center",
  },
  logoutTxt: { fontSize:14, fontWeight:"700", color:THEME.red },
  footer:     { margin:14, marginTop:8, padding:14,
    borderTopWidth:1, borderColor:THEME.border, borderRadius:10 },
  footerBrand:{ fontSize:12, fontWeight:"700", color:THEME.textSec },
  footerSub:  { fontSize:11, color:THEME.textMute, marginTop:2 },
});