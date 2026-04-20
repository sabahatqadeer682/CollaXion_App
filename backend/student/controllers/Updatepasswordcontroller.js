



// import Student from "../models/Student.js";

// // ─────────────────────────────────────────────────────────────
// // PUT /api/student/update-password
// // Body: { email, currentPassword, newPassword }
// // ─────────────────────────────────────────────────────────────
// export const updatePassword = async (req, res) => {
//     try {
//         const { email, currentPassword, newPassword } = req.body;

//         // 1️⃣  Validate required fields
//         if (!email || !currentPassword || !newPassword) {
//             return res.status(400).json({
//                 success: false,
//                 message: "email, currentPassword aur newPassword required hain.",
//             });
//         }

//         // 2️⃣  New password length check
//         if (newPassword.length < 8) {
//             return res.status(400).json({
//                 success: false,
//                 message: "New password kam az kam 8 characters ka hona chahiye.",
//             });
//         }

//         // 3️⃣  Find student
//         const student = await Student.findOne({ email });
//         if (!student) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Student nahi mila is email se.",
//             });
//         }

//         // 4️⃣  Verify current password (plain text)
//         if (currentPassword !== student.password) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Current password galat hai.",
//             });
//         }

//         // 5️⃣  Make sure new != current
//         if (newPassword === student.password) {
//             return res.status(400).json({
//                 success: false,
//                 message: "New password current password se alag hona chahiye.",
//             });
//         }

//         // 6️⃣  Plain text save — Compass mein seedha dikhega ✅
//         student.password = newPassword;
//         await student.save();

//         return res.status(200).json({
//             success: true,
//             message: "Password successfully update ho gaya! ✓",
//         });

//     } catch (error) {
//         console.error("updatePassword error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Server error. Dobara try karo.",
//             error: error.message,
//         });
//     }
// };




// import Student from "../models/Student.js";
// import nodemailer from "nodemailer";

// // ─── Email Transporter ────────────────────────────────────────
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// // ─────────────────────────────────────────────────────────────
// // PUT /api/student/update-password
// // Body: { email, currentPassword, newPassword }
// // ─────────────────────────────────────────────────────────────
// export const updatePassword = async (req, res) => {
//     try {
//         const { email, currentPassword, newPassword } = req.body;

//         // 1️⃣  Validate required fields
//         if (!email || !currentPassword || !newPassword) {
//             return res.status(400).json({
//                 success: false,
//                 message: "email, currentPassword aur newPassword required hain.",
//             });
//         }

//         // 2️⃣  New password length check
//         if (newPassword.length < 8) {
//             return res.status(400).json({
//                 success: false,
//                 message: "New password kam az kam 8 characters ka hona chahiye.",
//             });
//         }

//         // 3️⃣  Find student
//         const student = await Student.findOne({ email });
//         if (!student) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Student nahi mila is email se.",
//             });
//         }

//         // 4️⃣  Verify current password (plain text)
//         if (currentPassword !== student.password) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Current password galat hai.",
//             });
//         }

//         // 5️⃣  Make sure new != current
//         if (newPassword === student.password) {
//             return res.status(400).json({
//                 success: false,
//                 message: "New password current password se alag hona chahiye.",
//             });
//         }

//         // 6️⃣  Plain text save
//         student.password = newPassword;
//         await student.save();

//         // 7️⃣  Email notification bhejo
//         const now = new Date();
//         const dateStr = now.toLocaleString("en-PK", {
//             timeZone: "Asia/Karachi",
//             dateStyle: "full",
//             timeStyle: "short",
//         });

//         try {
//             await transporter.sendMail({
//                 from: `"CollaXion Security" <${process.env.EMAIL_USER}>`,
//                 to: email,
//                 subject: "✅ Password Successfully Changed — CollaXion",
//                 html: `
//                 <!DOCTYPE html>
//                 <html>
//                 <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
//                     <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
//                         <tr>
//                             <td align="center">
//                                 <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                                    
//                                     <!-- Header -->
//                                     <tr>
//                                         <td style="background:#193648;padding:28px 32px;text-align:center;">
//                                             <h1 style="color:#ffffff;margin:0;font-size:22px;letter-spacing:1px;">CollaXion</h1>
//                                             <p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:13px;">Where Collaboration Meets Innovation</p>
//                                         </td>
//                                     </tr>

//                                     <!-- Icon -->
//                                     <tr>
//                                         <td style="padding:32px 32px 0;text-align:center;">
//                                             <div style="width:64px;height:64px;background:#EEF0FD;border-radius:50%;margin:0 auto;display:flex;align-items:center;justify-content:center;">
//                                                 <span style="font-size:32px;">🔐</span>
//                                             </div>
//                                         </td>
//                                     </tr>

