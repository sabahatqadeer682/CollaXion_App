import express from "express";
import { getAnyProfile, getProfile, updateProfile } from "../controller/profileController.js";

const router = express.Router();

// GET  /api/industry/auth/profile/any
// Must come BEFORE the parameterless /profile so Express doesn't treat
// "any" as the profile email.
router.get("/profile/any", getAnyProfile);

// GET  /api/industry/auth/profile?email=xxx
router.get("/profile", getProfile);

// PUT  /api/industry/auth/profile
router.put("/profile", updateProfile);

export default router;