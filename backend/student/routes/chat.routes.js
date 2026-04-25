// import express from "express";
// import Student from "../models/Student.js";
// import Message from "../models/Message.js";

// const router = express.Router();

// // ✅ Fixed: accepts BOTH @students.riphah.edu.pk AND @riphah.edu.pk
// const isRiphahEmail = (email = "") => {
//     const lower = email.toLowerCase();
//     return (
//         lower.endsWith("@students.riphah.edu.pk") ||
//         lower.endsWith("@riphah.edu.pk")
//     );
// };

// // ============================
// // GET all Riphah students
// // GET /api/chat/students/:myEmail
// // ============================
// router.get("/students/:myEmail", async (req, res) => {
//     try {
//         const { myEmail } = req.params;

//         if (!isRiphahEmail(myEmail)) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Only Riphah students can use the chat feature.",
//             });
//         }

//         // ✅ Fixed regex: matches both student and staff Riphah emails
//         const students = await Student.find({
//             email: {
//                 $ne: myEmail,
//                 $regex: /@(students\.)?riphah\.edu\.pk$/i,
//             },
//             verified: true,
//         }).select("fullName email profileImage department semester");

//         const studentsWithUnread = await Promise.all(
//             students.map(async (student) => {
//                 const roomId = Message.getRoomId(myEmail, student.email);
//                 const unread = await Message.countDocuments({
//                     roomId,
//                     senderEmail: student.email,
//                     receiverEmail: myEmail,
//                     isRead: false,
//                 });
//                 const lastMsg = await Message.findOne({ roomId })
//                     .sort({ createdAt: -1 })
//                     .select("text createdAt senderEmail");
//                 return {
//                     ...student.toObject(),
//                     unreadCount: unread,
//                     lastMessage: lastMsg || null,
//                 };
//             })
//         );

//         studentsWithUnread.sort((a, b) => {
//             const aTime = a.lastMessage?.createdAt || 0;
//             const bTime = b.lastMessage?.createdAt || 0;
//             return new Date(bTime) - new Date(aTime);
//         });

//         res.status(200).json({ success: true, students: studentsWithUnread });
//     } catch (err) {
//         console.error("Chat students error:", err);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// // ============================
// // GET messages in a room
// // GET /api/chat/messages/:myEmail/:otherEmail
// // ============================
// router.get("/messages/:myEmail/:otherEmail", async (req, res) => {
//     try {
//         const { myEmail, otherEmail } = req.params;

//         if (!isRiphahEmail(myEmail) || !isRiphahEmail(otherEmail)) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Only Riphah students can use chat.",
//             });
//         }

//         const roomId = Message.getRoomId(myEmail, otherEmail);

//         const messages = await Message.find({ roomId })
//             .sort({ createdAt: 1 })
//             .limit(100);

//         await Message.updateMany(
//             { roomId, receiverEmail: myEmail, isRead: false },
//             { $set: { isRead: true } }
//         );

//         res.status(200).json({ success: true, messages });
//     } catch (err) {
//         console.error("Get messages error:", err);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// // ============================
// // SEND a message (REST fallback)
// // POST /api/chat/send
// // ============================
// router.post("/send", async (req, res) => {
//     try {
//         const { senderEmail, receiverEmail, text } = req.body;

//         if (!senderEmail || !receiverEmail || !text?.trim()) {
//             return res.status(400).json({
//                 success: false,
//                 message: "senderEmail, receiverEmail, and text are required.",
//             });
//         }

//         if (!isRiphahEmail(senderEmail) || !isRiphahEmail(receiverEmail)) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Only Riphah students can use chat.",
//             });
//         }

//         const sender = await Student.findOne({ email: senderEmail }).select(
//             "fullName"
//         );
//         if (!sender) {
//             return res
//                 .status(404)
//                 .json({ success: false, message: "Sender not found." });
//         }

//         const roomId = Message.getRoomId(senderEmail, receiverEmail);

//         const message = new Message({
//             roomId,
//             senderEmail,
//             senderName: sender.fullName,
//             receiverEmail,
//             text: text.trim(),
//         });

