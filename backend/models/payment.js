import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rideBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RideBooking",
    },
    reservationBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReservationBooking",
    },
    packageBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PackageBooking",
    },

    amount: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: ["card", "wallet", "upi", "cash"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "successful", "failed", "refunded"],
      default: "pending",
    },

    transactionId: { type: String }, 
    paidAt: { type: Date, default: Date.now },
    refundedAt: { type: Date },
    refundReason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
