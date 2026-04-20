
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Animated,
//   Dimensions,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// // ── Change this to your backend URL ─────────────────────────────
// // Local dev:   "http://192.168.x.x:4500"  (your machine's local IP)
// // Production:  "https://your-api.com"
// const CXBOT_API = "http://192.168.0.245:5000"; // ← update this IP

// const { width, height } = Dimensions.get("window");

// // ─── Types ───────────────────────────────────────────────────────
// interface Message {
//   id: string;
//   role: "user" | "bot";
//   text: string;
//   time: string;
//   status?: "sending" | "sent" | "error";
// }

// // ─── Quick prompts shown at start ────────────────────────────────
// const QUICK_PROMPTS = [
//   "How do I post an internship?",
//   "MOU process explain karo",
//   "Student applications kaise manage karun?",
//   "Event banane ka tarika?",
// ];

// // ─── Helpers ─────────────────────────────────────────────────────
// const nowTime = () =>
//   new Date().toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" });

// const uid = () => Math.random().toString(36).slice(2, 9);

// // ─── Single message bubble ────────────────────────────────────────
// function Bubble({ msg }: { msg: Message }) {
//   const isUser = msg.role === "user";
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(isUser ? 20 : -20)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
//       Animated.spring(slideAnim, { toValue: 0, tension: 70, friction: 10, useNativeDriver: true }),
//     ]).start();
//   }, []);

//   return (
//     <Animated.View
//       style={[
//         bs.row,
//         isUser ? bs.rowUser : bs.rowBot,
//         { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
//       ]}
//     >
//       {/* Bot avatar */}
//       {!isUser && (
//         <LinearGradient colors={["#0066CC", "#004999"]} style={bs.botAvatar}>
//           <Text style={bs.botAvatarTxt}>CX</Text>
//         </LinearGradient>
//       )}

//       <View style={isUser ? bs.maxUser : bs.maxBot}>
//         {isUser ? (
//           <LinearGradient colors={["#0066CC", "#0052AA"]} style={bs.bubbleUser}
//             start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
//             <Text style={bs.textUser}>{msg.text}</Text>
//           </LinearGradient>
//         ) : (
//           <View style={bs.bubbleBot}>
//             <Text style={bs.textBot}>{msg.text}</Text>
//           </View>
//         )}

//         <View style={[bs.metaRow, isUser && { justifyContent: "flex-end" }]}>
//           <Text style={bs.timeText}>{msg.time}</Text>
//           {isUser && (
//             <Ionicons
//               name={msg.status === "error" ? "alert-circle" : "checkmark-done"}
//               size={13}
//               color={msg.status === "error" ? "#EF4444" : "#93C5FD"}
//               style={{ marginLeft: 3 }}
//             />
//           )}
//         </View>
//       </View>
//     </Animated.View>
//   );
// }

// // ─── Typing indicator ────────────────────────────────────────────
// function TypingDots() {
//   const dot1 = useRef(new Animated.Value(0)).current;
//   const dot2 = useRef(new Animated.Value(0)).current;
//   const dot3 = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const anim = (dot: Animated.Value, delay: number) =>
//       Animated.loop(
//         Animated.sequence([
//           Animated.delay(delay),
//           Animated.timing(dot, { toValue: -6, duration: 280, useNativeDriver: true }),
//           Animated.timing(dot, { toValue: 0, duration: 280, useNativeDriver: true }),
//           Animated.delay(560),
//         ])
//       );
//     anim(dot1, 0).start();
//     anim(dot2, 160).start();
//     anim(dot3, 320).start();
//   }, []);

//   return (
//     <View style={bs.row}>
//       <LinearGradient colors={["#0066CC", "#004999"]} style={bs.botAvatar}>
//         <Text style={bs.botAvatarTxt}>CX</Text>
//       </LinearGradient>
//       <View style={[bs.bubbleBot, { paddingVertical: 14, paddingHorizontal: 18, flexDirection: "row", gap: 5 }]}>
//         {[dot1, dot2, dot3].map((d, i) => (
//           <Animated.View key={i} style={[bs.dot, { transform: [{ translateY: d }] }]} />
//         ))}
//       </View>
//     </View>
//   );
// }

