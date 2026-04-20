// import { CONSTANT } from "@/constants/constant";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import axios from "axios";
// import React, { useEffect, useRef, useState } from "react";
// import {
//     ActivityIndicator,
//     FlatList,
//     KeyboardAvoidingView,
//     Platform,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";

// import socket from "./utils/Socket";

// interface Msg {
//     _id?: string;
//     senderEmail: string;
//     receiverEmail: string;
//     senderName?: string;
//     text: string;
//     createdAt?: string;
// }

// const ChatRoomScreen = () => {
//     const navigation = useNavigation<any>();
//     const route = useRoute<any>();

//     const { otherEmail, otherName } = route.params || {};

//     const [myEmail, setMyEmail] = useState("");
//     const [myName, setMyName] = useState("");
//     const [messages, setMessages] = useState<Msg[]>([]);
//     const [inputText, setInputText] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [sending, setSending] = useState(false);
//     const [isTyping, setIsTyping] = useState(false);

//     const flatRef = useRef<FlatList>(null);
//     const typingTimeout = useRef<any>(null);

//     // ─── Load logged-in user ───
//     useEffect(() => {
//         const loadUser = async () => {
//             const email = await AsyncStorage.getItem("studentEmail");
//             const name = await AsyncStorage.getItem("studentFullName");
//             setMyEmail(email || "");
//             setMyName(name || "");
//         };
//         loadUser();
//     }, []);

//     // ─── Socket setup ───
//     useEffect(() => {
//         if (!myEmail) return;

//         socket.connect(CONSTANT.API_BASE_URL, myEmail);

//         const handleNewMessage = (msg: Msg) => {
//             const isRelevant =
//                 (msg.senderEmail === otherEmail &&
//                     msg.receiverEmail === myEmail) ||
//                 (msg.senderEmail === myEmail &&
//                     msg.receiverEmail === otherEmail);

//             if (!isRelevant) return;

//             setMessages((prev) => {
//                 // Avoid duplicate optimistic + real message
//                 const alreadyExists = prev.some(
//                     (m) =>
//                         m._id && m._id === msg._id
//                 );
//                 if (alreadyExists) return prev;

//                 // Replace optimistic (no _id) with real message
//                 if (
//                     msg.senderEmail === myEmail &&
//                     !msg._id
//                 ) {
//                     return prev;
//                 }

//                 return [...prev, msg];
//             });

//             setTimeout(
//                 () => flatRef.current?.scrollToEnd({ animated: true }),
//                 80
//             );
//         };

//         // ✅ Fixed: receives `data` object directly from Socket.js
//         const handleTyping = (data: any) => {
//             if (data.senderEmail === otherEmail) {
//                 setIsTyping(data.isTyping);
//             }
//         };

//         socket.on("newMessage", handleNewMessage);
//         socket.on("typingStatus", handleTyping);

//         return () => {
//             socket.off("newMessage", handleNewMessage);
//             socket.off("typingStatus", handleTyping);
//             socket.disconnect();
//         };
//     }, [myEmail]);

//     // ─── Fetch chat history ───
//     useEffect(() => {
//         if (!myEmail || !otherEmail) return;
//         fetchMessages();
//     }, [myEmail, otherEmail]);

//     const fetchMessages = async () => {
//         try {
//             const res = await axios.get(
//                 `${CONSTANT.API_BASE_URL}/api/chat/messages/${myEmail}/${otherEmail}`
//             );
//             setMessages(res.data.messages || []);
//             setTimeout(
//                 () => flatRef.current?.scrollToEnd({ animated: false }),
//                 100
//             );
//         } catch (err) {
//             console.log("Fetch messages error:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ─── Send message ───
//     const sendMessage = async () => {
//         const text = inputText.trim();
//         if (!text || sending) return;

//         setInputText("");
//         setSending(true);

//         // Optimistic UI
//         const optimistic: Msg = {
//             senderEmail: myEmail,
//             receiverEmail: otherEmail,
//             senderName: myName,
//             text,
//             createdAt: new Date().toISOString(),
//         };
//         setMessages((prev) => [...prev, optimistic]);
//         setTimeout(
//             () => flatRef.current?.scrollToEnd({ animated: true }),
//             80
//         );

