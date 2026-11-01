import { Router } from "express";
import Event from "../models/Event.js";
import Team from "../models/Team.js";

import mongoose from "mongoose";
import { EVENTS } from "../seed.js";

const router = Router();

// GET /api/events -> all events with live "slots left" count
router.get("/", async (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(
      EVENTS.map((e) => ({
        ...e,
        _id: e.sport,
        registered: 0,
        slotsLeft: e.maxTeams,
      }))
    );
  }
  const events = await Event.find().sort({ date: 1 }).lean();
  const counts = await Team.aggregate([{ $group: { _id: "$sport", n: { $sum: 1 } } }]);
  const bySport = Object.fromEntries(counts.map((c) => [c._id, c.n]));
  res.json(
    events.map((e) => ({ ...e, registered: bySport[e.sport] || 0, slotsLeft: e.maxTeams - (bySport[e.sport] || 0) }))
  );
});

export default router;
