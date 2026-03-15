import Student from "../models/Student.js";
import nodemailer from "nodemailer";

let verificationCodes = {};

export const registerStudent = async (req, res) => {
    const { fullName, email, password, phone, department, semester, city, address } = req.body;

    // check domain
    if (!email.endsWith("@students.riphah.edu.pk")) {
        return res.status(400).json({ message: "Email must be a valid Riphah student email." });
    }

    // check if already exists
    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered." });

    // generate verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[email] = code;

    // send email
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
        from: "CollaXion Team <no-reply@collaxion.com>",
        to: email,
        subject: "Your CollaXion Verification Code",
        text: `Your verification code is ${code}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Verification code sent successfully." });
};

// verify code
export const verifyStudentCode = async (req, res) => {
    const { email, code, fullName, password, phone, department, semester, city, address } = req.body;

    if (verificationCodes[email] !== code) {
        return res.status(400).json({ message: "Invalid code" });
    }

    const student = new Student({
        fullName,
        email,
        password,
        phone,
        department,
        semester,
        city,
        address,
        verified: true,
    });
    await student.save();

    delete verificationCodes[email];
    res.status(201).json({ message: "Registration successful" });
};
