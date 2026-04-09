
/**
 * ─────────────────────────────────────────────────────
 * backend/models/Mou.js  — Updated schema with meeting slots
 * ─────────────────────────────────────────────────────
 */

import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  date: { type: String },
  time: { type: String, default: "" },
  note: { type: String, default: "" },
}, { _id: false });

const optionSchema = new mongoose.Schema({
  date: { type: String },
  time: { type: String },
  note: { type: String, default: "" },
}, { _id: false });

const meetingSchema = new mongoose.Schema({
  date:      { type: String },
  time:      { type: String },
  venue:     { type: String },
  agenda:    { type: String },
  menu:      { type: String },
  attendees: { type: String },
  options:   { type: [optionSchema], default: [] },
  confirmedSlot:        { type: slotSchema, default: null },
  confirmedAt:          { type: String, default: null },
  industryProposedSlot: { type: slotSchema, default: null },
  industryProposedAt:   { type: String, default: null },
}, { _id: false });

const changeSchema = new mongoose.Schema({
  field:    String, oldValue: String, newValue: String, reason: String, date: String,
}, { _id: false });

const stampSchema = new mongoose.Schema({
  by: String, type: String, date: String, note: String,
}, { _id: false });

const logSchema = new mongoose.Schema({
  id: Number, type: String, date: String, party: String,
  from: String, message: String, action: String,
  field: String, oldValue: String, newValue: String,
}, { _id: false });

const mouSchema = new mongoose.Schema({
  title:             { type: String, required: true },
  university:        { type: String, required: true },
  industry:          { type: String, required: true },
  industryId:        { type: String },
  collaborationType: { type: String, required: true },
  startDate:         { type: String, required: true },
  endDate:           { type: String, required: true },
  description:       { type: String, default: "" },

  objectives:   { type: [String], default: [] },
  terms:        { type: [String], default: [] },
  responsibilities: {
    university: { type: [String], default: [] },
    industry:   { type: [String], default: [] },
  },
  signatories: {
    university: { type: String, default: "" },
    industry:   { type: String, default: "" },
  },
  universityContact: {
    name: String, designation: String, email: String,
  },
  industryContact: {
    name: String, designation: String, email: String,
  },

  status: {
    type: String, default: "Draft",
    enum: ["Draft","Sent to Industry","Changes Proposed","Approved by Industry",
           "Approved by University","Mutually Approved","Rejected"],
  },

  sentAt:              { type: String, default: null },
  industryResponseAt:  { type: String, default: null },
  proposedChanges:     { type: [changeSchema], default: [] },
  universityStamp:     { type: stampSchema, default: null },
  industryStamp:       { type: stampSchema, default: null },
  scheduledMeeting:    { type: meetingSchema, default: null },
  changeLog:           { type: [logSchema], default: [] },

  universityLogo: { type: String, default: "" },
  industryLogo:   { type: String, default: "" },

  mouNumber: { type: String, default: null, sparse: true },
}, { timestamps: true });

mongoose.connection.once("open", async () => {
  try {
    await mongoose.connection.collection("mous").dropIndex("mouNumber_1");
  } catch {}
});

export default mongoose.model("Mou", mouSchema);











