import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    // Auth / identity
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Company info (matches ProfileScreen form fields)
    name:     { type: String, trim: true, default: "" },
    industry: { type: String, trim: true, default: "" },
    website:  { type: String, trim: true, default: "" },
    address:  { type: String, trim: true, default: "" },
    about:    { type: String, trim: true, default: "" },

    // Contact
    phone: { type: String, trim: true, default: "" },

    // Logo — stored as a base64 data-URI string
    // (keep < 2 MB; for production swap to a cloud-storage URL)
    logo: { type: String, default: "" },

    // Optional: mark as verified partner
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }   // adds createdAt / updatedAt automatically
);

export default mongoose.model("Profile", profileSchema);
