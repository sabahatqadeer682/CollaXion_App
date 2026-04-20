







// import { CONSTANT } from "@/constants/constant";
// import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import axios from "axios";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//     ActivityIndicator,
//     Animated,
//     Image,
//     KeyboardAvoidingView,
//     Modal,
//     Platform,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";

// const CX_BOT_LOGO = require("../../assets/images/logo.png");

// const quickActions = [
//     {
//         id: "1",
//         title: "Browse Internships",
//         description: "Find & apply for internships",
//         screen: "Internships",
//         icon: "briefcase-search",
//         color: "#1A56DB",
//         bg: "#EBF5FF",
//         gradient: ["#1A56DB", "#3B82F6"],
//     },
//     {
//         id: "2",
//         title: "AI Recommendations",
//         description: "Personalized suggestions",
//         screen: "AI Recommendations",
//         icon: "brain",
//         color: "#7C3AED",
//         bg: "#F5F3FF",
//         gradient: ["#7C3AED", "#A78BFA"],
//     },
//     {
//         id: "3",
//         title: "My Applications",
//         description: "Track application status",
//         screen: "My Applications",
//         icon: "briefcase-clock",
//         color: "#059669",
//         bg: "#ECFDF5",
//         gradient: ["#059669", "#34D399"],
//     },
//     {
//         id: "4",
//         title: "Events",
//         description: "Job fairs & seminars",
//         screen: "Events",
//         icon: "calendar-star",
//         color: "#D97706",
//         bg: "#FFFBEB",
//         gradient: ["#D97706", "#FCD34D"],
//     },
// ];

// const StudentHomeScreen = () => {
//     const navigation = useNavigation<any>();
//     const [isChatOpen, setIsChatOpen] = useState(false);
//     const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
//         {
//             sender: "ai",
//             text: "Assalam o Alaikum! I'm CXbot, your CollaXion AI assistant.\n\nI can help you with:\n• Finding internships\n• CV advice\n• Application tracking\n• Events & more!\n\nAsk me anything! 🚀",
//         },
//     ]);
//     const [inputText, setInputText] = useState("");
//     const scrollRef = useRef<ScrollView>(null);
//     const [loading, setLoading] = useState(false);
//     const [studentData, setStudentData] = useState<any>(null);
//     const [statsLoading, setStatsLoading] = useState(true);
//     const [notificationCount, setNotificationCount] = useState(0);
//     // ✅ NEW: unread chat count
//     const [unreadChatCount, setUnreadChatCount] = useState(0);

//     // Animations — all untouched
//     const pulseAnim = useRef(new Animated.Value(1)).current;
//     const fabGlowAnim = useRef(new Animated.Value(0)).current;
//     const headerAnim = useRef(new Animated.Value(0)).current;
//     const statsAnim = useRef(new Animated.Value(0)).current;

//     useEffect(() => {
//         Animated.loop(
//             Animated.sequence([
//                 Animated.timing(pulseAnim, { toValue: 1.1, duration: 1200, useNativeDriver: true }),
//                 Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
//             ])
//         ).start();

//         Animated.loop(
//             Animated.sequence([
//                 Animated.timing(fabGlowAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
//                 Animated.timing(fabGlowAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
//             ])
//         ).start();

//         Animated.stagger(200, [
//             Animated.spring(headerAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
//             Animated.spring(statsAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
//         ]).start();
//     }, []);

//     useFocusEffect(
//         useCallback(() => {
//             fetchStudentStats();
//             fetchNotificationCount();
//             fetchChatUnread(); // ✅ NEW
//         }, [])
//     );

//     const fetchStudentStats = async () => {
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             if (!email) return;
//             const response = await axios.get(`${CONSTANT.API_BASE_URL}/api/student/getStudent/${email}`);
//             setStudentData(response.data);
//         } catch (err) {
//             console.log("Error fetching student stats:", err);
//         } finally {
//             setStatsLoading(false);
//         }
//     };

//     const fetchNotificationCount = async () => {
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             if (!email) return;
//             const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/notifications/unread/${email}`);
//             setNotificationCount(res.data.count || 0);
//         } catch (err) {
//             console.log("Notif count error:", err);
//         }
//     };

//     // ✅ NEW: fetch unread chat count
//     const fetchChatUnread = async () => {
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             if (!email) return;
//             // Only relevant for Riphah students — silently skip otherwise
//             if (!email.toLowerCase().endsWith("@riphah.edu.pk")) return;
//             const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/chat/unread/${email}`);
//             setUnreadChatCount(res.data.count || 0);
//         } catch (err) {
//             console.log("Chat unread error:", err);
//         }
//     };

