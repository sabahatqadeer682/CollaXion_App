// Eventcontroller.js
import Event        from "../models/Event.js";
import Notification from "../models/Notification.js";
import multer       from "multer";
import path         from "path";
import fs           from "fs";

// ── Multer setup for banner upload ───────────────────────────────────────────
const uploadDir = "uploads/banners/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename:    (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

export const uploadBanner = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
}).single("banner");

// ── Helper: create a notification ────────────────────────────────────────────
async function createNotification({
  recipientId, recipientType = "industry",
  type, title, message, relatedEventId, relatedEventTitle, meta = {},
}) {
  try {
    await Notification.create({
      recipientId, recipientType, type, title, message,
      relatedEventId:    relatedEventId    || null,
      relatedEventTitle: relatedEventTitle || "",
      meta,
    });
  } catch (err) {
    console.error("Notification creation failed:", err.message);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  POST /api/industry/events
//  Create a new event — single-page form (multipart/form-data)
// ═══════════════════════════════════════════════════════════════════════════════
export async function createEvent(req, res) {
  // Run multer first
  uploadBanner(req, res, async (uploadErr) => {
    if (uploadErr) {
      return res.status(400).json({ success: false, message: uploadErr.message });
    }

    try {
      const industryId  = req.headers["x-industry-id"]  || req.body.industryId;
      const companyName = req.headers["x-company-name"] || req.body.companyName || "Industry Partner";

      if (!industryId) {
        return res.status(400).json({ success: false, message: "industryId is required" });
      }

      const {
        eventType, title, description, date, time,
        location, mode, capacity, deadline, inviteMessage,
      } = req.body;

      // Parse JSON strings sent from FormData
      let tags = [];
      let invitedUniversities = [];
      try { tags               = JSON.parse(req.body.tags               || "[]"); } catch (_) {}
      try { invitedUniversities= JSON.parse(req.body.invitedUniversities|| "[]"); } catch (_) {}

      // Validation
      if (!title?.trim())       return res.status(400).json({ success: false, message: "Title is required" });
      if (!description?.trim()) return res.status(400).json({ success: false, message: "Description is required" });
      if (!date?.trim())        return res.status(400).json({ success: false, message: "Date is required" });

      // Banner URL (if uploaded)
      const bannerUrl = req.file
        ? `${req.protocol}://${req.get("host")}/uploads/banners/${req.file.filename}`
        : (req.body.banner || null);

      const event = await Event.create({
        industryId,
        companyName,
        eventType:   eventType || "Seminar",
        title:       title.trim(),
        description: description.trim(),
        date,
        time:     time     || "",
        location: location || "",
        mode:     mode     || "Physical",
        capacity: capacity ? Number(capacity) : null,
        deadline: deadline || "",
        banner:   bannerUrl,
        tags,
        invitedUniversities,
        inviteMessage: inviteMessage || "",
        status: "published",
      });

      // ── Notification: event_created ─────────────────────────────
      await createNotification({
        recipientId:       industryId.toString(),
        recipientType:     "industry",
        type:              "event_created",
        title:             "Event Published 🎉",
        message:           `Your event "${event.title}" has been published successfully.`,
        relatedEventId:    event._id,
        relatedEventTitle: event.title,
      });

      // Push real-time event so the dashboard "Your Posts" + counts refresh
      // for every connected session of this industry without a manual reload.
      try {
        req.app.locals.broadcastToIndustry?.(companyName, {
          event: "newEvent",
          data:  event,
        });
      } catch (_) {}

      // Persist + push an in-app notification so the bell list lights up.
      try {
        const industryEmail = (req.headers["x-industry-email"] || req.body.industryEmail || "").toString().trim();
        if (industryEmail) {
          // Lazy import to keep the controller's existing imports untouched.
          const { default: IndustryNotification } = await import("../models/IndustryNotification.js");
          const note = await IndustryNotification.create({
            industryEmail,
            title:   "Event Created",
            message: `Your event "${event.title}" is now live.`,
            type:    "event",
            meta:    { eventId: event._id, eventType: event.eventType, date: event.date },
          });
          req.app.locals.broadcast?.(industryEmail, {
            event: "newNotification",
            data:  note,
          });
        }
      } catch (e) {
        console.error("Event-create notification failed:", e?.message);
      }

      // ── Notifications: invited universities ─────────────────────
      if (event.invitedUniversities.length > 0) {
        const uniNotifs = event.invitedUniversities.map((uni) => ({
          recipientId:       uni,
          recipientType:     "university",
          type:              "event_invitation",
          title:             "New Event Invitation 📩",
          message:           `${companyName} invited you to "${event.title}" (${event.eventType}) on ${event.date}.`,
          relatedEventId:    event._id,
          relatedEventTitle: event.title,
          meta:              { companyName, eventType: event.eventType, date: event.date },
        }));
        await Notification.insertMany(uniNotifs);
      }

      return res.status(201).json({ success: true, message: "Event created successfully", event });
    } catch (err) {
      console.error("createEvent error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GET /api/industry/events/mine
// ═══════════════════════════════════════════════════════════════════════════════
export async function getMyEvents(req, res) {
  try {
    const industryId  = req.headers["x-industry-id"]  || req.query.industryId;
    const companyName = req.headers["x-company-name"] || req.query.companyName;
    if (!industryId && !companyName) {
      return res.status(400).json({ success: false, message: "industryId required" });
    }

    // Match by industry id OR company name. Industry "_id" can drift across
    // sessions; falling back to companyName keeps every event the industry
    // has ever created visible on the dashboard / EventsManage screen.
    const ors = [];
    if (industryId)  ors.push({ industryId });
    if (companyName) ors.push({ companyName });

    const events = await Event.find({
      $or: ors,
      status: { $in: ["published", "hidden"] },
    }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, events });
  } catch (err) {
    console.error("getMyEvents error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GET /api/industry/events/dashboard
//  Published events for dashboard feed (all users / universities)
// ═══════════════════════════════════════════════════════════════════════════════
export async function getDashboardEvents(req, res) {
  try {
    // No industryId filter — returns ALL published events from every industry
    const events = await Event.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({ success: true, events });
  } catch (err) {
    console.error("getDashboardEvents error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GET /api/industry/events/:id
// ═══════════════════════════════════════════════════════════════════════════════
export async function getEventById(req, res) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    return res.status(200).json({ success: true, event });
  } catch (err) {
    console.error("getEventById error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PUT /api/industry/events/:id
//  Edit / update an event (JSON body — no file upload in edit mode)
// ═══════════════════════════════════════════════════════════════════════════════
export async function updateEvent(req, res) {
  try {
    const industryId = req.headers["x-industry-id"] || req.body.industryId;
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    if (event.industryId.toString() !== industryId?.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized: not your event" });
    }

    const allowed = [
      "eventType","title","description","date","time",
      "location","mode","capacity","deadline",
      "banner","tags","invitedUniversities","inviteMessage","status",
    ];

    const changedFields = [];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (JSON.stringify(event[field]) !== JSON.stringify(req.body[field])) {
          changedFields.push(field);
        }
        event[field] = req.body[field];
      }
    });

    const now = new Date();
    event.lastEditedAt = now;
    event.editHistory.push({
      editedAt: now,
      changes:  changedFields.length > 0 ? changedFields.join(", ") : "minor update",
    });

    await event.save();

    await createNotification({
      recipientId:       industryId.toString(),
      recipientType:     "industry",
      type:              "event_edited",
      title:             "Event Updated ✏️",
      message:           `Your event "${event.title}" was updated (${changedFields.join(", ") || "details changed"}).`,
      relatedEventId:    event._id,
      relatedEventTitle: event.title,
    });

    return res.status(200).json({ success: true, message: "Event updated successfully", event });
  } catch (err) {
    console.error("updateEvent error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PATCH /api/industry/events/:id/hide
// ═══════════════════════════════════════════════════════════════════════════════
export async function toggleHideEvent(req, res) {
  try {
    const industryId = req.headers["x-industry-id"] || req.body.industryId;
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    if (event.industryId.toString() !== industryId?.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const newStatus = event.status === "hidden" ? "published" : "hidden";
    event.status = newStatus;
    event.lastEditedAt = new Date();
    await event.save();

    await createNotification({
      recipientId:       industryId.toString(),
      recipientType:     "industry",
      type:              "event_hidden",
      title:             newStatus === "hidden" ? "Event Hidden 🙈" : "Event Visible Again 👁️",
      message:           `"${event.title}" is now ${newStatus}.`,
      relatedEventId:    event._id,
      relatedEventTitle: event.title,
    });

    return res.status(200).json({ success: true, message: `Event is now ${newStatus}`, status: newStatus, event });
  } catch (err) {
    console.error("toggleHideEvent error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DELETE /api/industry/events/:id
// ═══════════════════════════════════════════════════════════════════════════════
export async function deleteEvent(req, res) {
  try {
    const industryId = req.headers["x-industry-id"] || req.query.industryId;
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    if (event.industryId.toString() !== industryId?.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const eventTitle = event.title;
    await Event.findByIdAndDelete(req.params.id);

    await createNotification({
      recipientId:   industryId.toString(),
      recipientType: "industry",
      type:          "event_deleted",
      title:         "Event Removed 🗑️",
      message:       `Event "${eventTitle}" has been permanently deleted.`,
    });

    return res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    console.error("deleteEvent error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Notifications
// ═══════════════════════════════════════════════════════════════════════════════
export async function getNotifications(req, res) {
  try {
    const { industryId } = req.params;
    const notifications = await Notification.find({ recipientId: industryId })
      .sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ recipientId: industryId, read: false });
    return res.status(200).json({ success: true, notifications, unreadCount });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function markNotificationRead(req, res) {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    return res.status(200).json({ success: true, message: "Marked as read" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function markAllNotificationsRead(req, res) {
  try {
    const industryId = req.headers["x-industry-id"] || req.body.industryId;
    await Notification.updateMany({ recipientId: industryId, read: false }, { read: true });
    return res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}