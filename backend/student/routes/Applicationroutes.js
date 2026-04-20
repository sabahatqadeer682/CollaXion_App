import express from "express";
import Application from "../models/Application.js";
// import Internship from "../models/Internship.js";
import Internship from "../models/Internship.js";

const router = express.Router();

// GET all applications for a student
router.get("/:email", async (req, res) => {
  try {
    const applications = await Application.find({ studentEmail: req.params.email })
      .populate("internshipId")
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single application status
router.get("/status/:id", async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate("internshipId");
    if (!app) return res.status(404).json({ error: "Not found" });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;