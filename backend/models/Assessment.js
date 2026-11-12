import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    assessmentKey: { type: String, required: true, unique: true },
    citizenId: { type: String, required: true },
    schemeId: { type: String, required: true },
    outcome: { type: String, required: true },
    answers: { type: mongoose.Schema.Types.Mixed, default: {} },
    performedBy: { type: String, default: "Self" },
    date: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Assessment", assessmentSchema);