// // ─── MAIN CHAT SCREEN ────────────────────────────────────────────
// export function AIChatbotScreen() {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: uid(),
//       role: "bot",
//       text: "Assalam o Alaikum! 👋 Main CXbot hoon — CollaXion ka AI assistant. Internships, MOUs, events ya koi bhi sawaal poochein!",
//       time: nowTime(),
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [typing, setTyping] = useState(false);
//   const scrollRef = useRef<ScrollView>(null);

//   // History for Gemini (role: user | model)
//   const historyRef = useRef<{ role: string; text: string }[]>([]);

//   const scrollBottom = () =>
//     setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

//   const sendMessage = async (text: string) => {
//     const trimmed = text.trim();
//     if (!trimmed || typing) return;

//     const userMsg: Message = { id: uid(), role: "user", text: trimmed, time: nowTime(), status: "sending" };
//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     scrollBottom();

//     // Add to history
//     historyRef.current.push({ role: "user", text: trimmed });

//     setTyping(true);

//     try {
//       const res = await fetch(`${CXBOT_API}/api/cxbot/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ messages: historyRef.current }),
//       });

//       const data = await res.json();
//       const reply = data.reply || "Maafi chahta hoon, kuch masla aa gaya. Dobara try karein.";

//       // Update history with bot reply
//       historyRef.current.push({ role: "model", text: reply });

//       setMessages((prev) =>
//         prev.map((m) => (m.id === userMsg.id ? { ...m, status: "sent" } : m))
//       );

//       const botMsg: Message = { id: uid(), role: "bot", text: reply, time: nowTime() };
//       setMessages((prev) => [...prev, botMsg]);
//     } catch (err) {
//       setMessages((prev) =>
//         prev.map((m) => (m.id === userMsg.id ? { ...m, status: "error" } : m))
//       );
//       const errMsg: Message = {
//         id: uid(),
//         role: "bot",
//         text: "⚠️ Network error. Backend se connect nahi ho saka. Check karein ke server chal raha hai.",
//         time: nowTime(),
//       };
//       setMessages((prev) => [...prev, errMsg]);
//     } finally {
//       setTyping(false);
//       scrollBottom();
//     }
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: "#F0F4F8" }}>
//       <StatusBar barStyle="light-content" backgroundColor="#050D1A" />

//       {/* ── Header ── */}
//       <LinearGradient colors={["#050D1A", "#0A1628"]} style={cs.header}
//         start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
//         <View style={cs.headerRow}>
//           {/* Bot avatar */}
//           <LinearGradient colors={["#0066CC", "#004999"]} style={cs.headerAvatar}>
//             <Text style={cs.headerAvatarTxt}>CX</Text>
//           </LinearGradient>

//           <View style={{ flex: 1, marginLeft: 12 }}>
//             <Text style={cs.headerName}>CXbot</Text>
//             <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
//               <View style={[cs.dot, { backgroundColor: typing ? "#F59E0B" : "#22C55E" }]} />
//               <Text style={cs.headerSub}>{typing ? "Typing..." : "Online · AI Assistant"}</Text>
//             </View>
//           </View>

//           <View style={cs.headerBadge}>
//             <Ionicons name="sparkles" size={12} color="#F59E0B" />
//             <Text style={cs.headerBadgeTxt}>Gemini</Text>
//           </View>
//         </View>
//       </LinearGradient>

//       {/* ── Chat area ── */}
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
//       >
//         <ScrollView
//           ref={scrollRef}
//           style={{ flex: 1 }}
//           contentContainerStyle={cs.chatContent}
//           showsVerticalScrollIndicator={false}
//           onContentSizeChange={scrollBottom}
//         >
//           {/* Quick prompts — only show if only 1 message (welcome) */}
//           {messages.length === 1 && (
//             <View style={cs.quickWrap}>
//               <Text style={cs.quickLabel}>💡 Quick questions</Text>
//               {QUICK_PROMPTS.map((q, i) => (
//                 <TouchableOpacity key={i} style={cs.quickBtn} onPress={() => sendMessage(q)}>
//                   <Text style={cs.quickBtnTxt}>{q}</Text>
//                   <Ionicons name="arrow-forward" size={13} color="#0066CC" />
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}

//           {messages.map((msg) => (
//             <Bubble key={msg.id} msg={msg} />
//           ))}

