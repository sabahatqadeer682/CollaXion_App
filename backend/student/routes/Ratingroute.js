import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { notifyStudent } from "../utils/notify.js";
dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

router.post("/send-rating", async (req, res) => {
    try {
        const { stars, feedback, studentEmail } = req.body;

        if (!stars || stars < 1 || stars > 5) {
            return res.status(400).json({ success: false, message: "Invalid rating." });
        }

        const starEmojis = ["","⭐","⭐⭐","⭐⭐⭐","⭐⭐⭐⭐","⭐⭐⭐⭐⭐"];
        const labels = ["","Poor","Fair","Good","Great","Excellent"];

        await transporter.sendMail({
            from: `"CollaXion App" <${process.env.EMAIL_USER}>`,
            to: process.env.TEAM_EMAIL || "collaxionsupport@gmail.com",
            subject: `${starEmojis[stars]} New Rating: ${labels[stars]} (${stars}/5) — CollaXion`,
            html: `
            <!DOCTYPE html><html><body style="margin:0;padding:0;background:#f0f4f7;font-family:Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
              <tr><td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                  <tr><td style="background:#193648;padding:24px 32px;text-align:center;">
                    <h1 style="color:#fff;margin:0;font-size:20px;">CollaXion</h1>
                    <p style="color:rgba(255,255,255,0.5);margin:4px 0 0;font-size:12px;">New App Rating Received</p>
                  </td></tr>
                  <tr><td style="padding:28px 32px 0;text-align:center;">
                    <div style="font-size:40px;margin-bottom:8px;">${starEmojis[stars]}</div>
                    <h2 style="color:#1A2E3B;margin:0;font-size:22px;">${labels[stars]}</h2>
                    <p style="color:#6B8A9A;font-size:14px;margin:4px 0 0;">${stars} out of 5 stars</p>
                  </td></tr>
                  <tr><td style="padding:20px 32px 28px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4F7;border-radius:12px;margin-bottom:16px;">
                      <tr><td style="padding:16px 20px;">
                        <p style="margin:0 0 6px;font-size:12px;color:#6B8A9A;">👤 Student Email</p>
                        <p style="margin:0 0 14px;font-size:14px;color:#1A2E3B;font-weight:600;">${studentEmail}</p>
                        <p style="margin:0 0 6px;font-size:12px;color:#6B8A9A;">🕐 Submitted At</p>
                        <p style="margin:0;font-size:14px;color:#1A2E3B;font-weight:600;">
                          ${new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi", dateStyle: "full", timeStyle: "short" })}
                        </p>
                      </td></tr>
                    </table>
                    ${feedback ? `
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#EBF5FB;border-radius:12px;border-left:4px solid #2E86AB;">
                      <tr><td style="padding:14px 18px;">
                        <p style="margin:0 0 6px;font-size:12px;color:#6B8A9A;font-weight:700;">💬 Student Feedback</p>
                        <p style="margin:0;font-size:14px;color:#1A2E3B;line-height:1.6;">${feedback}</p>
                      </td></tr>
                    </table>` : `<p style="color:#6B8A9A;font-size:13px;text-align:center;">No written feedback provided.</p>`}
                  </td></tr>
                  <tr><td style="background:#F0F4F7;padding:14px 32px;text-align:center;border-top:1px solid #E2ECF1;">
                    <p style="margin:0;font-size:11px;color:#9AADB8;">© 2025 CollaXion • collaxionsupport@gmail.com</p>
                  </td></tr>
                </table>
              </td></tr>
            </table>
            </body></html>`,
        });

        if (studentEmail) {
            await notifyStudent(req, {
                studentEmail,
                title: "Rating Sent ✨",
                message: `Thanks for your ${stars}-star rating! Your feedback helps us improve.`,
                type: "general",
            });
        }

        return res.status(200).json({ success: true, message: "Rating submitted! Thankyou" });
    } catch (err) {
        console.error("Rating email error:", err);
        return res.status(500).json({ success: false, message: "Rating could not be sent." });
    }
});

export default router;