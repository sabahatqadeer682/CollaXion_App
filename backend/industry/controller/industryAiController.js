
// import fetch from "node-fetch";

// const GEMINI_URL =
//   "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// export const getAIRecommendations = async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     if (!prompt) {
//       return res.status(400).json({ error: "Prompt is required" });
//     }

//     const response = await fetch(
//       `${GEMINI_URL}?key=${process.env.GEMINI_KEY}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           contents: [{ parts: [{ text: prompt }] }],
//           generationConfig: {
//             temperature: 0.3,
//             maxOutputTokens: 3000,
//           },
//         }),
//       }
//     );

//     const data = await response.json();

//     // ❌ Handle Gemini errors properly
//     if (!response.ok) {
//       console.error("Gemini Error:", data);
//       return res.status(400).json({
//         error: data?.error?.message || "Gemini API failed",
//       });
//     }

//     res.json(data);
//   } catch (error) {
//     console.error("Server Error:", error.message);
//     res.status(500).json({
//       error: "Internal Server Error",
//     });
//   }
// };


// const GEMINI_URL =
//   "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
// const GEMINI_URL =
// "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// export const getAIRecommendations = async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     if (!prompt) {
//       return res.status(400).json({ error: "Prompt is required" });
//     }

//     const response = await fetch(
//       `${GEMINI_URL}?key=${process.env.GEMINI_KEY}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           contents: [{ parts: [{ text: prompt }] }],
//         }),
//       }
//     );

//     const data = await response.json();

//     console.log("🔥 GEMINI RESPONSE:", JSON.stringify(data, null, 2));

//     if (!response.ok) {
//       return res.status(400).json({
//         error: data?.error?.message || "Gemini API failed",
//       });
//     }

//     const text =
//       data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

//     return res.json({ text });

//   } catch (error) {
//     console.error("Server Error:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };






// // export const getAIRecommendations = async (req, res) => {
// //   try {
// //     const { prompt } = req.body;

// //     if (!prompt) {
// //       return res.status(400).json({ error: "Prompt is required" });
// //     }

// //     const response = await fetch(
// //       `${GEMINI_URL}?key=${process.env.GEMINI_KEY}`,
// //       {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           contents: [{ parts: [{ text: prompt }] }],
// //           generationConfig: {
// //             temperature: 0.3,
// //             maxOutputTokens: 3000,
// //           },
// //         }),
// //       }
// //     );

// //     const data = await response.json();
// //     console.log("🔥 GEMINI FULL RESPONSE:", JSON.stringify(data, null, 2));

// // //     if (!response.ok) {
// // //       console.error("Gemini Error:", data);
// // //       return res.status(400).json({
// // //         error: data?.error?.message || "Gemini API failed",
// // //       });
// // //     }

// // //     res.json(data);

// // //   } catch (error) {
// // //     console.error("Server Error:", error.message);
// // //     res.status(500).json({
// // //       error: "Internal Server Error",
// // //     });
// // //   }
// // // };



// // if (!response.ok) {
// //       return res.status(400).json({
// //         error: data?.error?.message || "Gemini API failed",
// //       });
// //     }

// //     const text =
// //       data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

// //     return res.json({ text });

// //   } catch (error) {
// //     console.error("Server Error:", error.message);
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // };



// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// export const getAIRecommendations = async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     const model = genAI.getGenerativeModel({
//       model: "gemini-2.0-flash",
//     });

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     res.json({ text });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// };


import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

export const getAIRecommendations = async (req, res) => {
  try {
    const { prompt } = req.body;

    const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    const text = response.text() || "[]"; // 👈 SAFE ADD HERE

    res.json({ text });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};