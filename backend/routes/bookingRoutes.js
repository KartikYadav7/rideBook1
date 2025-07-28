import RideBooking from "../models/booking.js";
import PackageBooking from "../models/package.js";
import ReservationBooking from "../models/reservation.js";
import Cab from "../models/cab.js";
import DriverProfile from "../models/driverProfile.js";
import Payment from "../models/payment.js";
import Review from "../models/review.js";
import {
  findLeastBusyCab,
  findLeastBusyDriver,
  calculatePrice,
  generateTrackingNumber,
} from "../utils/helper.js";
import {
  sendBookingConfirmationEmail,
  sendBookingCancellationEmail,
  sendDriverBookingConfirmationEmail,
  sendDriverBookingCancellationEmail,
  sendReviewRequestEmail,
} from "../utils/mailer.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const calculateBookingPrice = async (req, res) => {
  const { bookingType, weight, pickupLocation, dropLocation } = req.body;
  if (!bookingType || !pickupLocation || !dropLocation) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const amount = await import("../utils/helper.js").then((m) =>
      m.calculatePrice({ bookingType, weight, pickupLocation, dropLocation })
    );
    const priceInRupees = amount.base / 100;

    return res.status(200).json({
      price: priceInRupees,
      amount: amount.base,
      currency: "INR",
      distance: (amount.distanceKm),
      duration:( amount.durationTime)
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to calculate price" });
  }
};

