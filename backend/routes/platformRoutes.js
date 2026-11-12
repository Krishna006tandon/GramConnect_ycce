import express from "express";
import Citizen from "../models/Citizen.js";
import Assessment from "../models/Assessment.js";
import ApplicationRecord from "../models/ApplicationRecord.js";
import AssistanceLog from "../models/AssistanceLog.js";
import { getBootstrapPayload, resetMongoDatabase } from "../config/db.js";
import { clearSchemeCache } from "../middleware/cache.js";

const router = express.Router();

router.get("/bootstrap", async (_req, res) => {
  try {
    const payload = await getBootstrapPayload();
    res.json(payload);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/citizens", async (_req, res) => {
  try {
    const payload = await getBootstrapPayload();
    res.json(payload.citizens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/citizens", async (req, res) => {
  try {
    const payload = req.body || {};
    if (!payload.name || !payload.mobile) {
      return res.status(400).json({ error: "Name and mobile are required." });
    }
    const citizenKey = payload.id || `cit-${Date.now()}`;
    const createdAtDate = payload.createdAt || new Date().toISOString().slice(0, 10);

    await Citizen.findOneAndUpdate(
      { citizenKey },
      {
        $set: {
          citizenKey,
          name: payload.name,
          mobile: payload.mobile,
          email: payload.email || "",
          state: payload.state || "Maharashtra",
          district: payload.district || "",
          village: payload.village || "",
          age: Number(payload.age) || 0,
          occupation: payload.occupation || "",
          income: Number(payload.income) || 0,
          gender: payload.gender || "Male",
          category: payload.category || "General",
          consentRecorded: payload.consentRecorded !== false,
          registeredBy: payload.registeredBy || "Self",
          createdAtDate
        }
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ ...payload, id: citizenKey, createdAt: createdAtDate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/citizens/:id", async (req, res) => {
  try {
    const citizenKey = req.params.id;
    const payload = req.body || {};
    await Citizen.findOneAndUpdate(
      { citizenKey },
      {
        $set: {
          citizenKey,
          name: payload.name,
          mobile: payload.mobile,
          email: payload.email || "",
          state: payload.state || "Maharashtra",
          district: payload.district || "",
          village: payload.village || "",
          age: Number(payload.age) || 0,
          occupation: payload.occupation || "",
          income: Number(payload.income) || 0,
          gender: payload.gender || "Male",
          category: payload.category || "General",
          consentRecorded: payload.consentRecorded !== false,
          registeredBy: payload.registeredBy || "Self"
        }
      },
      { upsert: true, new: true }
    );
    res.json({ ...payload, id: citizenKey });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/citizens/:id/saved-schemes/toggle", async (req, res) => {
  try {
    const citizenKey = req.params.id;
    const { schemeId } = req.body || {};
    if (!schemeId) {
      return res.status(400).json({ error: "schemeId is required." });
    }
    const citizen = await Citizen.findOne({ citizenKey });
    if (!citizen) {
      return res.status(404).json({ error: "Citizen not found." });
    }
    const exists = (citizen.savedSchemes || []).includes(schemeId);
    const next = exists
      ? citizen.savedSchemes.filter((s) => s !== schemeId)
      : [...(citizen.savedSchemes || []), schemeId];

    citizen.savedSchemes = next;
    await citizen.save();
    res.json({ saved: !exists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/citizens/:id/documents", async (req, res) => {
  try {
    const citizenKey = req.params.id;
    const { schemeId, docId, status } = req.body || {};
    if (!schemeId || !docId || !status) {
      return res.status(400).json({ error: "schemeId, docId, and status are required." });
    }
    const citizen = await Citizen.findOne({ citizenKey });
    if (!citizen) {
      return res.status(404).json({ error: "Citizen not found." });
    }
    const current = citizen.docReadiness || {};
    const schemeDocs = current[schemeId] || {};
    citizen.docReadiness = {
      ...current,
      [schemeId]: {
        ...schemeDocs,
        [docId]: status
      }
    };
    citizen.markModified("docReadiness");
    await citizen.save();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/assessments", async (req, res) => {
  try {
    const a = req.body || {};
    const assessmentKey = a.id || `asmt-${Date.now()}`;
    const entry = {
      assessmentKey,
      citizenId: a.citizenId || "guest",
      schemeId: a.schemeId,
      outcome: a.outcome,
      answers: a.answers || {},
      performedBy: a.performedBy || "Self",
      date: a.date || new Date().toISOString().slice(0, 10)
    };
    await Assessment.findOneAndUpdate({ assessmentKey }, { $set: entry }, { upsert: true });
    res.status(201).json({ ...entry, id: assessmentKey });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/applications", async (req, res) => {
  try {
    const a = req.body || {};
    const appKey = a.id || `app-${Date.now()}`;
    const updatedAtDate = new Date().toISOString().slice(0, 10);
    const entry = {
      appKey,
      citizenId: a.citizenId,
      schemeId: a.schemeId,
      referenceNo: a.referenceNo || "",
      status: a.status || "Preparation pending",
      notes: a.notes || "",
      assistedBy: a.assistedBy || "Self",
      updatedAtDate
    };
    await ApplicationRecord.findOneAndUpdate({ appKey }, { $set: entry }, { upsert: true });
    res.status(201).json({ ...entry, id: appKey, updatedAt: updatedAtDate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/assistance-logs", async (req, res) => {
  try {
    const l = req.body || {};
    const logKey = l.id || `csc-log-${Date.now()}`;
    const date = new Date().toISOString().slice(0, 10);
    const entry = {
      logKey,
      citizenId: l.citizenId,
      operatorName: l.operatorName || "CSC Operator",
      action: l.action || "",
      date
    };
    await AssistanceLog.create(entry);
    res.status(201).json({ ...entry, id: logKey });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/reset-demo", async (_req, res) => {
  try {
    await resetMongoDatabase();
    clearSchemeCache();
    const payload = await getBootstrapPayload();
    res.json(payload);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
