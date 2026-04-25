import express from "express";
import IndustryNotification from "../models/IndustryNotification.js";

const router = express.Router();

// GET /api/industry/notifications/:email
router.get("/:email", async (req, res) => {
  try {
    const notes = await IndustryNotification
      .find({ industryEmail: req.params.email })
      .sort({ createdAt: -1 })
      .limit(80);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications", error: err.message });
  }
});

// PATCH /api/industry/notifications/:id/read
router.patch("/:id/read", async (req, res) => {
  try {
    const updated = await IndustryNotification.findByIdAndUpdate(
      req.params.id, { isRead: true }, { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating notification", error: err.message });
  }
});

// PATCH /api/industry/notifications/:email/read-all
router.patch("/:email/read-all", async (req, res) => {
  try {
    await IndustryNotification.updateMany(
      { industryEmail: req.params.email, isRead: false },
      { isRead: true }
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Error marking all read", error: err.message });
  }
});

// DELETE /api/industry/notifications/:id
router.delete("/:id", async (req, res) => {
  try {
    await IndustryNotification.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Error deleting notification", error: err.message });
  }
});

export default router;
