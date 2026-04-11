import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  FlatList, KeyboardAvoidingView, Platform,
  StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";
import { C, Header } from "./shared";

// ═══════════════════════════════════════════════════════════════
//  AI CHATBOT
// ═══════════════════════════════════════════════════════════════
export function AIChatbotScreen() {
  const [msgs, setMsgs] = useState([{ id: 1, text: "Hello! I am CXbot. How can I help with your MOU or partnerships?", sender: "bot" }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const flatRef = useRef<FlatList>(null);

  const respond = (text: string) => {
    if (!text.trim()) return;
    setMsgs(p => [...p, { id: Date.now(), text, sender: "user" }]);
    setInput(""); setTyping(true);
    setTimeout(() => {
      const t = text.toLowerCase();
      const reply =
        t.includes("mou") ? "Manage all MOUs in the MOU section. You can respond, propose changes, or confirm meetings." :
        t.includes("meeting") ? "Check the Meeting tab in any MOU for scheduling options." :
        t.includes("internship") ? "Post internships from the Internships section." :
        t.includes("profile") ? "Update your company profile from the drawer menu." :
        "I can help with MOUs, internships, projects, and more. What do you need?";
      setMsgs(p => [...p, { id: Date.now() + 1, text: reply, sender: "bot" }]);
      setTyping(false);
    }, 1800);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="CXbot AI" back />
      <FlatList ref={flatRef} data={msgs} keyExtractor={i => i.id.toString()} contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={() => flatRef.current?.scrollToEnd()}
        ListFooterComponent={typing ? <Text style={{ color: C.textLight, marginLeft: 12, marginTop: 4, fontSize: 12 }}>CXbot is typing...</Text> : null}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.sender === "user" ? styles.bubbleMe : { ...styles.bubbleThem, backgroundColor: "#E0F7F7" }]}>
            {item.sender === "bot" && <View style={styles.botIcon}><Ionicons name="sparkles" size={12} color="#fff" /></View>}
            <Text style={{ color: item.sender === "user" ? "#fff" : C.text }}>{item.text}</Text>
          </View>
        )} />
      <View style={styles.inputRow}>
        <TextInput style={styles.chatInput} value={input} onChangeText={setInput} placeholder="Ask CXbot anything..." />
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: C.teal }]} onPress={() => respond(input)}>
          <Ionicons name="arrow-up" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bubble:   { padding: 12, borderRadius: 18, maxWidth: "80%", marginBottom: 10 },
  bubbleMe: { alignSelf: "flex-end", backgroundColor: C.navy, borderBottomRightRadius: 4 },
  bubbleThem:{ alignSelf: "flex-start", backgroundColor: "#E5E7EB", borderBottomLeftRadius: 4 },
  botIcon:  { width: 22, height: 22, borderRadius: 11, backgroundColor: C.teal,
    justifyContent: "center", alignItems: "center", marginBottom: 6 },
  inputRow: { flexDirection: "row", padding: 12, backgroundColor: C.white,
    borderTopWidth: 1, borderColor: C.border, alignItems: "center", gap: 10 },
  chatInput:{ flex: 1, backgroundColor: C.bg, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14 },
  sendBtn:  { width: 44, height: 44, borderRadius: 22, backgroundColor: C.navy, justifyContent: "center", alignItems: "center" },
});