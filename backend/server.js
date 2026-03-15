import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import studentRoutes from "./student/routes/studentRoutes.js";
import aiRoutes from "./student/routes/aiRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();


app.use(express.json());
app.use(cors());


app.use("/uploads", express.static("uploads"));
app.use("/uploads/profile", express.static("uploads/profile"));
app.use("/uploads/cv", express.static("uploads/cv"));


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/student", studentRoutes);

app.use("/api/ai", aiRoutes);
// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Server is running", endpoints: ["/api/student", "/api/ai"] });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  const baseUrl = `http://localhost:${PORT}`;
  console.log("\n" + "=".repeat(50));
  console.log(`Server is running!`);
  console.log("=".repeat(50));
  console.log(` Server URL: ${baseUrl}`);
  console.log("\n Available Endpoints:");
  console.log(`   • GET  ${baseUrl}/`);
  console.log(`   • POST ${baseUrl}/api/student/register`);
  console.log(`   • POST ${baseUrl}/api/student/login`);
  console.log(`   • POST ${baseUrl}/api/student/verify`);
  console.log(`   • GET  ${baseUrl}/api/student/getStudent/:email`);
  console.log(`   • PUT  ${baseUrl}/api/student/updateProfile`);
  console.log(`   • POST ${baseUrl}/api/student/upload-cv/:email`);
  console.log(`   • GET  ${baseUrl}/api/student/recommendations/:email`);
  console.log(`   • POST ${baseUrl}/api/student/apply-internship`);
  console.log(`   • GET  ${baseUrl}/api/student/my-applications/:email`);

  console.log("=".repeat(50) + "\n");
});