//         await message.save();
//         res.status(201).json({ success: true, message });
//     } catch (err) {
//         console.error("Send message error:", err);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// // ============================
// // GET total unread count
// // GET /api/chat/unread/:email
// // ============================
// router.get("/unread/:email", async (req, res) => {
//     try {
//         const { email } = req.params;
//         const count = await Message.countDocuments({
//             receiverEmail: email,
//             isRead: false,
//         });
//         res.status(200).json({ success: true, count });
//     } catch (err) {
//         console.error("Unread count error:", err);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// // ============================
// // DELETE conversation
// // DELETE /api/chat/conversation/:myEmail/:otherEmail
// // ============================
// router.delete("/conversation/:myEmail/:otherEmail", async (req, res) => {
//     try {
//         const { myEmail, otherEmail } = req.params;
//         const roomId = Message.getRoomId(myEmail, otherEmail);
//         await Message.deleteMany({ roomId });
//         res.status(200).json({ success: true, message: "Conversation deleted." });
//     } catch (err) {
//         console.error("Delete conversation error:", err);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// export default router;



import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Student from "../models/Student.js";
import Message from "../models/Message.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ✅ Fixed: accepts BOTH @students.riphah.edu.pk AND @riphah.edu.pk
const isRiphahEmail = (email = "") => {
    const lower = email.toLowerCase();
    return (
        lower.endsWith("@students.riphah.edu.pk") ||
        lower.endsWith("@riphah.edu.pk")
    );
};

// ── Multer setup for chat images ──
const chatImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "uploads/chat";
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "");
        cb(null, Date.now() + "-" + safe);
    },
});

const uploadChatImage = multer({
    storage: chatImageStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowed.includes(ext)) return cb(new Error("Only images allowed"));
        cb(null, true);
    },
});