//                                     <!-- Body -->
//                                     <tr>
//                                         <td style="padding:20px 32px 32px;">
//                                             <h2 style="color:#2C3E50;font-size:18px;margin:0 0 12px;">Password Changed Successfully</h2>
//                                             <p style="color:#7F8C8D;font-size:14px;line-height:1.7;margin:0 0 20px;">
//                                                 Dear <strong style="color:#2C3E50;">${student.fullName}</strong>,<br/><br/>
//                                                 Your CollaXion account password has been successfully updated.
//                                             </p>

//                                             <!-- Info Box -->
//                                             <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-radius:10px;border:1px solid #E8ECF0;margin-bottom:20px;">
//                                                 <tr>
//                                                     <td style="padding:16px 20px;">
//                                                         <p style="margin:0 0 8px;font-size:13px;color:#7F8C8D;">📧 Account</p>
//                                                         <p style="margin:0 0 14px;font-size:14px;color:#2C3E50;font-weight:600;">${email}</p>
//                                                         <p style="margin:0 0 8px;font-size:13px;color:#7F8C8D;">🕐 Changed At</p>
//                                                         <p style="margin:0;font-size:14px;color:#2C3E50;font-weight:600;">${dateStr}</p>
//                                                     </td>
//                                                 </tr>
//                                             </table>

//                                             <!-- Warning -->
//                                             <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8E7;border-radius:10px;border:1px solid #F39C12;margin-bottom:24px;">
//                                                 <tr>
//                                                     <td style="padding:14px 18px;">
//                                                         <p style="margin:0;font-size:13px;color:#856404;line-height:1.6;">
//                                                             ⚠️ <strong>Yeh aap nahi thay?</strong> Agar aap ne password nahi badla toh foran 
//                                                             <a href="mailto:collaxionteam@gmail.com" style="color:#5B6FE6;">collaxionteam@gmail.com</a> 
//                                                             pe contact karo.
//                                                         </p>
//                                                     </td>
//                                                 </tr>
//                                             </table>

//                                             <p style="color:#7F8C8D;font-size:13px;margin:0;">
//                                                 Stay safe,<br/>
//                                                 <strong style="color:#2C3E50;">The CollaXion Team</strong>
//                                             </p>
//                                         </td>
//                                     </tr>

//                                     <!-- Footer -->
//                                     <tr>
//                                         <td style="background:#F8FAFC;padding:16px 32px;text-align:center;border-top:1px solid #EEE;">
//                                             <p style="margin:0;font-size:11px;color:#BDC3C7;">
//                                                 © 2025 CollaXion • collaxionteam@gmail.com
//                                             </p>
//                                         </td>
//                                     </tr>

//                                 </table>
//                             </td>
//                         </tr>
//                     </table>
//                 </body>
//                 </html>
//                 `,
//             });
//             console.log("✅ Password change email sent to:", email);
//         } catch (emailErr) {
//             // Email fail hone se password update fail nahi hoga
//             console.error("Email send failed:", emailErr.message);
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Password successfully update ho gaya! ✓",
//         });

//     } catch (error) {
//         console.error("updatePassword error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Server error. Dobara try karo.",
//             error: error.message,
//         });
//     }
// };




// import dotenv from "dotenv";
// dotenv.config();

// import Student from "../models/Student.js";
// import nodemailer from "nodemailer";

// // ─── Email Transporter ────────────────────────────────────────
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// // ─────────────────────────────────────────────────────────────
// // PUT /api/student/update-password
// // Body: { email, currentPassword, newPassword }
// // ─────────────────────────────────────────────────────────────
// export const updatePassword = async (req, res) => {
//     try {
//         const { email, currentPassword, newPassword } = req.body;

//         // 1️⃣  Validate required fields
//         if (!email || !currentPassword || !newPassword) {
//             return res.status(400).json({
//                 success: false,
//                 message: "email, currentPassword aur newPassword required hain.",
//             });
//         }

//         // 2️⃣  New password length check
//         if (newPassword.length < 8) {
//             return res.status(400).json({
//                 success: false,
//                 message: "New password kam az kam 8 characters ka hona chahiye.",
//             });
//         }

//         // 3️⃣  Find student
//         const student = await Student.findOne({ email });
//         if (!student) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Student nahi mila is email se.",
//             });
//         }

//         // 4️⃣  Verify current password (plain text)
//         if (currentPassword !== student.password) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Current password galat hai.",
//             });
//         }

//         // 5️⃣  Make sure new != current
//         if (newPassword === student.password) {
//             return res.status(400).json({
//                 success: false,
//                 message: "New password current password se alag hona chahiye.",
//             });
//         }

