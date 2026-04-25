










import express from "express";
import Mou from "../models/Mou.js";
import { notifyIndustry } from "../utils/notifyIndustry.js";

const router = express.Router();

// ── Helper: push real-time MOU updates to EVERY industry client ──
// Per product decision: do NOT filter by email or industry name — fan out
// MOU events to all currently-connected industry-side clients.
const pushMouUpdate = (req, mou, eventName = "mouUpdated") => {
  try {
    if (!mou) return;
    const fanout = req?.app?.locals?.broadcastToAllIndustry;
    if (fanout) fanout({ event: eventName, data: mou });
  } catch (e) {
    console.error("pushMouUpdate error:", e.message);
  }
};

const titleOf = (mou) => mou?.title || "MOU";

// ── Helper: persist + push a notification for ALL connected industry users ──
// Notifications carry the originating MOU's id/title in `meta` so the client
// can deep-link the user back to the exact MOU they were exchanging on.
const notifyForMou = async (req, mou, { title, message, type = "mou" }) => {
  const fanout      = req?.app?.locals?.broadcastToAllIndustry;
  const listEmails  = req?.app?.locals?.listIndustryEmails;
  const meta = {
    mouId:    mou?._id?.toString?.() ?? mou?._id,
    mouTitle: titleOf(mou),
    industry: mou?.industry,
    status:   mou?.status,
  };
  if (fanout) {
    fanout({
      event: "newNotification",
      data: {
        title, message, type, meta,
        createdAt: new Date().toISOString(),
        isRead: false,
      },
    });
  }
  const emails = listEmails ? listEmails() : [];
  if (mou?.industryContact?.email && !emails.includes(mou.industryContact.email)) {
    emails.push(mou.industryContact.email);
  }
  await Promise.all(emails.map((email) =>
    notifyIndustry(req, { industryEmail: email, title, message, type, meta })
  ));
};

// ── GET all MOUs for this industry (filter by industry name or id) ──
router.get("/mine", async (req, res) => {
  try {
    const { industryId, industry } = req.query;
    const filter = {};
    if (industryId) filter.industryId = industryId;
    else if (industry) filter.industry = { $regex: new RegExp(industry, "i") };

    const mous = await Mou.find(filter).sort({ createdAt: -1 });
    res.json(mous);
  } catch (err) {
    res.status(500).json({ message: "Error fetching MOUs", error: err.message });
  }
});

