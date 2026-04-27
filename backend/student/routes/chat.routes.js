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

// ── Video uploader (no size limit) ──
const uploadChatVideo = multer({
    storage: chatImageStorage, // same dir
    fileFilter: (req, file, cb) => {
        const allowed = [".mp4", ".mov", ".m4v", ".webm", ".3gp", ".mkv", ".avi", ".flv", ".wmv"];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowed.includes(ext)) return cb(new Error("Only videos allowed"));
        cb(null, true);
    },
});

// ── Audio uploader (no size limit) ──
const uploadChatAudio = multer({
    storage: chatImageStorage,
    fileFilter: (req, file, cb) => {
        const allowed = [".m4a", ".mp3", ".wav", ".aac", ".ogg", ".webm"];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowed.includes(ext)) return cb(new Error("Only audio allowed"));
        cb(null, true);
    },
});

// ── Document uploader (no size limit) ──
const uploadChatDoc = multer({
    storage: chatImageStorage,
    fileFilter: (req, file, cb) => {
        const allowed = [
            ".pdf", ".doc", ".docx", ".xls", ".xlsx",
            ".ppt", ".pptx", ".txt", ".csv", ".zip", ".rar",
        ];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowed.includes(ext)) return cb(new Error("Document type not allowed"));
        cb(null, true);
    },
});

