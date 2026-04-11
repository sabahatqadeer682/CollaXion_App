/**
 * StudentApplicationsScreen.tsx
 * Shows all student applications. Approve/Reject directly on card + full detail modal with CV.
 * Uses shared ALL_APPLICATIONS from AIRecommendScreen for consistency.
 */

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert, Animated, Dimensions, FlatList, Image, Linking,
  Modal, Platform, RefreshControl, ScrollView,
  StatusBar, StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { C, useUser } from "./shared";

const { width, height } = Dimensions.get("window");

type AppStatus = "Pending" | "Approved" | "Rejected" | "Under Review";

interface Application {
  _id: string; studentName: string; studentEmail: string; studentPhone: string;
  studentAvatar?: string; university: string; degree: string; semester: string;
  cgpa: string; opportunityTitle: string; opportunityType: "Internship" | "Project" | "Workshop";
  appliedAt: string; status: AppStatus; skills: string[]; bio: string;
  cvUrl?: string; linkedIn?: string; github?: string; portfolio?: string;
  approvedByLiaison: boolean;
}

const MOCK: Application[] = [
  {
    _id: "a1", studentName: "Ayesha Tariq", studentEmail: "ayesha.tariq@nu.edu.pk",
    studentPhone: "+92 321 1234567", university: "NUCES Islamabad", degree: "BS Computer Science",
    semester: "6th Semester", cgpa: "3.72", opportunityTitle: "Frontend Developer Intern",
    opportunityType: "Internship", appliedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: "Under Review", skills: ["React Native", "JavaScript", "Figma", "UI/UX", "TypeScript", "CSS"],
    bio: "Passionate frontend developer with hands-on experience in React Native and Flutter. Looking to gain industry experience in product design.",
    cvUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf",
    linkedIn: "linkedin.com/in/ayeshatariq", github: "github.com/ayesha-dev", approvedByLiaison: true,
  },
  {
    _id: "a2", studentName: "Hassan Ali Mir", studentEmail: "hassan.mir@comsats.edu.pk",
    studentPhone: "+92 333 9876543", university: "COMSATS University", degree: "BS Software Engineering",
    semester: "7th Semester", cgpa: "3.55", opportunityTitle: "AI Research Project",
    opportunityType: "Project", appliedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    status: "Pending", skills: ["Python", "TensorFlow", "Machine Learning", "Data Science", "NLP", "OpenCV"],
    bio: "ML enthusiast working on NLP and computer vision projects. Published a research paper at an international conference.",
    cvUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf",
    github: "github.com/hassanmir", approvedByLiaison: true,
  },
  {
    _id: "a3", studentName: "Zara Mahmood", studentEmail: "zara.mahmood@qau.edu.pk",
    studentPhone: "+92 312 5551234", university: "Quaid-i-Azam University", degree: "BS Data Science",
    semester: "5th Semester", cgpa: "3.88", opportunityTitle: "Data Science Bootcamp",
    opportunityType: "Workshop", appliedAt: new Date(Date.now() - 86400000).toISOString(),
    status: "Approved", skills: ["Python", "SQL", "Tableau", "Statistics", "Power BI", "Excel"],
    bio: "Data science student passionate about visualization and BI. Top 15% on Kaggle.",
    cvUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf",
    linkedIn: "linkedin.com/in/zaramahmood", approvedByLiaison: true,
  },
  {
    _id: "a4", studentName: "Bilal Ahmed Khan", studentEmail: "bilal.khan@fast.edu.pk",
    studentPhone: "+92 300 4567890", university: "FAST Lahore", degree: "BS Software Engineering",
    semester: "8th Semester", cgpa: "3.65", opportunityTitle: "Backend Developer Intern",
    opportunityType: "Internship", appliedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    status: "Pending", skills: ["Node.js", "Express", "MongoDB", "REST APIs", "Docker", "AWS"],
    bio: "Backend developer focused on scalable microservices architecture. Built 5+ production APIs.",
    cvUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf",
    github: "github.com/bilalkhan", linkedIn: "linkedin.com/in/bilalahmedkhan", approvedByLiaison: true,
  },
  {
    _id: "a5", studentName: "Fatima Noor", studentEmail: "fatima.noor@uet.edu.pk",
    studentPhone: "+92 315 8901234", university: "UET Lahore", degree: "BS Computer Engineering",
    semester: "6th Semester", cgpa: "3.91", opportunityTitle: "Full Stack Intern",
    opportunityType: "Internship", appliedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    status: "Under Review", skills: ["React", "Node.js", "PostgreSQL", "TypeScript", "GraphQL", "Redis"],
    bio: "Full-stack developer with strong fundamentals in both systems and web. Won HackFest 2024.",
    cvUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf",
    github: "github.com/fatimanoor", approvedByLiaison: true,
  },
  {
    _id: "a6", studentName: "Usman Ghani", studentEmail: "usman.ghani@iba.edu.pk",
    studentPhone: "+92 311 2345678", university: "IBA Karachi", degree: "BS Computer Science",
    semester: "7th Semester", cgpa: "3.44", opportunityTitle: "Mobile App Developer",
    opportunityType: "Internship", appliedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    status: "Pending", skills: ["Flutter", "Dart", "Firebase", "React Native", "iOS", "Android"],
    bio: "Cross-platform mobile developer with 3 published apps on Play Store.",
    cvUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf",
    github: "github.com/usmanghani", approvedByLiaison: true,
  },
  {
    _id: "a7", studentName: "Mariam Siddiqui", studentEmail: "mariam.siddiqui@lums.edu.pk",
    studentPhone: "+92 322 3456789", university: "LUMS", degree: "BS Computer Science",
    semester: "8th Semester", cgpa: "3.95", opportunityTitle: "AI/ML Research Project",
    opportunityType: "Project", appliedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    status: "Approved", skills: ["Python", "PyTorch", "Scikit-learn", "Data Analysis", "LLMs", "Transformers"],
    bio: "AI researcher with publications in NLP and generative models. Top scorer in batch.",
    cvUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf",
    linkedIn: "linkedin.com/in/mariamsiddiqui", github: "github.com/mariam-ai", approvedByLiaison: true,
  },
  {
    _id: "a8", studentName: "Ahmed Raza Qureshi", studentEmail: "ahmed.raza@nust.edu.pk",
    studentPhone: "+92 333 4567891", university: "NUST", degree: "BS Electrical Engineering",
    semester: "6th Semester", cgpa: "3.38", opportunityTitle: "IoT Workshop",
    opportunityType: "Workshop", appliedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    status: "Pending", skills: ["Arduino", "Raspberry Pi", "C++", "Python", "Embedded Systems", "MQTT"],
    bio: "Hardware enthusiast building smart home automation systems. Winner of IEEE Robotics Competition.",
    cvUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf",
    github: "github.com/ahmedraza", approvedByLiaison: true,
  },
  {
    _id: "a9", studentName: "Sara Jamil", studentEmail: "sara.jamil@au.edu.pk",
    studentPhone: "+92 310 5678912", university: "Air University", degree: "BS Data Science",
    semester: "5th Semester", cgpa: "3.76", opportunityTitle: "Business Analyst Intern",
    opportunityType: "Internship", appliedAt: new Date(Date.now() - 9 * 86400000).toISOString(),
    status: "Pending", skills: ["Excel", "SQL", "Power BI", "Data Visualization", "Tableau", "R"],
    bio: "Aspiring business analyst with strong analytical skills and attention to detail.",
    cvUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf",
    linkedIn: "linkedin.com/in/sarajamil", approvedByLiaison: true,
  },
  {
    _id: "a10", studentName: "Hamza Tariq", studentEmail: "hamza.tariq@szabist.edu.pk",
    studentPhone: "+92 321 6789123", university: "SZABIST Islamabad", degree: "BS Software Engineering",
    semester: "7th Semester", cgpa: "3.52", opportunityTitle: "DevOps Intern",
    opportunityType: "Internship", appliedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    status: "Under Review", skills: ["Docker", "Kubernetes", "CI/CD", "AWS", "Linux", "Terraform"],
    bio: "DevOps enthusiast with hands-on experience in cloud infrastructure automation.",
    cvUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf",
    github: "github.com/hamzatariq", approvedByLiaison: true,
  },
  {
    _id: "a11", studentName: "Hira Baig", studentEmail: "hira.baig@nu.edu.pk",
    studentPhone: "+92 300 7891234", university: "NUCES Karachi", degree: "BS Computer Science",
    semester: "8th Semester", cgpa: "3.82", opportunityTitle: "UI/UX Design Intern",
    opportunityType: "Internship", appliedAt: new Date(Date.now() - 11 * 86400000).toISOString(),
    status: "Pending", skills: ["Figma", "Adobe XD", "Prototyping", "User Research", "Design Systems", "Sketch"],
    bio: "Design-focused developer who bridges the gap between engineering and creativity.",
    cvUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf",
    linkedIn: "linkedin.com/in/hirabaig", portfolio: "hirabaig.design", approvedByLiaison: true,
  },
  {
    _id: "a12", studentName: "Zain ul Abideen", studentEmail: "zain.abideen@comsats.edu.pk",
    studentPhone: "+92 315 8912345", university: "COMSATS Wah", degree: "BS Cyber Security",
    semester: "6th Semester", cgpa: "3.61", opportunityTitle: "Security Analyst Intern",
    opportunityType: "Internship", appliedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    status: "Pending", skills: ["Penetration Testing", "Wireshark", "Kali Linux", "OWASP", "Python", "Network Security"],
    bio: "Cyber security student with CTF competition experience and bug bounty findings.",
    cvUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf",
    github: "github.com/zainabideen", approvedByLiaison: true,
  },
];

