import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, {
  createContext, useCallback, useContext,
  useEffect, useRef, useState
} from "react";
import {
  ActivityIndicator, Alert, Animated,
  Dimensions, Image, Platform,
  StyleSheet, Text, TextInput,
  TouchableOpacity, View
} from "react-native";
import axios from "axios";

export const { width, height } = Dimensions.get("window");

// ─── THEME ──────────────────────────────────────────────────────
export const C = {
  navy:       "#0F2236",
  navyDark:   "#08151F",
  navyMid:    "#193648",
  teal:       "#0D7377",
  tealLight:  "#14BDBD",
  gold:       "#C9A84C",
  goldLight:  "#F0C96A",
  offWhite:   "#F5F7FA",
  white:      "#FFFFFF",
  text:       "#1A2332",
  textMid:    "#4A5568",
  textLight:  "#8A96A3",
  border:     "#E2EAF0",
  success:    "#10B981",
  danger:     "#EF4444",
  warning:    "#F59E0B",
  purple:     "#7C3AED",
  card:       "#FFFFFF",
  bg:         "#EEF3F8",
};

// ─── API ────────────────────────────────────────────────────────
export const BASE     = "http://192.168.0.103:5000";
export const API_MOU  = `${BASE}/api/industry/mous`;
export const API_INT  = `${BASE}/api/industry/internships`;
export const API_PROJ = `${BASE}/api/industry/projects`;

// ─── STATUS CONFIG ───────────────────────────────────────────────
export const SC: Record<string, { c: string; bg: string; lbl: string }> = {
  Draft:                        { c: "#64748b", bg: "#f1f5f9", lbl: "Draft" },
  "Sent to Industry laison Incharge": { c: "#d97706", bg: "#fffbeb", lbl: "Sent to Us" },
  "Changes Proposed":           { c: "#7c3aed", bg: "#f5f3ff", lbl: "Changes Proposed" },
  "Industry Responded":         { c: "#0891b2", bg: "#ecfeff", lbl: "Responded" },
  "Approved by Industry":       { c: "#059669", bg: "#ecfdf5", lbl: "We Approved ✓" },
  "Approved by University":     { c: "#0284c7", bg: "#e0f2fe", lbl: "Uni Approved" },
  "Mutually Approved":          { c: "#16a34a", bg: "#dcfce7", lbl: "Mutually Approved ✓" },
  Rejected:                     { c: "#dc2626", bg: "#fef2f2", lbl: "Rejected" },
};

export const CT: Record<string, { c: string; bg: string; ic: string; lbl: string }> = {
  industry_change:    { c: "#7c3aed", bg: "#f5f3ff", ic: "🏭", lbl: "Industry Changed" },
  industry_approve:   { c: "#059669", bg: "#ecfdf5", ic: "✅", lbl: "Industry Approved" },
  industry_reject:    { c: "#dc2626", bg: "#fef2f2", ic: "❌", lbl: "Industry Rejected" },
  industry_response:  { c: "#0891b2", bg: "#ecfeff", ic: "💬", lbl: "Industry Response" },
  university_change:  { c: "#0284c7", bg: "#e0f2fe", ic: "🎓", lbl: "University Changed" },
  university_approve: { c: "#16a34a", bg: "#dcfce7", ic: "✅", lbl: "Uni Approved" },
  university_reject:  { c: "#dc2626", bg: "#fef2f2", ic: "❌", lbl: "Uni Rejected" },
  meeting_proposed:   { c: "#7c3aed", bg: "#f5f3ff", ic: "📅", lbl: "Meeting Proposed" },
  meeting_confirmed:  { c: "#16a34a", bg: "#dcfce7", ic: "🤝", lbl: "Meeting Confirmed" },
};

// ─── HELPERS ─────────────────────────────────────────────────────
export const fmtDate = (d: string | undefined) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-PK", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return d; }
};

export const fmtDT = (d: string | undefined) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString("en-PK", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return d; }
};

export const addCL = (m: any, type: string, data: Record<string, any> = {}) =>
  [...(m.changeLog || []), { id: Date.now(), type, date: new Date().toISOString(), ...data }];