export const createCheckoutSession = async (req, res) => {
  const {
    user,
    bookingType,
    pickupLocation,
    dropLocation,
    date,
    note,
    weight,
    people,
    senderName,
    receiverName,
    contact,
    fullName,
  } = req.body;

  if (!bookingType || !user || !pickupLocation || !dropLocation) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    let cab = null;
    let driverProfile = null;

    // Only assign cab/driver for ride or reservation
    cab =
      (await Cab.findOne({ status: "available" })) ||
      (await findLeastBusyCab());
    driverProfile =
      (await DriverProfile.findOne({ status: "available" })) ||
      (await findLeastBusyDriver());

    if (!cab || !driverProfile) {
      return res
        .status(400)
        .json({ success: false, msg: "No cab/driver available" });
    }

    // Pass distanceKm and durationTime to calculatePrice
    const { base } = await calculatePrice({
      bookingType,
      weight,
      pickupLocation,
      dropLocation,
    });
    // Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${
                bookingType.charAt(0).toUpperCase() + bookingType.slice(1)
              } Booking`,
              description: `From ${pickupLocation} to ${dropLocation}`,
            },
            unit_amount: base,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      metadata: {
        userId: user,
        bookingType,
        pickupLocation,
        dropLocation,
        date: date || "",
        note: note || "",
        weight: (weight ?? 0).toString(),
        people: (people ?? 1).toString(),
        senderName: senderName || "",
        receiverName: receiverName || "",
        contact: contact || "",
        fullName: fullName || "",
        cabId: cab?._id?.toString() || "",
        driverId: driverProfile?.user?.toString() || "",
      },
    });

    // Create Payment document
    const paymentDoc = await Payment.create({
      user,
      amount: base / 100,
      paymentMethod: "card",
      paymentStatus: "pending",
      transactionId: session.id,
    });

    // Select model based on type
    const Model = {
      ride: RideBooking,
      package: PackageBooking,
      reservation: ReservationBooking,
    }[bookingType];

    const bookingData = {
      user,
      pickupLocation,
      dropLocation,
      note,
      stripeSessionId: session.id,
      payment: paymentDoc._id,
    };

    // Add type-specific fields and tracking number
    if (bookingType === "ride" || bookingType === "reservation") {
      bookingData.cab = cab._id;
      bookingData.driver = driverProfile.user;
      bookingData.fullName = fullName;
      if (bookingType === "reservation") {
        bookingData.date = date;
        bookingData.people = people;
        bookingData.trackingNumber = generateTrackingNumber("RSV");
      } else {
        bookingData.trackingNumber = generateTrackingNumber("RIDE");
      }
    } else if (bookingType === "package") {
      bookingData.senderName = senderName;
      bookingData.receiverName = receiverName;
      bookingData.contact = contact;
      bookingData.weight = weight;
      bookingData.trackingNumber = generateTrackingNumber("PKG");
      bookingData.cab = cab._id;
      bookingData.driver = driverProfile.user;
    }

    const newBooking = await new Model(bookingData).save();
    if (bookingType === "ride") {
      paymentDoc.rideBooking = newBooking._id;
    } else if (bookingType === "reservation") {
      paymentDoc.reservationBooking = newBooking._id;
    } else if (bookingType === "package") {
      paymentDoc.packageBooking = newBooking._id;
    }
    await paymentDoc.save();

    return res
      .status(200)
      .json({
        id: session.id,
        price: base / 100,
        trackingNumber: bookingData.trackingNumber,
      });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
};

export const cancelPayment = async (req, res) => {
  const { session_id } = req.body;
  if (!session_id) return res.status(400).json({ error: "Missing session_id" });
  try {
    const payment = await Payment.findOne({
      transactionId: session_id,
      paymentStatus: "pending",
    });
    if (!payment)
      return res.status(404).json({ error: "Pending payment not found" });

    if (payment.rideBooking) {
      await RideBooking.findByIdAndDelete(payment.rideBooking);
    } else if (payment.reservationBooking) {
      await ReservationBooking.findByIdAndDelete(payment.reservationBooking);
    } else if (payment.packageBooking) {
      await PackageBooking.findByIdAndDelete(payment.packageBooking);
    }
    await payment.deleteOne();
    return res.json({
      success: true,
      msg: "Pending payment and booking deleted.",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to clean up pending payment/booking" });
  }
};

export const checkPaymentStatus = async (req, res) => {
  const { session_id } = req.body;
  if (!session_id) return res.status(400).json({ error: "Missing session_id" });
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const payment = await Payment.findOne({ transactionId: session_id });
    let bookingStatus = null;
    let trackingNumber = null;
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    if (
      session.payment_status === "paid" &&
      payment.paymentStatus !== "completed"
    ) {
      payment.paymentStatus = "completed";
      await payment.save();
      // Update booking status as well
      let booking = null;
      let userEmail = null;
      let userName = null;
      let details = {};
      if (payment.rideBooking) {
        await RideBooking.findByIdAndUpdate(payment.rideBooking, {
          status: "confirmed",
        });
        // Set driver status to busy
        const rideBooking = await RideBooking.findById(payment.rideBooking);
        if (rideBooking && rideBooking.driver) {
          await DriverProfile.findOneAndUpdate(
            { user: rideBooking.driver },
            { status: "busy" }
          );
        }
        trackingNumber = rideBooking?.trackingNumber;
        bookingStatus = "confirmed";
        booking = rideBooking;
      } else if (payment.reservationBooking) {
        await ReservationBooking.findByIdAndUpdate(payment.reservationBooking, {
          status: "confirmed",
        });
        // Set driver status to busy
        const reservationBooking = await ReservationBooking.findById(
          payment.reservationBooking
        );
        if (reservationBooking && reservationBooking.driver) {
          await DriverProfile.findOneAndUpdate(
            { user: reservationBooking.driver },
            { status: "busy" }
          );
        }
        trackingNumber = reservationBooking?.trackingNumber;
        bookingStatus = "confirmed";
        booking = reservationBooking;
      } else if (payment.packageBooking) {
        await PackageBooking.findByIdAndUpdate(payment.packageBooking, {
          status: "confirmed",
        });
        // Set driver status to busy
        const packageBooking = await PackageBooking.findById(
          payment.packageBooking
        );
        if (packageBooking && packageBooking.driver) {
          await DriverProfile.findOneAndUpdate(
            { user: packageBooking.driver },
            { status: "busy" }
          );
        }
        trackingNumber = packageBooking?.trackingNumber;
        bookingStatus = "confirmed";
        booking = packageBooking;
      }
      // Send confirmation email if booking found
      if (booking) {
        const user = booking.user || (booking.userId ? booking.userId : null);
        const { userEmail, userName } = await getUserInfo(user);
        details = {
          type:
            booking.bookingType ||
            (payment.rideBooking
              ? "ride"
              : payment.reservationBooking
              ? "reservation"
              : "package"),
          pickup: booking.pickupLocation,
          drop: booking.dropLocation,
          date: booking.date || booking.createdAt,
          trackingNumber: booking.trackingNumber,
          price: payment.amount,
        };
        if (userEmail) {
          await sendBookingConfirmationEmail(userName, userEmail, details);
        }
        if (booking && booking.driver) {
          await sendDriverEmail(booking.driver, details, "confirmation");
        }
      }
    } else {
      return;
    }
    return res.json({
      paymentStatus: payment.paymentStatus,
      bookingStatus,
      trackingNumber,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to check payment status" });
  }
};

// DRY helper for fetching user info
async function getUserInfo(user) {
  let userDoc = null;
  let userEmail = null;
  let userName = null;
  if (user && typeof user === "object" && user.email) {
    userEmail = user.email;
    userName = user.fullName || user.name || user.userName || "User";
  } else {
    const UserModel = (await import("../models/user.js")).default;
    userDoc = await UserModel.findById(user);
    userEmail = userDoc?.email;
    userName =
      userDoc?.fullName || userDoc?.name || userDoc?.userName || "User";
  }
  return { userEmail, userName };
}

// DRY helper for sending driver email
async function sendDriverEmail(driverId, details, type = "confirmation") {
  try {
    if (!driverId) {
      return;
    }
    const UserModel = (await import("../models/user.js")).default;
    const driverUser = await UserModel.findById(driverId);
    if (!driverUser) {
      return;
    }
    if (!driverUser.email) {
      return;
    }
    if (type === "confirmation") {
      await sendDriverBookingConfirmationEmail(
        driverUser.name || "Driver",
        driverUser.email,
        details
      );
    } else if (type === "cancellation") {
      await sendDriverBookingCancellationEmail(
        driverUser.name || "Driver",
        driverUser.email,
        details
      );
    }
  } catch (e) {
    console.error(`Failed to send driver ${type} email:`, e);
  }
}

// Get all bookings for a user (rides, packages, reservations)
export const getUserBookings = async (req, res) => {
  const { userId } = req.params;
  try {
    // Bookings where user is the customer
    const ridesAsUser = await RideBooking.find({ user: userId }).select(
      "-_id trackingNumber pickupLocation dropLocation status date createdAt note"
    );
    const packagesAsUser = await PackageBooking.find({ user: userId }).select(
      "-_id trackingNumber pickupLocation dropLocation status senderName receiverName weight createdAt note"
    );
    const reservationsAsUser = await ReservationBooking.find({
      user: userId,
    }).select(
      "-_id trackingNumber pickupLocation dropLocation status date people createdAt note"
    );

    // Bookings where user is the driver
    const ridesAsDriver = await RideBooking.find({ driver: userId }).select(
      "-_id trackingNumber pickupLocation dropLocation status date createdAt note"
    );
    const packagesAsDriver = await PackageBooking.find({
      driver: userId,
    }).select(
      "-_id trackingNumber pickupLocation dropLocation status senderName receiverName weight createdAt note"
    );
    const reservationsAsDriver = await ReservationBooking.find({
      driver: userId,
    }).select(
      "-_id trackingNumber pickupLocation dropLocation status date people createdAt note"
    );

    // Merge and deduplicate by trackingNumber
    const mergeAndDedup = (a, b) => {
      const map = new Map();
      [...a, ...b].forEach((item) => map.set(item.trackingNumber, item));
      return Array.from(map.values());
    };

    const rides = mergeAndDedup(ridesAsUser, ridesAsDriver);
    const packages = mergeAndDedup(packagesAsUser, packagesAsDriver);
    const reservations = mergeAndDedup(
      reservationsAsUser,
      reservationsAsDriver
    );

    res.json({ rides, packages, reservations });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user/driver bookings" });
  }
};

// Update a booking status (by tracking number and type)
export const updateBookingStatus = async (req, res) => {
  const { trackingNumber, bookingType } = req.params;
  const { status, ...updateFields } = req.body;
  try {
    let Model;
    if (bookingType === "ride") Model = RideBooking;
    else if (bookingType === "package") Model = PackageBooking;
    else if (bookingType === "reservation") Model = ReservationBooking;
    else return res.status(400).json({ error: "Invalid booking type" });

    // Find the booking first to get driver and cab info
    const existingBooking = await Model.findOne({ trackingNumber });
    if (!existingBooking)
      return res.status(404).json({ error: "Booking not found" });

    // Update the booking status
    const booking = await Model.findOneAndUpdate(
      { trackingNumber },
      { $set: { status, ...updateFields } },
      { new: true }
    );

    // Free resources if status is completed
    if (status === "completed" || status === "delivered") {
      // Free driver if present
      if (existingBooking.driver) {
        const DriverProfile = (await import("../models/driverProfile.js"))
          .default;
        await DriverProfile.findOneAndUpdate(
          { user: existingBooking.driver },
          { status: "available" }
        );
      }

      // Free cab if present
      if (existingBooking.cab) {
        const Cab = (await import("../models/cab.js")).default;
        await Cab.findByIdAndUpdate(existingBooking.cab, {
          status: "available",
          isAvailable: true,
        });
      }

      // Send review request email to customer
      try {
        const user =
          existingBooking.user ||
          (existingBooking.userId ? existingBooking.userId : null);
        const { userEmail, userName } = await getUserInfo(user);
        if (userEmail) {
          const details = {
            type: bookingType,
            pickup: existingBooking.pickupLocation,
            drop: existingBooking.dropLocation,
            date: existingBooking.date || existingBooking.createdAt,
            trackingNumber: existingBooking.trackingNumber,
          };
          await sendReviewRequestEmail(userName, userEmail, details);
        }
      } catch (e) {
        console.error("Failed to send review request email:", e);
      }
    }

    res.json({ success: true, message: "Booking status updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update booking" });
  }
};

// Cancel a booking (by tracking number and type)
export const cancelBooking = async (req, res) => {
  const { trackingNumber, bookingType } = req.params;
  try {
    let Model;
    if (bookingType === "ride") Model = RideBooking;
    else if (bookingType === "package") Model = PackageBooking;
    else if (bookingType === "reservation") Model = ReservationBooking;
    else return res.status(400).json({ error: "Invalid booking type" });

    // Find the booking first
    const booking = await Model.findOne({ trackingNumber });
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // Check if booking is already cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({ error: "Booking is already cancelled" });
    }

    // Free driver and cab if present
    if (
      bookingType === "ride" ||
      bookingType === "reservation" ||
      bookingType === "package"
    ) {
      if (booking.driver) {
        const DriverProfile = (await import("../models/driverProfile.js"))
          .default;
        await DriverProfile.findOneAndUpdate(
          { user: booking.driver },
          { status: "available" }
        );
      }
      if (booking.cab) {
        const Cab = (await import("../models/cab.js")).default;
        await Cab.findByIdAndUpdate(booking.cab, {
          status: "available",
          isAvailable: true,
        });
      }
    }

    // Send cancellation email before updating status
    let emailSent = false;
    try {
      const user = booking.user || (booking.userId ? booking.userId : null);
      const { userEmail, userName } = await getUserInfo(user);
      const details = {
        type: bookingType,
        pickup: booking.pickupLocation,
        drop: booking.dropLocation,
        date: booking.date || booking.createdAt,
        trackingNumber: booking.trackingNumber,
      };
      if (userEmail) {
        await sendBookingCancellationEmail(userName, userEmail, details);
      }
      if (booking.driver) {
        await sendDriverEmail(booking.driver, details, "cancellation");
      }
      emailSent = true;
    } catch (e) {
      console.error("Failed to send cancellation email:", e);
    }

    // Mark booking as cancelled instead of deleting
    await Model.findOneAndUpdate(
      { trackingNumber },
      { status: "cancelled" },
      { new: true }
    );
    res.json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (err) {
    console.error("Error cancelling booking:", err);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};

// Submit a review for a completed booking
export const submitReview = async (req, res) => {
  const { trackingNumber } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.userId;
  try {
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }
    if (!trackingNumber) {
      return res.status(400).json({ error: "Tracking number is required" });
    }
    let booking =
      (await RideBooking.findOne({ trackingNumber })) ||
      (await ReservationBooking.findOne({ trackingNumber })) ||
      (await PackageBooking.findOne({ trackingNumber }));

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.status !== "completed" || booking.status !== "delivered") {
      return res
        .status(400)
        .json({ error: "Can only review completed bookings" });
    }

    if (booking.user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You can only review your own bookings" });
    }

    const existingReview = await Review.findOne({
      user: userId,
      driver: booking.driver,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({
          error: "You have already reviewed this driver for this booking",
        });
    }

    const review = await Review.create({
      user: userId,
      driver: booking.driver,
      rating,
      comment: comment || "",
    });

    res.json({
      success: true,
      message: "Review submitted successfully",
    });
  } catch (err) {
    console.error("Error submitting review:", err);
    res.status(500).json({ error: "Failed to submit review" });
  }
};
