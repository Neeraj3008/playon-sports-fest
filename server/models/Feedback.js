import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true, minlength: 20, maxlength: 500 },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
