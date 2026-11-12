import mongoose from "mongoose";

const citizenSchema = new mongoose.Schema(
  {
    citizenKey: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, default: "" },
    state: { type: String, default: "Maharashtra" },
    district: { type: String, default: "" },
    village: { type: String, default: "" },
    age: { type: Number, default: 0 },
    occupation: { type: String, default: "" },
    income: { type: Number, default: 0 },
    gender: { type: String, default: "Male" },
    category: { type: String, default: "General" },
    consentRecorded: { type: Boolean, default: true },
    registeredBy: { type: String, default: "Self" },
    savedSchemes: { type: [String], default: [] },
    docReadiness: { type: mongoose.Schema.Types.Mixed, default: {} },
    createdAtDate: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Citizen", citizenSchema);
