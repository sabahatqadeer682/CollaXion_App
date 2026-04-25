

// import express from "express";
// import Event from "../models/Event.js";
// import Notification from "../models/Notification.js";

// const router = express.Router();

// // Seed mock events
// router.post("/seed", async (req, res) => {
//   try {
//     const count = await Event.countDocuments();
//     if (count > 0) return res.json({ message: "Already seeded", count });

//     // const mockEvents = [
//     //   {
//     //     title: "Riphah Career Expo 2025",
//     //     description: "Pakistan's leading IT companies, banks, and multinationals will be present to hire fresh graduates and final-year students.",
//     //     type: "Job Fair",
//     //     date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//     //     time: "9:00 AM – 4:00 PM",
//     //     location: "Riphah International University, Islamabad Campus — Main Hall",
//     //     organizer: "Riphah Career Development Center",
//     //     image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=500&auto=format&fit=crop",
//     //     totalSeats: 500,
//     //     registeredStudents: [],
//     //     isMock: true,
//     //   },
//     //   {
//     //     title: "AI & Machine Learning in Healthcare",
//     //     description: "An insightful seminar on how Artificial Intelligence is transforming the healthcare industry.",
//     //     type: "Seminar",
//     //     date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
//     //     time: "2:00 PM – 5:00 PM",
//     //     location: "Riphah International University, Lahore Campus — Auditorium",
//     //     organizer: "Dept. of Computer Science, Riphah",
//     //     image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=500&auto=format&fit=crop",
//     //     totalSeats: 200,
//     //     registeredStudents: [],
//     //     isMock: true,
//     //   },
//     //   {
//     //     title: "Full-Stack Web Dev Bootcamp",
//     //     description: "A hands-on one-day bootcamp covering React, Node.js, and MongoDB from scratch.",
//     //     type: "Workshop",
//     //     date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
//     //     time: "10:00 AM – 6:00 PM",
//     //     location: "Riphah International University, Rawalpindi Campus — CS Lab 3",
//     //     organizer: "Riphah Tech Society",
//     //     image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=500&auto=format&fit=crop",
//     //     totalSeats: 60,
//     //     registeredStudents: [],
//     //     isMock: true,
//     //   },
//     //   {
//     //     title: "Digital Marketing Masterclass",
//     //     description: "Learn SEO, social media strategy, content marketing, and paid ads from professionals.",
//     //     type: "Webinar",
//     //     date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
//     //     time: "6:00 PM – 8:00 PM",
//     //     location: "Online via Zoom — Link sent upon registration",
//     //     organizer: "Riphah Business School",
//     //     image: "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=500&auto=format&fit=crop",
//     //     totalSeats: 300,
//     //     registeredStudents: [],
//     //     isMock: true,
//     //   },
//     //   {
//     //     title: "Startup Founders Networking Night",
//     //     description: "Connect with startup founders, angel investors, and fellow student entrepreneurs.",
//     //     type: "Networking",
//     //     date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
//     //     time: "7:00 PM – 10:00 PM",
//     //     location: "Riphah International University, F-7 Campus — Rooftop Lounge",
//     //     organizer: "Riphah Innovation & Entrepreneurship Cell",
//     //     image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=500&auto=format&fit=crop",
//     //     totalSeats: 80,
//     //     registeredStudents: [],
//     //     isMock: true,
//     //   },
//     //   {
//     //     title: "Cybersecurity Essentials Workshop",
//     //     description: "Covers ethical hacking basics, network security, and OWASP Top 10 vulnerabilities.",
//     //     type: "Workshop",
//     //     date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
//     //     time: "9:00 AM – 1:00 PM",
//     //     location: "Riphah International University, Islamabad Campus — IT Block",
//     //     organizer: "Dept. of Cybersecurity, Riphah",
//     //     image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=500&auto=format&fit=crop",
//     //     totalSeats: 50,
//     //     registeredStudents: [],
//     //     isMock: true,
//     //   },
//     // ];




