// // ============================================================
// //  routes/cxbot.js  —  CXbot backend with Gemini AI
// //  Install: npm install @google/generative-ai
// //  .env:    GEMINI_KEY=your_gemini_api_key_here
// // ============================================================

// const express = require("express");
// const router = express.Router();
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const Student = require("../models/Student"); // adjust path if needed

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// // ── System Prompt for CXbot ──────────────────────────────────
// const SYSTEM_PROMPT = `You are CXbot, the official AI assistant of CollaXion — a smart internship management platform for university students.

// Your role:
// - Help students find and apply for internships
// - Guide them through the app features
// - Give CV / career advice
// - Answer questions about the CollaXion platform
// - Be friendly, concise, and encouraging

// App features you know about:
// - Browse Internships: Filter and apply for internships
// - AI Recommendations: Get AI-matched internship suggestions based on CV skills
// - My Applications: Track application status (Pending → Under Review → Shortlisted → Approved/Rejected)
// - Events: Job fairs, seminars, workshops
// - Nearby Industries: Map-based company discovery
// - Profile Settings: Update info, upload CV (PDF), view AI feedback and extracted skills
// - Feedback & Ratings: Rate companies after internships
// - Notifications: Application updates, event reminders, new matches

// Key guidance:
// - To upload CV: Profile Settings → "Upload CV (PDF)"
// - To apply: Browse Internships → Select → Apply Now
// - CV upload triggers automatic AI skill extraction and personalized recommendations

// Response style:
// - Keep responses under 200 words unless detailed help is needed
// - Use emojis sparingly for friendliness (1-3 per message)
// - Use bullet points for multi-step instructions
// - Always be encouraging and supportive
// - If unsure, suggest the student contact their university coordinator
// - Respond in the same language the student uses (Urdu, English, or mix)`;

// // ── POST /api/cxbot/chat ──────────────────────────────────────
// router.post("/chat", async (req, res) => {
//     try {
//         const { message, studentEmail } = req.body;

//         if (!message || message.trim().length === 0) {
//             return res.status(400).json({ error: "Message is required" });
//         }

//         // Optional: Fetch student context to personalize responses
//         let studentContext = "";
//         if (studentEmail) {
//             try {
//                 const student = await Student.findOne({ email: studentEmail });
//                 if (student) {
//                     studentContext = `\n\nCurrent student info (use to personalize):
// - Name: ${student.fullName || "Student"}
// - Skills: ${student.extractedSkills?.join(", ") || "None uploaded yet"}
// - CV uploaded: ${student.cvUrl ? "Yes" : "No"}
// - Applications: ${student.totalApplications || 0}
// - Selected: ${student.selectedInternships || 0}`;
//                 }
//             } catch (err) {
//                 // Non-critical - continue without context
//                 console.log("Student context fetch failed (non-critical):", err.message);
//             }
//         }

//         const fullSystemPrompt = SYSTEM_PROMPT + studentContext;

//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//         const chat = model.startChat({
//             history: [],
//             generationConfig: {
//                 maxOutputTokens: 512,
//                 temperature: 0.7,
//             },
//         });

//         // Prepend system context as first turn
//         const prompt = `${fullSystemPrompt}\n\nStudent asks: ${message}`;
//         const result = await chat.sendMessage(prompt);
//         const reply = result.response.text();

//         res.json({ reply });

//     } catch (error) {
//         console.error("CXbot Gemini Error:", error);

//         // Friendly fallback if Gemini fails
//         res.status(500).json({
//             reply: "⚠️ I'm having a moment! Please try again shortly. In the meantime, you can explore the app menu or contact your coordinator for help. 😊",
//         });
//     }
// });

// module.exports = router;



// // ============================================================
// // routes/cxbot.js — Simple Gemini Chat (Stable Version)
// // ============================================================

