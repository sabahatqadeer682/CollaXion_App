// import { CONSTANT } from "@/constants/constant";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import axios from "axios";
// import React, { useCallback, useRef, useState } from "react";
// import {
//     ActivityIndicator,
//     FlatList,
//     Image,
//     RefreshControl,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
//     Platform,
// } from "react-native";

// const DEFAULT_AVATAR = require("../../assets/images/logo.png");

// const ChatListScreen = () => {
//     const navigation = useNavigation<any>();
//     const [students, setStudents] = useState<any[]>([]);
//     const [filtered, setFiltered] = useState<any[]>([]);
//     const [search, setSearch] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//     const [myEmail, setMyEmail] = useState("");
//     const [myName, setMyName] = useState("");
//     const [isRiphah, setIsRiphah] = useState(true);

//     useFocusEffect(
//         useCallback(() => {
//             loadData();
//         }, [])
//     );

//     const loadData = async () => {
//         try {
//             const email = await AsyncStorage.getItem("studentEmail");
//             const name = await AsyncStorage.getItem("studentName") || "Student";
//             if (!email) return;
//             setMyEmail(email);
//             setMyName(name);

//             // Check Riphah email
//             if (!email.toLowerCase().endsWith("@students.riphah.edu.pk")) {
//                 setIsRiphah(false);
//                 setLoading(false);
//                 return;
//             }

//             const res = await axios.get(
//                 `${CONSTANT.API_BASE_URL}/api/chat/students/${email}`
//             );
//             setStudents(res.data.students || []);
//             setFiltered(res.data.students || []);
//         } catch (err) {
//             console.log("ChatList error:", err);
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     };

//     const handleSearch = (text: string) => {
//         setSearch(text);
//         if (!text.trim()) {
//             setFiltered(students);
//             return;
//         }
//         const q = text.toLowerCase();
//         setFiltered(
//             students.filter(
//                 (s) =>
//                     s.fullName?.toLowerCase().includes(q) ||
//                     s.email?.toLowerCase().includes(q) ||
//                     s.department?.toLowerCase().includes(q)
//             )
//         );
//     };

//     const formatTime = (dateStr: string) => {
//         if (!dateStr) return "";
//         const d = new Date(dateStr);
//         const now = new Date();
//         const isToday =
//             d.getDate() === now.getDate() &&
//             d.getMonth() === now.getMonth() &&
//             d.getFullYear() === now.getFullYear();
//         if (isToday) {
//             return d.toLocaleTimeString("en-PK", {
//                 hour: "2-digit",
//                 minute: "2-digit",
//             });
//         }
//         return d.toLocaleDateString("en-PK", { day: "numeric", month: "short" });
//     };

//     const renderItem = ({ item }: { item: any }) => (
//         <TouchableOpacity
//             style={styles.studentRow}
//             onPress={() =>
//                 navigation.navigate("ChatRoom", {
//                     otherEmail: item.email,
//                     otherName: item.fullName,
//                     otherAvatar: item.profileImage,
//                     myEmail,
//                     myName,
//                 })
//             }
//             activeOpacity={0.8}
//         >
//             <View style={styles.avatarWrap}>
//                 {item.profileImage ? (
//                     <Image
//                         source={{ uri: `${CONSTANT.API_BASE_URL}${item.profileImage}` }}
//                         style={styles.avatar}
//                     />
//                 ) : (
//                     <View style={styles.avatarFallback}>
//                         <Text style={styles.avatarLetter}>
//                             {item.fullName?.[0]?.toUpperCase() || "S"}
//                         </Text>
//                     </View>
//                 )}
//                 <View style={styles.onlineDot} />
//             </View>

//             <View style={{ flex: 1, marginLeft: 12 }}>
//                 <View style={styles.rowTop}>
//                     <Text style={styles.studentName} numberOfLines={1}>
//                         {item.fullName}
//                     </Text>
//                     {item.lastMessage && (
//                         <Text style={styles.timeText}>
//                             {formatTime(item.lastMessage.createdAt)}
//                         </Text>
//                     )}
//                 </View>
//                 <View style={styles.rowBottom}>
//                     <Text style={styles.lastMsg} numberOfLines={1}>
//                         {item.lastMessage
//                             ? (item.lastMessage.senderEmail === myEmail ? "You: " : "") +
//                               item.lastMessage.text
//                             : item.department || "Riphah Student"}
//                     </Text>
//                     {item.unreadCount > 0 && (
//                         <View style={styles.badge}>
//                             <Text style={styles.badgeText}>{item.unreadCount}</Text>
//                         </View>
//                     )}
//                 </View>
//             </View>
//         </TouchableOpacity>
//     );

//     // ── Not Riphah ──
//     if (!isRiphah) {
//         return (
//             <View style={styles.centerBox}>
//                 <MaterialCommunityIcons name="shield-lock" size={54} color="#193648" />
//                 <Text style={styles.restrictTitle}>Riphah Students Only</Text>
//                 <Text style={styles.restrictSub}>
//                     This chat feature is exclusively for students with a{" "}
//                     <Text style={{ fontWeight: "700" }}>@students.riphah.edu.pk</Text> email address.
//                 </Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//                     <Ionicons name="arrow-back" size={22} color="#fff" />
//                 </TouchableOpacity>
//                 <View style={{ flex: 1 }}>
//                     <Text style={styles.headerTitle}>Student Chat</Text>
//                     <Text style={styles.headerSub}>Riphah University Network</Text>
//                 </View>
//                 <View style={styles.riphahBadge}>
//                     <MaterialCommunityIcons name="shield-check" size={14} color="#34D399" />
//                     <Text style={styles.riphahBadgeText}>Verified</Text>
//                 </View>
//             </View>

