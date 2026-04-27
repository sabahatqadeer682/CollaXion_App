import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import fs from "fs";
import Student from "../models/Student.js";
// import { Internship, Application } from "../models/Internship.js";
import { updatePassword } from "../controllers/updatePasswordController.js";

import Internship from "../models/Internship.js";
import Application from "../models/Application.js";
import { extractSkillsFromCV, recommendInternships, generateCVFeedback } from "../services/aiService.js";


import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const router = express.Router();

// ============================
//  Nodemailer Setup
// ============================
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ============================
// Helper: Generate Code
// ============================
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// ============================
// REGISTER STUDENT
// ============================
router.post("/register", async (req, res) => {
    const { fullName, sapId, gender, email, password, phone, department, semester, city, address } = req.body;
    try {
        if (!sapId || !/^\d{5,7}$/.test(String(sapId).trim()))
            return res.status(400).json({ success: false, message: "Invalid SAP ID (5-7 digits required)" });

        const existingStudent = await Student.findOne({ $or: [{ email }, { sapId: String(sapId).trim() }] });
        if (existingStudent) {
            const message = existingStudent.email === email ? "Email already registered" : "SAP ID already registered";
            return res.status(409).json({ success: false, message });
        }

        const verificationCode = generateCode();

        const newStudent = new Student({
            fullName,
            sapId: String(sapId).trim(),
            gender,
            email,
            password,
            phone,
            department,
            semester,
            city,
            address,
            verificationCode,
            verified: false,
        });

        await newStudent.save();

        await transporter.sendMail({
            from: `"CollaXion" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your Verification Code",
            html: `<p>Dear ${fullName},</p><p>Thank you for registering with CollaXion.</p><p>Your verification code is: <strong>${verificationCode}</strong></p><p>Where collaboration meets innovation,<br/>The CollaXion Support</p>`,
        });

        res.status(201).json({ success: true, message: "Verification code sent to your email" });
    } catch (err) {
        console.error("Error during student registration:", err);
        res.status(500).json({ success: false, message: "Server error during registration" });
    }
});


//update pswrd
router.put("/update-password", updatePassword);









// ============================
// VERIFY STUDENT
// ============================
router.post("/verify", async (req, res) => {
    const { email, code } = req.body;
    try {
        const student = await Student.findOne({ email });
        if (!student) return res.status(404).json({ success: false, message: "Student not found" });
        if (student.verificationCode !== code)
            return res.status(400).json({ success: false, message: "Invalid verification code" });

        student.verified = true;
        student.verificationCode = null;
        await student.save();

        res.status(200).json({ success: true, message: "Account verified successfully" });
    } catch (err) {
        console.error("Error during student verification:", err);
        res.status(500).json({ success: false, message: "Server error during verification" });
    }
});

// ============================
// LOGIN STUDENT
// ============================
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const student = await Student.findOne({ email });
        if (!student)
            return res.status(404).json({ success: false, message: "Email not registered" });
        if (student.password !== password)
            return res.status(401).json({ success: false, message: "Incorrect password" });
        if (!student.verified)
            return res.status(403).json({ success: false, message: "Account not verified yet." });

        res.status(200).json({ success: true, message: "Login successful", student });
    } catch (err) {
        console.error("Error during student login:", err);
        res.status(500).json({ success: false, message: "Server error during login" });
    }
});

// ============================
// GET STUDENT BY EMAIL
// ============================
router.get("/getStudent/:email", async (req, res) => {
    try {
        const student = await Student.findOne({ email: req.params.email });
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.status(200).json(student);
    } catch (err) {
        console.error("Error fetching student:", err);
        res.status(500).json({ message: "Server error fetching student" });
    }
});

// ============================
// UPDATE PROFILE (WITH PROFILE IMAGE)
// ============================
router.put("/updateProfile", async (req, res) => {
    const { email, fullName, phone, city, address, profileImage } = req.body;
    try {
        const updateData = {
            fullName,
            phone,
            city,
            address
        };


        if (profileImage) {
            updateData.profileImage = profileImage;
        }

        // const student = await Student.findOne(
        //     { email },
        //     updateData,
        //     { new: true, runValidators: true }
        // );
        // ✅ NAYA - findOneAndUpdate use karo
const student = await Student.findOneAndUpdate(
    { email },
    { $set: updateData },
    { new: true, runValidators: true }
);

        if (!student) return res.status(404).json({ message: "Student not found" });

        res.status(200).json({ success: true, message: "Profile updated successfully", student });
    } catch (err) {
        console.error("Error updating student profile:", err);
        res.status(500).json({ message: "Server error updating profile" });
    }
});
// ============================
// PROFILE IMAGE UPLOAD
// ============================
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "uploads/profile";
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, ""));
    },
});

const uploadProfile = multer({
    storage: profileStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = [".jpg", ".jpeg", ".png"];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowed.includes(ext)) return cb(new Error("Only JPG, JPEG, PNG allowed"));
        cb(null, true);
    },
});

router.post("/upload-profile-image/:email", uploadProfile.single("profileImage"), async (req, res) => {
    try {
        const { email } = req.params;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const student = await Student.findOne({ email });
        if (!student) {
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        // Delete old profile image
        if (student.profileImage && student.profileImage.includes("/uploads/profile")) {
            const oldPath = path.join(__dirname, '..', '..', student.profileImage);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        const imageUrl = `/uploads/profile/${req.file.filename}`;
        student.profileImage = imageUrl;
        await student.save();

        res.status(200).json({
            success: true,
            message: "Profile image updated!",
            profileImage: imageUrl
        });

    } catch (err) {
        console.error("Profile image upload error:", err);
        res.status(500).json({ success: false, message: "Error uploading image" });
    }
});
// ============================
// CV UPLOAD SETUP
// ============================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "uploads/cv";
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const sanitizedFilename = path.basename(file.originalname).replace(/[^a-zA-Z0-9.\-_]/g, "");
        cb(null, Date.now() + "-" + sanitizedFilename);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = [".pdf", ".doc", ".docx"];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowed.includes(ext)) return cb(new Error("Only PDF, DOC, DOCX allowed"));
        cb(null, true);
    },
});

// ============================
// CV UPLOAD + AI FEEDBACK
// ============================

router.post("/upload-cv/:email", upload.single("cv"), async (req, res) => {
    let uploadedFilePath = null;

    try {
        const { email } = req.params;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        uploadedFilePath = req.file.path;
        const fileType = req.file.mimetype;

        console.log("CV file received:", uploadedFilePath);

        // const student = await Student.findOneAndUpdate({ email });

        const student = await Student.findOne({ email });

        if (!student) {
            fs.unlinkSync(uploadedFilePath);
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // Delete old CV if exists
        if (student.cvUrl) {
            try {
                const oldPath = path.join(__dirname, '..', '..', student.cvUrl.replace(/^\//, ''));
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                    console.log("Deleted old CV");
                }
            } catch (err) {
                console.error("Error deleting old CV:", err);
            }
        }


        student.cvUrl = `/uploads/cv/${req.file.filename}`;
        // Mark as processing so the frontend can show a state
        student.cvProcessing = true;
        // validateModifiedOnly avoids re-validating legacy fields on older
        // documents (e.g. those created before sapId was added).
        await student.save({ validateModifiedOnly: true });

        // 🚀 Respond IMMEDIATELY — mobile fetch was timing out on the
        // multi-second Gemini calls below, surfacing as "Network request failed".
        res.status(200).json({
            success: true,
            message: "CV uploaded. AI analysis is running in the background.",
            student,
        });

        // ── Background AI extraction (fire-and-forget) ──
        (async () => {
            try {
                console.log("Starting AI analysis for", email);
                const extractedData = await extractSkillsFromCV(uploadedFilePath, fileType);
                if (!extractedData || !extractedData.skills) {
                    throw new Error("No data extracted from CV");
                }
                console.log("AI extraction successful for", email);

                const fresh = await Student.findOne({ email });
                if (!fresh) return;

                fresh.extractedSkills = extractedData.skills || [];

                if (Array.isArray(extractedData.education)) {
                    extractedData.education = extractedData.education.map((edu) => {
                        if (typeof edu === "object" && edu !== null) {
                            const degree = edu.degree || "";
                            const institution = edu.institution || "";
                            const years = edu.years || "";
                            return `${degree} - ${institution} (${years})`.trim();
                        }
                        return edu;
                    });
                }
                fresh.education = extractedData.education;

                if (Array.isArray(extractedData.experience)) {
                    extractedData.experience = extractedData.experience.map((exp) => {
                        if (typeof exp === "object" && exp !== null) {
                            const title = exp.title || "";
                            const company = exp.company || "";
                            const duration = exp.duration || "";
                            return `${title} - ${company} (${duration})`.trim();
                        }
                        return exp;
                    });
                }
                fresh.experience = extractedData.experience || [];
                fresh.professionalSummary = extractedData.summary || "";
                fresh.cvProcessing = false;
                await fresh.save({ validateModifiedOnly: true });

                // Push a notification + WS event so the UI updates in real time
                try {
                    const { notifyStudent } = await import("../utils/notify.js");
                    await notifyStudent(req, {
                        studentEmail: email,
                        title: "CV Analysis Complete ✅",
                        message: `Found ${fresh.extractedSkills.length} skills in your CV.`,
                        type: "general",
                    });
                } catch (notifErr) {
                    console.warn("CV notif error:", notifErr.message);
                }
            } catch (aiError) {
                console.error("AI extraction failed:", aiError.message);
                try {
                    const fresh = await Student.findOne({ email });
                    if (fresh) {
                        fresh.cvProcessing = false;
                        await fresh.save({ validateModifiedOnly: true });
                    }
                } catch {}
            }
        })();
        return;

    } catch (err) {
        console.error("Error uploading CV:", err);
        if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
            try {
                fs.unlinkSync(uploadedFilePath);
                console.log("Cleaned up uploaded file after error");
            } catch (cleanupErr) {
                console.error("Error cleaning up file:", cleanupErr);
            }
        }

        res.status(500).json({
            success: false,
            message: "Error uploading CV: " + err.message,
            error: err.message
        });
    }
});



// ============================
// Recommendation
// ============================

// router.get("/recommendations/:email", async (req, res) => {
//     try {
//         const student = await Student.findOne({ email: req.params.email });
//         if (!student) {
//             return res.status(404).json({ success: false, message: "Student not found" });
//         }

//         if (!student.extractedSkills || student.extractedSkills.length === 0) {
//             return res.status(200).json({
//                 success: true,
//                 recommendations: [],
//                 studentSkills: [],
//                 message: "Please upload your CV to get recommendations"
//             });
//         }

//         const activeInternships = await Internship.find({ isActive: true });

//         if (!activeInternships || activeInternships.length === 0) {
//             return res.status(200).json({
//                 success: true,
//                 recommendations: [],
//                 studentSkills: student.extractedSkills,
//                 message: "No active internships available at the moment"
//             });
//         }

//         const appliedApplications = await Application.find({
//             studentId: student._id
//         }).select('internshipId');

//         const appliedInternshipIds = appliedApplications.map(app => app.internshipId.toString());

//         const availableInternships = activeInternships.filter(
//             internship => !appliedInternshipIds.includes(internship._id.toString())
//         );

//         if (availableInternships.length === 0) {
//             return res.status(200).json({
//                 success: true,
//                 recommendations: [],
//                 studentSkills: student.extractedSkills,
//                 message: "You have applied to all available internships"
//             });
//         }

//         const studentSkills = student.extractedSkills.map(s => s.toLowerCase().trim());

//         const recommendations = availableInternships
//             .map(internship => {
//                 const requiredSkills = (internship.requiredSkills || [])
//                     .map(s => s.toLowerCase().trim())
//                     .filter(s => s.length > 0);

//                 if (requiredSkills.length === 0) {
//                     return null;
//                 }

//                 const matchingSkills = requiredSkills.filter(reqSkill =>
//                     studentSkills.some(stuSkill => {
//                         // Exact match
//                         if (stuSkill === reqSkill) return true;
//                         // Partial match
//                         if (stuSkill.includes(reqSkill) || reqSkill.includes(stuSkill)) return true;
//                         // Word match
//                         const reqWords = reqSkill.split(/\s+/);
//                         const stuWords = stuSkill.split(/\s+/);
//                         return reqWords.some(rw => stuWords.some(sw => sw === rw || sw.includes(rw) || rw.includes(sw)));
//                     })
//                 );

//                 // Find missing skills
//                 const missingSkills = requiredSkills.filter(reqSkill =>
//                     !matchingSkills.includes(reqSkill)
//                 );
// // 👉 YAHAN DEBUG LOG ADD KARO
// console.log("====== INTERNSHIP DEBUG ======");
// console.log("Student Skills:", studentSkills);
// console.log("Internship Skills:", requiredSkills);
// console.log("Matching:", matchingSkills);
//                 // Calculate match score
//                 const matchScore = Math.round((matchingSkills.length / requiredSkills.length) * 100);


//                 if (matchScore === 0) {
//                     return null;
//                 }


//                 return {
//                     internshipId: {
//                         _id: internship._id,
//                         title: internship.title,
//                         company: internship.company,
//                         image: internship.image || null,
//                         requiredSkills: internship.requiredSkills
//                     },
//                     matchScore,
//                     matchingSkills: internship.requiredSkills.filter(skill =>
//                         matchingSkills.includes(skill.toLowerCase().trim())
//                     ),
//                     missingSkills: internship.requiredSkills.filter(skill =>
//                         missingSkills.includes(skill.toLowerCase().trim())
//                     )
//                 };
//             })
//             .filter(rec => rec !== null)
//             .sort((a, b) => b.matchScore - a.matchScore)
//             .slice(0, 8);

//         // Response
//         res.status(200).json({
//             success: true,
//             recommendations: recommendations,
//             studentSkills: student.extractedSkills,
//             message: recommendations.length === 0
//                 ? "Your skills are saved. We'll notify you when new internships match your profile."
//                 : `Found ${recommendations.length} matching internship(s)`
//         });

//     } catch (err) {
//         console.error("Error fetching recommendations:", err);
//         res.status(500).json({
//             success: false,
//             message: "Error fetching recommendations",
//             error: err.message
//         });
//     }
// });


// ============================
// Recommendation Route (UPDATED)
// ============================

router.get("/recommendations/:email", async (req, res) => {
    try {
        const student = await Student.findOne({ email: req.params.email });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // CV skills check
        if (!student.extractedSkills || student.extractedSkills.length === 0) {
            return res.status(200).json({
                success: true,
                recommendations: [],
                studentSkills: [],
                message: "Please upload your CV to get recommendations"
            });
        }

        // 🔥 NEW: no isActive filter (schema removed it)
        const internships = await Internship.find();

        if (!internships.length) {
            return res.status(200).json({
                success: true,
                recommendations: [],
                studentSkills: student.extractedSkills,
                message: "No internships available"
            });
        }

        const studentSkills = student.extractedSkills.map(s =>
            s.toLowerCase().trim()
        );

        const recommendations = internships
            .map((internship) => {

                const requiredSkills = (internship.requiredSkills || [])
                    .map(s => s.toLowerCase().trim())
                    .filter(Boolean);

                if (requiredSkills.length === 0) return null;

                // Matching skills
                const matchingSkills = requiredSkills.filter(reqSkill =>
                    studentSkills.some(stuSkill => {
                        return (
                            stuSkill === reqSkill ||
                            stuSkill.includes(reqSkill) ||
                            reqSkill.includes(stuSkill)
                        );
                    })
                );

                const missingSkills = requiredSkills.filter(
                    skill => !matchingSkills.includes(skill)
                );

                const matchScore = Math.round(
                    (matchingSkills.length / requiredSkills.length) * 100
                );

                // skip only totally irrelevant ones
                if (matchScore === 0) return null;

                return {
                    internshipId: {
                        _id: internship._id,
                        title: internship.title,
                        company: internship.company,

                        // 🔥 NEW FIELD NAME FIX
                        logo: internship.logo || null,

                        requiredSkills: internship.requiredSkills,
                        location: internship.location,
                        duration: internship.duration,
                        stipend: internship.stipend,
                        domain: internship.domain
                    },
                    matchScore,
                    matchingSkills: internship.requiredSkills.filter(skill =>
                        matchingSkills.includes(skill.toLowerCase().trim())
                    ),
                    missingSkills: internship.requiredSkills.filter(skill =>
                        missingSkills.includes(skill.toLowerCase().trim())
                    )
                };
            })
            .filter(Boolean)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 8);

        return res.status(200).json({
            success: true,
            recommendations,
            studentSkills: student.extractedSkills,
            message: recommendations.length
                ? `Found ${recommendations.length} matching internships`
                : "No strong matches found yet. Update your CV for better results."
        });

    } catch (err) {
        console.error("Recommendation error:", err);

        return res.status(500).json({
            success: false,
            message: "Error fetching recommendations",
            error: err.message
        });
    }
});


router.delete("/delete-cv/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        if (student.cvUrl) {

            const filePath = path.join(__dirname, '..', '..', student.cvUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // CV data clear
        student.cvUrl = undefined;
        student.cvFeedback = undefined;
        student.extractedSkills = [];
        student.education = [];
        student.experience = [];
        student.professionalSummary = undefined;

        // validateModifiedOnly so we don't trip on unrelated legacy fields.
        await student.save({ validateModifiedOnly: true });

        res.status(200).json({
            success: true,
            message: "CV deleted successfully",
            student,
        });
    } catch (err) {
        console.error("Error deleting CV:", err);
        res.status(500).json({ success: false, message: "Error deleting CV" });
    }
});

// ============================
// VIEW CV — streams the file inline with proper headers
// GET /api/student/view-cv/:email
// ============================
router.get("/view-cv/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const student = await Student.findOne({ email });
        if (!student || !student.cvUrl) {
            return res.status(404).send("CV not found");
        }

        // Decode in case the URL was stored with %20 etc.
        const stored = decodeURIComponent(student.cvUrl);
        const relative = stored.replace(/^\/+/, "");
        const justName = path.basename(relative);

        // Try several possible locations — whichever one actually exists wins.
        const candidates = [
            path.join(__dirname, "..", "..", relative),                  // backend/<relative>
            path.join(process.cwd(), relative),                          // <cwd>/<relative>
            path.join(__dirname, "..", "..", "uploads", "cv", justName), // backend/uploads/cv/<name>
            path.join(process.cwd(), "uploads", "cv", justName),         // <cwd>/uploads/cv/<name>
        ];

        const filePath = candidates.find((p) => {
            try { return fs.existsSync(p); } catch { return false; }
        });

        if (!filePath) {
            console.warn("View CV — file not found. Tried:", candidates, "cvUrl:", student.cvUrl);
            return res
                .status(404)
                .send("CV file is missing on the server. It may have been deleted — please re-upload your CV.");
        }

        const ext = path.extname(filePath).toLowerCase();
        const mime =
            ext === ".pdf"
                ? "application/pdf"
                : ext === ".doc"
                ? "application/msword"
                : ext === ".docx"
                ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                : "application/octet-stream";

        res.setHeader("Content-Type", mime);
        res.setHeader("Content-Disposition", `inline; filename="${path.basename(filePath)}"`);
        res.setHeader("Cache-Control", "no-store");
        fs.createReadStream(filePath).pipe(res);
    } catch (err) {
        console.error("View CV error:", err);
        res.status(500).send("Error serving CV");
    }
});


// Update apply internship route
router.post("/apply-internship", async (req, res) => {
    try {
        const { studentEmail, internshipId } = req.body;

        const student = await Student.findOne({ email: studentEmail });
        if (!student)
            return res.status(404).json({ success: false, message: "Student not found" });

        const internship = await Internship.findById(internshipId);
        if (!internship)
            return res.status(404).json({ success: false, message: "Internship not found" });

        const existingApp = await Application.findOne({
            studentId: student._id,
            internshipId: internship._id,
        });

        if (existingApp)
            return res.status(409).json({ success: false, message: "Already applied for this internship" });

        // Calculate match score and matching skills
        const studentSkills = student.extractedSkills || [];
        const requiredSkills = internship.requiredSkills || [];

        const matchingSkills = requiredSkills.filter(skill =>
            studentSkills.some(studentSkill =>
                studentSkill.toLowerCase().includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(studentSkill.toLowerCase())
            )
        );

        const missingSkills = requiredSkills.filter(skill =>
            !matchingSkills.some(match =>
                match.toLowerCase() === skill.toLowerCase()
            )
        );

        const matchScore = requiredSkills.length > 0
            ? Math.round((matchingSkills.length / requiredSkills.length) * 100)
            : 0;

        const newApp = new Application({
            studentId: student._id,
            internshipId: internship._id,
            status: "pending",
            matchScore: matchScore,
            matchingSkills: matchingSkills,
            missingSkills: missingSkills,
            skillsSnapshot: studentSkills,
            cvSnapshot: student.cvUrl,
        });

        await newApp.save();
        student.totalApplications += 1;
        await student.save();

        res.status(200).json({
            success: true,
            message: "Application submitted successfully",
            matchData: {
                matchScore,
                matchingSkills,
                missingSkills
            }
        });
    } catch (err) {
        console.error("Error applying for internship:", err);
        res.status(500).json({ success: false, message: "Error applying for internship" });
    }
});
// ============================ 
// VIEW MY APPLICATIONS
// ============================
router.get("/my-applications/:email", async (req, res) => {
    try {
        const student = await Student.findOne({ email: req.params.email });
        console.log("====== STUDENT DEBUG ======");
console.log("Student Found:", student);
console.log("Extracted Skills:", student.extractedSkills);
        if (!student)
            return res.status(404).json({ success: false, message: "Student not found" });

        const applications = await Application.find({ studentId: student._id })
            .populate("internshipId")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, applications });
    } catch (err) {
        console.error("Error fetching applications:", err);
        res.status(500).json({ success: false, message: "Error fetching applications" });
    }
});



router.post("/send-rating", async (req, res) => {
    try {
        const { stars, feedback, studentEmail } = req.body;

        if (!stars || stars < 1 || stars > 5) {
            return res.status(400).json({ success: false, message: "Invalid rating." });
        }

        const starEmojis = ["","⭐","⭐⭐","⭐⭐⭐","⭐⭐⭐⭐","⭐⭐⭐⭐⭐"];
        const labels = ["","Poor","Fair","Good","Great","Excellent"];

        await transporter.sendMail({
            from: `"CollaXion App" <${process.env.EMAIL_USER}>`,
            to: process.env.TEAM_EMAIL || "collaxionsupport@gmail.com",
            subject: `${starEmojis[stars]} New Rating: ${labels[stars]} (${stars}/5) — CollaXion`,
            html: `
            <!DOCTYPE html><html><body style="margin:0;padding:0;background:#f0f4f7;font-family:Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
              <tr><td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                  <tr><td style="background:#193648;padding:24px 32px;text-align:center;">
                    <h1 style="color:#fff;margin:0;font-size:20px;">CollaXion</h1>
                    <p style="color:rgba(255,255,255,0.5);margin:4px 0 0;font-size:12px;">New App Rating Received</p>
                  </td></tr>
                  <tr><td style="padding:28px 32px 0;text-align:center;">
                    <div style="font-size:40px;margin-bottom:8px;">${starEmojis[stars]}</div>
                    <h2 style="color:#1A2E3B;margin:0;font-size:22px;">${labels[stars]}</h2>
                    <p style="color:#6B8A9A;font-size:14px;margin:4px 0 0;">${stars} out of 5 stars</p>
                  </td></tr>
                  <tr><td style="padding:20px 32px 28px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4F7;border-radius:12px;margin-bottom:16px;">
                      <tr><td style="padding:16px 20px;">
                        <p style="margin:0 0 6px;font-size:12px;color:#6B8A9A;">👤 Student Email</p>
                        <p style="margin:0 0 14px;font-size:14px;color:#1A2E3B;font-weight:600;">${studentEmail}</p>
                        <p style="margin:0 0 6px;font-size:12px;color:#6B8A9A;">🕐 Submitted At</p>
                        <p style="margin:0;font-size:14px;color:#1A2E3B;font-weight:600;">
                          ${new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi", dateStyle: "full", timeStyle: "short" })}
                        </p>
                      </td></tr>
                    </table>
                    ${feedback ? `
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#EBF5FB;border-radius:12px;border-left:4px solid #2E86AB;">
                      <tr><td style="padding:14px 18px;">
                        <p style="margin:0 0 6px;font-size:12px;color:#6B8A9A;font-weight:700;">💬 Student Feedback</p>
                        <p style="margin:0;font-size:14px;color:#1A2E3B;line-height:1.6;">${feedback}</p>
                      </td></tr>
                    </table>` : `<p style="color:#6B8A9A;font-size:13px;text-align:center;">No written feedback provided.</p>`}
                  </td></tr>
                  <tr><td style="background:#F0F4F7;padding:14px 32px;text-align:center;border-top:1px solid #E2ECF1;">
                    <p style="margin:0;font-size:11px;color:#9AADB8;">© 2025 CollaXion • collaxionsupport@gmail.com</p>
                  </td></tr>
                </table>
              </td></tr>
            </table>
            </body></html>`,
        });

        return res.status(200).json({ success: true, message: "Rating submitted!" });
    } catch (err) {
        console.error("Rating email error:", err);
        return res.status(500).json({ success: false, message: "Rating can't send" });
    }
});






export default router;