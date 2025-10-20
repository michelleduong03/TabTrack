import mongoose from "mongoose";

const tabSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    domain: { type: String, required: true },
    totalTime: { type: Number, default: 0 },
    lastVisited: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

tabSchema.index({ userId: 1, domain: 1 }, { unique: true });

export default mongoose.model("Tab", tabSchema);
