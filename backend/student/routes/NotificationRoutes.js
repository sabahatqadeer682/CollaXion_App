import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

// GET all notifications for student
router.get("/:email", async (req, res) => {
  try {
    const notifications = await Notification.find({ studentEmail: req.params.email })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET unread count
router.get("/unread/:email", async (req, res) => {
  try {
    const count = await Notification.countDocuments({ studentEmail: req.params.email, isRead: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT mark all as read
router.put("/read-all/:email", async (req, res) => {
  try {
    await Notification.updateMany({ studentEmail: req.params.email, isRead: false }, { isRead: true });
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT mark single as read
router.put("/read/:id", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;