//             {/* Search */}
//             <View style={styles.searchWrap}>
//                 <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
//                 <TextInput
//                     value={search}
//                     onChangeText={handleSearch}
//                     placeholder="Search students..."
//                     placeholderTextColor="#9CA3AF"
//                     style={styles.searchInput}
//                 />
//                 {search.length > 0 && (
//                     <TouchableOpacity onPress={() => handleSearch("")}>
//                         <Ionicons name="close-circle" size={18} color="#9CA3AF" />
//                     </TouchableOpacity>
//                 )}
//             </View>

//             {loading ? (
//                 <ActivityIndicator color="#193648" style={{ marginTop: 40 }} size="large" />
//             ) : (
//                 <FlatList
//                     data={filtered}
//                     keyExtractor={(item) => item.email}
//                     renderItem={renderItem}
//                     refreshControl={
//                         <RefreshControl
//                             refreshing={refreshing}
//                             onRefresh={() => {
//                                 setRefreshing(true);
//                                 loadData();
//                             }}
//                             colors={["#193648"]}
//                         />
//                     }
//                     contentContainerStyle={{ paddingBottom: 30 }}
//                     ListEmptyComponent={
//                         <View style={styles.centerBox}>
//                             <MaterialCommunityIcons
//                                 name="account-group-outline"
//                                 size={54}
//                                 color="#D1D5DB"
//                             />
//                             <Text style={styles.emptyText}>No Riphah students found</Text>
//                             <Text style={styles.emptySub}>
//                                 Pull down to refresh the list
//                             </Text>
//                         </View>
//                     }
//                     ItemSeparatorComponent={() => <View style={styles.separator} />}
//                 />
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#F0F4F8" },

//     header: {
//         backgroundColor: "#193648",
//         flexDirection: "row",
//         alignItems: "center",
//         paddingTop: Platform.OS === "ios" ? 52 : 22,
//         paddingHorizontal: 18,
//         paddingBottom: 18,
//         gap: 12,
//     },
//     backBtn: {
//         backgroundColor: "rgba(255,255,255,0.12)",
//         borderRadius: 20,
//         padding: 8,
//     },
//     headerTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
//     headerSub: { color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 2 },
//     riphahBadge: {
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 4,
//         backgroundColor: "rgba(52,211,153,0.15)",
//         paddingHorizontal: 10,
//         paddingVertical: 5,
//         borderRadius: 20,
//     },
//     riphahBadgeText: { color: "#34D399", fontSize: 11, fontWeight: "700" },

//     searchWrap: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#fff",
//         margin: 14,
//         borderRadius: 14,
//         paddingHorizontal: 14,
//         paddingVertical: 10,
//         shadowColor: "#000",
//         shadowOpacity: 0.05,
//         shadowRadius: 6,
//         elevation: 2,
//     },
//     searchInput: { flex: 1, fontSize: 14, color: "#111827" },

//     studentRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#fff",
//         paddingHorizontal: 16,
//         paddingVertical: 14,
//     },
//     avatarWrap: { position: "relative" },
//     avatar: { width: 48, height: 48, borderRadius: 24 },
//     avatarFallback: {
//         width: 48,
//         height: 48,
//         borderRadius: 24,
//         backgroundColor: "#193648",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     avatarLetter: { color: "#fff", fontSize: 20, fontWeight: "800" },
//     onlineDot: {
//         position: "absolute",
//         bottom: 1,
//         right: 1,
//         width: 11,
//         height: 11,
//         borderRadius: 6,
//         backgroundColor: "#10B981",
//         borderWidth: 2,
//         borderColor: "#fff",
//     },
//     rowTop: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: 4,
//     },
//     studentName: { fontSize: 15, fontWeight: "700", color: "#111827", flex: 1 },
//     timeText: { fontSize: 11, color: "#9CA3AF", marginLeft: 8 },
//     rowBottom: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//     },
//     lastMsg: { fontSize: 13, color: "#6B7280", flex: 1 },
//     badge: {
//         backgroundColor: "#193648",
//         borderRadius: 10,
//         minWidth: 20,
//         height: 20,
//         justifyContent: "center",
//         alignItems: "center",
//         paddingHorizontal: 5,
//         marginLeft: 8,
//     },
//     badgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },
//     separator: { height: 0.5, backgroundColor: "#F3F4F6", marginLeft: 76 },

//     centerBox: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         padding: 32,
//         marginTop: 60,
//     },
//     restrictTitle: { fontSize: 18, fontWeight: "800", color: "#111827", marginTop: 16, marginBottom: 8 },
//     restrictSub: { fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 22 },
//     emptyText: { fontSize: 16, fontWeight: "700", color: "#9CA3AF", marginTop: 14 },
//     emptySub: { fontSize: 13, color: "#C4C9D4", marginTop: 6 },
// });

// export default ChatListScreen;







// import { CONSTANT } from "@/constants/constant";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import axios from "axios";
// import React, { useCallback, useState } from "react";
// import {
//     ActivityIndicator,
//     FlatList,
//     Image,
//     Platform,
//     RefreshControl,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";

