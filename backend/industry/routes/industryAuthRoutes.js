import express from "express";
import { getProfile, updateProfile } from "../controller/profileController.js";

const router = express.Router();

// GET  /api/industry/auth/profile?email=xxx
router.get("/profile", getProfile);

// PUT  /api/industry/auth/profile
router.put("/profile", updateProfile);

export default router;