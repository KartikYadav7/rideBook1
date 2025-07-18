import mongoose from "mongoose";

const driverProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    licenseNumber: { type: String, required: true },
    availability: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("DriverProfile", driverProfileSchema);