//           {typing && <TypingDots />}
//           <View style={{ height: 16 }} />
//         </ScrollView>

//         {/* ── Input bar ── */}
//         <View style={cs.inputWrap}>
//           <View style={cs.inputRow}>
//             <TextInput
//               style={cs.input}
//               value={input}
//               onChangeText={setInput}
//               placeholder="CXbot se poochein..."
//               placeholderTextColor="#94A3B8"
//               multiline
//               maxLength={500}
//               onSubmitEditing={() => sendMessage(input)}
//             />
//             <TouchableOpacity
//               style={[cs.sendBtn, (!input.trim() || typing) && cs.sendBtnDisabled]}
//               onPress={() => sendMessage(input)}
//               disabled={!input.trim() || typing}
//             >
//               {typing ? (
//                 <ActivityIndicator size="small" color="#fff" />
//               ) : (
//                 <Ionicons name="send" size={18} color="#fff" />
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// // ─── FLOATING BUTTON + MODAL WRAPPER ────────────────────────────
// // Drop this anywhere in your dashboard layout to get the WhatsApp-style button

// export function CXbotFloatingButton() {
//   const [open, setOpen] = useState(false);
//   const scaleAnim = useRef(new Animated.Value(1)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;

//   // Pulse animation on button
//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, { toValue: 1.18, duration: 1200, useNativeDriver: true }),
//         Animated.timing(pulseAnim, { toValue: 1,    duration: 1200, useNativeDriver: true }),
//       ])
//     ).start();
//   }, []);

//   const onPress = () => {
//     Animated.sequence([
//       Animated.timing(scaleAnim, { toValue: 0.88, duration: 80, useNativeDriver: true }),
//       Animated.spring(scaleAnim, { toValue: 1, tension: 120, friction: 6, useNativeDriver: true }),
//     ]).start();
//     setOpen(true);
//   };

//   return (
//     <>
//       {/* Floating button */}
//       <Animated.View style={[fb.container, { transform: [{ scale: scaleAnim }] }]}>
//         {/* Pulse ring */}
//         <Animated.View style={[fb.pulse, { transform: [{ scale: pulseAnim }] }]} />

//         <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
//           <LinearGradient colors={["#0066CC", "#004999"]} style={fb.btn}
//             start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
//             <Ionicons name="sparkles" size={22} color="#F59E0B" />
//           </LinearGradient>
//         </TouchableOpacity>

//         {/* Label */}
//         <View style={fb.label}>
//           <Text style={fb.labelTxt}>CXbot</Text>
//         </View>
//       </Animated.View>

//       {/* Full-screen chat modal */}
//       <Modal visible={open} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setOpen(false)}>
//         <View style={{ flex: 1 }}>
//           {/* Close button row */}
//           <View style={fb.modalClose}>
//             <TouchableOpacity onPress={() => setOpen(false)} style={fb.closeBtn}>
//               <Ionicons name="chevron-down" size={20} color="#64748B" />
//               <Text style={fb.closeTxt}>Close</Text>
//             </TouchableOpacity>
//           </View>
//           <AIChatbotScreen />
//         </View>
//       </Modal>
//     </>
//   );
// }

// // ─── Bubble styles ────────────────────────────────────────────────
// const bs = StyleSheet.create({
//   row:         { flexDirection: "row", alignItems: "flex-end", marginBottom: 6, paddingHorizontal: 12 },
//   rowUser:     { justifyContent: "flex-end" },
//   rowBot:      { justifyContent: "flex-start", gap: 8 },
//   botAvatar:   { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", marginBottom: 2 },
//   botAvatarTxt:{ fontSize: 11, fontWeight: "900", color: "#fff" },
//   maxUser:     { maxWidth: width * 0.72 },
//   maxBot:      { maxWidth: width * 0.72 },
//   bubbleUser:  { borderRadius: 20, borderBottomRightRadius: 5, paddingHorizontal: 14, paddingVertical: 10 },
//   bubbleBot:   { backgroundColor: "#fff", borderRadius: 20, borderBottomLeftRadius: 5,
//     paddingHorizontal: 14, paddingVertical: 10,
//     shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
//   textUser:    { fontSize: 14, color: "#fff", lineHeight: 20 },
//   textBot:     { fontSize: 14, color: "#0A1628", lineHeight: 20 },
//   metaRow:     { flexDirection: "row", alignItems: "center", marginTop: 3, paddingHorizontal: 4 },
//   timeText:    { fontSize: 10, color: "#94A3B8" },
//   dot:         { width: 8, height: 8, borderRadius: 4, backgroundColor: "#4CAF50" },
// });