// const ChatListScreen = () => {
//     const navigation = useNavigation<any>();
//     const [students, setStudents] = useState<any[]>([]);
//     const [filtered, setFiltered] = useState<any[]>([]);
//     const [search, setSearch] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//     const [myEmail, setMyEmail] = useState("");
//     const [myName, setMyName] = useState("");
//     const [isRiphah, setIsRiphah] = useState(true);

//     useFocusEffect(
//         useCallback(() => {
//             loadData();
//         }, [])
//     );

//     const loadData = async () => {
//         try {
//             // ✅ Fixed key: "studentFullName" (matches what login saves)
//             const email = await AsyncStorage.getItem("studentEmail");
//             const name =
//                 (await AsyncStorage.getItem("studentFullName")) || "Student";

//             if (!email) return;
//             setMyEmail(email);
//             setMyName(name);

//             // ✅ Fixed: check students.riphah.edu.pk (student email domain)
//             const lower = email.toLowerCase();
//             if (
//                 !lower.endsWith("@students.riphah.edu.pk") &&
//                 !lower.endsWith("@riphah.edu.pk")
//             ) {
//                 setIsRiphah(false);
//                 setLoading(false);
//                 return;
//             }

//             const res = await axios.get(
//                 `${CONSTANT.API_BASE_URL}/api/chat/students/${email}`
//             );
//             setStudents(res.data.students || []);
//             setFiltered(res.data.students || []);
//         } catch (err) {
//             console.log("ChatList error:", err);
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     };

//     const handleSearch = (text: string) => {
//         setSearch(text);
//         if (!text.trim()) {
//             setFiltered(students);
//             return;
//         }
//         const q = text.toLowerCase();
//         setFiltered(
//             students.filter(
//                 (s) =>
//                     s.fullName?.toLowerCase().includes(q) ||
//                     s.email?.toLowerCase().includes(q) ||
//                     s.department?.toLowerCase().includes(q)
//             )
//         );
//     };

//     const formatTime = (dateStr: string) => {
//         if (!dateStr) return "";
//         const d = new Date(dateStr);
//         const now = new Date();
//         const isToday =
//             d.getDate() === now.getDate() &&
//             d.getMonth() === now.getMonth() &&
//             d.getFullYear() === now.getFullYear();
//         if (isToday) {
//             return d.toLocaleTimeString("en-PK", {
//                 hour: "2-digit",
//                 minute: "2-digit",
//             });
//         }
//         return d.toLocaleDateString("en-PK", {
//             day: "numeric",
//             month: "short",
//         });
//     };

//     const renderItem = ({ item }: { item: any }) => (
//         <TouchableOpacity
//             style={styles.studentRow}
//             onPress={() =>
//                 navigation.navigate("ChatRoom", {
//                     otherEmail: item.email,
//                     otherName: item.fullName,
//                     otherAvatar: item.profileImage,
//                     myEmail,
//                     myName,
//                 })
//             }
//             activeOpacity={0.75}
//         >
//             <View style={styles.avatarWrap}>
//                 {item.profileImage ? (
//                     <Image
//                         source={{
//                             uri: `${CONSTANT.API_BASE_URL}${item.profileImage}`,
//                         }}
//                         style={styles.avatar}
//                     />
//                 ) : (
//                     <View style={styles.avatarFallback}>
//                         <Text style={styles.avatarLetter}>
//                             {item.fullName?.[0]?.toUpperCase() || "S"}
//                         </Text>
//                     </View>
//                 )}
//                 <View style={styles.onlineDot} />
//             </View>

//             <View style={{ flex: 1, marginLeft: 12 }}>
//                 <View style={styles.rowTop}>
//                     <Text style={styles.studentName} numberOfLines={1}>
//                         {item.fullName}
//                     </Text>
//                     {item.lastMessage && (
//                         <Text style={styles.timeText}>
//                             {formatTime(item.lastMessage.createdAt)}
//                         </Text>
//                     )}
//                 </View>
//                 <View style={styles.rowBottom}>
//                     <Text style={styles.lastMsg} numberOfLines={1}>
//                         {item.lastMessage
//                             ? (item.lastMessage.senderEmail === myEmail
//                                   ? "You: "
//                                   : "") + item.lastMessage.text
//                             : item.department || "Riphah Student"}
//                     </Text>
//                     {item.unreadCount > 0 && (
//                         <View style={styles.badge}>
//                             <Text style={styles.badgeText}>
//                                 {item.unreadCount}
//                             </Text>
//                         </View>
//                     )}
//                 </View>
//             </View>
//         </TouchableOpacity>
//     );

//     if (!isRiphah) {
//         return (
//             <View style={styles.centerBox}>
//                 <MaterialCommunityIcons
//                     name="shield-lock"
//                     size={54}
//                     color="#193648"
//                 />
//                 <Text style={styles.restrictTitle}>Riphah Students Only</Text>
//                 <Text style={styles.restrictSub}>
//                     This chat feature is exclusively for students with a{" "}
//                     <Text style={{ fontWeight: "700" }}>
//                         @students.riphah.edu.pk
//                     </Text>{" "}
//                     email address.
//                 </Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity
//                     onPress={() => navigation.goBack()}
//                     style={styles.backBtn}
//                 >
//                     <Ionicons name="arrow-back" size={22} color="#fff" />
//                 </TouchableOpacity>
//                 <View style={{ flex: 1 }}>
//                     <Text style={styles.headerTitle}>Student Chat</Text>
//                     <Text style={styles.headerSub}>
//                         Riphah University Network
//                     </Text>
//                 </View>
//                 <View style={styles.riphahBadge}>
//                     <MaterialCommunityIcons
//                         name="shield-check"
//                         size={14}
//                         color="#34D399"
//                     />
//                     <Text style={styles.riphahBadgeText}>Verified</Text>
//                 </View>
//             </View>

