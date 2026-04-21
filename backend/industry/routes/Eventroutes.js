// eventRoutes.js
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
// POST   /api/industry/events              → create event (multipart/form-data — banner upload handled inside controller via multer)
// GET    /api/industry/events/mine         → my events (manage screen)
// GET    /api/industry/events/dashboard    → all published events (dashboard feed)
// GET    /api/industry/events/:id          → single event
// PUT    /api/industry/events/:id          → full update/edit (JSON)
// PATCH  /api/industry/events/:id/hide     → toggle hide/show
// DELETE /api/industry/events/:id          → permanent delete

router.post("/",               createEvent);          // multer runs inside createEvent
router.get("/mine",            getMyEvents);
router.get("/dashboard",       getDashboardEvents);
router.get("/:id",             getEventById);
router.put("/:id",             updateEvent);
router.patch("/:id/hide",      toggleHideEvent);
router.delete("/:id",          deleteEvent);

// ── Notification routes ───────────────────────────────────────────────────────
// NOTE: these must be defined BEFORE /:id so Express doesn't swallow "notifications" as an id param
router.get("/notifications/:industryId",          getNotifications);
router.patch("/notifications/:id/read",           markNotificationRead);
router.patch("/notifications/mark-all-read",      markAllNotificationsRead);

export default router;

// ─────────────────────────────────────────────────────────────────────────────
// ADD THIS TO YOUR MAIN app.js / server.js so uploaded banners are served:
//
//   import express from "express";
//   app.use("/uploads", express.static("uploads"));   // serves /uploads/banners/xxx.jpg
//
// ─────────────────────────────────────────────────────────────────────────────