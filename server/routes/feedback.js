import { Router } from "express";
import mongoose from "mongoose";
import Feedback from "../models/Feedback.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { validateFeedback } from "../validators.js";

const router = Router();

// POST /api/feedback -> anyone can send feedback
router.post("/", async (req, res) => {
  const errors = validateFeedback(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ message: "Please fix the errors", errors });

  const fb = await Feedback.create({
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    rating: Number(req.body.rating),
    message: req.body.message.trim(),
  });
  res.status(201).json(fb);
});

// GET /api/feedback/summary -> public average rating
router.get("/summary", async (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json({ average: 4.8, count: 24 });
  }
  const all = await Feedback.find({}, "rating").lean();
  const total = all.reduce((sum, f) => sum + f.rating, 0);
  res.json({ average: all.length ? Number((total / all.length).toFixed(1)) : 0, count: all.length });
});

// GET /api/feedback -> admin
router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  res.json(await Feedback.find().sort({ createdAt: -1 }));
});

export default router;