//             {/* Search */}
//             <View style={styles.searchWrap}>
//                 <Ionicons
//                     name="search"
//                     size={18}
//                     color="#9CA3AF"
//                     style={{ marginRight: 8 }}
//                 />
//                 <TextInput
//                     value={search}
//                     onChangeText={handleSearch}
//                     placeholder="Search students..."
//                     placeholderTextColor="#9CA3AF"
//                     style={styles.searchInput}
//                 />
//                 {search.length > 0 && (
//                     <TouchableOpacity onPress={() => handleSearch("")}>
//                         <Ionicons
//                             name="close-circle"
//                             size={18}
//                             color="#9CA3AF"
//                         />
//                     </TouchableOpacity>
//                 )}
//             </View>

//             {loading ? (
//                 <ActivityIndicator
//                     color="#193648"
//                     style={{ marginTop: 40 }}
//                     size="large"
//                 />
//             ) : (
//                 <FlatList
//                     data={filtered}
//                     keyExtractor={(item) => item.email}
//                     renderItem={renderItem}
//                     refreshControl={
//                         <RefreshControl
//                             refreshing={refreshing}
//                             onRefresh={() => {
//                                 setRefreshing(true);
//                                 loadData();
//                             }}
//                             colors={["#193648"]}
//                         />
//                     }
//                     contentContainerStyle={{ paddingBottom: 30 }}
//                     ListEmptyComponent={
//                         <View style={styles.centerBox}>
//                             <MaterialCommunityIcons
//                                 name="account-group-outline"
//                                 size={54}
//                                 color="#D1D5DB"
//                             />
//                             <Text style={styles.emptyText}>
//                                 No Riphah students found
//                             </Text>
//                             <Text style={styles.emptySub}>
//                                 Pull down to refresh the list
//                             </Text>
//                         </View>
//                     }
//                     ItemSeparatorComponent={() => (
//                         <View style={styles.separator} />
//                     )}
//                 />
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#F0F4F8" },

//     header: {
//         backgroundColor: "#193648",
//         flexDirection: "row",
//         alignItems: "center",
//         paddingTop: Platform.OS === "ios" ? 52 : 22,
//         paddingHorizontal: 18,
//         paddingBottom: 18,
//         gap: 12,
//     },
//     backBtn: {
//         backgroundColor: "rgba(255,255,255,0.12)",
//         borderRadius: 20,
//         padding: 8,
//     },
//     headerTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
//     headerSub: {
//         color: "rgba(255,255,255,0.55)",
//         fontSize: 12,
//         marginTop: 2,
//     },
//     riphahBadge: {
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 4,
//         backgroundColor: "rgba(52,211,153,0.15)",
//         paddingHorizontal: 10,
//         paddingVertical: 5,
//         borderRadius: 20,
//     },
//     riphahBadgeText: { color: "#34D399", fontSize: 11, fontWeight: "700" },

//     searchWrap: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#fff",
//         margin: 14,
//         borderRadius: 14,
//         paddingHorizontal: 14,
//         paddingVertical: 10,
//         shadowColor: "#000",
//         shadowOpacity: 0.05,
//         shadowRadius: 6,
//         elevation: 2,
//     },
//     searchInput: { flex: 1, fontSize: 14, color: "#111827" },

//     studentRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#fff",
//         paddingHorizontal: 16,
//         paddingVertical: 14,
//     },
//     avatarWrap: { position: "relative" },
//     avatar: { width: 48, height: 48, borderRadius: 24 },
//     avatarFallback: {
//         width: 48,
//         height: 48,
//         borderRadius: 24,
//         backgroundColor: "#193648",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     avatarLetter: { color: "#fff", fontSize: 20, fontWeight: "800" },
//     onlineDot: {
//         position: "absolute",
//         bottom: 1,
//         right: 1,
//         width: 11,
//         height: 11,
//         borderRadius: 6,
//         backgroundColor: "#10B981",
//         borderWidth: 2,
//         borderColor: "#fff",
//     },
//     rowTop: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: 4,
//     },
//     studentName: {
//         fontSize: 15,
//         fontWeight: "700",
//         color: "#111827",
//         flex: 1,
//     },
//     timeText: { fontSize: 11, color: "#9CA3AF", marginLeft: 8 },
//     rowBottom: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//     },
//     lastMsg: { fontSize: 13, color: "#6B7280", flex: 1 },
//     badge: {
//         backgroundColor: "#193648",
//         borderRadius: 10,
//         minWidth: 20,
//         height: 20,
//         justifyContent: "center",
//         alignItems: "center",
//         paddingHorizontal: 5,
//         marginLeft: 8,
//     },
//     badgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },
//     separator: {
//         height: 0.5,
//         backgroundColor: "#F3F4F6",
//         marginLeft: 76,
//     },

//     centerBox: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         padding: 32,
//         marginTop: 60,
//     },
//     restrictTitle: {
//         fontSize: 18,
//         fontWeight: "800",
//         color: "#111827",
//         marginTop: 16,
//         marginBottom: 8,
//     },
//     restrictSub: {
//         fontSize: 14,
//         color: "#6B7280",
//         textAlign: "center",
//         lineHeight: 22,
//     },
//     emptyText: {
//         fontSize: 16,
//         fontWeight: "700",
//         color: "#9CA3AF",
//         marginTop: 14,
//     },
//     emptySub: { fontSize: 13, color: "#C4C9D4", marginTop: 6 },
// });

