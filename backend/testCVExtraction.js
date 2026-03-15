// testCVExtraction.js
import dotenv from "dotenv";
import { extractSkillsFromCV } from "./student/services/aiService.js";

import path from "path";
import fs from "fs";

dotenv.config();

async function testCVExtraction() {
    try {
        console.log(" Testing CV Extraction...\n");
        console.log("=".repeat(60));

        // Find the most recent CV file
        const cvDir = "./uploads/cv";

        if (!fs.existsSync(cvDir)) {
            console.error(" CV directory not found:", cvDir);
            process.exit(1);
        }

        const files = fs.readdirSync(cvDir)
            .filter(f => f.endsWith('.pdf'))
            .map(f => ({
                name: f,
                path: path.join(cvDir, f),
                time: fs.statSync(path.join(cvDir, f)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time);

        if (files.length === 0) {
            console.error("No PDF files found in", cvDir);
            console.log("\n Please upload a CV first from the app");
            process.exit(1);
        }

        const latestCV = files[0];
        console.log(" Testing with latest CV:");
        console.log("   File:", latestCV.name);
        console.log("   Path:", latestCV.path);
        console.log("=".repeat(60));
        console.log("\n");

        // Test extraction
        console.log(" Starting AI extraction...\n");
        const result = await extractSkillsFromCV(latestCV.path);

        console.log("\n" + "=".repeat(60));
        console.log(" EXTRACTION SUCCESSFUL!");
        console.log("=".repeat(60));

        console.log("\n Results:");
        console.log("\n Skills (" + result.skills.length + "):");
        result.skills.forEach((skill, idx) => {
            console.log(`   ${idx + 1}. ${skill}`);
        });

        console.log("\n🎓 Education (" + result.education.length + "):");
        result.education.forEach((edu, idx) => {
            console.log(`   ${idx + 1}. ${edu.degree} - ${edu.institution} (${edu.year})`);
        });

        console.log("\n Experience (" + result.experience.length + "):");
        result.experience.forEach((exp, idx) => {
            console.log(`   ${idx + 1}. ${exp.title} at ${exp.company} (${exp.duration})`);
        });

        console.log("\n Summary:");
        console.log("   " + result.summary);

        console.log("\n" + "=".repeat(60));

        // Check if skills are meaningful
        const genericSkills = ["communication", "teamwork", "problem solving"];
        const hasGenericOnly = result.skills.every(s =>
            genericSkills.includes(s.toLowerCase())
        );

        if (hasGenericOnly) {
            console.log("\n  WARNING: Only generic skills detected!");
            console.log("💡 This means CV might not have clear technical skills listed");
            console.log("   Try uploading a CV with clear skills section");
        } else {
            console.log("\n Good! Technical skills detected!");
            console.log("   These should match with internship requirements");
        }

    } catch (error) {
        console.error("\n" + "=".repeat(60));
        console.error(" EXTRACTION FAILED!");
        console.error("=".repeat(60));
        console.error("\nError:", error.message);
        console.error("\nFull error:", error);

        console.log("\n Troubleshooting:");
        console.log("   1. Check if GOOGLE_GEN_AI_KEY is set in .env");
        console.log("   2. Verify CV file is a valid PDF");
        console.log("   3. Make sure CV has readable text (not scanned image)");
        console.log("   4. Check if Gemini API quota is exceeded");
    }
}

testCVExtraction();