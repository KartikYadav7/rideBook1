import RideBooking from "../models/booking.js";
import PackageBooking from "../models/package.js";
import ReservationBooking from "../models/reservation.js";
import Cab from "../models/cab.js";
import DriverProfile from "../models/driverProfile.js";
import Payment from "../models/payment.js";
import { findLeastBusyCab, findLeastBusyDriver, calculatePrice ,generateTrackingNumber} from "../utils/helper.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const calculateBookingPrice = async (req, res) => {
  const { bookingType, weight, pickupLocation, dropLocation } = req.body;
    console.log("API CALLED", Date.now(), req.body);

  if (!bookingType || !pickupLocation || !dropLocation) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const { distanceKm, durationTime } = await import("../utils/helper.js").then(m => m.calculateDistance(pickupLocation, dropLocation));
    const amount = await import("../utils/helper.js").then(m => m.calculatePrice({ bookingType, weight, pickupLocation, dropLocation, distanceKm, durationTime }));
    const priceInRupees = amount / 100;
    
    return res.status(200).json({ 
      price: priceInRupees,
      amount: amount,
      currency: "INR",
      distance: distanceKm,
      duration: durationTime
    });
  } catch (error) {
    console.error("Price calculation failed:", error);
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
    weight = 0,
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
    cab = await Cab.findOne({ status: "available" }) || await findLeastBusyCab();
    driverProfile = await DriverProfile.findOne({ status: "available" }) || await findLeastBusyDriver();

    if (!cab || !driverProfile) {
      return res.status(400).json({ success: false, msg: "No cab/driver available" });
    }

    const amount = await calculatePrice({ bookingType, weight, pickupLocation, dropLocation }); // in paise
console.info(`Calculated amount in create checkout session ${bookingType}: ₹${amount / 100} (${amount} paise)`);
    // Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "inr",
          product_data: {
            name: `${bookingType.charAt(0).toUpperCase() + bookingType.slice(1)} Booking`,
            description: `From ${pickupLocation} to ${dropLocation}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
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
      amount: amount / 100,
      paymentMethod: "card",
      paymentStatus: "pending",
      transactionId: session.id,
      // Link to booking type (will update after booking is created)
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

    return res.status(200).json({ id: session.id, price: amount / 100, trackingNumber: bookingData.trackingNumber });
  } catch (error) {
    console.error("Stripe session creation failed:", error);
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
};

export const cancelPayment = async (req, res) => {
  const { session_id } = req.body;
  if (!session_id) return res.status(400).json({ error: "Missing session_id" });
  try {
    const payment = await Payment.findOne({ transactionId: session_id, paymentStatus: "pending" });
    if (!payment) return res.status(404).json({ error: "Pending payment not found" });
    // Remove associated booking
    if (payment.rideBooking) {
      await RideBooking.findByIdAndDelete(payment.rideBooking);
    } else if (payment.reservationBooking) {
      await ReservationBooking.findByIdAndDelete(payment.reservationBooking);
    } else if (payment.packageBooking) {
      await PackageBooking.findByIdAndDelete(payment.packageBooking);
    }
    await payment.deleteOne();
    return res.json({ success: true, message: "Pending payment and booking deleted." });
  } catch (err) {
    console.error("Error during manual cancel cleanup:", err);
    return res.status(500).json({ error: "Failed to clean up pending payment/booking" });
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
    if (session.payment_status === "paid" && payment.paymentStatus !== "completed") {
      payment.paymentStatus = "completed";
      await payment.save();
      // Update booking status as well
      if (payment.rideBooking) {
        await RideBooking.findByIdAndUpdate(payment.rideBooking, { status: "confirmed" });
        // Set driver status to busy
        const rideBooking = await RideBooking.findById(payment.rideBooking);
        if (rideBooking && rideBooking.driver) {
          await DriverProfile.findOneAndUpdate({ user: rideBooking.driver }, { status: "busy" });
        }
        trackingNumber = rideBooking?.trackingNumber;
        bookingStatus = "confirmed";
      } else if (payment.reservationBooking) {
        await ReservationBooking.findByIdAndUpdate(payment.reservationBooking, { status: "confirmed" });
        // Set driver status to busy
        const reservationBooking = await ReservationBooking.findById(payment.reservationBooking);
        if (reservationBooking && reservationBooking.driver) {
          await DriverProfile.findOneAndUpdate({ user: reservationBooking.driver }, { status: "busy" });
        }
        trackingNumber = reservationBooking?.trackingNumber;
        bookingStatus = "confirmed";
      } else if (payment.packageBooking) {
        await PackageBooking.findByIdAndUpdate(payment.packageBooking, { status: "confirmed" });
        // Set driver status to busy
        const packageBooking = await PackageBooking.findById(payment.packageBooking);
        if (packageBooking && packageBooking.driver) {
          await DriverProfile.findOneAndUpdate({ user: packageBooking.driver }, { status: "busy" });
        }
        trackingNumber = packageBooking?.trackingNumber;
        bookingStatus = "confirmed";
      }
    } else {
     return
    }
    return res.json({ paymentStatus: payment.paymentStatus, bookingStatus, trackingNumber });
  } catch (err) {
    console.error("Error checking payment status:", err);
    return res.status(500).json({ error: "Failed to check payment status" });
  }
};

// Get all bookings for a user (rides, packages, reservations)
export const getUserBookings = async (req, res) => {
  const { userId } = req.params;
  try {
    const rides = await RideBooking.find({ user: userId });
    const packages = await PackageBooking.find({ user: userId });
    const reservations = await ReservationBooking.find({ user: userId });
    res.json({ rides, packages, reservations });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user bookings' });
  }
};


// Update a booking status (by tracking number and type)
export const updateBookingStatus = async (req, res) => {
  const { trackingNumber, bookingType } = req.params;
  const { status, ...updateFields } = req.body;
  try {
    let Model;
    if (bookingType === 'ride') Model = RideBooking;
    else if (bookingType === 'package') Model = PackageBooking;
    else if (bookingType === 'reservation') Model = ReservationBooking;
    else return res.status(400).json({ error: 'Invalid booking type' });

    const booking = await Model.findOneAndUpdate(
      { trackingNumber },
      { $set: { status, ...updateFields } },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

// Cancel a booking (by tracking number and type)
export const cancelBooking = async (req, res) => {
  const { trackingNumber, bookingType } = req.params;
  try {
    let Model;
    if (bookingType === 'ride') Model = RideBooking;
    else if (bookingType === 'package') Model = PackageBooking;
    else if (bookingType === 'reservation') Model = ReservationBooking;
    else return res.status(400).json({ error: 'Invalid booking type' });

    const booking = await Model.findOneAndUpdate(
      { trackingNumber },
      { $set: { status: 'cancelled' } },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