//         // Send via WebSocket
//         socket.emit("sendMessage", {
//             senderEmail: myEmail,
//             senderName: myName,
//             receiverEmail: otherEmail,
//             text,
//         });

//         setSending(false);
//     };

//     // ─── Typing indicator ───
//     const handleTyping = (text: string) => {
//         setInputText(text);

//         socket.emit("typing", {
//             senderEmail: myEmail,
//             receiverEmail: otherEmail,
//             isTyping: true,
//         });

//         clearTimeout(typingTimeout.current);
//         typingTimeout.current = setTimeout(() => {
//             socket.emit("typing", {
//                 senderEmail: myEmail,
//                 receiverEmail: otherEmail,
//                 isTyping: false,
//             });
//         }, 1200);
//     };

//     const formatTime = (dateStr?: string) => {
//         if (!dateStr) return "";
//         return new Date(dateStr).toLocaleTimeString("en-PK", {
//             hour: "2-digit",
//             minute: "2-digit",
//         });
//     };

//     const renderMessage = ({ item }: { item: Msg }) => {
//         const isMe = item.senderEmail === myEmail;

//         return (
//             <View
//                 style={[
//                     styles.msgRow,
//                     isMe ? styles.msgRowMe : styles.msgRowOther,
//                 ]}
//             >
//                 {!isMe && (
//                     <View style={styles.avatar}>
//                         <Text style={styles.avatarText}>
//                             {otherName?.[0]?.toUpperCase() || "S"}
//                         </Text>
//                     </View>
//                 )}

//                 <View
//                     style={[styles.bubble, isMe ? styles.me : styles.other]}
//                 >
//                     <Text style={[styles.msgText, isMe && { color: "#fff" }]}>
//                         {item.text}
//                     </Text>
//                     <Text style={[styles.time, isMe && { color: "#cce0ed" }]}>
//                         {formatTime(item.createdAt)}
//                     </Text>
//                 </View>
//             </View>
//         );
//     };

//     if (!otherEmail || !otherName) {
//         return (
//             <View style={styles.centered}>
//                 <Text>Invalid Chat User</Text>
//             </View>
//         );
//     }

//     return (
//         <KeyboardAvoidingView
//             style={styles.container}
//             behavior={Platform.OS === "ios" ? "padding" : undefined}
//             keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
//         >
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity
//                     onPress={() => navigation.goBack()}
//                     style={styles.backBtn}
//                 >
//                     <Ionicons name="arrow-back" size={22} color="#fff" />
//                 </TouchableOpacity>

//                 <View style={styles.headerAvatar}>
//                     <Text style={styles.headerAvatarText}>
//                         {otherName?.[0]?.toUpperCase() || "S"}
//                     </Text>
//                 </View>

//                 <View style={{ flex: 1 }}>
//                     <Text style={styles.headerName}>{otherName}</Text>
//                     {isTyping && (
//                         <Text style={styles.typingText}>typing...</Text>
//                     )}
//                 </View>
//             </View>

//             {/* Messages */}
//             {loading ? (
//                 <ActivityIndicator
//                     style={{ marginTop: 40 }}
//                     color="#193648"
//                     size="large"
//                 />
//             ) : (
//                 <FlatList
//                     ref={flatRef}
//                     data={messages}
//                     keyExtractor={(item, i) => item._id || `opt-${i}`}
//                     renderItem={renderMessage}
//                     contentContainerStyle={{ padding: 10, paddingBottom: 20 }}
//                     onContentSizeChange={() =>
//                         flatRef.current?.scrollToEnd({ animated: false })
//                     }
//                 />
//             )}

