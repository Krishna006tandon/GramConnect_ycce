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

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((s) => s.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
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

app.use("/api/schemes", schemeRoutes);
app.use("/api", platformRoutes);

// Serve built frontend in standalone/production mode
const distDir = path.resolve(import.meta.dirname, "..", "frontend", "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("/{*splat}", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distDir, "index.html"));
  });
}

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
