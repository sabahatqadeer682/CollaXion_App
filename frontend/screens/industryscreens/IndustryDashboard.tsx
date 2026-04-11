import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated, Dimensions, Image, Modal, Platform,
  ScrollView, StatusBar, StyleSheet, Text,
  TouchableOpacity, View, RefreshControl,
} from "react-native";

import { AIChatbotScreen } from "./AIChatbotScreen";
import { InternshipsMainScreen, PostNewInternshipScreen } from "./InternshipScreens";
import { ChatScreen, MessagesScreen } from "./MessageScreens";
import { CreateMoUScreen, MoUScreen, MouDetailScreen } from "./MouScreens";
import { PostNewProjectScreen, ManageProjectsScreen } from "./ProjectScreens";
import { ProfileScreen } from "./ProfileScreen";
import { PostOpportunityScreen } from "./PostOpportunityScreen";
import { StudentApplicationsScreen } from "./StudentApplicationsScreen";
import { InvitationsScreen } from "./InvitationsScreen";
import { EventCreationScreen } from "./EventCreationScreen";
import {
  API_INT, API_MOU, API_PROJ, C, SBadge,
  ToastProvider, UserProvider, fmtDate,
  sharedStyles, useUser, width,
} from "./shared";

const { height } = Dimensions.get("window");

