// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import studentRoutes from "./student/routes/studentRoutes.js";
// import aiRoutes from "./student/routes/aiRoutes.js";
// import postRoutes from "./industry/routes/postRoutes.js";
// import mouRoutes from "./industry/routes/IndustryMouRoutes.js";
// import industryAiRoutes from "./industry/routes/industryAiroutes.js";
// import eventRoutes from "./industry/routes/Eventroutes.js";
// import industryRoutes from "./student/routes/industryRoutes.js"
// import cxbotRoutes from "./industry/routes/Cxbotroutes.js";
// import ratingRoutes from "./student/routes/Ratingroute.js";

// import cxbot from "./student/routes/Cxbot.route.js";


// import internshipRoutes from "./student/routes/internshipRoutes.js";



// // import eventRoutes from "./student/routes/EventRoutes.js";

// import studentEventRoutes from "./student/routes/EventRoutes.js";
// import applicationRoutes from "./student/routes/Applicationroutes.js";
// import feedbackRoutes from "./student/routes/FeedbackRoutes.js";
// import notificationRoutes from "./student/routes/NotificationRoutes.js";








// import dotenv from "dotenv";
// dotenv.config();








// console.log("🚀 GEMINI KEY LOADED:", process.env.GEMINI_KEY);

// const app = express();


// app.use(express.json());
// app.use(cors());


// app.use("/uploads", express.static("uploads"));
// app.use("/uploads/profile", express.static("uploads/profile"));
// app.use("/uploads/cv", express.static("uploads/cv"));

// // ✅ NAYA - YEH 3 LINES LAGAO
// // app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// // app.use("/uploads/profile", express.static(path.join(__dirname, "uploads/profile")));
// // app.use("/uploads/cv", express.static(path.join(__dirname, "uploads/cv")));

// // app.use("/uploads", express.static(path.resolve("uploads")));
// // ✅ NAYA - absolute path do directly
// // app.use("/uploads", express.static("/Users/sabahatqadeer/Documents/FYP Project/CollaXion-App/backend/uploads"));

// app.use("/api/industry/mous", mouRoutes);
// // student nearby industry 
//  app.use('/api/industries', industryRoutes);
// app.use("/api/industry/posts", postRoutes);
// app.use("/api/industry/events", eventRoutes);
// app.use("/api/ai", industryAiRoutes);
// app.use("/api/cxbot", cxbotRoutes);

// app.use("/api/student-assistant", cxbot);

// app.use("/api/student", ratingRoutes);



// app.use("/api/internships", internshipRoutes);
// app.use("/api/applications", applicationRoutes);
// app.use("/api/feedback", feedbackRoutes);
// app.use("/api/notifications", notificationRoutes);

// app.use("/api/events", studentEventRoutes);








// // MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected Successfully"))
//   .catch((err) => console.log(err));

// // Routes
// app.use("/api/student", studentRoutes);

// app.use("/api/ai", aiRoutes);
// // Root endpoint
// app.get("/", (req, res) => {
//   res.json({ message: "Server is running", endpoints: ["/api/student", "/api/ai"] });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   const baseUrl = `http://localhost:${PORT}`;
//   console.log("\n" + "=".repeat(50));
//   console.log(`Server is running!`);
//   console.log("=".repeat(50));
//   console.log(` Server URL: ${baseUrl}`);
//   console.log("\n Available Endpoints:");
//   console.log(`   • GET  ${baseUrl}/`);
//   console.log(`   • POST ${baseUrl}/api/student/register`);
//   console.log(`   • POST ${baseUrl}/api/student/login`);
//   console.log(`   • POST ${baseUrl}/api/student/verify`);
//   console.log(`   • GET  ${baseUrl}/api/student/getStudent/:email`);
//   console.log(`   • PUT  ${baseUrl}/api/student/updateProfile`);
//   console.log(`   • POST ${baseUrl}/api/student/upload-cv/:email`);
//   console.log(`   • GET  ${baseUrl}/api/student/recommendations/:email`);
//   console.log(`   • POST ${baseUrl}/api/student/apply-internship`);
//   console.log(`   • GET  ${baseUrl}/api/student/my-applications/:email`);

//   console.log("=".repeat(50) + "\n");
// });




import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer } from "ws"; // ✅ npm install ws

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

wss.on("connection", (ws, req) => {
    const url = new URL(req.url, "http://localhost");
    const email = url.searchParams.get("email") || "";
    console.log("WS connected:", email);

    if (!clients.has(email)) clients.set(email, new Set());
    clients.get(email).add(ws);

    // ws.on("message", async (raw) => {
    //     try {
    //         const { event, data } = JSON.parse(raw.toString());

    //         if (event === "sendMessage") {
    //             const { senderEmail, senderName, receiverEmail, text } = data;
    //             if (!senderEmail || !receiverEmail || !text?.trim()) return;

    //             const roomId = Message.getRoomId(senderEmail, receiverEmail);
    //             const message = new Message({
    //                 roomId,
    //                 senderEmail,
    //                 senderName,
    //                 receiverEmail,
    //                 text: text.trim(),
    //             });
    //             await message.save();

    //             broadcast(receiverEmail, { event: "newMessage", data: message });
    //             broadcast(senderEmail, { event: "newMessage", data: message });
    //         }

    //         if (event === "typing") {
    //             const { senderEmail, receiverEmail, isTyping } = data;
    //             broadcast(receiverEmail, { event: "typingStatus", data: { senderEmail, isTyping } });
    //         }
    //     } catch (err) {
    //         console.error("WS message error:", err);
    //     }
    // });



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
                // senderName: senderName || senderEmail.split("@")[0], // ✅ fallback added

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

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static("uploads"));
app.use("/uploads/profile", express.static("uploads/profile"));
app.use("/uploads/cv", express.static("uploads/cv"));

// ── All existing routes (untouched) ──
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

// MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((err) => console.log(err));

app.use("/api/student", studentRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log("\n" + "=".repeat(50));
    console.log(`Server running on port ${PORT}`);
    console.log(`WS endpoint: ws://localhost:${PORT}/ws?email=...`);
    console.log("=".repeat(50) + "\n");
});