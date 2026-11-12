import mongoose from "mongoose";

const localizedTextSchema = new mongoose.Schema(
  {
    en: { type: String, default: "" },
    hi: { type: String, default: "" },
    mr: { type: String, default: "" }
  },
  { _id: false }
);

const schemeSchema = new mongoose.Schema(
  {
    // Stable identifier for seeded/custom schemes + external sync dedupe keys
    schemeKey: { type: String, index: true },
    externalId: { type: String, required: true },
    resourceId: { type: String, required: true },

    // Normalized core fields (data.gov.in & standard REST APIs)
    code: { type: String, default: "GOV-SCH" },
    name: { type: String, required: true, trim: true },
    slug: { type: String, trim: true },
    description: { type: String, default: "" },
    category: { type: String, default: "Other" },
    jurisdiction: {
      type: String,
      enum: ["Central", "State", "Other"],
      default: "Other"
    },
    state: { type: String, default: null },
    targetBeneficiaries: { type: String, default: "Eligible Citizens" },
    department: { type: String, default: "" },
    benefits: { type: [String], default: [] },
    eligibility: { type: [String], default: [] },
    documents: { type: [String], default: [] },
    applicationUrl: { type: String, default: null },
    officialSource: { type: String, default: "https://www.data.gov.in/" },

    // Rich GramConnect prototype fields (multilingual + rule engine + checklist)
    title: { type: localizedTextSchema, default: () => ({}) },
    shortDesc: { type: localizedTextSchema, default: () => ({}) },
    benefitsLocalized: { type: localizedTextSchema, default: () => ({}) },
    eligibilitySummary: { type: localizedTextSchema, default: () => ({}) },
    rules: { type: [mongoose.Schema.Types.Mixed], default: [] },
    documentItems: { type: [mongoose.Schema.Types.Mixed], default: [] },
    applicationGuide: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({
        method: "Online via Official Portal or Authorized CSC",
        portalName: "myscheme.gov.in",
        helpline: "1800-11-0001",
        steps: []
      })
    },

    sourceUpdatedAt: Date,
    lastSyncedAt: Date,
    lastVerifiedAt: Date,
    lastVerified: { type: String, default: "" },
    verificationStatus: {
      type: String,
      enum: ["Verified", "Needs Review", "Draft", "Archived", "unverified", "verified", "needs_review"],
      default: "Needs Review"
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

schemeSchema.index({ resourceId: 1, externalId: 1 }, { unique: true });
schemeSchema.index({ name: "text", description: "text", category: "text" });
schemeSchema.index({ jurisdiction: 1, state: 1, category: 1 });

export default mongoose.model("Scheme", schemeSchema);
