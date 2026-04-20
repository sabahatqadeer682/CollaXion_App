// import mongoose from "mongoose";

// const industrySchema = new mongoose.Schema({
//   placeId: { type: String, unique: true, required: true }, // Google Place ID
//   name: String,
//   address: String,
//   location: {
//     lat: Number,
//     lng: Number
//   },
//   status: { type: String, default: 'Approved' } // Approved industries only
// });

// export default mongoose.model("Industry", industrySchema);


import mongoose from 'mongoose';

// ── Internship sub-schema (embedded in Industry) ─────────────────
const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },          // e.g. "Frontend Developer Intern"
  type: { type: String, default: 'Onsite' },        // Onsite / Remote / Hybrid
  duration: { type: String, default: '2 months' },
  stipend: { type: String, default: 'Unpaid' },
  deadline: { type: Date },
  isOpen: { type: Boolean, default: true },
}, { timestamps: true });

// ── Main Industry schema ──────────────────────────────────────────
const industrySchema = new mongoose.Schema({
  placeId:  { type: String, unique: true, required: true }, // Google Place ID
  name:     { type: String, required: true },
  address:  { type: String },
  website:  { type: String }, 

  
  
  
  
  // e.g. https://techvision.com.pk
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  status:       { type: String, default: 'Approved' },      // Approved | Pending | Rejected
  internships:  { type: [internshipSchema], default: [] },
}, { timestamps: true });

export default mongoose.model('Industry', industrySchema);

