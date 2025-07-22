import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import axios from "axios";
import Button from "../Components/Button";

const statusColors = {
  confirmed: "text-green-600 border-green-400 bg-green-50",
  completed: "text-blue-600 border-blue-400 bg-blue-50",
  requested: "text-yellow-600 border-yellow-400 bg-yellow-50",
  cancelled: "text-red-600 border-red-400 bg-red-50",
  "in-progress": "text-indigo-600 border-indigo-400 bg-indigo-50",
  "in-transit": "text-indigo-600 border-indigo-400 bg-indigo-50",
  delivered: "text-green-700 border-green-500 bg-green-100",
  pending: "text-yellow-600 border-yellow-400 bg-yellow-50",
};

const MyRides = () => {
  const { user } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState({ rides: [], packages: [], reservations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [updateDialog, setUpdateDialog] = useState({ open: false, type: '', trackingNumber: '', oldStatus: '', newStatus: '' });

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/${user.userId}/bookings`,
          { headers: { Authorization: user.token } }
        );
        setBookings(res.data);
      } catch (err) {
        setError("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const handleCancel = async (type, trackingNumber) => {
    setActionLoading(trackingNumber + type);
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/booking/${type}/${trackingNumber}/cancel`,
        {},
        { headers: { Authorization: user.token } }
      );
      setBookings((prev) => {
        const update = (arr) =>
          arr.map((b) =>
            b.trackingNumber === trackingNumber ? { ...b, status: "cancelled" } : b
          );
        return {
          rides: type === "ride" ? update(prev.rides) : prev.rides,
          packages: type === "package" ? update(prev.packages) : prev.packages,
          reservations: type === "reservation" ? update(prev.reservations) : prev.reservations,
        };
      });
    } catch (err) {
      alert("Failed to cancel booking");
    } finally {
      setActionLoading("");
    }
  };

  const handleUpdateStatus = async () => {
    const { type, trackingNumber, newStatus, oldStatus } = updateDialog;
    if (!newStatus || newStatus === oldStatus) return setUpdateDialog({ open: false, type: '', trackingNumber: '', oldStatus: '', newStatus: '' });
    setActionLoading(trackingNumber + type + "update");
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/booking/${type}/${trackingNumber}`,
        { status: newStatus },
        { headers: { Authorization: user.token } }
      );
      setBookings((prev) => {
        const update = (arr) =>
          arr.map((b) =>
            b.trackingNumber === trackingNumber ? { ...b, status: newStatus } : b
          );
        return {
          rides: type === "ride" ? update(prev.rides) : prev.rides,
          packages: type === "package" ? update(prev.packages) : prev.packages,
          reservations: type === "reservation" ? update(prev.reservations) : prev.reservations,
        };
      });
      setUpdateDialog({ open: false, type: '', trackingNumber: '', oldStatus: '', newStatus: '' });
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setActionLoading("");
    }
  };

  const renderBookingCard = (booking, type) => (
    <div
      key={booking.trackingNumber}
      className={`border rounded-lg p-4 mb-4 bg-white shadow flex flex-col md:flex-row md:items-center md:justify-between gap-2`}
    >
      <div className="flex-1">
        <div className="flex flex-wrap gap-2 items-center mb-1">
          <span className="font-semibold text-lg text-primary">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
          <span className={`ml-2 px-2 py-1 rounded text-xs border ${statusColors[booking.status] || "text-gray-600 border-gray-300 bg-gray-50"}`}>
            {booking.status}
          </span>
        </div>
        <div className="text-sm text-gray-700 mb-1">
          <b>TrackingID:</b> <span className="font-mono">{booking.trackingNumber}</span>
        </div>
        {type === "ride" || type === "reservation" ? (
          <>
            <div className="text-sm text-gray-700">
              <b>From:</b> {booking.pickupLocation} <b>To:</b> {booking.dropLocation}
            </div>
            {type === "reservation" && (
              <div className="text-sm text-gray-700">
                <b>Date:</b> {new Date(booking.date).toLocaleString()} <b>People:</b> {booking.people}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="text-sm text-gray-700">
              <b>Sender:</b> {booking.senderName} <b>Receiver:</b> {booking.receiverName}
            </div>
            <div className="text-sm text-gray-700">
              <b>From:</b> {booking.pickupLocation} <b>To:</b> {booking.dropLocation}
            </div>
            <div className="text-sm text-gray-700">
              <b>Weight:</b> {booking.weight}kg
            </div>
          </>
        )}
        {booking.note && (
          <div className="text-xs text-gray-500 mt-1">Note: {booking.note}</div>
        )}
      </div>
      <div className="flex flex-col gap-2 min-w-[120px] items-end">
        {booking.status !== "cancelled" && booking.status !== "completed" && (
          <>
            <Button
              text={actionLoading === booking.trackingNumber + type ? "Cancelling..." : "Cancel"}
              className="bg-red-600 hover:bg-red-700 w-full"
              onClick={() => handleCancel(type, booking.trackingNumber)}
              disabled={actionLoading === booking.trackingNumber + type}
            />
            <Button
              text={actionLoading === booking.trackingNumber + type + "update" ? "Updating..." : "Update"}
              className="bg-primary hover:bg-primary-dark w-full"
              onClick={() => setUpdateDialog({ open: true, type, trackingNumber: booking.trackingNumber, oldStatus: booking.status, newStatus: booking.status })}
              disabled={actionLoading === booking.trackingNumber + type + "update"}
            />
          </>
        )}
      </div>
    </div>
  );

  // Possible status values for each type
  const statusOptions = {
    ride: ["requested", "confirmed", "in-progress", "completed", "cancelled"],
    reservation: ["requested", "confirmed", "in-progress", "completed", "cancelled"],
    package: ["requested", "confirmed", "in-transit", "delivered", "cancelled"],
  };

  // Dialog box JSX
  const UpdateStatusDialog = () => (
    updateDialog.open ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
          <h3 className="text-xl font-bold text-primary mb-4">Update Booking Status</h3>
          <label className="block mb-2 text-sm font-medium text-gray-700">Select or enter new status:</label>
          <input
            className="border rounded px-3 py-2 w-full mb-4"
            type="text"
            list="status-list"
            value={updateDialog.newStatus}
            onChange={e => setUpdateDialog(d => ({ ...d, newStatus: e.target.value }))}
            disabled={actionLoading === updateDialog.trackingNumber + updateDialog.type + "update"}
            placeholder="Type or select status..."
          />
          <datalist id="status-list">
            {(statusOptions[updateDialog.type] || []).map(opt => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
          <div className="flex justify-end gap-2 mt-4">
            <Button text="Cancel" className="bg-gray-300 text-gray-800 hover:bg-gray-400" onClick={() => setUpdateDialog({ open: false, type: '', trackingNumber: '', oldStatus: '', newStatus: '' })} disabled={actionLoading === updateDialog.trackingNumber + updateDialog.type + "update"} />
            <Button text={actionLoading === updateDialog.trackingNumber + updateDialog.type + "update" ? "Updating..." : "Update"} className="bg-primary hover:bg-primary-dark" onClick={handleUpdateStatus} disabled={actionLoading === updateDialog.trackingNumber + updateDialog.type + "update" || !updateDialog.newStatus || updateDialog.newStatus === updateDialog.oldStatus} />
          </div>
        </div>
      </div>
    ) : null
  );

  return (
    <>
    <Navbar/>
    <section className="min-h-screen bg-blue-50 py-8 px-2 md:px-0">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-6">My Rides & Bookings</h2>
        {loading ? (
          <div className="text-center text-primary">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <>
            {bookings.rides.length === 0 && bookings.packages.length === 0 && bookings.reservations.length === 0 ? (
              <div className="text-center text-gray-500">No bookings found.</div>
            ) : (
              <>
                {bookings.rides.map((b) => renderBookingCard(b, "ride"))}
                {bookings.packages.map((b) => renderBookingCard(b, "package"))}
                {bookings.reservations.map((b) => renderBookingCard(b, "reservation"))}
              </>
            )}
          </>
        )}
      </div>
      <UpdateStatusDialog />
    </section>
    <Footer/>
    </>
  );
};

export default MyRides; 