// ============================
// GET all Riphah students
// GET /api/chat/students/:myEmail
// ============================
router.get("/students/:myEmail", async (req, res) => {
    try {
        const { myEmail } = req.params;

        if (!isRiphahEmail(myEmail)) {
            return res.status(403).json({
                success: false,
                message: "Only Riphah students can use the chat feature.",
            });
        }

        // ✅ Fixed regex: matches both student and staff Riphah emails
        const students = await Student.find({
            email: {
                $ne: myEmail,
                $regex: /@(students\.)?riphah\.edu\.pk$/i,
            },
            verified: true,
        }).select("fullName email profileImage department semester");

        const studentsWithUnread = await Promise.all(
            students.map(async (student) => {
                const roomId = Message.getRoomId(myEmail, student.email);
                const unread = await Message.countDocuments({
                    roomId,
                    senderEmail: student.email,
                    receiverEmail: myEmail,
                    isRead: false,
                });
                const lastMsg = await Message.findOne({ roomId })
                    .sort({ createdAt: -1 })
                    .select("text imageUrl createdAt senderEmail");
                return {
                    ...student.toObject(),
                    unreadCount: unread,
                    lastMessage: lastMsg || null,
                };
            })
        );

        // Sort by latest message first
        studentsWithUnread.sort((a, b) => {
            const aTime = a.lastMessage?.createdAt || 0;
            const bTime = b.lastMessage?.createdAt || 0;
            return new Date(bTime) - new Date(aTime);
        });

        res.status(200).json({ success: true, students: studentsWithUnread });
    } catch (err) {
        console.error("Chat students error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ============================
// GET messages in a room
// GET /api/chat/messages/:myEmail/:otherEmail
// ============================
router.get("/messages/:myEmail/:otherEmail", async (req, res) => {
    try {
        const { myEmail, otherEmail } = req.params;

        if (!isRiphahEmail(myEmail) || !isRiphahEmail(otherEmail)) {
            return res.status(403).json({
                success: false,
                message: "Only Riphah students can use chat.",
            });
        }

        const roomId = Message.getRoomId(myEmail, otherEmail);

        const messages = await Message.find({
            roomId,
            hiddenFor: { $ne: myEmail },
        })
            .sort({ createdAt: 1 })
            .limit(100);

        // Mark messages sent to me as read
        await Message.updateMany(
            { roomId, receiverEmail: myEmail, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({ success: true, messages });
    } catch (err) {
        console.error("Get messages error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ============================
// DELETE message FOR ME (hide locally)
// POST /api/chat/message/:id/hide   body: { email }
// ============================
router.post("/message/:id/hide", async (req, res) => {
    try {
        const { id } = req.params;
        const email = req.body?.email || req.query?.email;
        if (!email) {
            return res.status(400).json({ success: false, message: "email required" });
        }
        const msg = await Message.findById(id);
        if (!msg) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }
        if (msg.senderEmail !== email && msg.receiverEmail !== email) {
            return res.status(403).json({ success: false, message: "Not your message" });
        }
        if (!msg.hiddenFor.includes(email)) {
            msg.hiddenFor.push(email);
            await msg.save();
        }
        res.status(200).json({ success: true, message: "Hidden" });
    } catch (err) {
        console.error("Hide message error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ============================
// UNSEND message FOR EVERYONE (sender only)
// POST /api/chat/message/:id/unsend   body: { email }
// (Also accepts DELETE for backward compatibility)
// ============================
const unsendHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const email = req.body?.email || req.query?.email;
        if (!email) {
            return res.status(400).json({ success: false, message: "email required" });
        }
        const msg = await Message.findById(id);
        if (!msg) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }
        if (msg.senderEmail !== email) {
            return res.status(403).json({
                success: false,
                message: "Only the sender can delete for everyone",
            });
        }
        msg.deletedForEveryone = true;
        msg.text = "";
        msg.imageUrl = null;
        await msg.save();

        const broadcast = req.app.locals.broadcast;
        if (broadcast) {
            const payload = {
                event: "messageDeleted",
                data: { _id: msg._id, roomId: msg.roomId },
            };
            broadcast(msg.senderEmail, payload);
            broadcast(msg.receiverEmail, payload);
        }

        res.status(200).json({ success: true, message: msg });
    } catch (err) {
        console.error("Delete-for-everyone error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

router.post("/message/:id/unsend", unsendHandler);
router.delete("/message/:id", unsendHandler);

// ============================
// SEND a text message (REST fallback)
// POST /api/chat/send
// ============================
router.post("/send", async (req, res) => {
    try {
        const { senderEmail, receiverEmail, text } = req.body;

        if (!senderEmail || !receiverEmail || !text?.trim()) {
            return res.status(400).json({
                success: false,
                message: "senderEmail, receiverEmail, and text are required.",
            });
        }

        if (!isRiphahEmail(senderEmail) || !isRiphahEmail(receiverEmail)) {
            return res.status(403).json({
                success: false,
                message: "Only Riphah students can use chat.",
            });
        }

        const sender = await Student.findOne({ email: senderEmail }).select("fullName");
        if (!sender) {
            return res.status(404).json({ success: false, message: "Sender not found." });
        }

        const roomId = Message.getRoomId(senderEmail, receiverEmail);
        const message = new Message({
            roomId,
            senderEmail,
            senderName: sender.fullName,
            receiverEmail,
            text: text.trim(),
        });

        await message.save();
        res.status(201).json({ success: true, message });
    } catch (err) {
        console.error("Send message error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ============================
// ✅ NEW: SEND IMAGE MESSAGE
// POST /api/chat/send-image
// ============================
router.post("/send-image", uploadChatImage.single("image"), async (req, res) => {
    try {
        const { senderEmail, senderName, receiverEmail } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded." });
        }

        if (!senderEmail || !receiverEmail) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ success: false, message: "senderEmail and receiverEmail required." });
        }

        if (!isRiphahEmail(senderEmail) || !isRiphahEmail(receiverEmail)) {
            fs.unlinkSync(req.file.path);
            return res.status(403).json({ success: false, message: "Only Riphah students can use chat." });
        }

        const imageUrl = `/uploads/chat/${req.file.filename}`;
        const roomId = Message.getRoomId(senderEmail, receiverEmail);

        const message = new Message({
            roomId,
            senderEmail,
            senderName: senderName || senderEmail.split("@")[0],
            receiverEmail,
            text: "", // no text for image msgs
            imageUrl,
        });

        await message.save();

        res.status(201).json({ success: true, message });
    } catch (err) {
        console.error("Send image error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ============================
// GET total unread count
// GET /api/chat/unread/:email
// ============================
router.get("/unread/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const count = await Message.countDocuments({
            receiverEmail: email,
            isRead: false,
        });
        res.status(200).json({ success: true, count });
    } catch (err) {
        console.error("Unread count error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ============================
// DELETE conversation
// DELETE /api/chat/conversation/:myEmail/:otherEmail
// ============================
router.delete("/conversation/:myEmail/:otherEmail", async (req, res) => {
    try {
        const { myEmail, otherEmail } = req.params;
        const roomId = Message.getRoomId(myEmail, otherEmail);
        await Message.deleteMany({ roomId });
        res.status(200).json({ success: true, message: "Conversation deleted." });
    } catch (err) {
        console.error("Delete conversation error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

export default router;