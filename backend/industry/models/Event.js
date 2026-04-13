import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    // ── Who created it ──────────────────────────────────────────
    industryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Industry",
      required: true,
    },
    companyName: { type: String, required: true },

    // ── Step 1: Event Details ───────────────────────────────────
    eventType: {
      type: String,
      enum: ["Seminar", "Job Fair", "Workshop", "Tech Talk", "Hackathon", "Networking"],
      default: "Seminar",
    },
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date:        { type: String, required: true },   // stored as display string (DD MMM YYYY)
    time:        { type: String, default: "" },
    location:    { type: String, default: "" },
    mode:        { type: String, enum: ["Physical", "Virtual", "Hybrid"], default: "Physical" },
    capacity:    { type: Number, default: null },
    deadline:    { type: String, default: "" },      // RSVP deadline

    // ── Step 2: Media & Tags ────────────────────────────────────
    banner:      { type: String, default: null },    // URL / base64 / path
    tags:        [{ type: String }],

    // ── Step 3: Invite Universities ─────────────────────────────
    invitedUniversities: [{ type: String }],
    inviteMessage:       { type: String, default: "" },

    // ── Status & Visibility ─────────────────────────────────────
    status: {
      type: String,
      enum: ["published", "hidden", "draft"],
      default: "published",
    },

    // ── Edit tracking (like Facebook) ──────────────────────────
    lastEditedAt: { type: Date, default: null },
    editHistory: [
      {
        editedAt: { type: Date },
        changes:  { type: String }, // brief description of what changed
      },
    ],
  },
  {
    timestamps: true, // createdAt + updatedAt auto
  }
);

// ── Indexes ─────────────────────────────────────────────────────
eventSchema.index({ industryId: 1, createdAt: -1 });
eventSchema.index({ status: 1 });
eventSchema.index({ invitedUniversities: 1 });

const Event = mongoose.model("Event", eventSchema);
export default Event;