// ── GET MOU as a printable HTML document (for in-app PDF view) ──
router.get("/:id/pdf-view", async (req, res) => {
  try {
    const mou = await Mou.findById(req.params.id);
    if (!mou) return res.status(404).send("<h2>MOU not found</h2>");

    const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-PK", {
      day: "2-digit", month: "short", year: "numeric",
    }) : "—";
    const refNo = `MOU-${new Date().getFullYear()}-${String(mou._id).slice(-5).toUpperCase()}`;
    const li = (arr) => (arr || []).filter(Boolean).map(x => `<li>${x}</li>`).join("");
    const objectives = mou.objectives || [];
    const terms = mou.terms || [];
    const uniRes = mou.responsibilities?.university || [];
    const indRes = mou.responsibilities?.industry || [];

    // Render the inline signature inside the signature box.
    // Drawn signature → <img> from data URI. Typed → cursive script. Else → empty line.
    const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
    const renderSig = (sig) => {
      if (!sig || !sig.signedAt) return `<div class="line"></div>`;
      if (sig.mode === "draw" && sig.dataUrl?.startsWith?.("data:")) {
        return `<div class="sigInk"><img src="${sig.dataUrl}" alt="signature"/></div>`;
      }
      const text = sig.text || sig.signedBy || "";
      return `<div class="sigInk"><span class="sigCursive">${escapeHtml(text)}</span></div>`;
    };
    const sigMeta = (sig) => {
      if (!sig?.signedAt) return "";
      const when = fmtDate(sig.signedAt);
      const who  = escapeHtml(sig.signedBy || "");
      return `<div class="sigStamp">✓ Signed by ${who} · ${when}</div>`;
    };

    const html = `<!doctype html>
<html><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<title>${refNo} — ${mou.title || "MOU"}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;min-width:0;}
  *,*::before,*::after{
    word-break:break-word;overflow-wrap:anywhere;
  }
  html,body{
    width:100%;max-width:100%;overflow-x:hidden;
    -webkit-text-size-adjust:100%;text-size-adjust:100%;
  }
  body{
    font-family:Georgia,'Times New Roman',serif;color:#1a2340;
    background:#eef3f8;line-height:1.7;
    padding:clamp(8px,2vw,20px);
  }
  .page{
    max-width:820px;width:100%;margin:0 auto;background:#fff;
    border-radius:12px;box-shadow:0 8px 28px rgba(15,34,54,0.10);
    overflow:hidden;
  }
  .frame{
    border:2px solid #193648;border-radius:12px;
    padding:clamp(14px,4vw,30px);
    overflow:hidden;width:100%;
  }
  img,svg{max-width:100%;height:auto;}
  hr{max-width:100%;}
  .head{
    display:flex;justify-content:space-between;align-items:center;gap:14px;
    border-bottom:1px solid #c0cedc;padding-bottom:14px;margin-bottom:14px;
    flex-wrap:wrap;
  }
  .party{font-size:13px;min-width:0;flex:1 1 160px;overflow:hidden;}
  .party.right{text-align:right;}
  .party .tag{font-size:9.5px;letter-spacing:2px;color:#8a9db5;text-transform:uppercase;font-weight:700;}
  .party .name{
    font-weight:700;color:#193648;font-size:15px;margin-top:4px;
    word-break:break-word;overflow-wrap:break-word;
  }
  .center{
    text-align:center;font-size:9px;letter-spacing:3px;color:#8a9db5;
    text-transform:uppercase;font-weight:700;flex:0 0 auto;
  }
  .title{text-align:center;margin:20px 0 10px;}
  .title .eyebrow{font-size:10px;letter-spacing:4px;color:#8a9db5;text-transform:uppercase;font-weight:700;}
  .title h1{
    font-size:clamp(20px,5.4vw,28px);color:#193648;letter-spacing:1px;
    margin-top:8px;line-height:1.25;word-break:break-word;
  }
  .title .sub{
    font-size:12px;color:#8a9db5;margin-top:8px;font-style:italic;
    word-break:break-word;line-height:1.5;
  }
  .seal{
    display:inline-block;border:1.5px solid #15803d;color:#15803d;
    padding:5px 18px;font-size:10.5px;font-weight:700;letter-spacing:2px;
    text-transform:uppercase;margin:8px 0 14px;
  }
  hr{border:none;border-top:1.5px solid #193648;margin:14px 0;}
  .sec{margin-bottom:18px;}
  .sec h3{
    font-size:11px;font-weight:700;color:#193648;letter-spacing:1.4px;
    text-transform:uppercase;border-left:3px solid #193648;
    padding:2px 0 2px 10px;margin-bottom:10px;
  }
  p,li{font-size:14.5px;color:#2d3748;line-height:1.75;word-break:break-word;overflow-wrap:anywhere;}
  ul,ol{padding-left:20px;max-width:100%;}
  li{margin-bottom:4px;}
  strong{color:#193648;}
  /* Parties table — actually a pair of cards on every screen */
  .ptable{
    width:100%;max-width:100%;
    border-collapse:separate;border-spacing:0;font-size:13.5px;
    table-layout:fixed;
  }
  .ptable td{
    padding:14px 16px;border:1px solid #c0cedc;vertical-align:top;
    word-break:break-word;overflow-wrap:anywhere;line-height:1.7;
    max-width:100%;
  }
  .ptable .h td{
    background:#eef3f8;font-weight:700;font-size:9.5px;
    letter-spacing:1.5px;text-transform:uppercase;color:#193648;
  }
  .sigs{display:flex;gap:28px;margin-top:28px;flex-wrap:wrap;}
  .sig{flex:1 1 260px;min-width:0;}
  .sig .lbl{font-size:8.5px;letter-spacing:2px;text-transform:uppercase;color:#a0adb8;font-weight:700;margin-bottom:5px;}
  .sig .line{border-bottom:1px solid #193648;height:42px;margin-bottom:7px;}
  .sig .sigInk{
    border-bottom:1px solid #193648;height:54px;margin-bottom:7px;
    display:flex;align-items:flex-end;justify-content:flex-start;
    padding:4px 2px;overflow:hidden;
  }
  .sig .sigInk img{max-height:48px;max-width:100%;object-fit:contain;}
  .sig .sigCursive{
    font-family:'Brush Script MT','Lucida Handwriting','Segoe Script',cursive;
    font-size:26px;color:#0f2a4a;line-height:1;font-style:italic;
    word-break:break-word;
  }
  .sig .sigStamp{
    font-size:9.5px;color:#15803d;font-weight:700;letter-spacing:1px;
    text-transform:uppercase;margin-top:2px;
  }
  .sig .name{font-weight:700;color:#193648;font-size:13.5px;word-break:break-word;}
  .sig .org{font-size:11.5px;color:#7a8fa6;margin-top:2px;word-break:break-word;}
  .foot{
    margin-top:22px;padding-top:10px;border-top:1px solid #c0cedc;
    display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;
    font-size:10px;color:#a0adb8;font-style:italic;
  }

  /* Tablet — slightly tighter spacing, parties wrap to 2 rows if needed */
  @media (max-width:768px){
    .frame{padding:clamp(14px,4.5vw,24px);}
    .ptable{font-size:13px;}
    .ptable td{padding:12px 14px;}
  }

  /* Mobile (≤640px) — full stack: header parties, parties table, signatures */
  @media (max-width:640px){
    body{padding:8px;background:#fff;}
    .page{box-shadow:none;border-radius:8px;}
    .frame{border-width:1.5px;border-radius:8px;padding:16px;}
    .head{flex-direction:column;align-items:stretch;gap:10px;}
    .head .party,.head .party.right{text-align:left;flex:1 1 100%;}
    .head .center{order:-1;align-self:center;margin-bottom:6px;}
    /* Parties table → stacked cards */
    .ptable,.ptable tbody,.ptable tr,.ptable td{
      display:block;width:100%;
    }
    .ptable tr.h{display:none;}
    .ptable td{
      border:1px solid #c0cedc;border-radius:8px;
      padding:14px;margin-bottom:10px;background:#fff;
    }
    .ptable td:last-child{margin-bottom:0;}
    .sigs{gap:18px;margin-top:20px;}
    .sig{flex:1 1 100%;}
    .foot{justify-content:flex-start;font-size:10px;}
    .title h1{font-size:22px;}
    p,li{font-size:14px;}
  }

  @media print{
    body{padding:0;background:#fff;}
    .page{box-shadow:none;border-radius:0;max-width:none;}
    .frame{border:none;}
  }
</style></head>
<body>
  <div class="page">
  <div class="frame">
    <div class="head">
      <div class="party">
        <div class="tag">University</div>
        <div class="name">${mou.university || "—"}</div>
      </div>
      <div class="center">— Memorandum —</div>
      <div class="party right">
        <div class="tag">Industry Partner</div>
        <div class="name">${mou.industry || "—"}</div>
      </div>
    </div>

    <div class="title">
      <div class="eyebrow">Official Document</div>
      <h1>Memorandum of Understanding</h1>
      <div class="sub">Ref. No.: ${refNo} · Type: ${mou.collaborationType || "—"} · Status: ${mou.status || "—"}</div>
    </div>

    <div style="text-align:center;">
      <span class="seal">${mou.status === "Mutually Approved" ? "Mutually Approved & Executed" : (mou.status || "Draft")}</span>
    </div>

    <hr/>

    <div class="sec">
      <h3>1. Parties to this Agreement</h3>
      <table class="ptable">
        <tr class="h"><td>First Party — University</td><td>Second Party — Industry Partner</td></tr>
        <tr>
          <td>
            <strong>${mou.university || "—"}</strong><br/>
            ${mou.universityContact?.name ? `Contact: ${mou.universityContact.name}<br/>` : ""}
            ${mou.universityContact?.designation ? `Designation: ${mou.universityContact.designation}<br/>` : ""}
            ${mou.universityContact?.email ? `Email: ${mou.universityContact.email}<br/>` : ""}
            Signatory: ${mou.signatories?.university || "—"}
          </td>
          <td>
            <strong>${mou.industry || "—"}</strong><br/>
            ${mou.industryContact?.name ? `Contact: ${mou.industryContact.name}<br/>` : ""}
            ${mou.industryContact?.designation ? `Designation: ${mou.industryContact.designation}<br/>` : ""}
            ${mou.industryContact?.email ? `Email: ${mou.industryContact.email}<br/>` : ""}
            Signatory: ${mou.signatories?.industry || "—"}
          </td>
        </tr>
      </table>
    </div>

    <div class="sec">
      <h3>2. Purpose &amp; Scope</h3>
      <p>${mou.description || "This MOU establishes a formal framework for collaboration between the parties."}</p>
    </div>

    <div class="sec">
      <h3>3. Duration</h3>
      <p>This MOU is in force from <strong>${fmtDate(mou.startDate)}</strong> to <strong>${fmtDate(mou.endDate)}</strong>.</p>
    </div>

    ${objectives.length ? `<div class="sec"><h3>4. Objectives</h3><ul>${li(objectives)}</ul></div>` : ""}

    ${(uniRes.length || indRes.length) ? `
    <div class="sec">
      <h3>5. Responsibilities</h3>
      ${uniRes.length ? `<p><strong>${mou.university}:</strong></p><ul>${li(uniRes)}</ul>` : ""}
      ${indRes.length ? `<p style="margin-top:6px;"><strong>${mou.industry}:</strong></p><ul>${li(indRes)}</ul>` : ""}
    </div>` : ""}

    ${terms.length ? `<div class="sec"><h3>6. Terms &amp; Conditions</h3><ol>${li(terms)}</ol></div>` : ""}

    <div class="sec">
      <h3>7. General Provisions</h3>
      <p>This MOU does not create legally binding financial obligations unless a separate agreement is executed. Either party may terminate with thirty (30) days' written notice. Amendments require mutual written consent.</p>
    </div>

    <hr/>

    <div class="sigs">
      <div class="sig">
        <div class="lbl">Authorized — First Party</div>
        ${renderSig(mou.universitySignature)}
        <div class="name">${mou.universitySignature?.signedBy || mou.signatories?.university || "University Authority"}</div>
        <div class="org">${mou.university || "—"}</div>
        ${sigMeta(mou.universitySignature)}
      </div>
      <div class="sig">
        <div class="lbl">Authorized — Second Party</div>
        ${renderSig(mou.industrySignature)}
        <div class="name">${mou.industrySignature?.signedBy || mou.signatories?.industry || "Industry Authority"}</div>
        <div class="org">${mou.industry || "—"}</div>
        ${sigMeta(mou.industrySignature)}
      </div>
    </div>

    <div class="foot">
      <span>CollaXion · MOU Portal</span>
      <span>Ref: ${refNo}</span>
      <span>Generated: ${fmtDate(new Date().toISOString())}</span>
    </div>
  </div>
  </div>
</body></html>`;

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    res.status(500).send(`<h2>Error</h2><pre>${err.message}</pre>`);
  }
});

