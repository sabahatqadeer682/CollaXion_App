import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator, Alert, Animated, Easing, FlatList, Image,
  KeyboardAvoidingView, Linking, Modal, Platform, RefreshControl,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import {
  API_MOU, BASE, C, CT, FieldInput, Header, InfoCard, Row, SBadge,
  addCL, bldPayload, fmtDate, fmtDT, sharedStyles, useToast, useUser
} from "./shared";
import socket from "../studentscreens/utils/Socket";

// ── Tiny fade+slide-up wrapper for list items ──
const AnimatedListItem = ({ index, children }: { index: number; children: React.ReactNode }) => {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, {
      toValue: 1,
      duration: 380,
      delay: Math.min(index, 8) * 60,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View
      style={{
        opacity: a,
        transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
      }}
    >
      {children}
    </Animated.View>
  );
};

// ═══════════════════════════════════════════════════════════════
//  MOU LIST
// ═══════════════════════════════════════════════════════════════
export function MoUScreen() {
  const nav = useNavigation<any>();
  const { ax, user } = useUser();
  const [mous, setMous] = useState<any[]>([]);
  const [ld, setLd] = useState(true);
  const [ref, setRef] = useState(false);
  const [filter, setFilter] = useState("All");

  const load = useCallback(async (show = true) => {
    if (show) setLd(true);
    try {
      // const r = await ax().get(`${API_MOU}/mine`, {
      //   params: { industryId: user?._id, industry: user?.name }
      // });
      const r = await ax().get(`${API_MOU}/mine`);
      setMous(r.data || []);
    } catch (e: any) {
      console.log("MOU load error:", e?.response?.data || e.message);
    } finally { setLd(false); setRef(false); }
  }, [ax, user]);

  useEffect(() => { load(); }, []);

  // ── Real-time MOU updates from backend WS ──
  useEffect(() => {
    if (!user?.email) return;
    socket.connect(BASE, user.email, user?.name, "industry");

    const upsert = (incoming: any) => {
      if (!incoming?._id) return;
      setMous((prev) => {
        const idx = prev.findIndex((m) => m._id === incoming._id);
        if (idx === -1) return [incoming, ...prev];
        const next = [...prev];
        next[idx] = { ...next[idx], ...incoming };
        return next;
      });
    };
    const remove = (incoming: any) => {
      if (!incoming?._id) return;
      setMous((prev) => prev.filter((m) => m._id !== incoming._id));
    };

    socket.on("mouCreated", upsert);
    socket.on("mouUpdated", upsert);
    socket.on("mouDeleted", remove);

    return () => {
      socket.off("mouCreated", upsert);
      socket.off("mouUpdated", upsert);
      socket.off("mouDeleted", remove);
    };
  }, [user?.email]);

  const PENDING = [
    "Sent to Industry",
    "Sent to Industry Laison Incharge",
    "Changes Proposed",
    "Approved by University",
  ];
  const filtered = filter === "All" ? mous :
    mous.filter(m => filter === "Pending" ? PENDING.includes(m.status) :
      filter === "Approved" ? m.status === "Mutually Approved" : m.status === filter);

  const tabs = ["All", "Pending", "Approved", "Rejected"];

  const stats = useMemo(() => ({
    total:    mous.length,
    pending:  mous.filter((m) => PENDING.includes(m.status)).length,
    approved: mous.filter((m) => m.status === "Mutually Approved").length,
  }), [mous]);

  if (ld) return <View style={sharedStyles.center}><ActivityIndicator color={C.teal} size="large" /></View>;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="MOU Management"
        right={
          <TouchableOpacity activeOpacity={0.88} onPress={() => nav.navigate("CreateMoU")}>
            <LinearGradient
              colors={[C.navyMid, C.navy]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerCta}
            >
              <View style={styles.headerCtaIcon}>
                <Ionicons name="add" size={12} color={C.white} />
              </View>
              <Text style={styles.headerCtaTxt}>New MOU</Text>
            </LinearGradient>
          </TouchableOpacity>
        }
        back
      />

      {/* Hero gradient with stats — navy core */}
      <LinearGradient
        colors={[C.navy, C.navyMid]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroTop}>
          <View style={styles.heroIcon}>
            <Ionicons name="document-text" size={20} color={C.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Your MOU Portfolio</Text>
            <Text style={styles.heroSub}>Track agreements with the university in real-time</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCell}>
            <Text style={styles.statVal}>{stats.total}</Text>
            <Text style={styles.statLbl}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCell}>
            <Text style={[styles.statVal, { color: C.white }]}>{stats.pending}</Text>
            <Text style={styles.statLbl}>Action Required</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCell}>
            <Text style={[styles.statVal, { color: "#22c55e" }]}>{stats.approved}</Text>
            <Text style={styles.statLbl}>Approved</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {tabs.map(t => {
          const active = filter === t;
          const ic =
            t === "All" ? "albums-outline" :
            t === "Pending" ? "flash-outline" :
            t === "Approved" ? "ribbon-outline" : "close-circle-outline";
          return (
            <TouchableOpacity key={t} activeOpacity={0.85} onPress={() => setFilter(t)}
              style={[styles.filterTab, active && styles.filterTabActive]}>
              <Ionicons name={ic as any} size={13} color={active ? C.teal : C.textMid} />
              <Text style={[styles.filterTabTxt, active && styles.filterTabTxtActive]}>{t}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={m => m._id}
        contentContainerStyle={{ padding: 16, paddingTop: 18, paddingBottom: 48 }}
        refreshControl={<RefreshControl refreshing={ref} onRefresh={() => { setRef(true); load(false); }} tintColor={C.teal} />}
        ListEmptyComponent={
          <View style={[sharedStyles.emptyState, { paddingHorizontal: 24 }]}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="document-text-outline" size={42} color={C.teal} />
            </View>
            <Text style={[sharedStyles.emptyTitle, { color: C.navy }]}>No MOUs yet</Text>
            <Text style={[sharedStyles.emptySub, { textAlign: "center" }]}>
              Tap the New button to request your first MOU with the university.
            </Text>
          </View>
        }
        renderItem={({ item: m, index }) => {
          const needsAction = PENDING.includes(m.status);
          const isApproved = m.status === "Mutually Approved";
          const isRejected = m.status === "Rejected";
          // Accent rules: approved = subtle dark green; rejected = danger;
          // pending = orange; default = teal.
          const accent = isApproved ? "#15803d" : isRejected ? C.danger : needsAction ? "#ea580c" : C.teal;
          const accentSoft = accent + "15";
          const meetingSet = !!(m.scheduledMeeting?.confirmedSlot?.date || m.meetingConfirmedSlot?.date);
          // Pick the most relevant meeting time to surface
          const mt = m.scheduledMeeting;
          const mtConfirmed = mt?.confirmedSlot?.date && `${mt.confirmedSlot.date} · ${mt.confirmedSlot.time || ""}`.trim();
          const mtIndProp   = mt?.industryProposedSlot?.date && `${mt.industryProposedSlot.date} · ${mt.industryProposedSlot.time || ""}`.trim();
          const mtSingle    = !mt?.options?.length && mt?.date && `${mt.date} · ${mt.time || ""}`.trim();
          const mtOptCount  = (mt?.options?.length || 0) > 0 ? `${mt.options.length} time options` : "";
          const meetingPreview = mtConfirmed || mtIndProp || mtSingle || mtOptCount || "";
          const meetingPreviewLabel = mtConfirmed ? "Confirmed" : mtIndProp ? "You proposed" : mtSingle || mtOptCount ? "Liaison proposed" : "";
          return (
            <AnimatedListItem index={index}>
            <TouchableOpacity
              style={styles.mouListCard}
              onPress={() => nav.navigate("MouDetail", { mouId: m._id })}
              activeOpacity={0.92}>
              <View style={[styles.cardAccent, { backgroundColor: accent }]} />
              <View style={styles.cardBody}>
                {/* ── Top row: thumbnail + title block + badge ── */}
                <View style={styles.cardTopRow}>
                  <View style={[styles.cardThumb, { backgroundColor: accentSoft, borderColor: accent + "33" }]}>
                    <Ionicons
                      name={isApproved ? "ribbon" : isRejected ? "close-circle" : needsAction ? "flash" : "document-text"}
                      size={20}
                      color={accent}
                    />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.mouListTitle} numberOfLines={1}>{m.title || m.university}</Text>
                    <View style={styles.subRow}>
                      <Ionicons name="school-outline" size={12} color={C.textMid} />
                      <Text style={styles.mouListSub} numberOfLines={1}>{m.university}</Text>
                    </View>
                  </View>
                </View>

                {/* ── Status / type chips row ── */}
                <View style={styles.chipRow}>
                  <SBadge status={m.status} />
                  {!!m.collaborationType && (
                    <View style={styles.typePill}>
                      <Ionicons name="briefcase-outline" size={11} color={C.teal} />
                      <Text style={styles.typePillTxt}>{m.collaborationType}</Text>
                    </View>
                  )}
                  {needsAction && (
                    <View style={styles.urgentChip}>
                      <View style={styles.urgentDot} />
                      <Text style={styles.urgentTxt}>Action Needed</Text>
                    </View>
                  )}
                </View>

                {/* ── Meeting time preview ── */}
                {!!meetingPreview && (
                  <View style={styles.mtgPreview}>
                    <Ionicons
                      name={mtConfirmed ? "checkmark-circle" : "calendar-outline"}
                      size={13}
                      color={C.teal}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.mtgPreviewLbl}>{meetingPreviewLabel}</Text>
                      <Text style={styles.mtgPreviewVal} numberOfLines={1}>{meetingPreview}</Text>
                    </View>
                  </View>
                )}

                {/* ── Footer meta (date, meeting, chevron) ── */}
                <View style={styles.mouListFooter}>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={13} color={C.textLight} />
                    <Text style={styles.mouListDate}>{fmtDate(m.startDate)} → {fmtDate(m.endDate)}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <View style={styles.pdfMiniChip}>
                      <Ionicons name={m.pdf?.url ? "document-attach" : "document-text"} size={10} color={C.navy} />
                      <Text style={styles.pdfMiniChipTxt}>{m.pdf?.url ? "PDF" : "Doc"}</Text>
                    </View>
                    {meetingSet && (
                      <View style={styles.mtgConfirmedChip}>
                        <Ionicons name="checkmark-circle" size={10} color="#15803d" />
                        <Text style={styles.mtgConfirmedTxt}>Meeting</Text>
                      </View>
                    )}
                    <View style={styles.cardChevron}>
                      <Ionicons name="chevron-forward" size={14} color={C.teal} />
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            </AnimatedListItem>
          );
        }}
      />
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CREATE MOU
// ═══════════════════════════════════════════════════════════════
export function CreateMoUScreen() {
  const nav = useNavigation<any>();
  const { user, ax } = useUser();
  const toast = useToast();
  const [ld, setLd] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "", collaborationType: "", description: "",
    objectives: [""], terms: [""],
    startDate: "", endDate: "",
    signatories: { industry: "" },
    industryContact: { name: "", designation: "", email: "" },
  });

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const arrAdd = (k: string) => setForm((f: any) => ({ ...f, [k]: [...f[k], ""] }));
  const arrUpd = (k: string, i: number, v: string) => setForm((f: any) => { const a = [...f[k]]; a[i] = v; return { ...f, [k]: a }; });

  const submit = async () => {
    if (!form.title || !form.collaborationType) {
      Alert.alert("Missing Information", "Please enter Title and Collaboration Type.");
      return;
    }
    setLd(true);
    try {
      const payload = {
        title: form.title,
        university: "Riphah International University",
        industry: user?.name || "New Industry Partner",
        industryId: user?._id || "industry_001",
        collaborationType: form.collaborationType,
        description: form.description || "",
        startDate: form.startDate || new Date().toISOString().split('T')[0],
        endDate: form.endDate || new Date(Date.now() + 31536000000).toISOString().split('T')[0],
        objectives: form.objectives.filter(Boolean),
        terms: form.terms.filter(Boolean),
        industryContact: form.industryContact,
        signatories: form.signatories,
        status: "Draft",
        changeLog: [{
          id: Date.now(),
          type: "industry_change",
          date: new Date().toISOString(),
          party: "Industry",
          message: `MOU Request created by ${user?.name}`
        }]
      };
      const response = await ax().post(API_MOU, payload);
      if (response.status === 201 || response.status === 200) {
        toast("MOU request sent successfully!", "success");
        nav.goBack();
      }
    } catch (e: any) {
      console.log("Full Error Object:", e.response?.data);
      const errorMsg = e.response?.data?.message || "Server connection failed. Check your IP address.";
      Alert.alert("Creation Failed", errorMsg);
    } finally {
      setLd(false);
    }
  };

  const TYPES = ["Research", "Internship", "Training", "Consultancy", "Joint Venture", "Other"];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="Request New MOU" back />

      {/* Step Indicator */}
      <View style={styles.stepRow}>
        {[1, 2, 3].map(s => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepDot, step >= s && styles.stepDotActive]}>
              {step > s ? <Ionicons name="checkmark" size={12} color="#fff" /> :
                <Text style={[styles.stepNum, step >= s && { color: "#fff" }]}>{s}</Text>}
            </View>
            <Text style={[styles.stepLbl, step >= s && { color: C.teal }]}>
              {s === 1 ? "Basics" : s === 2 ? "Details" : "Review"}
            </Text>
            {s < 3 && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
          </View>
        ))}
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.createForm}>

          {step === 1 && (
            <>
              <Text style={styles.stepHeading}>Basic Information</Text>
              <FieldInput label="MOU Title *" value={form.title} onChange={v => set("title", v)} placeholder="e.g. AI Research Collaboration" />
              <FieldInput label="University" value="Riphah International University" onChange={() => {}} editable={false} />
              <Text style={sharedStyles.fieldLbl}>Collaboration Type *</Text>
              <View style={styles.typeGrid}>
                {TYPES.map(t => (
                  <TouchableOpacity key={t} onPress={() => set("collaborationType", t)}
                    style={[styles.typeChip, form.collaborationType === t && styles.typeChipActive]}>
                    <Text style={[styles.typeChipTxt, form.collaborationType === t && styles.typeChipTxtActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <FieldInput label="Start Date" value={form.startDate} onChange={v => set("startDate", v)} placeholder="YYYY-MM-DD" />
              <FieldInput label="End Date" value={form.endDate} onChange={v => set("endDate", v)} placeholder="YYYY-MM-DD" />
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.stepHeading}>Purpose & Objectives</Text>
              <FieldInput label="Description / Purpose *" value={form.description} onChange={v => set("description", v)}
                placeholder="Describe the purpose and scope..." multiline />
              <Text style={sharedStyles.fieldLbl}>Objectives</Text>
              {form.objectives.map((o, i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <View style={styles.objNum}><Text style={styles.objNumTxt}>{i + 1}</Text></View>
                  <TextInput style={[sharedStyles.fieldInput, { flex: 1, marginTop: 0 }]} value={o}
                    onChangeText={(v) => arrUpd("objectives", i, v)} placeholder={`Objective ${i + 1}`} />
                </View>
              ))}
              <TouchableOpacity onPress={() => arrAdd("objectives")} style={styles.addRowBtn}>
                <Ionicons name="add-circle-outline" size={16} color={C.teal} />
                <Text style={styles.addRowTxt}>Add Objective</Text>
              </TouchableOpacity>
              <Text style={[sharedStyles.fieldLbl, { marginTop: 16 }]}>Terms & Conditions</Text>
              {form.terms.map((t, i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <View style={styles.objNum}><Text style={styles.objNumTxt}>{i + 1}</Text></View>
                  <TextInput style={[sharedStyles.fieldInput, { flex: 1, marginTop: 0 }]} value={t}
                    onChangeText={(v) => arrUpd("terms", i, v)} placeholder={`Term ${i + 1}`} />
                </View>
              ))}
              <TouchableOpacity onPress={() => arrAdd("terms")} style={styles.addRowBtn}>
                <Ionicons name="add-circle-outline" size={16} color={C.teal} />
                <Text style={styles.addRowTxt}>Add Term</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.stepHeading}>Contact & Review</Text>
              <FieldInput label="Your Contact Name" value={form.industryContact.name}
                onChange={v => set("industryContact", { ...form.industryContact, name: v })} />
              <FieldInput label="Designation" value={form.industryContact.designation}
                onChange={v => set("industryContact", { ...form.industryContact, designation: v })} />
              <FieldInput label="Contact Email" value={form.industryContact.email}
                onChange={v => set("industryContact", { ...form.industryContact, email: v })} kbType="email-address" />
              <FieldInput label="Authorized Signatory" value={form.signatories.industry}
                onChange={v => set("signatories", { ...form.signatories, industry: v })} placeholder="Name & Designation" />
              <View style={styles.reviewCard}>
                <Text style={styles.reviewTitle}>Summary</Text>
                {[
                  { l: "Title",      v: form.title },
                  { l: "Type",       v: form.collaborationType },
                  { l: "Duration",   v: `${form.startDate || "—"} → ${form.endDate || "—"}` },
                  { l: "University", v: "Riphah International University" },
                  { l: "Industry",   v: user?.name },
                ].map(r => (
                  <View key={r.l} style={styles.reviewRow}>
                    <Text style={styles.reviewLbl}>{r.l}</Text>
                    <Text style={styles.reviewVal}>{r.v || "—"}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={styles.stepBtns}>
            {step > 1 && (
              <TouchableOpacity style={styles.backStepBtn} onPress={() => setStep(s => s - 1)}>
                <Ionicons name="arrow-back" size={16} color={C.teal} />
                <Text style={styles.backStepTxt}>Back</Text>
              </TouchableOpacity>
            )}
            {step < 3 ? (
              <TouchableOpacity style={[styles.nextStepBtn, { flex: 1 }]} onPress={() => setStep(s => s + 1)}>
                <Text style={styles.nextStepTxt}>Continue</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.nextStepBtn, { flex: 1, backgroundColor: C.teal }]} onPress={submit} disabled={ld}>
                {ld ? <ActivityIndicator color="#fff" size="small" /> : (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Ionicons name="send" size={16} color="#fff" />
                    <Text style={styles.nextStepTxt}>Submit Request</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MOU DETAIL
// ═══════════════════════════════════════════════════════════════
export function MouDetailScreen({ route }: { route: any }) {
  const { ax, user } = useUser();
  const toast = useToast();
  const [mou, setMou] = useState<any>(null);
  const [ld, setLd] = useState(true);
  const [actLd, setActLd] = useState(false);
  const [tab, setTab] = useState("details");
  const [respModal, setRespModal] = useState(false);
  const [mtgModal, setMtgModal] = useState(false);
  const [signModal, setSignModal] = useState(false);
  const mouId = route.params?.mouId;

  // Industry signs the MOU and sends it back to the liaison.
  const submitIndustrySignature = async (sig: any) => {
    if (!mou) return;
    setActLd(true);
    try {
      const now = new Date().toISOString();
      const cl = addCL(mou, "industry_response", {
        party: "Industry", from: mou.industry,
        message: `${sig.signedBy} digitally signed the MOU on behalf of ${mou.industry}.`,
      });
      const payload = {
        ...bldPayload(mou),
        industrySignature: sig,
        industryResponseAt: now,
        changeLog: cl,
      };
      const r = await ax().put(`${API_MOU}/${mou._id}`, payload);
      setMou(r.data);
      setSignModal(false);
      toast("✍️ Signature sent to University", "success");
    } catch (e: any) {
      const msg = e?.response?.data?.message || e.message || "Could not save signature";
      Alert.alert("Error", msg);
      toast("Sign failed", "error");
    } finally {
      setActLd(false);
    }
  };

  useEffect(() => {
    ax().get(`${API_MOU}/${mouId}`)
      .then((r: any) => setMou(r.data))
      .catch(() => {})
      .finally(() => setLd(false));
  }, [mouId]);

  // ── Real-time updates for the open MOU ──
  useEffect(() => {
    if (!user?.email) return;
    socket.connect(BASE, user.email, user?.name, "industry");
    const onUpdate = (incoming: any) => {
      if (incoming?._id && incoming._id === mouId) setMou(incoming);
    };
    socket.on("mouUpdated", onUpdate);
    socket.on("mouCreated", onUpdate);
    return () => {
      socket.off("mouUpdated", onUpdate);
      socket.off("mouCreated", onUpdate);
    };
  }, [mouId, user?.email]);

  const upd = (u: any) => setMou(u);

  const doResponse = async (rd: any) => {
    setActLd(true);
    try {
      const lt = rd.type === "accept" ? "industry_approve" : rd.type === "reject" ? "industry_reject" :
        rd.type === "change" ? "industry_change" : "industry_response";
      const cl = addCL(mou, lt, { party: "Industry", from: mou.industry, message: rd.message });
      let ns = mou.status;
      if (rd.type === "accept") {
        // If university has already approved, industry's accept finalizes the MOU.
        ns = mou.status === "Approved by University" ? "Mutually Approved" : "Approved by Industry";
      }
      else if (rd.type === "reject") ns = "Rejected";
      else if (rd.type === "change") ns = "Changes Proposed";
      else ns = "Industry Responded";
      const stamp = rd.type === "accept" ? { by: mou.industry, type: "approve", date: new Date().toISOString() } : mou.industryStamp;
      const pl = { ...bldPayload(mou), status: ns, changeLog: cl, industryStamp: stamp,
        industryResponseAt: new Date().toISOString(),
        proposedChanges: rd.changes ? [...(mou.proposedChanges || []), ...rd.changes] : (mou.proposedChanges || []) };
      const r = await ax().put(`${API_MOU}/${mou._id}`, pl);
      upd(r.data); setRespModal(false);
      toast(
        rd.type === "accept"
          ? (ns === "Mutually Approved" ? "🎉 Mutually Approved!" : "MOU Approved by Industry")
          : rd.type === "reject" ? "MOU Rejected" : "Response sent!",
        rd.type === "reject" ? "error" : "success",
      );
    } catch (e: any) {
      const detailedError = JSON.stringify(e.response?.data) || e.message;
      console.log("Error Details:", detailedError);
      Alert.alert("Server Error", detailedError);
      toast("Action failed", "error");
    } finally { setActLd(false); }
  };

  const selectSlot = async (opt: any) => {
    const sl = { date: opt.date || "", time: opt.time || "", note: opt.note || "" };
    const now = new Date().toISOString();
    setActLd(true);
    try {
      const cl = addCL(mou, "meeting_confirmed", { party: "Industry", from: mou.industry, message: `Confirmed: ${sl.date} at ${sl.time}` });
      const updMtg = { ...mou.scheduledMeeting, confirmedSlot: sl, confirmedAt: now, industryProposedSlot: null };
      const pl = { ...bldPayload(mou), scheduledMeeting: updMtg, changeLog: cl };
      const r = await ax().put(`${API_MOU}/${mou._id}`, pl);
      upd({ ...r.data, scheduledMeeting: updMtg });
      toast(`🤝 Meeting confirmed: ${sl.date}!`, "success");
    } catch (e: any) { toast(e?.response?.data?.message || "Error", "error"); }
    finally { setActLd(false); }
  };

  const proposeSlot = async (sd: any) => {
    const prop = { date: sd.date || "", time: sd.time || "", note: sd.note || "" };
    const now = new Date().toISOString();
    setActLd(true);
    try {
      const cl = addCL(mou, "meeting_proposed", { party: "Industry", from: mou.industry, message: `Proposed: ${prop.date} at ${prop.time}` });
      const updMtg = { ...mou.scheduledMeeting, industryProposedSlot: prop, industryProposedAt: now, confirmedSlot: null };
      const pl = { ...bldPayload(mou), scheduledMeeting: updMtg, changeLog: cl };
      const r = await ax().put(`${API_MOU}/${mou._id}`, pl);
      upd({ ...r.data, scheduledMeeting: updMtg });
      setMtgModal(false);
      toast("Slot proposed to University", "info");
    } catch (e: any) { toast(e?.response?.data?.message || "Error", "error"); }
    finally { setActLd(false); }
  };

  // Animate the tab content on switch
  const tabAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    tabAnim.setValue(0);
    Animated.timing(tabAnim, {
      toValue: 1,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [tab, tabAnim]);

  if (ld) return <View style={sharedStyles.center}><ActivityIndicator size="large" color={C.teal} /></View>;
  if (!mou) return <View style={{ flex: 1, backgroundColor: C.bg }}><Header title="MOU" back /></View>;

  const mtg = mou.scheduledMeeting;
  const cs = mtg?.confirmedSlot, hasC = !!(cs?.date);
  const ip = mtg?.industryProposedSlot, hasI = !!(ip?.date);
  const hasOpts = mtg?.options?.length > 0;
  const hasSingle = !hasOpts && mtg?.date && mtg?.time;
  // Industry can respond on any status except already-finalized / rejected.
  // Especially after the university approves, industry should still be able
  // to "Accept" so the MOU becomes Mutually Approved.
  const canResp = [
    "Sent to Industry",
    "Sent to Industry Laison Incharge",
    "Changes Proposed",
    "Approved by University",
    "Industry Responded",
  ].includes(mou.status);
  const isMutual = mou.status === "Mutually Approved";
  const pdf = mou.pdf;
  const hasExplicitPdf = !!(pdf && pdf.url);
  // Fallback: server-rendered HTML view of this MOU (always available)
  const fallbackUrl = `${API_MOU}/${mou._id}/pdf-view`;
  // Resolve any relative paths against the app's BASE so the device can fetch
  // (web admin may store "/api/industry/mous/:id/pdf-view")
  const resolveUrl = (u?: string) => {
    if (!u) return fallbackUrl;
    if (u.startsWith("http") || u.startsWith("data:")) return u;
    if (u.startsWith("/")) return `${BASE}${u}`;
    return u;
  };
  const docUrl = resolveUrl(hasExplicitPdf ? (pdf.url as string) : fallbackUrl);

  const openPdf = async () => {
    try {
      if (docUrl.startsWith("http")) {
        await WebBrowser.openBrowserAsync(docUrl);
      } else {
        const can = await Linking.canOpenURL(docUrl);
        if (can) await Linking.openURL(docUrl);
        else Alert.alert("Cannot open", "PDF format not supported on this device.");
      }
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Could not open document");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title={mou.title || "MOU Detail"} back />

      {/* Hero detail strip */}
      <LinearGradient
        colors={[C.navy, C.navyMid]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.detailHero}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.detailHeroLbl}>{mou.collaborationType || "Collaboration"}</Text>
          <Text style={styles.detailHeroTitle} numberOfLines={2}>{mou.title || "Untitled MOU"}</Text>
          <Text style={styles.detailHeroSub} numberOfLines={1}>{mou.university} ↔ {mou.industry}</Text>
          <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", gap: 8 }}>
            <SBadge status={mou.status} />
            {isMutual && (
              <View style={styles.finalChip}>
                <Ionicons name="checkmark-circle" size={12} color="#15803d" />
                <Text style={styles.finalChipTxt}>Finalized</Text>
              </View>
            )}
          </View>
        </View>
        {canResp && (
          <TouchableOpacity style={styles.respBtn} onPress={() => setRespModal(true)} disabled={actLd}>
            <Ionicons name="chatbubble-ellipses" size={14} color={C.navy} />
            <Text style={styles.respBtnTxt}>Respond</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {["details", "meeting", "activity"].map(t => (
          <TouchableOpacity key={t} activeOpacity={0.85} style={[styles.tabItem, tab === t && styles.tabItemActive]} onPress={() => setTab(t)}>
            <Ionicons
              name={t === "details" ? "document-text-outline" : t === "meeting" ? "calendar-outline" : "time-outline"}
              size={15}
              color={tab === t ? C.white : C.textMid}
            />
            <Text style={[styles.tabTxt, tab === t && styles.tabTxtActive]}>
              {t === "details" ? "Details" : t === "meeting" ? "Meeting" : "Activity"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
       <Animated.View
         style={{
           opacity: tabAnim,
           transform: [{ translateY: tabAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
         }}
       >
        {tab === "details" && (
          <>
            {mtg && (hasC || hasI || hasOpts || hasSingle) && (
              <View style={[styles.mtgInfoCard, hasC && styles.mtgInfoCardConfirmed]}>
                <View style={styles.mtgInfoHead}>
                  <View style={[styles.mtgInfoIcon, { backgroundColor: hasC ? "#16a34a" : C.teal }]}>
                    <Ionicons name={hasC ? "checkmark-circle" : "calendar"} size={18} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.mtgInfoTitle, hasC && { color: "#15803d" }]}>
                      {hasC ? "Meeting Confirmed" : hasI ? "Awaiting University" : "Meeting Proposed by University"}
                    </Text>
                    <Text style={styles.mtgInfoSub}>
                      {hasC ? "Both parties have agreed" :
                       hasI ? "You proposed an alternative slot" :
                       hasOpts ? `${mtg.options.length} time options to choose from` :
                       "Confirm or propose a different time"}
                    </Text>
                  </View>
                </View>

                {/* Confirmed slot */}
                {hasC && (
                  <View style={styles.mtgSlotsRow}>
                    <View style={styles.mtgSlotCell}>
                      <Text style={styles.mtgSlotLbl}>DATE</Text>
                      <Text style={styles.mtgSlotVal}>{cs.date}</Text>
                    </View>
                    <View style={styles.mtgSlotCell}>
                      <Text style={styles.mtgSlotLbl}>TIME</Text>
                      <Text style={styles.mtgSlotVal}>🕐 {cs.time}</Text>
                    </View>
                  </View>
                )}

                {/* Industry-proposed slot */}
                {!hasC && hasI && (
                  <View style={styles.mtgSlotsRow}>
                    <View style={[styles.mtgSlotCell, { borderColor: C.navyMid + "55", backgroundColor: C.white }]}>
                      <Text style={styles.mtgSlotLbl}>DATE</Text>
                      <Text style={styles.mtgSlotVal}>{ip.date}</Text>
                    </View>
                    <View style={[styles.mtgSlotCell, { borderColor: C.navyMid + "55", backgroundColor: C.white }]}>
                      <Text style={styles.mtgSlotLbl}>TIME</Text>
                      <Text style={styles.mtgSlotVal}>🕐 {ip.time}</Text>
                    </View>
                  </View>
                )}

                {/* University options list */}
                {!hasC && !hasI && hasOpts && (
                  <View style={{ gap: 8, marginTop: 4 }}>
                    {mtg.options.map((opt: any, i: number) => (
                      <View key={i} style={styles.mtgOptionRow}>
                        <View style={styles.mtgOptionDot} />
                        <Text style={styles.mtgOptionTxt}>{opt.date} at {opt.time}</Text>
                        {!!opt.note && <Text style={styles.mtgOptionNote}>· {opt.note}</Text>}
                      </View>
                    ))}
                  </View>
                )}

                {/* University single slot */}
                {!hasC && !hasI && hasSingle && (
                  <View style={styles.mtgSlotsRow}>
                    <View style={styles.mtgSlotCell}>
                      <Text style={styles.mtgSlotLbl}>DATE</Text>
                      <Text style={styles.mtgSlotVal}>{fmtDate(mtg.date)}</Text>
                    </View>
                    <View style={styles.mtgSlotCell}>
                      <Text style={styles.mtgSlotLbl}>TIME</Text>
                      <Text style={styles.mtgSlotVal}>🕐 {mtg.time}</Text>
                    </View>
                  </View>
                )}

                {/* Meta lines: venue / agenda / sender */}
                <View style={{ marginTop: 12, gap: 6 }}>
                  {!!mtg.venue && (
                    <View style={styles.mtgMetaRow}>
                      <Ionicons name="location-outline" size={13} color={C.teal} />
                      <Text style={styles.mtgMetaTxt}><Text style={styles.mtgMetaLbl}>Venue: </Text>{mtg.venue}</Text>
                    </View>
                  )}
                  {!!mtg.agenda && (
                    <View style={styles.mtgMetaRow}>
                      <Ionicons name="clipboard-outline" size={13} color={C.teal} />
                      <Text style={styles.mtgMetaTxt}><Text style={styles.mtgMetaLbl}>Agenda: </Text>{mtg.agenda}</Text>
                    </View>
                  )}
                  {!!mtg.attendees && (
                    <View style={styles.mtgMetaRow}>
                      <Ionicons name="people-outline" size={13} color={C.teal} />
                      <Text style={styles.mtgMetaTxt}><Text style={styles.mtgMetaLbl}>Attendees: </Text>{mtg.attendees}</Text>
                    </View>
                  )}
                  {!!mtg.menu && (
                    <View style={styles.mtgMetaRow}>
                      <Ionicons name="cafe-outline" size={13} color={C.teal} />
                      <Text style={styles.mtgMetaTxt}><Text style={styles.mtgMetaLbl}>Menu: </Text>{mtg.menu}</Text>
                    </View>
                  )}
                  <Text style={styles.mtgFromTxt}>
                    📨 Proposed by Industry Liaison Incharge
                    {hasC && mtg.confirmedAt ? ` · Confirmed ${fmtDT(mtg.confirmedAt)}` : ""}
                  </Text>
                </View>

                <TouchableOpacity activeOpacity={0.88} onPress={() => setTab("meeting")}>
                  <LinearGradient
                    colors={[C.navy, C.navyMid]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.mtgGoBtn}
                  >
                    <View style={styles.mtgGoIcon}>
                      <Ionicons name="calendar" size={13} color={C.white} />
                    </View>
                    <Text style={styles.mtgGoTxt}>Open Meeting Tab</Text>
                    <Ionicons name="arrow-forward" size={14} color={C.white} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {/* ── Signature card ── */}
            <View style={styles.sigCard}>
              <View style={styles.sigHead}>
                <View style={styles.sigHeadIcon}>
                  <Ionicons name="create-outline" size={16} color={C.navy} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sigHeadTitle}>Digital Signatures</Text>
                  <Text style={styles.sigHeadSub}>Sign the MOU to send your approval back to the university</Text>
                </View>
              </View>

              <View style={styles.sigGrid}>
                {/* University */}
                <View style={[styles.sigBox, mou.universitySignature?.signedAt && styles.sigBoxSigned]}>
                  <Text style={styles.sigBoxLbl}>UNIVERSITY</Text>
                  {mou.universitySignature?.signedAt ? (
                    <>
                      {mou.universitySignature?.dataUrl?.startsWith?.("data:") ? (
                        <Image
                          source={{ uri: mou.universitySignature.dataUrl }}
                          style={{ height: 44, width: "100%", resizeMode: "contain", marginBottom: 4 }}
                        />
                      ) : (
                        <Text style={styles.sigCursive} numberOfLines={1}>
                          {mou.universitySignature.text || mou.universitySignature.signedBy}
                        </Text>
                      )}
                      <Text style={styles.sigBoxName} numberOfLines={1}>✓ {mou.universitySignature.signedBy}</Text>
                      <Text style={styles.sigBoxDate}>{fmtDT(mou.universitySignature.signedAt)}</Text>
                    </>
                  ) : (
                    <Text style={styles.sigBoxPending}>Not yet signed</Text>
                  )}
                </View>
                {/* Industry */}
                <View style={[styles.sigBox, mou.industrySignature?.signedAt && styles.sigBoxSigned]}>
                  <Text style={styles.sigBoxLbl}>INDUSTRY</Text>
                  {mou.industrySignature?.signedAt ? (
                    <>
                      {mou.industrySignature?.dataUrl?.startsWith?.("data:") ? (
                        <Image
                          source={{ uri: mou.industrySignature.dataUrl }}
                          style={{ height: 44, width: "100%", resizeMode: "contain", marginBottom: 4 }}
                        />
                      ) : (
                        <Text style={styles.sigCursive} numberOfLines={1}>
                          {mou.industrySignature.text || mou.industrySignature.signedBy}
                        </Text>
                      )}
                      <Text style={styles.sigBoxName} numberOfLines={1}>✓ {mou.industrySignature.signedBy}</Text>
                      <Text style={styles.sigBoxDate}>{fmtDT(mou.industrySignature.signedAt)}</Text>
                    </>
                  ) : (
                    <Text style={styles.sigBoxPending}>Not yet signed</Text>
                  )}
                </View>
              </View>

              {!mou.industrySignature?.signedAt && (
                <TouchableOpacity
                  activeOpacity={0.88}
                  onPress={() => setSignModal(true)}
                  style={styles.sigBtn}
                >
                  <Ionicons name="create" size={14} color={C.white} />
                  <Text style={styles.sigBtnTxt}>Sign &amp; Send to University</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.pdfCard}>
              <View style={styles.pdfIcon}>
                <Ionicons name="document-text" size={26} color={C.navy} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.pdfBadge}>
                  <Ionicons name={hasExplicitPdf ? "mail-open" : "document"} size={10} color={C.teal} />
                  <Text style={styles.pdfBadgeTxt}>
                    {hasExplicitPdf ? "From Industry Liaison" : "MOU Document"}
                  </Text>
                </View>
                <Text style={styles.pdfName} numberOfLines={1}>
                  {hasExplicitPdf ? (pdf.name || "MOU.pdf") : `${mou.title || "MOU"}.pdf`}
                </Text>
                <Text style={styles.pdfMeta}>
                  {hasExplicitPdf
                    ? `${pdf.sentBy ? `Sent by ${pdf.sentBy}` : "Document attached"}${pdf.sentAt ? ` · ${fmtDT(pdf.sentAt)}` : ""}`
                    : "Open the official MOU as a printable document"}
                </Text>
                <TouchableOpacity style={styles.pdfBtn} onPress={openPdf} activeOpacity={0.85}>
                  <Ionicons name="eye" size={14} color="#fff" />
                  <Text style={styles.pdfBtnTxt}>View MOU Document</Text>
                </TouchableOpacity>
              </View>
            </View>

            <InfoCard icon="school-outline" title="Collaboration">
              <Row label="Type" val={mou.collaborationType} />
              <Row label="University" val={mou.university} />
              <Row label="Duration" val={`${fmtDate(mou.startDate)} → ${fmtDate(mou.endDate)}`} />
            </InfoCard>

            {mou.description && (
              <InfoCard icon="document-outline" title="Purpose">
                <Text style={sharedStyles.infoText}>{mou.description}</Text>
              </InfoCard>
            )}

            {mou.objectives?.filter(Boolean).length > 0 && (
              <InfoCard icon="list-outline" title="Objectives">
                {mou.objectives.filter(Boolean).map((o: string, i: number) => (
                  <View key={i} style={styles.bulletRow}>
                    <View style={styles.bullet} />
                    <Text style={styles.bulletTxt}>{o}</Text>
                  </View>
                ))}
              </InfoCard>
            )}

            {mou.proposedChanges?.length > 0 && (
              <View style={[sharedStyles.infoCardWrap, { borderLeftWidth: 3, borderLeftColor: C.purple }]}>
                <View style={sharedStyles.infoCardHead}>
                  <Ionicons name="alert-circle" size={16} color={C.purple} />
                  <Text style={[sharedStyles.infoCardTitle, { color: C.purple }]}>{mou.proposedChanges.length} Proposed Change(s)</Text>
                </View>
                {mou.proposedChanges.map((ch: any, i: number) => (
                  <View key={i} style={styles.changeRow}>
                    <Text style={styles.changeLbl}>{ch.field || `Change #${i + 1}`}</Text>
                    <Text style={styles.changeVals}>
                      <Text style={{ color: C.danger, textDecorationLine: "line-through" }}>{ch.oldValue}</Text>
                      {"  →  "}
                      <Text style={{ color: C.success }}>{ch.newValue}</Text>
                    </Text>
                    {ch.reason && <Text style={styles.changeReason}>Reason: {ch.reason}</Text>}
                  </View>
                ))}
              </View>
            )}

            {(mou.universityStamp || mou.industryStamp) && (
              <InfoCard icon="ribbon-outline" title="Approvals">
                {mou.universityStamp && (
                  <View style={styles.stampRow}>
                    <View style={[styles.stampDot, { backgroundColor: mou.universityStamp.type === "approve" ? C.success : C.danger }]} />
                    <View>
                      <Text style={styles.stampLbl}>University: {mou.universityStamp.type === "approve" ? "✅ Approved" : "❌ Rejected"}</Text>
                      <Text style={styles.stampDate}>By {mou.universityStamp.by} · {fmtDate(mou.universityStamp.date)}</Text>
                    </View>
                  </View>
                )}
                {mou.industryStamp && (
                  <View style={styles.stampRow}>
                    <View style={[styles.stampDot, { backgroundColor: mou.industryStamp.type === "approve" ? C.success : C.danger }]} />
                    <View>
                      <Text style={styles.stampLbl}>Industry: {mou.industryStamp.type === "approve" ? "✅ Approved" : "❌ Rejected"}</Text>
                      <Text style={styles.stampDate}>By {mou.industryStamp.by} · {fmtDate(mou.industryStamp.date)}</Text>
                    </View>
                  </View>
                )}
              </InfoCard>
            )}
          </>
        )}

        {tab === "meeting" && (
          <>
            {!mtg && (
              <View style={sharedStyles.emptyState}>
                <Ionicons name="calendar-outline" size={56} color={C.textLight} />
                <Text style={sharedStyles.emptyTitle}>No meeting scheduled</Text>
                <Text style={sharedStyles.emptySub}>University will propose a time slot</Text>
              </View>
            )}

            {mtg && hasC && (
              <View style={styles.confirmedCard}>
                <LinearGradient
                  colors={["#15803d", "#16a34a"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.confirmedHero}
                >
                  <View style={styles.confirmedIcon}>
                    <Ionicons name="checkmark-sharp" size={20} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.confirmedEyebrow}>Meeting Status</Text>
                    <Text style={styles.confirmedTitle}>Mutually Confirmed</Text>
                  </View>
                </LinearGradient>
                <View style={styles.confirmedBody}>
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <View style={styles.dtCell}><Text style={styles.dtLabel}>DATE</Text><Text style={styles.dtVal}>{cs.date}</Text></View>
                    <View style={styles.dtCell}><Text style={styles.dtLabel}>TIME</Text><Text style={styles.dtVal}>🕐 {cs.time}</Text></View>
                  </View>
                  {(mtg.venue || mtg.agenda || cs.note) && <View style={styles.confirmedDivider} />}
                  {mtg.venue && (
                    <View style={styles.mtgMetaRow}>
                      <Ionicons name="location-outline" size={13} color={C.navy} />
                      <Text style={styles.mtgMetaTxt}><Text style={styles.mtgMetaLbl}>Venue: </Text>{mtg.venue}</Text>
                    </View>
                  )}
                  {mtg.agenda && (
                    <View style={styles.mtgMetaRow}>
                      <Ionicons name="clipboard-outline" size={13} color={C.navy} />
                      <Text style={styles.mtgMetaTxt}><Text style={styles.mtgMetaLbl}>Agenda: </Text>{mtg.agenda}</Text>
                    </View>
                  )}
                  {cs.note && (
                    <View style={styles.mtgMetaRow}>
                      <Ionicons name="bookmark-outline" size={13} color={C.navy} />
                      <Text style={styles.mtgMetaTxt}><Text style={styles.mtgMetaLbl}>Note: </Text>{cs.note}</Text>
                    </View>
                  )}
                  <Text style={styles.confirmedSince}>Confirmed · {fmtDT(mtg.confirmedAt)}</Text>
                </View>
              </View>
            )}

            {mtg && !hasC && hasI && (
              <View style={styles.pendingCard}>
                <View style={styles.pendingHead}>
                  <View style={styles.pendingDot} />
                  <Text style={styles.pendingTitle}>Awaiting University Confirmation</Text>
                </View>
                <Text style={styles.pendingSub}>You proposed this slot:</Text>
                <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
                  <View style={styles.dtCell}>
                    <Text style={styles.dtLabel}>DATE</Text>
                    <Text style={styles.dtVal}>{ip.date}</Text>
                  </View>
                  <View style={styles.dtCell}>
                    <Text style={styles.dtLabel}>TIME</Text>
                    <Text style={styles.dtVal}>🕐 {ip.time}</Text>
                  </View>
                </View>
                {ip.note && <Text style={{ fontSize: 12, color: C.textMid, marginBottom: 4 }}>📌 {ip.note}</Text>}
                <TouchableOpacity style={styles.outlineBtn} onPress={() => setMtgModal(true)}>
                  <Ionicons name="pencil" size={13} color={C.navy} />
                  <Text style={styles.outlineTxt}>Change Slot</Text>
                </TouchableOpacity>
              </View>
            )}

            {mtg && !hasC && !hasI && hasOpts && (
              <>
                <View style={styles.infoNote}>
                  <Ionicons name="information-circle" size={16} color="#0284c7" />
                  <Text style={styles.infoNoteTxt}>Select a slot or propose your own time</Text>
                </View>
                {mtg.options.map((opt: any, i: number) => (
                  <View key={i} style={styles.slotCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.slotDate}>{opt.date} at {opt.time}</Text>
                      {opt.note && <Text style={styles.slotNote}>{opt.note}</Text>}
                    </View>
                    <TouchableOpacity style={styles.selectBtn} onPress={() => selectSlot(opt)} disabled={actLd}>
                      {actLd ? <ActivityIndicator color="#fff" size="small" /> : (
                        <><Ionicons name="checkmark" size={14} color="#fff" /><Text style={styles.selectTxt}>Select</Text></>
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
                {mtg.venue && <Text style={[styles.mtgMeta, { marginTop: 8 }]}>📍 {mtg.venue}</Text>}
                {mtg.agenda && <Text style={styles.mtgMeta}>📋 {mtg.agenda}</Text>}
                <TouchableOpacity style={styles.outlineBtn} onPress={() => setMtgModal(true)}>
                  <Ionicons name="pencil" size={13} color={C.teal} />
                  <Text style={styles.outlineTxt}>Propose Different Slot</Text>
                </TouchableOpacity>
              </>
            )}

            {mtg && !hasC && !hasI && hasSingle && (
              <>
                <View style={styles.infoNote}>
                  <Ionicons name="information-circle" size={16} color="#0284c7" />
                  <Text style={styles.infoNoteTxt}>University proposed this time</Text>
                </View>
                <View style={styles.slotCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.slotDate}>{fmtDate(mtg.date)} at {mtg.time}</Text>
                    {mtg.venue && <Text style={styles.slotNote}>📍 {mtg.venue}</Text>}
                    {mtg.agenda && <Text style={styles.slotNote}>📋 {mtg.agenda}</Text>}
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
                  <TouchableOpacity style={[styles.selectBtn, { flex: 1, justifyContent: "center", paddingVertical: 12 }]}
                    onPress={() => selectSlot({ date: mtg.date, time: mtg.time, note: "" })} disabled={actLd}>
                    {actLd ? <ActivityIndicator color="#fff" size="small" /> : (
                      <><Ionicons name="checkmark-circle" size={15} color="#fff" /><Text style={styles.selectTxt}>Confirm This Slot</Text></>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.outlineBtn, { flex: 1, justifyContent: "center" }]} onPress={() => setMtgModal(true)}>
                    <Ionicons name="pencil" size={13} color={C.teal} />
                    <Text style={styles.outlineTxt}>Propose New</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </>
        )}

        {tab === "activity" && (
          <>
            {hasC && (
              <View style={[styles.activityRecap, { marginBottom: 16 }]}>
                <View style={styles.activityRecapHead}>
                  <View style={styles.activityRecapIcon}>
                    <Ionicons name="checkmark-sharp" size={14} color="#15803d" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.activityRecapEyebrow}>Latest Milestone</Text>
                    <Text style={styles.activityRecapTitle}>Meeting Confirmed</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View style={styles.dtCell}><Text style={styles.dtLabel}>DATE</Text><Text style={styles.dtVal}>{cs.date}</Text></View>
                  <View style={styles.dtCell}><Text style={styles.dtLabel}>TIME</Text><Text style={styles.dtVal}>🕐 {cs.time}</Text></View>
                </View>
              </View>
            )}

            <Text style={styles.actSection}>Timeline</Text>
            {[
              { lbl: "Draft Created",     date: mou.createdAt,          done: true },
              { lbl: "Sent to Industry Laison Incharge",  date: mou.sentAt,             done: !!mou.sentAt },
              { lbl: "Our Response",      date: mou.industryResponseAt, done: !!mou.industryResponseAt },
              { lbl: "Meeting Confirmed", date: mtg?.confirmedAt,       done: hasC },
              { lbl: "Mutually Approved", date: null,                   done: isMutual },
            ].map((t, i) => (
              <View key={i} style={styles.tlRow}>
                <View style={[styles.tlDot, { backgroundColor: t.done ? C.success : C.border }]}>
                  {t.done && <Ionicons name="checkmark" size={10} color="#fff" />}
                </View>
                <View style={styles.tlLine} />
                <View>
                  <Text style={[styles.tlLbl, { color: t.done ? C.text : C.textLight }]}>{t.lbl}</Text>
                  {t.date && <Text style={styles.tlDate}>{fmtDate(t.date)}</Text>}
                </View>
              </View>
            ))}

            {(mou.changeLog || []).length > 0 && (
              <>
                <Text style={[styles.actSection, { marginTop: 20 }]}>All Activity</Text>
                {[...(mou.changeLog || [])].reverse().map((e: any, i: number) => {
                  const ct = CT[e.type] || { c: C.textLight, bg: C.bg, ic: "📌", lbl: e.type };
                  return (
                    <View key={e.id || i} style={[styles.logCard, { backgroundColor: ct.bg, borderColor: ct.c + "30" }]}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <Text style={{ fontSize: 14 }}>{ct.ic}</Text>
                        <Text style={{ fontSize: 11, fontWeight: "700", color: ct.c }}>{ct.lbl}</Text>
                        <Text style={{ marginLeft: "auto", fontSize: 10, color: C.textLight }}>{e.party}</Text>
                      </View>
                      {e.message && <Text style={{ fontSize: 12, color: C.text, lineHeight: 18 }}>{e.message}</Text>}
                      <Text style={{ fontSize: 10, color: C.textLight, marginTop: 4 }}>{fmtDT(e.date)}</Text>
                    </View>
                  );
                })}
              </>
            )}
          </>
        )}
       </Animated.View>
      </ScrollView>

      <RespModal    visible={respModal} mou={mou} onClose={() => setRespModal(false)} onSave={doResponse} loading={actLd} />
      <PropMtgModal visible={mtgModal}  mou={mou} onClose={() => setMtgModal(false)}  onSave={proposeSlot} loading={actLd} />
      <SignModal    visible={signModal} mou={mou} defaultName={user?.name || ""} onClose={() => setSignModal(false)} onSave={submitIndustrySignature} loading={actLd} />
    </View>
  );
}

// ─── Response Modal ───────────────────────────────────────────
const RespModal = ({ visible, mou, onClose, onSave, loading }: any) => {
  const [type, setType] = useState("comment");
  const [msg,  setMsg]  = useState("");
  const [changes, setChanges] = useState([{ field: "", oldValue: "", newValue: "", reason: "" }]);

  const cfg: Record<string, { c: string; bg: string; lbl: string; icon: string }> = {
    accept:  { c: "#16a34a", bg: "#f0fdf4", lbl: "Accept MOU",      icon: "thumbs-up-outline" },
    reject:  { c: "#dc2626", bg: "#fef2f2", lbl: "Reject MOU",      icon: "thumbs-down-outline" },
    comment: { c: "#0284c7", bg: "#eff6ff", lbl: "Comment",         icon: "chatbubble-outline" },
    change:  { c: "#7c3aed", bg: "#f5f3ff", lbl: "Propose Changes", icon: "git-pull-request-outline" },
  };

  const submit = () => {
    if (!msg.trim() && type !== "accept" && type !== "reject") { Alert.alert("Required", "Enter a message."); return; }
    onSave({ type, message: msg || (type === "accept" ? `${mou?.industry} accepted.` : `${mou?.industry} rejected.`),
      changes: type === "change" ? changes.filter((c: any) => c.field).map((c: any) => ({ ...c, date: new Date().toISOString() })) : undefined });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={sharedStyles.overlay}>
        <View style={sharedStyles.sheet}>
          <View style={sharedStyles.sheetHandle} />
          <View style={sharedStyles.sheetHead}>
            <Text style={sharedStyles.sheetTitle}>Respond to MOU</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={C.text} /></TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
            <Text style={sharedStyles.fieldLbl}>Response Type</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6, marginBottom: 16 }}>
              {Object.keys(cfg).map(k => (
                <TouchableOpacity key={k}
                  style={[styles.respTypeBtn, type === k && { borderColor: cfg[k].c, backgroundColor: cfg[k].bg }]}
                  onPress={() => setType(k)}>
                  <Ionicons name={cfg[k].icon as any} size={14} color={type === k ? cfg[k].c : C.textLight} />
                  <Text style={[styles.respTypeTxt, type === k && { color: cfg[k].c }]}>{cfg[k].lbl}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <FieldInput label={type === "accept" ? "Acceptance Note (optional)" : "Message *"}
              value={msg} onChange={setMsg}
              placeholder={type === "accept" ? "e.g. We accept as presented." : type === "reject" ? "Reason for rejection..." : "Your message..."} multiline />

            {type === "change" && (
              <>
                <Text style={[sharedStyles.fieldLbl, { color: C.purple, marginTop: 8 }]}>Proposed Changes</Text>
                {changes.map((ch, i) => (
                  <View key={i} style={styles.changeBlock}>
                    <TextInput style={sharedStyles.fieldInput} placeholder="Field / Section" value={ch.field}
                      onChangeText={v => { const a = [...changes]; a[i].field = v; setChanges(a); }} />
                    <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
                      <TextInput style={[sharedStyles.fieldInput, { flex: 1, marginTop: 0 }]} placeholder="Current value"
                        value={ch.oldValue} onChangeText={v => { const a = [...changes]; a[i].oldValue = v; setChanges(a); }} />
                      <TextInput style={[sharedStyles.fieldInput, { flex: 1, marginTop: 0 }]} placeholder="New value"
                        value={ch.newValue} onChangeText={v => { const a = [...changes]; a[i].newValue = v; setChanges(a); }} />
                    </View>
                    <TextInput style={[sharedStyles.fieldInput, { marginTop: 6 }]} placeholder="Reason for change"
                      value={ch.reason} onChangeText={v => { const a = [...changes]; a[i].reason = v; setChanges(a); }} />
                  </View>
                ))}
                <TouchableOpacity onPress={() => setChanges(c => [...c, { field: "", oldValue: "", newValue: "", reason: "" }])}>
                  <Text style={{ color: C.purple, fontWeight: "700", textAlign: "center", marginTop: 4 }}>+ Add Change</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
          <View style={sharedStyles.sheetFoot}>
            <TouchableOpacity onPress={onClose} style={{ paddingHorizontal: 16, justifyContent: "center" }}>
              <Text style={{ color: C.textLight, fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[sharedStyles.saveBtn, { flex: 1, backgroundColor: cfg[type].c }]} onPress={submit} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" size="small" /> :
                <Text style={sharedStyles.saveBtnTxt}>Submit Response</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── Sign MOU Modal ───────────────────────────────────────────
const SignModal = ({ visible, mou, defaultName = "", onClose, onSave, loading }: any) => {
  const [name, setName]   = useState(defaultName || mou?.signatories?.industry || mou?.industry || "");
  const [typed, setTyped] = useState(defaultName || "");

  useEffect(() => {
    if (visible) {
      setName(defaultName || mou?.signatories?.industry || mou?.industry || "");
      setTyped(defaultName || "");
    }
  }, [visible, defaultName, mou]);

  const submit = () => {
    if (!typed.trim()) { Alert.alert("Required", "Please type your signature."); return; }
    if (!name.trim())  { Alert.alert("Required", "Please enter the printed signatory name."); return; }
    onSave({
      mode:    "type",
      dataUrl: "",
      text:    typed.trim(),
      signedBy: name.trim(),
      signedAt: new Date().toISOString(),
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={sharedStyles.overlay}>
        <View style={sharedStyles.sheet}>
          <View style={sharedStyles.sheetHandle} />
          <View style={sharedStyles.sheetHead}>
            <Text style={sharedStyles.sheetTitle}>Sign MOU</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={C.text} /></TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 22 }}>
            <View style={styles.infoNote}>
              <Ionicons name="information-circle" size={16} color={C.navy} />
              <Text style={styles.infoNoteTxt}>
                Sign on behalf of {mou?.industry || "your organization"}. Your signature is sent back to the
                Industry Liaison and embedded in the official MOU document.
              </Text>
            </View>

            <Text style={[sharedStyles.fieldLbl, { marginTop: 8 }]}>Type your signature *</Text>
            <TextInput
              style={[sharedStyles.fieldInput, { fontSize: 16 }]}
              value={typed}
              onChangeText={setTyped}
              placeholder="e.g. Hassan Ali Mir"
              placeholderTextColor={C.textLight}
              autoCapitalize="words"
            />

            <View style={styles.sigPreviewWrap}>
              <Text style={styles.sigPreviewLbl}>PREVIEW</Text>
              <Text style={styles.sigPreviewVal} numberOfLines={1}>
                {typed.trim() || "Your signature"}
              </Text>
            </View>

            <Text style={[sharedStyles.fieldLbl, { marginTop: 14 }]}>Signed by (printed name) *</Text>
            <TextInput
              style={sharedStyles.fieldInput}
              value={name}
              onChangeText={setName}
              placeholder="Full name & designation"
              placeholderTextColor={C.textLight}
            />
          </ScrollView>
          <View style={sharedStyles.sheetFoot}>
            <TouchableOpacity onPress={onClose} style={{ paddingHorizontal: 16, justifyContent: "center" }}>
              <Text style={{ color: C.textLight, fontWeight: "700" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[sharedStyles.saveBtn, { flex: 1 }]} onPress={submit} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" size="small" /> : (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Ionicons name="create" size={14} color="#fff" />
                  <Text style={sharedStyles.saveBtnTxt}>Sign &amp; Send</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── Propose Meeting Modal ────────────────────────────────────
const PropMtgModal = ({ visible, mou, onClose, onSave, loading }: any) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const mtg = mou?.scheduledMeeting;

  const useOpt = (o: any) => { setDate(o.date || ""); setTime(o.time || ""); setNote(o.note || ""); };

  const submit = () => {
    if (!date || !time) { Alert.alert("Required", "Enter date and time."); return; }
    onSave({ date, time, note });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={sharedStyles.overlay}>
        <View style={sharedStyles.sheet}>
          <View style={sharedStyles.sheetHandle} />
          <View style={sharedStyles.sheetHead}>
            <Text style={sharedStyles.sheetTitle}>Propose Meeting Slot</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={22} color={C.text} /></TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
            <View style={styles.infoNote}>
              <Ionicons name="information-circle" size={16} color="#0284c7" />
              <Text style={styles.infoNoteTxt}>University will review and confirm your proposed slot.</Text>
            </View>

            {mtg?.options?.length > 0 && (
              <>
                <Text style={[sharedStyles.fieldLbl, { marginTop: 12 }]}>University's options (tap to use):</Text>
                {mtg.options.map((o: any, i: number) => (
                  <TouchableOpacity key={i} style={styles.optRow} onPress={() => useOpt(o)}>
                    <Text style={styles.optTxt}>{o.date} at {o.time}</Text>
                    <Text style={{ color: C.teal, fontWeight: "700", fontSize: 12 }}>Use</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
            {mtg?.date && !mtg?.options?.length && (
              <TouchableOpacity style={styles.optRow} onPress={() => useOpt({ date: mtg.date, time: mtg.time })}>
                <Text style={styles.optTxt}>{fmtDate(mtg.date)} at {mtg.time}</Text>
                <Text style={{ color: C.teal, fontWeight: "700", fontSize: 12 }}>Use</Text>
              </TouchableOpacity>
            )}

            <Text style={[sharedStyles.fieldLbl, { marginTop: 16 }]}>Your Preferred Slot:</Text>
            <FieldInput label="Date (YYYY-MM-DD) *" value={date} onChange={setDate} placeholder="e.g. 2025-08-15" />
            <FieldInput label="Time (HH:MM) *" value={time} onChange={setTime} placeholder="e.g. 10:00" />
            <FieldInput label="Note (optional)" value={note} onChange={setNote} placeholder="e.g. Prefer morning" />
          </ScrollView>
          <View style={sharedStyles.sheetFoot}>
            <TouchableOpacity onPress={onClose} style={{ paddingHorizontal: 16, justifyContent: "center" }}>
              <Text style={{ color: C.textLight, fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[sharedStyles.saveBtn, { flex: 1 }]} onPress={submit} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" size="small" /> : (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="send" size={14} color="#fff" />
                  <Text style={sharedStyles.saveBtnTxt}>Submit to University</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // ── Header CTA (compact navy chip) ──
  headerCta: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 10,
    shadowColor: C.navy, shadowOpacity: 0.18, shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  headerCtaIcon: {
    width: 18, height: 18, borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center", alignItems: "center",
  },
  headerCtaTxt: { color: C.white, fontWeight: "700", fontSize: 12, letterSpacing: 0.3 },

  emptyIconWrap: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: C.teal + "12",
    borderWidth: 1.5, borderColor: C.teal + "33",
    justifyContent: "center", alignItems: "center", marginBottom: 12,
  },

  // ── Hero gradient ──
  hero: {
    paddingHorizontal: 18, paddingTop: 18, paddingBottom: 16,
    borderBottomLeftRadius: 22, borderBottomRightRadius: 22,
    marginBottom: 6,
  },
  heroTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  heroIcon: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.28)",
  },
  heroTitle: { fontSize: 16, fontWeight: "800", color: C.white, letterSpacing: 0.3 },
  heroSub: { fontSize: 11, color: "rgba(255,255,255,0.78)", marginTop: 2 },
  statsRow: {
    flexDirection: "row", marginTop: 16, paddingVertical: 12, paddingHorizontal: 6,
    backgroundColor: "rgba(255,255,255,0.10)", borderRadius: 14,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.18)",
  },
  statCell: { flex: 1, alignItems: "center" },
  statVal: { fontSize: 22, fontWeight: "800", color: C.white, letterSpacing: 0.4 },
  statLbl: { fontSize: 10, color: "rgba(255,255,255,0.78)", marginTop: 2, fontWeight: "600", letterSpacing: 0.5 },
  statDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.22)", marginVertical: 6 },

  // ── Filter pills ──
  filterRow: {
    flexDirection: "row", backgroundColor: C.white,
    paddingHorizontal: 14, paddingVertical: 12, gap: 8,
    borderBottomWidth: 1, borderColor: C.border,
  },
  filterTab: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 22,
    backgroundColor: C.bg, borderWidth: 1, borderColor: "transparent",
  },
  filterTabActive: {
    backgroundColor: C.teal + "12", borderColor: C.teal + "55",
    shadowColor: C.teal, shadowOpacity: 0.12, shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  filterTabTxt: { fontSize: 12, fontWeight: "700", color: C.textMid },
  filterTabTxtActive: { color: C.teal, fontWeight: "800" },

  // ── Card ──
  mouListCard: {
    backgroundColor: C.white, borderRadius: 18, marginBottom: 16,
    overflow: "hidden", flexDirection: "row",
    shadowColor: C.navy, shadowOpacity: 0.10, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }, elevation: 4,
    borderWidth: 1, borderColor: C.border,
  },
  cardAccent: { width: 5 },
  cardBody: { flex: 1, paddingVertical: 18, paddingHorizontal: 18, gap: 14 },

  // top row
  cardTopRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  cardThumb: {
    width: 46, height: 46, borderRadius: 13,
    justifyContent: "center", alignItems: "center",
    borderWidth: 1,
  },
  mouListTitle: { fontSize: 16, fontWeight: "800", color: C.navy, letterSpacing: 0.2, lineHeight: 22 },
  subRow: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 6 },
  mouListSub: { fontSize: 12.5, color: C.textMid, fontWeight: "600", flex: 1, lineHeight: 18 },

  // chips row
  chipRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 },
  typePill: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: C.teal + "12", borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: C.teal + "30",
  },
  typePillTxt: { fontSize: 11, color: C.teal, fontWeight: "700", letterSpacing: 0.3 },
  urgentChip: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "#fff7ed", borderRadius: 12,
    paddingHorizontal: 11, paddingVertical: 5,
    borderWidth: 1, borderColor: "#fed7aa",
  },
  urgentDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#ea580c" },
  urgentTxt: { fontSize: 11, color: "#c2410c", fontWeight: "800", letterSpacing: 0.35 },

  // footer
  mouListFooter: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingTop: 14, borderTopWidth: 1, borderColor: C.border, gap: 12,
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 7, flexShrink: 1 },
  mouListDate: { fontSize: 12, color: C.textMid, fontWeight: "600", lineHeight: 16 },
  mtgConfirmedChip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#dcfce7",
    paddingHorizontal: 9, paddingVertical: 4, borderRadius: 12,
    borderWidth: 1, borderColor: "#86efac",
  },
  mtgConfirmedTxt: { fontSize: 11, color: "#15803d", fontWeight: "800" },
  pdfMiniChip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: C.navy + "0E", borderRadius: 12,
    paddingHorizontal: 9, paddingVertical: 4,
    borderWidth: 1, borderColor: C.navyMid + "33",
  },
  pdfMiniChipTxt: { fontSize: 11, color: C.navy, fontWeight: "800" },

  mtgPreview: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: C.teal + "0E", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: C.teal + "30",
  },
  mtgPreviewLbl: { fontSize: 10, color: C.teal, fontWeight: "800", letterSpacing: 0.6, textTransform: "uppercase" },
  mtgPreviewVal: { fontSize: 12.5, color: C.navy, fontWeight: "700", marginTop: 1 },
  cardChevron: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: C.teal + "12",
    justifyContent: "center", alignItems: "center",
  },

  // ── PDF card on detail screen ──
  pdfCard: {
    flexDirection: "row", gap: 14, alignItems: "flex-start",
    backgroundColor: C.white, borderRadius: 16, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: C.navyMid + "33",
    shadowColor: C.navy, shadowOpacity: 0.08, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  pdfIcon: {
    width: 50, height: 56, borderRadius: 10,
    backgroundColor: C.navy + "0E", justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: C.navyMid + "55",
  },
  pdfBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    alignSelf: "flex-start", marginBottom: 6,
    backgroundColor: C.navy + "10", borderRadius: 10,
    paddingHorizontal: 9, paddingVertical: 4,
    borderWidth: 1, borderColor: C.navyMid + "30",
  },
  pdfBadgeTxt: { fontSize: 10, color: C.navy, fontWeight: "800", letterSpacing: 0.3 },
  pdfName: { fontSize: 14, fontWeight: "800", color: C.navy, letterSpacing: 0.2 },
  pdfMeta: { fontSize: 11, color: C.textMid, marginTop: 4, fontWeight: "500" },
  pdfBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    backgroundColor: C.navy, paddingVertical: 11, paddingHorizontal: 18,
    borderRadius: 12, alignSelf: "flex-start", marginTop: 12,
    shadowColor: C.navy, shadowOpacity: 0.28, shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  pdfBtnTxt: { color: "#fff", fontWeight: "800", fontSize: 13, letterSpacing: 0.3 },

  // ── Signature card ──
  sigCard: {
    backgroundColor: C.white, borderRadius: 16, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: C.border,
    shadowColor: C.navy, shadowOpacity: 0.06, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  sigHead: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  sigHeadIcon: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: C.navyMid + "12",
    borderWidth: 1, borderColor: C.navyMid + "30",
    justifyContent: "center", alignItems: "center",
  },
  sigHeadTitle: { fontSize: 14, fontWeight: "800", color: C.navy, letterSpacing: 0.3 },
  sigHeadSub:   { fontSize: 11.5, color: C.textMid, marginTop: 2, fontWeight: "500", lineHeight: 16 },
  sigGrid: { flexDirection: "row", gap: 10, marginBottom: 12 },
  sigBox: {
    flex: 1, padding: 12, borderRadius: 12,
    borderWidth: 1, borderColor: C.border, backgroundColor: C.bg,
    minHeight: 96, justifyContent: "flex-start",
  },
  sigBoxSigned: {
    backgroundColor: "#f0fdf4", borderColor: "#86efac",
  },
  sigBoxLbl: { fontSize: 9, color: C.textLight, fontWeight: "800", letterSpacing: 1.2, marginBottom: 6 },
  sigBoxName: { fontSize: 12, color: "#15803d", fontWeight: "800", marginTop: 4 },
  sigBoxDate: { fontSize: 10.5, color: C.textLight, marginTop: 2 },
  sigBoxPending: { fontSize: 12, color: C.textLight, fontStyle: "italic", marginTop: 16 },
  sigCursive: {
    fontSize: 22, color: C.navy, fontWeight: "600", letterSpacing: 0.3,
    fontStyle: "italic", marginBottom: 4,
  },
  sigBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: C.navy, paddingVertical: 12, borderRadius: 12,
    shadowColor: C.navy, shadowOpacity: 0.25, shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  sigBtnTxt: { color: C.white, fontWeight: "800", fontSize: 13, letterSpacing: 0.3 },

  // ── Sign modal preview ──
  sigPreviewWrap: {
    marginTop: 12, padding: 18, borderRadius: 12,
    borderWidth: 1.5, borderColor: C.border, backgroundColor: C.bg,
    alignItems: "center",
  },
  sigPreviewLbl: { fontSize: 9.5, color: C.textLight, fontWeight: "800", letterSpacing: 1.4, marginBottom: 6 },
  sigPreviewVal: { fontSize: 28, color: C.navy, fontStyle: "italic", fontWeight: "600" },

  // ── Meeting card on details tab ──
  mtgInfoCard: {
    backgroundColor: C.white, borderRadius: 16, padding: 18, marginBottom: 14,
    borderWidth: 1, borderColor: C.navyMid + "26",
    shadowColor: C.navy, shadowOpacity: 0.08, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  mtgInfoCardConfirmed: {
    backgroundColor: "#f0fdf4", borderColor: "#86efac",
  },
  mtgInfoHead: { flexDirection: "row", alignItems: "center", gap: 13, marginBottom: 14 },
  mtgInfoIcon: {
    width: 38, height: 38, borderRadius: 13,
    justifyContent: "center", alignItems: "center",
  },
  mtgInfoTitle: { fontSize: 15, fontWeight: "800", color: C.navy, letterSpacing: 0.3, lineHeight: 20 },
  mtgInfoSub: { fontSize: 12, color: C.textMid, marginTop: 3, fontWeight: "500", lineHeight: 17 },
  mtgSlotsRow: { flexDirection: "row", gap: 10, marginTop: 6 },
  mtgSlotCell: {
    flex: 1, backgroundColor: C.bg, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: C.border,
  },
  mtgSlotLbl: { fontSize: 9, color: C.textLight, fontWeight: "800", letterSpacing: 1.4 },
  mtgSlotVal: { fontSize: 15, fontWeight: "800", color: C.navy, marginTop: 6, letterSpacing: 0.2 },
  mtgOptionRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: C.navyMid + "08", borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: C.navyMid + "22",
  },
  mtgOptionDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.navyMid },
  mtgOptionTxt: { fontSize: 13, fontWeight: "800", color: C.navy, letterSpacing: 0.2 },
  mtgOptionNote: { fontSize: 11.5, color: C.textMid, fontStyle: "italic", flex: 1 },
  mtgMetaRow: { flexDirection: "row", alignItems: "flex-start", gap: 9, paddingVertical: 2 },
  mtgMetaTxt: { fontSize: 13, color: C.text, flex: 1, lineHeight: 19 },
  mtgMetaLbl: { fontWeight: "800", color: C.navy },
  mtgFromTxt: { fontSize: 11, color: C.textLight, marginTop: 8, fontStyle: "italic" },
  mtgGoBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
    marginTop: 14, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14,
    shadowColor: C.navy, shadowOpacity: 0.22, shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  mtgGoIcon: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.35)",
    justifyContent: "center", alignItems: "center",
  },
  mtgGoTxt: { fontSize: 12.5, color: C.white, fontWeight: "800", letterSpacing: 0.4, textAlign: "center" },

  // ── Detail hero ──
  detailHero: {
    marginHorizontal: 14, marginTop: 12, marginBottom: 6,
    borderRadius: 18, padding: 18,
    flexDirection: "row", alignItems: "center", gap: 12,
    shadowColor: C.navy, shadowOpacity: 0.15, shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }, elevation: 5,
  },
  detailHeroLbl: { fontSize: 10, color: "rgba(255,255,255,0.85)", fontWeight: "700", letterSpacing: 1.4, textTransform: "uppercase" },
  detailHeroTitle: { fontSize: 18, fontWeight: "800", color: C.white, marginTop: 4, letterSpacing: 0.3 },
  detailHeroSub: { fontSize: 12, color: "rgba(255,255,255,0.78)", marginTop: 4 },
  finalChip: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "#ffffff",
    paddingHorizontal: 11, paddingVertical: 5, borderRadius: 14,
    borderWidth: 1, borderColor: "#86efac",
  },
  finalChipTxt: { fontSize: 11, color: "#15803d", fontWeight: "800", letterSpacing: 0.4 },

  stepRow: { flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 18, paddingHorizontal: 24, backgroundColor: C.white,
    borderBottomWidth: 1, borderColor: C.border },
  stepItem: { flexDirection: "row", alignItems: "center" },
  stepDot:  { width: 30, height: 30, borderRadius: 15, backgroundColor: C.bg, borderWidth: 2, borderColor: C.border,
    justifyContent: "center", alignItems: "center" },
  stepDotActive: { backgroundColor: C.teal, borderColor: C.teal,
    shadowColor: C.teal, shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  stepNum: { fontSize: 12, fontWeight: "800", color: C.textLight },
  stepLbl: { fontSize: 10, color: C.textLight, fontWeight: "700", marginLeft: 7, marginRight: 10, letterSpacing: 0.4 },
  stepLine: { width: 28, height: 2, backgroundColor: C.border, marginHorizontal: 4, borderRadius: 2 },
  stepLineActive: { backgroundColor: C.teal },
  stepHeading: { fontSize: 18, fontWeight: "800", color: C.navy, marginBottom: 22, letterSpacing: 0.3 },
  createForm: { padding: 22, paddingBottom: 64 },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6, marginBottom: 16 },
  typeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5,
    borderColor: C.border, backgroundColor: C.white },
  typeChipActive: { backgroundColor: C.teal, borderColor: C.teal },
  typeChipTxt: { fontSize: 12, color: C.textMid, fontWeight: "600" },
  typeChipTxtActive: { color: "#fff" },
  objNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: C.navy,
    justifyContent: "center", alignItems: "center", flexShrink: 0 },
  objNumTxt: { fontSize: 11, fontWeight: "900", color: "#fff" },
  addRowBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 10, marginTop: 4 },
  addRowTxt: { fontSize: 13, color: C.teal, fontWeight: "700" },
  reviewCard: {
    backgroundColor: C.teal + "08", borderRadius: 16, padding: 18, marginTop: 24,
    borderWidth: 1, borderColor: C.teal + "33",
  },
  reviewTitle: { fontSize: 14, fontWeight: "800", color: C.teal, marginBottom: 14, letterSpacing: 0.4, textTransform: "uppercase" },
  reviewRow:   { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10,
    borderBottomWidth: 1, borderColor: C.teal + "20" },
  reviewLbl:   { fontSize: 13, color: C.textMid, fontWeight: "600" },
  reviewVal:   { fontSize: 13, color: C.navy, fontWeight: "800", maxWidth: "55%", textAlign: "right" },
  stepBtns: { flexDirection: "row", gap: 12, marginTop: 32 },
  backStepBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 22, paddingVertical: 14,
    borderRadius: 14, borderWidth: 1.5, borderColor: C.teal, backgroundColor: C.teal + "08" },
  backStepTxt: { fontSize: 14, color: C.teal, fontWeight: "800", letterSpacing: 0.3 },
  nextStepBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: C.teal, padding: 15, borderRadius: 14,
    shadowColor: C.teal, shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  nextStepTxt: { fontSize: 14, color: "#fff", fontWeight: "800", letterSpacing: 0.3 },

  statusStrip: { flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.white,
    borderBottomWidth: 1, borderColor: C.border, gap: 10 },
  respBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: C.goldLight,
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 22,
    shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  respBtnTxt: { fontSize: 12, color: C.navy, fontWeight: "800", letterSpacing: 0.3 },
  tabBar: {
    flexDirection: "row", backgroundColor: C.white,
    marginHorizontal: 14, marginTop: 12, marginBottom: 6,
    borderRadius: 14, padding: 5,
    borderWidth: 1, borderColor: C.border,
    shadowColor: C.navy, shadowOpacity: 0.06, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  tabItem: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 7, paddingVertical: 11, borderRadius: 10,
  },
  tabItemActive: {
    backgroundColor: C.navy,
    shadowColor: C.navy, shadowOpacity: 0.18, shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  tabTxt: { fontSize: 12, color: C.textMid, fontWeight: "700" },
  tabTxtActive: { color: C.white, fontWeight: "800", letterSpacing: 0.3 },

  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 8 },
  bullet:    { width: 7, height: 7, borderRadius: 4, backgroundColor: C.teal, marginTop: 7, flexShrink: 0 },
  bulletTxt: { fontSize: 13, color: C.text, flex: 1, lineHeight: 21 },
  changeRow:    { backgroundColor: "#F5F3FF", borderRadius: 10, padding: 12, marginBottom: 8 },
  changeLbl:    { fontSize: 12, fontWeight: "800", color: C.purple },
  changeVals:   { fontSize: 13, marginTop: 4 },
  changeReason: { fontSize: 11, color: C.textLight, marginTop: 4 },
  stampRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  stampDot: { width: 10, height: 10, borderRadius: 5 },
  stampLbl: { fontSize: 13, fontWeight: "700", color: C.text },
  stampDate:{ fontSize: 11, color: C.textLight, marginTop: 2 },

  confirmedCard: {
    backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
    borderRadius: 18, marginBottom: 14, overflow: "hidden",
    shadowColor: C.navy, shadowOpacity: 0.10, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }, elevation: 4,
  },
  confirmedHero: {
    flexDirection: "row", alignItems: "center", gap: 14,
    paddingHorizontal: 18, paddingVertical: 16,
  },
  confirmedIcon: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.22)",
    justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.45)",
  },
  confirmedEyebrow: {
    fontSize: 9.5, color: "rgba(255,255,255,0.7)",
    fontWeight: "800", letterSpacing: 1.6, textTransform: "uppercase",
  },
  confirmedTitle: { fontSize: 17, fontWeight: "800", color: C.white, marginTop: 3, letterSpacing: 0.3 },
  confirmedBody: { padding: 18, gap: 8 },
  confirmedDivider: {
    height: 1, backgroundColor: C.border,
    marginVertical: 8, marginHorizontal: -18, paddingHorizontal: 18,
  },
  confirmedSince: { fontSize: 11, color: C.textLight, marginTop: 8, fontStyle: "italic" },
  dtCell: {
    flex: 1, backgroundColor: C.bg, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: C.border,
  },
  dtLabel: { fontSize: 9, color: C.textLight, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1.4 },
  dtVal:  { fontSize: 15, fontWeight: "800", color: C.navy, marginTop: 5, letterSpacing: 0.2 },
  mtgMeta:{ fontSize: 12.5, color: C.textMid, marginTop: 8, lineHeight: 18 },

  // Activity tab "Latest Milestone" recap card
  activityRecap: {
    backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
    borderRadius: 16, padding: 16,
    shadowColor: C.navy, shadowOpacity: 0.06, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  activityRecapHead: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  activityRecapIcon: {
    width: 30, height: 30, borderRadius: 10,
    backgroundColor: "#dcfce7", borderWidth: 1, borderColor: "#86efac",
    justifyContent: "center", alignItems: "center",
  },
  activityRecapEyebrow: {
    fontSize: 9.5, color: C.textLight, fontWeight: "800",
    letterSpacing: 1.4, textTransform: "uppercase",
  },
  activityRecapTitle: { fontSize: 14.5, fontWeight: "800", color: C.navy, marginTop: 2, letterSpacing: 0.3 },
  pendingCard: {
    backgroundColor: C.white, borderWidth: 1, borderColor: C.navyMid + "30",
    borderRadius: 16, padding: 18, marginBottom: 14,
    shadowColor: C.navy, shadowOpacity: 0.06, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  pendingHead: { flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 10 },
  pendingDot: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: C.navy,
    borderWidth: 2, borderColor: C.navyMid + "55",
  },
  pendingTitle: { fontSize: 14, fontWeight: "800", color: C.navy, letterSpacing: 0.3 },
  pendingSub:   { fontSize: 12, color: C.textMid, marginBottom: 12, lineHeight: 18, fontWeight: "500" },
  infoNote: {
    flexDirection: "row", alignItems: "flex-start", gap: 10,
    backgroundColor: C.navyMid + "0C",
    padding: 14, borderRadius: 12, marginBottom: 14,
    borderWidth: 1, borderColor: C.navyMid + "30",
  },
  infoNoteTxt: { fontSize: 12.5, color: C.navy, flex: 1, fontWeight: "600", lineHeight: 18 },
  slotCard: {
    backgroundColor: C.white, borderRadius: 14, padding: 14, marginBottom: 10,
    flexDirection: "row", alignItems: "center", gap: 12,
    borderWidth: 1, borderColor: C.teal + "30",
    shadowColor: C.navy, shadowOpacity: 0.05, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  slotDate: { fontSize: 14, fontWeight: "800", color: C.navy, letterSpacing: 0.2 },
  slotNote: { fontSize: 12, color: C.textMid, marginTop: 3 },
  selectBtn: {
    flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: C.teal,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12,
    shadowColor: C.teal, shadowOpacity: 0.3, shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  selectTxt: { fontSize: 12, color: "#fff", fontWeight: "800", letterSpacing: 0.3 },
  outlineBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderWidth: 1.5, borderColor: C.navyMid, backgroundColor: C.navyMid + "08",
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    marginTop: 12, alignSelf: "flex-start",
  },
  outlineTxt: { fontSize: 12, color: C.navy, fontWeight: "800", letterSpacing: 0.3 },

  actSection: {
    fontSize: 13, fontWeight: "800", color: C.navy, marginBottom: 14,
    letterSpacing: 0.6, textTransform: "uppercase",
  },
  tlRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 16 },
  tlDot: {
    width: 26, height: 26, borderRadius: 13,
    justifyContent: "center", alignItems: "center", flexShrink: 0,
    borderWidth: 2, borderColor: C.white,
    shadowColor: C.navy, shadowOpacity: 0.08, shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  tlLine: { display: "none" },
  tlLbl: { fontSize: 13, fontWeight: "700" },
  tlDate: { fontSize: 11, color: C.textLight, marginTop: 3, fontWeight: "500" },
  logCard: {
    borderRadius: 14, paddingVertical: 14, paddingHorizontal: 14,
    marginBottom: 10, borderWidth: 1, gap: 4,
    shadowColor: C.navy, shadowOpacity: 0.04, shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },

  respTypeBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: 12, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.white, minWidth: "42%" },
  respTypeTxt: { fontSize: 12, fontWeight: "700", color: C.textLight },
  changeBlock: { backgroundColor: "#F5F3FF", borderRadius: 12, padding: 12, marginBottom: 10 },
  optRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#F0F9FF", borderRadius: 10, padding: 12, marginBottom: 6,
    borderWidth: 1, borderColor: "#BAE6FD" },
  optTxt: { fontSize: 13, color: "#0284C7", fontWeight: "600" },
});