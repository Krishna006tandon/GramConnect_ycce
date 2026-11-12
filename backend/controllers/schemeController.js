import mongoose from "mongoose";
import Scheme from "../models/Scheme.js";
import SyncLog from "../models/SyncLog.js";
import Assessment from "../models/Assessment.js";
import { syncSchemes } from "../services/schemeSyncService.js";
import { clearSchemeCache } from "../middleware/cache.js";
import { serializeSchemeForUI } from "../config/db.js";
import { evaluateSchemeEligibility } from "../utils/eligibilityEngine.js";

export async function getSchemes(req, res) {
  try {
    const { search, category, state, jurisdiction, all, page = 1, limit = 24 } = req.query;
    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(50, Math.max(1, Number(limit) || 24));

    const filter = { isActive: true };
    if (all !== "true") {
      filter.verificationStatus = { $in: ["Verified", "verified"] };
    }
    if (category && category !== "All") {
      filter.category = category;
    }
    if (state && state !== "All") {
      filter.state = state;
    }
    if (jurisdiction && jurisdiction !== "All") {
      filter.jurisdiction = jurisdiction;
    }
    if (search) {
      const escaped = String(search)
        .slice(0, 100)
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { description: { $regex: escaped, $options: "i" } },
        { department: { $regex: escaped, $options: "i" } },
        { "title.hi": { $regex: escaped, $options: "i" } },
        { "title.mr": { $regex: escaped, $options: "i" } }
      ];
    }

    const [schemes, total] = await Promise.all([
      Scheme.find(filter)
        .sort({ name: 1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      Scheme.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: schemes.map(serializeSchemeForUI),
      pagination: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch schemes",
      error: error.message
    });
  }
}

export async function getSchemeById(req, res) {
  try {
    const { id } = req.params;
    const query = mongoose.isValidObjectId(id)
      ? { $or: [{ _id: id }, { schemeKey: id }] }
      : { schemeKey: id };

    const scheme = await Scheme.findOne(query).lean();
    if (!scheme || !scheme.isActive) {
      return res.status(404).json({ success: false, message: "Scheme not found" });
    }
    res.json({ success: true, data: serializeSchemeForUI(scheme) });
  } catch {
    res.status(400).json({ success: false, message: "Invalid scheme ID" });
  }
}

export async function getCategories(_req, res) {
  try {
    const categories = await Scheme.distinct("category", { isActive: true });
    res.json({ success: true, data: categories });
  } catch {
    res.status(500).json({ success: false, message: "Unable to fetch categories" });
  }
}

export async function upsertScheme(req, res) {
  try {
    const s = req.body || {};
    const schemeKey = req.params.id || s.id || `sch-${Date.now()}`;
    const name = s.title?.en || s.name || "Untitled Scheme";
    const today = new Date().toISOString().slice(0, 10);

    const payload = {
      schemeKey,
      externalId: s.externalId || schemeKey,
      resourceId: s.resourceId || "gramconnect-admin",
      code: s.code || "GOV-SCH",
      name,
      slug: schemeKey,
      description: s.shortDesc?.en || s.description || "",
      category: s.category || "Other",
      jurisdiction: s.level || s.jurisdiction || "Central",
      state: s.state || "All India",
      targetBeneficiaries: s.targetBeneficiaries || "Eligible Citizens",
      department: s.department || "",
      benefits: [s.benefits?.en].filter(Boolean),
      eligibility: [s.eligibilitySummary?.en].filter(Boolean),
      documents: (s.documents || []).map((d) => (typeof d === "string" ? d : d.name)),
      applicationUrl: s.officialUrl || s.applicationUrl || null,
      officialSource: s.officialUrl || s.officialSource || "https://www.myscheme.gov.in/",
      title: s.title || { en: name, hi: name, mr: name },
      shortDesc: s.shortDesc || { en: "", hi: "", mr: "" },
      benefitsLocalized: s.benefits || { en: "", hi: "", mr: "" },
      eligibilitySummary: s.eligibilitySummary || { en: "", hi: "", mr: "" },
      rules: s.rules || [],
      documentItems: s.documents || [],
      applicationGuide: s.applicationGuide || {},
      verificationStatus: s.verificationStatus || "Draft",
      lastVerified: s.lastVerified || today,
      lastVerifiedAt: s.verificationStatus === "Verified" ? new Date() : null,
      isActive: true
    };

    const updated = await Scheme.findOneAndUpdate(
      { $or: [{ schemeKey }, { resourceId: payload.resourceId, externalId: payload.externalId }] },
      { $set: payload },
      { new: true, upsert: true }
    );

    clearSchemeCache();
    res.status(req.params.id ? 200 : 201).json(serializeSchemeForUI(updated));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateSchemeVerification(req, res) {
  try {
    const { verificationStatus } = req.body || {};
    if (!verificationStatus) {
      return res.status(400).json({ error: "verificationStatus is required." });
    }
    const today = new Date().toISOString().slice(0, 10);
    const updateFields = { verificationStatus };
    if (verificationStatus === "Verified" || verificationStatus === "verified") {
      updateFields.lastVerified = today;
      updateFields.lastVerifiedAt = new Date();
    }

    await Scheme.updateOne(
      { $or: [{ schemeKey: req.params.id }, ...(mongoose.isValidObjectId(req.params.id) ? [{ _id: req.params.id }] : [])] },
      { $set: updateFields }
    );
    clearSchemeCache();
    res.json({ ok: true, verificationStatus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteScheme(req, res) {
  try {
    await Scheme.deleteOne({
      $or: [{ schemeKey: req.params.id }, ...(mongoose.isValidObjectId(req.params.id) ? [{ _id: req.params.id }] : [])]
    });
    clearSchemeCache();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function evaluateScheme(req, res) {
  try {
    const { id } = req.params;
    const schemeDoc = await Scheme.findOne({
      $or: [{ schemeKey: id }, ...(mongoose.isValidObjectId(id) ? [{ _id: id }] : [])]
    }).lean();

    if (!schemeDoc) {
      return res.status(404).json({ error: "Scheme not found." });
    }

    const scheme = serializeSchemeForUI(schemeDoc);
    const { answers = {}, citizenId = "guest", performedBy = "Self", save = true } = req.body || {};
    const evaluation = evaluateSchemeEligibility(scheme.rules, answers);

    if (save) {
      await Assessment.create({
        assessmentKey: `asmt-${Date.now()}`,
        citizenId,
        schemeId: scheme.id,
        outcome: evaluation.outcome,
        answers,
        performedBy,
        date: new Date().toISOString().slice(0, 10)
      });
    }

    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function runSchemeSync(_req, res) {
  try {
    const results = await syncSchemes();
    clearSchemeCache();
    const hasFailures = results.some((item) => item.status === "failed");
    res.status(hasFailures ? 207 : 200).json({
      success: !hasFailures,
      message: hasFailures
        ? "Scheme synchronization finished with errors (check details)."
        : "Scheme synchronization completed.",
      data: results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getSyncHistory(_req, res) {
  try {
    const history = await SyncLog.find().sort({ completedAt: -1 }).limit(20).lean();
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
