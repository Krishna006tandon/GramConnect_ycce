import mongoose from "mongoose";

const assistanceLogSchema = new mongoose.Schema(
  {
    logKey: { type: String, required: true, unique: true },
    citizenId: { type: String, required: true },
    operatorName: { type: String, default: "CSC Operator" },
    action: { type: String, default: "" },
    date: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("AssistanceLog", assistanceLogSchema);
