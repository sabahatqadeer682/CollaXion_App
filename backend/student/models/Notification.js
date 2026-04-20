


import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["application", "event", "deadline", "general"], 
    default: "general" 
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// ✅ SAFE MODEL EXPORT (prevents overwrite error)
const Notification =
  mongoose.models.StudentNotification || mongoose.model("StudentNotification", notificationSchema, "notifications");

export default Notification;