// ── GET single MOU ──
router.get("/:id", async (req, res) => {
  try {
    const mou = await Mou.findById(req.params.id);
    if (!mou) return res.status(404).json({ message: "MOU not found" });
    res.json(mou);
  } catch (err) {
    res.status(500).json({ message: "Error fetching MOU", error: err.message });
  }
});

// ── CREATE MOU (industry-initiated) ──
router.post("/", async (req, res) => {
  try {
    const { title, university, industry, collaborationType, startDate, endDate } = req.body;
    if (!title || !university || !industry || !collaborationType || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const data = { ...req.body };
    if (data.mouNumber === null || data.mouNumber === "") delete data.mouNumber;

    const mou = new Mou(data);
    const saved = await mou.save();
    pushMouUpdate(req, saved, "mouCreated");
    notifyForMou(req, saved, {
      title: "New MOU Drafted",
      message: `"${titleOf(saved)}" has been created with ${saved.university}.`,
    });
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
    if (err.code === 11000) return res.status(409).json({ message: "Duplicate key", details: err.keyValue });
    res.status(500).json({ message: "Error creating MOU", error: err.message });
  }
});

// Build a *relative* path to the server-rendered pdf-view for a MOU.
// We store the path (not absolute URL) so each client (web admin on localhost,
// mobile app on LAN IP) can resolve it against its own backend base URL.
const buildPdfViewUrl = (_req, id) =>
  `/api/industry/mous/${id}/pdf-view`;

const PDF_TRIGGER_STATUSES = new Set([
  "Sent to Industry",
  "Approved by University",
  "Mutually Approved",
]);

// ── UPDATE MOU (status, response, stamps, meeting, change log) ──
router.put("/:id", async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.mouNumber === null || data.mouNumber === "") delete data.mouNumber;

    // The web admin (MouManagement.jsx) sends pdfHtml + pdfSentAt as top-level
    // fields when liaison clicks "Send to Industry" / "Send PDF to Industry".
    // Mongoose strict mode would silently strip these — translate them into
    // the schema-aware `pdf` sub-document instead.
    const incomingPdfHtml   = data.pdfHtml;
    const incomingPdfSentAt = data.pdfSentAt;
    delete data.pdfHtml;
    delete data.pdfSentAt;
    if (incomingPdfSentAt || (typeof incomingPdfHtml === "string" && incomingPdfHtml.length > 0)) {
      data.pdf = {
        ...(data.pdf || {}),
        url:      `/api/industry/mous/${req.params.id}/pdf-view`,
        name:     `${(data.title || "MOU").replace(/\s+/g, "_")}.pdf`,
        mimeType: "text/html",
        sentBy:   "Industry Liaison Incharge",
        sentAt:   incomingPdfSentAt || new Date().toISOString(),
        size:     typeof incomingPdfHtml === "string" ? incomingPdfHtml.length : 0,
      };
    }

    if (data.scheduledMeeting) {
      console.log("[MOU PUT] scheduledMeeting payload for", req.params.id, ":",
        JSON.stringify(data.scheduledMeeting));
    }

    const before = await Mou.findById(req.params.id).lean();
    let updated = await Mou.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "MOU not found" });

    if (data.scheduledMeeting) {
      console.log("[MOU PUT] saved scheduledMeeting:",
        JSON.stringify(updated.scheduledMeeting));
    }

    // Auto-attach the server-rendered PDF whenever the liaison transitions the MOU
    // into a "send" state. This way the industry sees a real PDF without the web
    // needing extra wiring.
    let pdfAutoAttached = false;
    if (
      PDF_TRIGGER_STATUSES.has(updated.status) &&
      (!updated.pdf || !updated.pdf.url)
    ) {
      const now = new Date().toISOString();
      updated.pdf = {
        url:      buildPdfViewUrl(req, updated._id),
        name:     `${(updated.title || "MOU").replace(/\s+/g, "_")}.pdf`,
        mimeType: "text/html",
        sentBy:   "Industry Liaison Incharge",
        sentAt:   now,
        size:     0,
      };
      updated.changeLog = [
        ...(updated.changeLog || []),
        {
          id: Date.now(),
          type: "pdf_sent",
          date: now,
          party: "Industry Liaison Incharge",
          from: "Industry Liaison Incharge",
          message: `MOU document sent to ${updated.industry}`,
        },
      ];
      await updated.save();
      pdfAutoAttached = true;
    }

    // When industry just signed the MOU, regenerate the signed PDF and route it
    // back to the Industry Liaison Incharge — same template, now with the
    // industry signature embedded.
    const beforeSignedAt = before?.industrySignature?.signedAt || null;
    const afterSignedAt  = updated?.industrySignature?.signedAt || null;
    let industrySignedPdfSent = false;
    if (afterSignedAt && afterSignedAt !== beforeSignedAt) {
      const now = new Date().toISOString();
      const signerName = updated.industrySignature?.signedBy || updated.industry;
      updated.pdf = {
        url:      buildPdfViewUrl(req, updated._id),
        name:     `${(updated.title || "MOU").replace(/\s+/g, "_")}-signed.pdf`,
        mimeType: "text/html",
        sentBy:   `Industry — ${signerName}`,
        sentAt:   now,
        size:     0,
      };
      updated.changeLog = [
        ...(updated.changeLog || []),
        {
          id: Date.now(),
          type: "industry_signed_pdf",
          date: now,
          party: "Industry",
          from: signerName,
          message: `Signed MOU sent back to Industry Liaison Incharge`,
        },
      ];
      await updated.save();
      industrySignedPdfSent = true;
    }

    pushMouUpdate(req, updated, "mouUpdated");

    // Status transition driven notifications (helps "liaison sent MOU" surface)
    if (before && before.status !== updated.status) {
      const map = {
        "Sent to Industry":         { title: "MOU Received", message: `Industry Liaison sent "${titleOf(updated)}" for your review.` },
        "Approved by University":   { title: "University Approved", message: `University approved "${titleOf(updated)}".` },
        "Mutually Approved":        { title: "Mutually Approved 🎉", message: `"${titleOf(updated)}" is now mutually approved.` },
        "Rejected":                 { title: "MOU Rejected", message: `"${titleOf(updated)}" was marked as rejected.` },
        "Changes Proposed":         { title: "Changes Proposed", message: `Changes have been proposed on "${titleOf(updated)}".` },
      };
      const n = map[updated.status];
      if (n) notifyForMou(req, updated, n);
    } else if (before && JSON.stringify(before.scheduledMeeting) !== JSON.stringify(updated.scheduledMeeting)) {
      notifyForMou(req, updated, {
        title: "Meeting Update",
        message: `Meeting details updated on "${titleOf(updated)}".`,
      });
    }

    // Detect a newly-sent PDF (url changed and is now non-empty),
    // either explicitly set in the request body OR auto-attached above.
    // Skip the generic "received from liaison" notification when the PDF was
    // refreshed because industry just signed — that case has its own notice.
    const beforeUrl = before?.pdf?.url || "";
    const afterUrl  = updated?.pdf?.url || "";
    if (!industrySignedPdfSent && ((afterUrl && afterUrl !== beforeUrl) || pdfAutoAttached)) {
      notifyForMou(req, updated, {
        title: "MOU Document Received",
        message: `Industry Liaison sent the MOU document for "${titleOf(updated)}".`,
      });
    }

    if (industrySignedPdfSent) {
      const signerName = updated.industrySignature?.signedBy || updated.industry;
      notifyForMou(req, updated, {
        title: "Signed MOU Sent to Liaison",
        message: `${signerName} signed "${titleOf(updated)}" and sent the document back to the Industry Liaison Incharge.`,
      });
    }
    res.json(updated);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Duplicate key", error: err.message });
    res.status(500).json({ message: "Error updating MOU", error: err.message });
  }
});

