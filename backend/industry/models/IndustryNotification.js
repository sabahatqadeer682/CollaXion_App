import mongoose from "mongoose";

const industryNotificationSchema = new mongoose.Schema({
  industryEmail: { type: String, required: true, index: true },
  title:         { type: String, required: true },
  message:       { type: String, required: true },
  type: {
    type: String,
    enum: ["mou", "application", "invitation", "event", "general"],
    default: "general",
  },
  meta:    { type: mongoose.Schema.Types.Mixed, default: {} },
  isRead:  { type: Boolean, default: false },
}, { timestamps: true });

industryNotificationSchema.index({ industryEmail: 1, createdAt: -1 });

const IndustryNotification =
  mongoose.models.IndustryAppNotification ||
  mongoose.model("IndustryAppNotification", industryNotificationSchema, "industrynotifications");

export default IndustryNotification;
