import Profile from "../models/Profile.js";

// ─────────────────────────────────────────────────────────────
//  GET  /api/industry/auth/profile?email=xxx
//  Returns the company profile for the given email.
//  If no profile exists yet, returns a blank skeleton so the
//  front-end always has something to display.
// ─────────────────────────────────────────────────────────────
export const getProfile = async (req, res) => {
  try {
    const email = req.query.email?.toLowerCase().trim();

    if (!email) {
      return res.status(400).json({ message: "email query param is required" });
    }

    // findOneAndUpdate with upsert=true acts as "find or create"
    let company = await Profile.findOne({ email });

    if (!company) {
      // Return a blank profile rather than a 404 so the screen
      // can render empty fields immediately
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
//  Body: { email, name, industry, website, address, about,
//          phone, logo }
//  Creates the profile if it doesn't exist; updates otherwise.
// ─────────────────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const {
      email,
      name,
      industry,
      website,
      address,
      about,
      phone,
      logo,
    } = req.body;

    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Build update payload — only include fields that were sent
    const updateFields = {};
    if (name     !== undefined) updateFields.name     = name;
    if (industry !== undefined) updateFields.industry = industry;
    if (website  !== undefined) updateFields.website  = website;
    if (address  !== undefined) updateFields.address  = address;
    if (about    !== undefined) updateFields.about    = about;
    if (phone    !== undefined) updateFields.phone    = phone;
    if (logo     !== undefined) updateFields.logo     = logo;

    const company = await Profile.findOneAndUpdate(
      { email: normalizedEmail },          // filter
      { $set: updateFields },              // update
      {
        new: true,        // return the updated doc
        upsert: true,     // create if not found
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      company,
    });
  } catch (err) {
    console.error("[updateProfile]", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
