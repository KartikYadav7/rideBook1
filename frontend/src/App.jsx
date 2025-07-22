import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import { ResetPasswordModal, ResetPasswordPage } from "./Pages/ResetPassword";
import Error from "./Pages/Error";
import MyRides from "./Pages/MyRides";
import BookingForm from "./Pages/BookingForm";
import ContactForm from "./Pages/ContactForm";
import EmailVerification from "./Pages/EmailVerification";
import ProtectedRoute from "./Components/ProtectedRoute";
import PaymentSuccess from "./Pages/PaymentSuccess";
import PaymentCancel from "./Pages/PaymentCancel";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<ProtectedRoute />}>
            {" "}
            <Route path="/" element={<LandingPage />} />
            <Route path="/bookingForm" element={<BookingForm />} />
            <Route path="/myRides" element={<MyRides />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
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