//         // 6️⃣  Plain text save
//         student.password = newPassword;
//         await student.save();

//         // 7️⃣  Email notification bhejo
//         const now = new Date();
//         const dateStr = now.toLocaleString("en-PK", {
//             timeZone: "Asia/Karachi",
//             dateStyle: "full",
//             timeStyle: "short",
//         });

//         try {
//             await transporter.sendMail({
//                 from: `"CollaXion Security" <${process.env.EMAIL_USER}>`,
//                 to: email,
//                 subject: "✅ Password Successfully Changed — CollaXion",
//                 html: `
//                 <!DOCTYPE html>
//                 <html>
//                 <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
//                     <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
//                         <tr>
//                             <td align="center">
//                                 <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                                    
//                                     <!-- Header -->
//                                     <tr>
//                                         <td style="background:#193648;padding:28px 32px;text-align:center;">
//                                             <h1 style="color:#ffffff;margin:0;font-size:22px;letter-spacing:1px;">CollaXion</h1>
//                                             <p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:13px;">Where Collaboration Meets Innovation</p>
//                                         </td>
//                                     </tr>

//                                     <!-- Icon -->
//                                     <tr>
//                                         <td style="padding:32px 32px 0;text-align:center;">
//                                             <div style="width:64px;height:64px;background:#EEF0FD;border-radius:50%;margin:0 auto;">
//                                                 <span style="font-size:32px;line-height:64px;">🔐</span>
//                                             </div>
//                                         </td>
//                                     </tr>

//                                     <!-- Body -->
//                                     <tr>
//                                         <td style="padding:20px 32px 32px;">
//                                             <h2 style="color:#2C3E50;font-size:18px;margin:0 0 12px;">Password Changed Successfully</h2>
//                                             <p style="color:#7F8C8D;font-size:14px;line-height:1.7;margin:0 0 20px;">
//                                                 Dear <strong style="color:#2C3E50;">${student.fullName}</strong>,<br/><br/>
//                                                 Your CollaXion account password has been successfully updated.
//                                             </p>

//                                             <!-- Info Box -->
//                                             <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-radius:10px;border:1px solid #E8ECF0;margin-bottom:20px;">
//                                                 <tr>
//                                                     <td style="padding:16px 20px;">
//                                                         <p style="margin:0 0 8px;font-size:13px;color:#7F8C8D;">📧 Account</p>
//                                                         <p style="margin:0 0 14px;font-size:14px;color:#2C3E50;font-weight:600;">${email}</p>
//                                                         <p style="margin:0 0 8px;font-size:13px;color:#7F8C8D;">🕐 Changed At</p>
//                                                         <p style="margin:0;font-size:14px;color:#2C3E50;font-weight:600;">${dateStr}</p>
//                                                     </td>
//                                                 </tr>
//                                             </table>

//                                             <!-- Warning -->
//                                             <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8E7;border-radius:10px;border:1px solid #F39C12;margin-bottom:24px;">
//                                                 <tr>
//                                                     <td style="padding:14px 18px;">
//                                                         <p style="margin:0;font-size:13px;color:#856404;line-height:1.6;">
//                                                             ⚠️ <strong>Yeh aap nahi thay?</strong> Agar aap ne password nahi badla toh foran 
//                                                             <a href="mailto:collaxionteam@gmail.com" style="color:#5B6FE6;">collaxionteam@gmail.com</a> 
//                                                             pe contact karo.
//                                                         </p>
//                                                     </td>
//                                                 </tr>
//                                             </table>

//                                             <p style="color:#7F8C8D;font-size:13px;margin:0;">
//                                                 Stay safe,<br/>
//                                                 <strong style="color:#2C3E50;">The CollaXion Team</strong>
//                                             </p>
//                                         </td>
//                                     </tr>

//                                     <!-- Footer -->
//                                     <tr>
//                                         <td style="background:#F8FAFC;padding:16px 32px;text-align:center;border-top:1px solid #EEE;">
//                                             <p style="margin:0;font-size:11px;color:#BDC3C7;">
//                                                 © 2026 CollaXion • collaxionteam@gmail.com
//                                             </p>
//                                         </td>
//                                     </tr>

//                                 </table>
//                             </td>
//                         </tr>
//                     </table>
//                 </body>
//                 </html>
//                 `,
//             });
//             console.log("✅ Password change email sent to:", email);
//         } catch (emailErr) {
//             console.error("Email send failed:", emailErr.message);
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Password successfully update ho gaya! ✓",
//         });

//     } catch (error) {
//         console.error("updatePassword error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Server error. Dobara try karo.",
//             error: error.message,
//         });
//     }
// };





import dotenv from "dotenv";
dotenv.config();

