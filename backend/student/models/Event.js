import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: { type: String, enum: ["Job Fair", "Seminar", "Workshop", "Webinar", "Networking"], default: "Seminar" },
  date: Date,
  time: String,
  location: String,
  organizer: String,
  image: String,
  totalSeats: { type: Number, default: 100 }, // ✅ YEH ADD KARO
  registeredStudents: [{ type: String }], // array of emails
  isMock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});





const Event =
  // mongoose.models.Event || mongoose.model("Event", eventSchema);


    mongoose.models.StudentEvent || mongoose.model("StudentEvent", eventSchema, "studentevents");


export default Event;