//             {/* Input */}
//             <View style={styles.inputBox}>
//                 <TextInput
//                     value={inputText}
//                     onChangeText={handleTyping}
//                     placeholder="Message..."
//                     placeholderTextColor="#aaa"
//                     style={styles.input}
//                     multiline
//                 />
//                 <TouchableOpacity
//                     onPress={sendMessage}
//                     style={[
//                         styles.sendBtn,
//                         !inputText.trim() && { opacity: 0.5 },
//                     ]}
//                     disabled={!inputText.trim()}
//                 >
//                     <Ionicons name="send" size={18} color="#fff" />
//                 </TouchableOpacity>
//             </View>
//         </KeyboardAvoidingView>
//     );
// };

// export default ChatRoomScreen;

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#F4F6F8" },
//     centered: { flex: 1, justifyContent: "center", alignItems: "center" },

//     header: {
//         backgroundColor: "#193648",
//         paddingTop: Platform.OS === "ios" ? 52 : 22,
//         paddingHorizontal: 15,
//         paddingBottom: 14,
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 10,
//     },
//     backBtn: {
//         backgroundColor: "rgba(255,255,255,0.12)",
//         borderRadius: 20,
//         padding: 6,
//     },
//     headerAvatar: {
//         width: 36,
//         height: 36,
//         borderRadius: 18,
//         backgroundColor: "rgba(255,255,255,0.2)",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     headerAvatarText: { color: "#fff", fontSize: 16, fontWeight: "700" },
//     headerName: { color: "#fff", fontSize: 16, fontWeight: "700" },
//     typingText: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 1 },

//     msgRow: {
//         flexDirection: "row",
//         marginVertical: 3,
//         alignItems: "flex-end",
//     },
//     msgRowMe: { justifyContent: "flex-end" },
//     msgRowOther: { justifyContent: "flex-start" },

//     avatar: {
//         width: 28,
//         height: 28,
//         borderRadius: 14,
//         backgroundColor: "#193648",
//         justifyContent: "center",
//         alignItems: "center",
//         marginRight: 6,
//     },
//     avatarText: { color: "#fff", fontSize: 11, fontWeight: "700" },

//     bubble: {
//         maxWidth: "72%",
//         paddingHorizontal: 13,
//         paddingVertical: 9,
//         borderRadius: 18,
//     },
//     me: {
//         backgroundColor: "#193648",
//         borderBottomRightRadius: 4,
//     },
//     other: {
//         backgroundColor: "#fff",
//         borderBottomLeftRadius: 4,
//         shadowColor: "#000",
//         shadowOpacity: 0.05,
//         shadowRadius: 4,
//         elevation: 1,
//     },
//     msgText: { fontSize: 14, color: "#111", lineHeight: 20 },
//     time: {
//         fontSize: 10,
//         marginTop: 4,
//         color: "#999",
//         alignSelf: "flex-end",
//     },

//     inputBox: {
//         flexDirection: "row",
//         alignItems: "center",
//         padding: 10,
//         paddingBottom: Platform.OS === "ios" ? 24 : 10,
//         backgroundColor: "#fff",
//         borderTopWidth: 0.5,
//         borderTopColor: "#e5e7eb",
//         gap: 8,
//     },
//     input: {
//         flex: 1,
//         borderWidth: 1,
//         borderColor: "#e5e7eb",
//         borderRadius: 22,
//         paddingHorizontal: 16,
//         paddingVertical: 10,
//         fontSize: 14,
//         color: "#111",
//         backgroundColor: "#f9fafb",
//         maxHeight: 100,
//     },
//     sendBtn: {
//         backgroundColor: "#193648",
//         width: 42,
//         height: 42,
//         borderRadius: 21,
//         justifyContent: "center",
//         alignItems: "center",
//     },
// });


















// import { CONSTANT } from "@/constants/constant";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import axios from "axios";
// import * as ImagePicker from "expo-image-picker";
// import React, { useEffect, useRef, useState } from "react";
// import {
//     ActivityIndicator,
//     Alert,
//     FlatList,
//     Image,
//     KeyboardAvoidingView,
//     Platform,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";
// // import socket from "../utils/Socket";

// import socket from "./utils/Socket";


// interface Msg {
//     _id?: string;
//     senderEmail: string;
//     receiverEmail: string;
//     senderName?: string;
//     text?: string;
//     imageUrl?: string;
//     createdAt?: string;
//     isOptimistic?: boolean; // ✅ track optimistic msgs
// }

