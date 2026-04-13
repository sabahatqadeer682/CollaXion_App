import Event        from "../models/Event.js";
import Notification from "../models/Notification.js";

// ── Helper: create a notification ────────────────────────────────────────────
async function createNotification({ recipientId, recipientType = "industry", type, title, message, relatedEventId, relatedEventTitle, meta = {} }) {
  try {
    await Notification.create({
      recipientId,
      recipientType,
      type,
      title,
      message,
      relatedEventId: relatedEventId || null,
      relatedEventTitle: relatedEventTitle || "",
      meta,
    });
  } catch (err) {
    console.error("Notification creation failed:", err.message);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  POST /api/industry/events
//  Create a new event (called from EventCreationScreen Step 3 publish)
// ═══════════════════════════════════════════════════════════════════════════════
export async function createEvent(req, res) {
  try {
    const industryId  = req.headers["x-industry-id"]  || req.body.industryId;
    const companyName = req.headers["x-company-name"] || req.body.companyName || "Industry Partner";

    if (!industryId) {
      return res.status(400).json({ success: false, message: "industryId is required (header or body)" });
    }

    const {
      eventType, title, description, date, time,
      location, mode, capacity, deadline,
      banner, tags,
      invitedUniversities, inviteMessage,
    } = req.body;

    if (!title?.trim())       return res.status(400).json({ success: false, message: "Title is required" });
    if (!description?.trim()) return res.status(400).json({ success: false, message: "Description is required" });
    if (!date?.trim())        return res.status(400).json({ success: false, message: "Date is required" });

    const event = await Event.create({
      industryId,
      companyName,
      eventType: eventType || "Seminar",
      title:       title.trim(),
      description: description.trim(),
      date,
      time:     time     || "",
      location: location || "",
      mode:     mode     || "Physical",
      capacity: capacity ? Number(capacity) : null,
      deadline: deadline || "",
      banner:   banner   || null,
      tags:     Array.isArray(tags) ? tags : [],
      invitedUniversities: Array.isArray(invitedUniversities) ? invitedUniversities : [],
      inviteMessage: inviteMessage || "",
      status: "published",
    });

    // ── Notification: for the industry partner (event_created) ──────────────
    await createNotification({
      recipientId:        industryId.toString(),
      recipientType:      "industry",
      type:               "event_created",
      title:              "Event Published 🎉",
      message:            `Your event "${event.title}" has been published successfully.`,
      relatedEventId:     event._id,
      relatedEventTitle:  event.title,
    });

    // ── Notifications: for each invited university ──────────────────────────
    if (event.invitedUniversities.length > 0) {
      const uniNotifications = event.invitedUniversities.map((uni) => ({
        recipientId:        uni,
        recipientType:      "university",
        type:               "event_invitation",
        title:              "New Event Invitation 📩",
        message:            `${companyName} has invited you to "${event.title}" (${event.eventType}) on ${event.date}.`,
        relatedEventId:     event._id,
        relatedEventTitle:  event.title,
        meta:               { companyName, eventType: event.eventType, date: event.date },
      }));
      await Notification.insertMany(uniNotifications);
    }

    return res.status(201).json({ success: true, message: "Event created successfully", event });
  } catch (err) {
    console.error("createEvent error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GET /api/industry/events/mine
//  Get all events for an industry (published + hidden, NOT deleted)
// ═══════════════════════════════════════════════════════════════════════════════
export async function getMyEvents(req, res) {
  try {
    const industryId = req.headers["x-industry-id"] || req.query.industryId;
    if (!industryId) return res.status(400).json({ success: false, message: "industryId required" });

    const events = await Event.find({
      industryId,
      status: { $in: ["published", "hidden"] },   // exclude permanently deleted
    }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, events });
  } catch (err) {
    console.error("getMyEvents error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GET /api/industry/events/dashboard
//  Get PUBLISHED events for dashboard feed (for all users / universities)
// ═══════════════════════════════════════════════════════════════════════════════
export async function getDashboardEvents(req, res) {
  try {
    const industryId = req.headers["x-industry-id"] || req.query.industryId;
    if (!industryId) return res.status(400).json({ success: false, message: "industryId required" });

    const events = await Event.find({
      industryId,
      status: "published",
    }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, events });
  } catch (err) {
    console.error("getDashboardEvents error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GET /api/industry/events/:id
//  Get single event by ID
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
//  Edit/update an event
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

    // Track what changed (simple field-level diff)
    const changedFields = [];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        const oldVal = JSON.stringify(event[field]);
        const newVal = JSON.stringify(req.body[field]);
        if (oldVal !== newVal) changedFields.push(field);
        event[field] = req.body[field];
      }
    });

    // Mark edit time
    const now = new Date();
    event.lastEditedAt = now;
    event.editHistory.push({
      editedAt: now,
      changes: changedFields.length > 0 ? changedFields.join(", ") : "minor update",
    });

    await event.save();

    // Notification for edit
    await createNotification({
      recipientId:        industryId.toString(),
      recipientType:      "industry",
      type:               "event_edited",
      title:              "Event Updated ✏️",
      message:            `Your event "${event.title}" was updated (${changedFields.join(", ") || "details changed"}).`,
      relatedEventId:     event._id,
      relatedEventTitle:  event.title,
    });

    return res.status(200).json({ success: true, message: "Event updated successfully", event });
  } catch (err) {
    console.error("updateEvent error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PATCH /api/industry/events/:id/hide
//  Toggle visibility (published ↔ hidden)
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
      recipientId:        industryId.toString(),
      recipientType:      "industry",
      type:               "event_hidden",
      title:              newStatus === "hidden" ? "Event Hidden 🙈" : "Event Visible Again 👁️",
      message:            `"${event.title}" is now ${newStatus}.`,
      relatedEventId:     event._id,
      relatedEventTitle:  event.title,
    });

    return res.status(200).json({
      success: true,
      message: `Event is now ${newStatus}`,
      status: newStatus,
      event,
    });
  } catch (err) {
    console.error("toggleHideEvent error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DELETE /api/industry/events/:id
//  Permanently delete an event
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
      recipientId:        industryId.toString(),
      recipientType:      "industry",
      type:               "event_deleted",
      title:              "Event Removed 🗑️",
      message:            `Event "${eventTitle}" has been permanently deleted.`,
    });

    return res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    console.error("deleteEvent error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  GET  /api/industry/events/notifications/:industryId
//  Get all notifications for an industry partner
// ═══════════════════════════════════════════════════════════════════════════════
export async function getNotifications(req, res) {
  try {
    const { industryId } = req.params;
    const notifications = await Notification.find({ recipientId: industryId })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ recipientId: industryId, read: false });
    return res.status(200).json({ success: true, notifications, unreadCount });
  } catch (err) {
    console.error("getNotifications error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PATCH /api/industry/events/notifications/:id/read
//  Mark a single notification as read
// ═══════════════════════════════════════════════════════════════════════════════
export async function markNotificationRead(req, res) {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    return res.status(200).json({ success: true, message: "Marked as read" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PATCH /api/industry/events/notifications/mark-all-read
//  Mark ALL notifications as read for an industry
// ═══════════════════════════════════════════════════════════════════════════════
export async function markAllNotificationsRead(req, res) {
  try {
    const industryId = req.headers["x-industry-id"] || req.body.industryId;
    await Notification.updateMany({ recipientId: industryId, read: false }, { read: true });
    return res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}