



import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

const router = express.Router();

// ─── Global fix: prevents StrictPopulateError across ALL models ───────────────
mongoose.set("strictPopulate", false);

// ─── Schemas (strict:false so extra DB fields don't throw) ───────────────────
const applicationSchema = new mongoose.Schema(
  {
    studentId:    { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    studentEmail: { type: String },
    internshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Internship" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "sent_to_liaison", "sent_to_industry"],
      default: "pending",
    },
    internshipInchargeApproval: {
      status:     { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
      approvedAt: Date,
      rejectedAt: Date,
      remarks:    String,
    },
    industryLiaisonApproval: {
      status:     { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
      approvedAt: Date,
      rejectedAt: Date,
      remarks:    String,
    },
    industryApproval: {
      status:     { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
      approvedAt: Date,
      rejectedAt: Date,
      remarks:    String,
    },
    matchScore:     { type: Number, default: 0 },
    matchingSkills: [String],
    missingSkills:  [String],
    cvSnapshot:     String,
    skillsSnapshot: [mongoose.Schema.Types.Mixed],
    appliedAt:      { type: Date, default: Date.now },
  },
  { timestamps: true, strict: false }
);

// Safe model registration — never throw OverwriteModelError
const Application =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema, "applications");

const studentSchema = new mongoose.Schema(
  {
    fullName:        String,
    email:           String,
    department:      String,
    semester:        String,
    phone:           String,
    profileImage:    String,
    cvUrl:           String,
    extractedSkills: [mongoose.Schema.Types.Mixed],
    rollNumber:      String,
    cgpa:            String,
  },
  { timestamps: true, strict: false }
);
const Student =
  mongoose.models.Student ||
  mongoose.model("Student", studentSchema, "students");

const internshipSchema = new mongoose.Schema(
  {
    title:          String,
    company:        String,
    description:    String,
    requiredSkills: [String],
    type:           String,
    slots:          Number,
    deadline:       Date,
    isActive:       Boolean,
  },
  { timestamps: true, strict: false }
);
const Internship =
  mongoose.models.Internship ||
  mongoose.model("Internship", internshipSchema, "internships");

// ─── Email ────────────────────────────────────────────────────────────────────
// const sendSelectionEmail = async ({ studentEmail, studentName, internshipTitle, company, remarks }) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const html = `
//     <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
//       <div style="background:linear-gradient(135deg,#1D4ED8,#3B82F6);padding:28px;border-radius:12px 12px 0 0;text-align:center">
//         <h1 style="color:#fff;margin:0;font-size:22px">Congratulations!</h1>
//       </div>
//       <div style="background:#fff;border:1px solid #E2E8F0;border-top:none;padding:28px;border-radius:0 0 12px 12px">
//         <p style="font-size:16px;color:#0F172A">Dear <strong>${studentName}</strong>,</p>
//         <p style="color:#334155;line-height:1.7">
//           We are delighted to inform you that your application for
//           <strong>${internshipTitle}</strong> at <strong>${company}</strong>
//           has been <span style="color:#059669;font-weight:700">accepted</span>.
//         </p>
//         ${remarks ? `
//         <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:14px;margin:16px 0">
//           <p style="margin:0;color:#065F46;font-size:14px"><strong>Note from industry:</strong> ${remarks}</p>
//         </div>` : ""}
//         <p style="color:#334155;line-height:1.7">
//           The industry partner will contact you with onboarding details shortly.
//           Please keep checking your email.
//         </p>
//         <div style="background:#EFF6FF;border-radius:8px;padding:14px;margin:16px 0">
//           <p style="margin:0;color:#1E40AF;font-size:13px">
//             <strong>Next Steps:</strong> Wait for the official joining letter from ${company}.
//             Inform your university coordinator of your start date.
//           </p>
//         </div>
//         <p style="color:#64748B;font-size:13px;margin-top:24px">
//           Best regards,<br/>
//           <strong>${company}</strong> — Industry Partner Portal
//         </p>
//       </div>
//     </div>
//   `;

//   await transporter.sendMail({
//     from: `"${company} Internship Portal" <${process.env.EMAIL_USER}>`,
//     to:   studentEmail,
//     subject: `Selected: ${internshipTitle} at ${company}`,
//     html,
//   });
// };




// export const sendSelectionEmail = async ({
//   studentEmail,
//   studentName,
//   internshipTitle,
//   company,
//   remarks,
// }) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   // 👇 5 days later interview
//   const now = new Date();
//   const interviewDate = new Date(now);
//   interviewDate.setDate(interviewDate.getDate() + 5);

//   const formattedDate = interviewDate.toDateString();
//   const formattedTime = interviewDate.toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   const html = `
//     <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">

//       <div style="background:linear-gradient(135deg,#1D4ED8,#3B82F6);padding:28px;border-radius:12px 12px 0 0;text-align:center">
//         <h1 style="color:#fff;margin:0;font-size:22px">Application Accepted 🎉</h1>
//       </div>

//       <div style="background:#fff;border:1px solid #E2E8F0;border-top:none;padding:28px;border-radius:0 0 12px 12px">

//         <p style="font-size:16px;color:#0F172A">Dear <strong>${studentName}</strong>,</p>

//         <p style="color:#334155;line-height:1.7">
//           Your application for <strong>${internshipTitle}</strong> at <strong>${company}</strong>
//           has been <span style="color:#059669;font-weight:700">accepted</span>.
//         </p>

//         <div style="background:#EFF6FF;border-radius:8px;padding:14px;margin:16px 0">
//           <p style="margin:0;color:#1E40AF;font-size:14px">
//             <strong>Interview Scheduled:</strong><br/>
//             📅 ${formattedDate}<br/>
//             ⏰ ${formattedTime}
//           </p>
//         </div>

//         ${remarks ? `
//         <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:14px;margin:16px 0">
//           <p style="margin:0;color:#065F46;font-size:14px">
//             <strong>Note:</strong> ${remarks}
//           </p>
//         </div>` : ""}

//         <p style="color:#64748B;font-size:13px;margin-top:24px">
//           Best regards,<br/>
//           <strong>${company}</strong>
//         </p>

//       </div>
//     </div>
//   `;

//   await transporter.sendMail({
//     from: `"${company}" <${process.env.EMAIL_USER}>`,
//     to: studentEmail,
//     subject: `Application Accepted - Interview Scheduled`,
//     html,
//   });
// };




export const sendSelectionEmail = async ({
  studentEmail,
  studentName,
  internshipTitle,
  company,
  remarks,
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const now = new Date();
  const interviewDate = new Date(now);
  interviewDate.setDate(interviewDate.getDate() + 5);

  const formattedDate = interviewDate.toDateString();
  const formattedTime = interviewDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const html = `
  <div style="margin:0;padding:0;background:#F5F8FF;font-family:Arial,sans-serif;width:100%">

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">

          <table width="100%" style="max-width:800px;background:#ffffff">

            <!-- HEADER -->
            <tr>
              <td style="background:linear-gradient(135deg, #3246527c, #193648);padding:40px;text-align:center;color:#fff">
                <h1 style="margin:0;font-size:20px">Application Accepted 🎉</h1>
                <p style="margin-top:8px;font-size:14px;opacity:0.9">
                  Internship Notification
                </p>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:40px">

                <p style="font-size:16px;color:#111827;margin:0">
                  Dear <strong>${studentName}</strong>,
                </p>

                <p style="color:#4b5563;line-height:1.7;margin-top:12px;font-size:14px">
                  We are pleased to inform you that your application for the position of
                  <strong>${internshipTitle}</strong> at <strong>${company}</strong>
                  has been successfully Approved for the next stage of evaluation.
                </p>

                <!-- INTERVIEW SECTION -->
               <div style="background:#EEF2FF;border-left:6px solid #193648;padding:18px;border-radius:8px;margin:20px 0;line-height:1.6">
  
  <p style="margin:0 0 10px 0;color:#1E3A8A;font-size:14px">
    <strong>Interview Schedule</strong>
  </p>

  <p style="margin:0;color:#1E3A8A;font-size:14px">
    📅 <strong>Date:</strong> ${formattedDate}
  </p>

  <p style="margin:6px 0 0 0;color:#1E3A8A;font-size:14px">
    ⏰ <strong>Time:</strong> ${formattedTime}
  </p>

  <p style="margin:6px 0 0 0;color:#1E3A8A;font-size:14px">
    📍 <strong>Venue/Mode:</strong> ${company} Office (On-site Interview)
  </p>

</div>

                <!-- WHAT TO EXPECT -->
                <div style="background:#F9FAFB;border:1px solid #E5E7EB;padding:18px;border-radius:8px;margin:20px 0">
                  <p style="margin:0;color:#374151;font-size:14px;line-height:1.6">
                    <strong>Interview Overview:</strong><br/>
                    The interview will focus on your academic background, technical understanding,
                    problem-solving approach, and relevant project experience aligned with the role requirements.
                  </p>
                </div>

                <!-- REMARKS -->
                ${remarks ? `
                <div style="background:#FFF7ED;border-left:6px solid #F97316;padding:18px;border-radius:8px;margin:20px 0">
                  <p style="margin:0;color:#9A3412;font-size:14px">
                    <strong>Additional Note:</strong><br/>
                    ${remarks}
                  </p>
                </div>` : ""}

             <p style="color:#4b5563;font-size:14px;line-height:1.7;margin-top:10px">
We look forward to your interview at the scheduled time.
</p>

                <p style="margin-top:30px;font-size:13px;color:#6B7280">
                  Best regards,<br/>
                  <strong style="color:#1D4ED8">${company}</strong><br/>
                  CollaXion - Industry_university Collaboration
                </p>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </div>
  `;

  await transporter.sendMail({
    from: `"${company}" <${process.env.EMAIL_USER}>`,
    to: studentEmail,
    subject: `Interview Shortlisted - ${internshipTitle} at ${company}`,
    html,
  });
};






// ─── Enrich one raw application doc ──────────────────────────────────────────
// async function enrichForIndustry(app) {
//   const enriched = { ...app };

//   // Resolve student — try ObjectId first, then email fallback
//   let studentDoc = null;
//   if (app.studentId) {
//     try {
//       studentDoc = await Student.findById(
//         typeof app.studentId === "object" ? (app.studentId._id || app.studentId) : app.studentId
//       ).lean();
//     } catch (_) {}
//   }
//   if (!studentDoc && app.studentEmail) {
//     studentDoc = await Student.findOne({ email: app.studentEmail }).lean();
//   }

//   enriched.studentId = {
//     _id:          studentDoc?._id        || app.studentId,
//     name:         studentDoc?.fullName   || app.studentEmail?.split("@")[0] || "Unknown",
//     email:        studentDoc?.email      || app.studentEmail || "",
//     department:   studentDoc?.department || "",
//     semester:     studentDoc?.semester   || "",
//     phone:        studentDoc?.phone      || "",
//     cgpa:         studentDoc?.cgpa       || "",
//     rollNumber:   studentDoc?.rollNumber || "",
//     cvUrl:        studentDoc?.cvUrl      || "",
//     profileImage: studentDoc?.profileImage || "",
//   };

//   // Resolve internship
//   let internDoc = null;
//   if (app.internshipId) {
//     try {
//       internDoc = await Internship.findById(
//         typeof app.internshipId === "object" ? (app.internshipId._id || app.internshipId) : app.internshipId
//       ).lean();
//     } catch (_) {}
//   }
//   enriched.internshipId = internDoc || {
//     title: "Unknown Internship", company: "—", requiredSkills: [], type: "",
//   };

//   // Compute industryStatus
//   const iStatus    = app.industryApproval?.status || "pending";
//   const appStatus  = (app.status || "").toLowerCase();
//   enriched.industryStatus =
//     iStatus === "approved" ? "approved" :
//     iStatus === "rejected" ? "rejected" : "pending";

//   return enriched;
// }




async function enrichForIndustry(app) {
  const enriched = { ...app };

  // Resolve student — try ObjectId first, then email fallback
  let studentDoc = null;
  if (app.studentId) {
    try {
      studentDoc = await Student.findById(
        typeof app.studentId === "object"
          ? (app.studentId._id || app.studentId)
          : app.studentId
      ).lean();
    } catch (_) {}
  }

  if (!studentDoc && app.studentEmail) {
    studentDoc = await Student.findOne({ email: app.studentEmail }).lean();
  }

  enriched.studentId = {
    _id:          studentDoc?._id        || app.studentId,
    name:         studentDoc?.fullName   || app.studentEmail?.split("@")[0] || "Unknown",
    email:        studentDoc?.email      || app.studentEmail || "",
    department:   studentDoc?.department || "",
    semester:     studentDoc?.semester   || "",
    phone:        studentDoc?.phone      || "",
    cgpa:         studentDoc?.cgpa       || "",
    rollNumber:   studentDoc?.rollNumber || "",
    cvUrl:        studentDoc?.cvUrl      || "",
    profileImage: studentDoc?.profileImage || "",
  };

  // Resolve internship
  let internDoc = null;
  if (app.internshipId) {
    try {
      internDoc = await Internship.findById(
        typeof app.internshipId === "object"
          ? (app.internshipId._id || app.internshipId)
          : app.internshipId
      ).lean();
    } catch (_) {}
  }

  enriched.internshipId = internDoc || {
    title: "Unknown Internship",
    company: "—",
    requiredSkills: [],
    type: "",
  };

  // ✅ FIXED: single source of truth
  enriched.industryStatus =
    app.status === "approved" ? "approved" :
    app.status === "rejected" ? "rejected" :
    "pending";

  return enriched;
}
// ─────────────────────────────────────────────────────────────────────────────
// GET /api/industry/applications
// ─────────────────────────────────────────────────────────────────────────────
// router.get("/applications", async (req, res) => {
//   try {
//     const page  = Number(req.query.page)  || 1;
//     const limit = Number(req.query.limit) || 50;

//     // const query = {
//     //   $or: [
//     //     { status: "sent_to_industry" },
//     //     { "industryApproval.status": { $in: ["approved", "rejected"] } },
//     //   ],
//     // };


//     const query = {
//   status: { $in: ["sent_to_industry", "approved", "rejected"] }
// };
//     const [raw, total] = await Promise.all([
//       Application.find(query)
//         .sort({ updatedAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(limit)
//         .lean(),
//       Application.countDocuments(query),
//     ]);

//     const enriched = await Promise.all(raw.map(enrichForIndustry));

//     return res.json({
//       success: true,
//       data: enriched,
//       stats: {
//         total,
//         pending:  enriched.filter((a) => a.industryStatus === "pending").length,
//         approved: enriched.filter((a) => a.industryStatus === "approved").length,
//         rejected: enriched.filter((a) => a.industryStatus === "rejected").length,
//       },
//       pagination: { total, page, limit, pages: Math.ceil(total / limit) },
//     });
//   } catch (err) {
//     console.error("GET /industry/applications error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });



// router.get("/applications", async (req, res) => {
//   try {
//     const page  = Number(req.query.page)  || 1;
//     const limit = Number(req.query.limit) || 50;

//     // ✅ FIXED QUERY
//     const query = {
//       status: { $in: ["sent_to_industry", "approved", "rejected"] }
//     };

//     const [raw, total] = await Promise.all([
//       Application.find(query)
//         .sort({ updatedAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(limit)
//         .lean(),
//       Application.countDocuments(query),
//     ]);

//     const enriched = await Promise.all(raw.map(enrichForIndustry));

//     return res.json({
//       success: true,
//       data: enriched,
//       stats: {
//         total,
//         pending:  enriched.filter((a) => a.industryStatus === "pending").length,
//         approved: enriched.filter((a) => a.industryStatus === "approved").length,
//         rejected: enriched.filter((a) => a.industryStatus === "rejected").length,
//       },
//       pagination: { total, page, limit, pages: Math.ceil(total / limit) },
//     });
//   } catch (err) {
//     console.error("GET /industry/applications error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });




router.get("/applications", async (req, res) => {
  try {
    const page  = Number(req.query.page)  || 1;
    const limit = Number(req.query.limit) || 50;

    // ✅ FIXED QUERY
    const query = {
      status: { $in: ["sent_to_industry", "approved", "rejected"] }
    };

    const [raw, total] = await Promise.all([
      Application.find(query)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Application.countDocuments(query),
    ]);

    const enriched = await Promise.all(raw.map(enrichForIndustry));

    return res.json({
      success: true,
      data: enriched,
      stats: {
        total,
        pending:  enriched.filter((a) => a.industryStatus === "pending").length,
        approved: enriched.filter((a) => a.industryStatus === "approved").length,
        rejected: enriched.filter((a) => a.industryStatus === "rejected").length,
      },
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("GET /industry/applications error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});
// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/industry/applications/:id/approve  → email student
// ─────────────────────────────────────────────────────────────────────────────
router.patch("/applications/:id/approve", async (req, res) => {
  try {
    const { remarks = "" } = req.body;

    const app = await Application.findOne({
      _id:    req.params.id,
      status: "sent_to_industry",
    }).lean();

    if (!app) {
      return res.status(404).json({
        success: false,
        message: "Application not found or not in industry queue",
      });
    }

    if (app.industryApproval?.status === "approved") {
      return res.status(400).json({ success: false, message: "Already approved" });
    }

    // Update with $set — avoids strict schema issues from .save()
    await Application.updateOne(
      { _id: app._id },
      {
        $set: {
          status:                          "approved",
          "industryApproval.status":       "approved",
          "industryApproval.approvedAt":   new Date(),
          "industryApproval.remarks":      remarks,
        },
      }
    );

    // Resolve student for email
    let studentDoc = null;
    try { if (app.studentId) studentDoc = await Student.findById(app.studentId).lean(); } catch (_) {}
    if (!studentDoc && app.studentEmail)
      studentDoc = await Student.findOne({ email: app.studentEmail }).lean();

    let internDoc = null;
    try { if (app.internshipId) internDoc = await Internship.findById(app.internshipId).lean(); } catch (_) {}

    const studentEmail = studentDoc?.email      || app.studentEmail || "";
    const studentName  = studentDoc?.fullName   || studentEmail.split("@")[0] || "Student";
    const internTitle  = internDoc?.title       || "Internship";
    const company      = internDoc?.company     || "Industry Partner";

    let emailSent = false;
    if (studentEmail) {
      try {
        await sendSelectionEmail({ studentEmail, studentName, internshipTitle: internTitle, company, remarks });
        emailSent = true;
      } catch (emailErr) {
        console.error("Email error:", emailErr.message);
      }
    }

    return res.json({
      success: true,
      message: `Approved. ${emailSent ? `Email sent to ${studentEmail}.` : "Email could not be sent."}`,
      emailSent,
    });
  } catch (err) {
    console.error("Approve error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/industry/applications/:id/reject
// ─────────────────────────────────────────────────────────────────────────────
router.patch("/applications/:id/reject", async (req, res) => {
  try {
    const { remarks = "" } = req.body;

    const app = await Application.findOne({
      _id:    req.params.id,
      status: "sent_to_industry",
    }).lean();

    if (!app) {
      return res.status(404).json({
        success: false,
        message: "Application not found or not in industry queue",
      });
    }

    await Application.updateOne(
      { _id: app._id },
      {
        $set: {
          status:                          "rejected",
          "industryApproval.status":       "rejected",
          "industryApproval.rejectedAt":   new Date(),
          "industryApproval.remarks":      remarks,
        },
      }
    );

    return res.json({ success: true, message: "Application rejected." });
  } catch (err) {
    console.error("Reject error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/industry/applications/stats
// ─────────────────────────────────────────────────────────────────────────────
router.get("/applications/stats", async (req, res) => {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      Application.countDocuments({ status: { $in: ["sent_to_industry", "approved", "rejected"] } }),
      Application.countDocuments({ status: "sent_to_industry" }),
      Application.countDocuments({ "industryApproval.status": "approved" }),
      Application.countDocuments({ "industryApproval.status": "rejected" }),
    ]);
    return res.json({ success: true, stats: { total, pending, approved, rejected } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;