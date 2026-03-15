import express from "express";
import multer from "multer";
import { analyzeCV } from "../controllers/aiController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/analyze-cv", upload.single("cv"), analyzeCV);

export default router;