// const express = require("express");
// const router = express.Router();
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// // Load env key
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// // ─────────────────────────────────────────────
// // POST /api/cxbot/chat
// // ─────────────────────────────────────────────
// router.post("/chat", async (req, res) => {
//     try {
//         const { message } = req.body;

//         // Validate input
//         if (!message || message.trim() === "") {
//             return res.status(400).json({
//                 error: "Message is required"
//             });
//         }

//         // Get model
//         const model = genAI.getGenerativeModel({
//             model: "gemini-1.5-flash"
//         });

//         // Send request to Gemini
//         const result = await model.generateContent({
//             contents: [
//                 {
//                     role: "user",
//                     parts: [
//                         {
//                             text: message
//                         }
//                     ]
//                 }
//             ]
//         });

//         const reply = result.response.text();

//         // Send response
//         res.json({ reply });

//     } catch (error) {
//         console.error("Gemini API Error:", error.response?.data || error.message);

//         res.status(500).json({
//             reply: "⚠️ Sorry, I’m having trouble responding right now. Please try again in a moment."
//         });
//     }
// });

// module.exports = router;

// ============================================================
//  industry/routes/Cxbotroutes.js
//  ✅ ES Module syntax (import/export) — matches your server.js
//  npm install @google/generative-ai  (if not already installed)
//  .env → GEMINI_KEY=your_key_here
// ============================================================
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// ── System prompt for CXbot ──────────────────────────────────
const SYSTEM_PROMPT = `You are CXbot, the friendly AI assistant of CollaXion — a smart internship management platform for university students in Pakistan.

Your job:
- Help students find and apply for internships
- Guide them through CollaXion app features
- Give CV and career advice
- Answer questions in a friendly, encouraging tone
- Respond in the same language the student uses (English, Urdu, or Roman Urdu)

App features you know:
- Browse Internships → filter by domain/skills, tap Apply Now
- AI Recommendations → upload CV first, then get matched internships
- My Applications → track status: Pending → Under Review → Shortlisted → Approved/Rejected
- Events → job fairs, seminars, workshops with registration
- Nearby Industries → map-based company discovery
- Profile Settings → update info, upload CV (PDF), view AI feedback & extracted skills
- Feedback & Ratings → rate companies after internship
- Notifications → application updates, event reminders, new matches

Rules:
- Keep replies under 180 words unless step-by-step help is needed
- Use bullet points for instructions
- Be warm and encouraging — students are early in their careers
- If you don't know something, say so honestly and suggest contacting their coordinator`;

// ── POST /chat ──────────────────────────────────
router.post("/chat", async (req, res) => {
    console.log("🔥 CXBOT ROUTE HIT");
    try {
        const { message, studentEmail } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ error: "Message is required" });
        }

        // ── Student context ─────────────────────────────
        let studentContext = "";

        if (studentEmail) {
            try {
                const { default: Student } = await import("../../student/models/Student.js");
                const student = await Student.findOne({ email: studentEmail }).lean();

                if (student) {
                    studentContext = `\n\nStudent context:
- Name: ${student.fullName || "Student"}
- Skills: ${student.extractedSkills?.join(", ") || "none yet"}
- CV uploaded: ${student.cvUrl ? "yes" : "no"}
- Applications: ${student.totalApplications || 0}
- Selected: ${student.selectedInternships || 0}`;
                }
            } catch (err) {
                console.log("Student context error:", err.message);
            }
        }

        // ── Gemini AI CALL (FIXED FORMAT) ─────────────────
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const prompt = `${SYSTEM_PROMPT}${studentContext}\n\nStudent says: ${message}`;

        // ✅ FIXED (string prompt is correct for flash model)
        const result = await model.generateContent(prompt);

        const response = await result.response;
        const reply = response.text();

        res.json({ reply });

    } catch (error) {
        console.error("CXbot Gemini error:", error.message || error);

        res.status(500).json({
            reply: "⚠️ CXbot is temporarily unavailable. Please try again 😊",
        });
    }
});

export default router;