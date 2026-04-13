import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import dotenv from "dotenv";
import { createRequire } from "module";
import { PDFParse } from "pdf-parse";


dotenv.config();
const genAI = new GoogleGenerativeAI('AIzaSyAntuRm7cNgAHGVvgDe7ZUAGlDkIVhAhXA');

let pdfParse;
const getPdfParse = async () => {
    if (!pdfParse) {
        pdfParse = (await import("pdf-parse")).default;
    }
    return pdfParse;
};

/**
 * Extract skills, education, and experience from CV using AI
 */
export const extractSkillsFromCV = async (filePath, fileType) => {
    try {
        let textContent = "";
        // Handle PDF
        if (fileType === "application/pdf") {
            const buffer = fs.readFileSync(filePath);

            const parser = new PDFParse({ data: buffer });

            textContent = (await parser.getText()).text;
            console.log("PDF extracted successfully");

        } else if (
            fileType ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            const result = await mammoth.extractRawText({ path: filePath });
            textContent = result.value;
            console.log("DOCX extracted successfully");

            // Handle TXT
        } else {
            textContent = fs.readFileSync(filePath, "utf8");
            console.log("TXT extracted successfully");
        }

        // Cleanup
        fs.unlinkSync(filePath);

        if (!textContent.trim()) {
            throw new Error("Resume text extraction failed.");
        }

        // Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
Extract the following details from the resume below and return only clean JSON:
{
  "name": "",
  "email": "",
  "phone": "",
  "education": [],
  "experience": [],
  "skills": [],
  "summary": ""
}

Resume Text:
${textContent}
`;

        console.log("Sending data to Gemini...");

        const result = await model.generateContent(prompt);
        let output = result.response.text().trim();
        output = output.replace(/json|/g, "").trim();

        let data;
        const cleaned = output
            .replace(/```json|```/g, "")
            .trim();

        data = JSON.parse(cleaned);

        return data;
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Parsing failed.",
        });
    }
};

/**
 * AI-based internship recommendations
 */
export const recommendInternships = async (studentSkills, availableInternships) => {
    try {
        if (!studentSkills || studentSkills.length === 0) return [];
        if (!availableInternships || availableInternships.length === 0) return [];

        // const model = genAI.getGenerativeModel({ model: "gemini-pro" });

         const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const internshipsData = availableInternships.map(i => ({
            id: i._id.toString(),
            title: i.title,
            company: i.company,
            requiredSkills: i.requiredSkills || [],
            domain: i.domain || "",
            difficulty: i.difficulty || "",
        }));

        const prompt = `
You are an AI career advisor. Student's Skills: ${studentSkills.join(", ")}

Available Internships:
${JSON.stringify(internshipsData, null, 2)}

Return a JSON array with:
[
  {
    "internshipId": "id",
    "matchScore": 0-100,
    "matchingSkills": [],
    "missingSkills": [],
    "recommendation": "short reason"
  }
]

Include only internships with matchScore > 40. Return top 8 by score. JSON only.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        let cleanedText = text.replace(/```json|```/g, "").trim();
        const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);

        if (jsonMatch) {
            const recommendations = JSON.parse(jsonMatch[0]);
            return recommendations
                .filter(r => r.internshipId && r.matchScore)
                .map(r => ({
                    internshipId: r.internshipId,
                    matchScore: Math.min(100, Math.max(0, r.matchScore)),
                    matchingSkills: r.matchingSkills || [],
                    missingSkills: r.missingSkills || [],
                    recommendation: r.recommendation || "Good match",
                }))
                .sort((a, b) => b.matchScore - a.matchScore)
                .slice(0, 8);
        }

        return [];
    } catch (error) {
        console.error("Error in recommendInternships:", error);
        return [];
    }
};

/**
 * Generate CV feedback
 */
export const generateCVFeedback = async (extractedData) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
Provide professional feedback for this CV data:

Skills: ${extractedData.skills.join(", ")}
Education: ${JSON.stringify(extractedData.education)}
Experience: ${JSON.stringify(extractedData.experience)}
Summary: ${extractedData.summary}

Return concise, structured feedback:
Strengths:
• 
Areas for Improvement:
• 
Recommended Skills to Add:
• 
Overall: brief assessment
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const feedback = response.text();

        return feedback;
    } catch (error) {
        console.error("Error in generateCVFeedback:", error);
        return `CV Analysis Complete! Skills Extracted: ${extractedData.skills.length}. Recommendations available in your dashboard.`;
    }
};

/**
 * match score
 */
export const calculateMatchScore = (studentSkills, requiredSkills) => {
    if (!studentSkills || !requiredSkills) return 0;

    const studentSkillsLower = studentSkills.map(s => s.toLowerCase());
    const requiredSkillsLower = requiredSkills.map(s => s.toLowerCase());

    const matchingSkills = requiredSkillsLower.filter(skill =>
        studentSkillsLower.some(ss => ss.includes(skill) || skill.includes(ss))
    );

    const matchScore = Math.round((matchingSkills.length / requiredSkillsLower.length) * 100);
    return Math.min(100, matchScore);
};

