import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
  status: {
    type: String,
    enum: ["Pending", "Under Review", "Shortlisted", "Approved", "Rejected"],
    default: "Pending",
  },
  coverLetter: String,
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  statusHistory: [
    {
      status: String,
      date: { type: Date, default: Date.now },
      note: String,
    },
  ],
});

export default mongoose.model("Application", applicationSchema);