// ─── MOCK NOTIFICATIONS ──────────────────────────────────────────
const INITIAL_NOTIFICATIONS = [
  { _id:"n1", icon:"people",           color:"#0066CC", bg:"#E8F4FF", title:"New Application",    body:"Ayesha Tariq applied for Frontend Intern",          time:"2m ago",  read:false },
  { _id:"n2", icon:"document-text",    color:"#059669", bg:"#D1FAE5", title:"MOU Status Updated", body:"Your MOU with NUCES moved to Review stage",         time:"1h ago",  read:false },
  { _id:"n3", icon:"mail-unread",      color:"#7C3AED", bg:"#EDE9FE", title:"Invitation Received",body:"QAU invited you to a collaboration workshop",       time:"3h ago",  read:true  },
  { _id:"n4", icon:"checkmark-circle", color:"#D97706", bg:"#FEF3C7", title:"Event Approved",     body:"Your AI Summit event was published successfully",   time:"1d ago",  read:true  },
  { _id:"n5", icon:"people",           color:"#DC2626", bg:"#FEE2E2", title:"Application Accepted",body:"Hassan Ali Mir was accepted for AI Project",       time:"2d ago",  read:true  },
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
          <LinearGradient colors={["#050D1A","#0A1628"]} style={nS.panelHeader}>
            <View style={nS.panelHeaderRow}>
              <View>
                <Text style={nS.panelTitle}>Notifications</Text>
                <Text style={nS.panelSub}>{unread > 0 ? `${unread} unread` : "All caught up"}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={nS.closeBtn}>
                <Ionicons name="close" size={17} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
            </View>
            {unread > 0 && (
              <TouchableOpacity onPress={() => setNotes(notes.map((n) => ({ ...n, read:true })))}
                style={nS.markAllBtn}>
                <Ionicons name="checkmark-done" size={13} color="rgba(255,255,255,0.7)" />
                <Text style={nS.markAllTxt}>Mark all as read</Text>
              </TouchableOpacity>
            )}
          </LinearGradient>

          <ScrollView style={{ flex:1, backgroundColor:"#F8FAFC" }} showsVerticalScrollIndicator={false}>
            {notes.map((n, i) => (
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
    try {
      const [m, i, p] = await Promise.all([
        a.get(`${API_MOU}/mine`, { params:{ industryId:user?._id } }).catch(()=>({ data:[] })),
        a.get(API_INT).catch(()=>({ data:[] })),
        a.get(API_PROJ).catch(()=>({ data:[] })),
      ]);
      const mous = m.data || [];
      const pending = mous.filter((x:any)=>
        ["Sent to Industry Laison Incharge","Changes Proposed"].includes(x.status)
      ).length;
      setCounts({ mous:mous.length, internships:(i.data||[]).length, projects:(p.data||[]).length, pending });
      setRecentMous(mous.slice(0,3));
      setPosts([
        { _id:"p1", type:"Internship", title:"Frontend Developer Intern",
          description:"Join our team for a 3-month internship working on real products with senior engineers.",
          poster:null, postedAt:new Date().toISOString(), applicants:12,
          stipend:"PKR 25,000/mo", duration:"3 Months", skills:["React Native","UI/UX","JavaScript"] },
        { _id:"p2", type:"Workshop", title:"AI & Machine Learning Bootcamp",
          description:"Intensive 2-day workshop on practical ML applications for undergraduates.",
          poster:null, postedAt:new Date(Date.now()-86400000).toISOString(), applicants:34,
          stipend:"Free", duration:"2 Days", skills:["Python","TensorFlow","Data Science"] },
      ]);
    } catch(_) {}
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
    t==="Internship" ? { bg:"#E8F4FF", txt:"#0066CC", dot:"#2196F3", grad:["#0066CC","#0080EE"] as const } :
    t==="Workshop"   ? { bg:"#FFF3E0", txt:"#E65100", dot:"#FF9800", grad:["#E65100","#BF360C"] as const } :
                       { bg:"#F3E5F5", txt:"#6A1B9A", dot:"#9C27B0", grad:["#6A1B9A","#4A148C"] as const };

  const timeAgo = (iso:string) => {
    const h = Math.floor((Date.now()-new Date(iso).getTime())/3600000);
    if(h<1) return "Just now"; if(h<24) return `${h}h ago`; return `${Math.floor(h/24)}d ago`;
  };

  const QUICK_ACTIONS = [
    { icon:"add-circle",    label:"Post\nOpportunity",   screen:"PostOpportunity",     grad:["#0066CC","#004999"] as const },
    { icon:"people",        label:"Applications",         screen:"StudentApplications", grad:["#059669","#047857"] as const },
    { icon:"mail-unread",   label:"Invitations",          screen:"Invitations",         grad:["#7C3AED","#5B21B6"] as const },
    { icon:"calendar",      label:"Create\nEvent",        screen:"EventCreation",       grad:["#DC2626","#B91C1C"] as const },
    { icon:"document-text", label:"MOU\nManagement",      screen:"MoUs",                grad:["#0891B2","#0E7490"] as const },
    { icon:"sparkles",      label:"AI\nRecommend",        screen:"AIRecommend",           grad:["#D97706","#B45309"] as const },
  ];

  return (
    <View style={{ flex:1, backgroundColor:"#F0F4F8" }}>
      <StatusBar barStyle="light-content" backgroundColor="#050D1A" />
      <NotificationPanel visible={notifOpen} onClose={() => setNotifOpen(false)} />

      {/* ── Hero Banner ── */}
      <LinearGradient colors={["#050D1A","#0A1628","#0D2137"]} style={d.hero}
        start={{ x:0,y:0 }} end={{ x:1,y:1 }}>
        <View style={d.ring1}/><View style={d.ring2}/>
        <View style={[d.ring1,{ width:80,height:80,borderRadius:40,borderColor:"rgba(245,158,11,0.12)",bottom:10,left:20,top:undefined,right:undefined }]}/>

        {/* Top bar */}
        <View style={d.topBar}>
          <TouchableOpacity onPress={()=>nav.openDrawer()} style={d.iconBtn}>
            <Ionicons name="menu" size={22} color="#fff"/>
          </TouchableOpacity>
          <View style={d.brandPill}>
            <View style={d.liveIndicator}/>
            <Text style={d.brandTxt}>Colla<Text style={{color:"#F59E0B"}}>X</Text>ion</Text>
          </View>
          <View style={{ flexDirection:"row", alignItems:"center", gap:10 }}>
            <TouchableOpacity onPress={()=>setNotifOpen(true)} style={d.iconBtn}>
              <Ionicons name="notifications" size={20} color="#fff"/>
              {unreadCount>0 && (
                <View style={d.badge}>
                  <Text style={d.badgeTxt}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>nav.navigate("Profile")} style={d.avatarBtn}>
              {user?.logo
                ? <Image source={{uri:user.logo}} style={d.avatarImg}/>
                : <Text style={d.avatarTxt}>{initials(user?.name||"CX")}</Text>}
              <View style={d.onlineDot}/>
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting */}
        <View style={{marginBottom:20}}>
          <Text style={d.greetSub}>Welcome back 👋</Text>
          <Text style={d.greetName} numberOfLines={1}>{user?.name||"Industry Partner"}</Text>
          {user?.industry && <Text style={d.greetRole}>{user.industry}</Text>}
        </View>

        {/* Stat Cards */}
        <View style={d.statsRow}>
          {[
            { n:counts.mous,        lbl:"MOUs",        icon:"document-text", c:"#64B5F6" },
            { n:counts.internships, lbl:"Internships", icon:"briefcase",     c:"#81C784" },
            { n:counts.projects,    lbl:"Projects",    icon:"flask",         c:"FFB74D" },
            { n:counts.pending,     lbl:"Pending",     icon:"time",          c:counts.pending>0?"#FF7043":"#90CAF9" },
          ].map((s,i)=>(
            <View key={i} style={d.statCard}>
              <Ionicons name={s.icon as any} size={13} color={s.c} style={{marginBottom:4}}/>
              <Text style={[d.statN, s.lbl==="Pending"&&counts.pending>0&&{color:"#FF7043"}]}>{s.n}</Text>
              <Text style={d.statLbl}>{s.lbl}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:50}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0066CC"/>}>
        <Animated.View style={{opacity:fadeAnim, transform:[{translateY:slideAnim}]}}>

          {/* ── Alert ── */}
          {counts.pending>0 && (
            <TouchableOpacity onPress={()=>nav.navigate("MoUs")} style={d.alertWrap}>
              <LinearGradient colors={["#FF5722","#E64A19"]} style={d.alertInner} start={{x:0,y:0}} end={{x:1,y:0}}>
                <View style={d.alertIcon}><Ionicons name="alert-circle" size={17} color="#fff"/></View>
                <Text style={d.alertTxt}>{counts.pending} MOU{counts.pending>1?"s":""} need your attention</Text>
                <Ionicons name="chevron-forward" size={15} color="rgba(255,255,255,0.6)"/>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* ── Quick Actions ── */}
          <View style={d.secRow}>
            <View style={d.secLeft}>
              <View style={d.secBar}/>
              <Text style={d.secTitle}>Quick Actions</Text>
            </View>
          </View>

          <View style={d.actGrid}>
            {QUICK_ACTIONS.map((a,i)=>(
              <TouchableOpacity key={i} style={d.actCard} onPress={()=>nav.navigate(a.screen)} activeOpacity={0.82}>
                <LinearGradient colors={a.grad} style={d.actGrad} start={{x:0,y:0}} end={{x:1,y:1}}>
                  <View style={d.actDecor}/>
                  <Ionicons name={a.icon as any} size={24} color="#fff"/>
                </LinearGradient>
                <Text style={d.actLbl}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Recent MOUs ── */}
          {recentMous.length>0 && (
            <>
              <View style={d.secRow}>
                <View style={d.secLeft}>
                  <View style={[d.secBar,{backgroundColor:"#059669"}]}/>
                  <Text style={d.secTitle}>Recent MOUs</Text>
                </View>
                <TouchableOpacity onPress={()=>nav.navigate("MoUs")}>
                  <Text style={d.seeAll}>View all →</Text>
                </TouchableOpacity>
              </View>
              {recentMous.map((m)=>(
                <TouchableOpacity key={m._id} style={d.mouCard}
                  onPress={()=>nav.navigate("MouDetail",{mouId:m._id})} activeOpacity={0.88}>
                  <LinearGradient colors={["#0066CC","#0080EE"]} style={d.mouStripe}
                    start={{x:0,y:0}} end={{x:0,y:1}}/>
                  <View style={{flex:1,marginLeft:14,paddingVertical:14}}>
                    <Text style={d.mouTitle} numberOfLines={1}>{m.title||m.university}</Text>
                    <Text style={d.mouSub}>{m.collaborationType}</Text>
                    <Text style={d.mouDate}>{fmtDate(m.endDate)}</Text>
                  </View>
                  <View style={{paddingRight:14}}>
                    <SBadge status={m.status}/>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}

          {/* ── Posts Feed ── */}
          <View style={d.secRow}>
            <View style={d.secLeft}>
              <View style={[d.secBar,{backgroundColor:"#D97706"}]}/>
              <Text style={d.secTitle}>Your Posts</Text>
            </View>
            <TouchableOpacity onPress={()=>nav.navigate("PostOpportunity")}>
              <Text style={d.seeAll}>+ New post</Text>
            </TouchableOpacity>
          </View>

          {posts.length===0 ? (
            <TouchableOpacity style={d.emptyCard} onPress={()=>nav.navigate("PostOpportunity")}>
              <View style={d.emptyIcon}><Ionicons name="add-circle-outline" size={30} color="#0066CC"/></View>
              <Text style={d.emptyTxt}>Post your first opportunity</Text>
              <Text style={d.emptySub}>Internships · Projects · Workshops</Text>
            </TouchableOpacity>
          ) : (
            posts.map((post)=>{
              const tc=typeColor(post.type);
              return (
                <View key={post._id} style={d.postCard}>
                  <View style={d.postCardHead}>
                    <View style={d.postAvatar}>
                      {user?.logo
                        ? <Image source={{uri:user.logo}} style={{width:40,height:40,borderRadius:20}}/>
                        : <Text style={d.postAvatarTxt}>{initials(user?.name||"CX")}</Text>}
                    </View>
                    <View style={{flex:1,marginLeft:10}}>
                      <Text style={d.postOrg}>{user?.name||"Your Company"}</Text>
                      <Text style={d.postWhen}>{timeAgo(post.postedAt)}</Text>
                    </View>
                    <View style={[d.typeTag,{backgroundColor:tc.bg}]}>
                      <View style={[d.typeDot,{backgroundColor:tc.dot}]}/>
                      <Text style={[d.typeTagTxt,{color:tc.txt}]}>{post.type}</Text>
                    </View>
                  </View>
                  <LinearGradient colors={tc.grad} style={d.postBanner} start={{x:0,y:0}} end={{x:1,y:1}}>
                    <View style={d.bannerC1}/><View style={d.bannerC2}/>
                    <Ionicons name={post.type==="Internship"?"briefcase":post.type==="Workshop"?"school":"flask"}
                      size={36} color="rgba(255,255,255,0.2)" style={{marginBottom:8}}/>
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
                        <Ionicons name="people-outline" size={14} color="#64748B"/>
                        <Text style={d.postFootTxt}>{post.applicants} applicants</Text>
                      </View>
                      <TouchableOpacity style={d.viewAppsBtn} onPress={()=>nav.navigate("StudentApplications")}>
                        <Text style={d.viewAppsTxt}>View Applications</Text>
                        <Ionicons name="arrow-forward" size={12} color="#0066CC"/>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}

          {/* ── Company Card ── */}
          <View style={d.coCard}>
            <LinearGradient colors={["#050D1A","#0A1628","#0D2137"]} style={d.coCardGrad}
              start={{x:0,y:0}} end={{x:1,y:1}}>
              <View style={d.coDecor}/>
              <View style={{flexDirection:"row",alignItems:"center"}}>
                <View style={d.coLogo}>
                  {user?.logo
                    ? <Image source={{uri:user.logo}} style={{width:54,height:54,borderRadius:15}}/>
                    : <Text style={d.coLogoTxt}>{initials(user?.name||"CX")}</Text>}
                </View>
                <View style={{flex:1,marginLeft:14}}>
                  <Text style={d.coName}>{user?.name||"Your Company"}</Text>
                  <Text style={d.coSub}>{user?.industry}</Text>
                  {user?.address&&<Text style={d.coAddr}>📍 {user.address}</Text>}
                </View>
                <TouchableOpacity onPress={()=>nav.navigate("Profile")} style={d.coEditBtn}>
                  <Ionicons name="pencil" size={13} color="#67E8F9"/>
                  <Text style={d.coEditTxt}>Edit</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ─── CUSTOM DRAWER ───────────────────────────────────────────────
function CustomDrawer(props: any) {
  const { user } = useUser();
  const nav = useNavigation<any>();
  const initials = (n:string) => n?.split(" ").map((w)=>w[0]).slice(0,2).join("").toUpperCase()||"CX";

  const ITEMS = [
    { screen:"Dashboard",          icon:"grid",           label:"Dashboard",        ac:"#0066CC" },
    { screen:"PostOpportunity",    icon:"add-circle",     label:"Post Opportunity", ac:"#0066CC" },
    { screen:"StudentApplications",icon:"people",         label:"Applications",     ac:"#059669" },
    { screen:"Invitations",        icon:"mail-unread",    label:"Invitations",      ac:"#7C3AED" },
    { screen:"EventCreation",      icon:"calendar",       label:"Create Event",     ac:"#DC2626" },
    { screen:"MoUs",               icon:"document-text",  label:"MOU Management",   ac:"#0891B2" },
    { screen:"InternshipsMain",    icon:"briefcase",      label:"Internships",      ac:"#D97706" },
    { screen:"ManageProjects",     icon:"flask",          label:"Projects",         ac:"#7C3AED" },
    { screen:"AIChatbot",          icon:"sparkles",       label:"CXbot AI",         ac:"#F59E0B" },
    { screen:"Profile",            icon:"person-circle",  label:"My Profile",       ac:"#BE185D" },
  ];

  const current = props.state?.routes[props.state?.index]?.name;

  return (
    <View style={{flex:1,backgroundColor:"#F8FAFC"}}>
      <LinearGradient colors={["#050D1A","#0A1628","#0D2137"]} style={dr.header}
        start={{x:0,y:0}} end={{x:1,y:1}}>
        <View style={dr.decor}/>
        <View style={dr.topRow}>
          <View style={{flexDirection:"row",alignItems:"center",gap:8}}>
            <LinearGradient colors={["#0066CC","#004999"]} style={dr.logoBox}>
              <Text style={dr.logoTxt}>CX</Text>
            </LinearGradient>
            <Text style={dr.brand}>Colla<Text style={{color:"#F59E0B"}}>X</Text>ion</Text>
          </View>
          <TouchableOpacity onPress={()=>nav.closeDrawer()} style={dr.closeBtn}>
            <Ionicons name="close" size={17} color="rgba(255,255,255,0.6)"/>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={dr.profileRow}
          onPress={()=>{ nav.navigate("Profile"); nav.closeDrawer(); }}>
          <View style={dr.avatar}>
            {user?.logo
              ? <Image source={{uri:user.logo}} style={dr.avatarImg}/>
              : <Text style={dr.avatarTxt}>{initials(user?.name||"CX")}</Text>}
          </View>
          <View style={{flex:1,marginLeft:12}}>
            <Text style={dr.uName} numberOfLines={1}>{user?.name||"Partner"}</Text>
            <View style={{flexDirection:"row",alignItems:"center",gap:5,marginTop:3}}>
              <View style={dr.onlineDot}/>
              <Text style={dr.uSub}>{user?.industry||"Industry Partner"}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.3)"/>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{paddingHorizontal:12,paddingTop:14}}>
          {ITEMS.map((item,i)=>{
            const active = current===item.screen;
            return (
              <TouchableOpacity key={i}
                style={[dr.item, active&&{backgroundColor:item.ac+"10",borderColor:item.ac+"25"}]}
                onPress={()=>{ nav.navigate(item.screen); nav.closeDrawer(); }}>
                <View style={[dr.itemIcon,{backgroundColor:active?item.ac+"18":"#F1F5F9"}]}>
                  <Ionicons name={item.icon as any} size={17} color={active?item.ac:"#64748B"}/>
                </View>
                <Text style={[dr.itemLbl,active&&{color:item.ac,fontWeight:"700"}]}>{item.label}</Text>
                {active&&<View style={[dr.activePip,{backgroundColor:item.ac}]}/>}
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={dr.footer}>
          <Text style={dr.footerBrand}>CollaXion v2.0</Text>
          <Text style={dr.footerSub}>Industry Partner Portal</Text>
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
      <Drawer.Screen name="CreateMoU"         component={CreateMoUScreen}         options={{drawerItemStyle:{display:"none"}}}/>
      <Drawer.Screen name="PostNewInternship" component={PostNewInternshipScreen} options={{drawerItemStyle:{display:"none"}}}/>
      <Drawer.Screen name="PostNewProject"    component={PostNewProjectScreen}    options={{drawerItemStyle:{display:"none"}}}/>
      <Drawer.Screen name="ChatScreen"        component={ChatScreen}              options={{drawerItemStyle:{display:"none"}}}/>
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
  panel: { width:width*0.86, height:"100%", backgroundColor:"#F8FAFC",
    shadowColor:"#000",shadowOpacity:0.22,shadowRadius:20,elevation:12 },
  panelHeader: { paddingTop:Platform.OS==="ios"?56:44, paddingHorizontal:18, paddingBottom:16 },
  panelHeaderRow: { flexDirection:"row", alignItems:"flex-start", justifyContent:"space-between" },
  panelTitle: { fontSize:20, fontWeight:"900", color:"#fff" },
  panelSub:   { fontSize:12, color:"rgba(255,255,255,0.45)", marginTop:3 },
  closeBtn:   { width:30,height:30,borderRadius:15,backgroundColor:"rgba(255,255,255,0.1)",
    justifyContent:"center",alignItems:"center" },
  markAllBtn: { flexDirection:"row",alignItems:"center",gap:5,marginTop:12,
    backgroundColor:"rgba(255,255,255,0.08)",paddingHorizontal:12,paddingVertical:7,
    borderRadius:20,alignSelf:"flex-start" },
  markAllTxt: { fontSize:12,color:"rgba(255,255,255,0.65)",fontWeight:"600" },
  card: { flexDirection:"row",alignItems:"flex-start",gap:12,
    paddingHorizontal:16,paddingVertical:14,
    borderBottomWidth:1,borderColor:"#F1F5F9",backgroundColor:"#fff" },
  cardUnread: { backgroundColor:"#F8FBFF" },
  iconBox: { width:40,height:40,borderRadius:12,justifyContent:"center",alignItems:"center",marginTop:2 },
  cardTitle: { fontSize:13,fontWeight:"700",color:"#0A1628" },
  unreadDot: { width:7,height:7,borderRadius:4,backgroundColor:"#0066CC" },
  cardBody:  { fontSize:12,color:"#475569",marginTop:3,lineHeight:17 },
  cardTime:  { fontSize:11,color:"#94A3B8",marginTop:4,fontWeight:"500" },
});

// ─── DASHBOARD STYLES ────────────────────────────────────────────
const d = StyleSheet.create({
  hero: { paddingTop:Platform.OS==="ios"?56:44, paddingBottom:26, paddingHorizontal:18, overflow:"hidden" },
  ring1: { position:"absolute",width:220,height:220,borderRadius:110,
    borderWidth:1,borderColor:"rgba(255,255,255,0.04)",top:-70,right:-70 },
  ring2: { position:"absolute",width:140,height:140,borderRadius:70,
    borderWidth:1,borderColor:"rgba(100,181,246,0.06)",bottom:0,left:-40 },

  topBar: { flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:18 },
  iconBtn: { width:38,height:38,borderRadius:12,backgroundColor:"rgba(255,255,255,0.08)",
    justifyContent:"center",alignItems:"center" },
  badge: { position:"absolute",top:-2,right:-2,width:16,height:16,borderRadius:8,
    backgroundColor:"#EF4444",justifyContent:"center",alignItems:"center",
    borderWidth:1.5,borderColor:"#050D1A" },
  badgeTxt: { fontSize:9,fontWeight:"900",color:"#fff" },
  brandPill: { flexDirection:"row",alignItems:"center",gap:7,
    backgroundColor:"rgba(255,255,255,0.07)",paddingHorizontal:12,paddingVertical:6,borderRadius:20 },
  liveIndicator: { width:6,height:6,borderRadius:3,backgroundColor:"#22C55E" },
  brandTxt: { fontSize:14,fontWeight:"800",color:"#fff" },
  avatarBtn: { width:38,height:38,borderRadius:19,backgroundColor:"#0E7490",
    justifyContent:"center",alignItems:"center",overflow:"hidden",
    borderWidth:2,borderColor:"#F59E0B" },
  avatarImg: { width:38,height:38,borderRadius:19 },
  avatarTxt: { fontSize:13,fontWeight:"900",color:"#fff" },
  onlineDot: { position:"absolute",bottom:0,right:0,width:10,height:10,borderRadius:5,
    backgroundColor:"#22C55E",borderWidth:1.5,borderColor:"#050D1A" },

  greetSub:  { fontSize:12,color:"rgba(255,255,255,0.45)",fontWeight:"500" },
  greetName: { fontSize:21,fontWeight:"900",color:"#fff",marginTop:3 },
  greetRole: { fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:3 },

  statsRow: { flexDirection:"row",gap:8 },
  statCard: { flex:1,backgroundColor:"rgba(255,255,255,0.07)",borderRadius:13,
    paddingVertical:12,alignItems:"center",
    borderWidth:1,borderColor:"rgba(255,255,255,0.06)" },
  statN:    { fontSize:18,fontWeight:"900",color:"#fff" },
  statLbl:  { fontSize:9,color:"rgba(255,255,255,0.4)",marginTop:2,fontWeight:"600" },

  alertWrap:  { marginHorizontal:16,marginTop:16,borderRadius:14,overflow:"hidden" },
  alertInner: { flexDirection:"row",alignItems:"center",paddingHorizontal:14,paddingVertical:13,gap:10 },
  alertIcon:  { width:30,height:30,borderRadius:9,backgroundColor:"rgba(255,255,255,0.15)",
    justifyContent:"center",alignItems:"center" },
  alertTxt:   { flex:1,fontSize:13,color:"#fff",fontWeight:"700" },

  secRow: { flexDirection:"row",justifyContent:"space-between",alignItems:"center",
    paddingHorizontal:16,paddingTop:22,paddingBottom:11 },
  secLeft: { flexDirection:"row",alignItems:"center",gap:8 },
  secBar:  { width:4,height:17,borderRadius:2,backgroundColor:"#0066CC" },
  secTitle:{ fontSize:16,fontWeight:"800",color:"#0A1628" },
  seeAll:  { fontSize:13,color:"#0066CC",fontWeight:"700" },

  actGrid: { flexDirection:"row",flexWrap:"wrap",paddingHorizontal:12,gap:10 },
  actCard: { width:(width-56)/3,backgroundColor:"#fff",borderRadius:18,overflow:"hidden",
    shadowColor:"#000",shadowOpacity:0.07,shadowRadius:8,shadowOffset:{width:0,height:3},elevation:3 },
  actGrad: { height:62,justifyContent:"center",alignItems:"center",overflow:"hidden" },
  actDecor:{ position:"absolute",width:70,height:70,borderRadius:35,
    backgroundColor:"rgba(255,255,255,0.08)",top:-20,right:-15 },
  actLbl:  { fontSize:11,fontWeight:"700",color:"#334155",textAlign:"center",
    lineHeight:15,paddingVertical:10,paddingHorizontal:5 },

  mouCard:   { marginHorizontal:16,marginBottom:10,backgroundColor:"#fff",borderRadius:16,
    flexDirection:"row",alignItems:"center",overflow:"hidden",
    shadowColor:"#000",shadowOpacity:0.05,shadowRadius:6,elevation:2 },
  mouStripe: { width:5,alignSelf:"stretch" },
  mouTitle:  { fontSize:14,fontWeight:"700",color:"#0A1628" },
  mouSub:    { fontSize:12,color:"#64748B",marginTop:2 },
  mouDate:   { fontSize:11,color:"#94A3B8",marginTop:3 },

  emptyCard: { marginHorizontal:16,backgroundColor:"#fff",borderRadius:20,padding:32,
    alignItems:"center",borderWidth:2,borderColor:"#DBEAFE",borderStyle:"dashed" },
  emptyIcon: { width:58,height:58,borderRadius:29,backgroundColor:"#EFF6FF",
    justifyContent:"center",alignItems:"center",marginBottom:12 },
  emptyTxt:  { fontSize:15,fontWeight:"700",color:"#334155" },
  emptySub:  { fontSize:12,color:"#94A3B8",marginTop:4 },

  postCard:     { marginHorizontal:16,marginBottom:14,backgroundColor:"#fff",borderRadius:20,
    overflow:"hidden",shadowColor:"#000",shadowOpacity:0.07,shadowRadius:10,elevation:4 },
  postCardHead: { flexDirection:"row",alignItems:"center",paddingHorizontal:14,paddingVertical:12 },
  postAvatar:   { width:40,height:40,borderRadius:20,backgroundColor:"#0E7490",
    justifyContent:"center",alignItems:"center",overflow:"hidden" },
  postAvatarTxt:{ fontSize:14,fontWeight:"900",color:"#fff" },
  postOrg:      { fontSize:13,fontWeight:"700",color:"#0A1628" },
  postWhen:     { fontSize:11,color:"#94A3B8",marginTop:1 },
  typeTag:      { flexDirection:"row",alignItems:"center",gap:5,
    paddingHorizontal:10,paddingVertical:5,borderRadius:20 },
  typeDot:      { width:6,height:6,borderRadius:3 },
  typeTagTxt:   { fontSize:11,fontWeight:"700" },

  postBanner: { height:155,justifyContent:"flex-end",paddingHorizontal:16,paddingBottom:14,overflow:"hidden" },
  bannerC1:   { position:"absolute",width:140,height:140,borderRadius:70,
    backgroundColor:"rgba(255,255,255,0.05)",top:-35,right:-35 },
  bannerC2:   { position:"absolute",width:80,height:80,borderRadius:40,
    backgroundColor:"rgba(255,255,255,0.04)",bottom:-20,left:-15 },
  bannerTitle:{ fontSize:17,fontWeight:"900",color:"#fff" },
  bannerMeta: { fontSize:11,color:"rgba(255,255,255,0.7)",fontWeight:"600" },

  postBody:    { padding:14 },
  postTitle:   { fontSize:15,fontWeight:"800",color:"#0A1628" },
  postDesc:    { fontSize:13,color:"#475569",marginTop:5,lineHeight:18 },
  skillPill:   { backgroundColor:"#EFF6FF",borderRadius:20,paddingHorizontal:10,paddingVertical:4,
    marginRight:7,borderWidth:1,borderColor:"#BFDBFE" },
  skillPillTxt:{ fontSize:11,fontWeight:"700",color:"#1D4ED8" },
  postFoot:    { flexDirection:"row",alignItems:"center",justifyContent:"space-between",
    marginTop:12,paddingTop:12,borderTopWidth:1,borderColor:"#F1F5F9" },
  postFootTxt: { fontSize:12,color:"#64748B",fontWeight:"600" },
  viewAppsBtn: { flexDirection:"row",alignItems:"center",gap:4,backgroundColor:"#EFF6FF",
    paddingHorizontal:12,paddingVertical:7,borderRadius:20 },
  viewAppsTxt: { fontSize:12,color:"#0066CC",fontWeight:"700" },

  coCard:    { margin:16,borderRadius:20,overflow:"hidden" },
  coCardGrad:{ padding:18,overflow:"hidden" },
  coDecor:   { position:"absolute",width:200,height:200,borderRadius:100,
    backgroundColor:"rgba(255,255,255,0.03)",top:-60,right:-60 },
  coLogo:    { width:54,height:54,borderRadius:15,backgroundColor:"rgba(255,255,255,0.1)",
    justifyContent:"center",alignItems:"center",overflow:"hidden",
    borderWidth:1,borderColor:"rgba(255,255,255,0.13)" },
  coLogoTxt: { fontSize:17,fontWeight:"900",color:"#fff" },
  coName:    { fontSize:14,fontWeight:"800",color:"#fff" },
  coSub:     { fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:2 },
  coAddr:    { fontSize:11,color:"rgba(255,255,255,0.38)",marginTop:2 },
  coEditBtn: { flexDirection:"row",alignItems:"center",gap:4,
    backgroundColor:"rgba(14,116,144,0.22)",paddingHorizontal:12,paddingVertical:8,borderRadius:20 },
  coEditTxt: { fontSize:12,color:"#67E8F9",fontWeight:"700" },
});

// ─── DRAWER STYLES ───────────────────────────────────────────────
const dr = StyleSheet.create({
  header:     { paddingTop:Platform.OS==="ios"?56:44,paddingHorizontal:18,paddingBottom:20,overflow:"hidden" },
  decor:      { position:"absolute",width:180,height:180,borderRadius:90,
    backgroundColor:"rgba(255,255,255,0.03)",top:-50,right:-50 },
  topRow:     { flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:16 },
  logoBox:    { width:34,height:34,borderRadius:10,justifyContent:"center",alignItems:"center" },
  logoTxt:    { fontSize:12,fontWeight:"900",color:"#fff" },
  brand:      { fontSize:16,fontWeight:"800",color:"#fff" },
  closeBtn:   { width:30,height:30,borderRadius:15,backgroundColor:"rgba(255,255,255,0.09)",
    justifyContent:"center",alignItems:"center" },
  profileRow: { flexDirection:"row",alignItems:"center",backgroundColor:"rgba(255,255,255,0.07)",
    borderRadius:13,padding:11 },
  avatar:     { width:46,height:46,borderRadius:23,backgroundColor:"#0E7490",
    justifyContent:"center",alignItems:"center",overflow:"hidden",
    borderWidth:2,borderColor:"rgba(255,255,255,0.18)" },
  avatarImg:  { width:46,height:46,borderRadius:23 },
  avatarTxt:  { fontSize:16,fontWeight:"900",color:"#fff" },
  onlineDot:  { width:7,height:7,borderRadius:4,backgroundColor:"#22C55E" },
  uName:      { fontSize:14,fontWeight:"800",color:"#fff" },
  uSub:       { fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:"500" },
  item:       { flexDirection:"row",alignItems:"center",paddingVertical:10,paddingHorizontal:10,
    borderRadius:13,marginBottom:3,gap:10,borderWidth:1,borderColor:"transparent" },
  itemIcon:   { width:36,height:36,borderRadius:11,justifyContent:"center",alignItems:"center" },
  itemLbl:    { flex:1,fontSize:13,fontWeight:"600",color:"#475569" },
  activePip:  { width:6,height:6,borderRadius:3 },
  footer:     { margin:14,marginTop:18,padding:14,borderTopWidth:1,borderColor:"#E2E8F0",borderRadius:10 },
  footerBrand:{ fontSize:12,fontWeight:"700",color:"#64748B" },
  footerSub:  { fontSize:11,color:"#94A3B8",marginTop:2 },
});