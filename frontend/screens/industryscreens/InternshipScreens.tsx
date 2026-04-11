import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator, ScrollView, StyleSheet,
  Text, TouchableOpacity, View
} from "react-native";
import { API_INT, C, FieldInput, Header, sharedStyles, useToast, useUser } from "./shared";

// ═══════════════════════════════════════════════════════════════
//  INTERNSHIPS LIST
// ═══════════════════════════════════════════════════════════════
export function InternshipsMainScreen() {
  const nav = useNavigation<any>();
  const { ax } = useUser();
  const [items, setItems] = useState<any[]>([]);
  const [ld, setLd] = useState(true);

  useEffect(() => {
    ax().get(API_INT).then((r: any) => setItems(r.data || [])).catch(() => {}).finally(() => setLd(false));
  }, []);

  if (ld) return <View style={sharedStyles.center}><ActivityIndicator color={C.teal} /></View>;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Internships" back />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <TouchableOpacity style={styles.createBtn} onPress={() => nav.navigate("PostNewInternship")}>
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.createBtnTxt}>Post New Internship</Text>
        </TouchableOpacity>
        {items.length === 0 && (
          <View style={sharedStyles.emptyState}>
            <Ionicons name="briefcase-outline" size={56} color={C.textLight} />
            <Text style={sharedStyles.emptyTitle}>No internships yet</Text>
          </View>
        )}
        {items.map((item) => (
          <View key={item._id || item.id} style={styles.listCard}>
            <Text style={styles.listCardTitle}>{item.title}</Text>
            <Text style={styles.listCardSub}>{item.company}</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
              <Text style={styles.listCardMeta}>Posted: {item.date || item.createdAt}</Text>
              <Text style={styles.listCardMeta}>{item.applications || 0} Applicants</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
//  POST NEW INTERNSHIP
// ═══════════════════════════════════════════════════════════════
export function PostNewInternshipScreen() {
  const nav = useNavigation<any>();
  const { user, ax } = useUser();
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [desc, setDesc] = useState("");
  const [ld, setLd] = useState(false);

  const submit = async () => {
    if (!title) { toast("Title required", "error"); return; }
    setLd(true);
    try {
      await ax().post(API_INT, { title, company: user?.name || "", skills, description: desc });
      toast("Internship posted!", "success"); nav.goBack();
    } catch (e: any) { toast(e?.response?.data?.message || "Error", "error"); }
    finally { setLd(false); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="New Internship" back />
      <ScrollView contentContainerStyle={styles.formPad}>
        <FieldInput label="Job Title *" value={title} onChange={setTitle} placeholder="e.g. React Developer" />
        <FieldInput label="Required Skills" value={skills} onChange={setSkills} placeholder="e.g. JavaScript, React" />
        <FieldInput label="Description" value={desc} onChange={setDesc} placeholder="Responsibilities..." multiline />
        <TouchableOpacity style={[sharedStyles.saveBtn, { marginTop: 24 }]} onPress={submit} disabled={ld}>
          {ld ? <ActivityIndicator color="#fff" /> : <Text style={sharedStyles.saveBtnTxt}>Publish Internship</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  createBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: C.navy, padding: 14, borderRadius: 14, marginBottom: 16 },
  createBtnTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },
  listCard:    { backgroundColor: C.white, borderRadius: 14, padding: 16, marginBottom: 10, elevation: 1 },
  listCardTitle:{ fontSize: 15, fontWeight: "700", color: C.navy },
  listCardSub:  { fontSize: 12, color: C.textMid, marginTop: 4 },
  listCardMeta: { fontSize: 12, color: C.textLight },
  formPad:     { padding: 20, paddingBottom: 60 },
});