import mongoose from "mongoose";
import Scheme from "../models/Scheme.js";
import Citizen from "../models/Citizen.js";
import Assessment from "../models/Assessment.js";
import ApplicationRecord from "../models/ApplicationRecord.js";
import AssistanceLog from "../models/AssistanceLog.js";
import { seedSchemes } from "../data/seedSchemes.js";
import {
  seedCitizens,
  seedSavedSchemes,
  seedDocReadiness,
  seedAssessments,
  seedApplications,
  seedAssistanceLogs
} from "../data/seedCitizens.js";

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri || mongoUri.includes("YOUR_CONNECTION_STRING")) {
    throw new Error("MONGO_URI is missing or still set to placeholder in environment variables");
  }

  if (!globalThis.__gcMongoPromise) {
    globalThis.__gcMongoPromise = mongoose.connect(mongoUri).then((m) => {
      console.log("MongoDB connected");
      return m;
    });
  }

  try {
    return await globalThis.__gcMongoPromise;
  } catch (err) {
    globalThis.__gcMongoPromise = null;
    throw err;
  }
}

export function mapSeedSchemeToMongo(s) {
  return {
    schemeKey: s.id,
    externalId: s.id,
    resourceId: "gramconnect-seed-v1",
    code: s.code,
    name: s.title?.en || s.name || s.id,
    slug: s.id,
    description: s.shortDesc?.en || "",
    category: s.category || "Other",
    jurisdiction: s.level || "Other",
    state: s.state || "All India",
    targetBeneficiaries: s.targetBeneficiaries || "Eligible Citizens",
    department: s.department || "",
    benefits: [s.benefits?.en].filter(Boolean),
    eligibility: [s.eligibilitySummary?.en].filter(Boolean),
    documents: (s.documents || []).map((d) => d.name),
    applicationUrl: s.officialUrl,
    officialSource: s.officialUrl,
    title: s.title,
    shortDesc: s.shortDesc,
    benefitsLocalized: s.benefits,
    eligibilitySummary: s.eligibilitySummary,
    rules: s.rules || [],
    documentItems: s.documents || [],
    applicationGuide: s.applicationGuide || {},
    lastVerified: s.lastVerified || new Date().toISOString().slice(0, 10),
    lastVerifiedAt: s.verificationStatus === "Verified" ? new Date() : null,
    verificationStatus: s.verificationStatus || "Verified",
    isActive: true
  };
}

export function serializeSchemeForUI(doc) {
  const s = doc.toObject ? doc.toObject() : doc;
  const id = s.schemeKey || String(s._id);
  const name = s.title?.en || s.name || "Untitled Scheme";
  const desc = s.shortDesc?.en || s.description || "";
  const benefitText =
    s.benefitsLocalized?.en ||
    (Array.isArray(s.benefits) && s.benefits.length ? s.benefits.join(" • ") : "Refer to official portal");
  const eligText =
    s.eligibilitySummary?.en ||
    (Array.isArray(s.eligibility) && s.eligibility.length ? s.eligibility.join(" • ") : "Verify eligibility on official portal");

  const normalizedStatus =
    s.verificationStatus === "verified"
      ? "Verified"
      : s.verificationStatus === "unverified" || s.verificationStatus === "needs_review"
      ? "Needs Review"
      : s.verificationStatus || "Needs Review";

  return {
    id,
    _id: String(s._id || id),
    externalId: s.externalId,
    resourceId: s.resourceId,
    code: s.code || "GOV-SCH",
    category: s.category || "Other",
    level: s.jurisdiction || "Other",
    state: s.state || "All India",
    targetBeneficiaries: s.targetBeneficiaries || "Eligible Citizens",
    department: s.department || "",
    officialUrl: s.applicationUrl || s.officialSource || "https://www.myscheme.gov.in/",
    lastVerified: s.lastVerified || (s.lastSyncedAt ? new Date(s.lastSyncedAt).toISOString().slice(0, 10) : ""),
    verificationStatus: normalizedStatus,
    title: s.title?.en ? s.title : { en: name, hi: name, mr: name },
    shortDesc: s.shortDesc?.en ? s.shortDesc : { en: desc, hi: desc, mr: desc },
    benefits: s.benefitsLocalized?.en ? s.benefitsLocalized : { en: benefitText, hi: benefitText, mr: benefitText },
    eligibilitySummary: s.eligibilitySummary?.en
      ? s.eligibilitySummary
      : { en: eligText, hi: eligText, mr: eligText },
    rules: Array.isArray(s.rules) ? s.rules : [],
    documents:
      Array.isArray(s.documentItems) && s.documentItems.length
        ? s.documentItems
        : (s.documents || []).map((d, idx) => ({ id: `${id}-doc-${idx + 1}`, name: d })),
    applicationGuide: s.applicationGuide || {
      method: "Online via Official Portal or Authorized CSC",
      portalName: "myscheme.gov.in",
      helpline: "1800-11-0001",
      steps: []
    },
    lastSyncedAt: s.lastSyncedAt || null
  };
}

