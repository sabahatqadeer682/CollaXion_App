// seedInternships.js
// Run: node seedInternships.js
// Seeds 13 mock internships into MongoDB

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const internshipSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  type: { type: String, enum: ["On-site", "Remote", "Hybrid"], default: "On-site" },
  duration: String,
  stipend: String,
  domain: String,
  requiredSkills: [String],
  description: String,
  requirements: String,
  deadline: Date,
  logo: String,
  isMock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Internship = mongoose.models.Internship || mongoose.model("Internship", internshipSchema);

const mockInternships = [
  {
    title: "Frontend Developer Intern",
    company: "TechNest Solutions",
    location: "Islamabad, Pakistan",
    type: "Hybrid",
    duration: "3 Months",
    stipend: "PKR 15,000/month",
    domain: "Web Development",
    requiredSkills: ["React", "JavaScript", "CSS", "HTML", "Tailwind"],
    description:
      "Join our dynamic team to build cutting-edge web applications. Work on real-world projects with experienced mentors. You'll develop dashboards, landing pages, and internal tools used by thousands of users.",
    requirements: "BS CS/SE student, 4th semester or above, basic React knowledge",
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
    requiredSkills: ["Python", "TensorFlow", "Machine Learning", "Data Analysis", "Pandas", "NumPy"],
    description:
      "Work on ML pipelines, model training, and deployment. Hands-on experience with production AI systems processing millions of data points daily.",
    requirements: "Strong Python skills, knowledge of ML algorithms, familiarity with pandas/numpy",
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    logo: "https://img.icons8.com/color/96/artificial-intelligence.png",
    isMock: true,
  },
  {
    title: "React Native Developer Intern",
    company: "AppForge Pakistan",
    location: "Rawalpindi, Pakistan",
    type: "On-site",
    duration: "3 Months",
    stipend: "PKR 18,000/month",
    domain: "Mobile Development",
    requiredSkills: ["React Native", "JavaScript", "Expo", "Redux", "REST APIs"],
    description:
      "Build cross-platform mobile apps for our clients. Work alongside senior developers on live projects serving real users across Android and iOS.",
    requirements: "React Native experience, understanding of mobile UI/UX, Git knowledge",
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    logo: "https://img.icons8.com/color/96/react-native.png",
    isMock: true,
  },
  {
    title: "Cybersecurity Analyst Intern",
    company: "SecureNet Corp",
    location: "Islamabad, Pakistan",
    type: "On-site",
    duration: "4 Months",
    stipend: "PKR 20,000/month",
    domain: "Cybersecurity",
    requiredSkills: ["Network Security", "Linux", "Python", "Ethical Hacking", "Wireshark"],
    description:
      "Learn penetration testing, vulnerability assessment, and network security from industry experts. Perform security audits on real infrastructure.",
    requirements: "Knowledge of networking fundamentals, Linux basics, interest in cybersecurity",
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    logo: "https://img.icons8.com/color/96/security-shield-green.png",
    isMock: true,
  },
  {
    title: "UI/UX Design Intern",
    company: "PixelCraft Studio",
    location: "Karachi, Pakistan",
    type: "Remote",
    duration: "3 Months",
    stipend: "PKR 12,000/month",
    domain: "Design",
    requiredSkills: ["Figma", "Adobe XD", "UI Design", "Prototyping", "User Research"],
    description:
      "Design beautiful user interfaces for web and mobile apps. Create wireframes, prototypes, and design systems for funded startups.",
    requirements: "Figma proficiency, portfolio of design work, understanding of UX principles",
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    logo: "https://img.icons8.com/color/96/design.png",
    isMock: true,
  },
  {
    title: "Backend Developer Intern",
    company: "CloudBase Technologies",
    location: "Islamabad, Pakistan",
    type: "Hybrid",
    duration: "4 Months",
    stipend: "PKR 22,000/month",
    domain: "Backend Development",
    requiredSkills: ["Node.js", "Express", "MongoDB", "REST APIs", "JWT"],
    description:
      "Build scalable backend services and REST APIs. Work with cloud infrastructure, databases, and authentication systems used in production.",
    requirements: "Node.js & Express experience, MongoDB knowledge, understanding of REST principles",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    logo: "https://img.icons8.com/color/96/nodejs.png",
    isMock: true,
  },
  {
    title: "Data Science Intern",
    company: "InsightLab Analytics",
    location: "Lahore, Pakistan",
    type: "Remote",
    duration: "3 Months",
    stipend: "PKR 20,000/month",
    domain: "Data Science",
    requiredSkills: ["Python", "Pandas", "NumPy", "Matplotlib", "SQL", "Scikit-Learn"],
    description:
      "Analyze large datasets to derive business insights. Build dashboards, create visualizations, and present findings to stakeholders.",
    requirements: "Python proficiency, basic SQL, statistical knowledge, Jupyter notebooks experience",
    deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    logo: "https://img.icons8.com/color/96/combo-chart.png",
    isMock: true,
  },
  {
    title: "DevOps Intern",
    company: "InfraCloud Pvt Ltd",
    location: "Islamabad, Pakistan",
    type: "Remote",
    duration: "4 Months",
    stipend: "PKR 28,000/month",
    domain: "DevOps",
    requiredSkills: ["Docker", "Linux", "Git", "CI/CD", "AWS", "Jenkins"],
    description:
      "Manage cloud infrastructure, build CI/CD pipelines, and automate deployment workflows for production applications.",
    requirements: "Linux command line proficiency, basic cloud knowledge, Git experience",
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    logo: "https://img.icons8.com/color/96/docker.png",
    isMock: true,
  },
  {
    title: "NLP Research Intern",
    company: "LinguaTech AI",
    location: "Remote",
    type: "Remote",
    duration: "5 Months",
    stipend: "PKR 30,000/month",
    domain: "Artificial Intelligence",
    requiredSkills: ["Python", "NLP", "Transformers", "PyTorch", "Hugging Face", "TensorFlow"],
    description:
      "Research and develop natural language processing models. Work on text classification, named entity recognition, and generative AI tasks.",
    requirements: "Strong ML background, experience with transformers or BERT models, research mindset",
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    logo: "https://img.icons8.com/color/96/natural-language.png",
    isMock: true,
  },
  {
    title: "Flutter Developer Intern",
    company: "MobileFirst Labs",
    location: "Rawalpindi, Pakistan",
    type: "On-site",
    duration: "3 Months",
    stipend: "PKR 16,000/month",
    domain: "Mobile Development",
    requiredSkills: ["Flutter", "Dart", "Firebase", "REST APIs", "Android"],
    description:
      "Develop high-quality Flutter applications for Android and iOS. Collaborate with designers and backend teams in an Agile environment.",
    requirements: "Flutter/Dart knowledge, Firebase experience, clean code practices",
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    logo: "https://img.icons8.com/color/96/flutter.png",
    isMock: true,
  },
  {
    title: "Full Stack (MERN) Intern",
    company: "Digitex Solutions",
    location: "Lahore, Pakistan",
    type: "Hybrid",
    duration: "4 Months",
    stipend: "PKR 23,000/month",
    domain: "Web Development",
    requiredSkills: ["React", "Node.js", "MongoDB", "Express", "JavaScript", "REST APIs"],
    description:
      "Work on end-to-end MERN stack applications. You will build features from database schema to React UI in a fast-paced startup.",
    requirements: "Full MERN stack knowledge, Git workflow, problem-solving skills",
    deadline: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    logo: "https://img.icons8.com/color/96/javascript.png",
    isMock: true,
  },
  {
    title: "Cloud Computing Intern",
    company: "NexaCloud Pakistan",
    location: "Islamabad, Pakistan",
    type: "Remote",
    duration: "3 Months",
    stipend: "PKR 24,000/month",
    domain: "Cloud Computing",
    requiredSkills: ["AWS", "Cloud Architecture", "Python", "Linux", "Networking"],
    description:
      "Set up and manage AWS services including EC2, S3, Lambda, and RDS. Assist in designing cloud infrastructure for enterprise clients.",
    requirements: "AWS basics, Python scripting, understanding of cloud concepts",
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    logo: "https://img.icons8.com/color/96/amazon-web-services.png",
    isMock: true,
  },
  {
    title: "Game Development Intern",
    company: "PixelArena Studios",
    location: "Karachi, Pakistan",
    type: "On-site",
    duration: "3 Months",
    stipend: "PKR 14,000/month",
    domain: "Game Development",
    requiredSkills: ["Unity", "C#", "Game Design", "3D Modeling", "Physics"],
    description:
      "Create engaging game mechanics and levels using Unity. Work on a published mobile game with an active player base.",
    requirements: "Unity experience, C# programming, passion for games, portfolio preferred",
    deadline: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
    logo: "https://img.icons8.com/color/96/unity.png",
    isMock: true,
  },

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
    },