// // ─── Chat screen styles ───────────────────────────────────────────
// const cs = StyleSheet.create({
//   header:      { paddingTop: Platform.OS === "ios" ? 56 : 44, paddingBottom: 14, paddingHorizontal: 16 },
//   headerRow:   { flexDirection: "row", alignItems: "center" },
//   headerAvatar:{ width: 42, height: 42, borderRadius: 21, justifyContent: "center", alignItems: "center",
//     borderWidth: 2, borderColor: "#F59E0B" },
//   headerAvatarTxt: { fontSize: 14, fontWeight: "900", color: "#fff" },
//   headerName:  { fontSize: 16, fontWeight: "800", color: "#fff" },
//   headerSub:   { fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: "500" },
//   dot:         { width: 7, height: 7, borderRadius: 4 },
//   headerBadge: { flexDirection: "row", alignItems: "center", gap: 4,
//     backgroundColor: "rgba(245,158,11,0.15)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
//   headerBadgeTxt: { fontSize: 11, color: "#F59E0B", fontWeight: "700" },

//   chatContent: { paddingTop: 16, paddingBottom: 8 },

//   quickWrap:   { marginHorizontal: 16, marginBottom: 20, backgroundColor: "#fff",
//     borderRadius: 18, padding: 14, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
//   quickLabel:  { fontSize: 13, fontWeight: "700", color: "#475569", marginBottom: 10 },
//   quickBtn:    { flexDirection: "row", alignItems: "center", justifyContent: "space-between",
//     backgroundColor: "#EFF6FF", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 7 },
//   quickBtnTxt: { fontSize: 13, color: "#0066CC", fontWeight: "600", flex: 1 },

//   inputWrap:   { backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 10,
//     paddingBottom: Platform.OS === "ios" ? 26 : 10,
//     borderTopWidth: 1, borderColor: "#E2E8F0" },
//   inputRow:    { flexDirection: "row", alignItems: "flex-end", gap: 8 },
//   input:       { flex: 1, backgroundColor: "#F8FAFC", borderRadius: 24,
//     paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: "#0A1628",
//     maxHeight: 100, borderWidth: 1, borderColor: "#E2E8F0" },
//   sendBtn:     { width: 44, height: 44, borderRadius: 22, backgroundColor: "#0066CC",
//     justifyContent: "center", alignItems: "center" },
//   sendBtnDisabled: { backgroundColor: "#94A3B8" },
// });

// // ─── Floating button styles ───────────────────────────────────────
// const fb = StyleSheet.create({
//   container:   { position: "absolute", bottom: 90, right: 18, alignItems: "center", zIndex: 999 },
//   pulse:       { position: "absolute", width: 60, height: 60, borderRadius: 30,
//     backgroundColor: "rgba(0,102,204,0.18)", zIndex: -1 },
//   btn:         { width: 56, height: 56, borderRadius: 28, justifyContent: "center", alignItems: "center",
//     shadowColor: "#0066CC", shadowOpacity: 0.45, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
//   label:       { backgroundColor: "#050D1A", paddingHorizontal: 8, paddingVertical: 3,
//     borderRadius: 10, marginTop: 5 },
//   labelTxt:    { fontSize: 10, color: "#F59E0B", fontWeight: "800" },

//   modalClose:  { backgroundColor: "#F8FAFC", paddingHorizontal: 16, paddingVertical: 10,
//     borderBottomWidth: 1, borderColor: "#E2E8F0" },
//   closeBtn:    { flexDirection: "row", alignItems: "center", gap: 4 },
//   closeTxt:    { fontSize: 14, color: "#64748B", fontWeight: "600" },
// });



// ─── AIChatbotScreen.tsx ─────────────────────────────────────────
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// const CXBOT_API = "http://192.168.0.245:5000";





import { CONSTANT } from "@/constants/constant";



const { width } = Dimensions.get("window");

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  time: string;
  status?: "sending" | "sent" | "error";
}

