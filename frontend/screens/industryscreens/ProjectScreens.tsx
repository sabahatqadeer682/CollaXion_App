import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator, ScrollView, StyleSheet,
  Text, TouchableOpacity, View
} from "react-native";
import { API_PROJ, C, FieldInput, Header, sharedStyles, useToast, useUser } from "./shared";

// ═══════════════════════════════════════════════════════════════
//  PROJECTS LIST
// ═══════════════════════════════════════════════════════════════
export function ManageProjectsScreen() {
  const nav = useNavigation<any>();
  const { ax } = useUser();
  const [items, setItems] = useState<any[]>([]);
  const [ld, setLd] = useState(true);

  useEffect(() => {
    ax().get(API_PROJ).then((r: any) => setItems(r.data || [])).catch(() => {}).finally(() => setLd(false));
  }, []);

  if (ld) return <View style={sharedStyles.center}><ActivityIndicator color={C.teal} /></View>;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Projects" back />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <TouchableOpacity style={styles.createBtn} onPress={() => nav.navigate("PostNewProject")}>
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.createBtnTxt}>Add New Project</Text>
        </TouchableOpacity>
        {items.length === 0 && (
          <View style={sharedStyles.emptyState}>
            <Ionicons name="flask-outline" size={56} color={C.textLight} />
            <Text style={sharedStyles.emptyTitle}>No projects yet</Text>
          </View>
        )}
        {items.map((item) => (
          <View key={item._id || item.id} style={styles.listCard}>
            <Text style={styles.listCardTitle}>{item.title}</Text>
            <Text style={styles.listCardSub}>{item.type}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
//  POST NEW PROJECT
// ═══════════════════════════════════════════════════════════════
export function PostNewProjectScreen() {
  const nav = useNavigation<any>();
  const { ax } = useUser();
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Research");
  const [desc, setDesc] = useState("");
  const [ld, setLd] = useState(false);

  const submit = async () => {
    if (!title) { toast("Title required", "error"); return; }
    setLd(true);
    try {
      await ax().post(API_PROJ, { title, type, description: desc });
      toast("Project added!", "success"); nav.goBack();
    } catch (e: any) { toast(e?.response?.data?.message || "Error", "error"); }
    finally { setLd(false); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="New Project" back />
      <ScrollView contentContainerStyle={styles.formPad}>
        <FieldInput label="Project Title *" value={title} onChange={setTitle} />
        <Text style={styles.fieldLbl}>Type</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6, marginBottom: 12 }}>
          {["Research", "Development", "Collaboration"].map(t => (
            <TouchableOpacity key={t} onPress={() => setType(t)}
              style={[styles.typeChip, type === t && styles.typeChipActive]}>
              <Text style={[styles.typeChipTxt, type === t && styles.typeChipTxtActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <FieldInput label="Description" value={desc} onChange={setDesc} multiline />
        <TouchableOpacity style={[sharedStyles.saveBtn, { marginTop: 24 }]} onPress={submit} disabled={ld}>
          {ld ? <ActivityIndicator color="#fff" /> : <Text style={sharedStyles.saveBtnTxt}>Save Project</Text>}
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
  formPad:     { padding: 20, paddingBottom: 60 },
  fieldLbl:    { fontSize: 12, fontWeight: "700", color: C.navy, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  typeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5,
    borderColor: C.border, backgroundColor: C.white },
  typeChipActive: { backgroundColor: C.teal, borderColor: C.teal },
  typeChipTxt: { fontSize: 12, color: C.textMid, fontWeight: "600" },
  typeChipTxtActive: { color: "#fff" },
});