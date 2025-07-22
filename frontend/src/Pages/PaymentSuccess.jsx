import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useSelector((state) => state.user);

  const checkStatus = useCallback(async () => {
    if (!sessionId) {
      setError("Invalid payment session.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/check-payment-status`,
        { session_id: sessionId },{headers:{Authorization:`${user.token}`}});
      setStatus(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to check payment status"
      );
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, [sessionId,user.token]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <div className="text-green-600">Checking payment status...</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <div className="text-red-500 mb-4">{error}</div>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={checkStatus}
          >
            Retry
          </button>
          <Link to="/" className="block mt-6 text-primary font-bold underline">
            Go to Home
          </Link>
        </div>
      </div>
    );

  const renderStatusMessage = () => {
    if (!status) return null;
    if (status.paymentStatus === "completed") {
      return (
        <p className="text-green-600 font-semibold">
          Thank you for your booking! Your payment was successful and your booking is confirmed.
        </p>
      );
    }
    if (status.paymentStatus === "pending") {
      return (
        <p className="text-yellow-600 font-semibold">
          Your payment is pending. Please wait or contact support if this takes too long.
        </p>
      );
    }
    if (status.paymentStatus === "failed") {
      return (
        <p className="text-red-600 font-semibold">
          Payment failed. Please try again or contact support.
        </p>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded shadow text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Payment Status</h2>
        <p className="mb-2">
          Transaction ID: <span className="font-mono text-xs">{sessionId}</span>
        </p>
        <p className="mb-2">
          Payment: <b>{status?.paymentStatus}</b>
        </p>
        <p className="mb-2">
          Booking: <b>{status?.bookingStatus}</b>
        </p>
        {status?.trackingNumber && (
          <p className="mb-2 text-primary font-semibold">
            Tracking Number: <span className="font-mono">{status.trackingNumber}</span>
          </p>
        )}
        {renderStatusMessage()}
        <a href="/" className="text-blue-600 underline">
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default PaymentSuccess;