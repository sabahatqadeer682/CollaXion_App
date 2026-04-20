// import express from "express";
// import Internship from "../models/Internship.js";
// import Application from "../models/Application.js";
// import Notification from "../models/Notification.js";

// const router = express.Router();

// // Seed mock internships (call once to populate DB)
// router.post("/seed", async (req, res) => {
//   try {
//     const count = await Internship.countDocuments();
//     if (count > 0) return res.json({ message: "Already seeded", count });

//     const mockInternships = [
//       {
//         title: "Frontend Developer Intern",
//         company: "TechNest Solutions",
//         location: "Islamabad, Pakistan",
//         type: "Hybrid",
//         duration: "3 Months",
//         stipend: "PKR 15,000/month",
//         domain: "Web Development",
//         requiredSkills: ["React", "JavaScript", "CSS", "HTML"],
//         description: "Join our dynamic team to build cutting-edge web applications. Work on real-world projects with experienced mentors.",
//         requirements: "BS CS/SE student, 4th semester or above, basic React knowledge",
//         deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
//         logo: "https://img.icons8.com/color/96/react-native.png",
//         isMock: true,
//       },
//       {
//         title: "Machine Learning Intern",
//         company: "DataSphere AI",
//         location: "Lahore, Pakistan",
//         type: "Remote",
//         duration: "6 Months",
//         stipend: "PKR 25,000/month",
//         domain: "Artificial Intelligence",
//         requiredSkills: ["Python", "TensorFlow", "Machine Learning", "Data Analysis"],
//         description: "Work on ML pipelines, model training, and deployment. Hands-on experience with production AI systems.",
//         requirements: "Strong Python skills, knowledge of ML algorithms, familiarity with pandas/numpy",
//         deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
//         logo: "https://img.icons8.com/color/96/artificial-intelligence.png",
//         isMock: true,
//       },
//       {
//         title: "Mobile App Developer Intern",
//         company: "AppForge Pakistan",
//         location: "Rawalpindi, Pakistan",
//         type: "On-site",
//         duration: "3 Months",
//         stipend: "PKR 18,000/month",
//         domain: "Mobile Development",
//         requiredSkills: ["React Native", "JavaScript", "Android", "iOS"],
//         description: "Build cross-platform mobile apps for our clients. Work alongside senior developers on live projects.",
//         requirements: "React Native experience, understanding of mobile UI/UX, Git knowledge",
//         deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
//         logo: "https://img.icons8.com/color/96/react-native.png",
//         isMock: true,
//       },
//       {
//         title: "Cybersecurity Intern",
//         company: "SecureNet Corp",
//         location: "Islamabad, Pakistan",
//         type: "On-site",
//         duration: "4 Months",
//         stipend: "PKR 20,000/month",
//         domain: "Cybersecurity",
//         requiredSkills: ["Network Security", "Linux", "Python", "Ethical Hacking"],
//         description: "Learn penetration testing, vulnerability assessment, and network security from industry experts.",
//         requirements: "Knowledge of networking fundamentals, Linux basics, interest in cybersecurity",
//         deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
//         logo: "https://img.icons8.com/color/96/security-shield-green.png",
//         isMock: true,
//       },
//       {
//         title: "UI/UX Design Intern",
//         company: "PixelCraft Studio",
//         location: "Karachi, Pakistan",
//         type: "Remote",
//         duration: "3 Months",
//         stipend: "PKR 12,000/month",
//         domain: "Design",
//         requiredSkills: ["Figma", "Adobe XD", "UI Design", "Prototyping"],
//         description: "Design beautiful user interfaces for web and mobile apps. Create wireframes, prototypes, and design systems.",
//         requirements: "Figma proficiency, portfolio of design work, understanding of UX principles",
//         deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
//         logo: "https://img.icons8.com/color/96/design.png",
//         isMock: true,
//       },
//       {
//         title: "Backend Developer Intern",
//         company: "CloudBase Technologies",
//         location: "Islamabad, Pakistan",
//         type: "Hybrid",
//         duration: "4 Months",
//         stipend: "PKR 22,000/month",
//         domain: "Backend Development",
//         requiredSkills: ["Node.js", "Express", "MongoDB", "REST APIs"],
//         description: "Build scalable backend services and REST APIs. Work with cloud infrastructure and databases.",
//         requirements: "Node.js & Express experience, MongoDB knowledge, understanding of REST principles",
//         deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//         logo: "https://img.icons8.com/color/96/nodejs.png",
//         isMock: true,
//       },
//     ];

//     await Internship.insertMany(mockInternships);
//     res.json({ message: "Mock internships seeded successfully!", count: mockInternships.length });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET all internships (with optional filter)
// router.get("/", async (req, res) => {
//   try {
//     const { domain, skills } = req.query;
//     let query = {};
//     if (domain) query.domain = { $regex: domain, $options: "i" };
//     const internships = await Internship.find(query).sort({ createdAt: -1 });
//     res.json(internships);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET single internship
// router.get("/:id", async (req, res) => {
//   try {
//     const internship = await Internship.findById(req.params.id);
//     if (!internship) return res.status(404).json({ error: "Not found" });
//     res.json(internship);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // POST apply for internship
// router.post("/apply", async (req, res) => {
//   try {
//     const { studentEmail, internshipId, coverLetter } = req.body;

