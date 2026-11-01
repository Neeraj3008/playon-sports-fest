import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import teamRoutes from "./routes/teams.js";
import feedbackRoutes from "./routes/feedback.js";
import { seedEvents } from "./seed.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

// Check database connection for requests that require write access or active DB
app.use("/api", (req, res, next) => {
  if (
    req.path === "/health" ||
    (req.path === "/events" && req.method === "GET") ||
    (req.path === "/feedback/summary" && req.method === "GET")
  ) {
    return next();
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database is connecting or not configured. Please ensure MONGO_URI is set.",
    });
  }
  next();
});

// ---------- REST API ----------
app.get("/api/health", (_req, res) => res.json({ status: "ok", db: mongoose.connection.readyState === 1 }));
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/feedback", feedbackRoutes);

// ---------- Serve the React build (production) ----------
const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));
app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(clientDist, "index.html")));

// ---------- Error handler ----------
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.code === 11000) return res.status(409).json({ message: "Duplicate entry" });
  if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

const mongoUri = process.env.MONGO_URI;
const isPlaceholder =
  !mongoUri ||
  mongoUri.includes("<user>") ||
  mongoUri.includes("<password>") ||
  mongoUri.includes("<cluster>");

if (isPlaceholder) {
  console.warn(
    "⚠️  [Notice] MONGO_URI is missing or contains placeholder values. Set a valid MongoDB Atlas connection string in your .env or Render dashboard."
  );
} else {
  async function connectWithRetry() {
    try {
      await mongoose.connect(mongoUri);
      console.log("MongoDB connected successfully");
      await seedEvents();
    } catch (err) {
      console.error("MongoDB connection failed, retrying in 5s:", err.message);
      setTimeout(connectWithRetry, 5000);
    }
  }
  connectWithRetry();
}
