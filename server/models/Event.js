import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  sport: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  venue: String,
  entryFee: Number,
  teamSize: { type: Number, required: true }, // players per team (including captain)
  maxTeams: { type: Number, required: true },
  icon: String,
});

export default mongoose.model("Event", eventSchema);
