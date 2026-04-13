import express from "express";
import {
  createEvent,
  getMyEvents,
  getDashboardEvents,
  getEventById,
  updateEvent,
  toggleHideEvent,
  deleteEvent,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controller/Eventcontroller.js";

const router = express.Router();

// ── Event CRUD ────────────────────────────────────────────────────────────────
// POST   /api/industry/events              → create event
// GET    /api/industry/events/mine         → my events (manage screen)
// GET    /api/industry/events/dashboard    → published only (dashboard feed)
// GET    /api/industry/events/:id          → single event
// PUT    /api/industry/events/:id          → full update/edit
// PATCH  /api/industry/events/:id/hide     → toggle hide/show
// DELETE /api/industry/events/:id          → permanent delete

router.post("/",                  createEvent);
router.get("/mine",               getMyEvents);
router.get("/dashboard",          getDashboardEvents);
router.get("/:id",                getEventById);
router.put("/:id",                updateEvent);
router.patch("/:id/hide",         toggleHideEvent);
router.delete("/:id",             deleteEvent);

// ── Notification routes ───────────────────────────────────────────────────────
// GET    /api/industry/events/notifications/:industryId
// PATCH  /api/industry/events/notifications/:id/read
// PATCH  /api/industry/events/notifications/mark-all-read

router.get("/notifications/:industryId",          getNotifications);
router.patch("/notifications/:id/read",           markNotificationRead);
router.patch("/notifications/mark-all-read",      markAllNotificationsRead);

export default router;