//     const getGeminiResponse = async (userQuery: string): Promise<string> => {
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             const response = await axios.post(
//                 `${CONSTANT.API_BASE_URL}/api/student-assistant/chat`,
//                 {
//                     message: userQuery || "",
//                     studentEmail: email || "",
//                 }
//             );
//             return response.data.reply || "No response from AI";
//         } catch (err: any) {
//             console.log("Gemini API Error:", err?.response?.data || err.message);
//             return "⚠️ Connection issue or server error.";
//         }
//     };

//     const sendMessage = async () => {
//         if (!inputText.trim()) return;
//         const userMessage = { sender: "user" as const, text: inputText };
//         setMessages((prev) => [...prev, userMessage]);
//         setInputText("");
//         setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
//         setLoading(true);
//         const aiText = await getGeminiResponse(userMessage.text);
//         setMessages((prev) => [...prev, { sender: "ai" as const, text: aiText }]);
//         setLoading(false);
//         setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
//     };

//     const getGreeting = () => {
//         const hour = new Date().getHours();
//         if (hour >= 20 || hour < 3) return "Good Night";
//         if (hour >= 3 && hour < 12) return "Good Morning";
//         if (hour >= 12 && hour < 17) return "Good Afternoon";
//         if (hour >= 17 && hour < 20) return "Good Evening";
//     };

//     const headerTranslateY = headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] });
//     const statsTranslateY = statsAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] });

//     return (
//         <View style={{ flex: 1, backgroundColor: "#F0F4F8" }}>
//             <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>

//                 {/* ✅ Hero Header */}
//                 <Animated.View style={[styles.heroSection, { opacity: headerAnim, transform: [{ translateY: headerTranslateY }] }]}>
//                     <View style={styles.heroTopRow}>
//                         {/* Left: greeting + name + subtitle */}
//                         <View style={styles.heroContent}>
//                             <View style={styles.greetingPill}>
//                                 <View style={styles.greetingDot} />
//                                 <Text style={styles.greetingBadge}>{getGreeting()}</Text>
//                             </View>
//                             <Text style={styles.nameText}>
//                                 {studentData?.fullName?.split(" ")[0] || "Student"}
//                             </Text>
//                             <Text style={styles.heroSubText}>
//                                 Your career journey starts here. Let's find your perfect internship!
//                             </Text>
//                         </View>

//                         {/* ✅ Right: Messages + Notifications icons */}
//                         <View style={styles.heroIcons}>
//                             {/* Messages icon */}
//                             <TouchableOpacity
//                                 style={styles.heroIconBtn}
//                                 onPress={() => navigation.navigate("ChatList")}
//                                 activeOpacity={0.8}
//                             >
//                                 <MaterialCommunityIcons name="chat-outline" size={22} color="#fff" />
//                                 {unreadChatCount > 0 && (
//                                     <View style={styles.iconBadge}>
//                                         <Text style={styles.iconBadgeText}>
//                                             {unreadChatCount > 9 ? "9+" : unreadChatCount}
//                                         </Text>
//                                     </View>
//                                 )}
//                             </TouchableOpacity>

//                             {/* Notifications icon */}
//                             <TouchableOpacity
//                                 style={styles.heroIconBtn}
//                                 onPress={() => navigation.navigate("Notifications")}
//                                 activeOpacity={0.8}
//                             >
//                                 <MaterialCommunityIcons name="bell-outline" size={22} color="#fff" />
//                                 {notificationCount > 0 && (
//                                     <View style={styles.iconBadge}>
//                                         <Text style={styles.iconBadgeText}>
//                                             {notificationCount > 9 ? "9+" : notificationCount}
//                                         </Text>
//                                     </View>
//                                 )}
//                             </TouchableOpacity>
//                         </View>
//                     </View>

//                     {/* ✅ Mini stats inside hero */}
//                     <View style={styles.heroStatsRow}>
//                         <View style={styles.heroStat}>
//                             <Text style={styles.heroStatNum}>{studentData?.extractedSkills?.length || 0}</Text>
//                             <Text style={styles.heroStatLbl}>Skills</Text>
//                         </View>
//                         <View style={styles.heroStatDivider} />
//                         <View style={styles.heroStat}>
//                             <Text style={styles.heroStatNum}>{studentData?.totalApplications || 0}</Text>
//                             <Text style={styles.heroStatLbl}>Applied</Text>
//                         </View>
//                         <View style={styles.heroStatDivider} />
//                         <View style={styles.heroStat}>
//                             <Text style={styles.heroStatNum}>{studentData?.selectedInternships || 0}</Text>
//                             <Text style={styles.heroStatLbl}>Selected</Text>
//                         </View>
//                         <View style={styles.heroStatDivider} />
//                         <View style={styles.heroStat}>
//                             <Text style={styles.heroStatNum}>{notificationCount}</Text>
//                             <Text style={styles.heroStatLbl}>Alerts</Text>
//                         </View>
//                     </View>
//                 </Animated.View>

//                 {/* ✅ Stats Cards Row */}
//                 <Animated.View style={[styles.statsRow, { opacity: statsAnim, transform: [{ translateY: statsTranslateY }] }]}>
//                     {statsLoading ? (
//                         <ActivityIndicator color="#193648" style={{ flex: 1, paddingVertical: 20 }} />
//                     ) : (
//                         <>
//                             <TouchableOpacity style={[styles.statCard, { backgroundColor: "#EBF5FF" }]} onPress={() => navigation.navigate("Profile Settings")}>
//                                 <View style={[styles.statIconBg, { backgroundColor: "#1A56DB20" }]}>
//                                     <MaterialCommunityIcons name="brain" size={22} color="#1A56DB" />
//                                 </View>
//                                 <Text style={[styles.statNum, { color: "#1A56DB" }]}>{studentData?.extractedSkills?.length || 0}</Text>
//                                 <Text style={styles.statLbl}>Skills</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity style={[styles.statCard, { backgroundColor: "#ECFDF5" }]} onPress={() => navigation.navigate("My Applications")}>
//                                 <View style={[styles.statIconBg, { backgroundColor: "#05966920" }]}>
//                                     <MaterialCommunityIcons name="briefcase-check" size={22} color="#059669" />
//                                 </View>
//                                 <Text style={[styles.statNum, { color: "#059669" }]}>{studentData?.totalApplications || 0}</Text>
//                                 <Text style={styles.statLbl}>Applied</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity style={[styles.statCard, { backgroundColor: "#FFF7ED" }]} onPress={() => navigation.navigate("My Applications")}>
//                                 <View style={[styles.statIconBg, { backgroundColor: "#EA580C20" }]}>
//                                     <MaterialCommunityIcons name="trophy" size={22} color="#EA580C" />
//                                 </View>
//                                 <Text style={[styles.statNum, { color: "#EA580C" }]}>{studentData?.selectedInternships || 0}</Text>
//                                 <Text style={styles.statLbl}>Selected</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity style={[styles.statCard, { backgroundColor: "#FEF3C7" }]} onPress={() => navigation.navigate("Notifications")}>
//                                 <View style={[styles.statIconBg, { backgroundColor: "#F59E0B20" }]}>
//                                     <MaterialCommunityIcons name="bell-ring" size={22} color="#D97706" />
//                                 </View>
//                                 <Text style={[styles.statNum, { color: "#D97706" }]}>{notificationCount}</Text>
//                                 <Text style={styles.statLbl}>Alerts</Text>
//                             </TouchableOpacity>
//                         </>
//                     )}
//                 </Animated.View>

//                 {/* ✅ CV Upload Alert */}
//                 {!studentData?.cvUrl && (
//                     <TouchableOpacity style={styles.alertBanner} onPress={() => navigation.navigate("Profile Settings")} activeOpacity={0.85}>
//                         <View style={styles.alertLeft}>
//                             <View style={styles.alertIconBg}>
//                                 <MaterialCommunityIcons name="file-upload" size={22} color="#92400E" />
//                             </View>
//                             <View style={{ marginLeft: 12, flex: 1 }}>
//                                 <Text style={styles.alertTitle}>Complete Your Profile</Text>
//                                 <Text style={styles.alertSub}>Upload CV to unlock AI-powered matching ✨</Text>
//                             </View>
//                         </View>
//                         <View style={styles.alertArrow}>
//                             <MaterialCommunityIcons name="arrow-right" size={18} color="#92400E" />
//                         </View>
//                     </TouchableOpacity>
//                 )}

//                 {/* ✅ Quick Actions */}
//                 <View style={styles.section}>
//                     <View style={styles.sectionHeader}>
//                         <Text style={styles.sectionTitle}>Quick Actions</Text>
//                         <View style={styles.sectionAccent} />
//                     </View>
//                     <View style={styles.actionsGrid}>
//                         {quickActions.map((item) => (
//                             <TouchableOpacity
//                                 key={item.id}
//                                 style={[styles.actionCard, { backgroundColor: item.bg }]}
//                                 onPress={() => navigation.navigate(item.screen)}
//                                 activeOpacity={0.8}
//                             >
//                                 <View style={[styles.actionIcon, { backgroundColor: item.color + "18" }]}>
//                                     <MaterialCommunityIcons name={item.icon as any} size={28} color={item.color} />
//                                 </View>
//                                 <Text style={[styles.actionTitle, { color: item.color }]}>{item.title}</Text>
//                                 <Text style={styles.actionDesc}>{item.description}</Text>
//                                 <View style={[styles.actionArrow, { backgroundColor: item.color + "15" }]}>
//                                     <MaterialCommunityIcons name="arrow-right" size={14} color={item.color} />
//                                 </View>
//                             </TouchableOpacity>
//                         ))}
//                     </View>
//                 </View>

//                 {/* ✅ More Features */}
//                 <View style={styles.section}>
//                     <View style={styles.sectionHeader}>
//                         <Text style={styles.sectionTitle}>More Features</Text>
//                         <View style={styles.sectionAccent} />
//                     </View>

//                     {[
//                         {
//                             screen: "Nearby Industries",
//                             iconBg: "#FEF3C7",
//                             icon: <MaterialIcons name="location-on" size={22} color="#D97706" />,
//                             title: "Nearby Industries",
//                             desc: "Find companies near you on map",
//                         },
//                         {
//                             screen: "Feedback",
//                             iconBg: "#FDF2F8",
//                             icon: <MaterialCommunityIcons name="star-half-full" size={22} color="#EC4899" />,
//                             title: "Feedback & Ratings",
//                             desc: "Rate companies & share experience",
//                         },
//                         {
//                             screen: "Profile Settings",
//                             iconBg: "#F0FDF4",
//                             icon: <FontAwesome5 name="user-circle" size={20} color="#059669" />,
//                             title: "My Profile",
//                             desc: "Update info, skills & documents",
//                         },
//                         {
//                             screen: "Notifications",
//                             iconBg: "#FFF7ED",
//                             icon: (
//                                 <View>
//                                     <MaterialCommunityIcons name="bell-ring" size={22} color="#D97706" />
//                                     {notificationCount > 0 && (
//                                         <View style={styles.featureBadge}>
//                                             <Text style={styles.featureBadgeText}>{notificationCount}</Text>
//                                         </View>
//                                     )}
//                                 </View>
//                             ),
//                             title: "Notifications",
//                             desc: `${notificationCount} unread alert${notificationCount !== 1 ? "s" : ""}`,
//                         },
//                         // ✅ NEW: Student Chat feature row
//                         {
//                             screen: "ChatList",
//                             iconBg: "#EBF5FF",
//                             icon: (
//                                 <View>
//                                     <MaterialCommunityIcons name="chat-processing" size={22} color="#1A56DB" />
//                                     {unreadChatCount > 0 && (
//                                         <View style={styles.featureBadge}>
//                                             <Text style={styles.featureBadgeText}>{unreadChatCount}</Text>
//                                         </View>
//                                     )}
//                                 </View>
//                             ),
//                             title: "Student Chat",
//                             desc: unreadChatCount > 0
//                                 ? `${unreadChatCount} unread message${unreadChatCount !== 1 ? "s" : ""}`
//                                 : "Chat with Riphah students",
//                         },
//                     ].map((feature, idx) => (
//                         <TouchableOpacity
//                             key={idx}
//                             style={styles.featureRow}
//                             onPress={() => navigation.navigate(feature.screen)}
//                             activeOpacity={0.8}
//                         >
//                             <View style={[styles.featureIcon, { backgroundColor: feature.iconBg }]}>
//                                 {feature.icon}
//                             </View>
//                             <View style={{ flex: 1 }}>
//                                 <Text style={styles.featureTitle}>{feature.title}</Text>
//                                 <Text style={styles.featureDesc}>{feature.desc}</Text>
//                             </View>
//                             <View style={styles.featureChevron}>
//                                 <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
//                             </View>
//                         </TouchableOpacity>
//                     ))}
//                 </View>

//                 {/* ✅ AI Badge */}
//                 <TouchableOpacity style={styles.aiBadge} onPress={() => setIsChatOpen(true)} activeOpacity={0.85}>
//                     <Image source={CX_BOT_LOGO} style={styles.aiBadgeLogo} />
//                     <View style={{ flex: 1 }}>
//                         <Text style={styles.aiText}>Powered by CollaXion AI</Text>
//                         <Text style={styles.aiSubText}>Tap to chat with CXbot 🤖</Text>
//                     </View>
//                     <MaterialCommunityIcons name="chevron-right" size={20} color="rgba(255,255,255,0.6)" />
//                 </TouchableOpacity>
//             </ScrollView>

//             {/* ✅ CXbot FAB */}
//             <View style={styles.fabContainer}>
//                 <Animated.View style={[styles.fabGlow, { opacity: fabGlowAnim }]} />
//                 <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
//                     <TouchableOpacity style={styles.floatingButton} onPress={() => setIsChatOpen(true)} activeOpacity={0.9}>
//                         <Image source={CX_BOT_LOGO} style={styles.fabLogo} />
//                     </TouchableOpacity>
//                 </Animated.View>
//             </View>

//             {/* ✅ CXbot Chat Modal */}
//             <Modal visible={isChatOpen} animationType="slide" transparent>
//                 <View style={styles.modalOverlay}>
//                     <KeyboardAvoidingView
//                         behavior={Platform.OS === "ios" ? "padding" : "height"}
//                         style={styles.chatModalContainer}
//                     >
//                         <View style={styles.chatHeader}>
//                             <View style={styles.chatHeaderLeft}>
//                                 <View style={styles.cxbotAvatarContainer}>
//                                     <Image source={CX_BOT_LOGO} style={styles.cxbotLogo} />
//                                     <View style={styles.onlineDot} />
//                                 </View>
//                                 <View>
//                                     <Text style={styles.chatHeaderTitle}>CXbot</Text>
//                                     <Text style={styles.chatOnline}>🟢 Online • CollaXion Powered</Text>
//                                 </View>
//                             </View>
//                             <TouchableOpacity onPress={() => setIsChatOpen(false)} style={styles.closeBtn}>
//                                 <Ionicons name="close" size={20} color="#374151" />
//                             </TouchableOpacity>
//                         </View>

//                         <ScrollView
//                             ref={scrollRef}
//                             style={styles.chatMessages}
//                             contentContainerStyle={{ paddingBottom: 12 }}
//                             onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
//                             showsVerticalScrollIndicator={false}
//                         >
//                             {messages.map((msg, idx) => (
//                                 <View key={idx} style={[styles.msgRow, msg.sender === "user" ? styles.msgRowUser : styles.msgRowAi]}>
//                                     {msg.sender === "ai" && (
//                                         <Image source={CX_BOT_LOGO} style={styles.msgAvatar} />
//                                     )}
//                                     <View style={[styles.messageBubble, msg.sender === "user" ? styles.userBubble : styles.aiBubble]}>
//                                         <Text style={{ color: msg.sender === "user" ? "#fff" : "#111827", lineHeight: 21, fontSize: 14 }}>
//                                             {msg.text}
//                                         </Text>
//                                     </View>
//                                 </View>
//                             ))}
//                             {loading && (
//                                 <View style={[styles.msgRow, styles.msgRowAi]}>
//                                     <Image source={CX_BOT_LOGO} style={styles.msgAvatar} />
//                                     <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
//                                         <ActivityIndicator size="small" color="#193648" />
//                                         <Text style={{ color: "#6B7280", marginLeft: 8, fontSize: 13 }}>CXbot is thinking...</Text>
//                                     </View>
//                                 </View>
//                             )}
//                         </ScrollView>

//                         <View style={styles.chatInputContainer}>
//                             <TextInput
//                                 value={inputText}
//                                 onChangeText={setInputText}
//                                 placeholder="Ask CXbot anything..."
//                                 style={styles.chatInput}
//                                 placeholderTextColor="#9CA3AF"
//                                 onSubmitEditing={sendMessage}
//                                 returnKeyType="send"
//                                 multiline
//                             />
//                             <TouchableOpacity
//                                 onPress={sendMessage}
//                                 style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
//                                 disabled={!inputText.trim() || loading}
//                             >
//                                 <Ionicons name="send" size={18} color="#fff" />
//                             </TouchableOpacity>
//                         </View>
//                     </KeyboardAvoidingView>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     // ── Hero ──
//     heroSection: {
//         backgroundColor: "#193648",
//         paddingHorizontal: 22,
//         paddingTop: 28,
//         paddingBottom: 24,
//         borderBottomLeftRadius: 32,
//         borderBottomRightRadius: 32,
//         marginBottom: 16,
//         shadowColor: "#193648",
//         shadowOffset: { width: 0, height: 8 },
//         shadowOpacity: 0.35,
//         shadowRadius: 16,
//         elevation: 10,
//     },
//     heroTopRow: {
//         flexDirection: "row",
//         alignItems: "flex-start",
//         marginBottom: 20,
//     },
//     heroContent: { flex: 1, paddingRight: 12 },
//     greetingPill: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "rgba(255,255,255,0.12)",
//         alignSelf: "flex-start",
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 20,
//         marginBottom: 10,
//     },
//     greetingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#34D399", marginRight: 6 },
//     greetingBadge: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: "600" },
//     nameText: { color: "#fff", fontSize: 26, fontWeight: "800", marginBottom: 6, letterSpacing: -0.5 },
//     heroSubText: { color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 19 },

//     // ✅ NEW: icon row in hero top-right
//     heroIcons: {
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 10,
//         marginTop: 4,
//     },
//     heroIconBtn: {
//         position: "relative",
//         backgroundColor: "rgba(255,255,255,0.12)",
//         borderRadius: 22,
//         padding: 10,
//     },
//     iconBadge: {
//         position: "absolute",
//         top: 4,
//         right: 4,
//         backgroundColor: "#EF4444",
//         borderRadius: 8,
//         minWidth: 16,
//         height: 16,
//         justifyContent: "center",
//         alignItems: "center",
//         paddingHorizontal: 3,
//         borderWidth: 1.5,
//         borderColor: "#193648",
//     },
//     iconBadgeText: { color: "#fff", fontSize: 9, fontWeight: "800" },

//     // ── Mini stats ──
//     heroStatsRow: {
//         flexDirection: "row",
//         backgroundColor: "rgba(255,255,255,0.1)",
//         borderRadius: 16,
//         paddingVertical: 14,
//         paddingHorizontal: 8,
//     },
//     heroStat: { flex: 1, alignItems: "center" },
//     heroStatNum: { color: "#fff", fontSize: 20, fontWeight: "800" },
//     heroStatLbl: { color: "rgba(255,255,255,0.6)", fontSize: 10, marginTop: 2, fontWeight: "500" },
//     heroStatDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.15)", marginVertical: 4 },

//     // ── Stats Cards ──
//     statsRow: {
//         flexDirection: "row",
//         marginHorizontal: 16,
//         marginBottom: 16,
//         gap: 10,
//     },
//     statCard: {
//         flex: 1,
//         borderRadius: 16,
//         paddingVertical: 14,
//         paddingHorizontal: 8,
//         alignItems: "center",
//         gap: 6,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.06,
//         shadowRadius: 6,
//         elevation: 2,
//     },
//     statIconBg: {
//         width: 40,
//         height: 40,
//         borderRadius: 12,
//         justifyContent: "center",
//         alignItems: "center",
//         marginBottom: 2,
//     },
//     statNum: { fontSize: 20, fontWeight: "800" },
//     statLbl: { fontSize: 10, color: "#6B7280", fontWeight: "600" },

//     // ── Alert Banner ──
//     alertBanner: {
//         marginHorizontal: 16,
//         marginBottom: 18,
//         backgroundColor: "#FEF3C7",
//         borderRadius: 18,
//         padding: 14,
//         flexDirection: "row",
//         alignItems: "center",
//         borderLeftWidth: 4,
//         borderLeftColor: "#F59E0B",
//         shadowColor: "#F59E0B",
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.15,
//         shadowRadius: 8,
//         elevation: 3,
//     },
//     alertLeft: { flex: 1, flexDirection: "row", alignItems: "center" },
//     alertIconBg: {
//         width: 42,
//         height: 42,
//         borderRadius: 12,
//         backgroundColor: "#FDE68A",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     alertTitle: { fontSize: 14, fontWeight: "700", color: "#92400E" },
//     alertSub: { fontSize: 12, color: "#B45309", marginTop: 2 },
//     alertArrow: { backgroundColor: "#FDE68A", borderRadius: 10, padding: 8 },

//     // ── Section ──
//     section: { marginHorizontal: 16, marginBottom: 22 },
//     sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
//     sectionTitle: { fontSize: 17, fontWeight: "800", color: "#111827", marginRight: 10 },
//     sectionAccent: { flex: 1, height: 2, backgroundColor: "#E5E7EB", borderRadius: 1 },

//     // ── Action Cards ──
//     actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
//     actionCard: {
//         width: "47%",
//         borderRadius: 20,
//         padding: 16,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 3 },
//         shadowOpacity: 0.08,
//         shadowRadius: 8,
//         elevation: 3,
//         position: "relative",
//     },
//     actionIcon: {
//         width: 52,
//         height: 52,
//         borderRadius: 16,
//         justifyContent: "center",
//         alignItems: "center",
//         marginBottom: 12,
//     },
//     actionTitle: { fontSize: 14, fontWeight: "800", marginBottom: 4 },
//     actionDesc: { fontSize: 11, color: "#6B7280", lineHeight: 15 },
//     actionArrow: {
//         position: "absolute",
//         top: 14,
//         right: 14,
//         width: 26,
//         height: 26,
//         borderRadius: 8,
//         justifyContent: "center",
//         alignItems: "center",
//     },

//     // ── Feature Rows ──
//     featureRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#fff",
//         borderRadius: 16,
//         padding: 16,
//         marginBottom: 10,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 6,
//         elevation: 2,
//     },
//     featureIcon: {
//         width: 46,
//         height: 46,
//         borderRadius: 14,
//         justifyContent: "center",
//         alignItems: "center",
//         marginRight: 14,
//     },
//     featureTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
//     featureDesc: { fontSize: 12, color: "#6B7280", marginTop: 2 },
//     featureChevron: { backgroundColor: "#F9FAFB", borderRadius: 8, padding: 4 },
//     featureBadge: {
//         position: "absolute",
//         top: -5,
//         right: -8,
//         backgroundColor: "#EF4444",
//         borderRadius: 8,
//         minWidth: 16,
//         height: 16,
//         justifyContent: "center",
//         alignItems: "center",
//         paddingHorizontal: 3,
//     },
//     featureBadgeText: { color: "#fff", fontSize: 9, fontWeight: "800" },

//     // ── AI Badge ──
//     aiBadge: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#193648",
//         marginHorizontal: 16,
//         padding: 14,
//         borderRadius: 18,
//         marginBottom: 12,
//         shadowColor: "#193648",
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.25,
//         shadowRadius: 10,
//         elevation: 5,
//     },
//     aiBadgeLogo: { width: 36, height: 36, borderRadius: 10, marginRight: 12, backgroundColor: "#fff" },
//     aiText: { color: "#fff", fontSize: 13, fontWeight: "700" },
//     aiSubText: { color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 2 },

//     // ── FAB ──
//     fabContainer: { position: "absolute", bottom: 28, right: 20, alignItems: "center", justifyContent: "center" },
//     fabGlow: {
//         position: "absolute",
//         width: 72,
//         height: 72,
//         borderRadius: 36,
//         backgroundColor: "#1936486e",
//         opacity: 0.3,
//     },
//     floatingButton: {
//         backgroundColor: "#fff",
//         width: 60,
//         height: 60,
//         borderRadius: 30,
//         justifyContent: "center",
//         alignItems: "center",
//         elevation: 10,
//         shadowColor: "#193648",
//         shadowOpacity: 0.5,
//         shadowRadius: 16,
//         shadowOffset: { width: 0, height: 6 },
//         overflow: "hidden",
//     },
//     fabLogo: { width: 38, height: 38, borderRadius: 10 },

//     // ── Chat Modal ──
//     modalOverlay: { flex: 1, backgroundColor: "rgb(255, 255, 255)" },
//     chatModalContainer: { flex: 1, backgroundColor: "#fff" },
//     chatHeader: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         paddingTop: Platform.OS === "ios" ? 50 : 20,
//         paddingHorizontal: 18,
//         paddingBottom: 14,
//         borderBottomWidth: 1,
//         borderBottomColor: "#F3F4F6",
//         backgroundColor: "#FAFAFA",
//     },
//     chatHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
//     chatHeaderTitle: { fontSize: 17, fontWeight: "800", color: "#111827" },
//     chatOnline: { fontSize: 11, color: "#059669", marginTop: 2, fontWeight: "500" },
//     cxbotAvatarContainer: { position: "relative" },
//     cxbotLogo: { width: 42, height: 42, borderRadius: 14, resizeMode: "contain" },
//     onlineDot: {
//         position: "absolute",
//         bottom: 1,
//         right: 1,
//         width: 10,
//         height: 10,
//         borderRadius: 5,
//         backgroundColor: "#10B981",
//         borderWidth: 2,
//         borderColor: "#fff",
//     },
//     closeBtn: { backgroundColor: "#F3F4F6", borderRadius: 20, padding: 8 },
//     chatMessages: { flex: 1, paddingHorizontal: 16, paddingTop: 14 },
//     msgRow: { flexDirection: "row", marginVertical: 6, alignItems: "flex-end" },
//     msgRowUser: { justifyContent: "flex-end" },
//     msgRowAi: { justifyContent: "flex-start" },
//     msgAvatar: { width: 30, height: 30, borderRadius: 10, marginRight: 8, resizeMode: "contain" },
//     messageBubble: {
//         padding: 13,
//         borderRadius: 20,
//         maxWidth: "78%",
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.06,
//         shadowRadius: 4,
//         elevation: 1,
//     },
//     userBubble: { backgroundColor: "#193648", borderBottomRightRadius: 6 },
//     aiBubble: { backgroundColor: "#F3F4F6", borderBottomLeftRadius: 6 },
//     typingBubble: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
//     chatInputContainer: {
//         flexDirection: "row",
//         padding: 14,
//         borderTopWidth: 1,
//         borderTopColor: "#F3F4F6",
//         alignItems: "flex-end",
//         gap: 10,
//         backgroundColor: "#fff",
//     },
//     chatInput: {
//         flex: 1,
//         backgroundColor: "#F9FAFB",
//         paddingHorizontal: 18,
//         paddingVertical: 11,
//         borderRadius: 25,
//         fontSize: 14,
//         color: "#111827",
//         borderWidth: 1.5,
//         borderColor: "#E5E7EB",
//         maxHeight: 100,
//     },
//     sendButton: {
//         backgroundColor: "#193648",
//         width: 44,
//         height: 44,
//         borderRadius: 22,
//         justifyContent: "center",
//         alignItems: "center",
//         shadowColor: "#193648",
//         shadowOffset: { width: 0, height: 3 },
//         shadowOpacity: 0.3,
//         shadowRadius: 6,
//         elevation: 4,
//     },
//     sendButtonDisabled: { backgroundColor: "#9CA3AF" },
// });

// export default StudentHomeScreen;









// import { CONSTANT } from "@/constants/constant";
// import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import axios from "axios";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//     ActivityIndicator,
//     Animated,
//     Image,
//     KeyboardAvoidingView,
//     Modal,
//     Platform,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import socket from "./utils/Socket";
// // ✅ for real-time badge update

// const CX_BOT_LOGO = require("../../assets/images/logo.png");

// const quickActions = [
//     {
//         id: "1",
//         title: "Browse Internships",
//         description: "Find & apply for internships",
//         screen: "Internships",
//         icon: "briefcase-search",
//         color: "#193648",
//         bg: "#EEF3F7",
//     },
//     {
//         id: "2",
//         title: "AI Recommendations",
//         description: "Personalized suggestions",
//         screen: "AI Recommendations",
//         icon: "brain",
//         color: "#193648",
//         bg: "#EEF3F7",
//     },
//     {
//         id: "3",
//         title: "My Applications",
//         description: "Track application status",
//         screen: "My Applications",
//         icon: "briefcase-clock",
//         color: "#193648",
//         bg: "#EEF3F7",
//     },
//     {
//         id: "4",
//         title: "Events",
//         description: "Job fairs & seminars",
//         screen: "Events",
//         icon: "calendar-star",
//         color: "#193648",
//         bg: "#EEF3F7",
//     },
// ];

// const StudentHomeScreen = () => {
//     const navigation = useNavigation<any>();
//     const [isChatOpen, setIsChatOpen] = useState(false);
//     const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
//         {
//             sender: "ai",
//             text: "Assalam o Alaikum! I'm CXbot, your CollaXion AI assistant.\n\nI can help you with:\n• Finding internships\n• CV advice\n• Application tracking\n• Events & more!\n\nAsk me anything! 🚀",
//         },
//     ]);
//     const [inputText, setInputText] = useState("");
//     const scrollRef = useRef<ScrollView>(null);
//     const [loading, setLoading] = useState(false);
//     const [studentData, setStudentData] = useState<any>(null);
//     const [statsLoading, setStatsLoading] = useState(true);
//     const [notificationCount, setNotificationCount] = useState(0);
//     const [unreadChatCount, setUnreadChatCount] = useState(0);

//     // Animations — all untouched
//     const pulseAnim = useRef(new Animated.Value(1)).current;
//     const fabGlowAnim = useRef(new Animated.Value(0)).current;
//     const headerAnim = useRef(new Animated.Value(0)).current;
//     const statsAnim = useRef(new Animated.Value(0)).current;

//     useEffect(() => {
//         Animated.loop(
//             Animated.sequence([
//                 Animated.timing(pulseAnim, { toValue: 1.1, duration: 1200, useNativeDriver: true }),
//                 Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
//             ])
//         ).start();

//         Animated.loop(
//             Animated.sequence([
//                 Animated.timing(fabGlowAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
//                 Animated.timing(fabGlowAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
//             ])
//         ).start();

//         Animated.stagger(200, [
//             Animated.spring(headerAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
//             Animated.spring(statsAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
//         ]).start();
//     }, []);

//     useFocusEffect(
//         useCallback(() => {
//             fetchStudentStats();
//             fetchNotificationCount();
//             fetchChatUnread();
//         }, [])
//     );

//     // ✅ FIX: real-time socket badge update on home screen
//     useEffect(() => {
//         const setupSocket = async () => {
//             const email = await AsyncStorage.getItem("studentEmail");
//             if (!email) return;

//             socket.connect(CONSTANT.API_BASE_URL, email);

//             const handleNewMessage = (msg: any) => {
//                 if (msg.receiverEmail === email) {
//                     setUnreadChatCount((prev) => prev + 1);
//                 }
//             };

//             socket.on("newMessage", handleNewMessage);
//             return () => socket.off("newMessage", handleNewMessage);
//         };

//         setupSocket();
//     }, []);

//     const fetchStudentStats = async () => {
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             if (!email) return;
//             const response = await axios.get(`${CONSTANT.API_BASE_URL}/api/student/getStudent/${email}`);
//             setStudentData(response.data);
//         } catch (err) {
//             console.log("Error fetching student stats:", err);
//         } finally {
//             setStatsLoading(false);
//         }
//     };

//     const fetchNotificationCount = async () => {
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             if (!email) return;
//             const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/notifications/unread/${email}`);
//             setNotificationCount(res.data.count || 0);
//         } catch (err) {
//             console.log("Notif count error:", err);
//         }
//     };

//     const fetchChatUnread = async () => {
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             if (!email) return;
//             if (!email.toLowerCase().endsWith("@students.riphah.edu.pk") &&
//                 !email.toLowerCase().endsWith("@students.riphah.edu.pk")) return;
//             const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/chat/unread/${email}`);
//             setUnreadChatCount(res.data.count || 0);
//         } catch (err) {
//             console.log("Chat unread error:", err);
//         }
//     };

//     const getGeminiResponse = async (userQuery: string): Promise<string> => {
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             const response = await axios.post(
//                 `${CONSTANT.API_BASE_URL}/api/student-assistant/chat`,
//                 { message: userQuery || "", studentEmail: email || "" }
//             );
//             return response.data.reply || "No response from AI";
//         } catch (err: any) {
//             console.log("Gemini API Error:", err?.response?.data || err.message);
//             return "⚠️ Connection issue or server error.";
//         }
//     };

//     const sendMessage = async () => {
//         if (!inputText.trim()) return;
//         const userMessage = { sender: "user" as const, text: inputText };
//         setMessages((prev) => [...prev, userMessage]);
//         setInputText("");
//         setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
//         setLoading(true);
//         const aiText = await getGeminiResponse(userMessage.text);
//         setMessages((prev) => [...prev, { sender: "ai" as const, text: aiText }]);
//         setLoading(false);
//         setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
//     };

//     const getGreeting = () => {
//         const hour = new Date().getHours();
//         if (hour >= 20 || hour < 3) return "Good Night";
//         if (hour >= 3 && hour < 12) return "Good Morning";
//         if (hour >= 12 && hour < 17) return "Good Afternoon";
//         if (hour >= 17 && hour < 20) return "Good Evening";
//     };

//     const headerTranslateY = headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] });
//     const statsTranslateY = statsAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] });

//     return (
//         <View style={{ flex: 1, backgroundColor: "#F0F4F8" }}>
//             <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>

//                 {/* ── Hero Header ── */}
//                 <Animated.View style={[styles.heroSection, { opacity: headerAnim, transform: [{ translateY: headerTranslateY }] }]}>
//                     <View style={styles.heroTopRow}>
//                         <View style={styles.heroContent}>
//                             <View style={styles.greetingPill}>
//                                 <View style={styles.greetingDot} />
//                                 <Text style={styles.greetingBadge}>{getGreeting()}</Text>
//                             </View>
//                             <Text style={styles.nameText}>
//                                 {studentData?.fullName?.split(" ")[0] || "Student"}
//                             </Text>
//                             <Text style={styles.heroSubText}>
//                                 Your career journey starts here. Let's find your perfect internship!
//                             </Text>
//                         </View>

//                         {/* Right: Chat icon + Notification icon (untouched logic) */}
//                         <View style={styles.heroIcons}>
//                             {/* ✅ Chat icon with real-time badge */}
//                             <TouchableOpacity
//                                 style={styles.heroIconBtn}
//                                 onPress={() => {
//                                     setUnreadChatCount(0);
//                                     navigation.navigate("ChatList");
//                                 }}
//                                 activeOpacity={0.8}
//                             >
//                                 <MaterialCommunityIcons name="chat-outline" size={22} color="#fff" />
//                                 {unreadChatCount > 0 && (
//                                     <View style={styles.iconBadge}>
//                                         <Text style={styles.iconBadgeText}>
//                                             {unreadChatCount > 9 ? "9+" : unreadChatCount}
//                                         </Text>
//                                     </View>
//                                 )}
//                             </TouchableOpacity>

                        



                         
//                         </View>
//                     </View>

//                     {/* Mini stats inside hero */}
//                     <View style={styles.heroStatsRow}>
//                         <View style={styles.heroStat}>
//                             <Text style={styles.heroStatNum}>{studentData?.extractedSkills?.length || 0}</Text>
//                             <Text style={styles.heroStatLbl}>Skills</Text>
//                         </View>
//                         <View style={styles.heroStatDivider} />
//                         <View style={styles.heroStat}>
//                             <Text style={styles.heroStatNum}>{studentData?.totalApplications || 0}</Text>
//                             <Text style={styles.heroStatLbl}>Applied</Text>
//                         </View>
//                         <View style={styles.heroStatDivider} />
//                         <View style={styles.heroStat}>
//                             <Text style={styles.heroStatNum}>{studentData?.selectedInternships || 0}</Text>
//                             <Text style={styles.heroStatLbl}>Selected</Text>
//                         </View>
//                         <View style={styles.heroStatDivider} />
//                         <View style={styles.heroStat}>
//                             <Text style={styles.heroStatNum}>{notificationCount}</Text>
//                             <Text style={styles.heroStatLbl}>Alerts</Text>
//                         </View>
//                     </View>
//                 </Animated.View>

//                 {/* ── Stats Cards ── */}
//                 <Animated.View style={[styles.statsRow, { opacity: statsAnim, transform: [{ translateY: statsTranslateY }] }]}>
//                     {statsLoading ? (
//                         <ActivityIndicator color="#193648" style={{ flex: 1, paddingVertical: 20 }} />
//                     ) : (
//                         <>
//                             <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate("Profile Settings")}>
//                                 <View style={styles.statIconBg}>
//                                     <MaterialCommunityIcons name="brain" size={20} color="#193648" />
//                                 </View>
//                                 <Text style={styles.statNum}>{studentData?.extractedSkills?.length || 0}</Text>
//                                 <Text style={styles.statLbl}>Skills</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate("My Applications")}>
//                                 <View style={styles.statIconBg}>
//                                     <MaterialCommunityIcons name="briefcase-check" size={20} color="#193648" />
//                                 </View>
//                                 <Text style={styles.statNum}>{studentData?.totalApplications || 0}</Text>
//                                 <Text style={styles.statLbl}>Applied</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate("My Applications")}>
//                                 <View style={styles.statIconBg}>
//                                     <MaterialCommunityIcons name="trophy" size={20} color="#193648" />
//                                 </View>
//                                 <Text style={styles.statNum}>{studentData?.selectedInternships || 0}</Text>
//                                 <Text style={styles.statLbl}>Selected</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate("Notifications")}>
//                                 <View style={styles.statIconBg}>
//                                     <MaterialCommunityIcons name="bell-ring" size={20} color="#193648" />
//                                 </View>
//                                 <Text style={styles.statNum}>{notificationCount}</Text>
//                                 <Text style={styles.statLbl}>Alerts</Text>
//                             </TouchableOpacity>
//                         </>
//                     )}
//                 </Animated.View>

//                 {/* ── CV Upload Alert ── */}
//                 {!studentData?.cvUrl && (
//                     <TouchableOpacity style={styles.alertBanner} onPress={() => navigation.navigate("Profile Settings")} activeOpacity={0.85}>
//                         <View style={styles.alertLeft}>
//                             <View style={styles.alertIconBg}>
//                                 <MaterialCommunityIcons name="file-upload" size={20} color="#fff" />
//                             </View>
//                             <View style={{ marginLeft: 12, flex: 1 }}>
//                                 <Text style={styles.alertTitle}>Complete Your Profile</Text>
//                                 <Text style={styles.alertSub}>Upload CV to unlock AI-powered matching ✨</Text>
//                             </View>
//                         </View>
//                         <MaterialCommunityIcons name="arrow-right" size={18} color="#193648" />
//                     </TouchableOpacity>
//                 )}

//                 {/* ── Quick Actions ── */}
//                 <View style={styles.section}>
//                     <View style={styles.sectionHeader}>
//                         <Text style={styles.sectionTitle}>Quick Actions</Text>
//                         <View style={styles.sectionAccent} />
//                     </View>
//                     <View style={styles.actionsGrid}>
//                         {quickActions.map((item) => (
//                             <TouchableOpacity
//                                 key={item.id}
//                                 style={styles.actionCard}
//                                 onPress={() => navigation.navigate(item.screen)}
//                                 activeOpacity={0.8}
//                             >
//                                 <View style={styles.actionIconBg}>
//                                     <MaterialCommunityIcons name={item.icon as any} size={26} color="#193648" />
//                                 </View>
//                                 <Text style={styles.actionTitle}>{item.title}</Text>
//                                 <Text style={styles.actionDesc}>{item.description}</Text>
//                                 <View style={styles.actionArrow}>
//                                     <MaterialCommunityIcons name="arrow-right" size={13} color="#193648" />
//                                 </View>
//                             </TouchableOpacity>
//                         ))}
//                     </View>
//                 </View>

//                 {/* ── More Features ── */}
//                 <View style={styles.section}>
//                     <View style={styles.sectionHeader}>
//                         <Text style={styles.sectionTitle}>More Features</Text>
//                         <View style={styles.sectionAccent} />
//                     </View>

//                     {[
//                         {
//                             screen: "Nearby Industries",
//                             icon: <MaterialIcons name="location-on" size={22} color="#193648" />,
//                             title: "Nearby Industries",
//                             desc: "Find companies near you on map",
//                         },
//                         {
//                             screen: "Feedback",
//                             icon: <MaterialCommunityIcons name="star-half-full" size={22} color="#193648" />,
//                             title: "Feedback & Ratings",
//                             desc: "Rate companies & share experience",
//                         },
//                         {
//                             screen: "Profile Settings",
//                             icon: <FontAwesome5 name="user-circle" size={20} color="#193648" />,
//                             title: "My Profile",
//                             desc: "Update info, skills & documents",
//                         },
//                         {
//                             screen: "Notifications",
//                             icon: (
//                                 <View>
//                                     <MaterialCommunityIcons name="bell-ring" size={22} color="#193648" />
//                                     {notificationCount > 0 && (
//                                         <View style={styles.featureBadge}>
//                                             <Text style={styles.featureBadgeText}>{notificationCount}</Text>
//                                         </View>
//                                     )}
//                                 </View>
//                             ),
//                             title: "Notifications",
//                             desc: `${notificationCount} unread alert${notificationCount !== 1 ? "s" : ""}`,
//                         },
//                         {
//                             screen: "ChatList",
//                             // ✅ logo.png with border-radius instead of chat icon
//                             icon: (
//                                 <View>
//                                     <Image
//                                         source={CX_BOT_LOGO}
//                                         style={styles.featureLogoImg}
//                                     />
//                                     {unreadChatCount > 0 && (
//                                         <View style={styles.featureBadge}>
//                                             <Text style={styles.featureBadgeText}>
//                                                 {unreadChatCount > 9 ? "9+" : unreadChatCount}
//                                             </Text>
//                                         </View>
//                                     )}
//                                 </View>
//                             ),
//                             title: "Student Chat",
//                             desc: unreadChatCount > 0
//                                 ? `${unreadChatCount} unread message${unreadChatCount !== 1 ? "s" : ""}`
//                                 : "Chat with Riphah students",
//                         },
//                     ].map((feature, idx) => (
//                         <TouchableOpacity
//                             key={idx}
//                             style={styles.featureRow}
//                             onPress={() => {
//                                 if (feature.screen === "ChatList") setUnreadChatCount(0);
//                                 navigation.navigate(feature.screen);
//                             }}
//                             activeOpacity={0.8}
//                         >
//                             <View style={styles.featureIcon}>
//                                 {feature.icon}
//                             </View>
//                             <View style={{ flex: 1 }}>
//                                 <Text style={styles.featureTitle}>{feature.title}</Text>
//                                 <Text style={styles.featureDesc}>{feature.desc}</Text>
//                             </View>
//                             <View style={styles.featureChevron}>
//                                 <MaterialCommunityIcons name="chevron-right" size={20} color="#193648" />
//                             </View>
//                         </TouchableOpacity>
//                     ))}
//                 </View>

//                 {/* ── AI Badge ── */}
//                 <TouchableOpacity style={styles.aiBadge} onPress={() => setIsChatOpen(true)} activeOpacity={0.85}>
//                     <Image source={CX_BOT_LOGO} style={styles.aiBadgeLogo} />
//                     <View style={{ flex: 1 }}>
//                         <Text style={styles.aiText}>Powered by CollaXion AI</Text>
//                         <Text style={styles.aiSubText}>Tap to chat with CXbot 🤖</Text>
//                     </View>
//                     <MaterialCommunityIcons name="chevron-right" size={20} color="rgba(255,255,255,0.6)" />
//                 </TouchableOpacity>
//             </ScrollView>

//             {/* ── CXbot FAB ── */}
//             <View style={styles.fabContainer}>
//                 <Animated.View style={[styles.fabGlow, { opacity: fabGlowAnim }]} />
//                 <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
//                     <TouchableOpacity style={styles.floatingButton} onPress={() => setIsChatOpen(true)} activeOpacity={0.9}>
//                         <Image source={CX_BOT_LOGO} style={styles.fabLogo} />
//                     </TouchableOpacity>
//                 </Animated.View>
//             </View>

//             {/* ── CXbot Chat Modal ── */}
//             <Modal visible={isChatOpen} animationType="slide" transparent>
//                 <View style={styles.modalOverlay}>
//                     <KeyboardAvoidingView
//                         behavior={Platform.OS === "ios" ? "padding" : "height"}
//                         style={styles.chatModalContainer}
//                     >
//                         <View style={styles.chatHeader}>
//                             <View style={styles.chatHeaderLeft}>
//                                 <View style={styles.cxbotAvatarContainer}>
//                                     <Image source={CX_BOT_LOGO} style={styles.cxbotLogo} />
//                                     <View style={styles.onlineDot} />
//                                 </View>
//                                 <View>
//                                     <Text style={styles.chatHeaderTitle}>CXbot</Text>
//                                     <Text style={styles.chatOnline}>🟢 Online • CollaXion Powered</Text>
//                                 </View>
//                             </View>
//                             <TouchableOpacity onPress={() => setIsChatOpen(false)} style={styles.closeBtn}>
//                                 <Ionicons name="close" size={20} color="#374151" />
//                             </TouchableOpacity>
//                         </View>

//                         <ScrollView
//                             ref={scrollRef}
//                             style={styles.chatMessages}
//                             contentContainerStyle={{ paddingBottom: 12 }}
//                             onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
//                             showsVerticalScrollIndicator={false}
//                         >
//                             {messages.map((msg, idx) => (
//                                 <View key={idx} style={[styles.msgRow, msg.sender === "user" ? styles.msgRowUser : styles.msgRowAi]}>
//                                     {msg.sender === "ai" && (
//                                         <Image source={CX_BOT_LOGO} style={styles.msgAvatar} />
//                                     )}
//                                     <View style={[styles.messageBubble, msg.sender === "user" ? styles.userBubble : styles.aiBubble]}>
//                                         <Text style={{ color: msg.sender === "user" ? "#fff" : "#111827", lineHeight: 21, fontSize: 14 }}>
//                                             {msg.text}
//                                         </Text>
//                                     </View>
//                                 </View>
//                             ))}
//                             {loading && (
//                                 <View style={[styles.msgRow, styles.msgRowAi]}>
//                                     <Image source={CX_BOT_LOGO} style={styles.msgAvatar} />
//                                     <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
//                                         <ActivityIndicator size="small" color="#193648" />
//                                         <Text style={{ color: "#6B7280", marginLeft: 8, fontSize: 13 }}>CXbot is thinking...</Text>
//                                     </View>
//                                 </View>
//                             )}
//                         </ScrollView>

//                         <View style={styles.chatInputContainer}>
//                             <TextInput
//                                 value={inputText}
//                                 onChangeText={setInputText}
//                                 placeholder="Ask CXbot anything..."
//                                 style={styles.chatInput}
//                                 placeholderTextColor="#9CA3AF"
//                                 onSubmitEditing={sendMessage}
//                                 returnKeyType="send"
//                                 multiline
//                             />
//                             <TouchableOpacity
//                                 onPress={sendMessage}
//                                 style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
//                                 disabled={!inputText.trim() || loading}
//                             >
//                                 <Ionicons name="send" size={18} color="#fff" />
//                             </TouchableOpacity>
//                         </View>
//                     </KeyboardAvoidingView>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     // ── Hero ──
//     heroSection: {
//         backgroundColor: "#193648",
//         paddingHorizontal: 22,
//         paddingTop: Platform.OS === "ios" ? 56 : 32,
//         paddingBottom: 26,
//         borderBottomLeftRadius: 32,
//         borderBottomRightRadius: 32,
//         marginBottom: 18,
//         shadowColor: "#193648",
//         shadowOffset: { width: 0, height: 8 },
//         shadowOpacity: 0.35,
//         shadowRadius: 16,
//         elevation: 10,
//     },
//     heroTopRow: {
//         flexDirection: "row",
//         alignItems: "flex-start",
//         marginBottom: 22,
//     },
//     heroContent: { flex: 1, paddingRight: 12 },
//     greetingPill: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "rgba(255,255,255,0.1)",
//         alignSelf: "flex-start",
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 20,
//         marginBottom: 10,
//         borderWidth: 1,
//         borderColor: "rgba(255,255,255,0.15)",
//     },
//     greetingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#34D399", marginRight: 6 },
//     greetingBadge: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: "600" },
//     nameText: { color: "#fff", fontSize: 26, fontWeight: "800", marginBottom: 6, letterSpacing: -0.5 },
//     heroSubText: { color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 19 },

//     heroIcons: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 },
//     heroIconBtn: {
//         position: "relative",
//         backgroundColor: "rgba(255,255,255,0.1)",
//         borderRadius: 22,
//         padding: 10,
//         borderWidth: 1,
//         borderColor: "rgba(255,255,255,0.15)",
//     },
//     iconBadge: {
//         position: "absolute",
//         top: 4,
//         right: 4,
//         backgroundColor: "#EF4444",
//         borderRadius: 8,
//         minWidth: 16,
//         height: 16,
//         justifyContent: "center",
//         alignItems: "center",
//         paddingHorizontal: 3,
//         borderWidth: 1.5,
//         borderColor: "#193648",
//     },
//     iconBadgeText: { color: "#fff", fontSize: 9, fontWeight: "800" },

//     heroStatsRow: {
//         flexDirection: "row",
//         backgroundColor: "rgba(255,255,255,0.08)",
//         borderRadius: 18,
//         paddingVertical: 14,
//         paddingHorizontal: 8,
//         borderWidth: 1,
//         borderColor: "rgba(255,255,255,0.1)",
//     },
//     heroStat: { flex: 1, alignItems: "center" },
//     heroStatNum: { color: "#fff", fontSize: 20, fontWeight: "800" },
//     heroStatLbl: { color: "rgba(255,255,255,0.55)", fontSize: 10, marginTop: 2, fontWeight: "500" },
//     heroStatDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.12)", marginVertical: 4 },

//     // ── Stats Cards ──
//     statsRow: {
//         flexDirection: "row",
//         marginHorizontal: 16,
//         marginBottom: 18,
//         gap: 10,
//     },
//     statCard: {
//         flex: 1,
//         borderRadius: 18,
//         paddingVertical: 16,
//         paddingHorizontal: 8,
//         alignItems: "center",
//         gap: 6,
//         backgroundColor: "#fff",
//         shadowColor: "#193648",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.07,
//         shadowRadius: 8,
//         elevation: 3,
//     },
//     statIconBg: {
//         width: 38,
//         height: 38,
//         borderRadius: 12,
//         backgroundColor: "#EEF3F7",
//         justifyContent: "center",
//         alignItems: "center",
//         marginBottom: 2,
//     },
//     statNum: { fontSize: 20, fontWeight: "800", color: "#193648" },
//     statLbl: { fontSize: 10, color: "#6B7280", fontWeight: "600" },

//     // ── Alert Banner ──
//     alertBanner: {
//         marginHorizontal: 16,
//         marginBottom: 20,
//         backgroundColor: "#fff",
//         borderRadius: 18,
//         padding: 14,
//         flexDirection: "row",
//         alignItems: "center",
//         borderLeftWidth: 4,
//         borderLeftColor: "#193648",
//         shadowColor: "#193648",
//         shadowOffset: { width: 0, height: 3 },
//         shadowOpacity: 0.1,
//         shadowRadius: 8,
//         elevation: 3,
//     },
//     alertLeft: { flex: 1, flexDirection: "row", alignItems: "center" },
//     alertIconBg: {
//         width: 40,
//         height: 40,
//         borderRadius: 12,
//         backgroundColor: "#193648",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     alertTitle: { fontSize: 14, fontWeight: "700", color: "#193648" },
//     alertSub: { fontSize: 12, color: "#6B7280", marginTop: 2 },

//     // ── Section ──
//     section: { marginHorizontal: 16, marginBottom: 22 },
//     sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
//     sectionTitle: { fontSize: 17, fontWeight: "800", color: "#111827", marginRight: 10 },
//     sectionAccent: { flex: 1, height: 1.5, backgroundColor: "#E5E7EB", borderRadius: 1 },

//     // ── Action Cards ──
//     actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
//     actionCard: {
//         width: "47%",
//         borderRadius: 20,
//         padding: 16,
//         backgroundColor: "#fff",
//         shadowColor: "#193648",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.07,
//         shadowRadius: 8,
//         elevation: 3,
//         position: "relative",
//     },
//     actionIconBg: {
//         width: 50,
//         height: 50,
//         borderRadius: 15,
//         backgroundColor: "#EEF3F7",
//         justifyContent: "center",
//         alignItems: "center",
//         marginBottom: 12,
//     },
//     actionTitle: { fontSize: 13, fontWeight: "800", color: "#193648", marginBottom: 4 },
//     actionDesc: { fontSize: 11, color: "#6B7280", lineHeight: 15 },
//     actionArrow: {
//         position: "absolute",
//         top: 14,
//         right: 14,
//         width: 24,
//         height: 24,
//         borderRadius: 8,
//         backgroundColor: "#EEF3F7",
//         justifyContent: "center",
//         alignItems: "center",
//     },

//     // ── Feature Rows ──
//     featureRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#fff",
//         borderRadius: 16,
//         padding: 15,
//         marginBottom: 10,
//         shadowColor: "#193648",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.06,
//         shadowRadius: 6,
//         elevation: 2,
//     },
//     featureIcon: {
//         width: 46,
//         height: 46,
//         borderRadius: 14,
//         backgroundColor: "#EEF3F7",
//         justifyContent: "center",
//         alignItems: "center",
//         marginRight: 14,
//     },
//     // ✅ logo image inside feature icon
//     featureLogoImg: {
//         width: 28,
//         height: 28,
//         borderRadius: 8,
//     },
//     featureTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
//     featureDesc: { fontSize: 12, color: "#6B7280", marginTop: 2 },
//     featureChevron: {
//         backgroundColor: "#EEF3F7",
//         borderRadius: 8,
//         padding: 5,
//     },
//     featureBadge: {
//         position: "absolute",
//         top: -5,
//         right: -8,
//         backgroundColor: "#EF4444",
//         borderRadius: 8,
//         minWidth: 16,
//         height: 16,
//         justifyContent: "center",
//         alignItems: "center",
//         paddingHorizontal: 3,
//     },
//     featureBadgeText: { color: "#fff", fontSize: 9, fontWeight: "800" },

//     // ── AI Badge ──
//     aiBadge: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#193648",
//         marginHorizontal: 16,
//         padding: 16,
//         borderRadius: 20,
//         marginBottom: 12,
//         shadowColor: "#193648",
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.25,
//         shadowRadius: 10,
//         elevation: 5,
//     },
//     aiBadgeLogo: {
//         width: 38,
//         height: 38,
//         borderRadius: 12,
//         marginRight: 12,
//         backgroundColor: "rgba(255,255,255,0.15)",
//     },
//     aiText: { color: "#fff", fontSize: 14, fontWeight: "700" },
//     aiSubText: { color: "rgba(255,255,255,0.55)", fontSize: 11, marginTop: 2 },

//     // ── FAB ──
//     fabContainer: {
//         position: "absolute",
//         bottom: 28,
//         right: 20,
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     fabGlow: {
//         position: "absolute",
//         width: 72,
//         height: 72,
//         borderRadius: 36,
//         backgroundColor: "#1936486e",
//         opacity: 0.3,
//     },
//     floatingButton: {
//         backgroundColor: "#fff",
//         width: 60,
//         height: 60,
//         borderRadius: 30,
//         justifyContent: "center",
//         alignItems: "center",
//         elevation: 10,
//         shadowColor: "#193648",
//         shadowOpacity: 0.5,
//         shadowRadius: 16,
//         shadowOffset: { width: 0, height: 6 },
//         overflow: "hidden",
//     },
//     fabLogo: { width: 38, height: 38, borderRadius: 10 },

//     // ── Chat Modal ──
//     modalOverlay: { flex: 1, backgroundColor: "rgb(255,255,255)" },
//     chatModalContainer: { flex: 1, backgroundColor: "#fff" },
//     chatHeader: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         paddingTop: Platform.OS === "ios" ? 50 : 20,
//         paddingHorizontal: 18,
//         paddingBottom: 14,
//         borderBottomWidth: 1,
//         borderBottomColor: "#F3F4F6",
//         backgroundColor: "#FAFAFA",
//     },
//     chatHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
//     chatHeaderTitle: { fontSize: 17, fontWeight: "800", color: "#111827" },
//     chatOnline: { fontSize: 11, color: "#059669", marginTop: 2, fontWeight: "500" },
//     cxbotAvatarContainer: { position: "relative" },
//     cxbotLogo: { width: 42, height: 42, borderRadius: 14, resizeMode: "contain" },
//     onlineDot: {
//         position: "absolute",
//         bottom: 1,
//         right: 1,
//         width: 10,
//         height: 10,
//         borderRadius: 5,
//         backgroundColor: "#10B981",
//         borderWidth: 2,
//         borderColor: "#fff",
//     },
//     closeBtn: { backgroundColor: "#F3F4F6", borderRadius: 20, padding: 8 },
//     chatMessages: { flex: 1, paddingHorizontal: 16, paddingTop: 14 },
//     msgRow: { flexDirection: "row", marginVertical: 6, alignItems: "flex-end" },
//     msgRowUser: { justifyContent: "flex-end" },
//     msgRowAi: { justifyContent: "flex-start" },
//     msgAvatar: { width: 30, height: 30, borderRadius: 10, marginRight: 8, resizeMode: "contain" },
//     messageBubble: {
//         padding: 13,
//         borderRadius: 20,
//         maxWidth: "78%",
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.06,
//         shadowRadius: 4,
//         elevation: 1,
//     },
//     userBubble: { backgroundColor: "#193648", borderBottomRightRadius: 6 },
//     aiBubble: { backgroundColor: "#F3F4F6", borderBottomLeftRadius: 6 },
//     typingBubble: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
//     chatInputContainer: {
//         flexDirection: "row",
//         padding: 14,
//         borderTopWidth: 1,
//         borderTopColor: "#F3F4F6",
//         alignItems: "flex-end",
//         gap: 10,
//         backgroundColor: "#fff",
//     },
//     chatInput: {
//         flex: 1,
//         backgroundColor: "#F9FAFB",
//         paddingHorizontal: 18,
//         paddingVertical: 11,
//         borderRadius: 25,
//         fontSize: 14,
//         color: "#111827",
//         borderWidth: 1.5,
//         borderColor: "#E5E7EB",
//         maxHeight: 100,
//     },
//     sendButton: {
//         backgroundColor: "#193648",
//         width: 44,
//         height: 44,
//         borderRadius: 22,
//         justifyContent: "center",
//         alignItems: "center",
//         shadowColor: "#193648",
//         shadowOffset: { width: 0, height: 3 },
//         shadowOpacity: 0.3,
//         shadowRadius: 6,
//         elevation: 4,
//     },
//     sendButtonDisabled: { backgroundColor: "#9CA3AF" },
// });

// export default StudentHomeScreen;










// import { CONSTANT } from "@/constants/constant";
// import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import axios from "axios";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//     ActivityIndicator,
//     Animated,
//     Image,
//     KeyboardAvoidingView,
//     Modal,
//     Platform,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import socket from "./utils/Socket";

// const CX_BOT_LOGO = require("../../assets/images/logo.png");

// const quickActions = [
//     {
//         id: "1",
//         title: "Browse Internships",
//         description: "Find & apply for internships",
//         screen: "Internships",
//         icon: "briefcase-search",
//         color: "#193648",
//         bg: "#EEF3F7",
//     },
//     {
//         id: "2",
//         title: "AI Recommendations",
//         description: "Personalized suggestions",
//         screen: "AI Recommendations",
//         icon: "brain",
//         color: "#193648",
//         bg: "#EEF3F7",
//     },
//     {
//         id: "3",
//         title: "My Applications",
//         description: "Track application status",
//         screen: "My Applications",
//         icon: "briefcase-clock",
//         color: "#193648",
//         bg: "#EEF3F7",
//     },
//     {
//         id: "4",
//         title: "Events",
//         description: "Job fairs & seminars",
//         screen: "Events",
//         icon: "calendar-star",
//         color: "#193648",
//         bg: "#EEF3F7",
//     },
// ];

// const StudentHomeScreen = () => {
//     const navigation = useNavigation<any>();
//     const [isChatOpen, setIsChatOpen] = useState(false);
//     const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
//         {
//             sender: "ai",
//             text: "Assalam o Alaikum! I'm CXbot, your CollaXion AI assistant.\n\nI can help you with:\n• Finding internships\n• CV advice\n• Application tracking\n• Events & more!\n\nAsk me anything! 🚀",
//         },
//     ]);
//     const [inputText, setInputText] = useState("");
//     const scrollRef = useRef<ScrollView>(null);
//     const [loading, setLoading] = useState(false);
//     const [studentData, setStudentData] = useState<any>(null);
//     const [statsLoading, setStatsLoading] = useState(true);
//     const [notificationCount, setNotificationCount] = useState(0);
//     const [unreadChatCount, setUnreadChatCount] = useState(0);

//     const pulseAnim = useRef(new Animated.Value(1)).current;
//     const fabGlowAnim = useRef(new Animated.Value(0)).current;
//     const headerAnim = useRef(new Animated.Value(0)).current;
//     const statsAnim = useRef(new Animated.Value(0)).current;

//     useEffect(() => {
//         Animated.loop(
//             Animated.sequence([
//                 Animated.timing(pulseAnim, { toValue: 1.1, duration: 1200, useNativeDriver: true }),
//                 Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
//             ])
//         ).start();

//         Animated.loop(
//             Animated.sequence([
//                 Animated.timing(fabGlowAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
//                 Animated.timing(fabGlowAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
//             ])
//         ).start();

//         Animated.stagger(200, [
//             Animated.spring(headerAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
//             Animated.spring(statsAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
//         ]).start();
//     }, []);

//     useFocusEffect(
//         useCallback(() => {
//             fetchStudentStats();
//             fetchNotificationCount();
//             fetchChatUnread();
//         }, [])
//     );

//     useEffect(() => {
//         const setupSocket = async () => {
//             const email = await AsyncStorage.getItem("studentEmail");
//             if (!email) return;

//             socket.connect(CONSTANT.API_BASE_URL, email);

//             const handleNewMessage = (msg: any) => {
//                 if (msg.receiverEmail === email) {
//                     setUnreadChatCount((prev) => prev + 1);
//                 }
//             };

//             socket.on("newMessage", handleNewMessage);
//             return () => socket.off("newMessage", handleNewMessage);
//         };

//         setupSocket();
//     }, []);

//     const fetchStudentStats = async () => {
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             if (!email) return;
//             const response = await axios.get(`${CONSTANT.API_BASE_URL}/api/student/getStudent/${email}`);
//             setStudentData(response.data);
//         } catch (err) {
//             console.log("Error fetching student stats:", err);
//         } finally {
//             setStatsLoading(false);
//         }
//     };

//     const fetchNotificationCount = async () => {
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             if (!email) return;
//             const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/notifications/unread/${email}`);
//             setNotificationCount(res.data.count || 0);
//         } catch (err) {
//             console.log("Notif count error:", err);
//         }
//     };

//     const fetchChatUnread = async () => {
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             if (!email) return;
//             const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/chat/unread/${email}`);
//             setUnreadChatCount(res.data.count || 0);
//         } catch (err) {
//             console.log("Chat unread error:", err);
//         }
//     };

//     const getGeminiResponse = async (userQuery: string): Promise<string> => {
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             const response = await axios.post(
//                 `${CONSTANT.API_BASE_URL}/api/student-assistant/chat`,
//                 { message: userQuery || "", studentEmail: email || "" }
//             );
//             return response.data.reply || "No response from AI";
//         } catch (err: any) {
//             console.log("Gemini API Error:", err?.response?.data || err.message);
//             return "⚠️ Connection issue or server error.";
//         }
//     };

//     const sendMessage = async () => {
//         if (!inputText.trim()) return;
//         const userMessage = { sender: "user" as const, text: inputText };
//         setMessages((prev) => [...prev, userMessage]);
//         setInputText("");
//         setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
//         setLoading(true);
//         const aiText = await getGeminiResponse(userMessage.text);
//         setMessages((prev) => [...prev, { sender: "ai" as const, text: aiText }]);
//         setLoading(false);
//         setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
//     };

//     const getGreeting = () => {
//         const hour = new Date().getHours();
//         if (hour >= 20 || hour < 3) return "Good Night";
//         if (hour >= 3 && hour < 12) return "Good Morning";
//         if (hour >= 12 && hour < 17) return "Good Afternoon";
//         if (hour >= 17 && hour < 20) return "Good Evening";
//     };

//     const headerTranslateY = headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] });
//     const statsTranslateY = statsAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] });

//     return (
//         <View style={{ flex: 1, backgroundColor: "#F0F4F8" }}>
//             <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>

//                 {/* ── Hero Header ── */}
//                 <Animated.View style={[styles.heroSection, { opacity: headerAnim, transform: [{ translateY: headerTranslateY }] }]}>
//                     <View style={styles.heroTopRow}>
//                         <View style={styles.heroContent}>
//                             <View style={styles.greetingPill}>
//                                 <View style={styles.greetingDot} />
//                                 <Text style={styles.greetingBadge}>{getGreeting()}</Text>
//                             </View>
//                             <Text style={styles.nameText}>
//                                 {studentData?.fullName?.split(" ")[0] || "Student"}
//                             </Text>
//                             <Text style={styles.heroSubText}>
//                                 Your career journey starts here. Let's find your perfect internship!
//                             </Text>
//                         </View>

//                         {/* ✅ Right: Premium Message Pill - No longer alone */}
//                         <View style={styles.heroIcons}>
//                             <TouchableOpacity
//                                 style={styles.chatActionPill}
//                                 onPress={() => {
//                                     setUnreadChatCount(0);
//                                     navigation.navigate("ChatList");
//                                 }}
//                                 activeOpacity={0.8}
//                             >
//                                 <MaterialCommunityIcons name="chat-processing-outline" size={20} color="#fff" />
//                                 <Text style={styles.chatPillText}>Messages</Text>
//                                 {unreadChatCount > 0 && (
//                                     <View style={styles.chatBadgeModern}>
//                                         <Text style={styles.badgeTextSmall}>
//                                             {unreadChatCount > 9 ? "9+" : unreadChatCount}
//                                         </Text>
//                                     </View>
//                                 )}
//                             </TouchableOpacity>
//                         </View>
//                     </View>

//                     {/* Mini stats inside hero */}
//                     <View style={styles.heroStatsRow}>
//                         <View style={styles.heroStat}>
//                             <Text style={styles.heroStatNum}>{studentData?.extractedSkills?.length || 0}</Text>
//                             <Text style={styles.heroStatLbl}>Skills</Text>
//                         </View>
//                         <View style={styles.heroStatDivider} />
//                         <View style={styles.heroStat}>
//                             <Text style={styles.heroStatNum}>{studentData?.totalApplications || 0}</Text>
//                             <Text style={styles.heroStatLbl}>Applied</Text>
//                         </View>
//                         <View style={styles.heroStatDivider} />
//                         <View style={styles.heroStat}>
//                             <Text style={styles.heroStatNum}>{studentData?.selectedInternships || 0}</Text>
//                             <Text style={styles.heroStatLbl}>Selected</Text>
//                         </View>
//                         <View style={styles.heroStatDivider} />
//                         <View style={styles.heroStat}>
//                             <Text style={styles.heroStatNum}>{notificationCount}</Text>
//                             <Text style={styles.heroStatLbl}>Alerts</Text>
//                         </View>
//                     </View>
//                 </Animated.View>

//                 {/* ── Stats Cards ── */}
//                 <Animated.View style={[styles.statsRow, { opacity: statsAnim, transform: [{ translateY: statsTranslateY }] }]}>
//                     {statsLoading ? (
//                         <ActivityIndicator color="#193648" style={{ flex: 1, paddingVertical: 20 }} />
//                     ) : (
//                         <>
//                             <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate("Profile Settings")}>
//                                 <View style={styles.statIconBg}>
//                                     <MaterialCommunityIcons name="brain" size={20} color="#193648" />
//                                 </View>
//                                 <Text style={styles.statNum}>{studentData?.extractedSkills?.length || 0}</Text>
//                                 <Text style={styles.statLbl}>Skills</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate("My Applications")}>
//                                 <View style={styles.statIconBg}>
//                                     <MaterialCommunityIcons name="briefcase-check" size={20} color="#193648" />
//                                 </View>
//                                 <Text style={styles.statNum}>{studentData?.totalApplications || 0}</Text>
//                                 <Text style={styles.statLbl}>Applied</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate("My Applications")}>
//                                 <View style={styles.statIconBg}>
//                                     <MaterialCommunityIcons name="trophy" size={20} color="#193648" />
//                                 </View>
//                                 <Text style={styles.statNum}>{studentData?.selectedInternships || 0}</Text>
//                                 <Text style={styles.statLbl}>Selected</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate("Notifications")}>
//                                 <View style={styles.statIconBg}>
//                                     <MaterialCommunityIcons name="bell-ring" size={20} color="#193648" />
//                                 </View>
//                                 <Text style={styles.statNum}>{notificationCount}</Text>
//                                 <Text style={styles.statLbl}>Alerts</Text>
//                             </TouchableOpacity>
//                         </>
//                     )}
//                 </Animated.View>

//                 {/* ── CV Upload Alert ── */}
//                 {!studentData?.cvUrl && (
//                     <TouchableOpacity style={styles.alertBanner} onPress={() => navigation.navigate("Profile Settings")} activeOpacity={0.85}>
//                         <View style={styles.alertLeft}>
//                             <View style={styles.alertIconBg}>
//                                 <MaterialCommunityIcons name="file-upload" size={20} color="#fff" />
//                             </View>
//                             <View style={{ marginLeft: 12, flex: 1 }}>
//                                 <Text style={styles.alertTitle}>Complete Your Profile</Text>
//                                 <Text style={styles.alertSub}>Upload CV to unlock AI-powered matching ✨</Text>
//                             </View>
//                         </View>
//                         <MaterialCommunityIcons name="arrow-right" size={18} color="#193648" />
//                     </TouchableOpacity>
//                 )}

//                 {/* ── Quick Actions ── */}
//                 <View style={styles.section}>
//                     <View style={styles.sectionHeader}>
//                         <Text style={styles.sectionTitle}>Quick Actions</Text>
//                         <View style={styles.sectionAccent} />
//                     </View>
//                     <View style={styles.actionsGrid}>
//                         {quickActions.map((item) => (
//                             <TouchableOpacity
//                                 key={item.id}
//                                 style={styles.actionCard}
//                                 onPress={() => navigation.navigate(item.screen)}
//                                 activeOpacity={0.8}
//                             >
//                                 <View style={styles.actionIconBg}>
//                                     <MaterialCommunityIcons name={item.icon as any} size={26} color="#193648" />
//                                 </View>
//                                 <Text style={styles.actionTitle}>{item.title}</Text>
//                                 <Text style={styles.actionDesc}>{item.description}</Text>
//                                 <View style={styles.actionArrow}>
//                                     <MaterialCommunityIcons name="arrow-right" size={13} color="#193648" />
//                                 </View>
//                             </TouchableOpacity>
//                         ))}
//                     </View>
//                 </View>

//                 {/* ── More Features ── */}
//                 <View style={styles.section}>
//                     <View style={styles.sectionHeader}>
//                         <Text style={styles.sectionTitle}>More Features</Text>
//                         <View style={styles.sectionAccent} />
//                     </View>

//                     {[
//                         {
//                             screen: "Nearby Industries",
//                             icon: <MaterialIcons name="location-on" size={22} color="#193648" />,
//                             title: "Nearby Industries",
//                             desc: "Find companies near you on map",
//                         },
//                         {
//                             screen: "Feedback",
//                             icon: <MaterialCommunityIcons name="star-half-full" size={22} color="#193648" />,
//                             title: "Feedback & Ratings",
//                             desc: "Rate companies & share experience",
//                         },
//                         {
//                             screen: "Profile Settings",
//                             icon: <FontAwesome5 name="user-circle" size={20} color="#193648" />,
//                             title: "My Profile",
//                             desc: "Update info, skills & documents",
//                         },
//                         {
//                             screen: "Notifications",
//                             icon: (
//                                 <View>
//                                     <MaterialCommunityIcons name="bell-ring" size={22} color="#193648" />
//                                     {notificationCount > 0 && (
//                                         <View style={styles.featureBadge}>
//                                             <Text style={styles.featureBadgeText}>{notificationCount}</Text>
//                                         </View>
//                                     )}
//                                 </View>
//                             ),
//                             title: "Notifications",
//                             desc: `${notificationCount} unread alert${notificationCount !== 1 ? "s" : ""}`,
//                         },
//                         {
//                             screen: "ChatList",
//                             icon: (
//                                 <View>
//                                     <Image source={CX_BOT_LOGO} style={styles.featureLogoImg} />
//                                     {unreadChatCount > 0 && (
//                                         <View style={styles.featureBadge}>
//                                             <Text style={styles.featureBadgeText}>
//                                                 {unreadChatCount > 9 ? "9+" : unreadChatCount}
//                                             </Text>
//                                         </View>
//                                     )}
//                                 </View>
//                             ),
//                             title: "Student Chat",
//                             desc: unreadChatCount > 0
//                                 ? `${unreadChatCount} unread message${unreadChatCount !== 1 ? "s" : ""}`
//                                 : "Chat with Riphah students",
//                         },
//                     ].map((feature, idx) => (
//                         <TouchableOpacity
//                             key={idx}
//                             style={styles.featureRow}
//                             onPress={() => {
//                                 if (feature.screen === "ChatList") setUnreadChatCount(0);
//                                 navigation.navigate(feature.screen);
//                             }}
//                             activeOpacity={0.8}
//                         >
//                             <View style={styles.featureIcon}>
//                                 {feature.icon}
//                             </View>
//                             <View style={{ flex: 1 }}>
//                                 <Text style={styles.featureTitle}>{feature.title}</Text>
//                                 <Text style={styles.featureDesc}>{feature.desc}</Text>
//                             </View>
//                             <View style={styles.featureChevron}>
//                                 <MaterialCommunityIcons name="chevron-right" size={20} color="#193648" />
//                             </View>
//                         </TouchableOpacity>
//                     ))}
//                 </View>

//                 {/* ── AI Badge ── */}
//                 <TouchableOpacity style={styles.aiBadge} onPress={() => setIsChatOpen(true)} activeOpacity={0.85}>
//                     <Image source={CX_BOT_LOGO} style={styles.aiBadgeLogo} />
//                     <View style={{ flex: 1 }}>
//                         <Text style={styles.aiText}>Powered by CollaXion AI</Text>
//                         <Text style={styles.aiSubText}>Tap to chat with CXbot 🤖</Text>
//                     </View>
//                     <MaterialCommunityIcons name="chevron-right" size={20} color="rgba(255,255,255,0.6)" />
//                 </TouchableOpacity>
//             </ScrollView>

//             {/* ── CXbot FAB ── */}
//             <View style={styles.fabContainer}>
//                 <Animated.View style={[styles.fabGlow, { opacity: fabGlowAnim }]} />
//                 <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
//                     <TouchableOpacity style={styles.floatingButton} onPress={() => setIsChatOpen(true)} activeOpacity={0.9}>
//                         <Image source={CX_BOT_LOGO} style={styles.fabLogo} />
//                     </TouchableOpacity>
//                 </Animated.View>
//             </View>

//             {/* ── CXbot Chat Modal ── */}
//             <Modal visible={isChatOpen} animationType="slide" transparent>
//                 <View style={styles.modalOverlay}>
//                     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.chatModalContainer}>
//                         <View style={styles.chatHeader}>
//                             <View style={styles.chatHeaderLeft}>
//                                 <View style={styles.cxbotAvatarContainer}>
//                                     <Image source={CX_BOT_LOGO} style={styles.cxbotLogo} />
//                                     <View style={styles.onlineDot} />
//                                 </View>
//                                 <View>
//                                     <Text style={styles.chatHeaderTitle}>CXbot</Text>
//                                     <Text style={styles.chatOnline}>🟢 Online • CollaXion Powered</Text>
//                                 </View>
//                             </View>
//                             <TouchableOpacity onPress={() => setIsChatOpen(false)} style={styles.closeBtn}>
//                                 <Ionicons name="close" size={20} color="#374151" />
//                             </TouchableOpacity>
//                         </View>
//                         <ScrollView
//                             ref={scrollRef}
//                             style={styles.chatMessages}
//                             contentContainerStyle={{ paddingBottom: 12 }}
//                             onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
//                             showsVerticalScrollIndicator={false}
//                         >
//                             {messages.map((msg, idx) => (
//                                 <View key={idx} style={[styles.msgRow, msg.sender === "user" ? styles.msgRowUser : styles.msgRowAi]}>
//                                     {msg.sender === "ai" && <Image source={CX_BOT_LOGO} style={styles.msgAvatar} />}
//                                     <View style={[styles.messageBubble, msg.sender === "user" ? styles.userBubble : styles.aiBubble]}>
//                                         <Text style={{ color: msg.sender === "user" ? "#fff" : "#111827", lineHeight: 21, fontSize: 14 }}>
//                                             {msg.text}
//                                         </Text>
//                                     </View>
//                                 </View>
//                             ))}
//                             {loading && (
//                                 <View style={[styles.msgRow, styles.msgRowAi]}>
//                                     <Image source={CX_BOT_LOGO} style={styles.msgAvatar} />
//                                     <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
//                                         <ActivityIndicator size="small" color="#193648" />
//                                         <Text style={{ color: "#6B7280", marginLeft: 8, fontSize: 13 }}>CXbot is thinking...</Text>
//                                     </View>
//                                 </View>
//                             )}
//                         </ScrollView>
//                         <View style={styles.chatInputContainer}>
//                             <TextInput
//                                 value={inputText}
//                                 onChangeText={setInputText}
//                                 placeholder="Ask CXbot anything..."
//                                 style={styles.chatInput}
//                                 placeholderTextColor="#9CA3AF"
//                                 onSubmitEditing={sendMessage}
//                                 returnKeyType="send"
//                                 multiline
//                             />
//                             <TouchableOpacity
//                                 onPress={sendMessage}
//                                 style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
//                                 disabled={!inputText.trim() || loading}
//                             >
//                                 <Ionicons name="send" size={18} color="#fff" />
//                             </TouchableOpacity>
//                         </View>
//                     </KeyboardAvoidingView>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     heroSection: {
//         backgroundColor: "#193648",
//         paddingHorizontal: 22,
//         paddingTop: Platform.OS === "ios" ? 56 : 32,
//         paddingBottom: 26,
//         borderBottomLeftRadius: 32,
//         borderBottomRightRadius: 32,
//         marginBottom: 18,
//         shadowColor: "#193648",
//         shadowOffset: { width: 0, height: 8 },
//         shadowOpacity: 0.35,
//         shadowRadius: 16,
//         elevation: 10,
//     },
//     heroTopRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 22 },
//     heroContent: { flex: 1, paddingRight: 12 },
//     greetingPill: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "rgba(255,255,255,0.1)",
//         alignSelf: "flex-start",
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 20,
//         marginBottom: 10,
//         borderWidth: 1,
//         borderColor: "rgba(255,255,255,0.15)",
//     },
//     greetingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#34D399", marginRight: 6 },
//     greetingBadge: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: "600" },
//     nameText: { color: "#fff", fontSize: 26, fontWeight: "800", marginBottom: 6, letterSpacing: -0.5 },
//     heroSubText: { color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 19 },

//     // ✅ New Premium Chat Pill Styles
//     heroIcons: { flexDirection: "row", alignItems: "center", marginTop: 4 },
//     chatActionPill: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "rgba(255,255,255,0.12)",
//         paddingVertical: 8,
//         paddingHorizontal: 14,
//         borderRadius: 20,
//         borderWidth: 1,
//         borderColor: "rgba(255,255,255,0.2)",
//     },
//     chatPillText: {
//         color: "#fff",
//         fontSize: 13,
//         fontWeight: "700",
//         marginLeft: 8,
//     },
//     chatBadgeModern: {
//         backgroundColor: "#EF4444",
//         minWidth: 18,
//         height: 18,
//         borderRadius: 9,
//         justifyContent: "center",
//         alignItems: "center",
//         marginLeft: 8,
//         paddingHorizontal: 4,
//         borderWidth: 1.5,
//         borderColor: "#193648",
//     },
//     badgeTextSmall: { color: "#fff", fontSize: 9, fontWeight: "900" },

//     heroStatsRow: {
//         flexDirection: "row",
//         backgroundColor: "rgba(255,255,255,0.08)",
//         borderRadius: 18,
//         paddingVertical: 14,
//         paddingHorizontal: 8,
//         borderWidth: 1,
//         borderColor: "rgba(255,255,255,0.1)",
//     },
//     heroStat: { flex: 1, alignItems: "center" },
//     heroStatNum: { color: "#fff", fontSize: 20, fontWeight: "800" },
//     heroStatLbl: { color: "rgba(255,255,255,0.55)", fontSize: 10, marginTop: 2, fontWeight: "500" },
//     heroStatDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.12)", marginVertical: 4 },

//     statsRow: { flexDirection: "row", marginHorizontal: 16, marginBottom: 18, gap: 10 },
//     statCard: {
//         flex: 1,
//         borderRadius: 18,
//         paddingVertical: 16,
//         paddingHorizontal: 8,
//         alignItems: "center",
//         gap: 6,
//         backgroundColor: "#fff",
//         shadowColor: "#193648",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.07,
//         shadowRadius: 8,
//         elevation: 3,
//     },
//     statIconBg: {
//         width: 38,
//         height: 38,
//         borderRadius: 12,
//         backgroundColor: "#EEF3F7",
//         justifyContent: "center",
//         alignItems: "center",
//         marginBottom: 2,
//     },
//     statNum: { fontSize: 20, fontWeight: "800", color: "#193648" },
//     statLbl: { fontSize: 10, color: "#6B7280", fontWeight: "600" },

//     alertBanner: {
//         marginHorizontal: 16,
//         marginBottom: 20,
//         backgroundColor: "#fff",
//         borderRadius: 18,
//         padding: 14,
//         flexDirection: "row",
//         alignItems: "center",
//         borderLeftWidth: 4,
//         borderLeftColor: "#193648",
//         shadowColor: "#193648",
//         shadowOffset: { width: 0, height: 3 },
//         shadowOpacity: 0.1,
//         shadowRadius: 8,
//         elevation: 3,
//     },
//     alertLeft: { flex: 1, flexDirection: "row", alignItems: "center" },
//     alertIconBg: {
//         width: 40,
//         height: 40,
//         borderRadius: 12,
//         backgroundColor: "#193648",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     alertTitle: { fontSize: 14, fontWeight: "700", color: "#193648" },
//     alertSub: { fontSize: 12, color: "#6B7280", marginTop: 2 },

//     section: { marginHorizontal: 16, marginBottom: 22 },
//     sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
//     sectionTitle: { fontSize: 17, fontWeight: "800", color: "#111827", marginRight: 10 },
//     sectionAccent: { flex: 1, height: 1.5, backgroundColor: "#E5E7EB", borderRadius: 1 },

//     actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
//     actionCard: {
//         width: "47%",
//         borderRadius: 20,
//         padding: 16,
//         backgroundColor: "#fff",
//         shadowColor: "#193648",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.07,
//         shadowRadius: 8,
//         elevation: 3,
//         position: "relative",
//     },
//     actionIconBg: {
//         width: 50,
//         height: 50,
//         borderRadius: 15,
//         backgroundColor: "#EEF3F7",
//         justifyContent: "center",
//         alignItems: "center",
//         marginBottom: 12,
//     },
//     actionTitle: { fontSize: 13, fontWeight: "800", color: "#193648", marginBottom: 4 },
//     actionDesc: { fontSize: 11, color: "#6B7280", lineHeight: 15 },
//     actionArrow: {
//         position: "absolute",
//         top: 14,
//         right: 14,
//         width: 24,
//         height: 24,
//         borderRadius: 8,
//         backgroundColor: "#EEF3F7",
//         justifyContent: "center",
//         alignItems: "center",
//     },

//     featureRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#fff",
//         borderRadius: 16,
//         padding: 15,
//         marginBottom: 10,
//         shadowColor: "#193648",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.06,
//         shadowRadius: 6,
//         elevation: 2,
//     },
//     featureIcon: {
//         width: 46,
//         height: 46,
//         borderRadius: 14,
//         backgroundColor: "#EEF3F7",
//         justifyContent: "center",
//         alignItems: "center",
//         marginRight: 14,
//     },
//     featureLogoImg: { width: 28, height: 28, borderRadius: 8 },
//     featureTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
//     featureDesc: { fontSize: 12, color: "#6B7280", marginTop: 2 },
//     featureChevron: { backgroundColor: "#EEF3F7", borderRadius: 8, padding: 5 },
//     featureBadge: {
//         position: "absolute",
//         top: -5,
//         right: -8,
//         backgroundColor: "#EF4444",
//         borderRadius: 8,
//         minWidth: 16,
//         height: 16,
//         justifyContent: "center",
//         alignItems: "center",
//         paddingHorizontal: 3,
//     },
//     featureBadgeText: { color: "#fff", fontSize: 9, fontWeight: "800" },

//     aiBadge: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#193648",
//         marginHorizontal: 16,
//         padding: 16,
//         borderRadius: 20,
//         marginBottom: 12,
//         shadowColor: "#193648",
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.25,
//         shadowRadius: 10,
//         elevation: 5,
//     },
//     aiBadgeLogo: {
//         width: 38,
//         height: 38,
//         borderRadius: 12,
//         marginRight: 12,
//         backgroundColor: "rgba(255,255,255,0.15)",
//     },
//     aiText: { color: "#fff", fontSize: 14, fontWeight: "700" },
//     aiSubText: { color: "rgba(255,255,255,0.55)", fontSize: 11, marginTop: 2 },

//     fabContainer: { position: "absolute", bottom: 28, right: 20, alignItems: "center", justifyContent: "center" },
//     fabGlow: { position: "absolute", width: 72, height: 72, borderRadius: 36, backgroundColor: "#1936486e", opacity: 0.3 },
//     floatingButton: {
//         backgroundColor: "#fff",
//         width: 60,
//         height: 60,
//         borderRadius: 30,
//         justifyContent: "center",
//         alignItems: "center",
//         elevation: 10,
//         shadowColor: "#193648",
//         shadowOpacity: 0.5,
//         shadowRadius: 16,
//         shadowOffset: { width: 0, height: 6 },
//         overflow: "hidden",
//     },
//     fabLogo: { width: 38, height: 38, borderRadius: 10 },

//     modalOverlay: { flex: 1, backgroundColor: "rgb(255,255,255)" },
//     chatModalContainer: { flex: 1, backgroundColor: "#fff" },
//     chatHeader: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         paddingTop: Platform.OS === "ios" ? 50 : 20,
//         paddingHorizontal: 18,
//         paddingBottom: 14,
//         borderBottomWidth: 1,
//         borderBottomColor: "#F3F4F6",
//         backgroundColor: "#FAFAFA",
//     },
//     chatHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
//     chatHeaderTitle: { fontSize: 17, fontWeight: "800", color: "#111827" },
//     chatOnline: { fontSize: 11, color: "#059669", marginTop: 2, fontWeight: "500" },
//     cxbotAvatarContainer: { position: "relative" },
//     cxbotLogo: { width: 42, height: 42, borderRadius: 14, resizeMode: "contain" },
//     onlineDot: {
//         position: "absolute",
//         bottom: 1,
//         right: 1,
//         width: 10,
//         height: 10,
//         borderRadius: 5,
//         backgroundColor: "#10B981",
//         borderWidth: 2,
//         borderColor: "#fff",
//     },
//     closeBtn: { backgroundColor: "#F3F4F6", borderRadius: 20, padding: 8 },
//     chatMessages: { flex: 1, paddingHorizontal: 16, paddingTop: 14 },
//     msgRow: { flexDirection: "row", marginVertical: 6, alignItems: "flex-end" },
//     msgRowUser: { justifyContent: "flex-end" },
//     msgRowAi: { justifyContent: "flex-start" },
//     msgAvatar: { width: 30, height: 30, borderRadius: 10, marginRight: 8, resizeMode: "contain" },
//     messageBubble: {
//         padding: 13,
//         borderRadius: 20,
//         maxWidth: "78%",
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.06,
//         shadowRadius: 4,
//         elevation: 1,
//     },
//     userBubble: { backgroundColor: "#193648", borderBottomRightRadius: 6 },
//     aiBubble: { backgroundColor: "#F3F4F6", borderBottomLeftRadius: 6 },
//     typingBubble: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
//     chatInputContainer: {
//         flexDirection: "row",
//         padding: 14,
//         borderTopWidth: 1,
//         borderTopColor: "#F3F4F6",
//         alignItems: "flex-end",
//         gap: 10,
//         backgroundColor: "#fff",
//     },
//     chatInput: {
//         flex: 1,
//         backgroundColor: "#F9FAFB",
//         paddingHorizontal: 18,
//         paddingVertical: 11,
//         borderRadius: 25,
//         fontSize: 14,
//         color: "#111827",
//         borderWidth: 1.5,
//         borderColor: "#E5E7EB",
//         maxHeight: 100,
//     },
//     sendButton: {
//         backgroundColor: "#193648",
//         width: 44,
//         height: 44,
//         borderRadius: 22,
//         justifyContent: "center",
//         alignItems: "center",
//         shadowColor: "#193648",
//         shadowOffset: { width: 0, height: 3 },
//         shadowOpacity: 0.3,
//         shadowRadius: 6,
//         elevation: 4,
//     },
//     sendButtonDisabled: { backgroundColor: "#9CA3AF" },
// });

// export default StudentHomeScreen;












import { CONSTANT } from "@/constants/constant";
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions,
} from "react-native";
import socket from "./utils/Socket";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CX_BOT_LOGO = require("../../assets/images/logo.png");

const quickActions = [
    {
        id: "1",
        title: "Browse Internships",
        description: "Find & apply for internships",
        screen: "Internships",
        icon: "briefcase-search",
        color: "#193648",
        bg: "#EEF3F7",
    },
    {
        id: "2",
        title: "AI Recommendations",
        description: "Personalized suggestions",
        screen: "AI Recommendations",
        icon: "brain",
        color: "#193648",
        bg: "#EEF3F7",
    },
    {
        id: "3",
        title: "My Applications",
        description: "Track application status",
        screen: "My Applications",
        icon: "briefcase-clock",
        color: "#193648",
        bg: "#EEF3F7",
    },
    {
        id: "4",
        title: "Events",
        description: "Job fairs & seminars",
        screen: "Events",
        icon: "calendar-star",
        color: "#193648",
        bg: "#EEF3F7",
    },
];

const StudentHomeScreen = () => {
    const navigation = useNavigation<any>();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
        {
            sender: "ai",
            text: "Assalam o Alaikum! I'm CXbot, your CollaXion AI assistant.\n\nI can help you with:\n• Finding internships\n• CV advice\n• Application tracking\n• Events & more!\n\nAsk me anything! 🚀",
        },
    ]);
    const [inputText, setInputText] = useState("");
    const scrollRef = useRef<ScrollView>(null);
    const [loading, setLoading] = useState(false);
    const [studentData, setStudentData] = useState<any>(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [notificationCount, setNotificationCount] = useState(0);
    const [unreadChatCount, setUnreadChatCount] = useState(0);

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const fabGlowAnim = useRef(new Animated.Value(0)).current;
    const headerAnim = useRef(new Animated.Value(0)).current;
    const statsAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.1, duration: 1200, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(fabGlowAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
                Animated.timing(fabGlowAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
            ])
        ).start();

        Animated.stagger(200, [
            Animated.spring(headerAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
            Animated.spring(statsAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
        ]).start();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchStudentStats();
            fetchNotificationCount();
            fetchChatUnread();
        }, [])
    );

    useEffect(() => {
        const setupSocket = async () => {
            const email = await AsyncStorage.getItem("studentEmail");
            if (!email) return;

            socket.connect(CONSTANT.API_BASE_URL, email);

            const handleNewMessage = (msg: any) => {
                if (msg.receiverEmail === email) {
                    setUnreadChatCount((prev) => prev + 1);
                }
            };

            socket.on("newMessage", handleNewMessage);
            return () => socket.off("newMessage", handleNewMessage);
        };

        setupSocket();
    }, []);

    const fetchStudentStats = async () => {
        try {
            const email = await AsyncStorage.getItem("studentEmail");
            if (!email) return;
            const response = await axios.get(`${CONSTANT.API_BASE_URL}/api/student/getStudent/${email}`);
            setStudentData(response.data);
        } catch (err) {
            console.log("Error fetching student stats:", err);
        } finally {
            setStatsLoading(false);
        }
    };

    const fetchNotificationCount = async () => {
        try {
            const email = await AsyncStorage.getItem("studentEmail");
            if (!email) return;
            const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/notifications/unread/${email}`);
            setNotificationCount(res.data.count || 0);
        } catch (err) {
            console.log("Notif count error:", err);
        }
    };

    const fetchChatUnread = async () => {
        try {
            const email = await AsyncStorage.getItem("studentEmail");
            if (!email) return;
            const res = await axios.get(`${CONSTANT.API_BASE_URL}/api/chat/unread/${email}`);
            setUnreadChatCount(res.data.count || 0);
        } catch (err) {
            console.log("Chat unread error:", err);
        }
    };

    const getGeminiResponse = async (userQuery: string): Promise<string> => {
        try {
            const email = await AsyncStorage.getItem("studentEmail");
            const response = await axios.post(
                `${CONSTANT.API_BASE_URL}/api/student-assistant/chat`,
                { message: userQuery || "", studentEmail: email || "" }
            );
            return response.data.reply || "No response from AI";
        } catch (err: any) {
            console.log("Gemini API Error:", err?.response?.data || err.message);
            return "⚠️ Connection issue or server error.";
        }
    };

    const sendMessage = async () => {
        if (!inputText.trim()) return;
        const userMessage = { sender: "user" as const, text: inputText };
        setMessages((prev) => [...prev, userMessage]);
        setInputText("");
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
        setLoading(true);
        const aiText = await getGeminiResponse(userMessage.text);
        setMessages((prev) => [...prev, { sender: "ai" as const, text: aiText }]);
        setLoading(false);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 20 || hour < 3) return "Good Night";
        if (hour >= 3 && hour < 12) return "Good Morning";
        if (hour >= 12 && hour < 17) return "Good Afternoon";
        if (hour >= 17 && hour < 20) return "Good Evening";
    };

    const headerTranslateY = headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] });
    const statsTranslateY = statsAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] });

    return (
        <View style={{ flex: 1, backgroundColor: "#F0F4F8" }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>

                {/* ── Hero Header ── */}
                <Animated.View style={[styles.heroSection, { opacity: headerAnim, transform: [{ translateY: headerTranslateY }] }]}>
                    <View style={styles.heroTopRow}>
                        <View style={styles.heroContent}>
                            <View style={styles.greetingPill}>
                                <View style={styles.greetingDot} />
                                <Text style={styles.greetingBadge}>{getGreeting()}</Text>
                            </View>
                            <Text style={styles.nameText} numberOfLines={1}>
                                {studentData?.fullName?.split(" ")[0] || "Student"}
                            </Text>
                            <Text style={styles.heroSubText}>
                                Your career journey starts here. Let's find your perfect internship!
                            </Text>
                        </View>

                        <View style={styles.heroIcons}>
                            <TouchableOpacity
                                style={styles.chatActionPill}
                                onPress={() => {
                                    setUnreadChatCount(0);
                                    navigation.navigate("ChatList");
                                }}
                                activeOpacity={0.8}
                            >
                                <MaterialCommunityIcons name="chat-processing-outline" size={SCREEN_WIDTH * 0.05} color="#fff" />
                                <Text style={styles.chatPillText}>Messages</Text>
                                {unreadChatCount > 0 && (
                                    <View style={styles.chatBadgeModern}>
                                        <Text style={styles.badgeTextSmall}>
                                            {unreadChatCount > 9 ? "9+" : unreadChatCount}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Mini stats inside hero */}
                    <View style={styles.heroStatsRow}>
                        {[
                            { label: "Skills", val: studentData?.extractedSkills?.length || 0 },
                            { label: "Applied", val: studentData?.totalApplications || 0 },
                            { label: "Selected", val: studentData?.selectedInternships || 0 },
                            { label: "Alerts", val: notificationCount }
                        ].map((stat, i, arr) => (
                            <React.Fragment key={i}>
                                <View style={styles.heroStat}>
                                    <Text style={styles.heroStatNum}>{stat.val}</Text>
                                    <Text style={styles.heroStatLbl}>{stat.label}</Text>
                                </View>
                                {i < arr.length - 1 && <View style={styles.heroStatDivider} />}
                            </React.Fragment>
                        ))}
                    </View>
                </Animated.View>

                {/* ── Stats Cards ── */}
                <Animated.View style={[styles.statsRow, { opacity: statsAnim, transform: [{ translateY: statsTranslateY }] }]}>
                    {statsLoading ? (
                        <ActivityIndicator color="#193648" style={{ flex: 1, paddingVertical: 20 }} />
                    ) : (
                        <View style={styles.statsGrid}>
                            <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate("Profile Settings")}>
                                <View style={styles.statIconBg}><MaterialCommunityIcons name="brain" size={18} color="#193648" /></View>
                                <Text style={styles.statNum}>{studentData?.extractedSkills?.length || 0}</Text>
                                <Text style={styles.statLbl}>Skills</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate("My Applications")}>
                                <View style={styles.statIconBg}><MaterialCommunityIcons name="briefcase-check" size={18} color="#193648" /></View>
                                <Text style={styles.statNum}>{studentData?.totalApplications || 0}</Text>
                                <Text style={styles.statLbl}>Applied</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate("My Applications")}>
                                <View style={styles.statIconBg}><MaterialCommunityIcons name="trophy" size={18} color="#193648" /></View>
                                <Text style={styles.statNum}>{studentData?.selectedInternships || 0}</Text>
                                <Text style={styles.statLbl}>Selected</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate("Notifications")}>
                                <View style={styles.statIconBg}><MaterialCommunityIcons name="bell-ring" size={18} color="#193648" /></View>
                                <Text style={styles.statNum}>{notificationCount}</Text>
                                <Text style={styles.statLbl}>Alerts</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>

                {/* ── CV Upload Alert ── */}
                {!studentData?.cvUrl && (
                    <TouchableOpacity style={styles.alertBanner} onPress={() => navigation.navigate("Profile Settings")} activeOpacity={0.85}>
                        <View style={styles.alertLeft}>
                            <View style={styles.alertIconBg}>
                                <MaterialCommunityIcons name="file-upload" size={20} color="#fff" />
                            </View>
                            <View style={{ marginLeft: 12, flex: 1 }}>
                                <Text style={styles.alertTitle}>Complete Your Profile</Text>
                                <Text style={styles.alertSub}>Upload CV to unlock AI-powered matching ✨</Text>
                            </View>
                        </View>
                        <MaterialCommunityIcons name="arrow-right" size={18} color="#193648" />
                    </TouchableOpacity>
                )}

                {/* ── Quick Actions ── */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                        <View style={styles.sectionAccent} />
                    </View>
                    <View style={styles.actionsGrid}>
                        {quickActions.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.actionCard}
                                onPress={() => navigation.navigate(item.screen)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.actionIconBg}>
                                    <MaterialCommunityIcons name={item.icon as any} size={24} color="#193648" />
                                </View>
                                <Text style={styles.actionTitle} numberOfLines={1}>{item.title}</Text>
                                <Text style={styles.actionDesc} numberOfLines={2}>{item.description}</Text>
                                <View style={styles.actionArrow}>
                                    <MaterialCommunityIcons name="arrow-right" size={12} color="#193648" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* ── More Features ── */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>More Features</Text>
                        <View style={styles.sectionAccent} />
                    </View>

                    {[
                        {
                            screen: "Nearby Industries",
                            icon: <MaterialIcons name="location-on" size={22} color="#193648" />,
                            title: "Nearby Industries",
                            desc: "Find companies near you on map",
                        },
                        {
                            screen: "Feedback",
                            icon: <MaterialCommunityIcons name="star-half-full" size={22} color="#193648" />,
                            title: "Feedback & Ratings",
                            desc: "Rate companies & share experience",
                        },
                        {
                            screen: "Profile Settings",
                            icon: <FontAwesome5 name="user-circle" size={20} color="#193648" />,
                            title: "My Profile",
                            desc: "Update info, skills & documents",
                        },
                        {
                            screen: "Notifications",
                            icon: (
                                <View>
                                    <MaterialCommunityIcons name="bell-ring" size={22} color="#193648" />
                                    {notificationCount > 0 && (
                                        <View style={styles.featureBadge}>
                                            <Text style={styles.featureBadgeText}>{notificationCount}</Text>
                                        </View>
                                    )}
                                </View>
                            ),
                            title: "Notifications",
                            desc: `${notificationCount} unread alert${notificationCount !== 1 ? "s" : ""}`,
                        },
                        {
                            screen: "ChatList",
                            icon: (
                                <View>
                                    <Image source={CX_BOT_LOGO} style={styles.featureLogoImg} />
                                    {unreadChatCount > 0 && (
                                        <View style={styles.featureBadge}>
                                            <Text style={styles.featureBadgeText}>
                                                {unreadChatCount > 9 ? "9+" : unreadChatCount}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            ),
                            title: "Student Chat",
                            desc: unreadChatCount > 0
                                ? `${unreadChatCount} unread message${unreadChatCount !== 1 ? "s" : ""}`
                                : "Chat with Riphah students",
                        },
                    ].map((feature, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={styles.featureRow}
                            onPress={() => {
                                if (feature.screen === "ChatList") setUnreadChatCount(0);
                                navigation.navigate(feature.screen);
                            }}
                            activeOpacity={0.8}
                        >
                            <View style={styles.featureIcon}>{feature.icon}</View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                <Text style={styles.featureDesc} numberOfLines={1}>{feature.desc}</Text>
                            </View>
                            <View style={styles.featureChevron}>
                                <MaterialCommunityIcons name="chevron-right" size={20} color="#193648" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ── AI Badge ── */}
                <TouchableOpacity style={styles.aiBadge} onPress={() => setIsChatOpen(true)} activeOpacity={0.85}>
                    <Image source={CX_BOT_LOGO} style={styles.aiBadgeLogo} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.aiText}>Powered by CollaXion AI</Text>
                        <Text style={styles.aiSubText}>Tap to chat with CXbot 🤖</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="rgba(255,255,255,0.6)" />
                </TouchableOpacity>
            </ScrollView>

            {/* ── CXbot FAB ── */}
            <View style={styles.fabContainer}>
                <Animated.View style={[styles.fabGlow, { opacity: fabGlowAnim }]} />
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <TouchableOpacity style={styles.floatingButton} onPress={() => setIsChatOpen(true)} activeOpacity={0.9}>
                        <Image source={CX_BOT_LOGO} style={styles.fabLogo} />
                    </TouchableOpacity>
                </Animated.View>
            </View>

            {/* ── CXbot Chat Modal ── */}
            <Modal visible={isChatOpen} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.chatModalContainer}>
                        <View style={styles.chatHeader}>
                            <View style={styles.chatHeaderLeft}>
                                <View style={styles.cxbotAvatarContainer}>
                                    <Image source={CX_BOT_LOGO} style={styles.cxbotLogo} />
                                    <View style={styles.onlineDot} />
                                </View>
                                <View>
                                    <Text style={styles.chatHeaderTitle}>CXbot</Text>
                                    <Text style={styles.chatOnline}>🟢 Online • CollaXion AI</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => setIsChatOpen(false)} style={styles.closeBtn}>
                                <Ionicons name="close" size={22} color="#374151" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            ref={scrollRef}
                            style={styles.chatMessages}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            showsVerticalScrollIndicator={false}
                        >
                            {messages.map((msg, idx) => (
                                <View key={idx} style={[styles.msgRow, msg.sender === "user" ? styles.msgRowUser : styles.msgRowAi]}>
                                    {msg.sender === "ai" && <Image source={CX_BOT_LOGO} style={styles.msgAvatar} />}
                                    <View style={[styles.messageBubble, msg.sender === "user" ? styles.userBubble : styles.aiBubble]}>
                                        <Text style={{ color: msg.sender === "user" ? "#fff" : "#111827", lineHeight: 20, fontSize: 14 }}>
                                            {msg.text}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                            {loading && (
                                <View style={[styles.msgRow, styles.msgRowAi]}>
                                    <Image source={CX_BOT_LOGO} style={styles.msgAvatar} />
                                    <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
                                        <ActivityIndicator size="small" color="#193648" />
                                        <Text style={{ color: "#6B7280", marginLeft: 8, fontSize: 13 }}>Thinking...</Text>
                                    </View>
                                </View>
                            )}
                        </ScrollView>
                        <View style={styles.chatInputContainer}>
                            <TextInput
                                value={inputText}
                                onChangeText={setInputText}
                                placeholder="Ask me anything..."
                                style={styles.chatInput}
                                placeholderTextColor="#9CA3AF"
                                multiline
                            />
                            <TouchableOpacity
                                onPress={sendMessage}
                                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                                disabled={!inputText.trim() || loading}
                            >
                                <Ionicons name="send" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    heroSection: {
        backgroundColor: "#193648",
        paddingHorizontal: SCREEN_WIDTH * 0.05,
        paddingTop: Platform.OS === "ios" ? 60 : 40,
        paddingBottom: 25,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 15,
        elevation: 10,
        shadowColor: "#193648",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    heroTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
    heroContent: { flex: 1, paddingRight: 10 },
    greetingPill: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.1)",
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: 8,
    },
    greetingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#34D399", marginRight: 6 },
    greetingBadge: { color: "rgba(255,255,255,0.9)", fontSize: 11, fontWeight: "600" },
    nameText: { color: "#fff", fontSize: SCREEN_WIDTH * 0.065, fontWeight: "800", marginBottom: 4 },
    heroSubText: { color: "rgba(255,255,255,0.6)", fontSize: 12, lineHeight: 18 },

    heroIcons: { flexDirection: "row", alignItems: "center" },
    chatActionPill: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.15)",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
    },
    chatPillText: { color: "#fff", fontSize: 12, fontWeight: "700", marginLeft: 6 },
    chatBadgeModern: {
        backgroundColor: "#EF4444",
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 6,
        borderWidth: 1.5,
        borderColor: "#193648",
    },
    badgeTextSmall: { color: "#fff", fontSize: 9, fontWeight: "900" },

    heroStatsRow: {
        flexDirection: "row",
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    heroStat: { flex: 1, alignItems: "center" },
    heroStatNum: { color: "#fff", fontSize: 18, fontWeight: "800" },
    heroStatLbl: { color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 2 },
    heroStatDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.1)", height: "70%", alignSelf: 'center' },

    statsRow: { marginHorizontal: 16, marginBottom: 20 },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
    statCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 18,
        paddingVertical: 12,
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    statIconBg: { width: 32, height: 32, borderRadius: 10, backgroundColor: "#EEF3F7", justifyContent: "center", alignItems: "center", marginBottom: 6 },
    statNum: { fontSize: 16, fontWeight: "800", color: "#193648" },
    statLbl: { fontSize: 9, color: "#6B7280", fontWeight: "600", textTransform: 'uppercase' },

    alertBanner: {
        marginHorizontal: 16,
        marginBottom: 20,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        borderLeftWidth: 4,
        borderLeftColor: "#193648",
        elevation: 2,
    },
    alertLeft: { flex: 1, flexDirection: "row", alignItems: "center" },
    alertIconBg: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#193648", justifyContent: "center", alignItems: "center" },
    alertTitle: { fontSize: 14, fontWeight: "700", color: "#193648" },
    alertSub: { fontSize: 11, color: "#6B7280", marginTop: 2 },

    section: { marginHorizontal: 16, marginBottom: 25 },
    sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
    sectionTitle: { fontSize: 16, fontWeight: "800", color: "#111827", marginRight: 10 },
    sectionAccent: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },

    actionsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: 'space-between' },
    actionCard: {
        width: (SCREEN_WIDTH - 44) / 2, // Accurate 2-column calculation
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    actionIconBg: { width: 44, height: 44, borderRadius: 12, backgroundColor: "#EEF3F7", justifyContent: "center", alignItems: "center", marginBottom: 12 },
    actionTitle: { fontSize: 13, fontWeight: "700", color: "#193648", marginBottom: 4 },
    actionDesc: { fontSize: 11, color: "#6B7280", lineHeight: 15 },
    actionArrow: { position: "absolute", top: 15, right: 15, width: 22, height: 22, borderRadius: 6, backgroundColor: "#EEF3F7", justifyContent: "center", alignItems: "center" },

    featureRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
        elevation: 1,
    },
    featureIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: "#EEF3F7", justifyContent: "center", alignItems: "center", marginRight: 12 },
    featureLogoImg: { width: 26, height: 26, borderRadius: 6 },
    featureTitle: { fontSize: 14, fontWeight: "700", color: "#111827" },
    featureDesc: { fontSize: 11, color: "#6B7280", marginTop: 2 },
    featureChevron: { padding: 4 },
    featureBadge: { position: "absolute", top: -4, right: -4, backgroundColor: "#EF4444", borderRadius: 8, minWidth: 16, height: 16, justifyContent: "center", alignItems: "center" },
    featureBadgeText: { color: "#fff", fontSize: 9, fontWeight: "800" },

    // aiBadge: {
    //     flexDirection: "row",
    //     alignItems: "center",
    //     backgroundColor: "#193648",
    //     marginHorizontal: 16,
    //     padding: 15,
    //     borderRadius: 20,
    //     marginBottom: 30,
    // },
    // aiBadgeLogo: { width: 35, height: 35, borderRadius: 10, marginRight: 12, backgroundColor: "rgba(255,255,255,0.1)" },
    // aiText: { color: "#fff", fontSize: 14, fontWeight: "700" },
    // aiSubText: { color: "rgba(255,255,255,0.5)", fontSize: 11 },

    // fabContainer: { position: "absolute", bottom: 30, right: 20, alignItems: "center" },
    // fabGlow: { position: "absolute", width: 70, height: 70, borderRadius: 35, backgroundColor: "#193648", opacity: 0.2 },
    // floatingButton: { backgroundColor: "#fff", width: 56, height: 56, borderRadius: 28, justifyContent: "center", alignItems: "center", elevation: 8, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 10 },
    // fabLogo: { width: 34, height: 34, borderRadius: 8 },









      aiBadge: {



        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#193648",
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: "#193648",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    },
    aiBadgeLogo: {
        width: 38,
        height: 38,
        borderRadius: 12,
        marginRight: 12,
        backgroundColor: "rgba(255,255,255,0.15)",
    },
    aiText: { color: "#fff", fontSize: 14, fontWeight: "700" },
    aiSubText: { color: "rgba(255,255,255,0.55)", fontSize: 11, marginTop: 2 },

    fabContainer: { position: "absolute", bottom: 28, right: 20, alignItems: "center", justifyContent: "center" },
    fabGlow: { position: "absolute", width: 72, height: 72, borderRadius: 36, backgroundColor: "#1936486e", opacity: 0.3 },
    floatingButton: {
        backgroundColor: "#fff",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        elevation: 10,
        shadowColor: "#193648",
        shadowOpacity: 0.5,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
        overflow: "hidden",
    },
    fabLogo: { width: 38, height: 38, borderRadius: 10 },


    modalOverlay: { flex: 1, backgroundColor: "#fff" },
    chatModalContainer: { flex: 1 },
    chatHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: Platform.OS === "ios" ? 50 : 20,
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: "#FAFAFA",
        borderBottomWidth: 1,
        borderBottomColor: "#EEE",
    },
    chatHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
    chatHeaderTitle: { fontSize: 16, fontWeight: "800" },
    chatOnline: { fontSize: 10, color: "#10B981", fontWeight: "600" },
    cxbotAvatarContainer: { position: "relative" },
    cxbotLogo: { width: 40, height: 40, borderRadius: 12 },
    onlineDot: { position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: "#10B981", borderWidth: 2, borderColor: "#fff" },
    closeBtn: { backgroundColor: "#F3F4F6", borderRadius: 20, padding: 6 },
    chatMessages: { flex: 1, paddingHorizontal: 15 },
    msgRow: { flexDirection: "row", marginVertical: 8, alignItems: "flex-end" },
    msgRowUser: { justifyContent: "flex-end" },
    msgRowAi: { justifyContent: "flex-start" },
    msgAvatar: { width: 28, height: 28, borderRadius: 8, marginRight: 8 },
    messageBubble: { padding: 12, borderRadius: 18, maxWidth: "80%" },
    userBubble: { backgroundColor: "#193648", borderBottomRightRadius: 4 },
    aiBubble: { backgroundColor: "#F3F4F6", borderBottomLeftRadius: 4 },
    typingBubble: { flexDirection: "row", alignItems: "center" },
    chatInputContainer: { flexDirection: "row", padding: 15, paddingBottom: Platform.OS === 'ios' ? 30 : 15, borderTopWidth: 1, borderTopColor: "#EEE", alignItems: "center", gap: 10 },
    chatInput: { flex: 1, backgroundColor: "#F9FAFB", paddingHorizontal: 15, paddingVertical: 10, borderRadius: 25, fontSize: 14, borderWidth: 1, borderColor: "#E5E7EB", maxHeight: 100 },
    sendButton: { backgroundColor: "#193648", width: 42, height: 42, borderRadius: 21, justifyContent: "center", alignItems: "center" },
    sendButtonDisabled: { backgroundColor: "#D1D5DB" },
});

export default StudentHomeScreen;