export async function seedAllMongoData() {
  for (const s of seedSchemes) {
    const mapped = mapSeedSchemeToMongo(s);
    await Scheme.updateOne(
      { resourceId: mapped.resourceId, externalId: mapped.externalId },
      { $set: mapped },
      { upsert: true }
    );
  }

  for (const c of seedCitizens) {
    await Citizen.updateOne(
      { citizenKey: c.id },
      {
        $set: {
          citizenKey: c.id,
          name: c.name,
          mobile: c.mobile,
          email: c.email || "",
          state: c.state,
          district: c.district,
          village: c.village,
          age: c.age,
          occupation: c.occupation,
          income: c.income,
          gender: c.gender,
          category: c.category,
          consentRecorded: c.consentRecorded,
          registeredBy: c.registeredBy,
          savedSchemes: seedSavedSchemes[c.id] || [],
          docReadiness: seedDocReadiness[c.id] || {},
          createdAtDate: c.createdAt
        }
      },
      { upsert: true }
    );
  }

  for (const a of seedAssessments) {
    await Assessment.updateOne(
      { assessmentKey: a.id },
      {
        $set: {
          assessmentKey: a.id,
          citizenId: a.citizenId,
          schemeId: a.schemeId,
          outcome: a.outcome,
          answers: a.answers,
          performedBy: a.performedBy,
          date: a.date
        }
      },
      { upsert: true }
    );
  }

  for (const app of seedApplications) {
    await ApplicationRecord.updateOne(
      { appKey: app.id },
      {
        $set: {
          appKey: app.id,
          citizenId: app.citizenId,
          schemeId: app.schemeId,
          referenceNo: app.referenceNo,
          status: app.status,
          notes: app.notes,
          assistedBy: app.assistedBy,
          updatedAtDate: app.updatedAt
        }
      },
      { upsert: true }
    );
  }

  for (const log of seedAssistanceLogs) {
    await AssistanceLog.updateOne(
      { logKey: log.id },
      {
        $set: {
          logKey: log.id,
          citizenId: log.citizenId,
          operatorName: log.operatorName,
          action: log.action,
          date: log.date
        }
      },
      { upsert: true }
    );
  }
}

export async function ensureMongoSeeded() {
  if (globalThis.__gcSeedDone) return;
  if (!globalThis.__gcSeedPromise) {
    globalThis.__gcSeedPromise = (async () => {
      const count = await Scheme.countDocuments();
      if (count === 0) {
        await seedAllMongoData();
      }
      globalThis.__gcSeedDone = true;
    })();
  }
  try {
    await globalThis.__gcSeedPromise;
  } catch (err) {
    globalThis.__gcSeedPromise = null;
    throw err;
  }
}

export async function resetMongoDatabase() {
  await Promise.all([
    Scheme.deleteMany({}),
    Citizen.deleteMany({}),
    Assessment.deleteMany({}),
    ApplicationRecord.deleteMany({}),
    AssistanceLog.deleteMany({})
  ]);
  await seedAllMongoData();
}

export async function getBootstrapPayload() {
  const [schemeDocs, citizenDocs, assessmentDocs, appDocs, logDocs] = await Promise.all([
    Scheme.find({ isActive: true }).sort({ createdAt: -1 }).lean(),
    Citizen.find().sort({ createdAt: -1 }).lean(),
    Assessment.find().sort({ createdAt: -1 }).lean(),
    ApplicationRecord.find().sort({ createdAt: -1 }).lean(),
    AssistanceLog.find().sort({ createdAt: -1 }).lean()
  ]);

  const savedSchemes = {};
  const docReadiness = {};
  const citizens = citizenDocs.map((c) => {
    savedSchemes[c.citizenKey] = c.savedSchemes || [];
    docReadiness[c.citizenKey] = c.docReadiness || {};
    return {
      id: c.citizenKey,
      name: c.name,
      mobile: c.mobile,
      email: c.email,
      state: c.state,
      district: c.district,
      village: c.village,
      age: c.age,
      occupation: c.occupation,
      income: c.income,
      gender: c.gender,
      category: c.category,
      consentRecorded: c.consentRecorded,
      registeredBy: c.registeredBy,
      createdAt: c.createdAtDate || new Date(c.createdAt).toISOString().slice(0, 10)
    };
  });

  return {
    schemes: schemeDocs.map(serializeSchemeForUI),
    citizens,
    savedSchemes,
    docReadiness,
    assessments: assessmentDocs.map((a) => ({
      id: a.assessmentKey,
      citizenId: a.citizenId,
      schemeId: a.schemeId,
      outcome: a.outcome,
      answers: a.answers,
      performedBy: a.performedBy,
      date: a.date
    })),
    applications: appDocs.map((app) => ({
      id: app.appKey,
      citizenId: app.citizenId,
      schemeId: app.schemeId,
      referenceNo: app.referenceNo,
      status: app.status,
      notes: app.notes,
      assistedBy: app.assistedBy,
      updatedAt: app.updatedAtDate
    })),
    assistanceLogs: logDocs.map((l) => ({
      id: l.logKey,
      citizenId: l.citizenId,
      operatorName: l.operatorName,
      action: l.action,
      date: l.date
    }))
  };
}
