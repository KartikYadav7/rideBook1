import axios from "axios";
import RideBooking from "../models/booking.js";
import PackageBooking from "../models/package.js";
import ReservationBooking from "../models/reservation.js";
import Cab from "../models/cab.js";
import DriverProfile from "../models/driverProfile.js";

function generateTrackingNumber(prefix) {
  const date = new Date().toISOString().slice(0,10).replace(/-/g,"");
  const random = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${date}-${random}`;
}

async function calculateDistance(pickupLocation, dropLocation) {
  const apiKey = process.env.API_KEY;

  const url = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${encodeURIComponent(pickupLocation)}&destinations=${encodeURIComponent(dropLocation)}&key=${apiKey}`;
  try {
    const response = await axios.get(url);
    const data = response.data;
    if (
      data.status !== "OK" ||
      !data.rows ||
      !data.rows[0].elements ||
      data.rows[0].elements[0].status !== "OK" ||
      !data.rows[0].elements[0].distance
    ) {
      console.error("Failed to fetch distance");
      throw new Error("Failed to fetch distance");
    }

   const element = data.rows[0].elements[0];
    const distanceText = element.distance.text; 
    const durationTime = element.duration.text; 

    const distanceKm = parseFloat(distanceText.replace(/[^0-9.]/g, ""));

    // Optionally log once, or remove for production
    console.log("Distance in calc distance:", distanceKm, "km", "Duration:", durationTime);
    
    return {distanceKm,durationTime};
  } catch (error) {
    console.error("Error fetching distance:", error.message);
    throw error;
  }
}

async function calculatePrice({ bookingType, weight, pickupLocation, dropLocation, distanceKm, durationTime }) {
  try {
    if (typeof distanceKm !== "number" || isNaN(distanceKm) || distanceKm <= 0) {
      const result = await calculateDistance(pickupLocation, dropLocation);
      distanceKm = result.distanceKm;
      durationTime = result.durationTime;
    }

    if (typeof distanceKm !== "number" || isNaN(distanceKm) || distanceKm <= 0) {
      throw new Error("Invalid distance calculated. Cannot proceed with price calculation.");
    }

    let base = 0;
    if (bookingType === "ride" || bookingType === "reservation") {
      base = 50 + distanceKm * 10;
    } else if (bookingType === "package") {
      if(weight<=10)   base = 30 + distanceKm * 12 + weight * 10;
      else if(weight<=25) base = 50 + distanceKm * 15 + weight * 8;
      else if(weight<=50) base = 110 + distanceKm * 18 + weight * 6;
    }
    return Math.round(base * 100);
  } catch (error) {
    console.error("Error calculating price:", error.message)
    throw new Error("Unable to calculate price due to distance calculation failure.");
  }
} 

async function findLeastBusyCab() {
  try {
   
    const cabCounts = await Cab.aggregate([
      { $group: { _id: "$cab", count: { $sum: 1 } } }
    ]);
    
   
    const packageCabCounts = await PackageBooking.aggregate([
      { $group: { _id: "$cab", count: { $sum: 1 } } }
    ]);
    
  
    const reservationCabCounts = await ReservationBooking.aggregate([
      { $group: { _id: "$cab", count: { $sum: 1 } } }
    ]);

    
    const countMap = {};
    
   
    cabCounts.forEach(c => {
      const cabId = c._id?.toString();
      if (cabId) countMap[cabId] = (countMap[cabId] || 0) + c.count;
    });
    
    
    packageCabCounts.forEach(c => {
      const cabId = c._id?.toString();
      if (cabId) countMap[cabId] = (countMap[cabId] || 0) + c.count;
    });
    
    // Add reservation booking counts
    reservationCabCounts.forEach(c => {
      const cabId = c._id?.toString();
      if (cabId) countMap[cabId] = (countMap[cabId] || 0) + c.count;
    });

    // Get all cabs
    const cabs = await Cab.find();
    // Sort by count (ascending) - least busy first
    cabs.sort((a, b) => (countMap[a._id.toString()] || 0) - (countMap[b._id.toString()] || 0));
    return cabs[0] || null;
  } catch (error) {
    console.error("Error finding least busy cab:", error);
    return null;
  }
}

async function findLeastBusyDriver() {
  try {
    // Aggregate bookings by driver and count
    const driverCounts = await RideBooking.aggregate([
      { $group: { _id: "$driver", count: { $sum: 1 } } }
    ]);
    
    // Also count package bookings
    const packageDriverCounts = await PackageBooking.aggregate([
      { $group: { _id: "$driver", count: { $sum: 1 } } }
    ]);
    
    // Also count reservation bookings
    const reservationDriverCounts = await ReservationBooking.aggregate([
      { $group: { _id: "$driver", count: { $sum: 1 } } }
    ]);

    // Combine all counts
    const countMap = {};
    
    // Add ride booking counts
    driverCounts.forEach(d => {
      const driverId = d._id?.toString();
      if (driverId) countMap[driverId] = (countMap[driverId] || 0) + d.count;
    });
    
    // Add package booking counts
    packageDriverCounts.forEach(d => {
      const driverId = d._id?.toString();
      if (driverId) countMap[driverId] = (countMap[driverId] || 0) + d.count;
    });
    
    // Add reservation booking counts
    reservationDriverCounts.forEach(d => {
      const driverId = d._id?.toString();
      if (driverId) countMap[driverId] = (countMap[driverId] || 0) + d.count;
    });

    // Get all drivers
    const drivers = await DriverProfile.find();
    // Sort by count (ascending) - least busy first
    drivers.sort((a, b) => (countMap[a.user.toString()] || 0) - (countMap[b.user.toString()] || 0));
    return drivers[0] || null;
  } catch (error) {
    console.error("Error finding least busy driver:", error);
    return null;
  }
}

export {generateTrackingNumber, calculateDistance,calculatePrice, findLeastBusyCab, findLeastBusyDriver };