// export default ChatListScreen;








// import { CONSTANT } from "@/constants/constant";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import axios from "axios";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import {
//     ActivityIndicator,
//     FlatList,
//     Image,
//     Platform,
//     RefreshControl,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";
// // import socket from "../utils/Socket";



// import socket from "./utils/Socket";


// const ChatListScreen = () => {
//     const navigation = useNavigation<any>();
//     const [students, setStudents] = useState<any[]>([]);
//     const [filtered, setFiltered] = useState<any[]>([]);
//     const [search, setSearch] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//     const [myEmail, setMyEmail] = useState("");
//     const [myName, setMyName] = useState("");
//     const [isRiphah, setIsRiphah] = useState(true);

//     // Keep students in a ref so socket handler can access latest
//     const studentsRef = useRef<any[]>([]);

//     useFocusEffect(
//         useCallback(() => {
//             loadData();
//         }, [])
//     );

//     // ✅ FIX 2: Listen for new messages to update unread badge in real time
//     useEffect(() => {
//         if (!myEmail) return;

//         socket.connect(CONSTANT.API_BASE_URL, myEmail);

//         const handleNewMessage = (msg: any) => {
//             // Only care about msgs sent TO me
//             if (msg.receiverEmail !== myEmail) return;

//             setStudents((prev) => {
//                 const updated = prev.map((s) => {
//                     if (s.email === msg.senderEmail) {
//                         return {
//                             ...s,
//                             unreadCount: (s.unreadCount || 0) + 1,
//                             lastMessage: {
//                                 text: msg.imageUrl ? "📷 Image" : msg.text,
//                                 createdAt: msg.createdAt,
//                                 senderEmail: msg.senderEmail,
//                             },
//                         };
//                     }
//                     return s;
//                 });
//                 // Re-sort by latest message
//                 updated.sort((a, b) => {
//                     const aTime = a.lastMessage?.createdAt || 0;
//                     const bTime = b.lastMessage?.createdAt || 0;
//                     return new Date(bTime).getTime() - new Date(aTime).getTime();
//                 });
//                 return updated;
//             });

//             setFiltered((prev) => {
//                 const updated = prev.map((s) => {
//                     if (s.email === msg.senderEmail) {
//                         return {
//                             ...s,
//                             unreadCount: (s.unreadCount || 0) + 1,
//                             lastMessage: {
//                                 text: msg.imageUrl ? "📷 Image" : msg.text,
//                                 createdAt: msg.createdAt,
//                                 senderEmail: msg.senderEmail,
//                             },
//                         };
//                     }
//                     return s;
//                 });
//                 updated.sort((a, b) => {
//                     const aTime = a.lastMessage?.createdAt || 0;
//                     const bTime = b.lastMessage?.createdAt || 0;
//                     return new Date(bTime).getTime() - new Date(aTime).getTime();
//                 });
//                 return updated;
//             });
//         };

//         socket.on("newMessage", handleNewMessage);
//         return () => {
//             socket.off("newMessage", handleNewMessage);
//         };
//     }, [myEmail]);

//     const loadData = async () => {
//         try {
//             // ✅ Fixed key: studentFullName
//             const email = await AsyncStorage.getItem("studentEmail");
//             const name = (await AsyncStorage.getItem("studentFullName")) || "Student";

//             if (!email) return;
//             setMyEmail(email);
//             setMyName(name);

//             const lower = email.toLowerCase();
//             if (
//                 !lower.endsWith("@students.riphah.edu.pk") &&
//                 !lower.endsWith("@students.riphah.edu.pk")
//             ) {
//                 setIsRiphah(false);
//                 setLoading(false);
//                 return;
//             }

//             const res = await axios.get(
//                 `${CONSTANT.API_BASE_URL}/api/chat/students/${email}`
//             );
//             const data = res.data.students || [];
//             setStudents(data);
//             setFiltered(data);
//             studentsRef.current = data;
//         } catch (err) {
//             console.log("ChatList error:", err);
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     };

//     const handleSearch = (text: string) => {
//         setSearch(text);
//         if (!text.trim()) {
//             setFiltered(students);
//             return;
//         }
//         const q = text.toLowerCase();
//         setFiltered(
//             students.filter(
//                 (s) =>
//                     s.fullName?.toLowerCase().includes(q) ||
//                     s.email?.toLowerCase().includes(q) ||
//                     s.department?.toLowerCase().includes(q)
//             )
//         );
//     };

//     const formatTime = (dateStr: string) => {
//         if (!dateStr) return "";
//         const d = new Date(dateStr);
//         const now = new Date();
//         const isToday =
//             d.getDate() === now.getDate() &&
//             d.getMonth() === now.getMonth() &&
//             d.getFullYear() === now.getFullYear();
//         if (isToday) {
//             return d.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" });
//         }
//         return d.toLocaleDateString("en-PK", { day: "numeric", month: "short" });
//     };

