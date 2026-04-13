import express from "express";
import { getAIRecommendations } from "../controller/industryAiController.js";

const router = express.Router();

router.post("/recommend", getAIRecommendations);

export default router;