import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true, trim: true, minlength: 3, maxlength: 30 },
    teamNameLower: { type: String }, // used for case-insensitive duplicate check
    sport: { type: String, required: true },
    captain: { type: String, required: true, trim: true },
    contact: { type: String, required: true, match: [/^[6-9]\d{9}$/, "Invalid phone number"] },
    players: [{ type: String, trim: true }],
    status: { type: String, enum: ["pending", "approved"], default: "pending" },
    registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

teamSchema.pre("save", function () {
  this.teamNameLower = this.teamName.toLowerCase();
});

// Same team name cannot be used twice in the same sport ("Smash Bros" = "smash bros")
teamSchema.index({ teamNameLower: 1, sport: 1 }, { unique: true });

export default mongoose.model("Team", teamSchema);