// ── INDUSTRY RESPOND (accept / reject / comment / change) ──
router.put("/:id/respond", async (req, res) => {
  try {
    const { type, message, changes } = req.body;
    const mou = await Mou.findById(req.params.id);
    if (!mou) return res.status(404).json({ message: "MOU not found" });

    const logEntry = { id: Date.now(), type: `industry_${type}`, date: new Date().toISOString(),
      party: "Industry", from: mou.industry, message };

    if (type === "accept") {
      mou.status = mou.status === "Approved by University" ? "Mutually Approved" : "Approved by Industry";
      mou.industryStamp = { by: mou.industry, type: "approve", date: new Date().toISOString() };
    } else if (type === "reject") {
      mou.status = "Rejected";
    } else if (type === "change") {
      mou.status = "Changes Proposed";
      if (changes?.length) {
        mou.proposedChanges = [...(mou.proposedChanges || []),
          ...changes.map(c => ({ ...c, date: c.date || new Date().toISOString() }))];
      }
    } else {
      mou.status = "Industry Responded";
    }

    mou.changeLog = [...(mou.changeLog || []), logEntry];
    mou.industryResponseAt = new Date().toISOString();

    await mou.save();
    pushMouUpdate(req, mou, "mouUpdated");
    notifyForMou(req, mou, {
      title:
        type === "accept" ? "Response Sent: Accepted" :
        type === "reject" ? "Response Sent: Rejected" :
        type === "change" ? "Changes Proposed" : "Response Sent",
      message: `Your response on "${titleOf(mou)}" has been recorded.`,
    });
    res.json(mou);
  } catch (err) {
    res.status(500).json({ message: "Error processing response", error: err.message });
  }
});