export const bldPayload = (m: any) => ({
  title: m.title, university: m.university, industry: m.industry,
  collaborationType: m.collaborationType, startDate: m.startDate, endDate: m.endDate,
  description: m.description, objectives: m.objectives || [],
  responsibilities: m.responsibilities, terms: m.terms || [],
  signatories: m.signatories, universityContact: m.universityContact,
  industryContact: m.industryContact, universityLogo: m.universityLogo || "",
  industryLogo: m.industryLogo || "", status: m.status,
  universityStamp: m.universityStamp, industryStamp: m.industryStamp,
  sentAt: m.sentAt, industryResponseAt: m.industryResponseAt,
  proposedChanges: m.proposedChanges || [], changeLog: m.changeLog || [],
  scheduledMeeting: m.scheduledMeeting || null,
});

// ─── USER CONTEXT ────────────────────────────────────────────────
export const UserCtx = createContext<any>(null);
export const useUser = () => useContext(UserCtx);

export const DEFAULT_USER = {
  _id:      "507f1f77bcf86cd799439011",
  name:     "Edit Industry Name",
  email:    "hr@techsolutions.com",
  industry: "Information Technology",
  phone:    "+",
  website:  "Edit Industry URL",
  address:  "",
  about:    "Edit About",
  logo:     "",
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<typeof DEFAULT_USER | null>(DEFAULT_USER);

  const ax = useCallback(() =>
    axios.create({
      baseURL: BASE,
      headers: {
        "x-industry-id":  user?._id  ?? "",
        "x-company-name": user?.name ?? "",
        "Content-Type":   "application/json",
      },
    }),
  [user?._id, user?.name]
  );

  const updateUser = (data: Partial<typeof DEFAULT_USER>) =>
    setUser((p) => p ? { ...p, ...data } : p);

  return (
    <UserCtx.Provider value={{ user, setUser, updateUser, ax }}>
      {children}
    </UserCtx.Provider>
  );
};

// ─── TOAST ───────────────────────────────────────────────────────
export const ToastCtx = createContext<any>(null);
export const useToast = () => useContext(ToastCtx);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [t, setT] = useState<{ msg: string; type: string } | null>(null);
  const anim = useRef(new Animated.Value(0)).current;

  const show = (msg: string, type = "info") => {
    setT({ msg, type });
    Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2600),
      Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setT(null));
  };

  const colors: Record<string, [string, string]> = {
    success: ["#d1fae5", "#059669"],
    error:   ["#fee2e2", "#dc2626"],
    info:    ["#dbeafe", "#2563eb"],
  };
  const [bg, fg] = colors[t?.type || "info"] || colors.info;

  return (
    <ToastCtx.Provider value={show}>
      {children}
      {t && (
        <Animated.View style={[
          sharedStyles.toast,
          {
            backgroundColor: bg,
            borderColor: fg + "66",
            opacity: anim,
            transform: [{
              translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }),
            }],
          },
        ]}>
          <Ionicons
            name={
              t.type === "success" ? "checkmark-circle" :
              t.type === "error"   ? "close-circle"     :
                                     "information-circle"
            }
            size={18}
            color={fg}
          />
          <Text style={[sharedStyles.toastTxt, { color: fg }]}>{t.msg}</Text>
        </Animated.View>
      )}
    </ToastCtx.Provider>
  );
};

// ─── STATUS BADGE ────────────────────────────────────────────────
export const SBadge = ({ status }: { status: string }) => {
  const s = SC[status] || { c: C.textLight, bg: C.bg, lbl: status };
  return (
    <View style={[sharedStyles.badge, { backgroundColor: s.bg }]}>
      <Text style={[sharedStyles.badgeTxt, { color: s.c }]}>{s.lbl}</Text>
    </View>
  );
};

// ─── HEADER ──────────────────────────────────────────────────────
export const Header = ({
  title,
  back = false,
  right,
}: {
  title: string;
  back?: boolean;
  right?: React.ReactNode;
}) => {
  const { useNavigation } = require("@react-navigation/native");
  const nav = useNavigation();
  return (
    <View style={sharedStyles.hdr}>
      <TouchableOpacity
        onPress={() => (back ? nav.goBack() : nav.openDrawer())}
        style={sharedStyles.hdrBtn}>
        <Ionicons name={back ? "arrow-back" : "menu-outline"} size={24} color={C.navy} />
      </TouchableOpacity>
      <Text style={sharedStyles.hdrTitle} numberOfLines={1}>{title}</Text>
      {right ? right : <View style={{ width: 40 }} />}
    </View>
  );
};

