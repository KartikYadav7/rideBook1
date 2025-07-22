import mongoose from "mongoose";

const rideBookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cab: { type: mongoose.Schema.Types.ObjectId, ref: "Cab" },

    fullName: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    note: { type: String },

    status: {
      type: String,
      enum: ["requested", "confirmed", "in-progress", "completed", "cancelled"],
      default: "requested",
    },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    stripeSessionId: { type: String },
    trackingNumber: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("RideBooking", rideBookingSchema);
