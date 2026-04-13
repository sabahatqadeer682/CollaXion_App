// industry/routes/postRoutes.js
//
// Mount karo server.js mein:
//   import postRoutes from "./industry/routes/postRoutes.js";
//   app.use("/api/industry/posts", postRoutes);

import express from "express";
import mongoose from "mongoose";
import Post from "../models/Post.js";

const router = express.Router();

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
    const posts = await Post.find({ postedBy: req.industryId }).sort({ createdAt: -1 });
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
      return res.status(400).json({ message: "type, title aur description zaroori hain" });
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
      poster:      poster   || null,
      postedBy:    req.industryId,
      company:     req.companyName,
    });

    // Populate kar ke wapas bhejo taake front-end ko company info milti rahe
    await post.populate("postedBy", "name logo email");

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
      return res.status(403).json({ message: "Sirf apni post update kar sakte hain" });
    }

    const allowed = [
      "title", "description", "skills", "stipend", "duration",
      "seats", "deadline", "location", "mode", "poster", "isActive",
    ];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) post[field] = req.body[field];
    });

    // await post.save();
    // res.json(post);
//     post.updatedAt = new Date();
// await post.save();
// const updated = await Post.findById(post._id);
// res.json(updated);


post.updatedAt = new Date();
await post.save();
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
      return res.status(403).json({ message: "Sirf apni post delete kar sakte hain" });
    }

    await post.deleteOne();
    res.json({ message: "Post delete ho gayi" });
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
    res.json({ message: `Post ${post.isActive ? "active" : "inactive"} kar di`, isActive: post.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;