// ============================
// GET all Riphah connections (with online + last active + block info)
// GET /api/chat/students/:myEmail
// ============================
router.get("/students/:myEmail", async (req, res) => {
    try {
        const { myEmail } = req.params;

        if (!isRiphahEmail(myEmail)) {
            return res.status(403).json({
                success: false,
                message: "Only Riphah members can use the chat feature.",
            });
        }

        const me = await Student.findOne({ email: myEmail }).select("blockedEmails");
        const myBlocked = (me?.blockedEmails || []).map((e) => e.toLowerCase());

        const students = await Student.find({
            email: {
                $ne: myEmail,
                $regex: /@(students\.)?riphah\.edu\.pk$/i,
            },
            verified: true,
        }).select("fullName email profileImage department semester lastActive blockedEmails");

        const isOnlineFn = req.app.locals.isOnline || (() => false);

        const enriched = await Promise.all(
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
                    .select(
                        "text imageUrl videoUrl audioUrl documentUrl documentName callType callStatus createdAt senderEmail"
                    );

                const otherBlockedMe = (student.blockedEmails || [])
                    .map((e) => e.toLowerCase())
                    .includes(myEmail.toLowerCase());

                const obj = student.toObject();
                delete obj.blockedEmails;

                return {
                    ...obj,
                    unreadCount: unread,
                    lastMessage: lastMsg || null,
                    online: !!isOnlineFn(student.email),
                    lastActive: student.lastActive || null,
                    iBlocked: myBlocked.includes(student.email.toLowerCase()),
                    blockedMe: otherBlockedMe,
                };
            })
        );

        enriched.sort((a, b) => {
            const aTime = a.lastMessage?.createdAt || 0;
            const bTime = b.lastMessage?.createdAt || 0;
            return new Date(bTime) - new Date(aTime);
        });

        res.status(200).json({ success: true, students: enriched });
    } catch (err) {
        console.error("Chat students error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ============================
// BLOCK / UNBLOCK a user
// POST /api/chat/block      body: { myEmail, otherEmail }
// POST /api/chat/unblock    body: { myEmail, otherEmail }
// ============================
router.post("/block", async (req, res) => {
    try {
        const { myEmail, otherEmail } = req.body || {};
        if (!myEmail || !otherEmail) {
            return res.status(400).json({ success: false, message: "myEmail & otherEmail required" });
        }
        await Student.updateOne(
            { email: myEmail },
            { $addToSet: { blockedEmails: otherEmail.toLowerCase() } }
        );
        res.json({ success: true, message: "Blocked" });
    } catch (err) {
        console.error("Block error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/unblock", async (req, res) => {
    try {
        const { myEmail, otherEmail } = req.body || {};
        if (!myEmail || !otherEmail) {
            return res.status(400).json({ success: false, message: "myEmail & otherEmail required" });
        }
        await Student.updateOne(
            { email: myEmail },
            { $pull: { blockedEmails: otherEmail.toLowerCase() } }
        );
        res.json({ success: true, message: "Unblocked" });
    } catch (err) {
        console.error("Unblock error:", err);
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

        // Mark messages sent to me as read + collect their IDs to notify sender
        const unreadIds = messages
            .filter((m) => m.receiverEmail === myEmail && !m.isRead)
            .map((m) => m._id);

        if (unreadIds.length) {
            await Message.updateMany(
                { _id: { $in: unreadIds } },
                { $set: { isRead: true } }
            );

            // Broadcast read receipt to the OTHER party (sender)
            const broadcast = req.app.locals.broadcast;
            if (broadcast) {
                broadcast(otherEmail, {
                    event: "messagesRead",
                    data: {
                        roomId,
                        readerEmail: myEmail,
                        ids: unreadIds.map((id) => id.toString()),
                    },
                });
            }
        }

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

        // Block enforcement (either side)
        const receiver = await Student.findOne({ email: receiverEmail }).select("blockedEmails");
        const senderBlocks = await Student.findOne({ email: senderEmail }).select("blockedEmails");
        const receiverBlocked = (receiver?.blockedEmails || []).map((e) => e.toLowerCase());
        const senderBlocked = (senderBlocks?.blockedEmails || []).map((e) => e.toLowerCase());
        if (receiverBlocked.includes(senderEmail.toLowerCase())) {
            return res.status(403).json({ success: false, message: "You are blocked by this user." });
        }
        if (senderBlocked.includes(receiverEmail.toLowerCase())) {
            return res.status(403).json({ success: false, message: "Unblock this user to send messages." });
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
// SEND VIDEO MESSAGE
// POST /api/chat/send-video
// ============================
router.post("/send-video", uploadChatVideo.single("video"), async (req, res) => {
    try {
        const { senderEmail, senderName, receiverEmail } = req.body;
        if (!req.file) return res.status(400).json({ success: false, message: "No video uploaded" });
        if (!senderEmail || !receiverEmail) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ success: false, message: "senderEmail and receiverEmail required" });
        }
        if (!isRiphahEmail(senderEmail) || !isRiphahEmail(receiverEmail)) {
            fs.unlinkSync(req.file.path);
            return res.status(403).json({ success: false, message: "Riphah users only" });
        }

        const videoUrl = `/uploads/chat/${req.file.filename}`;
        const roomId = Message.getRoomId(senderEmail, receiverEmail);
        const message = new Message({
            roomId,
            senderEmail,
            senderName: senderName || senderEmail.split("@")[0],
            receiverEmail,
            text: "",
            videoUrl,
        });
        await message.save();

        const broadcast = req.app.locals.broadcast;
        if (broadcast) {
            broadcast(receiverEmail, { event: "newMessage", data: message });
            broadcast(senderEmail, { event: "newMessage", data: message });
        }

        res.status(201).json({ success: true, message });
    } catch (err) {
        console.error("Send video error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ============================
// SEND VOICE NOTE / AUDIO MESSAGE
// POST /api/chat/send-audio
// ============================
router.post("/send-audio", uploadChatAudio.single("audio"), async (req, res) => {
    try {
        const { senderEmail, senderName, receiverEmail, duration } = req.body;
        if (!req.file) return res.status(400).json({ success: false, message: "No audio uploaded" });
        if (!senderEmail || !receiverEmail) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ success: false, message: "senderEmail and receiverEmail required" });
        }
        if (!isRiphahEmail(senderEmail) || !isRiphahEmail(receiverEmail)) {
            fs.unlinkSync(req.file.path);
            return res.status(403).json({ success: false, message: "Riphah users only" });
        }

        const audioUrl = `/uploads/chat/${req.file.filename}`;
        const roomId = Message.getRoomId(senderEmail, receiverEmail);
        const message = new Message({
            roomId,
            senderEmail,
            senderName: senderName || senderEmail.split("@")[0],
            receiverEmail,
            text: "",
            audioUrl,
            audioDuration: Number(duration) || 0,
        });
        await message.save();

        const broadcast = req.app.locals.broadcast;
        if (broadcast) {
            broadcast(receiverEmail, { event: "newMessage", data: message });
            broadcast(senderEmail, { event: "newMessage", data: message });
        }

        res.status(201).json({ success: true, message });
    } catch (err) {
        console.error("Send audio error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ============================
// SEND DOCUMENT
// POST /api/chat/send-document
// ============================
router.post("/send-document", uploadChatDoc.single("document"), async (req, res) => {
    try {
        const { senderEmail, senderName, receiverEmail } = req.body;
        if (!req.file) return res.status(400).json({ success: false, message: "No document uploaded" });
        if (!senderEmail || !receiverEmail) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ success: false, message: "senderEmail and receiverEmail required" });
        }
        if (!isRiphahEmail(senderEmail) || !isRiphahEmail(receiverEmail)) {
            fs.unlinkSync(req.file.path);
            return res.status(403).json({ success: false, message: "Riphah users only" });
        }

        const documentUrl = `/uploads/chat/${req.file.filename}`;
        const roomId = Message.getRoomId(senderEmail, receiverEmail);
        const message = new Message({
            roomId,
            senderEmail,
            senderName: senderName || senderEmail.split("@")[0],
            receiverEmail,
            text: "",
            documentUrl,
            documentName: req.file.originalname,
            documentSize: req.file.size,
            documentMime: req.file.mimetype,
        });
        await message.save();

        const broadcast = req.app.locals.broadcast;
        if (broadcast) {
            broadcast(receiverEmail, { event: "newMessage", data: message });
            broadcast(senderEmail, { event: "newMessage", data: message });
        }

        res.status(201).json({ success: true, message });
    } catch (err) {
        console.error("Send document error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ============================
// FORWARD a message to another Riphah user (no re-upload — reuses URLs)
// POST /api/chat/forward
// body: { senderEmail, senderName, receiverEmail, sourceMessageId }
// ============================
router.post("/forward", async (req, res) => {
    try {
        const { senderEmail, senderName, receiverEmail, sourceMessageId } = req.body || {};
        if (!senderEmail || !receiverEmail || !sourceMessageId) {
            return res.status(400).json({
                success: false,
                message: "senderEmail, receiverEmail, sourceMessageId required",
            });
        }
        if (!isRiphahEmail(senderEmail) || !isRiphahEmail(receiverEmail)) {
            return res.status(403).json({ success: false, message: "Riphah users only" });
        }

        const source = await Message.findById(sourceMessageId);
        if (!source) {
            return res.status(404).json({ success: false, message: "Source message not found" });
        }

        // Block enforcement
        const receiver = await Student.findOne({ email: receiverEmail }).select("blockedEmails");
        const me = await Student.findOne({ email: senderEmail }).select("blockedEmails");
        const recvBlocks = (receiver?.blockedEmails || []).map((e) => e.toLowerCase());
        const myBlocks = (me?.blockedEmails || []).map((e) => e.toLowerCase());
        if (recvBlocks.includes(senderEmail.toLowerCase())) {
            return res.status(403).json({ success: false, message: "You are blocked by this user." });
        }
        if (myBlocks.includes(receiverEmail.toLowerCase())) {
            return res.status(403).json({ success: false, message: "Unblock this user to forward messages." });
        }

        const roomId = Message.getRoomId(senderEmail, receiverEmail);
        const message = new Message({
            roomId,
            senderEmail,
            senderName: senderName || senderEmail.split("@")[0],
            receiverEmail,
            text: source.text || "",
            imageUrl: source.imageUrl || null,
            videoUrl: source.videoUrl || null,
            audioUrl: source.audioUrl || null,
            audioDuration: source.audioDuration || 0,
            documentUrl: source.documentUrl || null,
            documentName: source.documentName || null,
            documentSize: source.documentSize || 0,
            documentMime: source.documentMime || null,
            isForwarded: true,
        });
        await message.save();

        const broadcast = req.app.locals.broadcast;
        if (broadcast) {
            broadcast(receiverEmail, { event: "newMessage", data: message });
            broadcast(senderEmail, { event: "newMessage", data: message });
        }

        res.status(201).json({ success: true, message });
    } catch (err) {
        console.error("Forward error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ============================
// LOG A CALL (after end / decline / missed)
// POST /api/chat/log-call
// body: { senderEmail, senderName, receiverEmail, callType, callStatus, duration }
// ============================
router.post("/log-call", async (req, res) => {
    try {
        const {
            senderEmail,
            senderName,
            receiverEmail,
            callType,
            callStatus,
            duration,
        } = req.body || {};
        if (!senderEmail || !receiverEmail || !callType || !callStatus) {
            return res
                .status(400)
                .json({ success: false, message: "senderEmail, receiverEmail, callType, callStatus required" });
        }
        const roomId = Message.getRoomId(senderEmail, receiverEmail);
        const message = new Message({
            roomId,
            senderEmail,
            senderName: senderName || senderEmail.split("@")[0],
            receiverEmail,
            text: "",
            callType,
            callStatus,
            callDuration: Number(duration) || 0,
        });
        await message.save();

        const broadcast = req.app.locals.broadcast;
        if (broadcast) {
            broadcast(receiverEmail, { event: "newMessage", data: message });
            broadcast(senderEmail, { event: "newMessage", data: message });
        }

        res.status(201).json({ success: true, message });
    } catch (err) {
        console.error("Log-call error:", err);
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