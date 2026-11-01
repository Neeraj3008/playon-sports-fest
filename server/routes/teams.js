import { Router } from "express";
import Team from "../models/Team.js";
import Event from "../models/Event.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { validateTeam } from "../validators.js";

const router = Router();

// POST /api/teams -> register a team (logged-in users only)
router.post("/", requireAuth, async (req, res) => {
  const event = await Event.findOne({ sport: req.body.sport });
  const errors = validateTeam(req.body, event);
  if (Object.keys(errors).length) return res.status(400).json({ message: "Please fix the errors", errors });

  const registered = await Team.countDocuments({ sport: event.sport });
  if (registered >= event.maxTeams)
    return res.status(409).json({ message: `${event.title} is full`, errors: { sport: "No slots left" } });

  const teamName = req.body.teamName.trim();
  const clash = await Team.findOne({ sport: event.sport, teamNameLower: teamName.toLowerCase() });
  if (clash)
    return res.status(409).json({ message: "Team name taken", errors: { teamName: "This team name is already taken for this sport" } });

  const team = await Team.create({
    teamName,
    sport: event.sport,
    captain: req.body.captain.trim(),
    contact: req.body.contact,
    players: req.body.players.map((p) => p.trim()),
    registeredBy: req.user.id,
  });
  res.status(201).json(team);
});

// GET /api/teams/mine -> teams registered by the logged-in user
router.get("/mine", requireAuth, async (req, res) => {
  res.json(await Team.find({ registeredBy: req.user.id }).sort({ createdAt: -1 }));
});

// GET /api/teams?search=&sport= -> admin: all teams
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  const filter = {};
  if (req.query.sport) filter.sport = req.query.sport;
  if (req.query.search) {
    const rx = new RegExp(req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ teamName: rx }, { captain: rx }];
  }
  res.json(await Team.find(filter).sort({ createdAt: -1 }));
});

// PATCH /api/teams/:id/approve -> admin
router.patch("/:id/approve", requireAuth, requireAdmin, async (req, res) => {
  const team = await Team.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
  if (!team) return res.status(404).json({ message: "Team not found" });
  res.json(team);
});

// DELETE /api/teams/:id -> admin
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const team = await Team.findByIdAndDelete(req.params.id);
  if (!team) return res.status(404).json({ message: "Team not found" });
  res.json({ message: "Team deleted" });
});

export default router;
