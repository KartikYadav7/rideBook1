import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import {
  register,
  login,
  verifyCode,
  resendCode,
  resetPassword,
  resetPasswordLink,
} from "./routes/authRoutes.js";
import {
  calculateBookingPrice,
  cancelPayment,
  checkPaymentStatus,
  createCheckoutSession,
  getUserBookings,
  updateBookingStatus,
  cancelBooking,
  submitReview,
} from "./routes/bookingRoutes.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import { contact } from "./routes/contactRoutes.js";
import { autoCompleteFeature } from "./routes/autoCompleteFeature.js";

const port = process.env.PORT || 5000;
const app = express();
connectDB();

app.use(
  cors({
    origin: ["http://localhost:5173","https://ride-book1.vercel.app"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

//auth routes
app.post("/register", register);
app.post("/login", login);
app.post("/verifyCode", verifyCode);
app.post("/resendCode", resendCode);
app.post("/resetPassword/:token", resetPassword);
app.post("/resetPasswordLink", resetPasswordLink);

//booking and payment routes
app.post(
  "/calculate-booking-price",
  verifyToken("user", "drivingPartner"),
  calculateBookingPrice
);
app.post(
  "/create-checkout-session",
  verifyToken("user"),
  express.json(),
  verifyToken("user"),
  createCheckoutSession
);
app.post("/cancel-payment", verifyToken("user"), cancelPayment);
app.post("/check-payment-status", verifyToken("user"), checkPaymentStatus);
app.get(
  "/:userId/bookings",
  verifyToken("user", "drivingPartner"),
  getUserBookings
);
app.patch(
  "/booking/:bookingType/:trackingNumber",
  verifyToken("drivingPartner"),
  updateBookingStatus
);
app.patch(
  "/:bookingType/:trackingNumber/cancel",
  verifyToken("user"),
  cancelBooking
);
app.post("/booking/:trackingNumber/review", verifyToken("user"), submitReview);

//contact routes
app.post("/contact", contact);

//places Autocomplete Feature
app.use("/places-autocomplete", autoCompleteFeature);

app.listen(port, () => {
  console.log(`server is running on port:${port}`);
});
