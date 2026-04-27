import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        // sapId is required only when creating a brand-new student so legacy
        // documents created before this field existed can still be updated
        // (e.g. delete-cv, profile edits) without tripping validation.
        sapId: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
            required: function () { return this.isNew; },
        },
        gender: { type: String, enum: ["Male", "Female", "Other"], default: "Other" },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, required: true },
        department: { type: String, required: true },
        semester: { type: String, required: true },
        city: { type: String, required: true },
        address: { type: String, required: true },
        verificationCode: { type: String },
        verified: { type: Boolean, default: false },
        profileImage: { type: String, default: "" },
        cvUrl: { type: String, default: "" },
        cvFeedback: { type: String, default: "" },

        // AI Extracted Data
        extractedSkills: [{ type: String }],
        education: [{ type: String }],
        experience: [{ type: String }],
        professionalSummary: { type: String },
        preferredDomains: [{ type: String }],
        preferredLocations: [{ type: String }],
        totalApplications: { type: Number, default: 0 },
        selectedInternships: { type: Number, default: 0 },

        // Presence tracking
        lastActive: { type: Date, default: null },

        // Chat blocking — emails of users this student has blocked
        blockedEmails: [{ type: String, lowercase: true, trim: true }],
    },
    { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;