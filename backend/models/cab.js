import mongoose from "mongoose";

const cabSchema = new mongoose.Schema(
  {
    cabNumber: { type: String, required: true },
    model: { type: String, required: true },
    type: { type: String, required: true },
    capacity: { type: Number, default: 4 },
    isAvailable: { type: Boolean, default: true },
    status: { type: String, enum: ["available", "busy", "maintenance"], default: "available" },
  },
  { timestamps: true }
);

export default mongoose.model("Cab", cabSchema);
