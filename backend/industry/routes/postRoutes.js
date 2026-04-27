// industry/routes/postRoutes.js
//
// Mount karo server.js mein:
//   import postRoutes from "./industry/routes/postRoutes.js";
//   app.use("/api/industry/posts", postRoutes);

import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import Post from "../models/Post.js";
import IndustryNotification from "../models/IndustryNotification.js";

const router = express.Router();

// ─── Banner persistence helpers ──────────────────────────────
// Posts arrive with `poster` as a `data:image/...;base64,...` string from the
// app. Storing megabytes of base64 inside MongoDB makes documents huge and the
// React Native <Image/> component can't reliably re-render very long data URIs
// after a process restart, so banners "disappear" on next login. We decode the
// base64 once on save, write a real file under uploads/banners/, and persist
// only the served URL on the document.
const bannerDir = "uploads/banners/";
if (!fs.existsSync(bannerDir)) fs.mkdirSync(bannerDir, { recursive: true });

const persistPoster = (poster, req) => {
  if (!poster || typeof poster !== "string") return poster ?? null;
  const m = poster.match(/^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!m) return poster; // already a URL or unknown format — leave alone
  const ext = (m[1] || "jpg").toLowerCase().replace("jpeg", "jpg");
  const buf = Buffer.from(m[2], "base64");
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
  fs.writeFileSync(path.join(bannerDir, filename), buf);
  return `${req.protocol}://${req.get("host")}/uploads/banners/${filename}`;
};

// ─── simple auth middleware ───────────────────────────────────
// Aapke existing server mein JWT middleware hai toh us se replace kar lein.
// Abhi ke liye header se industryId + companyName read karta hai.
// React Native side se har request mein bhejein:
//   headers: { "x-industry-id": user._id, "x-company-name": user.name }
const getIndustry = (req, res, next) => {
  const id   = req.headers["x-industry-id"];
  const name = req.headers["x-company-name"] || "Unknown Company";
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(401).json({ message: "Industry ID header missing or invalid" });
  }
  req.industryId   = id;
  req.companyName  = name;
  next();
};

// ─────────────────────────────────────────────────────────────
// GET /api/industry/posts
// Feed — sab active posts, newest first
// Query params: type=Internship|Project|Workshop, page, limit
// ─────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;

    const filter = { isActive: true };
    if (type && ["Internship", "Project", "Workshop"].includes(type)) {
      filter.type = type;
    }

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate("postedBy", "name logo email"); // Industry model ke fields

    const total = await Post.countDocuments(filter);

    res.json({
      posts,
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/industry/posts/mine
// Logged-in industry ki apni posts
// ─────────────────────────────────────────────────────────────
router.get("/mine", getIndustry, async (req, res) => {
  try {
    // Match by industry id OR company name. The app's industry "_id" can drift
    // across sessions (default user, profile discovery), so a strict ObjectId
    // match would orphan older posts. Falling back to `company` keeps every
    // post the industry has ever made visible on the dashboard / MyPosts.
    const filter = {
      $or: [
        { postedBy: req.industryId },
        ...(req.companyName ? [{ company: req.companyName }] : []),
      ],
    };
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/industry/posts/:id
// Single post detail
// ─────────────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("postedBy", "name logo email");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/industry/posts
// Naya post create karo
// Body: { type, title, description, skills[], stipend, duration,
//         seats, deadline, location, mode, poster }
// ─────────────────────────────────────────────────────────────
router.post("/", getIndustry, async (req, res) => {
  try {
    const {
      type, title, description, skills,
      stipend, duration, seats, deadline,
      location, mode, poster,
    } = req.body;

    if (!type || !title || !description) {
      return res.status(400).json({ message: "type, title and description are required" });
    }

    const post = await Post.create({
      type,
      title:       title.trim(),
      description: description.trim(),
      skills:      Array.isArray(skills) ? skills : [],
      stipend:     stipend  || "",
      duration:    duration || "",
      seats:       seats    || "",
      deadline:    deadline || "",
      location:    location || "",
      mode:        mode     || "Onsite",
      poster:      persistPoster(poster, req),
      postedBy:    req.industryId,
      company:     req.companyName,
    });

    // Populate kar ke wapas bhejo taake front-end ko company info milti rahe
    await post.populate("postedBy", "name logo email");

    // Push real-time event to all connected sessions of this industry so the
    // dashboard "Your Posts" list updates without manual refresh.
    try {
      req.app.locals.broadcastToIndustry?.(req.companyName, {
        event: "newPost",
        data: post,
      });
    } catch (_) {}

    // Persist + push a "Post Created" notification so it shows up in the
    // industry's bell dropdown (and the unread badge bumps instantly).
    try {
      const industryEmail = (req.headers["x-industry-email"] || "").toString().trim();
      if (industryEmail) {
        const note = await IndustryNotification.create({
          industryEmail,
          title:   "Post Created",
          message: `Your ${type} "${post.title}" is now live.`,
          type:    "general",
          meta:    { postId: post._id, postType: type },
        });
        req.app.locals.broadcast?.(industryEmail, {
          event: "newNotification",
          data: note,
        });
      }
    } catch (e) {
      console.error("Post-create notification failed:", e?.message);
    }

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// PUT /api/industry/posts/:id
// Post update (sirf wahi industry jo owner hai)
// ─────────────────────────────────────────────────────────────
router.put("/:id", getIndustry, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.postedBy.toString() !== req.industryId) {
      return res.status(403).json({ message: "You can only update your own posts" });
    }

    const allowed = [
      "title", "description", "skills", "stipend", "duration",
      "seats", "deadline", "location", "mode", "poster", "isActive",
    ];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        post[field] = field === "poster"
          ? persistPoster(req.body.poster, req)
          : req.body[field];
      }
    });

    // await post.save();
    // res.json(post);
//     post.updatedAt = new Date();
// await post.save();
// const updated = await Post.findById(post._id);
// res.json(updated);


post.updatedAt = new Date();
await post.save();

try {
  req.app.locals.broadcastToIndustry?.(req.companyName, {
    event: "postUpdated",
    data: post,
  });
} catch (_) {}

res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// DELETE /api/industry/posts/:id
// Post delete (sirf owner)
// ─────────────────────────────────────────────────────────────
router.delete("/:id", getIndustry, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.postedBy.toString() !== req.industryId) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// PATCH /api/industry/posts/:id/toggle
// Post active/inactive toggle (soft delete)
// ─────────────────────────────────────────────────────────────
router.patch("/:id/toggle", getIndustry, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.postedBy.toString() !== req.industryId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    post.isActive = !post.isActive;
    await post.save();
    res.json({ message: `Post ${post.isActive ? "activated" : "hidden"}`, isActive: post.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;