

// import React, { useState } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     ScrollView,
//     Alert,
//     Modal,
//     Linking,
//     Switch,
//     Image,
//     SafeAreaView,
//     StatusBar,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// // ─── Help & FAQ Data ──────────────────────────────────────────────────────────
// const FAQ_DATA = [
//     {
//         q: "What is CollaXion?",
//         a: "CollaXion is an AI-powered platform that connects students with internships, collaborations, and events tailored to their skills and goals.",
//     },
//     {
//         q: "How does AI Matching work?",
//         a: "Our AI analyses your profile, skills, interests, and past activity to recommend the most relevant internships and collaborators for you.",
//     },
//     {
//         q: "How do I apply for an internship?",
//         a: "Browse Internships, tap any listing, and hit 'Apply'. You can track all your applications under Settings → My Applications.",
//     },
//     {
//         q: "Can I save internships for later?",
//         a: "Yes! Tap the bookmark icon on any listing. Access saved internships from Settings → Saved Internships.",
//     },
//     {
//         q: "How do I update my profile?",
//         a: "Go to Settings → Profile Settings to update your name, skills, bio, and profile photo.",
//     },
//     {
//         q: "Is my data secure?",
//         a: "Absolutely. We use industry-standard encryption and never sell your personal data to third parties.",
//     },
//     {
//         q: "How do I delete my account?",
//         a: "Please contact our support team at collaxionsupport@gmail.com and we will process your request within 48 hours.",
//     },
//     {
//         q: "Why am I not getting recommendations?",
//         a: "Make sure your profile is complete and AI Recommendations are enabled in Settings → AI Recommendations.",
//     },
// ];

// // ─── Contact Support Modal ────────────────────────────────────────────────────
// const ContactModal = ({ visible, onClose }) => (
//     <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
//         <View style={modal.overlay}>
//             <View style={modal.card}>
//                 {/* Logo */}
//                 <View style={modal.logoWrap}>
//                     {/* Replace with your actual logo if available */}
//                     <View style={modal.logoPlaceholder}>
//                         <Text style={modal.logoText}>CX</Text>
//                     </View>
//                 </View>

//                 <Text style={modal.title}>Contact Support</Text>
//                 <Text style={modal.subtitle}>
//                     Our team typically responds within 24 hours.
//                 </Text>

//                 <TouchableOpacity
//                     style={modal.emailBtn}
//                     onPress={() => Linking.openURL("mailto:collaxionsupport@gmail.com?subject=Support Request")}
//                     activeOpacity={0.8}
//                 >
//                     <Ionicons name="mail" size={20} color="#fff" />
//                     <Text style={modal.emailText}>collaxionsupport@gmail.com</Text>
//                 </TouchableOpacity>

//                 <View style={modal.divider} />

//                 <Text style={modal.hoursTitle}>Support Hours</Text>
//                 <Text style={modal.hours}>Monday – Friday  •  9am – 6pm PKT</Text>

//                 <TouchableOpacity style={modal.closeBtn} onPress={onClose} activeOpacity={0.8}>
//                     <Text style={modal.closeTxt}>Close</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     </Modal>
// );

// // ─── Help & FAQ Modal ─────────────────────────────────────────────────────────
// const FAQModal = ({ visible, onClose }) => {
//     const [open, setOpen] = useState(null);

//     return (
//         <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
//             <View style={faqStyle.overlay}>
//                 <View style={faqStyle.sheet}>
//                     <View style={faqStyle.handle} />
//                     <Text style={faqStyle.title}>Help & FAQ</Text>

//                     <ScrollView showsVerticalScrollIndicator={false}>
//                         {FAQ_DATA.map((item, i) => (
//                             <TouchableOpacity
//                                 key={i}
//                                 style={faqStyle.item}
//                                 onPress={() => setOpen(open === i ? null : i)}
//                                 activeOpacity={0.85}
//                             >
//                                 <View style={faqStyle.qRow}>
//                                     <Text style={faqStyle.q}>{item.q}</Text>
//                                     <Ionicons
//                                         name={open === i ? "chevron-up" : "chevron-down"}
//                                         size={18}
//                                         color="#5B6FE6"
//                                     />
//                                 </View>
//                                 {open === i && <Text style={faqStyle.a}>{item.a}</Text>}
//                             </TouchableOpacity>
//                         ))}

//                         <TouchableOpacity
//                             style={faqStyle.contactRow}
//                             onPress={() => Linking.openURL("mailto:collaxionsupport@gmail.com?subject=Help Request")}
//                             activeOpacity={0.8}
//                         >
//                             <Ionicons name="mail-outline" size={18} color="#5B6FE6" />
//                             <Text style={faqStyle.contactTxt}>  Still stuck? Email us</Text>
//                         </TouchableOpacity>
//                     </ScrollView>

//                     <TouchableOpacity style={faqStyle.closeBtn} onPress={onClose} activeOpacity={0.8}>
//                         <Text style={faqStyle.closeTxt}>Done</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </Modal>
//     );
// };

// // ─── Logout Confirm Modal ─────────────────────────────────────────────────────
// const LogoutModal = ({ visible, onCancel, onConfirm }) => (
//     <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
//         <View style={modal.overlay}>
//             <View style={[modal.card, { paddingTop: 28 }]}>
//                 <Ionicons name="log-out-outline" size={44} color="#E74C3C" />
//                 <Text style={[modal.title, { marginTop: 12 }]}>Logout</Text>
//                 <Text style={modal.subtitle}>Are you sure you want to log out of CollaXion?</Text>
//                 <View style={logoutStyle.row}>
//                     <TouchableOpacity style={logoutStyle.cancel} onPress={onCancel} activeOpacity={0.8}>
//                         <Text style={logoutStyle.cancelTxt}>Cancel</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={logoutStyle.confirm} onPress={onConfirm} activeOpacity={0.8}>
//                         <Text style={logoutStyle.confirmTxt}>Logout</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </View>
//     </Modal>
// );

// // ─── Main Screen ──────────────────────────────────────────────────────────────
// const SettingsScreen = ({ navigation }) => {
//     const [darkMode, setDarkMode] = useState(false);
//     const [notifications, setNotifications] = useState(true);
//     const [contactVisible, setContactVisible] = useState(false);
//     const [faqVisible, setFaqVisible] = useState(false);
//     const [logoutVisible, setLogoutVisible] = useState(false);

//     const handleLogout = () => {
//         setLogoutVisible(false);
//         // TODO: wire up your actual logout / auth.signOut() here
//         Alert.alert("Logged out", "You have been successfully logged out.");
//     };

//     const Option = ({ icon, title, onPress, isLast = false, iconColor = "#5B6FE6", right }) => (
//         <TouchableOpacity
//             style={[styles.option, isLast && styles.lastOption]}
//             onPress={onPress}
//             activeOpacity={0.7}
//         >
//             <View style={[styles.iconWrap, { backgroundColor: iconColor + "18" }]}>
//                 <Ionicons name={icon} size={20} color={iconColor} />
//             </View>
//             <Text style={styles.optionText}>{title}</Text>
//             {right || <Ionicons name="chevron-forward" size={16} color="#BDC3C7" />}
//         </TouchableOpacity>
//     );

//     return (
//         <SafeAreaView style={styles.safe}>
//             <StatusBar barStyle="dark-content" backgroundColor="#F0F2F8" />

//             {/* Modals */}
//             <ContactModal visible={contactVisible} onClose={() => setContactVisible(false)} />
//             <FAQModal visible={faqVisible} onClose={() => setFaqVisible(false)} />
//             <LogoutModal
//                 visible={logoutVisible}
//                 onCancel={() => setLogoutVisible(false)}
//                 onConfirm={handleLogout}
//             />

//             <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

//                 {/* ── Header ── */}
//                 <View style={styles.header}>
//                     <View style={styles.avatarWrap}>
//                         <View style={styles.avatar}>
//                             <Text style={styles.avatarInitial}>U</Text>
//                         </View>
//                         <View style={styles.onlineDot} />
//                     </View>
//                     <View>
//                         <Text style={styles.headerName}>Your Account</Text>
//                         <Text style={styles.headerSub}>CollaXion Preferences</Text>
//                     </View>
//                 </View>

//                 {/* ── Account ── */}
//                 <SectionLabel label="Account" />
//                 <View style={styles.group}>
//                     <Option
//                         icon="person-circle-outline"
//                         title="Profile Settings"
//                         iconColor="#5B6FE6"
//                         onPress={() => navigation.navigate("Profile Settings")}
//                     />
//                     <Option
//                         icon="key-outline"
//                         title="Update Password"
//                         iconColor="#9B59B6"
//                         onPress={() => navigation.navigate("UpdatePassword")}
//                         isLast
//                     />
//                 </View>

//                 {/* ── AI ── */}
//                 <SectionLabel label="AI & Matching" />
//                 <View style={styles.group}>
//                     <Option
//                         icon="sparkles-outline"
//                         title="AI Recommendations"
//                         iconColor="#F39C12"
//                         onPress={() => navigation.navigate("AI Recommendations")}
//                         isLast
//                     />
//                 </View>

//                 {/* ── Collaboration ── */}
//                 <SectionLabel label="Collaboration" />
//                 <View style={styles.group}>
//                     <Option
//                         icon="send-outline"
//                         title="My Applications"
//                         iconColor="#27AE60"
//                         onPress={() => navigation.navigate("My Applications")}
//                     />
//                     <Option
//                         icon="bookmark-outline"
//                         title="Saved Internships"
//                         iconColor="#E67E22"
//                         onPress={() => navigation.navigate("Internships")}
//                         isLast
//                     />
//                 </View>

