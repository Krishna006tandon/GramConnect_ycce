import { Router } from "express";
import { sendSchemeSms, formatSchemeSmsMessage } from "../services/smsService.js";

const router = Router();

// Check SMS gateway configuration status
router.get("/status", (_req, res) => {
  const apiKey = process.env.FAST2SMS_API_KEY?.trim();
  const configured = Boolean(apiKey && apiKey !== "YOUR_FAST2SMS_API_KEY");

  res.json({
    success: true,
    provider: "Fast2SMS",
    configured,
    mode: configured ? "live" : "simulated",
    info: configured
      ? "Fast2SMS API Key detected; real-time live SMS enabled."
      : "Fast2SMS Key not configured. Using high-fidelity Real-Time Simulator."
  });
});

// Format an SMS message for preview
router.post("/preview", (req, res) => {
  const {
    citizenName,
    schemeName,
    schemeCode,
    referenceNo,
    pendingAction,
    deadline,
    language
  } = req.body || {};

  const message = formatSchemeSmsMessage({
    citizenName,
    schemeName,
    schemeCode,
    referenceNo,
    pendingAction,
    deadline,
    language: language || "en"
  });

  res.json({ success: true, message });
});

// Dispatch real-time SMS
router.post("/send-alert", async (req, res) => {
  try {
    const {
      mobile,
      citizenName,
      schemeName,
      schemeCode,
      referenceNo,
      pendingAction,
      deadline,
      language,
      customMessage
    } = req.body || {};

    const result = await sendSchemeSms({
      mobile,
      citizenName,
      schemeName,
      schemeCode,
      referenceNo,
      pendingAction,
      deadline,
      language,
      customMessage
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to dispatch SMS alert"
    });
  }
});

export default router;
