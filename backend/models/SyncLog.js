import mongoose from "mongoose";

const syncLogSchema = new mongoose.Schema({
  resourceId: { type: String, required: true },
  sourceName: { type: String, default: "" },
  status: { type: String, enum: ["success", "failed"], required: true },
  processed: { type: Number, default: 0 },
  failed: { type: Number, default: 0 },
  error: { type: String, default: "" },
  startedAt: Date,
  completedAt: Date
});

export default mongoose.model("SyncLog", syncLogSchema);
