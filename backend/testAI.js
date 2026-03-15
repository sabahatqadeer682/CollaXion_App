// testAI.js - Root folder mein banayein
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);

async function testSkillExtraction() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Sample CV text
        const cvText = `
        John Doe
        Software Developer
        
        Skills: React, JavaScript, Node.js, MongoDB, Express, HTML, CSS, Git
        
        Experience:
        - Built web applications using MERN stack
        - Developed mobile apps with React Native
        - Created RESTful APIs
        `;

        const prompt = `
You are an expert CV analyzer. Extract technical skills from this CV.

CV Text:
${cvText}

Return ONLY a JSON array of skills. Example: ["React", "JavaScript", "Node.js"]
No markdown, no explanation, just the JSON array.
`;

        console.log(" Testing AI skill extraction...\n");

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log(" Raw AI Response:");
        console.log(text);
        console.log("\n");

        // Clean and parse
        let cleanedText = text.replace(/```json|```/g, "").trim();
        const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);

        if (jsonMatch) {
            const skills = JSON.parse(jsonMatch[0]);
            console.log(" Extracted Skills:");
            console.log(skills);
            console.log(`\n📊 Total Skills: ${skills.length}`);
        } else {
            console.log(" Failed to extract JSON");
        }

    } catch (error) {
        console.error(" Error:", error.message);
    }
}

testSkillExtraction();