//     // Check if already applied
//     const existing = await Application.findOne({ studentEmail, internshipId });
//     if (existing) return res.status(400).json({ error: "Already applied for this internship" });

//     const application = new Application({
//       studentEmail,
//       internshipId,
//       coverLetter,
//       status: "Pending",
//       statusHistory: [{ status: "Pending", note: "Application submitted successfully" }],
//     });
//     await application.save();

//     // Create notification
//     const internship = await Internship.findById(internshipId);
//     await Notification.create({
//       studentEmail,
//       title: "Application Submitted! 🎉",
//       message: `Your application for "${internship?.title}" at ${internship?.company} has been submitted. We'll notify you of updates.`,
//       type: "application",
//     });

//     res.json({ message: "Application submitted successfully!", application });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;


import express from "express";
import Internship from "../models/Internship.js";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// Seed mock internships (call once to populate DB)
router.post("/seed", async (req, res) => {
  try {
    const count = await Internship.countDocuments();
    if (count > 0) return res.json({ message: "Already seeded", count });

    const mockInternships = [
      {
        title: "Frontend Developer Intern",
        company: "TechNest Solutions",
        location: "Islamabad, Pakistan",
        type: "Hybrid",
        duration: "3 Months",
        stipend: "PKR 15,000/month",
        domain: "Web Development",
        requiredSkills: ["React", "JavaScript", "CSS", "HTML"],
        description: "Join our dynamic team to build cutting-edge web applications.",
        requirements: "BS CS/SE student, 4th semester or above",
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        logo: "https://img.icons8.com/color/96/react-native.png",
        isMock: true,
      },
      {
        title: "Machine Learning Intern",
        company: "DataSphere AI",
        location: "Lahore, Pakistan",
        type: "Remote",
        duration: "6 Months",
        stipend: "PKR 25,000/month",
        domain: "Artificial Intelligence",
        requiredSkills: ["Python", "TensorFlow", "Machine Learning"],
        description: "Work on ML pipelines and model training.",
        requirements: "Strong Python skills, knowledge of ML algorithms",
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        logo: "https://img.icons8.com/color/96/artificial-intelligence.png",
        isMock: true,
      },
      {
        title: "Mobile App Developer Intern",
        company: "AppForge Pakistan",
        location: "Rawalpindi, Pakistan",
        type: "On-site",
        duration: "3 Months",
        stipend: "PKR 18,000/month",
        domain: "Mobile Development",
        requiredSkills: ["React Native", "JavaScript", "Android"],
        description: "Build cross-platform mobile apps.",
        requirements: "React Native experience, Git knowledge",
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        logo: "https://img.icons8.com/color/96/react-native.png",
        isMock: true,
      }
    ];

    await Internship.insertMany(mockInternships);
    res.json({ message: "Mock internships seeded successfully!", count: mockInternships.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all internships
router.get("/", async (req, res) => {
  try {
    const { domain } = req.query;
    let query = {};
    if (domain) query.domain = { $regex: domain, $options: "i" };
    const internships = await Internship.find(query).sort({ createdAt: -1 });
    res.json(internships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single internship
router.get("/:id", async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ error: "Not found" });
    res.json(internship);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST apply for internship (UPDATED WITH VALIDATION)
router.post("/apply", async (req, res) => {
  try {
    const { studentEmail, internshipId, coverLetter } = req.body;

    // 1. Check for missing data
    if (!studentEmail || !internshipId) {
      return res.status(400).json({ error: "Student email and Internship ID are required." });
    }

    // 2. Check if already applied
    const existing = await Application.findOne({ studentEmail, internshipId });
    if (existing) {
      return res.status(400).json({ error: "You have already applied for this internship." });
    }

    // 3. Get internship details first (Important for notification)
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ error: "Internship details not found." });
    }

    // 4. Create and Save Application
    const application = new Application({
      studentEmail,
      internshipId,
      coverLetter: coverLetter || "Interested in this position",
      status: "Pending",
      statusHistory: [{ status: "Pending", note: "Application submitted successfully" }],
    });
    await application.save();

    // 5. Create Notification (Wrapped in try-catch so app doesn't crash if notif fails)
    try {
      await Notification.create({
        studentEmail: studentEmail,
        title: "Application Submitted! 🎉",
        message: `Your application for "${internship.title}" at ${internship.company} has been received.`,
        type: "application",
      });
    } catch (notifErr) {
      console.error("Notification Creation Error:", notifErr.message);
      // We don't return error here because application is already saved successfully
    }

    res.json({ 
      message: "Application submitted successfully!", 
      application 
    });

  } catch (err) {
    console.error("Apply Route Error:", err.message);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

export default router;