//                 {/* ── Events ── */}
//                 <SectionLabel label="Events" />
//                 <View style={styles.group}>
//                     <Option
//                         icon="calendar-outline"
//                         title="Events"
//                         iconColor="#E74C3C"
//                         onPress={() => navigation.navigate("Events")}
//                         isLast
//                     />
//                 </View>

//                 {/* ── General ── */}
//                 <SectionLabel label="General" />
//                 <View style={styles.group}>
//                     <Option
//                         icon="notifications-outline"
//                         title="Push Notifications"
//                         iconColor="#5B6FE6"
//                         onPress={() => {}}
//                         right={
//                             <Switch
//                                 value={notifications}
//                                 onValueChange={setNotifications}
//                                 trackColor={{ false: "#DDD", true: "#5B6FE6" }}
//                                 thumbColor="#fff"
//                             />
//                         }
//                     />
//                     <Option
//                         icon="moon-outline"
//                         title="Dark Mode"
//                         iconColor="#2C3E50"
//                         onPress={() => {}}
//                         isLast
//                         right={
//                             <Switch
//                                 value={darkMode}
//                                 onValueChange={setDarkMode}
//                                 trackColor={{ false: "#DDD", true: "#5B6FE6" }}
//                                 thumbColor="#fff"
//                             />
//                         }
//                     />
//                 </View>

//                 {/* ── Support ── */}
//                 <SectionLabel label="Support" />
//                 <View style={styles.group}>
//                     <Option
//                         icon="help-circle-outline"
//                         title="Help & FAQ"
//                         iconColor="#16A085"
//                         onPress={() => setFaqVisible(true)}
//                     />
//                     <Option
//                         icon="mail-outline"
//                         title="Contact Support"
//                         iconColor="#2980B9"
//                         onPress={() => setContactVisible(true)}
//                     />
//                     <Option
//                         icon="star-outline"
//                         title="Rate CollaXion"
//                         iconColor="#F1C40F"
//                         onPress={() => Linking.openURL("https://play.google.com")}
//                     />
//                     <Option
//                         icon="shield-checkmark-outline"
//                         title="Privacy Policy"
//                         iconColor="#7F8C8D"
//                         onPress={() => Linking.openURL("https://collaxion.com/privacy")}
//                     />
//                     <Option
//                         icon="document-text-outline"
//                         title="Terms of Service"
//                         iconColor="#7F8C8D"
//                         onPress={() => Linking.openURL("https://collaxion.com/terms")}
//                         isLast
//                     />
//                 </View>

//                 {/* ── Logout ── */}
//                 <TouchableOpacity
//                     style={styles.logoutBtn}
//                     onPress={() => setLogoutVisible(true)}
//                     activeOpacity={0.85}
//                 >
//                     <Ionicons name="log-out-outline" size={20} color="#E74C3C" />
//                     <Text style={styles.logoutText}>Logout</Text>
//                 </TouchableOpacity>

//                 {/* ── Footer ── */}
//                 <View style={styles.footer}>
//                     <View style={styles.footerLogo}>
//                         <Text style={styles.footerLogoText}>CX</Text>
//                     </View>
//                     <Text style={styles.footerVersion}>CollaXion v1.0.0</Text>
//                     <Text style={styles.footerEmail}>collaxionsupport@gmail.com</Text>
//                 </View>

//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// const SectionLabel = ({ label }) => (
//     <Text style={styles.sectionLabel}>{label.toUpperCase()}</Text>
// );

// export default SettingsScreen;

// // ─── Styles ───────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//     safe: { flex: 1, backgroundColor: "#F0F2F8" },
//     scroll: { flex: 1 },

//     header: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#fff",
//         paddingHorizontal: 20,
//         paddingVertical: 22,
//         borderBottomLeftRadius: 24,
//         borderBottomRightRadius: 24,
//         marginBottom: 8,
//         elevation: 3,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.08,
//         shadowRadius: 8,
//         gap: 14,
//     },
//     avatarWrap: { position: "relative" },
//     avatar: {
//         width: 52,
//         height: 52,
//         borderRadius: 26,
//         backgroundColor: "#5B6FE6",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     avatarInitial: { color: "#fff", fontSize: 22, fontWeight: "bold" },
//     onlineDot: {
//         position: "absolute",
//         bottom: 2,
//         right: 2,
//         width: 12,
//         height: 12,
//         borderRadius: 6,
//         backgroundColor: "#27AE60",
//         borderWidth: 2,
//         borderColor: "#fff",
//     },
//     headerName: { fontSize: 18, fontWeight: "700", color: "#2C3E50" },
//     headerSub: { fontSize: 12, color: "#95A5A6", marginTop: 2 },

//     sectionLabel: {
//         fontSize: 11,
//         fontWeight: "700",
//         color: "#95A5A6",
//         letterSpacing: 1.2,
//         marginHorizontal: 20,
//         marginTop: 20,
//         marginBottom: 6,
//     },

//     group: {
//         backgroundColor: "#fff",
//         marginHorizontal: 14,
//         borderRadius: 16,
//         paddingVertical: 4,
//         elevation: 2,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.06,
//         shadowRadius: 6,
//     },

//     option: {
//         flexDirection: "row",
//         alignItems: "center",
//         paddingVertical: 14,
//         paddingHorizontal: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: "#F4F6F8",
//         gap: 12,
//     },
//     lastOption: { borderBottomWidth: 0 },

//     iconWrap: {
//         width: 36,
//         height: 36,
//         borderRadius: 10,
//         justifyContent: "center",
//         alignItems: "center",
//     },

//     optionText: { flex: 1, fontSize: 15, color: "#2C3E50", fontWeight: "500" },

//     logoutBtn: {
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "center",
//         gap: 8,
//         margin: 14,
//         marginTop: 22,
//         padding: 15,
//         borderRadius: 16,
//         backgroundColor: "#fff",
//         borderWidth: 1.5,
//         borderColor: "#FADBD8",
//         elevation: 1,
//     },
//     logoutText: { fontSize: 15, fontWeight: "700", color: "#E74C3C" },

//     footer: {
//         alignItems: "center",
//         paddingVertical: 28,
//         gap: 4,
//     },
//     footerLogo: {
//         width: 40,
//         height: 40,
//         borderRadius: 12,
//         backgroundColor: "#5B6FE6",
//         justifyContent: "center",
//         alignItems: "center",
//         marginBottom: 8,
//     },
//     footerLogoText: { color: "#fff", fontWeight: "900", fontSize: 16 },
//     footerVersion: { fontSize: 12, color: "#BDC3C7" },
//     footerEmail: { fontSize: 12, color: "#95A5A6" },
// });

// // ─── Modal Styles ─────────────────────────────────────────────────────────────
// const modal = StyleSheet.create({
//     overlay: {
//         flex: 1,
//         backgroundColor: "rgba(0,0,0,0.45)",
//         justifyContent: "center",
//         alignItems: "center",
//         padding: 24,
//     },
//     card: {
//         backgroundColor: "#fff",
//         borderRadius: 24,
//         padding: 28,
//         width: "100%",
//         alignItems: "center",
//         elevation: 10,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 8 },
//         shadowOpacity: 0.15,
//         shadowRadius: 20,
//     },
//     logoWrap: { marginBottom: 16 },
//     logoPlaceholder: {
//         width: 72,
//         height: 72,
//         borderRadius: 20,
//         backgroundColor: "#5B6FE6",
//         justifyContent: "center",
//         alignItems: "center",
//         elevation: 4,
//     },
//     logoText: { color: "#fff", fontSize: 28, fontWeight: "900" },
//     title: { fontSize: 20, fontWeight: "800", color: "#2C3E50", textAlign: "center" },
//     subtitle: {
//         fontSize: 13,
//         color: "#7F8C8D",
//         textAlign: "center",
//         marginTop: 6,
//         marginBottom: 20,
//         lineHeight: 20,
//     },
//     emailBtn: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#5B6FE6",
//         paddingVertical: 13,
//         paddingHorizontal: 22,
//         borderRadius: 12,
//         gap: 8,
//         elevation: 2,
//     },
//     emailText: { color: "#fff", fontSize: 14, fontWeight: "600" },
//     divider: { width: "100%", height: 1, backgroundColor: "#F0F2F8", marginVertical: 18 },
//     hoursTitle: { fontSize: 12, fontWeight: "700", color: "#95A5A6", marginBottom: 4 },
//     hours: { fontSize: 13, color: "#7F8C8D" },
//     closeBtn: {
//         marginTop: 22,
//         paddingVertical: 12,
//         paddingHorizontal: 40,
//         borderRadius: 12,
//         backgroundColor: "#F0F2F8",
//     },
//     closeTxt: { fontSize: 14, fontWeight: "700", color: "#5B6FE6" },
// });