import Student from "../models/Student.js";
import nodemailer from "nodemailer";

// ─── Email Transporter ────────────────────────────────────────
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ─────────────────────────────────────────────────────────────
// PUT /api/student/update-password
// Body: { email, currentPassword, newPassword }
// ─────────────────────────────────────────────────────────────
export const updatePassword = async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;

        // 1️⃣ Validate required fields
        if (!email || !currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, currentPassword and newPassword are required.",
            });
        }

        // 2️⃣ New password length check
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters long.",
            });
        }

        // 3️⃣ Find student
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "No student found with this email.",
            });
        }

        // 4️⃣ Verify current password (plain text)
        if (currentPassword !== student.password) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect.",
            });
        }

        // 5️⃣ Make sure new != current
        if (newPassword === student.password) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from current password.",
            });
        }

        // 6️⃣ Save new password
        student.password = newPassword;
        await student.save();

        // 7️⃣ Email notification
        const now = new Date();
        const dateStr = now.toLocaleString("en-PK", {
            timeZone: "Asia/Karachi",
            dateStyle: "full",
            timeStyle: "short",
        });

        try {
            await transporter.sendMail({
                from: `"CollaXion Security" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "Password Successfully Changed — CollaXion",
                html: `
                <!DOCTYPE html>
                <html>
                <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
                        <tr>
                            <td align="center">
                                <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                                    
                                    <!-- Header -->
                                    <tr>
                                        <td style="background:#193648;padding:28px 32px;text-align:center;">
                                            <h1 style="color:#ffffff;margin:0;font-size:22px;letter-spacing:1px;">CollaXion</h1>
                                            <p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:13px;">Where Collaboration Meets Innovation</p>
                                        </td>
                                    </tr>

                                    <!-- Icon -->
                                    <tr>
                                        <td style="padding:32px 32px 0;text-align:center;">
                                            <div style="width:64px;height:64px;background:#EEF0FD;border-radius:50%;margin:0 auto;">
                                                <span style="font-size:32px;line-height:64px;">🔐</span>
                                            </div>
                                        </td>
                                    </tr>

                                    <!-- Body -->
                                    <tr>
                                        <td style="padding:20px 32px 32px;">
                                            <h2 style="color:#2C3E50;font-size:18px;margin:0 0 12px;">Password Changed Successfully</h2>
                                            <p style="color:#7F8C8D;font-size:14px;line-height:1.7;margin:0 0 20px;">
                                                Dear <strong style="color:#2C3E50;">${student.fullName}</strong>,<br/><br/>
                                                Your CollaXion account password has been successfully updated.
                                            </p>

                                            <!-- Info Box -->
                                            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-radius:10px;border:1px solid #E8ECF0;margin-bottom:20px;">
                                                <tr>
                                                    <td style="padding:16px 20px;">
                                                        <p style="margin:0 0 8px;font-size:13px;color:#7F8C8D;">Email Account</p>
                                                        <p style="margin:0 0 14px;font-size:14px;color:#2C3E50;font-weight:600;">${email}</p>
                                                        <p style="margin:0 0 8px;font-size:13px;color:#7F8C8D;">Changed At</p>
                                                        <p style="margin:0;font-size:14px;color:#2C3E50;font-weight:600;">${dateStr}</p>
                                                    </td>
                                                </tr>
                                            </table>

                                            <!-- Warning -->
                                            <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8E7;border-radius:10px;border:1px solid #F39C12;margin-bottom:24px;">
                                                <tr>
                                                    <td style="padding:14px 18px;">
                                                        <p style="margin:0;font-size:13px;color:#856404;line-height:1.6;">
                                                            ⚠️ <strong>Not you?</strong> If you did not change your password, immediately contact 
                                                            <a href="mailto:collaxionteam@gmail.com" style="color:#5B6FE6;">collaxionteam@gmail.com</a>.
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>

                                            <p style="color:#7F8C8D;font-size:13px;margin:0;">
                                                Stay safe,<br/>
                                                <strong style="color:#2C3E50;">The CollaXion Team</strong>
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="background:#F8FAFC;padding:16px 32px;text-align:center;border-top:1px solid #EEE;">
                                            <p style="margin:0;font-size:11px;color:#BDC3C7;">
                                                © 2026 CollaXion • collaxionteam@gmail.com
                                            </p>
                                        </td>
                                    </tr>

                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                `,
            });

            console.log("✅ Password change email sent to:", email);
        } catch (emailErr) {
            console.error("Email send failed:", emailErr.message);
        }

        return res.status(200).json({
            success: true,
            message: "Password updated successfully!",
        });

    } catch (error) {
        console.error("updatePassword error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again.",
            error: error.message,
        });
    }
};