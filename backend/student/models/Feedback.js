// import mongoose from "mongoose";

// const feedbackSchema = new mongoose.Schema({
//   studentEmail: { type: String, required: true },
//   internshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" },
//   companyName: String,
//   rating: { type: Number, min: 1, max: 5, required: true },
//   category: { type: String, enum: ["Internship Experience", "Company Culture", "Mentorship", "Work Environment", "Overall"], default: "Overall" },
//   comment: { type: String, required: true },
//   isAnonymous: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model("Feedback", feedbackSchema);


import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    studentEmail: { type: String, required: true },

    internshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
      default: null,
    },

    companyName: { type: String, required: true },

    rating: { type: Number, min: 1, max: 5, required: true },

    category: {
      type: String,
      enum: [
        "Internship Experience",
        "Company Culture",
        "Mentorship",
        "Work Environment",
        "Overall",
      ],
      default: "Overall",
    },

    comment: { type: String, required: true },

    isAnonymous: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);