// // ─── FAQ Styles ───────────────────────────────────────────────────────────────
// const faqStyle = StyleSheet.create({
//     overlay: {
//         flex: 1,
//         backgroundColor: "rgba(0,0,0,0.4)",
//         justifyContent: "flex-end",
//     },
//     sheet: {
//         backgroundColor: "#fff",
//         borderTopLeftRadius: 28,
//         borderTopRightRadius: 28,
//         padding: 22,
//         maxHeight: "85%",
//         paddingBottom: 36,
//     },
//     handle: {
//         width: 40,
//         height: 4,
//         borderRadius: 2,
//         backgroundColor: "#DDD",
//         alignSelf: "center",
//         marginBottom: 18,
//     },
//     title: {
//         fontSize: 20,
//         fontWeight: "800",
//         color: "#2C3E50",
//         marginBottom: 16,
//         textAlign: "center",
//     },
//     item: {
//         borderBottomWidth: 1,
//         borderBottomColor: "#F4F6F8",
//         paddingVertical: 14,
//     },
//     qRow: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//     },
//     q: { flex: 1, fontSize: 14, fontWeight: "600", color: "#2C3E50", paddingRight: 8 },
//     a: { fontSize: 13, color: "#7F8C8D", marginTop: 8, lineHeight: 20 },
//     contactRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "center",
//         marginTop: 18,
//         marginBottom: 8,
//     },
//     contactTxt: { fontSize: 13, color: "#5B6FE6", fontWeight: "600" },
//     closeBtn: {
//         marginTop: 16,
//         backgroundColor: "#5B6FE6",
//         borderRadius: 14,
//         paddingVertical: 14,
//         alignItems: "center",
//     },
//     closeTxt: { color: "#fff", fontWeight: "700", fontSize: 15 },
// });

// // ─── Logout Styles ────────────────────────────────────────────────────────────
// const logoutStyle = StyleSheet.create({
//     row: { flexDirection: "row", gap: 12, marginTop: 22, width: "100%" },
//     cancel: {
//         flex: 1,
//         paddingVertical: 13,
//         borderRadius: 12,
//         backgroundColor: "#F0F2F8",
//         alignItems: "center",
//     },
//     cancelTxt: { fontSize: 14, fontWeight: "700", color: "#7F8C8D" },
//     confirm: {
//         flex: 1,
//         paddingVertical: 13,
//         borderRadius: 12,
//         backgroundColor: "#E74C3C",
//         alignItems: "center",
//     },
//     confirmTxt: { fontSize: 14, fontWeight: "700", color: "#fff" },
// });























// import React, { useState } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     ScrollView,
//     Alert,
//     Modal,
//     Linking,
//     Switch,
//     Image,
//     SafeAreaView,
//     StatusBar,
//     TextInput,
//     ActivityIndicator,
// } from "react-native";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// // ─── Theme ────────────────────────────────────────────────────────────────────
// const C = {
//     navy:    "#193648",
//     navyD:   "#111D26",
//     navyL:   "#1E4A63",
//     accent:  "#2E86AB",
//     gold:    "#F4A261",
//     white:   "#FFFFFF",
//     offWhite:"#F0F4F7",
//     card:    "#FFFFFF",
//     text:    "#1A2E3B",
//     sub:     "#6B8A9A",
//     border:  "#E2ECF1",
//     red:     "#E74C3C",
//     green:   "#27AE60",
// };

// // ─── FAQ Data ─────────────────────────────────────────────────────────────────
// const FAQ_DATA = [
//     { q: "What is CollaXion?", a: "CollaXion is an AI-powered platform that connects Riphah students with internships, collaborations, and events tailored to their skills and academic goals." },
//     { q: "How does AI Matching work?", a: "Our AI analyses your CV, extracted skills, and past activity to recommend the most relevant internships and collaborators for you." },
//     { q: "How do I apply for an internship?", a: "Browse Internships from the drawer, tap any listing, and hit Apply. Track all applications under My Applications." },
//     { q: "Can I save internships for later?", a: "Yes! Bookmark any listing. Access saved internships from the Saved Internships section in Settings." },
//     { q: "How do I update my profile?", a: "Go to Settings → Profile Settings to update your name, skills, bio, and profile photo." },
//     { q: "Is my data secure?", a: "Absolutely. CollaXion uses secure MongoDB Atlas storage and never shares your personal data with third parties." },
//     { q: "How do I delete my account?", a: "Contact our support team at collaxionsupport@gmail.com and we will process your request within 48 hours." },
//     { q: "Why am I not getting AI recommendations?", a: "Make sure you have uploaded your CV. Our AI extracts your skills from your CV to generate recommendations." },
// ];

// // ─── Privacy Policy Content ───────────────────────────────────────────────────
// const PRIVACY_SECTIONS = [
//     { title: "Information We Collect", body: "CollaXion collects your name, university email, department, semester, city, CV data, and profile photo solely to provide internship matching and collaboration services." },
//     { title: "How We Use Your Data", body: "Your data is used to power AI-based internship recommendations, match you with industry partners, and personalise your CollaXion experience." },
//     { title: "Data Storage", body: "All data is securely stored on MongoDB Atlas with encrypted connections. We never store plain credit card or payment information." },
//     { title: "Third-Party Sharing", body: "We do not sell, rent, or share your personal information with advertisers or unrelated third parties." },
//     { title: "Your Rights", body: "You may request deletion of your account and all associated data at any time by contacting collaxionsupport@gmail.com." },
//     { title: "Contact", body: "For privacy concerns, reach us at collaxionsupport@gmail.com. We respond within 48 hours on business days." },
// ];

// const TERMS_SECTIONS = [
//     { title: "Eligibility", body: "CollaXion is exclusively available to currently enrolled students of Riphah International University with a valid @students.riphah.edu.pk email." },
//     { title: "Account Responsibility", body: "You are responsible for maintaining the confidentiality of your account credentials. Do not share your password with anyone." },
//     { title: "Acceptable Use", body: "You agree not to misuse the platform, submit false information, or harass other users or industry partners." },
//     { title: "AI Recommendations", body: "AI-generated recommendations are based on your profile data. CollaXion does not guarantee job placement or internship selection." },
//     { title: "Intellectual Property", body: "All CollaXion branding, UI, and proprietary AI models are the intellectual property of the CollaXion team." },
//     { title: "Termination", body: "CollaXion reserves the right to suspend accounts that violate these terms without prior notice." },
// ];

// // ─── Rating Modal ─────────────────────────────────────────────────────────────
// const RatingModal = ({ visible, onClose }: any) => {
//     const [stars, setStars] = useState(0);
//     const [feedback, setFeedback] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [done, setDone] = useState(false);





//     const submit = async () => {
//     if (stars === 0) {
//         Alert.alert("Rating chahiye", "Please pehle stars select karo.");
//         return;
//     }
//     setLoading(true);
//     try {
//         const studentEmail =
//             (await AsyncStorage.getItem("studentEmail")) || "unknown@collaxion.app";

//         const response = await fetch("http://192.168.0.245:5000/api/student/send-rating", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ stars, feedback: feedback.trim(), studentEmail }),
//         });

//         const data = await response.json();

//         if (!response.ok || !data.success) {
//             throw new Error(data.message || "Server error");
//         }

//         setDone(true);
//     } catch (err: any) {
//         Alert.alert(
//             "Error",
//             err.message === "Network request failed"
//                 ? "Internet connection check karo."
//                 : "Rating submit nahi ho saki. Dobara try karo."
//         );
//     } finally {
//         setLoading(false);
//     }
// };
//     const close = () => { setStars(0); setFeedback(""); setDone(false); onClose(); };

//     return (
//         <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
//             <View style={m.overlay}>
//                 <View style={m.card}>
//                     {done ? (
//                         <>
//                             <Text style={{ fontSize: 48 }}>🎉</Text>
//                             <Text style={m.title}>Thank You!</Text>
//                             <Text style={m.sub}>Your feedback has been sent to CollaXion.</Text>
//                             <TouchableOpacity style={m.primaryBtn} onPress={close}>
//                                 <Text style={m.primaryBtnTxt}>Done</Text>
//                             </TouchableOpacity>
//                         </>
//                     ) : (
//                         <>
//                             <View style={m.ratingHeader}>
//                                 <Image source={require("../../assets/images/logo.png")} style={m.logo} resizeMode="contain" />
//                                 <Text style={m.title}>Rate CollaXion</Text>
//                                 <Text style={m.sub}>Your feedback helps us improve!</Text>
//                             </View>
//                             <View style={m.stars}>
//                                 {[1,2,3,4,5].map(i => (
//                                     <TouchableOpacity key={i} onPress={() => setStars(i)} activeOpacity={0.7}>
//                                         <Ionicons name={i <= stars ? "star" : "star-outline"} size={36} color={i <= stars ? C.gold : "#DDD"} />
//                                     </TouchableOpacity>
//                                 ))}
//                             </View>
//                             {stars > 0 && (
//                                 <Text style={m.starLabel}>
//                                     {["","Poor","Fair","Good","Great","Excellent!"][stars]}
//                                 </Text>
//                             )}
//                             <TextInput
//                                 style={m.input}
//                                 placeholder="Share your thoughts (optional)..."
//                                 placeholderTextColor={C.sub}
//                                 value={feedback}
//                                 onChangeText={setFeedback}
//                                 multiline
//                                 numberOfLines={3}
//                             />
//                             <View style={m.row}>
//                                 <TouchableOpacity style={m.cancelBtn} onPress={close} activeOpacity={0.8}>
//                                     <Text style={m.cancelTxt}>Cancel</Text>
//                                 </TouchableOpacity>
//                                 <TouchableOpacity style={m.primaryBtn} onPress={submit} activeOpacity={0.8} disabled={loading}>
//                                     {loading ? <ActivityIndicator color="#fff" /> : <Text style={m.primaryBtnTxt}>Submit</Text>}
//                                 </TouchableOpacity>
//                             </View>
//                         </>
//                     )}
//                 </View>
//             </View>
//         </Modal>
//     );
// };

