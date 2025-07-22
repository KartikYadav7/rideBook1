import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const PaymentCancel = () => {
  const location = useLocation();
   const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const session_id = params.get("session_id");
    if (session_id) {
      axios.post(`${import.meta.env.VITE_BACKEND_URL}/cancel-payment`, { session_id },{headers:{Authorization:`${user.token}`}});
        // .catch(() => {});
    }
  }, [location,user.token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl  text-center">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Payment Cancelled</h2>
        <p className="mb-2">Your payment was not completed.</p>
        <p className="mb-2">If you believe this is a mistake, please try again or contact support.</p>
        <Link to="/" className="text-primary underline font-bold">Go to Home</Link>
      </div>
    </div>
  );
};

export default PaymentCancel; 