// ── INDUSTRY SELECTS / CONFIRMS A MEETING SLOT ──
router.put("/:id/meeting/confirm", async (req, res) => {
  try {
    const { date, time, note } = req.body;
    const mou = await Mou.findById(req.params.id);
    if (!mou) return res.status(404).json({ message: "MOU not found" });

    const slot = { date, time: time || "", note: note || "" };
    const now = new Date().toISOString();

    // Merge into scheduledMeeting
    const existing = mou.scheduledMeeting ? mou.scheduledMeeting.toObject?.() ?? { ...mou.scheduledMeeting } : {};
    mou.scheduledMeeting = {
      ...existing,
      confirmedSlot: slot,
      confirmedAt: now,
      industryProposedSlot: null,
      industryProposedAt: null,
    };

    mou.changeLog = [...(mou.changeLog || []), {
      id: Date.now(), type: "meeting_confirmed", date: now,
      party: "Industry", from: mou.industry,
      message: `${mou.industry} confirmed meeting: ${date} at ${time}`,
    }];

    await mou.save();
    pushMouUpdate(req, mou, "mouUpdated");
    notifyForMou(req, mou, {
      title: "Meeting Confirmed",
      message: `Meeting on "${titleOf(mou)}" confirmed for ${date} at ${time}.`,
    });
    res.json(mou);
  } catch (err) {
    res.status(500).json({ message: "Error confirming meeting", error: err.message });
  }
});