// // ─── Policy Modal ─────────────────────────────────────────────────────────────
// const PolicyModal = ({ visible, onClose, title, sections }: any) => (
//     <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
//         <View style={sheet.overlay}>
//             <View style={sheet.container}>
//                 <View style={sheet.handle} />
//                 <View style={sheet.policyHeader}>
//                     <Image source={require("../../assets/images/logo.png")} style={sheet.logo} resizeMode="contain" />
//                     <Text style={sheet.policyTitle}>{title}</Text>
//                     <Text style={sheet.policyDate}>Effective: January 2025 • CollaXion</Text>
//                 </View>
//                 <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
//                     {sections.map((s: any, i: number) => (
//                         <View key={i} style={sheet.section}>
//                             <View style={sheet.sectionNum}>
//                                 <Text style={sheet.sectionNumTxt}>{i + 1}</Text>
//                             </View>
//                             <View style={{ flex: 1 }}>
//                                 <Text style={sheet.sectionTitle}>{s.title}</Text>
//                                 <Text style={sheet.sectionBody}>{s.body}</Text>
//                             </View>
//                         </View>
//                     ))}
//                     <View style={{ height: 20 }} />
//                 </ScrollView>
//                 <TouchableOpacity style={sheet.closeBtn} onPress={onClose} activeOpacity={0.85}>
//                     <Text style={sheet.closeTxt}>Close</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     </Modal>
// );

// // ─── Contact Modal ────────────────────────────────────────────────────────────
// const ContactModal = ({ visible, onClose }: any) => (
//     <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
//         <View style={m.overlay}>
//             <View style={m.card}>
//                 <Image source={require("../../assets/images/logo.png")} style={m.bigLogo} resizeMode="contain" />
//                 <Text style={m.title}>Contact Support</Text>
//                 <Text style={m.sub}>Our team typically responds within 24 hours.</Text>
//                 <TouchableOpacity style={m.primaryBtn} onPress={() => Linking.openURL("mailto:collaxionsupport@gmail.com?subject=Support Request")} activeOpacity={0.8}>
//                     <Ionicons name="mail" size={18} color="#fff" />
//                     <Text style={m.primaryBtnTxt}>  collaxionsupport@gmail.com</Text>
//                 </TouchableOpacity>
//                 <View style={m.divider} />
//                 <Text style={m.hoursLabel}>Support Hours</Text>
//                 <Text style={m.hours}>Monday – Friday  •  9am – 6pm PKT</Text>
//                 <TouchableOpacity style={m.cancelBtn} onPress={onClose} activeOpacity={0.8}>
//                     <Text style={m.cancelTxt}>Close</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     </Modal>
// );

// // ─── FAQ Modal ────────────────────────────────────────────────────────────────
// const FAQModal = ({ visible, onClose }: any) => {
//     const [open, setOpen] = useState<number | null>(null);
//     return (
//         <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
//             <View style={sheet.overlay}>
//                 <View style={sheet.container}>
//                     <View style={sheet.handle} />
//                     <Text style={sheet.policyTitle}>Help & FAQ</Text>
//                     <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
//                         {FAQ_DATA.map((item, i) => (
//                             <TouchableOpacity key={i} style={faq.item} onPress={() => setOpen(open === i ? null : i)} activeOpacity={0.85}>
//                                 <View style={faq.qRow}>
//                                     <Text style={faq.q}>{item.q}</Text>
//                                     <Ionicons name={open === i ? "chevron-up" : "chevron-down"} size={16} color={C.accent} />
//                                 </View>
//                                 {open === i && <Text style={faq.a}>{item.a}</Text>}
//                             </TouchableOpacity>
//                         ))}
//                         <TouchableOpacity style={faq.emailRow} onPress={() => Linking.openURL("mailto:collaxionsupport@gmail.com?subject=Help Request")} activeOpacity={0.8}>
//                             <Ionicons name="mail-outline" size={16} color={C.accent} />
//                             <Text style={faq.emailTxt}> Still stuck? Email us</Text>
//                         </TouchableOpacity>
//                         <View style={{ height: 20 }} />
//                     </ScrollView>
//                     <TouchableOpacity style={sheet.closeBtn} onPress={onClose} activeOpacity={0.85}>
//                         <Text style={sheet.closeTxt}>Done</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </Modal>
//     );
// };

// // ─── Logout Modal ─────────────────────────────────────────────────────────────
// const LogoutModal = ({ visible, onCancel, onConfirm }: any) => (
//     <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
//         <View style={m.overlay}>
//             <View style={m.card}>
//                 <View style={m.logoutIcon}>
//                     <Ionicons name="log-out-outline" size={32} color={C.red} />
//                 </View>
//                 <Text style={m.title}>Sign Out</Text>
//                 <Text style={m.sub}>Are you sure you want to sign out of CollaXion?</Text>
//                 <View style={m.row}>
//                     <TouchableOpacity style={m.cancelBtn} onPress={onCancel} activeOpacity={0.8}>
//                         <Text style={m.cancelTxt}>Cancel</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={[m.primaryBtn, { backgroundColor: C.red }]} onPress={onConfirm} activeOpacity={0.8}>
//                         <Text style={m.primaryBtnTxt}>Sign Out</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </View>
//     </Modal>
// );

// // ─── Main Screen ──────────────────────────────────────────────────────────────
// const SettingsScreen = ({ navigation }: any) => {
//     const [darkMode, setDarkMode] = useState(false);
//     const [notifs, setNotifs] = useState(true);
//     const [contactVisible, setContactVisible] = useState(false);
//     const [faqVisible, setFaqVisible] = useState(false);
//     const [logoutVisible, setLogoutVisible] = useState(false);
//     const [ratingVisible, setRatingVisible] = useState(false);
//     const [privacyVisible, setPrivacyVisible] = useState(false);
//     const [termsVisible, setTermsVisible] = useState(false);

//     const handleLogout = async () => {
//         setLogoutVisible(false);
//         await AsyncStorage.multiRemove(["studentEmail", "studentToken", "studentProfileImage"]);
//         navigation.replace("StudentLogin");
//     };

//     const Opt = ({ icon, title, onPress, isLast = false, color = C.accent, right }: any) => (
//         <TouchableOpacity style={[s.option, isLast && s.lastOption]} onPress={onPress} activeOpacity={0.7}>
//             <View style={[s.iconBox, { backgroundColor: color + "15" }]}>
//                 <Ionicons name={icon} size={19} color={color} />
//             </View>
//             <Text style={s.optTxt}>{title}</Text>
//             {right !== undefined ? right : <Ionicons name="chevron-forward" size={15} color="#C5D5DC" />}
//         </TouchableOpacity>
//     );

//     return (
//         <SafeAreaView style={s.safe}>
//             <StatusBar barStyle="light-content" backgroundColor={C.navy} />

//             <ContactModal visible={contactVisible} onClose={() => setContactVisible(false)} />
//             <FAQModal visible={faqVisible} onClose={() => setFaqVisible(false)} />
//             <LogoutModal visible={logoutVisible} onCancel={() => setLogoutVisible(false)} onConfirm={handleLogout} />
//             <RatingModal visible={ratingVisible} onClose={() => setRatingVisible(false)} />
//             <PolicyModal visible={privacyVisible} onClose={() => setPrivacyVisible(false)} title="Privacy Policy" sections={PRIVACY_SECTIONS} />
//             <PolicyModal visible={termsVisible} onClose={() => setTermsVisible(false)} title="Terms of Service" sections={TERMS_SECTIONS} />

//             <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

//                 {/* ── Hero Header ── */}
//                 <View style={s.hero}>
//                     <View style={s.heroTop}>
//                         <Image source={require("../../assets/images/logo.png")} style={s.heroLogo} resizeMode="contain" />
//                         <View style={s.heroBadge}>
//                             <View style={s.heroDot} />
//                             <Text style={s.heroBadgeTxt}>Active</Text>
//                         </View>
//                     </View>
//                     <Text style={s.heroTitle}>Settings</Text>
//                     <Text style={s.heroSub}>Manage your CollaXion preferences</Text>
//                 </View>

//                 {/* ── Account ── */}
//                 <Label text="ACCOUNT" />
//                 <View style={s.card}>
//                     <Opt icon="person-circle-outline" title="Profile Settings" color="#4A90D9" onPress={() => navigation.navigate("Profile Settings")} />
//                     <Opt icon="key-outline" title="Update Password" color="#8E44AD" onPress={() => navigation.navigate("UpdatePassword")} isLast />
//                 </View>

//                 {/* ── AI ── */}
//                 <Label text="AI & MATCHING" />
//                 <View style={s.card}>
//                     <Opt icon="sparkles-outline" title="AI Recommendations" color={C.gold} onPress={() => navigation.navigate("AI Recommendations")} isLast />
//                 </View>

//                 {/* ── Collaboration ── */}
//                 <Label text="COLLABORATION" />
//                 <View style={s.card}>
//                     <Opt icon="send-outline" title="My Applications" color={C.green} onPress={() => navigation.navigate("My Applications")} />
//                     <Opt icon="bookmark-outline" title="Saved Internships" color="#E67E22" onPress={() => navigation.navigate("Internships")} isLast />
//                 </View>

//                 {/* ── Events ── */}
//                 <Label text="EVENTS" />
//                 <View style={s.card}>
//                     <Opt icon="calendar-outline" title="Events" color={C.red} onPress={() => navigation.navigate("Events")} isLast />
//                 </View>

//                 {/* ── Preferences ── */}
//                 <Label text="PREFERENCES" />
//                 <View style={s.card}>
//                     <Opt icon="notifications-outline" title="Push Notifications" color={C.accent} onPress={() => {}}
//                         right={<Switch value={notifs} onValueChange={setNotifs} trackColor={{ false: "#DDD", true: C.navy }} thumbColor="#fff" />} />
//                     <Opt icon="moon-outline" title="Dark Mode" color={C.navyD} onPress={() => {}} isLast
//                         right={<Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ false: "#DDD", true: C.navy }} thumbColor="#fff" />} />
//                 </View>