//     const renderItem = ({ item }: { item: any }) => (
//         <TouchableOpacity
//             style={styles.studentRow}
//             onPress={() => {
//                 // ✅ Clear unread badge when opening chat
//                 setStudents((prev) =>
//                     prev.map((s) =>
//                         s.email === item.email ? { ...s, unreadCount: 0 } : s
//                     )
//                 );
//                 setFiltered((prev) =>
//                     prev.map((s) =>
//                         s.email === item.email ? { ...s, unreadCount: 0 } : s
//                     )
//                 );
//                 navigation.navigate("ChatRoom", {
//                     otherEmail: item.email,
//                     otherName: item.fullName,
//                     otherAvatar: item.profileImage || null,
//                     myEmail,
//                     myName,
//                 });
//             }}
//             activeOpacity={0.75}
//         >
//             {/* ✅ FIX 3: Show real DP */}
//             <View style={styles.avatarWrap}>
//                 {item.profileImage ? (
//                     <Image
//                         source={{ uri: `${CONSTANT.API_BASE_URL}${item.profileImage}` }}
//                         style={styles.avatar}
//                     />
//                 ) : (
//                     <View style={styles.avatarFallback}>
//                         <Text style={styles.avatarLetter}>
//                             {item.fullName?.[0]?.toUpperCase() || "S"}
//                         </Text>
//                     </View>
//                 )}
//                 <View style={styles.onlineDot} />
//             </View>

//             <View style={{ flex: 1, marginLeft: 12 }}>
//                 <View style={styles.rowTop}>
//                     <Text style={styles.studentName} numberOfLines={1}>
//                         {item.fullName}
//                     </Text>
//                     {item.lastMessage && (
//                         <Text style={styles.timeText}>
//                             {formatTime(item.lastMessage.createdAt)}
//                         </Text>
//                     )}
//                 </View>
//                 <View style={styles.rowBottom}>
//                     <Text style={styles.lastMsg} numberOfLines={1}>
//                         {item.lastMessage
//                             ? item.lastMessage.imageUrl
//                                 ? "📷 Image"
//                                 : (item.lastMessage.senderEmail === myEmail ? "You: " : "") +
//                                   item.lastMessage.text
//                             : item.department || "Riphah Student"}
//                     </Text>
//                     {/* ✅ FIX 2: Unread badge */}
//                     {item.unreadCount > 0 && (
//                         <View style={styles.badge}>
//                             <Text style={styles.badgeText}>{item.unreadCount}</Text>
//                         </View>
//                     )}
//                 </View>
//             </View>
//         </TouchableOpacity>
//     );

//     if (!isRiphah) {
//         return (
//             <View style={styles.centerBox}>
//                 <MaterialCommunityIcons name="shield-lock" size={54} color="#193648" />
//                 <Text style={styles.restrictTitle}>Riphah Students Only</Text>
//                 <Text style={styles.restrictSub}>
//                     This chat feature is exclusively for students with a{" "}
//                     <Text style={{ fontWeight: "700" }}>@students.riphah.edu.pk</Text>{" "}
//                     email address.
//                 </Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity
//                     onPress={() => navigation.goBack()}
//                     style={styles.backBtn}
//                 >
//                     <Ionicons name="arrow-back" size={22} color="#fff" />
//                 </TouchableOpacity>
//                 <View style={{ flex: 1 }}>
//                     <Text style={styles.headerTitle}>Student Chat</Text>
//                     <Text style={styles.headerSub}>Riphah University Network</Text>
//                 </View>
//                 <View style={styles.riphahBadge}>
//                     <MaterialCommunityIcons name="shield-check" size={14} color="#34D399" />
//                     <Text style={styles.riphahBadgeText}>Verified</Text>
//                 </View>
//             </View>

//             {/* Search */}
//             <View style={styles.searchWrap}>
//                 <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
//                 <TextInput
//                     value={search}
//                     onChangeText={handleSearch}
//                     placeholder="Search students..."
//                     placeholderTextColor="#9CA3AF"
//                     style={styles.searchInput}
//                 />
//                 {search.length > 0 && (
//                     <TouchableOpacity onPress={() => handleSearch("")}>
//                         <Ionicons name="close-circle" size={18} color="#9CA3AF" />
//                     </TouchableOpacity>
//                 )}
//             </View>

//             {loading ? (
//                 <ActivityIndicator color="#193648" style={{ marginTop: 40 }} size="large" />
//             ) : (
//                 <FlatList
//                     data={filtered}
//                     keyExtractor={(item) => item.email}
//                     renderItem={renderItem}
//                     refreshControl={
//                         <RefreshControl
//                             refreshing={refreshing}
//                             onRefresh={() => {
//                                 setRefreshing(true);
//                                 loadData();
//                             }}
//                             colors={["#193648"]}
//                         />
//                     }
//                     contentContainerStyle={{ paddingBottom: 30 }}
//                     ListEmptyComponent={
//                         <View style={styles.centerBox}>
//                             <MaterialCommunityIcons
//                                 name="account-group-outline"
//                                 size={54}
//                                 color="#D1D5DB"
//                             />
//                             <Text style={styles.emptyText}>No Riphah students found</Text>
//                             <Text style={styles.emptySub}>Pull down to refresh the list</Text>
//                         </View>
//                     }
//                     ItemSeparatorComponent={() => <View style={styles.separator} />}
//                 />
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#F0F4F8" },