// ── INDUSTRY PROPOSES OWN SLOT ──
router.put("/:id/meeting/propose", async (req, res) => {
  try {
    const { date, time, note } = req.body;
    const mou = await Mou.findById(req.params.id);
    if (!mou) return res.status(404).json({ message: "MOU not found" });

    const slot = { date, time: time || "", note: note || "" };
    const now = new Date().toISOString();

    const existing = mou.scheduledMeeting ? mou.scheduledMeeting.toObject?.() ?? { ...mou.scheduledMeeting } : {};
    mou.scheduledMeeting = {
      ...existing,
      industryProposedSlot: slot,
      industryProposedAt: now,
      confirmedSlot: null,
      confirmedAt: null,
    };

    mou.changeLog = [...(mou.changeLog || []), {
      id: Date.now(), type: "meeting_proposed", date: now,
      party: "Industry", from: mou.industry,
      message: `${mou.industry} proposed slot: ${date} at ${time}`,
    }];

    await mou.save();
    pushMouUpdate(req, mou, "mouUpdated");
    notifyForMou(req, mou, {
      title: "Slot Proposed",
      message: `You proposed ${date} at ${time} for "${titleOf(mou)}". Awaiting university confirmation.`,
    });
    res.json(mou);
  } catch (err) {
    res.status(500).json({ message: "Error proposing meeting slot", error: err.message });
  }
});

