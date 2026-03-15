import { extractSkillsFromCV } from "../services/aiService.js";

export const analyzeCV = async (req, res) => {
    try {
        const cvPath = req.file.path;
        const data = await extractSkillsFromCV(cvPath);
        res.json(data);
    } catch (err) {
        console.error("AI Error:", err);
        res.status(500).json({ error: err.message });
    }
};