const SC: Record<AppStatus, { color: string; bg: string; icon: string }> = {
  "Approved":     { color: "#059669", bg: "#D1FAE5", icon: "checkmark-circle" },
  "Rejected":     { color: "#DC2626", bg: "#FEE2E2", icon: "close-circle" },
  "Under Review": { color: "#D97706", bg: "#FEF3C7", icon: "time" },
  "Pending":      { color: "#6366F1", bg: "#EEF2FF", icon: "ellipse" },
};

const TC = {
  Internship: { color: "#0066CC", bg: "#E8F4FF", grad: ["#0066CC", "#004999"] as const },
  Project:    { color: "#6A1B9A", bg: "#F3E5F5", grad: ["#6A1B9A", "#4A148C"] as const },
  Workshop:   { color: "#E65100", bg: "#FFF3E0", grad: ["#E65100", "#BF360C"] as const },
};

const timeAgo = (iso: string) => {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (d === 0) return "Today"; if (d === 1) return "Yesterday"; return `${d} days ago`;
};

const initials = (n: string) => n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

// ─── DETAIL MODAL ─────────────────────────────────────────────
function DetailModal({ app, onClose, onApprove, onReject }:
  { app: Application | null; onClose: () => void; onApprove: (id: string) => void; onReject: (id: string) => void }) {
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.spring(slideAnim, { toValue: app ? 0 : height, useNativeDriver: true, tension: 65, friction: 11 }).start();
  }, [app]);

  if (!app) return null;
  const sc = SC[app.status], tc = TC[app.opportunityType];

  const openCV = async () => {
    if (app.cvUrl) {
      try { await WebBrowser.openBrowserAsync(app.cvUrl); }
      catch { await Linking.openURL(app.cvUrl!); }
    }
  };

  return (
    <Modal visible={!!app} transparent animationType="none" onRequestClose={onClose}>
      <View style={m.overlay}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} activeOpacity={1} />
        <Animated.View style={[m.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={m.handle} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <LinearGradient colors={["#050D1A", "#0A1628", "#0D2137"]} style={m.hero}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={m.heroDecor} />
              <TouchableOpacity onPress={onClose} style={m.closeBtn}>
                <Ionicons name="close" size={17} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
              <View style={m.heroAvatar}>
                {app.studentAvatar
                  ? <Image source={{ uri: app.studentAvatar }} style={m.heroAvatarImg} />
                  : <Text style={m.heroAvatarTxt}>{initials(app.studentName)}</Text>}
              </View>
              <Text style={m.heroName}>{app.studentName}</Text>
              <Text style={m.heroDeg}>{app.degree} · {app.semester}</Text>
              <Text style={m.heroUni}>{app.university}</Text>
              <View style={[m.statusBadge, { backgroundColor: sc.bg }]}>
                <Ionicons name={sc.icon as any} size={13} color={sc.color} />
                <Text style={[m.statusBadgeTxt, { color: sc.color }]}>{app.status}</Text>
              </View>
            </LinearGradient>

            <View style={m.body}>
              {/* Applied For */}
              <View style={[m.infoBox, { backgroundColor: tc.bg }]}>
                <Text style={[m.infoLabel, { color: tc.color }]}>Applied For</Text>
                <Text style={[m.infoTitle, { color: tc.color }]}>{app.opportunityTitle}</Text>
                <View style={[m.typePill, { backgroundColor: tc.color + "22" }]}>
                  <Text style={[m.typePillTxt, { color: tc.color }]}>{app.opportunityType}</Text>
                </View>
              </View>

              {/* Stats */}
              <View style={m.statsRow}>
                {[
                  { val: app.cgpa, key: "CGPA" },
                  { val: app.skills.length, key: "Skills" },
                  { val: timeAgo(app.appliedAt), key: "Applied" },
                ].map((st, i) => (
                  <View key={i} style={[m.statBox, i === 1 && m.statBoxBorder]}>
                    <Text style={m.statVal}>{st.val}</Text>
                    <Text style={m.statKey}>{st.key}</Text>
                  </View>
                ))}
              </View>

              {/* Bio */}
              <View style={m.sec}>
                <Text style={m.secTitle}>About</Text>
                <Text style={m.bio}>{app.bio}</Text>
              </View>

              {/* Skills */}
              <View style={m.sec}>
                <Text style={m.secTitle}>Skills</Text>
                <View style={m.skillsWrap}>
                  {app.skills.map((sk) => (
                    <View key={sk} style={m.skillChip}>
                      <Text style={m.skillChipTxt}>{sk}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Contact */}
              <View style={m.sec}>
                <Text style={m.secTitle}>Contact</Text>
                {[
                  { icon: "mail-outline", val: app.studentEmail, link: `mailto:${app.studentEmail}` },
                  { icon: "call-outline", val: app.studentPhone, link: `tel:${app.studentPhone}` },
                  app.linkedIn && { icon: "logo-linkedin", val: app.linkedIn, link: `https://${app.linkedIn}` },
                  app.github && { icon: "logo-github", val: app.github, link: `https://${app.github}` },
                  app.portfolio && { icon: "globe-outline", val: app.portfolio, link: `https://${app.portfolio}` },
                ].filter(Boolean).map((c: any, i) => (
                  <TouchableOpacity key={i} style={m.contactRow} onPress={() => Linking.openURL(c.link)}>
                    <View style={m.contactIcon}>
                      <Ionicons name={c.icon} size={15} color="#0066CC" />
                    </View>
                    <Text style={m.contactTxt} numberOfLines={1}>{c.val}</Text>
                    <Ionicons name="open-outline" size={13} color="#94A3B8" />
                  </TouchableOpacity>
                ))}
              </View>

              {/* CV Button */}
              {app.cvUrl && (
                <TouchableOpacity style={m.cvBtn} onPress={openCV} activeOpacity={0.88}>
                  <LinearGradient colors={["#DC2626", "#B91C1C"]} style={m.cvBtnGrad}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Ionicons name="document-text" size={22} color="#fff" />
                    <View style={{ flex: 1 }}>
                      <Text style={m.cvBtnTitle}>View CV / Resume</Text>
                      <Text style={m.cvBtnSub}>Opens PDF in browser</Text>
                    </View>
                    <Ionicons name="open-outline" size={17} color="rgba(255,255,255,0.7)" />
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {/* Approve / Reject */}
              {app.status !== "Approved" && app.status !== "Rejected" && (
                <View style={m.actionRow}>
                  <TouchableOpacity style={m.rejectBtn}
                    onPress={() => { onReject(app._id); onClose(); }}>
                    <Ionicons name="close-circle-outline" size={17} color="#DC2626" />
                    <Text style={m.rejectBtnTxt}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => { onApprove(app._id); onClose(); }}>
                    <LinearGradient colors={["#059669", "#047857"]} style={m.approveBtn}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                      <Ionicons name="checkmark-circle-outline" size={17} color="#fff" />
                      <Text style={m.approveBtnTxt}>Accept Application</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────
export function StudentApplicationsScreen() {
  const nav = useNavigation<any>();
  const { user } = useUser();
  const [apps, setApps] = useState<Application[]>(MOCK);
  const [filter, setFilter] = useState<"All" | AppStatus>("All");
  const [typeF, setTypeF] = useState<"All" | "Internship" | "Project" | "Workshop">("All");
  const [selected, setSelected] = useState<Application | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start(); }, []);

  const handleApprove = (id: string) => {
    Alert.alert("Accept Application", "Are you sure you want to accept this student?", [
      { text: "Cancel", style: "cancel" },
      { text: "Accept", onPress: () => setApps((p) => p.map((a) => a._id === id ? { ...a, status: "Approved" } : a)) },
    ]);
  };

  const handleReject = (id: string) => {
    Alert.alert("Reject Application", "Are you sure you want to reject this application?", [
      { text: "Cancel", style: "cancel" },
      { text: "Reject", style: "destructive", onPress: () => setApps((p) => p.map((a) => a._id === id ? { ...a, status: "Rejected" } : a)) },
    ]);
  };

  const filtered = apps.filter((a) => {
    const ms = filter === "All" || a.status === filter;
    const mt = typeF === "All" || a.opportunityType === typeF;
    return ms && mt;
  });

  const counts = {
    All: apps.length,
    Approved: apps.filter(a => a.status === "Approved").length,
    "Under Review": apps.filter(a => a.status === "Under Review").length,
    Pending: apps.filter(a => a.status === "Pending").length,
    Rejected: apps.filter(a => a.status === "Rejected").length,
  };

  const renderCard = ({ item }: { item: Application }) => {
    const sc = SC[item.status], tc = TC[item.opportunityType];
    const isPending = item.status === "Pending" || item.status === "Under Review";
    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={s.card}>
          <LinearGradient colors={tc.grad} style={s.cardStripe} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
          <View style={s.cardInner}>
            <View style={s.cardHead}>
              <View style={s.avatar}>
                {item.studentAvatar
                  ? <Image source={{ uri: item.studentAvatar }} style={s.avatarImg} />
                  : <Text style={s.avatarTxt}>{initials(item.studentName)}</Text>}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={s.studentName}>{item.studentName}</Text>
                <Text style={s.studentDeg}>{item.degree}</Text>
                <Text style={s.studentUni}>{item.university}</Text>
              </View>
              <View style={{ alignItems: "flex-end", gap: 6 }}>
                <View style={[s.statusPill, { backgroundColor: sc.bg }]}>
                  <Ionicons name={sc.icon as any} size={11} color={sc.color} />
                  <Text style={[s.statusPillTxt, { color: sc.color }]}>{item.status}</Text>
                </View>
                <Text style={s.cgpa}>⭐ {item.cgpa}</Text>
              </View>
            </View>

            <View style={s.oppRow}>
              <View style={[s.oppTag, { backgroundColor: tc.bg }]}>
                <Text style={[s.oppTagTxt, { color: tc.color }]}>{item.opportunityType}</Text>
              </View>
              <Text style={s.oppTitle} numberOfLines={1}>{item.opportunityTitle}</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
              {item.skills.slice(0, 4).map((sk) => (
                <View key={sk} style={s.skillPill}>
                  <Text style={s.skillPillTxt}>{sk}</Text>
                </View>
              ))}
              {item.skills.length > 4 && (
                <View style={[s.skillPill, { backgroundColor: "#F1F5F9" }]}>
                  <Text style={[s.skillPillTxt, { color: "#64748B" }]}>+{item.skills.length - 4}</Text>
                </View>
              )}
            </ScrollView>

            <View style={s.cardFoot}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Ionicons name="time-outline" size={12} color="#94A3B8" />
                <Text style={s.footTime}>{timeAgo(item.appliedAt)}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                {item.cvUrl && (
                  <TouchableOpacity style={s.cvMiniBtn} onPress={() => setSelected(item)}>
                    <Ionicons name="document-text" size={12} color="#DC2626" />
                    <Text style={s.cvMiniTxt}>CV</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={s.detailBtn} onPress={() => setSelected(item)}>
                  <Text style={s.detailBtnTxt}>Details</Text>
                  <Ionicons name="chevron-forward" size={12} color="#0066CC" />
                </TouchableOpacity>
              </View>
            </View>

            {isPending && (
              <View style={s.inlineActions}>
                <TouchableOpacity style={s.inlineReject} onPress={() => handleReject(item._id)}>
                  <Ionicons name="close-circle-outline" size={15} color="#DC2626" />
                  <Text style={s.inlineRejectTxt}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.inlineApproveWrap} onPress={() => handleApprove(item._id)}>
                  <LinearGradient colors={["#059669", "#047857"]} style={s.inlineApprove}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Ionicons name="checkmark-circle-outline" size={15} color="#fff" />
                    <Text style={s.inlineApproveTxt}>Accept</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F0F4F8" }}>
      <StatusBar barStyle="light-content" backgroundColor="#050D1A" />

      <LinearGradient colors={["#050D1A", "#0A1628", "#0D2137"]} style={s.header}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={s.headerDecor} />
        <View style={s.headerRow}>
          <TouchableOpacity onPress={() => nav.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={21} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={s.headerTitle}>Student Applications</Text>
            <Text style={s.headerSub}>{apps.length} applications · {counts.Approved} accepted</Text>
          </View>
          {counts.Pending > 0 && (
            <View style={s.newBadge}>
              <Text style={s.newBadgeTxt}>{counts.Pending} new</Text>
            </View>
          )}
        </View>
        <View style={s.statsRow}>
          {[
            { lbl: "Total",    n: counts.All,            c: "#90CAF9" },
            { lbl: "Accepted", n: counts.Approved,        c: "#A5D6A7" },
            { lbl: "Review",   n: counts["Under Review"], c: "#FFE082" },
            { lbl: "Pending",  n: counts.Pending,         c: "#CE93D8" },
          ].map((st, i) => (
            <View key={i} style={s.statCard}>
              <Text style={[s.statN, { color: st.c }]}>{st.n}</Text>
              <Text style={s.statLbl}>{st.lbl}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={s.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, gap: 8 }}>
          {(["All", "Approved", "Under Review", "Pending", "Rejected"] as const).map((f) => (
            <TouchableOpacity key={f} style={[s.filterChip, filter === f && s.filterChipActive]} onPress={() => setFilter(f)}>
              <Text style={[s.filterChipTxt, filter === f && s.filterChipTxtActive]}>{f}{f === "All" ? ` (${counts.All})` : ""}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={s.typeRow}>
        {(["All", "Internship", "Project", "Workshop"] as const).map((t) => (
          <TouchableOpacity key={t} style={[s.typeTab, typeF === t && s.typeTabActive]} onPress={() => setTypeF(t)}>
            <Text style={[s.typeTabTxt, typeF === t && s.typeTabTxtActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.length === 0 ? (
        <View style={s.empty}>
          <View style={s.emptyIcon}><Ionicons name="people-outline" size={38} color="#94A3B8" /></View>
          <Text style={s.emptyTxt}>No applications found</Text>
          <Text style={s.emptySub}>Try adjusting your filters</Text>
        </View>
      ) : (
        <FlatList
          data={filtered} keyExtractor={(item) => item._id} renderItem={renderCard}
          contentContainerStyle={{ padding: 16, paddingBottom: 50 }} showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={
            <RefreshControl refreshing={refreshing}
              onRefresh={async () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); }}
              tintColor="#0066CC" />
          }
        />
      )}

      <DetailModal app={selected} onClose={() => setSelected(null)} onApprove={handleApprove} onReject={handleReject} />
    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────
const s = StyleSheet.create({
  header:      { paddingTop: Platform.OS === "ios" ? 56 : 44, paddingHorizontal: 18, paddingBottom: 22, overflow: "hidden" },
  headerDecor: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.03)", top: -70, right: -60 },
  headerRow:   { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  backBtn:     { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.09)", justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 19, fontWeight: "900", color: "#fff" },
  headerSub:   { fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 },
  newBadge:    { backgroundColor: "#EF4444", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  newBadgeTxt: { fontSize: 11, fontWeight: "900", color: "#fff" },
  statsRow:    { flexDirection: "row", gap: 8 },
  statCard:    { flex: 1, backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 13, paddingVertical: 11, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  statN:       { fontSize: 18, fontWeight: "900" },
  statLbl:     { fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 2, fontWeight: "600" },

  filterBar:        { backgroundColor: "#fff", paddingVertical: 10, borderBottomWidth: 1, borderColor: "#F1F5F9" },
  filterChip:       { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: "#F1F5F9", borderWidth: 1.5, borderColor: "#E2E8F0" },
  filterChipActive: { backgroundColor: "#0A1628", borderColor: "#0A1628" },
  filterChipTxt:    { fontSize: 12, fontWeight: "600", color: "#64748B" },
  filterChipTxtActive: { color: "#fff", fontWeight: "700" },

  typeRow:         { flexDirection: "row", backgroundColor: "#fff", paddingHorizontal: 14, paddingBottom: 10, gap: 8, borderBottomWidth: 1, borderColor: "#F1F5F9" },
  typeTab:         { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10, backgroundColor: "#F8FAFC" },
  typeTabActive:   { backgroundColor: "#0A1628" },
  typeTabTxt:      { fontSize: 12, fontWeight: "600", color: "#64748B" },
  typeTabTxtActive:{ color: "#fff", fontWeight: "700" },

  card:      { backgroundColor: "#fff", borderRadius: 18, overflow: "hidden", flexDirection: "row", shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  cardStripe:{ width: 5, alignSelf: "stretch" },
  cardInner: { flex: 1, padding: 14 },
  cardHead:  { flexDirection: "row", alignItems: "flex-start" },
  avatar:    { width: 48, height: 48, borderRadius: 24, backgroundColor: "#0066CC", justifyContent: "center", alignItems: "center", overflow: "hidden", borderWidth: 2, borderColor: "#E8F4FF" },
  avatarImg: { width: 48, height: 48, borderRadius: 24 },
  avatarTxt: { fontSize: 16, fontWeight: "900", color: "#fff" },
  studentName:{ fontSize: 14, fontWeight: "800", color: "#0A1628" },
  studentDeg: { fontSize: 12, color: "#475569", marginTop: 2 },
  studentUni: { fontSize: 11, color: "#94A3B8", marginTop: 1 },
  statusPill: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  statusPillTxt: { fontSize: 10, fontWeight: "700" },
  cgpa: { fontSize: 11, fontWeight: "700", color: "#F59E0B" },

  oppRow:   { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 },
  oppTag:   { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  oppTagTxt:{ fontSize: 11, fontWeight: "700" },
  oppTitle: { flex: 1, fontSize: 13, fontWeight: "600", color: "#334155" },

  skillPill:   { backgroundColor: "#EFF6FF", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6 },
  skillPillTxt:{ fontSize: 11, fontWeight: "600", color: "#1D4ED8" },

  cardFoot:    { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: "#F1F5F9" },
  footTime:    { fontSize: 11, color: "#94A3B8", fontWeight: "500" },
  cvMiniBtn:   { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#FEE2E2", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 },
  cvMiniTxt:   { fontSize: 11, fontWeight: "700", color: "#DC2626" },
  detailBtn:   { flexDirection: "row", alignItems: "center", gap: 2 },
  detailBtnTxt:{ fontSize: 12, fontWeight: "700", color: "#0066CC" },

  inlineActions:    { flexDirection: "row", gap: 8, marginTop: 12 },
  inlineReject:     { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "#FEE2E2", borderRadius: 12, borderWidth: 1.5, borderColor: "#FECACA" },
  inlineRejectTxt:  { fontSize: 12, fontWeight: "700", color: "#DC2626" },
  inlineApproveWrap:{ flex: 1, borderRadius: 12, overflow: "hidden" },
  inlineApprove:    { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, paddingVertical: 10 },
  inlineApproveTxt: { fontSize: 12, fontWeight: "700", color: "#fff" },

  empty:     { flex: 1, justifyContent: "center", alignItems: "center", paddingBottom: 80 },
  emptyIcon: { width: 76, height: 76, borderRadius: 38, backgroundColor: "#F1F5F9", justifyContent: "center", alignItems: "center", marginBottom: 14 },
  emptyTxt:  { fontSize: 15, fontWeight: "700", color: "#334155" },
  emptySub:  { fontSize: 13, color: "#94A3B8", marginTop: 4 },
});

const m = StyleSheet.create({
  overlay:   { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  sheet:     { backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: height * 0.92, overflow: "hidden" },
  handle:    { width: 42, height: 4, borderRadius: 2, backgroundColor: "#E2E8F0", alignSelf: "center", marginTop: 12 },
  hero:      { paddingTop: 22, paddingHorizontal: 22, paddingBottom: 26, alignItems: "center", overflow: "hidden" },
  heroDecor: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.04)", top: -60, right: -60 },
  closeBtn:  { position: "absolute", top: 14, right: 14, width: 30, height: 30, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.1)", justifyContent: "center", alignItems: "center" },
  heroAvatar:{ width: 78, height: 78, borderRadius: 39, backgroundColor: "#0066CC", justifyContent: "center", alignItems: "center", overflow: "hidden", borderWidth: 3, borderColor: "rgba(255,255,255,0.22)", marginBottom: 12 },
  heroAvatarImg: { width: 78, height: 78, borderRadius: 39 },
  heroAvatarTxt: { fontSize: 25, fontWeight: "900", color: "#fff" },
  heroName:  { fontSize: 19, fontWeight: "900", color: "#fff", textAlign: "center" },
  heroDeg:   { fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 4, textAlign: "center" },
  heroUni:   { fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2, textAlign: "center" },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 13, paddingVertical: 6, borderRadius: 20, marginTop: 12 },
  statusBadgeTxt: { fontSize: 12, fontWeight: "700" },
  body:      { padding: 18 },
  infoBox:   { borderRadius: 15, padding: 15, marginBottom: 16 },
  infoLabel: { fontSize: 11, fontWeight: "700", opacity: 0.7 },
  infoTitle: { fontSize: 15, fontWeight: "800", marginTop: 3 },
  typePill:  { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginTop: 7 },
  typePillTxt: { fontSize: 11, fontWeight: "700" },
  statsRow:  { flexDirection: "row", backgroundColor: "#F8FAFC", borderRadius: 15, marginBottom: 18, borderWidth: 1, borderColor: "#E2E8F0", overflow: "hidden" },
  statBox:   { flex: 1, padding: 15, alignItems: "center" },
  statBoxBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: "#E2E8F0" },
  statVal:   { fontSize: 17, fontWeight: "900", color: "#0A1628" },
  statKey:   { fontSize: 11, color: "#94A3B8", marginTop: 3, fontWeight: "600" },
  sec:       { marginBottom: 18 },
  secTitle:  { fontSize: 13, fontWeight: "800", color: "#0A1628", marginBottom: 9 },
  bio:       { fontSize: 13, color: "#475569", lineHeight: 20 },
  skillsWrap:{ flexDirection: "row", flexWrap: "wrap", gap: 8 },
  skillChip: { backgroundColor: "#EFF6FF", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: "#BFDBFE" },
  skillChipTxt: { fontSize: 12, fontWeight: "700", color: "#1D4ED8" },
  contactRow:{ flexDirection: "row", alignItems: "center", gap: 9, paddingVertical: 11, borderBottomWidth: 1, borderColor: "#F1F5F9" },
  contactIcon:{ width: 34, height: 34, borderRadius: 10, backgroundColor: "#EFF6FF", justifyContent: "center", alignItems: "center" },
  contactTxt:{ flex: 1, fontSize: 13, color: "#334155", fontWeight: "500" },
  cvBtn:     { borderRadius: 15, overflow: "hidden", marginBottom: 18 },
  cvBtnGrad: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 15, gap: 11 },
  cvBtnTitle:{ fontSize: 14, fontWeight: "800", color: "#fff" },
  cvBtnSub:  { fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 },
  actionRow: { flexDirection: "row", gap: 10, marginBottom: 8 },
  rejectBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 18, paddingVertical: 14, backgroundColor: "#FEE2E2", borderRadius: 13, borderWidth: 1.5, borderColor: "#FECACA" },
  rejectBtnTxt: { fontSize: 13, fontWeight: "700", color: "#DC2626" },
  approveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 14, paddingHorizontal: 16 },
  approveBtnTxt: { fontSize: 13, fontWeight: "700", color: "#fff" },
});