// const ChatRoomScreen = () => {
//     const navigation = useNavigation<any>();
//     const route = useRoute<any>();
//     const { otherEmail, otherName, otherAvatar } = route.params || {};

//     const [myEmail, setMyEmail] = useState("");
//     const [myName, setMyName] = useState("");
//     const [messages, setMessages] = useState<Msg[]>([]);
//     const [inputText, setInputText] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [sending, setSending] = useState(false);
//     const [isTyping, setIsTyping] = useState(false);

//     const flatRef = useRef<FlatList>(null);
//     const typingTimeout = useRef<any>(null);

//     // ─── Load logged-in user ───
//     useEffect(() => {
//         const loadUser = async () => {
//             const email = await AsyncStorage.getItem("studentEmail");
//             const name = await AsyncStorage.getItem("studentFullName");
//             setMyEmail(email || "");
//             setMyName(name || "");
//         };
//         loadUser();
//     }, []);

//     // ─── Socket setup ───
//     useEffect(() => {
//         if (!myEmail) return;

//         socket.connect(CONSTANT.API_BASE_URL, myEmail);

//         const handleNewMessage = (msg: Msg) => {
//             const isRelevant =
//                 (msg.senderEmail === otherEmail && msg.receiverEmail === myEmail) ||
//                 (msg.senderEmail === myEmail && msg.receiverEmail === otherEmail);

//             if (!isRelevant) return;

//             setMessages((prev) => {
//                 // ✅ FIX 1: Remove optimistic msg and replace with real one
//                 if (msg.senderEmail === myEmail) {
//                     const withoutOptimistic = prev.filter((m) => !m.isOptimistic);
//                     // avoid duplicate real msgs
//                     if (withoutOptimistic.some((m) => m._id === msg._id)) {
//                         return withoutOptimistic;
//                     }
//                     return [...withoutOptimistic, msg];
//                 }

//                 // incoming msg from other — just append if not duplicate
//                 if (prev.some((m) => m._id && m._id === msg._id)) return prev;
//                 return [...prev, msg];
//             });

//             setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 80);
//         };

//         const handleTyping = (data: any) => {
//             if (data.senderEmail === otherEmail) setIsTyping(data.isTyping);
//         };

//         socket.on("newMessage", handleNewMessage);
//         socket.on("typingStatus", handleTyping);

//         return () => {
//             socket.off("newMessage", handleNewMessage);
//             socket.off("typingStatus", handleTyping);
//             socket.disconnect();
//         };
//     }, [myEmail]);

//     // ─── Fetch chat history ───
//     useEffect(() => {
//         if (!myEmail || !otherEmail) return;
//         fetchMessages();
//     }, [myEmail, otherEmail]);

//     const fetchMessages = async () => {
//         try {
//             const res = await axios.get(
//                 `${CONSTANT.API_BASE_URL}/api/chat/messages/${myEmail}/${otherEmail}`
//             );
//             setMessages(res.data.messages || []);
//             setTimeout(() => flatRef.current?.scrollToEnd({ animated: false }), 100);
//         } catch (err) {
//             console.log("Fetch messages error:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ─── Send text message ───
//     const sendMessage = async () => {
//         const text = inputText.trim();
//         if (!text || sending) return;

//         setInputText("");
//         setSending(true);

//         // ✅ FIX 1: Mark optimistic so we can remove it when real msg arrives
//         const optimistic: Msg = {
//             senderEmail: myEmail,
//             receiverEmail: otherEmail,
//             senderName: myName,
//             text,
//             createdAt: new Date().toISOString(),
//             isOptimistic: true,
//         };
//         setMessages((prev) => [...prev, optimistic]);
//         setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 80);

//         socket.emit("sendMessage", {
//             senderEmail: myEmail,
//             senderName: myName,
//             receiverEmail: otherEmail,
//             text,
//         });

//         setSending(false);
//     };