//                 {/* ── Support ── */}
//                 <Label text="SUPPORT" />
//                 <View style={s.card}>
//                     <Opt icon="help-circle-outline" title="Help & FAQ" color="#16A085" onPress={() => setFaqVisible(true)} />
//                     <Opt icon="mail-outline" title="Contact Support" color={C.accent} onPress={() => setContactVisible(true)} />
//                     <Opt icon="star-outline" title="Rate CollaXion" color={C.gold} onPress={() => setRatingVisible(true)} />
//                     <Opt icon="shield-checkmark-outline" title="Privacy Policy" color="#7F8C8D" onPress={() => setPrivacyVisible(true)} />
//                     <Opt icon="document-text-outline" title="Terms of Service" color="#7F8C8D" onPress={() => setTermsVisible(true)} isLast />
//                 </View>

//                 {/* ── Logout ── */}
//                 <TouchableOpacity style={s.logoutBtn} onPress={() => setLogoutVisible(true)} activeOpacity={0.85}>
//                     <Ionicons name="log-out-outline" size={18} color={C.red} />
//                     <Text style={s.logoutTxt}>Sign Out</Text>
//                 </TouchableOpacity>

//                 {/* ── Footer ── */}
//                 <View style={s.footer}>
//                     <Image source={require("../../assets/images/logo.png")} style={s.footerLogo} resizeMode="contain" />
//                     <Text style={s.footerApp}>CollaXion v1.0.0</Text>
//                     <Text style={s.footerTag}>Where Collaboration Meets Innovation</Text>
//                 </View>

//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// const Label = ({ text }: { text: string }) => (
//     <Text style={s.label}>{text}</Text>
// );

// export default SettingsScreen;

// // ─── Styles ───────────────────────────────────────────────────────────────────
// const s = StyleSheet.create({
//     safe: { flex: 1, backgroundColor: "#EBF1F5" },
//     scroll: { flex: 1 },

//     hero: {
//         backgroundColor: C.navy,
//         paddingHorizontal: 22,
//         paddingTop: 24,
//         paddingBottom: 28,
//         borderBottomLeftRadius: 28,
//         borderBottomRightRadius: 28,
//         marginBottom: 6,
//         elevation: 6,
//         shadowColor: C.navyD,
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.25,
//         shadowRadius: 12,
//     },
//     heroTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
//     heroLogo: { width: 38, height: 38, borderRadius: 10, backgroundColor: "#fff" },
//     heroBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(39,174,96,0.15)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
//     heroDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.green, marginRight: 5 },
//     heroBadgeTxt: { color: "#A8E6CF", fontSize: 11, fontWeight: "700" },
//     heroTitle: { color: C.white, fontSize: 26, fontWeight: "800", letterSpacing: 0.3 },
//     heroSub: { color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 4 },

//     label: {
//         fontSize: 10,
//         fontWeight: "800",
//         color: C.sub,
//         letterSpacing: 1.5,
//         marginHorizontal: 20,
//         marginTop: 22,
//         marginBottom: 7,
//     },

//     card: {
//         backgroundColor: C.card,
//         marginHorizontal: 14,
//         borderRadius: 18,
//         paddingVertical: 4,
//         elevation: 2,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.05,
//         shadowRadius: 8,
//     },

//     option: {
//         flexDirection: "row",
//         alignItems: "center",
//         paddingVertical: 13,
//         paddingHorizontal: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: "#F0F5F8",
//         gap: 13,
//     },
//     lastOption: { borderBottomWidth: 0 },
//     iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center" },
//     optTxt: { flex: 1, fontSize: 14.5, color: C.text, fontWeight: "500" },

//     logoutBtn: {
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "center",
//         gap: 8,
//         margin: 14,
//         marginTop: 22,
//         padding: 15,
//         borderRadius: 16,
//         backgroundColor: C.white,
//         borderWidth: 1.5,
//         borderColor: "#FADBD8",
//         elevation: 1,
//     },
//     logoutTxt: { fontSize: 15, fontWeight: "700", color: C.red },

//     footer: { alignItems: "center", paddingVertical: 30, gap: 5 },
//     footerLogo: { width: 36, height: 36, borderRadius: 10, marginBottom: 6 },
//     footerApp: { fontSize: 12, color: "#9AADB8", fontWeight: "600" },
//     footerTag: { fontSize: 11, color: "#B8CAD3" },
// });

// // ─── Modal Styles ─────────────────────────────────────────────────────────────
// const m = StyleSheet.create({
//     overlay: { flex: 1, backgroundColor: "rgba(10,25,35,0.55)", justifyContent: "center", alignItems: "center", padding: 20 },
//     card: { backgroundColor: C.white, borderRadius: 24, padding: 26, width: "100%", alignItems: "center", elevation: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20 },
//     bigLogo: { width: 70, height: 70, borderRadius: 18, marginBottom: 14 },
//     logo: { width: 48, height: 48, borderRadius: 12, marginBottom: 10 },
//     ratingHeader: { alignItems: "center", marginBottom: 4 },
//     title: { fontSize: 20, fontWeight: "800", color: C.text, textAlign: "center", marginBottom: 6 },
//     sub: { fontSize: 13, color: C.sub, textAlign: "center", lineHeight: 20, marginBottom: 18 },
//     stars: { flexDirection: "row", gap: 8, marginBottom: 8 },
//     starLabel: { fontSize: 14, fontWeight: "700", color: C.gold, marginBottom: 14 },
//     input: { width: "100%", backgroundColor: "#F0F5F8", borderRadius: 12, padding: 14, fontSize: 13, color: C.text, textAlignVertical: "top", marginBottom: 18, minHeight: 80 },
//     row: { flexDirection: "row", gap: 10, width: "100%" },
//     primaryBtn: { flex: 1, flexDirection: "row", backgroundColor: C.navy, paddingVertical: 13, borderRadius: 13, alignItems: "center", justifyContent: "center" },
//     primaryBtnTxt: { color: "#fff", fontWeight: "800", fontSize: 14 },
//     cancelBtn: { flex: 1, backgroundColor: "#EBF1F5", paddingVertical: 13, borderRadius: 13, alignItems: "center", justifyContent: "center" },
//     cancelTxt: { color: C.sub, fontWeight: "700", fontSize: 14 },
//     divider: { width: "100%", height: 1, backgroundColor: "#EBF1F5", marginVertical: 16 },
//     hoursLabel: { fontSize: 11, fontWeight: "700", color: C.sub, marginBottom: 4 },
//     hours: { fontSize: 13, color: C.text, marginBottom: 18 },
//     logoutIcon: { width: 64, height: 64, borderRadius: 20, backgroundColor: "#FDEDEC", justifyContent: "center", alignItems: "center", marginBottom: 14 },
// });

// // ─── Sheet Styles ─────────────────────────────────────────────────────────────
// const sheet = StyleSheet.create({
//     overlay: { flex: 1, backgroundColor: "rgba(10,25,35,0.5)", justifyContent: "flex-end" },
//     container: { backgroundColor: C.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, maxHeight: "88%", paddingBottom: 30 },
//     handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#DDD", alignSelf: "center", marginBottom: 18 },
//     logo: { width: 44, height: 44, borderRadius: 12, marginBottom: 8 },
//     policyHeader: { alignItems: "center", marginBottom: 18 },
//     policyTitle: { fontSize: 20, fontWeight: "800", color: C.text, textAlign: "center", marginBottom: 4 },
//     policyDate: { fontSize: 11, color: C.sub },
//     section: { flexDirection: "row", gap: 14, marginBottom: 18 },
//     sectionNum: { width: 26, height: 26, borderRadius: 8, backgroundColor: C.navy, justifyContent: "center", alignItems: "center", marginTop: 2 },
//     sectionNumTxt: { color: "#fff", fontSize: 11, fontWeight: "800" },
//     sectionTitle: { fontSize: 14, fontWeight: "700", color: C.text, marginBottom: 4 },
//     sectionBody: { fontSize: 13, color: C.sub, lineHeight: 20 },
//     closeBtn: { backgroundColor: C.navy, borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 12 },
//     closeTxt: { color: "#fff", fontWeight: "800", fontSize: 15 },
// });

// // ─── FAQ Styles ───────────────────────────────────────────────────────────────
// const faq = StyleSheet.create({
//     item: { borderBottomWidth: 1, borderBottomColor: "#F0F5F8", paddingVertical: 14 },
//     qRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//     q: { flex: 1, fontSize: 14, fontWeight: "600", color: C.text, paddingRight: 8 },
//     a: { fontSize: 13, color: C.sub, marginTop: 8, lineHeight: 20 },
//     emailRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20 },
//     emailTxt: { fontSize: 13, color: C.accent, fontWeight: "600" },
// });







import { CONSTANT } from "@/constants/constant";

import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Modal,
    Linking,
    Switch,
    Image,
    SafeAreaView,
    StatusBar,
    TextInput,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const C = {
    navy:    "#193648",
    navyD:   "#111D26",
    navyL:   "#1E4A63",
    accent:  "#2E86AB",
    gold:    "#F4A261",
    white:   "#FFFFFF",
    offWhite:"#F0F4F7",
    card:    "#FFFFFF",
    text:    "#1A2E3B",
    sub:     "#6B8A9A",
    border:  "#E2ECF1",
    red:     "#E74C3C",
    green:   "#27AE60",
};