//     const mockEvents = [
//   {
//     title: "Riphah Career Expo 2025",
//     description:
//       "Pakistan's leading IT companies, banks, and multinationals will be present to hire fresh graduates and final-year students.",
//     type: "Job Fair",
//     date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//     time: "9:00 AM – 4:00 PM",
//     location:
//       "Riphah International University, Islamabad Campus — Main Hall",
//     organizer: "Riphah Career Development Center",
//     image:
//       "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=500&auto=format&fit=crop",
//     totalSeats: 500,
//     registeredStudents: [],
//     isMock: true,
//   },
//   {
//     title: "AI & Machine Learning in Healthcare",
//     description:
//       "An insightful seminar on how Artificial Intelligence is transforming the healthcare industry.",
//     type: "Seminar",
//     date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
//     time: "2:00 PM – 5:00 PM",
//     location:
//       "Riphah International University, Lahore Campus — Auditorium",
//     organizer: "Dept. of Computer Science, Riphah",
//     image:
//       "https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=500&auto=format&fit=crop",
//     totalSeats: 200,
//     registeredStudents: [],
//     isMock: true,
//   },
//   {
//     title: "Full-Stack Web Dev Bootcamp",
//     description:
//       "A hands-on one-day bootcamp covering React, Node.js, and MongoDB from scratch.",
//     type: "Workshop",
//     date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
//     time: "10:00 AM – 6:00 PM",
//     location:
//       "Riphah International University, Rawalpindi Campus — CS Lab 3",
//     organizer: "Riphah Tech Society",
//     image:
//       "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=500&auto=format&fit=crop",
//     totalSeats: 60,
//     registeredStudents: [],
//     isMock: true,
//   },
//   {
//     title: "Digital Marketing Masterclass",
//     description:
//       "Learn SEO, social media strategy, content marketing, and paid ads from professionals.",
//     type: "Webinar",
//     date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
//     time: "6:00 PM – 8:00 PM",
//     location: "Online via Zoom — Link sent upon registration",
//     organizer: "Riphah Business School",
//     image:
//       "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=500&auto=format&fit=crop",
//     totalSeats: 300,
//     registeredStudents: [],
//     isMock: true,
//   },
//   {
//     title: "Startup Founders Networking Night",
//     description:
//       "Connect with startup founders, angel investors, and fellow student entrepreneurs.",
//     type: "Networking",
//     date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
//     time: "7:00 PM – 10:00 PM",
//     location:
//       "Riphah International University, F-7 Campus — Rooftop Lounge",
//     organizer: "Riphah Innovation & Entrepreneurship Cell",
//     image:
//       "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=500&auto=format&fit=crop",
//     totalSeats: 80,
//     registeredStudents: [],
//     isMock: true,
//   },
//   {
//     title: "Cybersecurity Essentials Workshop",
//     description:
//       "Covers ethical hacking basics, network security, and OWASP Top 10 vulnerabilities.",
//     type: "Workshop",
//     date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
//     time: "9:00 AM – 1:00 PM",
//     location:
//       "Riphah International University, Islamabad Campus — IT Block",
//     organizer: "Dept. of Cybersecurity, Riphah",
//     image:
//       "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=500&auto=format&fit=crop",
//     totalSeats: 50,
//     registeredStudents: [],
//     isMock: true,
//   },
// ];

//     await Event.insertMany(mockEvents);
//     res.json({ message: "Mock events seeded!", count: mockEvents.length });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET all events
// router.get("/", async (req, res) => {
//   try {
//     const events = await Event.find().sort({ date: 1 });
//     res.json(events);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // POST register for event — title se match karta hai
// router.post("/register", async (req, res) => {
//   try {
//     const { studentEmail, eventTitle } = req.body;

//     if (!studentEmail || !eventTitle) {
//       return res.status(400).json({ error: "studentEmail and eventTitle required" });
//     }

//     const event = await Event.findOne({ title: eventTitle });
//     if (!event) return res.status(404).json({ error: "Event not found" });

//     if (event.registeredStudents.includes(studentEmail)) {
//       return res.status(400).json({ error: "Already registered for this event!" });
//     }

//     event.registeredStudents.push(studentEmail);
//     await event.save();

//     await Notification.create({
//       studentEmail,
//       title: "Event Registration Confirmed! 📅",
//       message: `You're registered for "${event.title}" on ${new Date(event.date).toDateString()} at ${event.time}.`,
//       type: "event",
//     });

//     res.json({ message: "Registered successfully!", event });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET registered events for student
// router.get("/registered/:email", async (req, res) => {
//   try {
//     const events = await Event.find({ registeredStudents: req.params.email });
//     res.json(events);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;





import express from "express";
import Event from "../models/Event.js";

import Notification from "../../student/models/Notification.js";
import { notifyStudent } from "../utils/notify.js";


const router = express.Router();