//     // ─── Send image ───
//     const sendImage = async () => {
//         const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (!permission.granted) {
//             Alert.alert("Permission needed", "Allow gallery access to send images.");
//             return;
//         }

//         const result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: false,
//             quality: 0.7,
//         });

//         if (result.canceled || !result.assets?.length) return;

//         const asset = result.assets[0];
//         const formData = new FormData();
//         formData.append("image", {
//             uri: asset.uri,
//             name: asset.fileName || "photo.jpg",
//             type: asset.mimeType || "image/jpeg",
//         } as any);
//         formData.append("senderEmail", myEmail);
//         formData.append("senderName", myName);
//         formData.append("receiverEmail", otherEmail);

//         try {
//             setSending(true);
//             const res = await axios.post(
//                 `${CONSTANT.API_BASE_URL}/api/chat/send-image`,
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } }
//             );
//             if (res.data.success) {
//                 // server will broadcast via socket, but also add locally
//                 const imgMsg: Msg = {
//                     ...res.data.message,
//                     isOptimistic: false,
//                 };
//                 setMessages((prev) => [...prev, imgMsg]);
//                 setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 80);
//             }
//         } catch (err) {
//             Alert.alert("Error", "Image send failed. Try again.");
//             console.log("Image send error:", err);
//         } finally {
//             setSending(false);
//         }
//     };

//     // ─── Typing indicator ───
//     const handleTyping = (text: string) => {
//         setInputText(text);
//         socket.emit("typing", {
//             senderEmail: myEmail,
//             receiverEmail: otherEmail,
//             isTyping: true,
//         });
//         clearTimeout(typingTimeout.current);
//         typingTimeout.current = setTimeout(() => {
//             socket.emit("typing", {
//                 senderEmail: myEmail,
//                 receiverEmail: otherEmail,
//                 isTyping: false,
//             });
//         }, 1200);
//     };

//     const formatTime = (dateStr?: string) => {
//         if (!dateStr) return "";
//         return new Date(dateStr).toLocaleTimeString("en-PK", {
//             hour: "2-digit",
//             minute: "2-digit",
//         });
//     };

//     const renderMessage = ({ item }: { item: Msg }) => {
//         const isMe = item.senderEmail === myEmail;

//         return (
//             <View style={[styles.msgRow, isMe ? styles.msgRowMe : styles.msgRowOther]}>
//                 {/* ✅ FIX 3: Show other user's DP */}
//                 {!isMe && (
//                     <View style={styles.avatarWrap}>
//                         {otherAvatar ? (
//                             <Image
//                                 source={{ uri: `${CONSTANT.API_BASE_URL}${otherAvatar}` }}
//                                 style={styles.avatarImg}
//                             />
//                         ) : (
//                             <View style={styles.avatar}>
//                                 <Text style={styles.avatarText}>
//                                     {otherName?.[0]?.toUpperCase() || "S"}
//                                 </Text>
//                             </View>
//                         )}
//                     </View>
//                 )}

//                 <View style={[styles.bubble, isMe ? styles.me : styles.other]}>
//                     {/* ✅ FIX 4: Show image if imageUrl exists */}
//                     {item.imageUrl ? (
//                         <Image
//                             source={{ uri: `${CONSTANT.API_BASE_URL}${item.imageUrl}` }}
//                             style={styles.msgImage}
//                             resizeMode="cover"
//                         />
//                     ) : (
//                         <Text style={[styles.msgText, isMe && { color: "#fff" }]}>
//                             {item.text}
//                         </Text>
//                     )}
//                     <Text style={[styles.time, isMe && { color: "#cce0ed" }]}>
//                         {formatTime(item.createdAt)}
//                         {item.isOptimistic && (
//                             <Text style={{ color: "#cce0ed" }}> ⏳</Text>
//                         )}
//                     </Text>
//                 </View>
//             </View>
//         );
//     };

//     if (!otherEmail || !otherName) {
//         return (
//             <View style={styles.centered}>
//                 <Text>Invalid Chat User</Text>
//             </View>
//         );
//     }