{
        title: "Junior Web Developer (HTML/CSS)",
        company: "Rawal Tech Solutions",
        description: "Develop and maintain static websites using HTML5 and CSS3, ensuring pixel-perfect designs.",
        requiredSkills: ["HTML", "CSS", "Responsive Design", "Basic JavaScript"],
        domain: "Web Development",
        difficulty: "Beginner",
        duration: "3 months",
        stipend: "$300/month",
        location: "Rawalpindi",
        startDate: "December 20, 2025",
        responsibilities: [
            "Convert PSD designs into responsive HTML/CSS code",
            "Maintain existing food and e-commerce websites",
            "Optimize websites for mobile and tablet views",
            "Assist senior developers in styling tasks"
        ],
        image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800",
        isActive: true
    },
    {
        title: "Graphic Design Intern",
        company: "Creative Edge Agency",
        description: "Create visual assets and marketing materials using Adobe Photoshop and Illustrator.",
        requiredSkills: ["Adobe Photoshop", "Adobe Illustrator", "Visual Design", "Branding"],
        domain: "Design",
        difficulty: "Beginner",
        duration: "4 months",
        stipend: "$350/month",
        location: "Islamabad",
        startDate: "January 10, 2026",
        responsibilities: [
            "Design social media graphics and banners",
            "Create logos and brand identity elements",
            "Edit and enhance photos for client projects",
            "Collaborate with the marketing team for visual storytelling"
        ],
        image: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800",
        isActive: true
    },
    {
        title: "Java Developer Intern",
        company: "Systems Ltd (Blue Area)",
        description: "Work on enterprise-level management systems using Java and Object-Oriented Programming.",
        requiredSkills: ["Java", "OOP", "Basic SQL", "Problem Solving"],
        domain: "Software Engineering",
        difficulty: "Intermediate",
        duration: "6 months",
        stipend: "$450/month",
        location: "Islamabad",
        startDate: "February 1, 2026",
        responsibilities: [
            "Develop modules for hospital and school management systems",
            "Debug and troubleshoot Java-based applications",
            "Write clean and efficient backend logic",
            "Participate in daily scrum meetings"
        ],
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
        isActive: true
    },
    {
        title: "C++ Software Intern",
        company: "Embedded Core",
        description: "Focus on algorithmic development and system-level programming using C++.",
        requiredSkills: ["C++", "Data Structures", "Algorithms", "Logic Design"],
        domain: "Software Development",
        difficulty: "Intermediate",
        duration: "3 months",
        stipend: "$400/month",
        location: "Rawalpindi",
        startDate: "December 25, 2025",
        responsibilities: [
            "Implement efficient algorithms in C++",
            "Assist in developing inventory management software",
            "Optimize code performance for resource-constrained systems",
            "Conduct unit testing for new software modules"
        ],
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800",
        isActive: true
    },
    {
        title: "UI Designer & Frontend Trainee",
        company: "Digital Pulse",
        description: "Bridge the gap between design and code by creating UI mockups and implementing them in CSS.",
        requiredSkills: ["Adobe Illustrator", "HTML", "CSS", "Figma Basics"],
        domain: "Design & Web",
        difficulty: "Beginner",
        duration: "3 months",
        stipend: "$300/month",
        location: "Remote",
        startDate: "January 15, 2026",
        responsibilities: [
            "Create high-fidelity UI mockups for web apps",
            "Translate designs into CSS and HTML frameworks",
            "Ensure consistency across different browser platforms",
            "Conduct UI testing and provide feedback"
        ],
        image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800",
        isActive: true
    },
    {
        title: "Technical Writing & Presentation Intern",
        company: "EduTech Global",
        description: "Utilize your English proficiency and presentation skills to document software processes.",
        requiredSkills: ["English (IELTS level)", "Effective Communication", "Technical Documentation", "MS Office"],
        domain: "Software Support",
        difficulty: "Beginner",
        duration: "2 months",
        stipend: "$250/month",
        location: "Islamabad",
        startDate: "January 5, 2026",
        responsibilities: [
            "Write user manuals for software products",
            "Prepare presentation decks for client meetings",
            "Proofread technical reports and blogs",
            "Assist in creating training materials for new developers"
        ],
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
        isActive: true
    },
    {
        title: "Associate Software Engineer (Internee)",
        company: "NextGen Software House",
        description: "A generalist role for 3rdrd-semester students to explore different SE domains.",
        requiredSkills: ["C++", "Java", "Basic Software Engineering Concepts", "HTML"],
        domain: "Software Engineering",
        difficulty: "Beginner",
        duration: "6 months",
        stipend: "$400/month",
        location: "Rawalpindi",
        startDate: "February 15, 2026",
        responsibilities: [
            "Rotate through different departments (Web, Mobile, Desktop)",
            "Collaborate on internal software projects",
            "Learn industry-standard software development lifecycles",
            "Contribute to documentation and testing phases"
        ],
        image: "https://images.unsplash.com/photo-1522071823991-b5ae7264040e?w=800",
        isActive: true
    },
];

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Remove old mock data first
    const deleted = await Internship.deleteMany({ isMock: true });
    console.log(`🗑️  Removed ${deleted.deletedCount} old mock internships`);

    await Internship.insertMany(mockInternships);
    console.log(`\n🎉 Seeded ${mockInternships.length} internships successfully!`);
    mockInternships.forEach((i, idx) =>
      console.log(`  ${idx + 1}. ${i.title} @ ${i.company} [${i.domain}]`)
    );
  } catch (err) {
    console.error("❌ Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();