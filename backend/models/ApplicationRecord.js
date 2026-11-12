import mongoose from "mongoose";

const applicationRecordSchema = new mongoose.Schema(
  {
    appKey: { type: String, required: true, unique: true },
    citizenId: { type: String, required: true },
    schemeId: { type: String, required: true },
    referenceNo: { type: String, default: "" },
    status: { type: String, default: "Preparation pending" },
    notes: { type: String, default: "" },
    assistedBy: { type: String, default: "Self" },
    updatedAtDate: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("ApplicationRecord", applicationRecordSchema);
