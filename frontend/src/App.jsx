import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import LandingPage from "./Pages/LandingPage";
import BookingForm from "./Pages/BookingForm";
import MyRides from "./Pages/MyRides";
import ContactForm from "./Pages/ContactForm";
import PaymentSuccess from "./Pages/PaymentSuccess";
import PaymentCancel from "./Pages/PaymentCancel";
import Review from "./Pages/Review";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import { ResetPasswordModal, ResetPasswordPage } from "./Pages/ResetPassword";
import EmailVerification from "./Pages/EmailVerification";
import Error from "./Pages/Error";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/bookingForm" element={<BookingForm />} />
            <Route path="/myRides" element={<MyRides />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            <Route path="/review/:trackingNumber" element={<Review />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="signUp" element={<SignUp />} />
          <Route path="/resetPassword" element={<ResetPasswordModal />} />
          <Route path="/verification" element={<EmailVerification />} />
          <Route path="/resetPassword/:token" element={<ResetPasswordPage />} />

          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