//     header: {
//         backgroundColor: "#193648",
//         flexDirection: "row",
//         alignItems: "center",
//         paddingTop: Platform.OS === "ios" ? 52 : 22,
//         paddingHorizontal: 18,
//         paddingBottom: 18,
//         gap: 12,
//     },
//     backBtn: {
//         backgroundColor: "rgba(255,255,255,0.12)",
//         borderRadius: 20,
//         padding: 8,
//     },
//     headerTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
//     headerSub: { color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 2 },
//     riphahBadge: {
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 4,
//         backgroundColor: "rgba(52,211,153,0.15)",
//         paddingHorizontal: 10,
//         paddingVertical: 5,
//         borderRadius: 20,
//     },
//     riphahBadgeText: { color: "#34D399", fontSize: 11, fontWeight: "700" },

//     searchWrap: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#fff",
//         margin: 14,
//         borderRadius: 14,
//         paddingHorizontal: 14,
//         paddingVertical: 10,
//         shadowColor: "#000",
//         shadowOpacity: 0.05,
//         shadowRadius: 6,
//         elevation: 2,
//     },
//     searchInput: { flex: 1, fontSize: 14, color: "#111827" },

//     studentRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#fff",
//         paddingHorizontal: 16,
//         paddingVertical: 14,
//     },
//     avatarWrap: { position: "relative" },
//     avatar: { width: 48, height: 48, borderRadius: 24 },
//     avatarFallback: {
//         width: 48,
//         height: 48,
//         borderRadius: 24,
//         backgroundColor: "#193648",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     avatarLetter: { color: "#fff", fontSize: 20, fontWeight: "800" },
//     onlineDot: {
//         position: "absolute",
//         bottom: 1,
//         right: 1,
//         width: 11,
//         height: 11,
//         borderRadius: 6,
//         backgroundColor: "#10B981",
//         borderWidth: 2,
//         borderColor: "#fff",
//     },
//     rowTop: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: 4,
//     },
//     studentName: { fontSize: 15, fontWeight: "700", color: "#111827", flex: 1 },
//     timeText: { fontSize: 11, color: "#9CA3AF", marginLeft: 8 },
//     rowBottom: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//     },
//     lastMsg: { fontSize: 13, color: "#6B7280", flex: 1 },
//     badge: {
//         backgroundColor: "#193648",
//         borderRadius: 10,
//         minWidth: 20,
//         height: 20,
//         justifyContent: "center",
//         alignItems: "center",
//         paddingHorizontal: 5,
//         marginLeft: 8,
//     },
//     badgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },
//     separator: { height: 0.5, backgroundColor: "#F3F4F6", marginLeft: 76 },

//     centerBox: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         padding: 32,
//         marginTop: 60,
//     },
//     restrictTitle: {
//         fontSize: 18,
//         fontWeight: "800",
//         color: "#111827",
//         marginTop: 16,
//         marginBottom: 8,
//     },
//     restrictSub: { fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 22 },
//     emptyText: { fontSize: 16, fontWeight: "700", color: "#9CA3AF", marginTop: 14 },
//     emptySub: { fontSize: 13, color: "#C4C9D4", marginTop: 6 },
// });

// export default ChatListScreen;








import { CONSTANT } from "@/constants/constant";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import socket from "./utils/Socket";