const FAQ_DATA = [
    { q: "What is CollaXion?", a: "CollaXion is an AI-powered platform that connects Riphah students with internships, collaborations, and events tailored to their skills and academic goals." },
    { q: "How does AI Matching work?", a: "Our AI analyses your CV, extracted skills, and past activity to recommend the most relevant internships and collaborators for you." },
    { q: "How do I apply for an internship?", a: "Browse Internships from the drawer, tap any listing, and hit Apply. Track all applications under My Applications." },
    { q: "Can I save internships for later?", a: "Yes! Bookmark any listing. Access saved internships from the Saved Internships section in Settings." },
    { q: "How do I update my profile?", a: "Go to Settings → Profile Settings to update your name, skills, bio, and profile photo." },
    { q: "Is my data secure?", a: "Absolutely. CollaXion uses secure MongoDB Atlas storage and never shares your personal data with third parties." },
    { q: "How do I delete my account?", a: "Contact our support team at collaxionsupport@gmail.com and we will process your request within 48 hours." },
    { q: "Why am I not getting AI recommendations?", a: "Make sure you have uploaded your CV. Our AI extracts your skills from your CV to generate recommendations." },
];

const PRIVACY_SECTIONS = [
    { title: "Information We Collect", body: "CollaXion collects your name, university email, department, semester, city, CV data, and profile photo solely to provide internship matching and collaboration services." },
    { title: "How We Use Your Data", body: "Your data is used to power AI-based internship recommendations, match you with industry partners, and personalise your CollaXion experience." },
    { title: "Data Storage", body: "All data is securely stored on MongoDB Atlas with encrypted connections. We never store plain credit card or payment information." },
    { title: "Third-Party Sharing", body: "We do not sell, rent, or share your personal information with advertisers or unrelated third parties." },
    { title: "Your Rights", body: "You may request deletion of your account and all associated data at any time by contacting collaxionsupport@gmail.com." },
    { title: "Contact", body: "For privacy concerns, reach us at collaxionsupport@gmail.com. We respond within 48 hours on business days." },
];

const TERMS_SECTIONS = [
    { title: "Eligibility", body: "CollaXion is exclusively available to currently enrolled students of Riphah International University with a valid @students.riphah.edu.pk email." },
    { title: "Account Responsibility", body: "You are responsible for maintaining the confidentiality of your account credentials. Do not share your password with anyone." },
    { title: "Acceptable Use", body: "You agree not to misuse the platform, submit false information, or harass other users or industry partners." },
    { title: "AI Recommendations", body: "AI-generated recommendations are based on your profile data. CollaXion does not guarantee job placement or internship selection." },
    { title: "Intellectual Property", body: "All CollaXion branding, UI, and proprietary AI models are the intellectual property of the CollaXion team." },
    { title: "Termination", body: "CollaXion reserves the right to suspend accounts that violate these terms without prior notice." },
];