const QUICK_PROMPTS = [
  "How do I post an internship?",
  "Explain the MOU process.",
  "How do I manage student applications?",
  "How do I create an event?",
];

const nowTime = () =>
  new Date().toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" });

const uid = () => Math.random().toString(36).slice(2, 9);

// ─── Logo component ───────────────────────────────────────────────
function CXLogo({ size = 42, style = {} }: { size?: number; style?: any }) {
  const [imgError, setImgError] = useState(false);
  if (!imgError) {
    return (
      <Image
        source={require("../../assets/images/logo.png")}
        style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
        resizeMode="cover"
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <LinearGradient
      colors={["#193648", "#0D2137"]}
      style={[{ width: size, height: size, borderRadius: size / 2, justifyContent: "center", alignItems: "center" }, style]}
    >
      <Text style={{ fontSize: size * 0.28, fontWeight: "900", color: "#F59E0B" }}>CX</Text>
    </LinearGradient>
  );
}

// ─── Bubble ──────────────────────────────────────────────────────
function Bubble({ msg }: { msg: Message }) {
  const isUser    = msg.role === "user";
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(isUser ? 20 : -20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 70, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[bs.row, isUser ? bs.rowUser : bs.rowBot, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
      {!isUser && <View style={bs.botAvatarWrap}><CXLogo size={32} /></View>}
      <View style={isUser ? bs.maxUser : bs.maxBot}>
        {isUser ? (
          <LinearGradient colors={["#193648", "#0D2137"]} style={bs.bubbleUser} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={bs.textUser}>{msg.text}</Text>
          </LinearGradient>
        ) : (
          <View style={bs.bubbleBot}>
            <Text style={bs.textBot}>{msg.text}</Text>
          </View>
        )}
        <View style={[bs.metaRow, isUser && { justifyContent: "flex-end" }]}>
          <Text style={bs.timeText}>{msg.time}</Text>
          {isUser && (
            <Ionicons
              name={msg.status === "error" ? "alert-circle" : "checkmark-done"}
              size={13}
              color={msg.status === "error" ? "#EF4444" : "#93C5FD"}
              style={{ marginLeft: 3 }}
            />
          )}
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Typing dots ─────────────────────────────────────────────────
function TypingDots() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -6, duration: 280, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0,  duration: 280, useNativeDriver: true }),
          Animated.delay(560),
        ])
      );
    anim(dot1, 0).start();
    anim(dot2, 160).start();
    anim(dot3, 320).start();
  }, []);

  return (
    <View style={[bs.row, bs.rowBot]}>
      <View style={bs.botAvatarWrap}><CXLogo size={32} /></View>
      <View style={[bs.bubbleBot, { paddingVertical: 14, paddingHorizontal: 18, flexDirection: "row", gap: 5 }]}>
        {[dot1, dot2, dot3].map((d, i) => (
          <Animated.View key={i} style={[bs.dot, { transform: [{ translateY: d }] }]} />
        ))}
      </View>
    </View>
  );
}

