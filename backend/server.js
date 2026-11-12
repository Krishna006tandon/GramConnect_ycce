import fs from "node:fs";
import path from "node:path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB, ensureMongoSeeded } from "./config/db.js";
import schemeRoutes from "./routes/schemeRoutes.js";
import platformRoutes from "./routes/platformRoutes.js";

dotenv.config({ path: path.resolve(import.meta.dirname, ".env") });

const app = express();
const PORT = Number(process.env.PORT) || 5050;

const envOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((s) => s.trim()).filter(Boolean)
  : [];

const vercelOrigins = [
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  process.env.VERCEL_BRANCH_URL && `https://${process.env.VERCEL_BRANCH_URL}`,
  process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
].filter(Boolean);

const allowedOrigins = Array.from(new Set(["http://localhost:5173", ...envOrigins, ...vercelOrigins]));

app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin / server-to-server requests (no Origin header) and configured origins
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    ok: true,
    engine: "mongodb",
    message: "GramConnect API is running"
  });
});

// Ensure MongoDB connection & initial seed before handling API routes (needed for serverless Vercel functions)
app.use("/api", async (_req, res, next) => {
  try {
    await connectDB();
    await ensureMongoSeeded();
    next();
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Database unavailable",
      error: error.message
    });
  }
});

app.use("/api/schemes", schemeRoutes);
app.use("/api", platformRoutes);

// Serve built frontend in local standalone/production mode (outside Vercel serverless)
const distDir = path.resolve(import.meta.dirname, "..", "frontend", "dist");
if (!process.env.VERCEL && fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("/{*splat}", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distDir, "index.html"));
  });
}

// Local development / standalone server startup
if (!process.env.VERCEL) {
  connectDB()
    .then(async () => {
      await ensureMongoSeeded();
      app.listen(PORT, () => {
        console.log(`GramConnect MongoDB API server running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
      process.exit(1);
    });
}

export default app;