const ChatListScreen = () => {
    const navigation = useNavigation<any>();

    const [students, setStudents] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [myEmail, setMyEmail] = useState("");
    const [myName, setMyName] = useState("");
    const [isRiphah, setIsRiphah] = useState(true);

    // ✅ NEW: image error tracking
    const [imgError, setImgError] = useState<{ [key: string]: boolean }>({});

    const studentsRef = useRef<any[]>([]);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    useEffect(() => {
        if (!myEmail) return;

        socket.connect(CONSTANT.API_BASE_URL, myEmail);

        const handleNewMessage = (msg: any) => {
            if (msg.receiverEmail !== myEmail) return;

            setStudents((prev) => {
                const updated = prev.map((s) => {
                    if (s.email === msg.senderEmail) {
                        return {
                            ...s,
                            unreadCount: (s.unreadCount || 0) + 1,
                            lastMessage: {
                                text: msg.imageUrl ? "📷 Image" : msg.text,
                                createdAt: msg.createdAt,
                                senderEmail: msg.senderEmail,
                            },
                        };
                    }
                    return s;
                });

                updated.sort((a, b) =>
                    new Date(b.lastMessage?.createdAt || 0).getTime() -
                    new Date(a.lastMessage?.createdAt || 0).getTime()
                );

                return updated;
            });

            setFiltered((prev) => {
                const updated = prev.map((s) => {
                    if (s.email === msg.senderEmail) {
                        return {
                            ...s,
                            unreadCount: (s.unreadCount || 0) + 1,
                            lastMessage: {
                                text: msg.imageUrl ? "📷 Image" : msg.text,
                                createdAt: msg.createdAt,
                                senderEmail: msg.senderEmail,
                            },
                        };
                    }
                    return s;
                });

                updated.sort((a, b) =>
                    new Date(b.lastMessage?.createdAt || 0).getTime() -
                    new Date(a.lastMessage?.createdAt || 0).getTime()
                );

                return updated;
            });
        };

        socket.on("newMessage", handleNewMessage);
        return () => socket.off("newMessage", handleNewMessage);
    }, [myEmail]);

    const loadData = async () => {
        try {
            const email = await AsyncStorage.getItem("studentEmail");
            const name =
                (await AsyncStorage.getItem("studentFullName")) || "Student";

            if (!email) return;

            setMyEmail(email);
            setMyName(name);

            const lower = email.toLowerCase();
            if (
                !lower.endsWith("@students.riphah.edu.pk")
            ) {
                setIsRiphah(false);
                setLoading(false);
                return;
            }

            const res = await axios.get(
                `${CONSTANT.API_BASE_URL}/api/chat/students/${email}`
            );

            const data = res.data.students || [];
            setStudents(data);
            setFiltered(data);
            studentsRef.current = data;
        } catch (err) {
            console.log("ChatList error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleSearch = (text: string) => {
        setSearch(text);

        if (!text.trim()) {
            setFiltered(students);
            return;
        }

        const q = text.toLowerCase();

        setFiltered(
            students.filter(
                (s) =>
                    s.fullName?.toLowerCase().includes(q) ||
                    s.email?.toLowerCase().includes(q) ||
                    s.department?.toLowerCase().includes(q)
            )
        );
    };

    const formatTime = (dateStr: string) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        const now = new Date();

        const isToday =
            d.getDate() === now.getDate() &&
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear();

        if (isToday) {
            return d.toLocaleTimeString("en-PK", {
                hour: "2-digit",
                minute: "2-digit",
            });
        }

        return d.toLocaleDateString("en-PK", {
            day: "numeric",
            month: "short",
        });
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.studentRow}
            onPress={() => {
                setStudents((prev) =>
                    prev.map((s) =>
                        s.email === item.email ? { ...s, unreadCount: 0 } : s
                    )
                );

                setFiltered((prev) =>
                    prev.map((s) =>
                        s.email === item.email ? { ...s, unreadCount: 0 } : s
                    )
                );

                navigation.navigate("ChatRoom", {
                    otherEmail: item.email,
                    otherName: item.fullName,
                    otherAvatar: item.profileImage || null,
                    myEmail,
                    myName,
                });
            }}
        >
            {/* ✅ FIXED DP LOGIC */}
            <View style={styles.avatarWrap}>
                {item.profileImage && !imgError[item.email] ? (
                    <Image
                        source={{
                            uri: `${CONSTANT.API_BASE_URL}${item.profileImage}`,
                        }}
                        style={styles.avatar}
                        onError={() =>
                            setImgError((prev) => ({
                                ...prev,
                                [item.email]: true,
                            }))
                        }
                    />
                ) : (
                    <View style={styles.avatarFallback}>
                        <Text style={styles.avatarLetter}>
                            {item.fullName?.trim()?.[0]?.toUpperCase() || "S"}
                        </Text>
                    </View>
                )}
                <View style={styles.onlineDot} />
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.rowTop}>
                    <Text style={styles.studentName} numberOfLines={1}>
                        {item.fullName}
                    </Text>

                    {item.lastMessage && (
                        <Text style={styles.timeText}>
                            {formatTime(item.lastMessage.createdAt)}
                        </Text>
                    )}
                </View>

                <View style={styles.rowBottom}>
                    <Text style={styles.lastMsg} numberOfLines={1}>
                        {item.lastMessage
                            ? item.lastMessage.text
                            : item.department || "Riphah Student"}
                    </Text>

                    {item.unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {item.unreadCount}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    if (!isRiphah) {
        return (
            <View style={styles.centerBox}>
                <MaterialCommunityIcons
                    name="shield-lock"
                    size={54}
                    color="#193648"
                />
                <Text style={styles.restrictTitle}>
                    Riphah Students Only
                </Text>
                <Text style={styles.restrictSub}>
                    This chat feature is exclusively for Riphah students.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Student Chat</Text>
                </View>
            </View>

            <View style={styles.searchWrap}>
                <TextInput
                    value={search}
                    onChangeText={handleSearch}
                    placeholder="Search students..."
                    style={styles.searchInput}
                />
            </View>

            {loading ? (
                <ActivityIndicator
                    color="#193648"
                    style={{ marginTop: 40 }}
                />
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.email}
                    renderItem={renderItem}
                />
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F0F4F8" },

    header: {
        backgroundColor: "#193648",
        flexDirection: "row",
        alignItems: "center",
        paddingTop: Platform.OS === "ios" ? 52 : 22,
        paddingHorizontal: 18,
        paddingBottom: 18,
        gap: 12,
    },

    headerTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "800",
    },

    searchWrap: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        margin: 14,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },

    searchInput: {
        flex: 1,
        fontSize: 14,
        color: "#111827",
    },

    studentRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 14,
    },

    avatarWrap: {
        position: "relative",
    },

    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },

    avatarFallback: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#193648",
        justifyContent: "center",
        alignItems: "center",
    },

    avatarLetter: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "800",
    },

    onlineDot: {
        position: "absolute",
        bottom: 2,
        right: 2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#10B981",
        borderWidth: 2,
        borderColor: "#fff",
    },

    rowTop: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    studentName: {
        fontSize: 15,
        fontWeight: "700",
        color: "#111827",
        flex: 1,
    },

    timeText: {
        fontSize: 11,
        color: "#9CA3AF",
    },

    rowBottom: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 2,
    },

    lastMsg: {
        fontSize: 13,
        color: "#6B7280",
        flex: 1,
    },

    badge: {
        backgroundColor: "#193648",
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 5,
    },

    badgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "800",
    },

    separator: {
        height: 0.5,
        backgroundColor: "#F3F4F6",
        marginLeft: 76,
    },

    centerBox: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
    },

    restrictTitle: {
        fontSize: 18,
        fontWeight: "800",
        marginTop: 10,
    },

    restrictSub: {
        textAlign: "center",
        marginTop: 6,
        color: "#6B7280",
    },
});

export default ChatListScreen;