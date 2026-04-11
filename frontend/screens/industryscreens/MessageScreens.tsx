import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  FlatList, Image, KeyboardAvoidingView, Platform,
  StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";
import { C, Header, sharedStyles } from "./shared";

// ═══════════════════════════════════════════════════════════════
//  MESSAGES LIST
// ═══════════════════════════════════════════════════════════════
export function MessagesScreen() {
  const nav = useNavigation<any>();
  const chats = [
    { id: 1, name: "Internship Incharge", sub: "Riphah International University", time: "10:30 AM", msg: "Research grant approved.", avatar: "https://ui-avatars.com/api/?name=II&background=0F2236&color=fff&bold=true", unread: 2 },
    { id: 2, name: "Industry Liaison",     sub: "Riphah International University", time: "Yesterday", msg: "When can we meet?", avatar: "https://ui-avatars.com/api/?name=IL&background=0D7377&color=fff&bold=true", unread: 0 },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Messages" back />
      <FlatList data={chats} keyExtractor={i => i.id.toString()} contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatItem} onPress={() => nav.navigate("ChatScreen", { contact: item })}>
            <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.chatTime}>{item.time}</Text>
              </View>
              <Text style={styles.chatSub}>{item.sub}</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={[styles.chatMsg, item.unread > 0 && { fontWeight: "700", color: C.text }]} numberOfLines={1}>{item.msg}</Text>
                {item.unread > 0 && <View style={styles.unreadDot}><Text style={styles.unreadNum}>{item.unread}</Text></View>}
              </View>
            </View>
          </TouchableOpacity>
        )} />
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CHAT SCREEN
// ═══════════════════════════════════════════════════════════════
export function ChatScreen({ route }: { route: any }) {
  const nav = useNavigation<any>();
  const { contact } = route.params || { contact: { name: "University", avatar: "https://ui-avatars.com/api/?name=U" } };
  const [messages, setMessages] = useState([{ id: 1, text: "Hello! How can we help?", sender: "them", time: "10:00" }]);
  const [input, setInput] = useState("");
  const flatRef = useRef<FlatList>(null);

  const send = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(p => [...p, { id: Date.now(), text: input, sender: "me", time: now }]);
    setInput("");
    setTimeout(() => setMessages(p => [...p, { id: Date.now() + 1, text: "Sure, let me check.", sender: "them", time: now }]), 1500);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={styles.chatHdr}>
        <TouchableOpacity onPress={() => nav.goBack()}><Ionicons name="arrow-back" size={24} color={C.navy} /></TouchableOpacity>
        <Image source={{ uri: contact.avatar }} style={styles.chatHdrAvt} />
        <View><Text style={styles.chatHdrName}>{contact.name}</Text><Text style={{ fontSize: 11, color: C.success }}>Online</Text></View>
      </View>
      <FlatList ref={flatRef} data={messages} keyExtractor={i => i.id.toString()} contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={() => flatRef.current?.scrollToEnd()}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.sender === "me" ? styles.bubbleMe : styles.bubbleThem]}>
            <Text style={{ color: item.sender === "me" ? "#fff" : C.text }}>{item.text}</Text>
            <Text style={{ fontSize: 10, color: item.sender === "me" ? "#ffffffaa" : C.textLight, marginTop: 3, alignSelf: "flex-end" }}>{item.time}</Text>
          </View>
        )} />
      <View style={styles.inputRow}>
        <TextInput style={styles.chatInput} value={input} onChangeText={setInput} placeholder="Type a message..." />
        <TouchableOpacity style={styles.sendBtn} onPress={send}><Ionicons name="send" size={18} color="#fff" /></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  chatItem: { flexDirection: "row", backgroundColor: C.white, borderRadius: 14, marginBottom: 10, padding: 14, gap: 12, elevation: 1 },
  chatAvatar:{ width: 48, height: 48, borderRadius: 24 },
  chatName: { fontSize: 14, fontWeight: "700", color: C.navy },
  chatTime: { fontSize: 11, color: C.textLight },
  chatSub:  { fontSize: 11, color: C.teal, fontWeight: "600", marginBottom: 3 },
  chatMsg:  { fontSize: 13, color: C.textLight, flex: 1 },
  unreadDot:{ width: 20, height: 20, borderRadius: 10, backgroundColor: C.navy, justifyContent: "center", alignItems: "center" },
  unreadNum:{ fontSize: 10, color: "#fff", fontWeight: "700" },
  chatHdr:  { flexDirection: "row", alignItems: "center", gap: 12, padding: 16,
    paddingTop: Platform.OS === "ios" ? 52 : 42, backgroundColor: C.white, elevation: 2, borderBottomWidth: 1, borderColor: C.border },
  chatHdrAvt: { width: 38, height: 38, borderRadius: 19 },
  chatHdrName:{ fontSize: 15, fontWeight: "700", color: C.navy },
  bubble:   { padding: 12, borderRadius: 18, maxWidth: "80%", marginBottom: 10 },
  bubbleMe: { alignSelf: "flex-end", backgroundColor: C.navy, borderBottomRightRadius: 4 },
  bubbleThem:{ alignSelf: "flex-start", backgroundColor: "#E5E7EB", borderBottomLeftRadius: 4 },
  inputRow: { flexDirection: "row", padding: 12, backgroundColor: C.white,
    borderTopWidth: 1, borderColor: C.border, alignItems: "center", gap: 10 },
  chatInput:{ flex: 1, backgroundColor: C.bg, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14 },
  sendBtn:  { width: 44, height: 44, borderRadius: 22, backgroundColor: C.navy, justifyContent: "center", alignItems: "center" },
});