// ─── Rating Modal ─────────────────────────────────────────────────────────────
const RatingModal = ({ visible, onClose }: any) => {
    const [stars, setStars] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const submit = async () => {
        if (stars === 0) { Alert.alert("Rating required", "Please select a star rating first."); return; }
        setLoading(true);
        try {
            const studentEmail = (await AsyncStorage.getItem("studentEmail")) || "unknown@collaxion.app";
            // const response = await fetch("http://192.168.0.245:5000/api/student/send-rating", 
            const response = await fetch(
  `${CONSTANT.API_BASE_URL}/api/student/send-rating`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stars, feedback: feedback.trim(), studentEmail }),
            });
            const data = await response.json();
            if (!response.ok || !data.success) throw new Error(data.message || "Server error");
            setDone(true);
        } catch (err: any) {
            Alert.alert("Error", err.message === "Network request failed" ? "Please check your internet connection." : "Could not submit rating. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const close = () => { setStars(0); setFeedback(""); setDone(false); onClose(); };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
            <View style={m.overlay}>
                <View style={m.card}>
                    {done ? (
                        <>
                            <Text style={{ fontSize: 48 }}>🎉</Text>
                            <Text style={m.title}>Thank You!</Text>
                            <Text style={m.sub}>Your feedback has been sent to CollaXion.</Text>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: C.navy,
                                    paddingVertical: 10,
                                    paddingHorizontal: 36,
                                    borderRadius: 10,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginTop: 10,
                                }}
                                onPress={close}
                                activeOpacity={0.85}
                            >
                                <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 14 }}>
                                    OK
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <View style={m.ratingHeader}>
                                <Image source={require("../../assets/images/logo.png")} style={m.logo} resizeMode="contain" />
                                <Text style={m.title}>Rate CollaXion</Text>
                                <Text style={m.sub}>Your feedback helps us improve!</Text>
                            </View>
                            <View style={m.stars}>
                                {[1,2,3,4,5].map(i => (
                                    <TouchableOpacity key={i} onPress={() => setStars(i)} activeOpacity={0.7}>
                                        <Ionicons name={i <= stars ? "star" : "star-outline"} size={36} color={i <= stars ? C.gold : "#DDD"} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {stars > 0 && <Text style={m.starLabel}>{["","Poor","Fair","Good","Great","Excellent!"][stars]}</Text>}
                            <TextInput
                                style={m.input}
                                placeholder="Share your thoughts (optional)..."
                                placeholderTextColor={C.sub}
                                value={feedback}
                                onChangeText={setFeedback}
                                multiline
                                numberOfLines={3}
                            />
                            <View style={m.row}>
                                <TouchableOpacity style={m.cancelBtn} onPress={close} activeOpacity={0.8}>
                                    <Text style={m.cancelTxt}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={m.primaryBtn} onPress={submit} activeOpacity={0.8} disabled={loading}>
                                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={m.primaryBtnTxt}>Submit</Text>}
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};

// ─── Policy Full Screen Modal ─────────────────────────────────────────────────
const PolicyModal = ({ visible, onClose, title, sections }: any) => (
    <Modal visible={visible} transparent={false} animationType="slide" onRequestClose={onClose}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#EBF1F5" }}>
            <StatusBar barStyle="light-content" backgroundColor={C.navy} />

            <View style={fs.header}>
                <TouchableOpacity onPress={onClose} style={fs.backBtn} activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={22} color={C.white} />
                </TouchableOpacity>
                <Text style={fs.headerTitle}>{title}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>

                <View style={fs.topCard}>
                    <Image source={require("../../assets/images/logo.png")} style={fs.topLogo} resizeMode="contain" />
                    <View style={{ flex: 1 }}>
                        <Text style={fs.topTitle}>{title}</Text>
                        <Text style={fs.topSub}>Effective: January 2026  ·  CollaXion</Text>
                    </View>
                </View>

                {sections.map((s: any, i: number) => (
                    <View key={i} style={fs.sectionCard}>
                        <View style={fs.sectionTop}>
                            <View style={fs.numBadge}>
                                <Text style={fs.numTxt}>{i + 1}</Text>
                            </View>
                            <Text style={fs.sectionTitle}>{s.title}</Text>
                        </View>
                        <Text style={fs.sectionBody}>{s.body}</Text>
                    </View>
                ))}

                <View style={fs.footerNote}>
                    <Ionicons name="shield-checkmark-outline" size={16} color={C.accent} />
                    <Text style={fs.footerNoteTxt}>
                        For any questions, contact us at collaxionsupport@gmail.com
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    </Modal>
);

// ─── Contact Full Screen Modal ────────────────────────────────────────────────
const ContactModal = ({ visible, onClose }: any) => (
    <Modal visible={visible} transparent={false} animationType="slide" onRequestClose={onClose}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#EBF1F5" }}>
            <StatusBar barStyle="light-content" backgroundColor={C.navy} />

            <View style={fs.header}>
                <TouchableOpacity onPress={onClose} style={fs.backBtn} activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={22} color={C.white} />
                </TouchableOpacity>
                <Text style={fs.headerTitle}>Contact Support</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>

                <View style={fs.heroCard}>
                    <View style={fs.heroIconBox}>
                        <Ionicons name="headset-outline" size={32} color={C.white} />
                    </View>
                    <Text style={fs.heroCardTitle}>We're here to help</Text>
                    <Text style={fs.heroCardSub}>
                        Reach out to our support team anytime. We typically respond within 24 hours on business days.
                    </Text>
                </View>

                <Text style={fs.groupLabel}>GET IN TOUCH</Text>
                <View style={fs.card}>
                    <TouchableOpacity
                        style={fs.contactRow}
                        activeOpacity={0.7}
                        onPress={() => Linking.openURL("mailto:collaxionsupport@gmail.com?subject=Support Request")}
                    >
                        <View style={[fs.contactIcon, { backgroundColor: "#E8F8F0" }]}>
                            <Ionicons name="mail" size={20} color="#27AE60" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={fs.contactLabel}>Email Support</Text>
                            <Text style={fs.contactValue}>collaxionsupport@gmail.com</Text>
                        </View>
                        <Ionicons name="open-outline" size={16} color={C.sub} />
                    </TouchableOpacity>
                </View>

                <Text style={fs.groupLabel}>SUPPORT INFO</Text>
                <View style={fs.card}>
                    <View style={[fs.contactRow, { borderBottomWidth: 1, borderBottomColor: "#F0F5F8" }]}>
                        <View style={[fs.contactIcon, { backgroundColor: "#EAF3FC" }]}>
                            <Ionicons name="time-outline" size={20} color={C.accent} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={fs.contactLabel}>Support Hours</Text>
                            <Text style={fs.contactValue}>Monday – Friday  ·  9:00 am – 6:00 pm PKT</Text>
                        </View>
                    </View>
                    <View style={fs.contactRow}>
                        <View style={[fs.contactIcon, { backgroundColor: "#FEF5E7" }]}>
                            <Ionicons name="flash-outline" size={20} color={C.gold} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={fs.contactLabel}>Response Time</Text>
                            <Text style={fs.contactValue}>Usually within 24 hours</Text>
                        </View>
                    </View>
                </View>

                <Text style={fs.groupLabel}>BEFORE YOU REACH OUT</Text>
                <View style={fs.card}>
                    {[
                        { icon: "help-circle-outline", color: "#16A085", bg: "#E8F8F5", tip: "Check our Help & FAQ section first — most answers are there." },
                        { icon: "person-outline", color: "#4A90D9", bg: "#EAF3FC", tip: "Make sure your profile and CV are up to date for AI recommendations." },
                        { icon: "document-text-outline", color: "#8E44AD", bg: "#F4ECF7", tip: "For account deletion, email with subject: \"Delete My Account\"." },
                    ].map((item, i, arr) => (
                        <View key={i} style={[fs.tipRow, i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: "#F0F5F8" }]}>
                            <View style={[fs.contactIcon, { backgroundColor: item.bg }]}>
                                <Ionicons name={item.icon as any} size={20} color={item.color} />
                            </View>
                            <Text style={fs.tipTxt}>{item.tip}</Text>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    </Modal>
);

// ─── FAQ Full Screen Modal ────────────────────────────────────────────────────
const FAQModal = ({ visible, onClose }: any) => {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <Modal visible={visible} transparent={false} animationType="slide" onRequestClose={onClose}>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#EBF1F5" }}>
                <StatusBar barStyle="light-content" backgroundColor={C.navy} />

                <View style={fs.header}>
                    <TouchableOpacity onPress={onClose} style={fs.backBtn} activeOpacity={0.7}>
                        <Ionicons name="arrow-back" size={22} color={C.white} />
                    </TouchableOpacity>
                    <Text style={fs.headerTitle}>Help & FAQ</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>

                    <View style={fs.heroCard}>
                        <View style={fs.heroIconBox}>
                            <Ionicons name="help-circle-outline" size={32} color={C.white} />
                        </View>
                        <Text style={fs.heroCardTitle}>Frequently Asked Questions</Text>
                        <Text style={fs.heroCardSub}>
                            Find answers to the most common questions about CollaXion below.
                        </Text>
                    </View>

                    <Text style={fs.groupLabel}>COMMON QUESTIONS</Text>
                    <View style={fs.card}>
                        {FAQ_DATA.map((item, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => setOpen(open === i ? null : i)}
                                activeOpacity={0.8}
                                style={[
                                    fs.faqItem,
                                    i < FAQ_DATA.length - 1 && { borderBottomWidth: 1, borderBottomColor: "#F0F5F8" },
                                    open === i && { backgroundColor: "#F4F9FC" },
                                ]}
                            >
                                <View style={fs.faqRow}>
                                    <View style={[fs.faqNum, open === i && { backgroundColor: C.accent }]}>
                                        <Text style={[fs.faqNumTxt, open === i && { color: "#fff" }]}>{i + 1}</Text>
                                    </View>
                                    <Text style={[fs.faqQ, open === i && { color: C.accent }]}>{item.q}</Text>
                                    <Ionicons
                                        name={open === i ? "chevron-up" : "chevron-down"}
                                        size={16}
                                        color={open === i ? C.accent : "#C5D5DC"}
                                    />
                                </View>
                                {open === i && (
                                    <View style={fs.faqAnswer}>
                                        <Text style={fs.faqA}>{item.a}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={fs.helpBox}>
                        <View style={{ flex: 1 }}>
                            <Text style={fs.helpTitle}>Still need help?</Text>
                            <Text style={fs.helpSub}>Our support team is just an email away</Text>
                        </View>
                        <TouchableOpacity
                            style={fs.helpBtn}
                            onPress={() => Linking.openURL("mailto:collaxionsupport@gmail.com?subject=Help Request")}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="mail-outline" size={15} color="#fff" />
                            <Text style={fs.helpBtnTxt}>Email us</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};

// ─── Logout Modal ─────────────────────────────────────────────────────────────
const LogoutModal = ({ visible, onCancel, onConfirm }: any) => (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
        <View style={m.overlay}>
            <View style={m.card}>
                <View style={m.logoutIcon}>
                    <Ionicons name="log-out-outline" size={32} color={C.red} />
                </View>
                <Text style={m.title}>Sign Out</Text>
                <Text style={m.sub}>Are you sure you want to sign out of CollaXion?</Text>
                <View style={m.row}>
                    <TouchableOpacity style={m.cancelBtn} onPress={onCancel} activeOpacity={0.8}>
                        <Text style={m.cancelTxt}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[m.primaryBtn, { backgroundColor: "#193648" }]} onPress={onConfirm} activeOpacity={0.8}>
                        <Text style={m.primaryBtnTxt}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

// ─── Main Settings Screen ─────────────────────────────────────────────────────
const SettingsScreen = ({ navigation }: any) => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifs, setNotifs] = useState(true);
    const [contactVisible, setContactVisible] = useState(false);
    const [faqVisible, setFaqVisible] = useState(false);
    const [logoutVisible, setLogoutVisible] = useState(false);
    const [ratingVisible, setRatingVisible] = useState(false);
    const [privacyVisible, setPrivacyVisible] = useState(false);
    const [termsVisible, setTermsVisible] = useState(false);

    const handleLogout = async () => {
        setLogoutVisible(false);
        await AsyncStorage.multiRemove(["studentEmail", "studentToken", "studentProfileImage"]);
        navigation.replace("StudentLogin");
    };

    const Opt = ({ icon, title, onPress, isLast = false, color = C.accent, right }: any) => (
        <TouchableOpacity style={[s.option, isLast && s.lastOption]} onPress={onPress} activeOpacity={0.7}>
            <View style={[s.iconBox, { backgroundColor: color + "15" }]}>
                <Ionicons name={icon} size={19} color={color} />
            </View>
            <Text style={s.optTxt}>{title}</Text>
            {right !== undefined ? right : <Ionicons name="chevron-forward" size={15} color="#C5D5DC" />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={s.safe}>
            <StatusBar barStyle="light-content" backgroundColor={C.navy} />

            <ContactModal visible={contactVisible} onClose={() => setContactVisible(false)} />
            <FAQModal visible={faqVisible} onClose={() => setFaqVisible(false)} />
            <LogoutModal visible={logoutVisible} onCancel={() => setLogoutVisible(false)} onConfirm={handleLogout} />
            <RatingModal visible={ratingVisible} onClose={() => setRatingVisible(false)} />
            <PolicyModal visible={privacyVisible} onClose={() => setPrivacyVisible(false)} title="Privacy Policy" sections={PRIVACY_SECTIONS} />
            <PolicyModal visible={termsVisible} onClose={() => setTermsVisible(false)} title="Terms of Service" sections={TERMS_SECTIONS} />

            <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

                <View style={s.hero}>
                    <View style={s.heroTop}>
                        <View style={s.heroBadge}>
                            <View style={s.heroDot} />
                            <Text style={s.heroBadgeTxt}>Active</Text>
                        </View>
                    </View>
                    <Text style={s.heroTitle}>Settings</Text>
                    <Text style={s.heroSub}>Manage your CollaXion preferences</Text>
                </View>

                <Label text="ACCOUNT" />
                <View style={s.card}>
                    <Opt icon="person-circle-outline" title="Profile Settings" color="#4A90D9" onPress={() => navigation.navigate("Profile Settings")} />
                    <Opt icon="key-outline" title="Update Password" color="#8E44AD" onPress={() => navigation.navigate("UpdatePassword")} isLast />
                </View>

                <Label text="AI & MATCHING" />
                <View style={s.card}>
                    <Opt icon="sparkles-outline" title="AI Recommendations" color={C.gold} onPress={() => navigation.navigate("AI Recommendations")} isLast />
                </View>

                <Label text="COLLABORATION" />
                <View style={s.card}>
                    <Opt icon="send-outline" title="My Applications" color={C.green} onPress={() => navigation.navigate("My Applications")} />
                    <Opt icon="bookmark-outline" title="Saved Internships" color="#E67E22" onPress={() => navigation.navigate("Internships")} isLast />
                </View>

                <Label text="EVENTS" />
                <View style={s.card}>
                    <Opt icon="calendar-outline" title="Events" color={C.red} onPress={() => navigation.navigate("Events")} isLast />
                </View>

                <Label text="SUPPORT" />
                <View style={s.card}>
                    <Opt icon="help-circle-outline" title="Help & FAQ" color="#16A085" onPress={() => setFaqVisible(true)} />
                    <Opt icon="mail-outline" title="Contact Support" color={C.accent} onPress={() => setContactVisible(true)} />
                    <Opt icon="star-outline" title="Rate CollaXion" color={C.gold} onPress={() => setRatingVisible(true)} />
                    <Opt icon="shield-checkmark-outline" title="Privacy Policy" color="#7F8C8D" onPress={() => setPrivacyVisible(true)} />
                    <Opt icon="document-text-outline" title="Terms of Service" color="#7F8C8D" onPress={() => setTermsVisible(true)} isLast />
                </View>

                <TouchableOpacity style={s.logoutBtn} onPress={() => setLogoutVisible(true)} activeOpacity={0.85}>
                    <Ionicons name="log-out-outline" size={18} color={C.white} />
                    <Text style={s.logoutTxt}>Sign Out</Text>
                </TouchableOpacity>

                <View style={s.footer}>
                    <Image source={require("../../assets/images/logo.png")} style={s.footerLogo} resizeMode="contain" />
                    <Text style={s.footerApp}>CollaXion v1.0.0</Text>
                    <Text style={s.footerTag}>Where Collaboration Meets Innovation</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const Label = ({ text }: { text: string }) => <Text style={s.label}>{text}</Text>;

export default SettingsScreen;

// ─── Main Styles ──────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    safe:        { flex: 1, backgroundColor: "#EBF1F5" },
    scroll:      { flex: 1 },
    hero: {
        backgroundColor: C.navy,
        paddingHorizontal: 22, paddingTop: 24, paddingBottom: 28,
        borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
        marginBottom: 6, elevation: 6,
        shadowColor: C.navyD, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25, shadowRadius: 12,
    },
    heroTop:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
    heroLogo:     { width: 38, height: 38, borderRadius: 10, backgroundColor: "#fff" },
    heroBadge:    { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(39,174,96,0.15)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
    heroDot:      { width: 7, height: 7, borderRadius: 4, backgroundColor: C.green, marginRight: 5 },
    heroBadgeTxt: { color: "#A8E6CF", fontSize: 11, fontWeight: "700" },
    heroTitle:    { color: C.white, fontSize: 26, fontWeight: "800", letterSpacing: 0.3 },
    heroSub:      { color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 4 },
    label: {
        fontSize: 10, fontWeight: "800", color: C.sub,
        letterSpacing: 1.5, marginHorizontal: 20, marginTop: 22, marginBottom: 7,
    },
    card: {
        backgroundColor: C.card, marginHorizontal: 14, borderRadius: 18,
        paddingVertical: 4, elevation: 2, shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 8,
    },
    option: {
        flexDirection: "row", alignItems: "center",
        paddingVertical: 13, paddingHorizontal: 16,
        borderBottomWidth: 1, borderBottomColor: "#F0F5F8", gap: 13,
    },
    lastOption:  { borderBottomWidth: 0 },
    iconBox:     { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center" },
    optTxt:      { flex: 1, fontSize: 14.5, color: C.text, fontWeight: "500" },
    logoutBtn: {
        flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8,
        margin: 14, marginTop: 22, padding: 15, borderRadius: 16,
        backgroundColor: "#193648", borderWidth: 0,
        shadowColor: "#193648", shadowOpacity: 0.25, shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 }, elevation: 4,
    },
    logoutTxt:   { fontSize: 15, fontWeight: "700", color: C.white, letterSpacing: 0.3 },
    footer:      { alignItems: "center", paddingVertical: 30, gap: 5 },
    footerLogo:  { width: 36, height: 36, borderRadius: 10, marginBottom: 6 },
    footerApp:   { fontSize: 12, color: "#9AADB8", fontWeight: "600" },
    footerTag:   { fontSize: 11, color: "#B8CAD3" },
});

// ─── Center Modal Styles (Rating + Logout) ────────────────────────────────────
const m = StyleSheet.create({
    overlay:      { flex: 1, backgroundColor: "rgba(10,25,35,0.55)", justifyContent: "center", alignItems: "center", padding: 20 },
    card: {
        backgroundColor: C.white, borderRadius: 24, padding: 26,
        width: "100%", alignItems: "center", elevation: 12,
        shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20,
    },
    logo:         { width: 48, height: 48, borderRadius: 12, marginBottom: 10 },
    ratingHeader: { alignItems: "center", marginBottom: 4 },
    title:        { fontSize: 20, fontWeight: "800", color: C.text, textAlign: "center", marginBottom: 6 },
    sub:          { fontSize: 13, color: C.sub, textAlign: "center", lineHeight: 20, marginBottom: 18 },
    stars:        { flexDirection: "row", gap: 8, marginBottom: 8 },
    starLabel:    { fontSize: 14, fontWeight: "700", color: C.gold, marginBottom: 14 },
    input: {
        width: "100%", backgroundColor: "#F0F5F8", borderRadius: 12,
        padding: 14, fontSize: 13, color: C.text,
        textAlignVertical: "top", marginBottom: 18, minHeight: 80,
    },
    row:           { flexDirection: "row", gap: 10, width: "100%" },
    primaryBtn:    { flex: 1, flexDirection: "row", backgroundColor: C.navy, paddingVertical: 13, borderRadius: 13, alignItems: "center", justifyContent: "center" },
    primaryBtnTxt: { color: "#fff", fontWeight: "800", fontSize: 14 },
    cancelBtn:     { flex: 1, backgroundColor: "#EBF1F5", paddingVertical: 13, borderRadius: 13, alignItems: "center", justifyContent: "center" },
    cancelTxt:     { color: C.sub, fontWeight: "700", fontSize: 14 },
    logoutIcon:    { width: 64, height: 64, borderRadius: 20, backgroundColor: "#FDEDEC", justifyContent: "center", alignItems: "center", marginBottom: 14 },
});

// ─── Full Screen Modal Styles (FAQ, Contact, Privacy, Terms) ──────────────────
const fs = StyleSheet.create({
    header: {
        backgroundColor: C.navy,
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 12, paddingVertical: 14,
        elevation: 4, shadowColor: C.navyD,
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 6,
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.1)",
        justifyContent: "center", alignItems: "center",
    },
    headerTitle: { fontSize: 17, fontWeight: "700", color: C.white, letterSpacing: 0.2 },

    topCard: {
        backgroundColor: C.white, borderRadius: 18, padding: 16,
        flexDirection: "row", alignItems: "center", gap: 14,
        marginBottom: 14, elevation: 2,
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, shadowRadius: 6,
    },
    topLogo:  { width: 48, height: 48, borderRadius: 12 },
    topTitle: { fontSize: 15, fontWeight: "700", color: C.text },
    topSub:   { fontSize: 11, color: C.sub, marginTop: 3 },

    sectionCard: {
        backgroundColor: C.white, borderRadius: 16, padding: 16,
        marginBottom: 10, elevation: 2,
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: 6,
    },
    sectionTop:   { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
    numBadge:     { width: 26, height: 26, borderRadius: 8, backgroundColor: C.navy, justifyContent: "center", alignItems: "center" },
    numTxt:       { color: "#fff", fontSize: 11, fontWeight: "800" },
    sectionTitle: { fontSize: 14, fontWeight: "700", color: C.text, flex: 1 },
    sectionBody:  { fontSize: 13, color: C.sub, lineHeight: 21 },

    footerNote: {
        flexDirection: "row", alignItems: "center", gap: 8,
        backgroundColor: "#EAF4FC", borderRadius: 12, padding: 14, marginTop: 6,
    },
    footerNoteTxt: { flex: 1, fontSize: 12, color: C.accent, lineHeight: 18 },

    heroCard: {
        backgroundColor: C.navy, borderRadius: 20, padding: 22,
        alignItems: "center", marginBottom: 20, elevation: 4,
        shadowColor: C.navyD, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2, shadowRadius: 10,
    },
    heroIconBox: {
        width: 60, height: 60, borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.15)",
        justifyContent: "center", alignItems: "center", marginBottom: 12,
    },
    heroCardTitle: { fontSize: 18, fontWeight: "800", color: C.white, marginBottom: 8 },
    heroCardSub:   { fontSize: 13, color: "rgba(255,255,255,0.6)", textAlign: "center", lineHeight: 20 },

    groupLabel: {
        fontSize: 10, fontWeight: "800", color: C.sub,
        letterSpacing: 1.5, marginBottom: 8, marginTop: 4, marginLeft: 4,
    },

    card: {
        backgroundColor: C.white, borderRadius: 18, marginBottom: 16,
        elevation: 2, shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6,
        overflow: "hidden",
    },

    contactRow:   { flexDirection: "row", alignItems: "center", gap: 14, padding: 14 },
    contactIcon:  { width: 42, height: 42, borderRadius: 12, justifyContent: "center", alignItems: "center" },
    contactLabel: { fontSize: 14, fontWeight: "600", color: C.text, marginBottom: 2 },
    contactValue: { fontSize: 12, color: C.sub },

    tipRow: { flexDirection: "row", alignItems: "flex-start", gap: 14, padding: 14 },
    tipTxt: { flex: 1, fontSize: 13, color: C.sub, lineHeight: 20 },

    faqItem:   { paddingHorizontal: 14 },
    faqRow:    { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 14 },
    faqNum:    { width: 24, height: 24, borderRadius: 7, backgroundColor: "#EBF1F5", justifyContent: "center", alignItems: "center" },
    faqNumTxt: { fontSize: 10, fontWeight: "800", color: C.sub },
    faqQ:      { flex: 1, fontSize: 13.5, fontWeight: "600", color: C.text },
    faqAnswer: { backgroundColor: "#F0F7FC", borderRadius: 12, padding: 12, marginBottom: 12, marginLeft: 34 },
    faqA:      { fontSize: 13, color: C.sub, lineHeight: 20 },

    helpBox: {
        backgroundColor: C.white, borderRadius: 16, padding: 16,
        flexDirection: "row", alignItems: "center", gap: 12,
        elevation: 2, shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6,
    },
    helpTitle:  { fontSize: 14, fontWeight: "700", color: C.text },
    helpSub:    { fontSize: 12, color: C.sub, marginTop: 2 },
    helpBtn: {
        flexDirection: "row", alignItems: "center", gap: 6,
        backgroundColor: C.accent, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
    },
    helpBtnTxt: { color: "#fff", fontSize: 13, fontWeight: "700" },
});