// ─── Seed Mock Events ─────────────────────────────────────────────────────────
router.post("/seed", async (req, res) => {
  try {
    const count = await Event.countDocuments();
    if (count > 0) return res.json({ message: "Already seeded", count });

    const mockEvents = [
      {
        title: "Riphah Career Expo 2025",
        description:
          "Pakistan's leading IT companies, banks, and multinationals will be present to hire fresh graduates and final-year students.",
        type: "Job Fair",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        time: "9:00 AM – 4:00 PM",
        location: "Riphah International University, Islamabad Campus — Main Hall",
        organizer: "Riphah Career Development Center",
        image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=500&auto=format&fit=crop",
        totalSeats: 500,
        registeredStudents: [],
        isMock: true,
      },
      {
        title: "AI & Machine Learning in Healthcare",
        description:
          "An insightful seminar on how Artificial Intelligence is transforming the healthcare industry.",
        type: "Seminar",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        time: "2:00 PM – 5:00 PM",
        location: "Riphah International University, Lahore Campus — Auditorium",
        organizer: "Dept. of Computer Science, Riphah",
        image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=500&auto=format&fit=crop",
        totalSeats: 200,
        registeredStudents: [],
        isMock: true,
      },
      {
        title: "Full-Stack Web Dev Bootcamp",
        description:
          "A hands-on one-day bootcamp covering React, Node.js, and MongoDB from scratch.",
        type: "Workshop",
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        time: "10:00 AM – 6:00 PM",
        location: "Riphah International University, Rawalpindi Campus — CS Lab 3",
        organizer: "Riphah Tech Society",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=500&auto=format&fit=crop",
        totalSeats: 60,
        registeredStudents: [],
        isMock: true,
      },
      {
        title: "Digital Marketing Masterclass",
        description:
          "Learn SEO, social media strategy, content marketing, and paid ads from professionals.",
        type: "Webinar",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        time: "6:00 PM – 8:00 PM",
        location: "Online via Zoom — Link sent upon registration",
        organizer: "Riphah Business School",
        image: "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=500&auto=format&fit=crop",
        totalSeats: 300,
        registeredStudents: [],
        isMock: true,
      },
      {
        title: "Startup Founders Networking Night",
        description:
          "Connect with startup founders, angel investors, and fellow student entrepreneurs.",
        type: "Networking",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        time: "7:00 PM – 10:00 PM",
        location: "Riphah International University, F-7 Campus — Rooftop Lounge",
        organizer: "Riphah Innovation & Entrepreneurship Cell",
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=500&auto=format&fit=crop",
        totalSeats: 80,
        registeredStudents: [],
        isMock: true,
      },
      {
        title: "Cybersecurity Essentials Workshop",
        description:
          "Covers ethical hacking basics, network security, and OWASP Top 10 vulnerabilities.",
        type: "Workshop",
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        time: "9:00 AM – 1:00 PM",
        location: "Riphah International University, Islamabad Campus — IT Block",
        organizer: "Dept. of Cybersecurity, Riphah",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=500&auto=format&fit=crop",
        totalSeats: 50,
        registeredStudents: [],
        isMock: true,
      },
      {
        title: "Cloud Computing Basics Bootcamp",
        type: "Workshop",
        date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        time: "11:00 AM – 3:00 PM",
        location: "Riphah Islamabad Campus — Lab 2",
        organizer: "Cloud Tech Society",
        description:
          "Learn AWS, Azure basics and deployment fundamentals in this beginner-friendly workshop.",
        totalSeats: 70,
        registeredStudents: [],
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500&auto=format&fit=crop",
        isMock: true,
      },
      {
        title: "Freelancing & Fiverr Growth Seminar",
        type: "Seminar",
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        time: "3:00 PM – 6:00 PM",
        location: "Riphah Rawalpindi Campus — Seminar Hall",
        organizer: "Career Development Cell",
        description:
          "Learn how to start freelancing, get clients and grow your Fiverr profile.",
        totalSeats: 150,
        registeredStudents: [],
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=500&auto=format&fit=crop",
        isMock: true,
      },
      {
        title: "Mobile App Development with React Native",
        type: "Workshop",
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        time: "10:00 AM – 5:00 PM",
        location: "CS Lab 1 — Islamabad Campus",
        organizer: "Riphah Dev Society",
        description: "Build real mobile apps using React Native, Expo, and APIs.",
        totalSeats: 60,
        registeredStudents: [],
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=500&auto=format&fit=crop",
        isMock: true,
      },
      {
        title: "Data Science Career Roadmap",
        type: "Seminar",
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        time: "1:00 PM – 4:00 PM",
        location: "Riphah Auditorium — Lahore Campus",
        organizer: "AI & DS Department",
        description:
          "Understand roadmap, tools, and skills needed for data science careers.",
        totalSeats: 180,
        registeredStudents: [],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500&auto=format&fit=crop",
        isMock: true,
      },
      {
        title: "Women in Tech Networking Event",
        type: "Networking",
        date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        time: "5:00 PM – 8:00 PM",
        location: "Riphah F-7 Campus — Conference Hall",
        organizer: "Women Tech Initiative",
        description:
          "A networking event empowering women in tech to connect and grow together.",
        totalSeats: 100,
        registeredStudents: [],
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=500&auto=format&fit=crop",
        isMock: true,
      },
      {
        title: "Ethical Hacking Hands-on Lab",
        type: "Workshop",
        date: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        time: "9:00 AM – 2:00 PM",
        location: "Cyber Lab — Islamabad Campus",
        organizer: "Cybersecurity Club",
        description:
          "Practical lab on penetration testing, tools, and network security.",
        totalSeats: 50,
        registeredStudents: [],
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=500&auto=format&fit=crop",
        isMock: true,
      },
      {
        title: "Startup Pitch Competition 2025",
        type: "Networking",
        date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        time: "10:00 AM – 6:00 PM",
        location: "Riphah Innovation Hub — Main Hall",
        organizer: "Entrepreneurship Cell",
        description:
          "Pitch your startup idea in front of investors and win funding opportunities.",
        totalSeats: 120,
        registeredStudents: [],
        image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=500&auto=format&fit=crop",
        isMock: true,
      },
      {
        title: "AI Tools for Students Masterclass",
        type: "Webinar",
        date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
        time: "7:00 PM – 9:00 PM",
        location: "Online via Google Meet — Link shared after registration",
        organizer: "Riphah AI Society",
        description:
          "Explore ChatGPT, automation tools, and AI productivity hacks for students and developers.",
        totalSeats: 250,
        registeredStudents: [],
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=500&auto=format&fit=crop",
        isMock: true,
      },
    ];

    await Event.insertMany(mockEvents);
    res.json({ message: "Mock events seeded!", count: mockEvents.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET All Events ───────────────────────────────────────────────────────────
// ✅ FIX: Returns registeredCount (number) + isRegistered (boolean per student)
// Instead of exposing the full registeredStudents array to everyone
// router.get("/", async (req, res) => {
//   try {
//     const { email } = req.query; // student's own email passed from frontend
//     const events = await Event.find().sort({ date: 1 });

//     const result = events.map((event) => ({
//       _id: event._id,
//       title: event.title,
//       type: event.type,
//       date: event.date,
//       time: event.time,
//       location: event.location,
//       organizer: event.organizer,
//       description: event.description,
//       totalSeats: event.totalSeats,
//       image: event.image,
//       isMock: event.isMock,
//       createdAt: event.createdAt,
//       // ✅ Only count — never expose other students' emails
//       // registeredCount: event.registeredStudents.length,
//      registeredCount: (event.registeredStudents ?? []).length,   // ✅ fix
//       isRegistered: email ? (event.registeredStudents ?? []).includes(email) : false,  // ✅ fix

//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });




router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    const events = await Event.find().sort({ date: 1 });

    const result = events.map((event) => ({
      _id: event._id,
      title: event.title,
      type: event.type,
      date: event.date,
      time: event.time,
      location: event.location,
      organizer: event.organizer,
      description: event.description,
      totalSeats: event.totalSeats,
      image: event.image,
      isMock: event.isMock,
      createdAt: event.createdAt,
      registeredCount: (event.registeredStudents ?? []).length,
      isRegistered: email ? (event.registeredStudents ?? []).includes(email) : false,
    }));  

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── POST Register for Event ──────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { studentEmail, eventTitle } = req.body;

    if (!studentEmail || !eventTitle) {
      return res
        .status(400)
        .json({ error: "studentEmail and eventTitle required" });
    }

    const event = await Event.findOne({ title: eventTitle });
    if (!event) return res.status(404).json({ error: "Event not found" });

    // ✅ Check already registered
    if (event.registeredStudents.includes(studentEmail)) {
      return res
        .status(400)
        .json({ error: "Already registered for this event!" });
    }

    // ✅ Check seats available
    if (event.registeredStudents.length >= event.totalSeats) {
      return res.status(400).json({ error: "Event is full. No seats available." });
    }

    event.registeredStudents.push(studentEmail);
    await event.save();

    // Save notification in DB
    // await Notification.create({
    //   studentEmail,
    //   title: "Event Registration Confirmed! 📅",
    //   message: `You're registered for "${event.title}" on ${new Date(
    //     event.date
    //   ).toDateString()} at ${event.time}.`,
    //   type: "event",
    // });
    await notifyStudent(req, {
        studentEmail,
        title: "Event Registration Confirmed! 📅",
        message: `You're registered for "${event.title}" on ${new Date(event.date).toDateString()} at ${event.time}.`,
        type: "event",
    });

    res.json({ message: "Registered successfully!", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET Registered Events for Student ───────────────────────────────────────
router.get("/registered/:email", async (req, res) => {
  try {
    const events = await Event.find({
      registeredStudents: req.params.email,
    });

    // ✅ Return same sanitized format
    const result = events.map((event) => ({
      _id: event._id,
      title: event.title,
      type: event.type,
      date: event.date,
      time: event.time,
      location: event.location,
      organizer: event.organizer,
      description: event.description,
      totalSeats: event.totalSeats,
      image: event.image,
      registeredCount: event.registeredStudents.length,
      isRegistered: true, // always true for this route
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

//postman
// http://localhost:5000/api/events/seed