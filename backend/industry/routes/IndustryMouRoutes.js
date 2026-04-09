








import express from "express";
import Mou from "../models/Mou.js";
 
const router = express.Router();
 
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
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
    if (err.code === 11000) return res.status(409).json({ message: "Duplicate key", details: err.keyValue });
    res.status(500).json({ message: "Error creating MOU", error: err.message });
  }
});
 
// ── UPDATE MOU (status, response, stamps, meeting, change log) ──
router.put("/:id", async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.mouNumber === null || data.mouNumber === "") delete data.mouNumber;
 
    const updated = await Mou.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "MOU not found" });
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
    res.json(mou);
  } catch (err) {
    res.status(500).json({ message: "Error proposing meeting slot", error: err.message });
  }
});
 
// ── DELETE MOU ──
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Mou.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "MOU not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting MOU", error: err.message });
  }
});
 
export default router;
 
