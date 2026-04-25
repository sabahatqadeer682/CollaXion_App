<<<<<<< Updated upstream
=======



>>>>>>> Stashed changes
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer } from "ws";

import studentRoutes from "./student/routes/studentRoutes.js";
import aiRoutes from "./student/routes/aiRoutes.js";
import postRoutes from "./industry/routes/postRoutes.js";
import mouRoutes from "./industry/routes/IndustryMouRoutes.js";
import industryAiRoutes from "./industry/routes/industryAiroutes.js";
import eventRoutes from "./industry/routes/Eventroutes.js";
import industryRoutes from "./student/routes/industryRoutes.js";
import cxbotRoutes from "./industry/routes/Cxbotroutes.js";
import ratingRoutes from "./student/routes/Ratingroute.js";
import cxbot from "./student/routes/Cxbot.route.js";
import internshipRoutes from "./student/routes/internshipRoutes.js";
import studentEventRoutes from "./student/routes/EventRoutes.js";
import applicationRoutes from "./student/routes/Applicationroutes.js";
import feedbackRoutes from "./student/routes/FeedbackRoutes.js";
import notificationRoutes from "./student/routes/NotificationRoutes.js";
import chatRoutes from "./student/routes/chat.routes.js";
import Message from "./student/models/Message.js";
import industryApplicationRoutes from "./industry/routes/industryApplicationRoutes.js";
import industryAuthRoutes from "./industry/routes/industryAuthRoutes.js"; // ← from file 2



import industryApplicationRoutes from "./industry/routes/industryApplicationRoutes.js";

import dotenv from "dotenv";
dotenv.config();

console.log("🚀 GEMINI KEY LOADED:", process.env.GEMINI_KEY);

const app = express();
const httpServer = createServer(app);

// ── Native WebSocket server (path: /ws) ──
const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

// email -> Set of open WebSocket connections
const clients = new Map();

const broadcast = (email, payload) => {
    const targets = clients.get(email);
    if (!targets) return;
    const msg = JSON.stringify(payload);
    targets.forEach((ws) => {
        if (ws.readyState === 1) ws.send(msg);
    });
};

// Make broadcast available to REST route handlers
app.locals.broadcast = broadcast;

wss.on("connection", (ws, req) => {
    const url = new URL(req.url, "http://localhost");
    const email = url.searchParams.get("email") || "";
    console.log("WS connected:", email);

    if (!clients.has(email)) clients.set(email, new Set());
    clients.get(email).add(ws);

<<<<<<< Updated upstream
    ws.on("message", async (raw) => {
        try {
            const { event, data } = JSON.parse(raw.toString());

            if (event === "sendMessage") {
                const { senderEmail, senderName, receiverEmail, text } = data;
                if (!senderEmail || !receiverEmail || !text?.trim()) return;

                const roomId = Message.getRoomId(senderEmail, receiverEmail);
                const message = new Message({
                    roomId,
                    senderEmail,
                    senderName: senderName || senderEmail.split("@")[0],
                    receiverEmail,
                    text: text.trim(),
                });
                await message.save();

                broadcast(receiverEmail, { event: "newMessage", data: message });
                broadcast(senderEmail, { event: "newMessage", data: message });
            }

            if (event === "typing") {
                const { senderEmail, receiverEmail, isTyping } = data;
                broadcast(receiverEmail, {
                    event: "typingStatus",
                    data: { senderEmail, isTyping },
                });
            }
        } catch (err) {
            console.error("WS message error:", err);
=======
   


ws.on("message", async (raw) => {
    try {
        const { event, data } = JSON.parse(raw.toString());

        if (event === "sendMessage") {
            const { senderEmail, senderName, receiverEmail, text } = data;
            if (!senderEmail || !receiverEmail || !text?.trim()) return;

            const roomId = Message.getRoomId(senderEmail, receiverEmail);
            const message = new Message({
                roomId,
                senderEmail,
               

                senderName: senderName || senderEmail.split("@")[0],
                receiverEmail,
                text: text.trim(),
            });
            await message.save();

            broadcast(receiverEmail, { event: "newMessage", data: message });
            broadcast(senderEmail, { event: "newMessage", data: message });
>>>>>>> Stashed changes
        }
    });

    ws.on("close", () => {
        const set = clients.get(email);
        if (set) {
            set.delete(ws);
            if (set.size === 0) clients.delete(email);
        }
        console.log("WS disconnected:", email);
    });

    ws.on("error", (err) => console.error("WS error:", err));
});

<<<<<<< Updated upstream
app.use(express.json({ limit: "10mb" })); // ← limit raised for base64 logos (from file 2)
=======
// Profile / chat images are sent as base64 data URIs — bump the body limit
// well above the default 100kb so uploads don't silently 413.
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
>>>>>>> Stashed changes
app.use(cors());

app.use("/uploads", express.static("uploads"));
app.use("/uploads/profile", express.static("uploads/profile"));
app.use("/uploads/cv", express.static("uploads/cv"));

app.use("/api/industry/auth", industryAuthRoutes);   // ← NEW (must be before /api/industry/*)
app.use("/api/industry/mous", mouRoutes);
app.use("/api/industries", industryRoutes);
app.use("/api/industry/posts", postRoutes);
app.use("/api/industry/events", eventRoutes);
app.use("/api/ai", industryAiRoutes);
app.use("/api/cxbot", cxbotRoutes);
app.use("/api/student-assistant", cxbot);
app.use("/api/student", ratingRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/events", studentEventRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/industry", industryApplicationRoutes);
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
// MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((err) => console.log(err));

app.use("/api/student", studentRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Server is running",
        endpoints: ["/api/student", "/api/ai", "/api/industry/auth"],
    });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    const baseUrl = `http://localhost:${PORT}`;
    console.log("\n" + "=".repeat(50));
    console.log(`Server running on port ${PORT}`);
    console.log(`WS endpoint: ws://localhost:${PORT}/ws?email=...`);
    console.log("=".repeat(50));
    console.log(` Server URL: ${baseUrl}`);
    console.log("\n Available Endpoints:");
    console.log(`   • GET  ${baseUrl}/`);
    console.log(`   • POST ${baseUrl}/api/student/register`);
    console.log(`   • POST ${baseUrl}/api/student/login`);
    console.log(`   • POST ${baseUrl}/api/student/verify`);
    console.log(`   • GET  ${baseUrl}/api/student/getStudent/:email`);
    console.log(`   • PUT  ${baseUrl}/api/student/updateProfile`);
    console.log(`   • POST ${baseUrl}/api/student/upload-cv/:email`);
    console.log(`   • GET  ${baseUrl}/api/student/recommendations/:email`);
    console.log(`   • POST ${baseUrl}/api/student/apply-internship`);
    console.log(`   • GET  ${baseUrl}/api/student/my-applications/:email`);
    console.log(`   • GET  ${baseUrl}/api/industry/auth/profile?email=`);
    console.log(`   • PUT  ${baseUrl}/api/industry/auth/profile`);
    console.log("=".repeat(50) + "\n");
});