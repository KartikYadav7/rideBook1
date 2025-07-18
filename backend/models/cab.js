import mongoose from "mongoose";

const cabSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cabNumber: { type: String, required: true },
    model: { type: String, required: true },
    type: { type: String, enum: ["sedan", "suv", "hatchback"], required: true },
    capacity: { type: Number, default: 4 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Cab", cabSchema);
