import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Button from "../Components/Button";
import CustomAlert from "../Components/CustomAlert";

const Review = () => {
  const { trackingNumber, bookingType } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setAlert({
        isOpen: true,
        title: "Rating Required",
        message: "Please select a rating",
        type: "warning"
      });
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/booking/${trackingNumber}/review`,
        { rating, comment },
        { headers: { Authorization: user.token } }
      );

      setAlert({
        isOpen: true,
        title: "Review Submitted",
        message: "Review submitted successfully! Thank you for your feedback.",
        type: "success"
      });
      navigate("/myRides");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setAlert({
          isOpen: true,
          title: "Submission Failed",
          message: err.response.data.error,
          type: "error"
        });
      } else {
        setAlert({
          isOpen: true,
          title: "Error",
          message: "Failed to submit review",
          type: "error"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ rating, onRatingChange }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`text-2xl ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            } hover:text-yellow-400 transition-colors`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* <Navbar /> */}
      <section className="min-h-screen bg-blue-50 py-8 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-primary mb-6 text-center">
            Rate Your Experience
          </h2>
          
          <div className="mb-4 text-center">
            <p className="text-gray-600 mb-2">Booking: {trackingNumber}</p>
            <p className="text-sm text-gray-500 capitalize">{bookingType}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex justify-center">
                <StarRating rating={rating} onRatingChange={setRating} />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows="4"
                placeholder="Tell us about your experience..."
                maxLength="500"
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {comment.length}/500
              </p>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                text="Cancel"
                className="flex-1 bg-gray-300 text-gray-800 hover:bg-gray-400"
                onClick={() => navigate("/myRides")}
                disabled={loading}
              />
              <Button
                type="submit"
                text={loading ? "Submitting..." : "Submit Review"}
                className="flex-1 bg-primary hover:bg-primary-dark"
                disabled={loading || rating === 0}
              />
            </div>
          </form>
        </div>
        <CustomAlert
          isOpen={alert.isOpen}
          onClose={() => setAlert({ ...alert, isOpen: false })}
          title={alert.title}
          message={alert.message}
          type={alert.type}
        />
      </section>
      <Footer />
    </>
  );
};

export default Review; 