import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, {
  createContext, useCallback, useContext,
  useEffect, useRef, useState
} from "react";
import {
  ActivityIndicator, Alert, Animated,
  DeviceEventEmitter,
  Dimensions, Image, Platform,
  StatusBar,
  StyleSheet, Text, TextInput,
  TouchableOpacity, View
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CONSTANT } from "@/constants/constant";

const LOGO_KEY = "industryLogo";
export const LOGO_EVENT = "industry:logo:change";
// Fires after the industry profile (name, phone, website, etc.) is saved.
// Any screen that consumes useUser() can rely on the provider re-fetching
// from the server so dashboard, drawer, and cards stay in sync.
export const USER_EVENT = "industry:user:change";

// Broadcast that the industry profile has changed — UserProvider listens and
// re-pulls the canonical record from the backend so every consumer updates.
export const broadcastUser = () => {
  DeviceEventEmitter.emit(USER_EVENT);
};

// Filter to keep only renderable URIs (http(s) URL or data URI). Anything
// else (especially file://) is treated as empty so we never try to render
// device-local cache paths cross-screen.
const validLogo = (v?: string | null): string =>
  typeof v === "string" && (/^https?:\/\//i.test(v) || v.startsWith("data:"))
    ? v
    : "";

// ── Tiny hook every avatar can call: returns the current logo, refreshing
// itself whenever the LOGO_EVENT fires OR whenever AsyncStorage changes.
// Completely independent of React Context — works across Drawer/Stack
// navigator boundaries even if context propagation lags.
export const useIndustryLogo = (): string => {
  const [logo, setLogo] = React.useState<string>("");
  React.useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(LOGO_KEY).then((v) => {
      const ok = validLogo(v);
      if (alive && ok) setLogo(ok);
    }).catch(() => {});
    const sub = DeviceEventEmitter.addListener(LOGO_EVENT, (next: string) => {
      if (alive) setLogo(validLogo(next));
    });
    return () => { alive = false; sub.remove(); };
  }, []);
  return logo;
};

// Call this anywhere to broadcast a new logo. Saves to AsyncStorage too.
// Local file:// URIs are silently ignored — only http(s) URLs and data
// URIs are persisted, so other screens never get a path they can't render.
export const broadcastLogo = (next: string) => {
  const ok = validLogo(next);
  if (!ok) return;
  AsyncStorage.setItem(LOGO_KEY, ok).catch(() => {});
  DeviceEventEmitter.emit(LOGO_EVENT, ok);
};

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
export const BASE     = CONSTANT.API_BASE_URL;
export const API_MOU  = `${BASE}/api/industry/mous`;
export const API_INT  = `${BASE}/api/industry/internships`;
export const API_PROJ = `${BASE}/api/industry/projects`;