// ── INDUSTRY LIAISON SHARES THE SERVER-RENDERED MOU PDF (one-click) ──
router.post("/:id/share-pdf", async (req, res) => {
  try {
    const mou = await Mou.findById(req.params.id);
    if (!mou) return res.status(404).json({ message: "MOU not found" });
    const now = new Date().toISOString();
    mou.pdf = {
      url:      buildPdfViewUrl(req, mou._id),
      name:     `${(mou.title || "MOU").replace(/\s+/g, "_")}.pdf`,
      mimeType: "text/html",
      sentBy:   req.body?.sentBy || "Industry Liaison Incharge",
      sentAt:   now,
      size:     0,
    };
    mou.changeLog = [...(mou.changeLog || []), {
      id: Date.now(), type: "pdf_sent", date: now,
      party: "Industry Liaison Incharge", from: req.body?.sentBy || "Industry Liaison Incharge",
      message: `MOU document sent to ${mou.industry}`,
    }];
    await mou.save();
    pushMouUpdate(req, mou, "mouUpdated");
    notifyForMou(req, mou, {
      title: "MOU Document Received",
      message: `Industry Liaison sent the MOU document for "${titleOf(mou)}".`,
    });
    res.json(mou);
  } catch (err) {
    res.status(500).json({ message: "Error sharing PDF", error: err.message });
  }
});