// ─── FIELD INPUT ─────────────────────────────────────────────────
export const FieldInput = ({
  label, value, onChange, placeholder, multiline, editable = true, kbType,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  editable?: boolean;
  kbType?: any;
}) => (
  <View style={{ marginBottom: 12 }}>
    {label && <Text style={sharedStyles.fieldLbl}>{label}</Text>}
    <TextInput
      style={[
        sharedStyles.fieldInput,
        multiline && { height: 90, textAlignVertical: "top" },
        !editable && { backgroundColor: "#F3F4F6", color: C.textLight },
      ]}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={C.textLight}
      multiline={multiline}
      editable={editable}
      keyboardType={kbType || "default"}
      autoCapitalize="none"
    />
  </View>
);

// ─── INFO CARD ───────────────────────────────────────────────────
export const InfoCard = ({
  icon, title, children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) => (
  <View style={sharedStyles.infoCardWrap}>
    <View style={sharedStyles.infoCardHead}>
      <Ionicons name={icon as any} size={16} color={C.teal} />
      <Text style={sharedStyles.infoCardTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

// ─── ROW ─────────────────────────────────────────────────────────
export const Row = ({ label, val }: { label: string; val?: string }) => (
  <View style={sharedStyles.infoRow}>
    <Text style={sharedStyles.infoRowLbl}>{label}</Text>
    <Text style={sharedStyles.infoRowVal}>{val || "—"}</Text>
  </View>
);

// ─── SHARED STYLES ───────────────────────────────────────────────
export const sharedStyles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: C.bg },

  toast: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 40,
    left: 12, right: 12,
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 16, paddingVertical: 14,
    borderRadius: 16, borderWidth: 1,
    elevation: 12, zIndex: 9999,
  },
  toastTxt: { fontSize: 13, fontWeight: "700", flex: 1 },

  hdr: {
    backgroundColor: C.white,
    paddingTop: Platform.OS === "ios" ? 52 : 42,
    paddingBottom: 14, paddingHorizontal: 16,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    elevation: 2, borderBottomWidth: 1, borderColor: C.border,
  },
  hdrTitle:  { flex: 1, fontSize: 17, fontWeight: "700", color: C.navy, marginHorizontal: 12 },
  hdrBtn:    { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  hdrAction: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: C.teal,
    justifyContent: "center", alignItems: "center",
  },

  badge:    { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeTxt: { fontSize: 10, fontWeight: "700" },

  fieldLbl: {
    fontSize: 12, fontWeight: "700", color: C.navy,
    marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5,
  },
  fieldInput: {
    backgroundColor: C.white, borderWidth: 1.5, borderColor: C.border,
    borderRadius: 12, padding: 13, fontSize: 14, color: C.text, marginTop: 4,
  },

  saveBtn:    { backgroundColor: C.navy, padding: 16, borderRadius: 14, alignItems: "center", justifyContent: "center", flexDirection: "row" },
  saveBtnTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },

  infoCardWrap: { backgroundColor: C.white, borderRadius: 14, padding: 16, marginBottom: 12, elevation: 1 },
  infoCardHead: {
    flexDirection: "row", alignItems: "center", gap: 8,
    marginBottom: 12, paddingBottom: 10,
    borderBottomWidth: 1, borderColor: C.border,
  },
  infoCardTitle: { fontSize: 14, fontWeight: "800", color: C.navy },
  infoRow:       { flexDirection: "row", justifyContent: "space-between", paddingVertical: 7 },
  infoRowLbl:    { fontSize: 12, color: C.textLight, fontWeight: "600" },
  infoRowVal:    { fontSize: 13, color: C.navy, fontWeight: "700", maxWidth: "58%", textAlign: "right" },
  infoText:      { fontSize: 13, color: C.text, lineHeight: 20 },

  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: C.textLight, marginTop: 14 },
  emptySub:   { fontSize: 13, color: C.textLight, marginTop: 6 },

  overlay:     { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet:       {
    backgroundColor: C.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: "92%", paddingBottom: Platform.OS === "ios" ? 34 : 16,
  },
  sheetHandle: { width: 36, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: "center", marginTop: 10 },
  sheetHead:   {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    padding: 20, borderBottomWidth: 1, borderColor: C.border,
  },
  sheetTitle: { fontSize: 16, fontWeight: "800", color: C.navy, flex: 1 },
  sheetFoot:  { flexDirection: "row", gap: 12, padding: 16, borderTopWidth: 1, borderColor: C.border },
});