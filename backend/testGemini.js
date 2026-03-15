import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function testAPI() {
    try {
        const response = await genAI.models.textBison.generateText({
            prompt: "Hello, say hi in 2 languages",
            temperature: 0.7,
            maxOutputTokens: 100
        });

        console.log("API Working! Response:", response.candidates[0].output);
    } catch (err) {
        console.error("API Error:", err);
    }
}

testAPI();
