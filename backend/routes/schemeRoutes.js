import express from "express";
import {
  getSchemes,
  getSchemeById,
  getCategories,
  upsertScheme,
  updateSchemeVerification,
  deleteScheme,
  evaluateScheme,
  runSchemeSync,
  getSyncHistory
} from "../controllers/schemeController.js";
import { cachedResponse } from "../middleware/cache.js";
import { adminOnly } from "../middleware/adminAuth.js";

const router = express.Router();

// Cached public discovery endpoints
router.get(
  "/",
  cachedResponse((req) => `schemes:${JSON.stringify(req.query)}`, 21600),
  getSchemes
);

router.get(
  "/categories",
  cachedResponse(() => "scheme-categories", 43200),
  getCategories
);

// Admin-only data.gov.in sync & history (no caching)
router.post("/admin/sync", adminOnly, runSchemeSync);
router.get("/admin/sync-history", adminOnly, getSyncHistory);

// Single scheme & admin scheme CRUD
router.get(
  "/:id",
  cachedResponse((req) => `scheme:${req.params.id}`, 21600),
  getSchemeById
);
router.post("/", upsertScheme);
router.put("/:id", upsertScheme);
router.patch("/:id/verification", updateSchemeVerification);
router.delete("/:id", deleteScheme);
router.post("/:id/evaluate", evaluateScheme);

export default router;
