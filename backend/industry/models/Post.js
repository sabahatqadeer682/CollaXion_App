// industry/models/Post.js

import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Internship", "Project", "Workshop"],
      required: true,
    },
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true },
    skills:      [{ type: String, trim: true }],
    stipend:     { type: String, default: "" },
    duration:    { type: String, default: "" },
    seats:       { type: String, default: "" },
    deadline:    { type: String, default: "" },
    location:    { type: String, default: "" },
    mode: {
      type: String,
      enum: ["Onsite", "Remote", "Hybrid"],
      default: "Onsite",
    },
    poster:       { type: String, default: null }, // image URL (optional)
    postedBy:     { type: mongoose.Schema.Types.ObjectId, ref: "Industry", required: true },
    company:      { type: String, required: true },
    companyLogo:  { type: String, default: null },
    applications: { type: Number, default: 0 },
    isActive:     { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);