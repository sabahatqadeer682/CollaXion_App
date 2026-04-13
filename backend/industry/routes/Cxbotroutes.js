// industry/routes/cxbotRoutes.js
// ─────────────────────────────────────────────────────────────────
// CXbot AI routes using Google Gemini
// Add to server.js:
//   import cxbotRoutes from "./industry/routes/cxbotRoutes.js";
//   app.use("/api/cxbot", cxbotRoutes);
// ─────────────────────────────────────────────────────────────────

import express from "express";
import axios from "axios";

const router = express.Router();

// ── Gemini config ─────────────────────────────────────────────────
const GEMINI_MODEL = "gemini-2.5-flash";
const getGeminiURL = () =>
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_KEY}`;

// ── CXbot system personality ──────────────────────────────────────
const SYSTEM_PROMPT = `You are CXbot, the official AI assistant for CollaXion — 
a university-industry collaboration platform in Pakistan.

Your personality:
- Professional yet friendly and helpful
- Concise (2-4 sentences unless detailed question asked)
- Knowledgeable about internships, MOUs, projects, events, student applications
- Use Pakistani university context (HEC, NUCES, NUST, COMSATS, UET, QAU, FAST etc.)
- Reply in same language user writes in — English, Urdu, or Roman Urdu
- If Roman Urdu → reply Roman Urdu, if Urdu → reply Urdu, if English → reply English

You help industry partners with:
- Posting internships, projects, workshops
- MOU workflow and status tracking
- Managing and reviewing student applications  
- Creating and managing events
- Navigating the CollaXion dashboard
- General tech/business questions related to industry-academia collaboration

CollaXion MOU statuses in order:
Draft → Sent to Industry Liaison Incharge → Under Review → Changes Proposed → Signed → Active → Expired

Keep responses helpful, short, and actionable. Never make up features that don't exist.`;

// ─────────────────────────────────────────────────────────────────
// POST /api/cxbot/chat
// Body: { messages: [{ role: "user" | "model", text: string }] }
// Returns: { reply: string }
// ─────────────────────────────────────────────────────────────────
router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    // Build Gemini contents array
    const contents = messages.map((m) => ({
      role: m.role, // "user" or "model"
      parts: [{ text: m.text }],
    }));

    const geminiBody = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents,
      generationConfig: {
        temperature:     0.7,
        maxOutputTokens: 512,
        topP:            0.9,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH",       threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
    };

    const response = await axios.post(getGeminiURL(), geminiBody, {
      headers: { "Content-Type": "application/json" },
      timeout: 0,
    });

    const candidate = response.data?.candidates?.[0];
    const reply = candidate?.content?.parts?.[0]?.text?.trim()
      || "Maafi chahta hoon, abhi response generate nahi ho saka. Dobara try karein.";

    return res.json({ reply });

  } catch (err) {
    console.error("❌ CXbot Gemini error:", err?.response?.data || err.message);
    const geminiMsg = err?.response?.data?.error?.message;
    return res.status(500).json({
      error: geminiMsg || "CXbot se response nahi mila. Server check karein.",
    });
  }
});

// ─────────────────────────────────────────────────────────────────
// GET /api/cxbot/health
// ─────────────────────────────────────────────────────────────────
router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    bot:    "CXbot",
    model:  GEMINI_MODEL,
    key:    process.env.GEMINI_KEY ? "✅ loaded" : "❌ missing",
  });
});

export default router;