//     return (
//         <KeyboardAvoidingView
//             style={styles.container}
//             behavior={Platform.OS === "ios" ? "padding" : undefined}
//             keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
//         >
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//                     <Ionicons name="arrow-back" size={22} color="#fff" />
//                 </TouchableOpacity>

//                 {/* ✅ FIX 3: Header DP */}
//                 <View style={styles.headerAvatarWrap}>
//                     {otherAvatar ? (
//                         <Image
//                             source={{ uri: `${CONSTANT.API_BASE_URL}${otherAvatar}` }}
//                             style={styles.headerAvatarImg}
//                         />
//                     ) : (
//                         <View style={styles.headerAvatar}>
//                             <Text style={styles.headerAvatarText}>
//                                 {otherName?.[0]?.toUpperCase() || "S"}
//                             </Text>
//                         </View>
//                     )}
//                 </View>

//                 <View style={{ flex: 1 }}>
//                     <Text style={styles.headerName}>{otherName}</Text>
//                     {isTyping && <Text style={styles.typingText}>typing...</Text>}
//                 </View>
//             </View>

//             {/* Messages */}
//             {loading ? (
//                 <ActivityIndicator style={{ marginTop: 40 }} color="#193648" size="large" />
//             ) : (
//                 <FlatList
//                     ref={flatRef}
//                     data={messages}
//                     keyExtractor={(item, i) => item._id || `opt-${i}`}
//                     renderItem={renderMessage}
//                     contentContainerStyle={{ padding: 10, paddingBottom: 20 }}
//                     onContentSizeChange={() =>
//                         flatRef.current?.scrollToEnd({ animated: false })
//                     }
//                 />
//             )}

//             {/* Input */}
//             <View style={styles.inputBox}>
//                 {/* ✅ FIX 4: Image picker button */}
//                 <TouchableOpacity onPress={sendImage} style={styles.imageBtn} disabled={sending}>
//                     <Ionicons name="image-outline" size={24} color="#193648" />
//                 </TouchableOpacity>

//                 <TextInput
//                     value={inputText}
//                     onChangeText={handleTyping}
//                     placeholder="Message..."
//                     placeholderTextColor="#aaa"
//                     style={styles.input}
//                     multiline
//                 />

//                 <TouchableOpacity
//                     onPress={sendMessage}
//                     style={[styles.sendBtn, !inputText.trim() && { opacity: 0.5 }]}
//                     disabled={!inputText.trim() || sending}
//                 >
//                     <Ionicons name="send" size={18} color="#fff" />
//                 </TouchableOpacity>
//             </View>
//         </KeyboardAvoidingView>
//     );
// };

// export default ChatRoomScreen;

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#F4F6F8" },
//     centered: { flex: 1, justifyContent: "center", alignItems: "center" },

//     header: {
//         backgroundColor: "#193648",
//         paddingTop: Platform.OS === "ios" ? 52 : 22,
//         paddingHorizontal: 15,
//         paddingBottom: 14,
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 10,
//     },
//     backBtn: {
//         backgroundColor: "rgba(255,255,255,0.12)",
//         borderRadius: 20,
//         padding: 6,
//     },
//     headerAvatarWrap: { marginRight: 2 },
//     headerAvatarImg: { width: 38, height: 38, borderRadius: 19 },
//     headerAvatar: {
//         width: 38,
//         height: 38,
//         borderRadius: 19,
//         backgroundColor: "rgba(255,255,255,0.2)",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     headerAvatarText: { color: "#fff", fontSize: 16, fontWeight: "700" },
//     headerName: { color: "#fff", fontSize: 16, fontWeight: "700" },
//     typingText: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 1 },

//     msgRow: { flexDirection: "row", marginVertical: 3, alignItems: "flex-end" },
//     msgRowMe: { justifyContent: "flex-end" },
//     msgRowOther: { justifyContent: "flex-start" },

//     avatarWrap: { marginRight: 6 },
//     avatarImg: { width: 30, height: 30, borderRadius: 15 },
//     avatar: {
//         width: 30,
//         height: 30,
//         borderRadius: 15,
//         backgroundColor: "#193648",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     avatarText: { color: "#fff", fontSize: 11, fontWeight: "700" },

