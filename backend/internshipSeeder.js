// internshipSeeder.js 

import mongoose from "mongoose";
import dotenv from "dotenv";
import { Internship } from "./student/models/Internship.js";

dotenv.config();

const mockInternships = [
    {
        title: "Frontend Developer Intern",
        company: "TechNova Solutions",
        description: "Build responsive and interactive web applications using React, HTML, CSS, and JavaScript.",
        requiredSkills: ["React", "JavaScript", "HTML", "CSS", "Git", "API Integration"],
        domain: "Web Development",
        difficulty: "Intermediate",
        duration: "3 months",
        stipend: "$500/month",
        location: "Rawalpindi",
        startDate: "December 15, 2025",
        responsibilities: [
            "Develop responsive user interfaces using React",
            "Collaborate with backend developers for API integration",
            "Implement UI/UX best practices from Figma designs",
            "Participate in code reviews and team meetings",
            "Write maintainable and clean code"
        ],
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
        isActive: true
    },
    {
        title: "Full Stack MERN Intern",
        company: "WebWorks Pro",
        description: "Work on both frontend and backend of modern web apps using MongoDB, Express, React, and Node.js.",
        requiredSkills: ["MongoDB", "Express", "React", "Node.js", "JavaScript", "REST API"],
        domain: "Full Stack Development",
        difficulty: "Advanced",
        duration: "6 months",
        stipend: "$900/month",
        location: "Lahore",
        startDate: "January 5, 2026",
        responsibilities: [
            "Build full-stack web applications",
            "Design database schemas and integrate MongoDB",
            "Implement authentication and authorization systems",
            "Deploy applications and manage cloud services",
            "Write tests and ensure application stability"
        ],
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
        isActive: true
    },
    {
        title: "Mobile App Developer Intern",
        company: "AppCraft Studios",
        description: "Develop cross-platform mobile apps using React Native for real client projects.",
        requiredSkills: ["React Native", "JavaScript", "Firebase", "REST API", "Mobile UI"],
        domain: "Mobile Development",
        difficulty: "Intermediate",
        duration: "4 months",
        stipend: "$600/month",
        location: "Lahore",
        startDate: "December 1, 2025",
        responsibilities: [
            "Develop iOS and Android apps using React Native",
            "Integrate Firebase for backend functionality",
            "Collaborate with designers to implement UI/UX",
            "Test and debug mobile applications",
            "Maintain app performance and responsiveness"
        ],
        image: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800",
        isActive: true
    },
    {
        title: "UI/UX Design Intern",
        company: "DesignHub",
        description: "Create intuitive and visually appealing interfaces for web and mobile apps.",
        requiredSkills: ["Figma", "Adobe XD", "UI Design", "UX Research", "Prototyping"],
        domain: "Design",
        difficulty: "Beginner",
        duration: "3 months",
        stipend: "$400/month",
        location: "Rawalpindi",
        startDate: "December 10, 2025",
        responsibilities: [
            "Design UI/UX for web and mobile applications",
            "Create wireframes, prototypes, and design systems",
            "Conduct user research and usability testing",
            "Collaborate with developers to implement designs",
            "Ensure design consistency and quality"
        ],
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
        isActive: true
    },
    {
        title: "Backend Developer Intern",
        company: "CloudStack Systems",
        description: "Learn to build scalable backend systems using Node.js, Express, and MongoDB.",
        requiredSkills: ["Node.js", "Express", "MongoDB", "REST API", "Database Design"],
        domain: "Backend Development",
        difficulty: "Intermediate",
        duration: "3 months",
        stipend: "$550/month",
        location: "Karachi",
        startDate: "November 20, 2025",
        responsibilities: [
            "Design and develop RESTful APIs",
            "Implement database schemas and integrate MongoDB",
            "Write unit and integration tests",
            "Optimize API performance",
            "Document API endpoints"
        ],
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
        isActive: true
    },
    {
        title: "Data Science Intern",
        company: "AI Analytics Corp",
        description: "Work with machine learning models and data analysis using Python.",
        requiredSkills: ["Python", "Machine Learning", "Data Analysis", "Pandas", "NumPy"],
        domain: "Data Science",
        difficulty: "Advanced",
        duration: "5 months",
        stipend: "$700/month",
        location: "Islamabad",
        startDate: "December 20, 2025",
        responsibilities: [
            "Analyze large datasets and extract insights",
            "Build and train machine learning models",
            "Create data visualizations and reports",
            "Collaborate with data engineering team",
            "Present findings to stakeholders"
        ],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        isActive: true
    }
];

async function seedInternships() {
    try {
        // MongoDB connection
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Clear existing data
        const deletedCount = await Internship.deleteMany({});
        console.log(`Deleted ${deletedCount.deletedCount} existing internships`);

        // Insert new data
        const inserted = await Internship.insertMany(mockInternships);
        console.log(`Successfully seeded ${inserted.length} internships`);

        // Verify insertion
        const total = await Internship.countDocuments();
        console.log(`Total internships in database: ${total}`);

        // Show sample data
        console.log("\n Sample Internship:");
        console.log(JSON.stringify(inserted[0], null, 2));

        mongoose.connection.close();
        console.log("\n Database connection closed");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding internships:", error);
        process.exit(1);
    }
}

seedInternships();