// ─── STATUS CONFIG ───────────────────────────────────────────────
export const SC: Record<string, { c: string; bg: string; lbl: string }> = {
  Draft:                        { c: "#64748b", bg: "#f1f5f9", lbl: "Draft" },
  "Sent to Industry":           { c: "#c2410c", bg: "#fff7ed", lbl: "Sent to Us" },
  "Sent to Industry laison Incharge": { c: "#c2410c", bg: "#fff7ed", lbl: "Sent to Us" },
  "Changes Proposed":           { c: "#c2410c", bg: "#fff7ed", lbl: "Changes Proposed" },
  "Industry Responded":         { c: "#0891b2", bg: "#ecfeff", lbl: "Responded" },
  "Approved by Industry":       { c: "#15803d", bg: "#ffffff", lbl: "We Approved ✓" },
  "Approved by University":     { c: "#0284c7", bg: "#ffffff", lbl: "Uni Approved" },
  "Mutually Approved":          { c: "#15803d", bg: "#ffffff", lbl: "Mutually Approved ✓" },
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
  pdf: m.pdf || null,
  universitySignature: m.universitySignature || null,
  industrySignature:   m.industrySignature   || null,
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
  // ── Dedicated, reactive logo slice — every avatar in the industry tree
  // subscribes to THIS rather than user.logo, so a single setLogo() call
  // forces every <Image> to re-render even if the broader user object
  // wouldn't have triggered an update for some reason.
  const [logo, setLogoState] = useState<string>("");

  const ax = useCallback(() =>
    axios.create({
      baseURL: BASE,
      headers: {
        "x-industry-id":    user?._id   ?? "",
        "x-company-name":   user?.name  ?? "",
        "x-industry-email": user?.email ?? "",
        "Content-Type":     "application/json",
      },
    }),
  [user?._id, user?.name, user?.email]
  );

  // Single writer for the logo. Updates state, the user object, and the cache.
  const setLogo = useCallback((next: string) => {
    setLogoState(next || "");
    setUser((p) => p ? { ...p, logo: next || "" } : p);
    AsyncStorage.setItem(LOGO_KEY, next || "").catch(() => {});
  }, []);

  const updateUser = (data: Partial<typeof DEFAULT_USER>) => {
    setUser((p) => p ? { ...p, ...data } : p);
    if (data.logo !== undefined) {
      setLogoState(data.logo || "");
      AsyncStorage.setItem(LOGO_KEY, data.logo || "").catch(() => {});
    }
  };

  // ── Pull the latest profile (logo, name, etc.) so every screen that consumes
  // useUser() — drawer, dashboard, post cards, profile screen, etc. — sees it.
  const refreshUser = useCallback(async () => {
    if (!user?.email) return;
    try {
      const { data } = await axios.get(
        `${BASE}/api/industry/auth/profile?email=${encodeURIComponent(user.email)}`
      );
      if (data?.company) {
        setUser((prev) => prev ? { ...prev, ...data.company } : data.company);
        if (data.company.logo) {
          setLogoState(data.company.logo);
          AsyncStorage.setItem(LOGO_KEY, data.company.logo).catch(() => {});
        }
      }
    } catch (err: any) {
      console.log("Industry refreshUser error:", err?.response?.data || err.message);
    }
  }, [user?.email]);

  // Pre-load cached logo + discover the canonical industry profile from the
  // database on first mount. We hit /profile/any so we don't depend on the
  // hardcoded default email — whichever record actually exists in MongoDB
  // becomes the active user, and every consumer of useUser() lights up with
  // the real saved details (name, industry, website, address, about, phone,
  // logo).
  useEffect(() => {
    (async () => {
      try {
        const cached = await AsyncStorage.getItem(LOGO_KEY);
        if (cached) {
          setLogoState(cached);
          setUser((prev) => prev ? { ...prev, logo: cached } : prev);
        }
      } catch {}

      try {
        const { data } = await axios.get(`${BASE}/api/industry/auth/profile/any`);
        if (data?.company?.email) {
          setUser((prev) => prev ? { ...prev, ...data.company } : data.company);
          if (data.company.logo) {
            setLogoState(data.company.logo);
            AsyncStorage.setItem(LOGO_KEY, data.company.logo).catch(() => {});
          }
          return; // refreshUser already covered by adopting the canonical record
        }
      } catch (err: any) {
        console.log("Industry profile/any error:", err?.response?.data || err.message);
      }

      // Fallback if the discovery endpoint isn't available — keep the legacy
      // path of fetching by the default user email.
      refreshUser();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for global "industry profile changed" events. Any save anywhere
  // in the app fires USER_EVENT; we re-pull from the backend so every
  // consumer (dashboard, drawer, cards) sees the canonical, persisted data.
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(USER_EVENT, () => {
      refreshUser();
    });
    return () => sub.remove();
  }, [refreshUser]);

  return (
    <UserCtx.Provider value={{ user, setUser, updateUser, refreshUser, ax, logo, setLogo }}>
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
    <View style={[sharedStyles.badge, { backgroundColor: s.bg, borderColor: s.c + "35" }]}>
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
  const nav = useNavigation<any>();
  return (
    <View style={sharedStyles.hdr}>
      <TouchableOpacity
        onPress={() => (back ? nav.goBack() : nav.openDrawer?.())}
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
      <View style={sharedStyles.infoCardIcon}>
        <Ionicons name={icon as any} size={15} color={C.teal} />
      </View>
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
    top: Platform.OS === "ios"
      ? 64
      : (StatusBar.currentHeight || 24) + 16,
    left: 14, right: 14,
    flexDirection: "row", alignItems: "flex-start", gap: 10,
    paddingHorizontal: 16, paddingVertical: 14,
    borderRadius: 16, borderWidth: 1,
    elevation: 12, zIndex: 9999,
    shadowColor: "#0F2236", shadowOpacity: 0.18, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  toastTxt: {
    fontSize: 13, fontWeight: "700", flex: 1,
    lineHeight: 18, flexShrink: 1, flexWrap: "wrap",
    paddingTop: 1,
  },

  hdr: {
    backgroundColor: C.white,
    paddingTop: Platform.OS === "ios" ? 52 : 42,
    paddingBottom: 14, paddingHorizontal: 14,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    borderBottomWidth: 1, borderColor: C.border,
    shadowColor: C.navy, shadowOpacity: 0.05, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  hdrTitle:  { flex: 1, fontSize: 17, fontWeight: "800", color: C.navy, marginHorizontal: 10, letterSpacing: 0.3 },
  hdrBtn:    { width: 40, height: 40, justifyContent: "center", alignItems: "center", borderRadius: 12 },
  hdrAction: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: C.teal,
    justifyContent: "center", alignItems: "center",
    shadowColor: C.teal, shadowOpacity: 0.3, shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },

  badge:    {
    paddingHorizontal: 11, paddingVertical: 5, borderRadius: 20,
    borderWidth: 1, borderColor: "transparent",
  },
  badgeTxt: { fontSize: 10.5, fontWeight: "800", letterSpacing: 0.4 },

  fieldLbl: {
    fontSize: 11.5, fontWeight: "800", color: C.navy,
    marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.7,
  },
  fieldInput: {
    backgroundColor: C.white, borderWidth: 1.5, borderColor: C.border,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 14, color: C.text, marginTop: 4,
  },

  saveBtn: {
    backgroundColor: C.teal, padding: 15, borderRadius: 14,
    alignItems: "center", justifyContent: "center", flexDirection: "row",
    shadowColor: C.teal, shadowOpacity: 0.28, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  saveBtnTxt: { color: "#fff", fontSize: 14.5, fontWeight: "800", letterSpacing: 0.3 },

  infoCardWrap: {
    backgroundColor: C.white, borderRadius: 16, paddingVertical: 18, paddingHorizontal: 18,
    marginBottom: 14, borderWidth: 1, borderColor: C.border,
    shadowColor: C.navy, shadowOpacity: 0.06, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  infoCardHead: {
    flexDirection: "row", alignItems: "center", gap: 12,
    marginBottom: 14, paddingBottom: 12,
    borderBottomWidth: 1, borderColor: C.navyMid + "22",
  },
  infoCardIcon: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: C.navyMid + "12",
    justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: C.navyMid + "30",
  },
  infoCardTitle: { fontSize: 14, fontWeight: "800", color: C.navy, letterSpacing: 0.4 },
  infoRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 11, gap: 12,
  },
  infoRowLbl: {
    fontSize: 11.5, color: C.textMid, fontWeight: "800",
    letterSpacing: 0.6, textTransform: "uppercase", flex: 0,
  },
  infoRowVal: { fontSize: 13.5, color: C.navy, fontWeight: "700", flex: 1, textAlign: "right" },
  infoText:   { fontSize: 13.5, color: C.text, lineHeight: 22 },

  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: C.textLight, marginTop: 14 },
  emptySub:   { fontSize: 13, color: C.textLight, marginTop: 6 },

  overlay:     { flex: 1, backgroundColor: "rgba(15,34,54,0.55)", justifyContent: "flex-end" },
  sheet:       {
    backgroundColor: C.white, borderTopLeftRadius: 30, borderTopRightRadius: 30,
    maxHeight: "92%", paddingBottom: Platform.OS === "ios" ? 34 : 16,
    shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 16,
    shadowOffset: { width: 0, height: -6 }, elevation: 10,
  },
  sheetHandle: {
    width: 44, height: 5, backgroundColor: C.border, borderRadius: 3,
    alignSelf: "center", marginTop: 10,
  },
  sheetHead: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 22, paddingTop: 16, paddingBottom: 14,
    borderBottomWidth: 1, borderColor: C.border,
  },
  sheetTitle: { fontSize: 17, fontWeight: "800", color: C.navy, flex: 1, letterSpacing: 0.3 },
  sheetFoot: {
    flexDirection: "row", gap: 12, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14,
    borderTopWidth: 1, borderColor: C.border, backgroundColor: C.bg + "60",
  },
});