// ── INDUSTRY LIAISON SENDS PDF TO INDUSTRY (custom URL / data URI) ──
router.post("/:id/pdf", async (req, res) => {
  try {
    const { url, name, mimeType, sentBy, size } = req.body || {};
    if (!url) return res.status(400).json({ message: "PDF url (or data URI) is required" });

    const mou = await Mou.findById(req.params.id);
    if (!mou) return res.status(404).json({ message: "MOU not found" });

    const now = new Date().toISOString();
    mou.pdf = {
      url,
      name: name || `${(mou.title || "MOU").replace(/\s+/g, "_")}.pdf`,
      mimeType: mimeType || "application/pdf",
      sentBy: sentBy || "Industry Liaison Incharge",
      sentAt: now,
      size: typeof size === "number" ? size : 0,
    };
    mou.changeLog = [...(mou.changeLog || []), {
      id: Date.now(), type: "pdf_sent", date: now,
      party: "Industry Liaison Incharge", from: sentBy || "Industry Liaison Incharge",
      message: `MOU PDF sent to ${mou.industry}`,
    }];

    await mou.save();
    pushMouUpdate(req, mou, "mouUpdated");
    notifyForMou(req, mou, {
      title: "MOU Document Received",
      message: `Industry Liaison sent the signed PDF for "${titleOf(mou)}".`,
    });
    res.json(mou);
  } catch (err) {
    res.status(500).json({ message: "Error sending PDF", error: err.message });
  }
});

// ── DELETE MOU ──
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Mou.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "MOU not found" });
    pushMouUpdate(req, deleted, "mouDeleted");
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting MOU", error: err.message });
  }
});

export default router;

