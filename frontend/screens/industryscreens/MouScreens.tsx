import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, Alert, FlatList, KeyboardAvoidingView,
  Modal, Platform, RefreshControl, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";
import {
  API_MOU, C, CT, FieldInput, Header, InfoCard, Row, SBadge,
  addCL, bldPayload, fmtDate, fmtDT, sharedStyles, useToast, useUser
} from "./shared";

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

  const filtered = filter === "All" ? mous :
    mous.filter(m => filter === "Pending" ? ["Sent to Industry Laison Incharge", "Changes Proposed"].includes(m.status) :
      filter === "Approved" ? m.status === "Mutually Approved" : m.status === filter);

  const tabs = ["All", "Pending", "Approved", "Rejected"];

  if (ld) return <View style={sharedStyles.center}><ActivityIndicator color={C.teal} size="large" /></View>;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title="MOU Management"
        right={
          <TouchableOpacity onPress={() => nav.navigate("CreateMoU")} style={sharedStyles.hdrAction}>
            <Ionicons name="add" size={22} color={C.white} />
          </TouchableOpacity>
        }
        back
      />

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {tabs.map(t => (
          <TouchableOpacity key={t} onPress={() => setFilter(t)}
            style={[styles.filterTab, filter === t && styles.filterTabActive]}>
            <Text style={[styles.filterTabTxt, filter === t && styles.filterTabTxtActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={m => m._id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={ref} onRefresh={() => { setRef(true); load(false); }} tintColor={C.teal} />}
        ListEmptyComponent={
          <View style={sharedStyles.emptyState}>
            <Ionicons name="document-text-outline" size={56} color={C.textLight} />
            <Text style={sharedStyles.emptyTitle}>No MOUs yet</Text>
            <Text style={sharedStyles.emptySub}>Tap + to request a new MOU</Text>
          </View>
        }
        renderItem={({ item: m }) => {
          const needsAction = ["Sent to Industry Laison Incharge", "Changes Proposed"].includes(m.status);
          return (
            <TouchableOpacity
              style={[styles.mouListCard, needsAction && styles.mouListCardUrgent]}
              onPress={() => nav.navigate("MouDetail", { mouId: m._id })}
              activeOpacity={0.85}>
              {needsAction && (
                <View style={styles.urgentBanner}>
                  <Ionicons name="flash" size={11} color={C.gold} />
                  <Text style={styles.urgentTxt}>Action Required</Text>
                </View>
              )}
              {m.status === "Mutually Approved" && (
                <View style={[styles.urgentBanner, { backgroundColor: "#dcfce7" }]}>
                  <Ionicons name="checkmark-circle" size={11} color="#16a34a" />
                  <Text style={[styles.urgentTxt, { color: "#16a34a" }]}>Mutually Approved</Text>
                </View>
              )}
              <View style={styles.mouListHead}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.mouListTitle} numberOfLines={1}>{m.title || m.university}</Text>
                  <Text style={styles.mouListSub}>{m.university} · {m.collaborationType}</Text>
                </View>
                <SBadge status={m.status} />
              </View>
              <View style={styles.mouListFooter}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Ionicons name="calendar-outline" size={12} color={C.textLight} />
                  <Text style={styles.mouListDate}>{fmtDate(m.startDate)} → {fmtDate(m.endDate)}</Text>
                </View>
                {(m.scheduledMeeting?.confirmedSlot?.date || m.meetingConfirmedSlot?.date) && (
                  <View style={styles.mtgConfirmedChip}>
                    <Ionicons name="checkmark-circle" size={10} color="#16a34a" />
                    <Text style={styles.mtgConfirmedTxt}>Meeting set</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
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
  const { ax } = useUser();
  const toast = useToast();
  const [mou, setMou] = useState<any>(null);
  const [ld, setLd] = useState(true);
  const [actLd, setActLd] = useState(false);
  const [tab, setTab] = useState("details");
  const [respModal, setRespModal] = useState(false);
  const [mtgModal, setMtgModal] = useState(false);
  const mouId = route.params?.mouId;

  useEffect(() => {
    ax().get(`${API_MOU}/${mouId}`)
      .then((r: any) => setMou(r.data))
      .catch(() => {})
      .finally(() => setLd(false));
  }, [mouId]);

  const upd = (u: any) => setMou(u);

  const doResponse = async (rd: any) => {
    setActLd(true);
    try {
      const lt = rd.type === "accept" ? "industry_approve" : rd.type === "reject" ? "industry_reject" :
        rd.type === "change" ? "industry_change" : "industry_response";
      const cl = addCL(mou, lt, { party: "Industry", from: mou.industry, message: rd.message });
      let ns = mou.status;
      if (rd.type === "accept") ns = "Approved by Industry";
      else if (rd.type === "reject") ns = "Rejected";
      else if (rd.type === "change") ns = "Changes Proposed";
      else ns = "Industry Responded";
      const stamp = rd.type === "accept" ? { by: mou.industry, type: "approve", date: new Date().toISOString() } : mou.industryStamp;
      const pl = { ...bldPayload(mou), status: ns, changeLog: cl, industryStamp: stamp,
        industryResponseAt: new Date().toISOString(),
        proposedChanges: rd.changes ? [...(mou.proposedChanges || []), ...rd.changes] : (mou.proposedChanges || []) };
      const r = await ax().put(`${API_MOU}/${mou._id}`, pl);
      upd(r.data); setRespModal(false);
      toast(rd.type === "accept" ? "🎉 MOU Approved!" : rd.type === "reject" ? "MOU Rejected" : "Response sent!",
        rd.type === "reject" ? "error" : "success");
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

  if (ld) return <View style={sharedStyles.center}><ActivityIndicator size="large" color={C.teal} /></View>;
  if (!mou) return <View style={{ flex: 1, backgroundColor: C.bg }}><Header title="MOU" back /></View>;

  const mtg = mou.scheduledMeeting;
  const cs = mtg?.confirmedSlot, hasC = !!(cs?.date);
  const ip = mtg?.industryProposedSlot, hasI = !!(ip?.date);
  const hasOpts = mtg?.options?.length > 0;
  const hasSingle = !hasOpts && mtg?.date && mtg?.time;
  const canResp = ["Sent to Industry Laison Incharge", "Changes Proposed"].includes(mou.status);
  const isMutual = mou.status === "Mutually Approved";

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Header title={mou.title || "MOU Detail"} back />

      {/* Status strip */}
      <View style={[styles.statusStrip, isMutual && { backgroundColor: "#f0fdf4", borderColor: "#86efac" }]}>
        <SBadge status={mou.status} />
        {isMutual && <Text style={{ fontSize: 13, color: "#16a34a", fontWeight: "700" }}>🎉 Fully Finalized</Text>}
        {canResp && (
          <TouchableOpacity style={styles.respBtn} onPress={() => setRespModal(true)} disabled={actLd}>
            <Ionicons name="chatbubble-ellipses" size={14} color="#fff" />
            <Text style={styles.respBtnTxt}>Respond</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {["details", "meeting", "activity"].map(t => (
          <TouchableOpacity key={t} style={[styles.tabItem, tab === t && styles.tabItemActive]} onPress={() => setTab(t)}>
            <Ionicons name={t === "details" ? "document-text-outline" : t === "meeting" ? "calendar-outline" : "time-outline"} size={15} color={tab === t ? C.teal : C.textLight} />
            <Text style={[styles.tabTxt, tab === t && styles.tabTxtActive]}>
              {t === "details" ? "Details" : t === "meeting" ? "Meeting" : "Activity"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>

        {tab === "details" && (
          <>
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
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <View style={styles.confirmedIcon}>
                    <Ionicons name="checkmark-circle" size={22} color="#fff" />
                  </View>
                  <Text style={styles.confirmedTitle}>Meeting Confirmed! 🎉</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <View style={styles.dtCell}><Text style={styles.dtLabel}>DATE</Text><Text style={styles.dtVal}>{cs.date}</Text></View>
                  <View style={styles.dtCell}><Text style={styles.dtLabel}>TIME</Text><Text style={styles.dtVal}>🕐 {cs.time}</Text></View>
                </View>
                {mtg.venue && <Text style={styles.mtgMeta}>📍 {mtg.venue}</Text>}
                {mtg.agenda && <Text style={styles.mtgMeta}>📋 {mtg.agenda}</Text>}
                {cs.note && <Text style={styles.mtgMeta}>📌 {cs.note}</Text>}
                <Text style={styles.confirmedSince}>Confirmed · {fmtDT(mtg.confirmedAt)}</Text>
              </View>
            )}

            {mtg && !hasC && hasI && (
              <View style={styles.pendingCard}>
                <Text style={styles.pendingTitle}>⏳ Awaiting University Confirmation</Text>
                <Text style={styles.pendingSub}>You proposed:</Text>
                <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
                  <View style={[styles.dtCell, { backgroundColor: "#fffbeb", borderColor: "#fde68a" }]}>
                    <Text style={[styles.dtLabel, { color: "#92400e" }]}>DATE</Text>
                    <Text style={[styles.dtVal, { color: "#92400e" }]}>{ip.date}</Text>
                  </View>
                  <View style={[styles.dtCell, { backgroundColor: "#fffbeb", borderColor: "#fde68a" }]}>
                    <Text style={[styles.dtLabel, { color: "#92400e" }]}>TIME</Text>
                    <Text style={[styles.dtVal, { color: "#92400e" }]}>🕐 {ip.time}</Text>
                  </View>
                </View>
                {ip.note && <Text style={{ fontSize: 12, color: "#a16207" }}>📌 {ip.note}</Text>}
                <TouchableOpacity style={styles.outlineBtn} onPress={() => setMtgModal(true)}>
                  <Ionicons name="pencil" size={13} color={C.teal} />
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
              <View style={[styles.confirmedCard, { marginBottom: 16 }]}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: "#166534", marginBottom: 8 }}>✅ Meeting Confirmed</Text>
                <View style={{ flexDirection: "row", gap: 12 }}>
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
      </ScrollView>

      <RespModal    visible={respModal} mou={mou} onClose={() => setRespModal(false)} onSave={doResponse} loading={actLd} />
      <PropMtgModal visible={mtgModal}  mou={mou} onClose={() => setMtgModal(false)}  onSave={proposeSlot} loading={actLd} />
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
  filterRow:  { flexDirection: "row", backgroundColor: C.white, paddingHorizontal: 12, paddingVertical: 10,
    borderBottomWidth: 1, borderColor: C.border, gap: 8 },
  filterTab:  { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: C.bg },
  filterTabActive: { backgroundColor: C.navy },
  filterTabTxt:    { fontSize: 12, fontWeight: "600", color: C.textLight },
  filterTabTxtActive: { color: "#fff" },

  mouListCard: { backgroundColor: C.white, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 },
  mouListCardUrgent: { borderLeftWidth: 4, borderLeftColor: C.gold },
  urgentBanner: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#FFF8E6",
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start", marginBottom: 10 },
  urgentTxt: { fontSize: 11, color: "#92400E", fontWeight: "700" },
  mouListHead: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  mouListTitle: { fontSize: 15, fontWeight: "700", color: C.navy },
  mouListSub: { fontSize: 12, color: C.textMid, marginTop: 3 },
  mouListFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  mouListDate: { fontSize: 12, color: C.textLight },
  mtgConfirmedChip: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#dcfce7",
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  mtgConfirmedTxt: { fontSize: 11, color: "#16a34a", fontWeight: "600" },

  stepRow: { flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 16, paddingHorizontal: 24, backgroundColor: C.white, borderBottomWidth: 1, borderColor: C.border },
  stepItem: { flexDirection: "row", alignItems: "center" },
  stepDot:  { width: 28, height: 28, borderRadius: 14, backgroundColor: C.bg, borderWidth: 2, borderColor: C.border,
    justifyContent: "center", alignItems: "center" },
  stepDotActive: { backgroundColor: C.teal, borderColor: C.teal },
  stepNum: { fontSize: 12, fontWeight: "700", color: C.textLight },
  stepLbl: { fontSize: 10, color: C.textLight, fontWeight: "600", marginLeft: 6, marginRight: 8 },
  stepLine: { width: 24, height: 2, backgroundColor: C.border, marginHorizontal: 4 },
  stepLineActive: { backgroundColor: C.teal },
  stepHeading: { fontSize: 17, fontWeight: "800", color: C.navy, marginBottom: 20 },
  createForm: { padding: 20, paddingBottom: 60 },
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
  reviewCard: { backgroundColor: "#F0FAFA", borderRadius: 14, padding: 16, marginTop: 20, borderWidth: 1, borderColor: C.teal + "33" },
  reviewTitle: { fontSize: 14, fontWeight: "800", color: C.teal, marginBottom: 12 },
  reviewRow:   { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8,
    borderBottomWidth: 1, borderColor: C.border },
  reviewLbl:   { fontSize: 13, color: C.textMid, fontWeight: "600" },
  reviewVal:   { fontSize: 13, color: C.navy, fontWeight: "700", maxWidth: "55%", textAlign: "right" },
  stepBtns: { flexDirection: "row", gap: 12, marginTop: 32 },
  backStepBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 20, paddingVertical: 14,
    borderRadius: 14, borderWidth: 1.5, borderColor: C.teal },
  backStepTxt: { fontSize: 14, color: C.teal, fontWeight: "700" },
  nextStepBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: C.navy, padding: 14, borderRadius: 14 },
  nextStepTxt: { fontSize: 14, color: "#fff", fontWeight: "700" },

  statusStrip: { flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.white,
    borderBottomWidth: 1, borderColor: C.border, gap: 10 },
  respBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: C.teal,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  respBtnTxt: { fontSize: 12, color: "#fff", fontWeight: "700" },
  tabBar:  { flexDirection: "row", backgroundColor: C.white, borderBottomWidth: 1, borderColor: C.border },
  tabItem: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 5, paddingVertical: 13 },
  tabItemActive: { borderBottomWidth: 2.5, borderBottomColor: C.teal },
  tabTxt:  { fontSize: 12, color: C.textLight, fontWeight: "600" },
  tabTxtActive: { color: C.teal, fontWeight: "700" },

  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 6 },
  bullet:    { width: 6, height: 6, borderRadius: 3, backgroundColor: C.teal, marginTop: 6, flexShrink: 0 },
  bulletTxt: { fontSize: 13, color: C.text, flex: 1, lineHeight: 20 },
  changeRow:    { backgroundColor: "#F5F3FF", borderRadius: 10, padding: 12, marginBottom: 8 },
  changeLbl:    { fontSize: 12, fontWeight: "800", color: C.purple },
  changeVals:   { fontSize: 13, marginTop: 4 },
  changeReason: { fontSize: 11, color: C.textLight, marginTop: 4 },
  stampRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  stampDot: { width: 10, height: 10, borderRadius: 5 },
  stampLbl: { fontSize: 13, fontWeight: "700", color: C.text },
  stampDate:{ fontSize: 11, color: C.textLight, marginTop: 2 },

  confirmedCard: { backgroundColor: "#F0FDF4", borderWidth: 1.5, borderColor: "#86EFAC", borderRadius: 16, padding: 18, marginBottom: 14 },
  confirmedIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#16A34A", justifyContent: "center", alignItems: "center" },
  confirmedTitle: { fontSize: 16, fontWeight: "800", color: "#166534" },
  confirmedSince: { fontSize: 11, color: "#6B7280", marginTop: 12 },
  dtCell: { flex: 1, backgroundColor: "#fff", borderRadius: 10, padding: 10, borderWidth: 1, borderColor: "#BBF7D0" },
  dtLabel:{ fontSize: 9, color: "#6B7280", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 },
  dtVal:  { fontSize: 14, fontWeight: "800", color: "#15803D" },
  mtgMeta:{ fontSize: 12, color: C.textMid, marginTop: 8 },
  pendingCard:  { backgroundColor: "#FFFBEB", borderWidth: 1.5, borderColor: "#FDE68A", borderRadius: 16, padding: 16, marginBottom: 14 },
  pendingTitle: { fontSize: 14, fontWeight: "700", color: "#92400E", marginBottom: 6 },
  pendingSub:   { fontSize: 12, color: "#A16207", marginBottom: 10 },
  infoNote: { flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: "#EFF6FF",
    padding: 12, borderRadius: 12, marginBottom: 14, borderWidth: 1, borderColor: "#BFDBFE" },
  infoNoteTxt: { fontSize: 12, color: "#0284C7", flex: 1, fontWeight: "500" },
  slotCard: { backgroundColor: C.white, borderRadius: 14, padding: 14, marginBottom: 10,
    flexDirection: "row", alignItems: "center", gap: 12, elevation: 1, borderWidth: 1, borderColor: "#BFDBFE" },
  slotDate: { fontSize: 14, fontWeight: "700", color: C.navy },
  slotNote: { fontSize: 12, color: C.textMid, marginTop: 3 },
  selectBtn:{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#16A34A",
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  selectTxt:{ fontSize: 12, color: "#fff", fontWeight: "700" },
  outlineBtn: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1.5, borderColor: C.teal,
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9, marginTop: 12, alignSelf: "flex-start" },
  outlineTxt: { fontSize: 12, color: C.teal, fontWeight: "700" },

  actSection: { fontSize: 14, fontWeight: "800", color: C.navy, marginBottom: 14 },
  tlRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 14 },
  tlDot: { width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  tlLine:{ display: "none" },
  tlLbl: { fontSize: 13, fontWeight: "600" },
  tlDate:{ fontSize: 11, color: C.textLight, marginTop: 2 },
  logCard:{ borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1 },

  respTypeBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: 12, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.white, minWidth: "42%" },
  respTypeTxt: { fontSize: 12, fontWeight: "700", color: C.textLight },
  changeBlock: { backgroundColor: "#F5F3FF", borderRadius: 12, padding: 12, marginBottom: 10 },
  optRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#F0F9FF", borderRadius: 10, padding: 12, marginBottom: 6,
    borderWidth: 1, borderColor: "#BAE6FD" },
  optTxt: { fontSize: 13, color: "#0284C7", fontWeight: "600" },
});