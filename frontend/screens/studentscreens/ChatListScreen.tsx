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
    Alert,
    FlatList,
    Image,
    Modal,
    Platform,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import socket from "./utils/Socket";

// Pretty avatar palette — picked deterministically by name
const AVATAR_COLORS = [
    ["#0EA5E9", "#0284C7"],
    ["#10B981", "#059669"],
    ["#F59E0B", "#D97706"],
    ["#EF4444", "#DC2626"],
    ["#8B5CF6", "#7C3AED"],
    ["#EC4899", "#DB2777"],
    ["#14B8A6", "#0D9488"],
    ["#F97316", "#EA580C"],
];

const colorForName = (name: string = "") => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// Resolve any profile image format: data: URI, full http(s) URL, or relative path
const resolveAvatarUri = (raw?: string | null): string | null => {
    if (!raw) return null;
    if (raw.startsWith("data:") || raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    if (raw.startsWith("file://")) return null;
    return `${CONSTANT.API_BASE_URL}${raw.startsWith("/") ? "" : "/"}${raw}`;
};

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
    const [imgError, setImgError] = useState<{ [key: string]: boolean }>({});
    const [actionTarget, setActionTarget] = useState<any | null>(null);

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

            const apply = (list: any[]) => {
                const updated = list.map((s) => {
                    if (s.email === msg.senderEmail) {
                        return {
                            ...s,
                            unreadCount: (s.unreadCount || 0) + 1,
                            lastMessage: {
                                text: msg.imageUrl ? "📷 Photo" : msg.text,
                                createdAt: msg.createdAt,
                                senderEmail: msg.senderEmail,
                            },
                        };
                    }
                    return s;
                });
                updated.sort(
                    (a, b) =>
                        new Date(b.lastMessage?.createdAt || 0).getTime() -
                        new Date(a.lastMessage?.createdAt || 0).getTime()
                );
                return updated;
            };

            setStudents((prev) => apply(prev));
            setFiltered((prev) => apply(prev));
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
            if (!lower.endsWith("@students.riphah.edu.pk")) {
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
            return d.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" });
        }
        const dayMs = 24 * 60 * 60 * 1000;
        if (now.getTime() - d.getTime() < 7 * dayMs) {
            return d.toLocaleDateString("en-PK", { weekday: "short" });
        }
        return d.toLocaleDateString("en-PK", { day: "numeric", month: "short" });
    };

    const deleteConversation = async (item: any) => {
        try {
            await axios.delete(
                `${CONSTANT.API_BASE_URL}/api/chat/conversation/${myEmail}/${item.email}`
            );
            setStudents((prev) =>
                prev.map((s) =>
                    s.email === item.email
                        ? { ...s, lastMessage: null, unreadCount: 0 }
                        : s
                )
            );
            setFiltered((prev) =>
                prev.map((s) =>
                    s.email === item.email
                        ? { ...s, lastMessage: null, unreadCount: 0 }
                        : s
                )
            );
        } catch (err) {
            console.log("Delete chat error:", err);
            Alert.alert("Error", "Could not delete chat. Try again.");
        }
    };

    const confirmDelete = (item: any) => {
        setActionTarget(null);
        Alert.alert(
            "Delete chat?",
            `This will permanently delete your conversation with ${item.fullName}.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteConversation(item),
                },
            ]
        );
    };

    const renderAvatar = (item: any, size = 52) => {
        const uri = !imgError[item.email] ? resolveAvatarUri(item.profileImage) : null;
        const [c1, c2] = colorForName(item.fullName || item.email);
        if (uri) {
            return (
                <Image
                    source={{ uri }}
                    style={{ width: size, height: size, borderRadius: size / 2 }}
                    onError={() =>
                        setImgError((prev) => ({ ...prev, [item.email]: true }))
                    }
                />
            );
        }
        return (
            <View
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: c1,
                    borderWidth: 1.5,
                    borderColor: c2,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text style={[styles.avatarLetter, { fontSize: size * 0.42 }]}>
                    {(item.fullName || item.email)?.trim()?.[0]?.toUpperCase() || "S"}
                </Text>
            </View>
        );
    };

    const renderItem = ({ item }: { item: any }) => {
        const isUnread = item.unreadCount > 0;
        const lastMsgPreview = item.lastMessage
            ? (item.lastMessage.imageUrl
                ? "📷 Photo"
                : (item.lastMessage.senderEmail === myEmail ? "You: " : "") +
                  (item.lastMessage.text || ""))
            : item.department || "Riphah Student";

        return (
            <Pressable
                android_ripple={{ color: "#E5E7EB" }}
                style={({ pressed }) => [
                    styles.studentRow,
                    pressed && Platform.OS === "ios" && { backgroundColor: "#F3F4F6" },
                ]}
                onLongPress={() => setActionTarget(item)}
                delayLongPress={250}
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
                <View style={styles.avatarWrap}>
                    {renderAvatar(item, 52)}
                    <View style={styles.onlineDot} />
                </View>

                <View style={{ flex: 1, marginLeft: 14 }}>
                    <View style={styles.rowTop}>
                        <Text
                            style={[styles.studentName, isUnread && { fontWeight: "800" }]}
                            numberOfLines={1}
                        >
                            {item.fullName}
                        </Text>
                        {item.lastMessage && (
                            <Text
                                style={[
                                    styles.timeText,
                                    isUnread && { color: "#193648", fontWeight: "700" },
                                ]}
                            >
                                {formatTime(item.lastMessage.createdAt)}
                            </Text>
                        )}
                    </View>

                    <View style={styles.rowBottom}>
                        <Text
                            style={[
                                styles.lastMsg,
                                isUnread && { color: "#111827", fontWeight: "600" },
                            ]}
                            numberOfLines={1}
                        >
                            {lastMsgPreview}
                        </Text>
                        {isUnread && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {item.unreadCount > 99 ? "99+" : item.unreadCount}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </Pressable>
        );
    };

    if (!isRiphah) {
        return (
            <View style={styles.centerBox}>
                <MaterialCommunityIcons name="shield-lock" size={54} color="#193648" />
                <Text style={styles.restrictTitle}>Riphah Students Only</Text>
                <Text style={styles.restrictSub}>
                    This chat feature is exclusively for Riphah students.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Messages</Text>
                    <Text style={styles.headerSub}>Riphah student network</Text>
                </View>
                <View style={styles.verifiedPill}>
                    <MaterialCommunityIcons name="shield-check" size={13} color="#34D399" />
                    <Text style={styles.verifiedText}>Verified</Text>
                </View>
            </View>

            {/* ── Search ── */}
            <View style={styles.searchWrap}>
                <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
                <TextInput
                    value={search}
                    onChangeText={handleSearch}
                    placeholder="Search students or chats"
                    placeholderTextColor="#9CA3AF"
                    style={styles.searchInput}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => handleSearch("")}>
                        <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <ActivityIndicator color="#193648" style={{ marginTop: 40 }} size="large" />
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.email}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 30 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => {
                                setRefreshing(true);
                                loadData();
                            }}
                            colors={["#193648"]}
                            tintColor="#193648"
                        />
                    }
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    ListEmptyComponent={
                        <View style={styles.centerBox}>
                            <MaterialCommunityIcons
                                name="message-text-outline"
                                size={56}
                                color="#D1D5DB"
                            />
                            <Text style={styles.emptyText}>No conversations yet</Text>
                            <Text style={styles.emptySub}>
                                Pull down to refresh
                            </Text>
                        </View>
                    }
                />
            )}

            {/* ── Action sheet (long-press menu) ── */}
            <Modal
                transparent
                visible={!!actionTarget}
                animationType="fade"
                onRequestClose={() => setActionTarget(null)}
            >
                <Pressable style={styles.sheetBackdrop} onPress={() => setActionTarget(null)}>
                    <Pressable style={styles.sheet}>
                        <View style={styles.sheetHandle} />
                        <View style={styles.sheetHeader}>
                            {actionTarget && renderAvatar(actionTarget, 44)}
                            <View style={{ marginLeft: 12, flex: 1 }}>
                                <Text style={styles.sheetName} numberOfLines={1}>
                                    {actionTarget?.fullName || "Student"}
                                </Text>
                                <Text style={styles.sheetSub} numberOfLines={1}>
                                    {actionTarget?.email}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.sheetItem}
                            onPress={() => {
                                const t = actionTarget;
                                setActionTarget(null);
                                if (t) {
                                    navigation.navigate("ChatRoom", {
                                        otherEmail: t.email,
                                        otherName: t.fullName,
                                        otherAvatar: t.profileImage || null,
                                        myEmail,
                                        myName,
                                    });
                                }
                            }}
                        >
                            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#193648" />
                            <Text style={styles.sheetItemText}>Open chat</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.sheetItem}
                            onPress={() => actionTarget && confirmDelete(actionTarget)}
                        >
                            <Ionicons name="trash-outline" size={20} color="#EF4444" />
                            <Text style={[styles.sheetItemText, { color: "#EF4444" }]}>
                                Delete chat
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.sheetItem, { borderTopWidth: 0 }]}
                            onPress={() => setActionTarget(null)}
                        >
                            <Ionicons name="close" size={20} color="#6B7280" />
                            <Text style={[styles.sheetItemText, { color: "#6B7280" }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7F8FA" },

    header: {
        backgroundColor: "#193648",
        flexDirection: "row",
        alignItems: "center",
        paddingTop: Platform.OS === "ios" ? 52 : 22,
        paddingHorizontal: 16,
        paddingBottom: 18,
        gap: 10,
        borderBottomLeftRadius: 22,
        borderBottomRightRadius: 22,
        elevation: 6,
        shadowColor: "#193648",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.12)",
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: { color: "#fff", fontSize: 19, fontWeight: "800", letterSpacing: 0.2 },
    headerSub: { color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 2 },
    verifiedPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(52,211,153,0.18)",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    verifiedText: { color: "#34D399", fontSize: 11, fontWeight: "700" },

    searchWrap: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginHorizontal: 14,
        marginTop: 14,
        marginBottom: 6,
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === "ios" ? 12 : 8,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    searchInput: { flex: 1, fontSize: 14, color: "#111827", padding: 0 },

    studentRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    avatarWrap: { position: "relative" },
    avatarLetter: { color: "#fff", fontWeight: "800" },

    onlineDot: {
        position: "absolute",
        bottom: 1,
        right: 1,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#10B981",
        borderWidth: 2.5,
        borderColor: "#fff",
    },

    rowTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
    studentName: { fontSize: 15.5, fontWeight: "700", color: "#111827", flex: 1, marginRight: 8 },
    timeText: { fontSize: 11, color: "#9CA3AF" },

    rowBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    lastMsg: { fontSize: 13, color: "#6B7280", flex: 1, marginRight: 8 },

    badge: {
        backgroundColor: "#193648",
        borderRadius: 11,
        minWidth: 22,
        height: 22,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 7,
    },
    badgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },

    separator: { height: StyleSheet.hairlineWidth, backgroundColor: "#EEF1F4", marginLeft: 82 },

    centerBox: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32, marginTop: 60 },
    restrictTitle: { fontSize: 18, fontWeight: "800", color: "#111827", marginTop: 14, marginBottom: 6 },
    restrictSub: { fontSize: 13, color: "#6B7280", textAlign: "center", lineHeight: 20 },
    emptyText: { fontSize: 16, fontWeight: "700", color: "#9CA3AF", marginTop: 14 },
    emptySub: { fontSize: 13, color: "#C4C9D4", marginTop: 6 },

    // ── Action sheet ──
    sheetBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: Platform.OS === "ios" ? 28 : 14,
        paddingTop: 8,
    },
    sheetHandle: {
        alignSelf: "center",
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#E5E7EB",
        marginBottom: 10,
    },
    sheetHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingBottom: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E5E7EB",
    },
    sheetName: { fontSize: 15, fontWeight: "700", color: "#111827" },
    sheetSub: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
    sheetItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#F3F4F6",
    },
    sheetItemText: { fontSize: 15, fontWeight: "600", color: "#193648" },
});

export default ChatListScreen;