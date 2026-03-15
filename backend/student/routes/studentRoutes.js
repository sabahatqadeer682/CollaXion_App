import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import fs from "fs";
import Student from "../models/Student.js";
import { Internship, Application } from "../models/Internship.js";
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
    const { fullName, email, password, phone, department, semester, city, address } = req.body;
    try {
        const existingStudent = await Student.findOne({ email });
        if (existingStudent)
            return res.status(409).json({ success: false, message: "Email already registered" });

        const verificationCode = generateCode();

        const newStudent = new Student({
            fullName,
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
            html: `<p>Dear ${fullName},</p><p>Thank you for registering with CollaXion.</p><p>Your verification code is: <strong>${verificationCode}</strong></p><p>Regards,<br/>The CollaXion Team</p>`,
        });

        res.status(201).json({ success: true, message: "Verification code sent to your email" });
    } catch (err) {
        console.error("Error during student registration:", err);
        res.status(500).json({ success: false, message: "Server error during registration" });
    }
});

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

        const student = await Student.findOneAndUpdate(
            { email },
            updateData,
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

        const student = await Student.findOneAndUpdate({ email });
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

        console.log("Starting AI analysis...");

        // Extract skills using AI
        let extractedData;
        try {
            extractedData = await extractSkillsFromCV(uploadedFilePath, fileType);
            if (!extractedData || !extractedData.skills) {
                throw new Error("No data extracted from CV");
            }
            console.log("AI extraction successful");
            student.extractedSkills = extractedData.skills || [];


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

            // push into MongoDB
            student.education = extractedData.education;


            // Experience
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

            // Save to student
            student.experience = extractedData.experience || [];

            student.professionalSummary = extractedData.summary || '';
            await student.save();
            return res.status(200).json({
                success: true,
                message: "CV uploaded and AI extraction Success.",
                student,
            });

        } catch (aiError) {
            console.error("AI extraction failed:", aiError.message);
            await student.save();

            return res.status(200).json({
                success: true,
                message: "CV uploaded but skill extraction failed. Please try again or contact support.",
                student,
                error: "AI_EXTRACTION_FAILED",
                errorDetails: aiError.message
            });
        }

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

router.get("/recommendations/:email", async (req, res) => {
    try {
        const student = await Student.findOne({ email: req.params.email });
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        if (!student.extractedSkills || student.extractedSkills.length === 0) {
            return res.status(200).json({
                success: true,
                recommendations: [],
                studentSkills: [],
                message: "Please upload your CV to get recommendations"
            });
        }

        const activeInternships = await Internship.find({ isActive: true });

        if (!activeInternships || activeInternships.length === 0) {
            return res.status(200).json({
                success: true,
                recommendations: [],
                studentSkills: student.extractedSkills,
                message: "No active internships available at the moment"
            });
        }

        const appliedApplications = await Application.find({
            studentId: student._id
        }).select('internshipId');

        const appliedInternshipIds = appliedApplications.map(app => app.internshipId.toString());

        const availableInternships = activeInternships.filter(
            internship => !appliedInternshipIds.includes(internship._id.toString())
        );

        if (availableInternships.length === 0) {
            return res.status(200).json({
                success: true,
                recommendations: [],
                studentSkills: student.extractedSkills,
                message: "You have applied to all available internships"
            });
        }

        const studentSkills = student.extractedSkills.map(s => s.toLowerCase().trim());

        const recommendations = availableInternships
            .map(internship => {
                const requiredSkills = (internship.requiredSkills || [])
                    .map(s => s.toLowerCase().trim())
                    .filter(s => s.length > 0);

                if (requiredSkills.length === 0) {
                    return null;
                }

                const matchingSkills = requiredSkills.filter(reqSkill =>
                    studentSkills.some(stuSkill => {
                        // Exact match
                        if (stuSkill === reqSkill) return true;
                        // Partial match
                        if (stuSkill.includes(reqSkill) || reqSkill.includes(stuSkill)) return true;
                        // Word match
                        const reqWords = reqSkill.split(/\s+/);
                        const stuWords = stuSkill.split(/\s+/);
                        return reqWords.some(rw => stuWords.some(sw => sw === rw || sw.includes(rw) || rw.includes(sw)));
                    })
                );

                // Find missing skills
                const missingSkills = requiredSkills.filter(reqSkill =>
                    !matchingSkills.includes(reqSkill)
                );

                // Calculate match score
                const matchScore = Math.round((matchingSkills.length / requiredSkills.length) * 100);


                if (matchScore === 0) {
                    return null;
                }


                return {
                    internshipId: {
                        _id: internship._id,
                        title: internship.title,
                        company: internship.company,
                        image: internship.image || null,
                        requiredSkills: internship.requiredSkills
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
            .filter(rec => rec !== null)
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 8);

        // Response
        res.status(200).json({
            success: true,
            recommendations: recommendations,
            studentSkills: student.extractedSkills,
            message: recommendations.length === 0
                ? "Your skills are saved. We'll notify you when new internships match your profile."
                : `Found ${recommendations.length} matching internship(s)`
        });

    } catch (err) {
        console.error("Error fetching recommendations:", err);
        res.status(500).json({
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

        // CV.... data clear
        student.cvUrl = undefined;
        student.cvFeedback = undefined;
        student.extractedSkills = [];
        student.education = [];
        student.experience = [];
        student.professionalSummary = undefined;

        await student.save();

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

export default router;