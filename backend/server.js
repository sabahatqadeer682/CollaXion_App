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
import Student from "./student/models/Student.js";
import industryApplicationRoutes from "./industry/routes/Industryapplicationroutes.js";
import industryAuthRoutes from "./industry/routes/industryAuthRoutes.js";
import industryNotificationRoutes from "./industry/routes/IndustryNotificationRoutes.js";

import dotenv from "dotenv";
dotenv.config();

console.log("GEMINI KEY LOADED:", process.env.GEMINI_KEY);

const app = express();
const httpServer = createServer(app);

// ── Native WebSocket server (path: /ws) ──
const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

// email -> Set of open WebSocket connections
const clients = new Map();
// industry name (lowercased) -> Set of { ws, email }
const industryClients = new Map();
// Every industry-side WS connection (regardless of name/email) — used for
// "fan out to ALL industry users" broadcasts.
const industryAllClients = new Set(); // entries: { ws, email, industry }

const normIndustry = (s) => (s || "").trim().toLowerCase();

const broadcast = (email, payload) => {
    const targets = clients.get(email);
    if (!targets) return;
    const msg = JSON.stringify(payload);
    targets.forEach((ws) => {
        if (ws.readyState === 1) ws.send(msg);
    });
};

// Find any connected industry user that matches the given industry NAME.
// Returns the first matching email (so we can persist a notification keyed
// by email even when the liaison didn't fill industryContact.email).
const findEmailByIndustry = (industryName) => {
    const set = industryClients.get(normIndustry(industryName));
    if (!set || set.size === 0) return "";
    for (const entry of set) return entry.email; // first match
    return "";
};

// Broadcast to all WS connections registered under the industry NAME.
const broadcastToIndustry = (industryName, payload) => {
    const set = industryClients.get(normIndustry(industryName));
    if (!set) return 0;
    const msg = JSON.stringify(payload);
    let n = 0;
    set.forEach(({ ws }) => {
        if (ws.readyState === 1) { ws.send(msg); n++; }
    });
    return n;
};

// Fan out to EVERY connected industry-side client.
const broadcastToAllIndustry = (payload) => {
    const msg = JSON.stringify(payload);
    let n = 0;
    industryAllClients.forEach(({ ws }) => {
        if (ws.readyState === 1) { ws.send(msg); n++; }
    });
    return n;
};

// All currently-connected industry emails (deduped, non-empty).
const listIndustryEmails = () => {
    const set = new Set();
    industryAllClients.forEach(({ email }) => { if (email) set.add(email); });
    return [...set];
};

// Make broadcast helpers available to REST route handlers
app.locals.broadcast = broadcast;
app.locals.broadcastToIndustry = broadcastToIndustry;
app.locals.broadcastToAllIndustry = broadcastToAllIndustry;
app.locals.findEmailByIndustry = findEmailByIndustry;
app.locals.listIndustryEmails = listIndustryEmails;

// Helper: list of currently online emails (deduped)
const listOnlineEmails = () => Array.from(clients.keys());
app.locals.listOnlineEmails = listOnlineEmails;
app.locals.isOnline = (email) => clients.has(email);

// Broadcast presence change to ALL connected clients
const broadcastPresence = (email, isOnline, lastActive) => {
    const payload = JSON.stringify({
        event: "presence",
        data: { email, online: isOnline, lastActive },
    });
    clients.forEach((set) => {
        set.forEach((ws) => {
            if (ws.readyState === 1) ws.send(payload);
        });
    });
};

