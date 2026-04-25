import Profile from "../models/Profile.js";
import multer  from "multer";
import path    from "path";
import fs      from "fs";

// ── Multer setup for profile-logo upload ───────────────────────────
const uploadDir = "uploads/profile/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename:    (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

export const uploadLogo = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },           // 8 MB cap
  fileFilter: (_, file, cb) => {
    const ok = [".jpg", ".jpeg", ".png", ".webp"];
    if (ok.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
}).single("logo");

// ─────────────────────────────────────────────────────────────
//  GET  /api/industry/auth/profile?email=xxx
// ─────────────────────────────────────────────────────────────
export const getProfile = async (req, res) => {
  try {
    const email = req.query.email?.toLowerCase().trim();

    if (!email) {
      return res.status(400).json({ message: "email query param is required" });
    }

    let company = await Profile.findOne({ email });

    if (!company) {
      return res.status(200).json({
        company: {
          email,
          name: "",
          industry: "",
          website: "",
          address: "",
          about: "",
          phone: "",
          logo: "",
          verified: false,
        },
      });
    }

    return res.status(200).json({ company });
  } catch (err) {
    console.error("[getProfile]", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
//  PUT  /api/industry/auth/profile
//  Accepts EITHER multipart/form-data (with a `logo` file field)
//  OR plain JSON (with `logo` as a base64 data URI / URL string).
// ─────────────────────────────────────────────────────────────
export const updateProfile = (req, res) => {
  console.log("\n[updateProfile] ▶ PUT /api/industry/auth/profile arrived");
  console.log("[updateProfile]   Content-Type:", req.headers["content-type"]);

  // Run multer first; it no-ops if the request isn't multipart.
  uploadLogo(req, res, async (uploadErr) => {
    if (uploadErr) {
      console.log("[updateProfile] ❌ multer error:", uploadErr.message);
      return res.status(400).json({ message: uploadErr.message });
    }

    console.log("[updateProfile]   req.file:", req.file
      ? `received → ${req.file.filename} (${req.file.size} bytes)`
      : "NONE");
    console.log("[updateProfile]   req.body keys:", Object.keys(req.body || {}));
    console.log("[updateProfile]   req.body.logo type/preview:",
      typeof req.body.logo,
      req.body.logo ? String(req.body.logo).substring(0, 60) + "…" : "(missing)"
    );

    try {
      const {
        email,
        name,
        industry,
        website,
        address,
        about,
        phone,
      } = req.body;

      if (!email) {
        return res.status(400).json({ message: "email is required" });
      }
      const normalizedEmail = email.toLowerCase().trim();

      // ── Resolve the logo value ────────────────────────────────
      // 1. If a file was uploaded → store the public URL.
      // 2. Else if logo is a real data URI / http URL in the body → keep it.
      // 3. Else if logo is a local file:// path → IGNORE it (don't pollute DB).
      // 4. Else if logo === "" → explicit clear.
      let logoValue;            // undefined means "don't change"
      if (req.file) {
        logoValue = `${req.protocol}://${req.get("host")}/uploads/profile/${req.file.filename}`;
      } else if (typeof req.body.logo === "string") {
        const candidate = req.body.logo.trim();
        if (candidate === "") {
          logoValue = "";                                                  // clear
        } else if (candidate.startsWith("data:") || /^https?:\/\//i.test(candidate)) {
          logoValue = candidate;                                           // valid
        }
        // else: file:// or other junk → leave logoValue undefined (no change)
      }

      const updateFields = {};
      if (name     !== undefined) updateFields.name     = name;
      if (industry !== undefined) updateFields.industry = industry;
      if (website  !== undefined) updateFields.website  = website;
      if (address  !== undefined) updateFields.address  = address;
      if (about    !== undefined) updateFields.about    = about;
      if (phone    !== undefined) updateFields.phone    = phone;
      if (logoValue !== undefined) updateFields.logo    = logoValue;

      console.log("[updateProfile]   ↪ writing fields:", Object.keys(updateFields));
      console.log("[updateProfile]   ↪ logo to save:",
        updateFields.logo
          ? String(updateFields.logo).substring(0, 80) + "…"
          : "(unchanged / not in payload)"
      );

      const company = await Profile.findOneAndUpdate(
        { email: normalizedEmail },
        { $set: updateFields },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
      );

      console.log("[updateProfile] ✓ saved. DB logo now:",
        company.logo ? String(company.logo).substring(0, 80) + "…" : "(empty)");

      return res.status(200).json({
        message: "Profile updated successfully",
        company,
      });
    } catch (err) {
      console.error("[updateProfile] ❌", err);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  });
};