//     bubble: {
//         maxWidth: "72%",
//         paddingHorizontal: 13,
//         paddingVertical: 9,
//         borderRadius: 18,
//     },
//     me: { backgroundColor: "#193648", borderBottomRightRadius: 4 },
//     other: {
//         backgroundColor: "#fff",
//         borderBottomLeftRadius: 4,
//         shadowColor: "#000",
//         shadowOpacity: 0.05,
//         shadowRadius: 4,
//         elevation: 1,
//     },
//     msgText: { fontSize: 14, color: "#111", lineHeight: 20 },
//     msgImage: { width: 200, height: 200, borderRadius: 12 },
//     time: { fontSize: 10, marginTop: 4, color: "#999", alignSelf: "flex-end" },

//     inputBox: {
//         flexDirection: "row",
//         alignItems: "center",
//         padding: 10,
//         paddingBottom: Platform.OS === "ios" ? 24 : 10,
//         backgroundColor: "#fff",
//         borderTopWidth: 0.5,
//         borderTopColor: "#e5e7eb",
//         gap: 8,
//     },
//     imageBtn: {
//         padding: 6,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     input: {
//         flex: 1,
//         borderWidth: 1,
//         borderColor: "#e5e7eb",
//         borderRadius: 22,
//         paddingHorizontal: 16,
//         paddingVertical: 10,
//         fontSize: 14,
//         color: "#111",
//         backgroundColor: "#f9fafb",
//         maxHeight: 100,
//     },
//     sendBtn: {
//         backgroundColor: "#193648",
//         width: 42,
//         height: 42,
//         borderRadius: 21,
//         justifyContent: "center",
//         alignItems: "center",
//     },
// });



















import { CONSTANT } from "@/constants/constant";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import socket from "./utils/Socket";

interface Msg {
    _id?: string;
    senderEmail: string;
    receiverEmail: string;
    senderName?: string;
    text?: string;
    imageUrl?: string;
    createdAt?: string;
    isOptimistic?: boolean;
}

/* ✅ helper */
const getInitial = (name?: string) => {
    if (!name || name.trim().length === 0) return "S";
    return name.trim().charAt(0).toUpperCase();
};

const ChatRoomScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { otherEmail, otherName } = route.params || {};

    const [myEmail, setMyEmail] = useState("");
    const [myName, setMyName] = useState("");
    const [messages, setMessages] = useState<Msg[]>([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const flatRef = useRef<FlatList>(null);
    const typingTimeout = useRef<any>(null);

    /* ─── Load user ─── */
    useEffect(() => {
        const loadUser = async () => {
            const email = await AsyncStorage.getItem("studentEmail");
            const name = await AsyncStorage.getItem("studentFullName");
            setMyEmail(email || "");
            setMyName(name || "");
        };
        loadUser();
    }, []);

    /* ─── Socket ─── */
    useEffect(() => {
        if (!myEmail) return;

        socket.connect(CONSTANT.API_BASE_URL, myEmail);

        const handleNewMessage = (msg: Msg) => {
            const isRelevant =
                (msg.senderEmail === otherEmail && msg.receiverEmail === myEmail) ||
                (msg.senderEmail === myEmail && msg.receiverEmail === otherEmail);

            if (!isRelevant) return;

            setMessages((prev) => {
                if (msg.senderEmail === myEmail) {
                    const withoutOptimistic = prev.filter((m) => !m.isOptimistic);
                    return [...withoutOptimistic, msg];
                }

                if (prev.some((m) => m._id === msg._id)) return prev;
                return [...prev, msg];
            });

            setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 80);
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.disconnect();
        };
    }, [myEmail]);

    /* ─── Fetch messages ─── */
    useEffect(() => {
        if (!myEmail || !otherEmail) return;
        fetchMessages();
    }, [myEmail, otherEmail]);

    const fetchMessages = async () => {
        try {
            const res = await axios.get(
                `${CONSTANT.API_BASE_URL}/api/chat/messages/${myEmail}/${otherEmail}`
            );
            setMessages(res.data.messages || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    /* ─── Send text ─── */
    const sendMessage = async () => {
        const text = inputText.trim();
        if (!text) return;

        setInputText("");

        socket.emit("sendMessage", {
            senderEmail: myEmail,
            receiverEmail: otherEmail,
            text,
        });
    };

    /* ─── Send image ─── */
    const sendImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permission needed");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (result.canceled) return;

        const asset = result.assets[0];

        const formData = new FormData();
        formData.append("image", {
            uri: asset.uri,
            name: "photo.jpg",
            type: "image/jpeg",
        } as any);
        formData.append("senderEmail", myEmail);
        formData.append("receiverEmail", otherEmail);

        try {
            setSending(true);

            const res = await axios.post(
                `${CONSTANT.API_BASE_URL}/api/chat/send-image`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.data.success) {
                setMessages((prev) => [...prev, res.data.message]);
            }
        } catch (err) {
            Alert.alert("Error sending image");
        } finally {
            setSending(false);
        }
    };

    /* ─── Render message ─── */
    const renderMessage = ({ item }: { item: Msg }) => {
        const isMe = item.senderEmail === myEmail;

        return (
            <View style={[styles.msgRow, isMe ? styles.meRow : styles.otherRow]}>

                {/* 🔤 ONLY LETTER DP (NO IMAGE ANYMORE) */}
                {!isMe && (
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {getInitial(otherName)}
                        </Text>
                    </View>
                )}

                <View style={[styles.bubble, isMe ? styles.me : styles.other]}>

                    {/* message OR image (chat images still allowed) */}
                    {item.imageUrl ? (
                        <Image
                            source={{
                                uri: `${CONSTANT.API_BASE_URL}${item.imageUrl}`,
                            }}
                            style={styles.msgImage}
                        />
                    ) : (
                        <Text style={{ color: isMe ? "#fff" : "#111" }}>
                            {item.text}
                        </Text>
                    )}

                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">

            {/* HEADER (ONLY LETTER DP) */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>

                {/* 🔤 ONLY INITIAL */}
                <View style={styles.headerAvatar}>
                    <Text style={styles.headerAvatarText}>
                        {getInitial(otherName)}
                    </Text>
                </View>

                <Text style={styles.headerName}>{otherName}</Text>
            </View>

            {/* CHAT */}
            {loading ? (
                <ActivityIndicator style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    ref={flatRef}
                    data={messages}
                    keyExtractor={(item, i) => item._id || i.toString()}
                    renderItem={renderMessage}
                />
            )}

            {/* INPUT */}
            <View style={styles.inputRow}>
                <TouchableOpacity onPress={sendImage}>
                    <Ionicons name="image" size={24} />
                </TouchableOpacity>

                <TextInput
                    value={inputText}
                    onChangeText={setInputText}
                    style={styles.input}
                    placeholder="Message..."
                />

                <TouchableOpacity onPress={sendMessage}>
                    <Ionicons name="send" size={24} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default ChatRoomScreen;

/* ─── STYLES ─── */
const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#193648",
        padding: 12,
        gap: 10,
    },

    headerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#444",
        justifyContent: "center",
        alignItems: "center",
    },

    headerAvatarText: {
        color: "#fff",
        fontWeight: "700",
    },

    headerName: {
        color: "#fff",
        fontWeight: "700",
    },

    msgRow: {
        flexDirection: "row",
        margin: 5,
        alignItems: "center",
    },

    meRow: { justifyContent: "flex-end" },
    otherRow: { justifyContent: "flex-start" },

    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#193648",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 5,
    },

    avatarText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
    },

    bubble: {
        padding: 10,
        borderRadius: 10,
        maxWidth: "70%",
    },

    me: { backgroundColor: "#193648" },
    other: { backgroundColor: "#eee" },

    msgImage: {
        width: 180,
        height: 180,
        borderRadius: 10,
    },

    inputRow: {
        flexDirection: "row",
        padding: 10,
        alignItems: "center",
        gap: 10,
    },

    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        paddingHorizontal: 10,
    },
});