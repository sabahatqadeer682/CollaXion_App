// // server/models/Internship.js
// import mongoose from "mongoose";

// // ============================
// //  INTERNSHIP SCHEMA
// // ============================
// const internshipSchema = new mongoose.Schema(
//     {
//         title: {
//             type: String,
//             required: true
//         },
//         company: {
//             type: String,
//             required: true
//         },
//         description: {
//             type: String,
//             required: true
//         },
//         requiredSkills: [{
//             type: String
//         }],
//         domain: {
//             type: String,
//             required: true
//         },
//         difficulty: {
//             type: String,
//             enum: ["Beginner", "Intermediate", "Advanced"],
//             required: true
//         },
//         duration: {
//             type: String,
//             required: true
//         },
//         stipend: {
//             type: String,
//             required: true
//         },
//         location: {
//             type: String,
//             required: true
//         },
//         startDate: {
//             type: String,
//             required: true
//         },
//         responsibilities: [{
//             type: String
//         }],
//         image: {
//             type: String,
//             default: ""
//         },
//         isActive: {
//             type: Boolean,
//             default: true
//         },
//         postedBy: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Industry"
//         },
//     },
//     { timestamps: true }
// );

// const Internship = mongoose.model("Internship", internshipSchema);

// // ============================
// // APPLICATION SCHEMA
// // ============================
// const applicationSchema = new mongoose.Schema(
//     {
//         studentId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Student",
//             required: true
//         },
//         internshipId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Internship",
//             required: true
//         },

//         // Application Status Flow
//         status: {
//             type: String,
//             enum: [
//                 "pending",
//                 "internship_approved",
//                 "industry_approved",
//                 "selected",
//                 "rejected"
//             ],
//             default: "pending"
//         },

//         // Internship Incharge Approval Tracking
//         internshipInchargeApproval: {
//             approved: {
//                 type: Boolean,
//                 default: false
//             },
//             approvedAt: {
//                 type: Date
//             },
//             comments: {
//                 type: String
//             }
//         },

//         // Industry Liaison Approval Tracking
//         industryLiaisonApproval: {
//             approved: {
//                 type: Boolean,
//                 default: false
//             },
//             approvedAt: {
//                 type: Date
//             },
//             comments: {
//                 type: String
//             }
//         },

//         // AI Matching Data
//         matchScore: {
//             type: Number,
//             default: 0
//         },
//         matchingSkills: [{
//             type: String
//         }],
//         missingSkills: [{
//             type: String
//         }],
//         aiRecommendation: {
//             type: String
//         },

//         // Student's Data Snapshot 
//         cvSnapshot: {
//             type: String
//         },
//         skillsSnapshot: [{
//             type: String
//         }],

//         appliedAt: {
//             type: Date,
//             default: Date.now
//         },
//     },
//     { timestamps: true }
// );

// const Application = mongoose.model("Application", applicationSchema);

// // Export both models
// export { Internship, Application };



import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  type: { type: String, enum: ["On-site", "Remote", "Hybrid"], default: "On-site" },
  duration: String,
  stipend: String,
  domain: String,
  requiredSkills: [String],
  description: String,
  requirements: String,
  deadline: Date,
  logo: String,
  isMock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Internship", internshipSchema);