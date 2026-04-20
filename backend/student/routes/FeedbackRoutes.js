// import express from "express";
// import Feedback from "../models/Feedback.js";

// const router = express.Router();

// // POST submit feedback
// router.post("/submit", async (req, res) => {
//   try {
//     const { studentEmail, internshipId, companyName, rating, category, comment, isAnonymous } = req.body;

//     if (!studentEmail || !rating || !comment) {
//       return res.status(400).json({ error: "studentEmail, rating, and comment are required" });
//     }

//     const feedback = new Feedback({
//       studentEmail,
//       internshipId,
//       companyName,
//       rating,
//       category,
//       comment,
//       isAnonymous,
//     });
//     await feedback.save();
//     res.json({ message: "Feedback submitted successfully!", feedback });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET all feedback by student
// router.get("/student/:email", async (req, res) => {
//   try {
//     const feedbacks = await Feedback.find({ studentEmail: req.params.email })
//       .populate("internshipId", "title company")
//       .sort({ createdAt: -1 });
//     res.json(feedbacks);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET feedback for a company/internship
// router.get("/company/:name", async (req, res) => {
//   try {
//     const feedbacks = await Feedback.find({
//       companyName: { $regex: req.params.name, $options: "i" },
//       isAnonymous: false,
//     }).sort({ createdAt: -1 });
//     res.json(feedbacks);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;


import express from "express";
import Feedback from "../models/Feedback.js";

const router = express.Router();

/* =========================
   CREATE FEEDBACK
========================= */
router.post("/submit", async (req, res) => {
  try {
    const {
      studentEmail,
      internshipId,
      companyName,
      rating,
      category,
      comment,
      isAnonymous,
    } = req.body;

    if (!studentEmail || !companyName || !rating || !comment) {
      return res.status(400).json({
        error: "studentEmail, companyName, rating, comment are required",
      });
    }

    const feedback = await Feedback.create({
      studentEmail,
      internshipId: internshipId || null,
      companyName,
      rating,
      category: category || "Overall",
      comment,
      isAnonymous: isAnonymous || false,
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   GET FEEDBACK BY STUDENT
========================= */
router.get("/student/:email", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({
      studentEmail: req.params.email,
    }).sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   GET SINGLE FEEDBACK
========================= */
router.get("/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   UPDATE FEEDBACK
========================= */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.json({
      message: "Feedback updated successfully",
      feedback: updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   DELETE FEEDBACK
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Feedback.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.json({
      message: "Feedback deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   GET COMPANY FEEDBACK
========================= */
router.get("/company/:name", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({
      companyName: { $regex: req.params.name, $options: "i" },
      isAnonymous: false,
    }).sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;