import RideBooking from "../models/booking.js";
import PackageBooking from "../models/package.js";
import ReservationBooking from "../models/reservation.js";

export const cleanupCancelledBookings = async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 10);

    const deletedRides = await RideBooking.deleteMany({
      status: 'cancelled',
      updatedAt: { $lt: sevenDaysAgo }
    });

    const deletedPackages = await PackageBooking.deleteMany({
      status: 'cancelled',
      updatedAt: { $lt: sevenDaysAgo }
    });

    const deletedReservations = await ReservationBooking.deleteMany({
      status: 'cancelled',
      updatedAt: { $lt: sevenDaysAgo }
    });

    const totalDeleted = deletedRides.deletedCount + deletedPackages.deletedCount + deletedReservations.deletedCount;

    if (totalDeleted > 0) {
      console.info(`[CLEANUP] Successfully deleted ${totalDeleted} cancelled bookings:`);
      console.info(`  - Rides: ${deletedRides.deletedCount}`);
      console.info(`  - Packages: ${deletedPackages.deletedCount}`);
      console.info(`  - Reservations: ${deletedReservations.deletedCount}`);
    } else {
      console.info(`[CLEANUP] No cancelled bookings older than 7 days found`);
    }

    return {
      success: true,
      totalDeleted,
      details: {
        rides: deletedRides.deletedCount,
        packages: deletedPackages.deletedCount,
        reservations: deletedReservations.deletedCount
      }
    };
  } catch (error) {
    console.error('[CLEANUP] Error during cleanup:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

