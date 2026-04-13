import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId:   { type: String, required: true },  // industryId or universityId
    recipientType: { type: String, enum: ["industry", "university"], default: "industry" },

    type: {
      type: String,
      enum: [
        "event_created",
        "event_edited",
        "event_hidden",
        "event_deleted",
        "event_invitation",  // sent to universities
      ],
      required: true,
    },

    title:   { type: String, required: true },
    message: { type: String, required: true },

    relatedEventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", default: null },
    relatedEventTitle: { type: String, default: "" },

    read: { type: Boolean, default: false },

    // extra metadata (optional)
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ read: 1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;