wss.on("connection", (ws, req) => {
    const url = new URL(req.url, "http://localhost");
    const email = url.searchParams.get("email") || "";
    const industry = url.searchParams.get("industry") || "";
    const role = url.searchParams.get("role") || "";
    console.log("WS connected:", email, industry ? `(${industry})` : "", role ? `[${role}]` : "");

    const wasOffline = !clients.has(email);
    if (!clients.has(email)) clients.set(email, new Set());
    clients.get(email).add(ws);

    // ── Presence: notify others that this user is online (only on first connection) ──
    if (email && wasOffline) {
        broadcastPresence(email, true, new Date());
        // Send currently online list snapshot to the new connection
        if (ws.readyState === 1) {
            ws.send(
                JSON.stringify({
                    event: "presenceSnapshot",
                    data: { onlineEmails: listOnlineEmails() },
                })
            );
        }
    }

    if (industry) {
        const key = normIndustry(industry);
        if (!industryClients.has(key)) industryClients.set(key, new Set());
        industryClients.get(key).add({ ws, email });
    }

    // Treat any connection that identifies as industry (via role or
    // industry param) as belonging to the global industry channel.
    const isIndustrySide = role === "industry" || !!industry;
    const allEntry = { ws, email, industry };
    if (isIndustrySide) industryAllClients.add(allEntry);

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

            // ── Call signaling (WebRTC handshake relay) ──
            if (event === "callOffer") {
                // { fromEmail, fromName, toEmail, callType, sdp }
                broadcast(data.toEmail, { event: "incomingCall", data });
            }
            if (event === "callAnswer") {
                // { fromEmail, toEmail, sdp }
                broadcast(data.toEmail, { event: "callAccepted", data });
            }
            if (event === "callIce") {
                // { fromEmail, toEmail, candidate }
                broadcast(data.toEmail, { event: "callIce", data });
            }
            if (event === "callDecline") {
                broadcast(data.toEmail, { event: "callDeclined", data });
            }
            if (event === "callEnd") {
                broadcast(data.toEmail, { event: "callEnded", data });
            }
            if (event === "callCancel") {
                broadcast(data.toEmail, { event: "callCancelled", data });
            }
        } catch (err) {
            console.error("WS message error:", err);
        }
    });

    ws.on("close", async () => {
        const set = clients.get(email);
        let nowOffline = false;
        if (set) {
            set.delete(ws);
            if (set.size === 0) {
                clients.delete(email);
                nowOffline = true;
            }
        }

        // Persist lastActive + broadcast presence change when no more connections
        if (email && nowOffline) {
            const lastActive = new Date();
            try {
                await Student.updateOne({ email }, { $set: { lastActive } });
            } catch (e) {
                /* ignore non-students */
            }
            broadcastPresence(email, false, lastActive);
        }

        if (industry) {
            const key = normIndustry(industry);
            const iset = industryClients.get(key);
            if (iset) {
                for (const entry of iset) {
                    if (entry.ws === ws) { iset.delete(entry); break; }
                }
                if (iset.size === 0) industryClients.delete(key);
            }
        }
        if (isIndustrySide) industryAllClients.delete(allEntry);
        console.log("WS disconnected:", email);
    });

    ws.on("error", (err) => console.error("WS error:", err));
});

// Profile / chat images are sent as base64 data URIs — bump the body limit
// well above the default 100kb so uploads don't silently 413.
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));
app.use(cors());

// Static uploads with byte-range support for smooth video streaming
app.use(
    "/uploads",
    express.static("uploads", {
        acceptRanges: true,
        cacheControl: true,
        maxAge: "1h",
        setHeaders: (res, filePath) => {
            if (/\.(mp4|mov|m4v|webm|3gp|mkv)$/i.test(filePath)) {
                res.setHeader("Accept-Ranges", "bytes");
                res.setHeader("Cache-Control", "public, max-age=3600");
            }
        },
    })
);
app.use("/uploads/profile", express.static("uploads/profile"));
app.use("/uploads/cv", express.static("uploads/cv"));

// Explicit streaming endpoint for chat videos — guarantees Range requests work
import fs from "fs";
import pathMod from "path";
app.get("/stream/chat/:filename", (req, res) => {
    try {
        const filePath = pathMod.join(process.cwd(), "uploads", "chat", req.params.filename);
        if (!fs.existsSync(filePath)) return res.status(404).send("Not found");
        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range;
        const ext = pathMod.extname(filePath).slice(1).toLowerCase();
        const mime =
            ext === "mov" ? "video/quicktime" :
            ext === "webm" ? "video/webm" :
            ext === "mkv" ? "video/x-matroska" :
            "video/mp4";

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = end - start + 1;
            res.writeHead(206, {
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize,
                "Content-Type": mime,
                "Cache-Control": "public, max-age=3600",
            });
            fs.createReadStream(filePath, { start, end }).pipe(res);
        } else {
            res.writeHead(200, {
                "Content-Length": fileSize,
                "Content-Type": mime,
                "Accept-Ranges": "bytes",
                "Cache-Control": "public, max-age=3600",
            });
            fs.createReadStream(filePath).pipe(res);
        }
    } catch (err) {
        console.error("Video stream error:", err);
        res.status(500).send("Stream error");
    }
});

app.use("/api/industry/auth", industryAuthRoutes);   // must be before /api/industry/*
app.use("/api/industry/notifications", industryNotificationRoutes);
app.use("/api/industry/mous", mouRoutes);
// Alias for the web admin (Industry Liaison Incharge) which posts to /api/mous
app.use("/api/mous", mouRoutes);
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
