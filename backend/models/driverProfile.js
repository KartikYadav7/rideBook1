import mongoose from "mongoose";

const driverProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    licenseNumber: { type: String, required: true },
    status: { type: String, enum: ["available", "busy", "offline"], default: "available" },
  },
  { timestamps: true }
);

export default mongoose.model("DriverProfile", driverProfileSchema);