// ─── MAIN CHAT SCREEN ────────────────────────────────────────────
export function AIChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uid(),
      role: "bot",
      text: "Hello! I'm CXbot, an AI assistant designed to help you with your questions. What would you like to explore today?",
      time: nowTime(),
    },
  ]);
  const [input, setInput]   = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef  = useRef<ScrollView>(null);
  const historyRef = useRef<{ role: string; text: string }[]>([]);

  const scrollBottom = () =>
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMsg: Message = { id: uid(), role: "user", text: trimmed, time: nowTime(), status: "sending" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    scrollBottom();
    historyRef.current.push({ role: "user", text: trimmed });
    setTyping(true);

    try {
      const res   = await fetch(`${CONSTANT.API_BASE_URL}/api/cxbot/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyRef.current }),
      });
      const data  = await res.json();
      const reply = data.reply || "Sorry, something went wrong. Please try again.";

      historyRef.current.push({ role: "model", text: reply });
      setMessages((prev) => prev.map((m) => m.id === userMsg.id ? { ...m, status: "sent" } : m));
      setMessages((prev) => [...prev, { id: uid(), role: "bot", text: reply, time: nowTime() }]);
    } catch {
      setMessages((prev) => prev.map((m) => m.id === userMsg.id ? { ...m, status: "error" } : m));
      setMessages((prev) => [...prev, {
        id: uid(), role: "bot", time: nowTime(),
        text: "⚠️ Network error. Could not connect to the server. Please check your connection and try again.",
      }]);
    } finally {
      setTyping(false);
      scrollBottom();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F0F4F8" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0D2137" />

      {/* ── Header ── */}
      <LinearGradient colors={["#F8FAFC", "#EEF2F7"]} style={cs.header}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
       

        <View style={cs.headerRow}>
          {/* Logo */}
          <View style={cs.avatarWrap}>
            <CXLogo size={46} />
            <View style={cs.onlineDot} />
          </View>

          <View style={{ flex: 1, marginLeft: 12 }}>
            {/* ← "CollaXion Assistant" — no Gemini badge */}
            <Text style={cs.headerName}>CollaXion Assistant</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <View style={[cs.statusDot, { backgroundColor: typing ? "#F59E0B" : "#22C55E" }]} />
              <Text style={cs.headerSub}>{typing ? "Typing..." : "Online · AI Assistant"}</Text>
            </View>
          </View>

          {/* CXbot pill only */}
          {/* <View style={cs.cxPill}>
            <Ionicons name="sparkles" size={11} color="#F59E0B" />
            <Text style={cs.cxPillTxt}>CXbot</Text>
          </View> */}
        </View>
      </LinearGradient>

      {/* ── Chat ── */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={cs.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollBottom}
        >
          {messages.length === 1 && (
            <View style={cs.quickWrap}>
              <View style={cs.quickHeader}>
                <Ionicons name="bulb-outline" size={14} color="#193648" />
                <Text style={cs.quickLabel}>Quick Questions</Text>
              </View>
              {QUICK_PROMPTS.map((q, i) => (
                <TouchableOpacity key={i} style={cs.quickBtn} onPress={() => sendMessage(q)}>
                  <Text style={cs.quickBtnTxt}>{q}</Text>
                  <Ionicons name="arrow-forward" size={13} color="#193648" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {messages.map((msg) => <Bubble key={msg.id} msg={msg} />)}
          {typing && <TypingDots />}
          <View style={{ height: 16 }} />
        </ScrollView>

        {/* ── Input ── */}
        <View style={cs.inputWrap}>
          <View style={cs.inputRow}>
            <TextInput
              style={cs.input}
              value={input}
              onChangeText={setInput}
              placeholder="Ask CXbot anything..."
              placeholderTextColor="#94A3B8"
              multiline
              maxLength={500}
              onSubmitEditing={() => sendMessage(input)}
            />
            {/* <TouchableOpacity
              style={[cs.sendBtn, (!input.trim() || typing) && cs.sendBtnDisabled]}
              onPress={() => sendMessage(input)}
              disabled={!input.trim() || typing}
            >
              {typing
                ? <ActivityIndicator size="small" color="#fff" />
                : <Ionicons name="send" size={18} color="#fff" />}
            </TouchableOpacity> */}

<TouchableOpacity
  onPress={() => sendMessage(input)}
  disabled={!input.trim() || typing}
>
  <LinearGradient
    colors={["#193648", "#0D2137"]}
    style={[
      cs.sendBtn,
      (!input.trim() || typing) && cs.sendBtnDisabled
    ]}
  >
    {typing
      ? <ActivityIndicator size="small" color="#193648" />
      : <Ionicons name="send" size={18} color="#fff" />}
  </LinearGradient>
</TouchableOpacity>

          </View>
          <Text style={cs.inputHint}>Your AI assistant for CollaXion</Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── FLOATING BUTTON ─────────────────────────────────────────────
export function CXbotFloatingButton() {
  const [open, setOpen]     = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,   duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const onPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 120, friction: 6, useNativeDriver: true }),
    ]).start();
    setOpen(true);
  };

  return (
    <>
      <Animated.View style={[fb.container, { transform: [{ scale: scaleAnim }] }]}>
        <Animated.View style={[fb.pulse, { transform: [{ scale: pulseAnim }] }]} />

        <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={fb.btnTouch}>
          <LinearGradient colors={["#c7d2d8", "#e2e5e8"]} style={fb.btn}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <CXLogo size={36} />
            <View style={fb.sparkBadge}>
              <Ionicons name="sparkles" size={9} color="#F59E0B" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={fb.label}>
          <Text style={fb.labelTxt}>CXbot</Text>
        </View>
      </Animated.View>

      <Modal visible={open} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setOpen(false)}>
        <View style={{ flex: 1, backgroundColor: "#F0F4F8" }}>
          <View style={fb.modalClose}>
            <View style={fb.dragHandle} />
            <TouchableOpacity onPress={() => setOpen(false)} style={fb.closeBtn}>
              <Ionicons name="chevron-down" size={20} color="#193648" />
              <Text style={fb.closeTxt}>Close</Text>
            </TouchableOpacity>
          </View>
          <AIChatbotScreen />
        </View>
      </Modal>
    </>
  );
}

// ─── Styles ──────────────────────────────────────────────────────
const bs = StyleSheet.create({
  row:           { flexDirection: "row", alignItems: "flex-end", marginBottom: 8, paddingHorizontal: 12 },
  rowUser:       { justifyContent: "flex-end" },
  rowBot:        { justifyContent: "flex-start", gap: 8 },
  botAvatarWrap: { marginBottom: 2 },
  maxUser:       { maxWidth: width * 0.72 },
  maxBot:        { maxWidth: width * 0.75 },
  bubbleUser:    { borderRadius: 20, borderBottomRightRadius: 4, paddingHorizontal: 14, paddingVertical: 11 },
  bubbleBot:     { backgroundColor: "#fff", borderRadius: 20, borderBottomLeftRadius: 4,
    paddingHorizontal: 14, paddingVertical: 11,
    shadowColor: "#193648", shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  textUser:      { fontSize: 14, color: "#fff", lineHeight: 21 },
  textBot:       { fontSize: 14, color: "#0D2137", lineHeight: 21 },
  metaRow:       { flexDirection: "row", alignItems: "center", marginTop: 4, paddingHorizontal: 4 },
  timeText:      { fontSize: 10, color: "#94A3B8" },
  dot:           { width: 8, height: 8, borderRadius: 4, backgroundColor: "#193648" },
});

const cs = StyleSheet.create({
  // header:      { paddingTop: Platform.OS === "ios" ? 56 : 44, paddingBottom: 18,
  //   paddingHorizontal: 16, overflow: "hidden" },
  header: {
  paddingTop: Platform.OS === "ios" ? 56 : 44,
  paddingBottom: 18,
  paddingHorizontal: 16,
  backgroundColor: "#fff",

  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 5,
},
  ring1:       { position: "absolute", width: 200, height: 200, borderRadius: 100,
    borderWidth: 1, borderColor: "rgba(245,158,11,0.08)", top: -60, right: -60 },
  ring2:       { position: "absolute", width: 120, height: 120, borderRadius: 60,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.04)", bottom: -30, left: -30 },
  headerRow:   { flexDirection: "row", alignItems: "center" },
  avatarWrap:  { position: "relative" },
  onlineDot:   { position: "absolute", bottom: 1, right: 1, width: 11, height: 11,
    borderRadius: 6, backgroundColor: "#22C55E", borderWidth: 2, borderColor: "#0D2137" },
  headerName:  { fontSize: 17, fontWeight: "800", color: "#0F172A", letterSpacing: 0.2 },
  headerSub:   { fontSize: 12, color: "#64748B", fontWeight: "500", marginTop: 2 },
  statusDot:   { width: 6, height: 6, borderRadius: 3 },
  cxPill:      { flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "rgba(245,158,11,0.15)", paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1, borderColor: "rgba(245,158,11,0.25)" },
  cxPillTxt:   { fontSize: 11, color: "#F59E0B", fontWeight: "800" },
  chatContent: { paddingTop: 18, paddingBottom: 8 },
  quickWrap:   { marginHorizontal: 16, marginBottom: 20, backgroundColor: "#fff",
    borderRadius: 18, padding: 14,
    shadowColor: "#193648", shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
    borderWidth: 1, borderColor: "rgba(25,54,72,0.06)" },
  quickHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
  quickLabel:  { fontSize: 13, fontWeight: "700", color: "#193648" },
  quickBtn:    { flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "#F0F7FF", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 11,
    marginBottom: 7, borderWidth: 1, borderColor: "rgba(25,54,72,0.08)" },
  quickBtnTxt: { fontSize: 13, color: "#193648", fontWeight: "600", flex: 1 },
  inputWrap:   { backgroundColor: "#fff", paddingHorizontal: 12, paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 28 : 12,
    borderTopWidth: 1, borderColor: "#E2E8F0" },
  inputRow:    { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  input:       { flex: 1, backgroundColor: "#F8FAFC", borderRadius: 24,
    paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: "#0D2137",
    maxHeight: 100, borderWidth: 1, borderColor: "#E2E8F0" },
  sendBtn:     { width: 44, height: 44, borderRadius: 22, backgroundColor: "#193648",
    justifyContent: "center", alignItems: "center" },
  sendBtnDisabled: { backgroundColor: "#94A3B8" },
  inputHint:   { fontSize: 10, color: "#CBD5E1", textAlign: "center", marginTop: 6, fontWeight: "500" },
});

const fb = StyleSheet.create({
  container:  { 
    position: "absolute", 
    bottom: 90, 
    right: 18, 
    alignItems: "center", 
    zIndex: 999 },
  pulse:      { 
    position: "absolute", 
    width: 64, 
    height: 64, 
    borderRadius: 32,
    backgroundColor: "rgba(235, 239, 241, 0.33)", 
    // zIndex: 999 
    shadowColor: "#1936480c",
    shadowOpacity: 0.01,
    shadowRadius: 32,
    elevation: 1,
  },
  btnTouch:   { borderRadius: 30 },
  btn:        { width: 58, height: 58, borderRadius: 29, justifyContent: "center", alignItems: "center",
    shadowColor: "#193648c4", shadowOpacity: 0.55, shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 }, elevation: 10 },
  sparkBadge: { position: "absolute", top: 2, right: 2, width: 18, height: 18, borderRadius: 9,
    backgroundColor: "#F8FAFC", justifyContent: "center", alignItems: "center",
    borderWidth: 1.5, borderColor: "#f3f2f0" },
  label:      { backgroundColor: "#193648", paddingHorizontal: 9, paddingVertical: 4,
    borderRadius: 10, marginTop: 5 },
  labelTxt:   { fontSize: 10, color: "#F8FAFC", fontWeight: "800" },
  modalClose: { backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8,
    borderBottomWidth: 1, borderColor: "#E2E8F0", alignItems: "center" },
  dragHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: "#CBD5E1", marginBottom: 8 },
  closeBtn:   { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start" },
  closeTxt:   { fontSize: 14, color: "#193648", fontWeight: "700" },
});





// const fb = StyleSheet.create({
//   container: {
//     position: "absolute",
//     bottom: 90,
//     right: 18,
//     alignItems: "center",
//     zIndex: 999,
//   },

//   // soft light pulse
//   pulse: {
//     position: "absolute",
//     width: 60,
//     height: 60,
//     borderRadius: 32,
//     backgroundColor: "rgba(255, 255, 255, 0.6)",
//     shadowColor: "#000",
//     shadowOpacity: 0.02,
//     shadowRadius: 10,
//     elevation: 2,
//   },

//   btnTouch: {
//     borderRadius: 30,
//   },

//   // 🌟 LIGHT BUTTON (main change)
  

//   sparkBadge: {
//     position: "absolute",
//     top: 2,
//     right: 2,
//     width: 18,
//     height: 18,
//     borderRadius: 9,
//     backgroundColor: "#fff",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1.5,
//     borderColor: "#eef2f6",
//   },

 

//  label:      { backgroundColor: "#193648", paddingHorizontal: 9, paddingVertical: 4,
//    borderRadius: 10, marginTop: 5 },
//  labelTxt:   { fontSize: 10, color: "#F8FAFC", fontWeight: "800" },
//   modalClose: { backgroundColor: "#fff", paddingHorizontal: 22, paddingTop: 10, paddingBottom: 8,
//     borderBottomWidth: 1, borderColor: "#E2E8F0", alignItems: "center" },
//   dragHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: "#CBD5E1", marginBottom: 8 },
//   closeBtn:   { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start" },
//   closeTxt:   { fontSize: 14, color: "#193648", fontWeight: "700" },
// });




