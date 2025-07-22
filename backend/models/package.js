import mongoose from "mongoose";

const packageBookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cab: { type: mongoose.Schema.Types.ObjectId, ref: "Cab" },

    senderName: { type: String, required: true },
    receiverName: { type: String, required: true },
    contact: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    weight: { type: Number, required: true },
    note: { type: String },

    status: {
      type: String,
      enum: ["requested", "confirmed", "in-transit", "delivered", "cancelled"],
      default: "requested",
    },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    trackingNumber: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("PackageBooking", packageBookingSchema);
