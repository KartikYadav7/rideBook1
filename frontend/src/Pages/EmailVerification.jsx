import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Button from "../Components/Button";
import { useDispatch, useSelector } from "react-redux";
import { markVerified } from "../Redux/userSlice";

const OtpInput = ({ length = 4, onOtpSubmit = () => {} }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // allow only one input
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // submit trigger
    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length) onOtpSubmit(combinedOtp);

    // Move to next input if current field is filled
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1, 1);

    // optional
    if (index > 0 && !otp[index - 1]) {
      inputRefs.current[otp.indexOf("")].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      // Move focus to the previous input field on backspace
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="space-x-2">
      {otp.map((value, index) => {
        return (
          <input
            key={index}
            type="text"
            ref={(input) => (inputRefs.current[index] = input)}
            value={value}
            onChange={(e) => handleChange(index, e)}
            onClick={() => handleClick(index)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-10 h-12  border border-blue-200 rounded-lg px-2 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-primary text-center text-base"
          />
        );
      })}
    </div>
  );
};

const EmailVerification = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [otpExpiresIn, setOtpExpiresIn] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId, email } = useSelector((state) => state.user.user || {});

  // Initialize timers from localStorage on component mount
  useEffect(() => {
    const now = Date.now();

    // Get resend timer from localStorage
    let resendEndTime = localStorage.getItem("emailVerification_resendEndTime");
    if (!resendEndTime) {
      resendEndTime = now + 60 * 1000;
      localStorage.setItem(
        "emailVerification_resendEndTime",
        resendEndTime.toString()
      );
    }
    const remainingResendTime = Math.max(
      0,
      Math.ceil((parseInt(resendEndTime) - now) / 1000)
    );
    setResendTimer(remainingResendTime);

    // Get OTP expiration timer from localStorage
    let otpEndTime = localStorage.getItem("emailVerification_otpEndTime");
    if (!otpEndTime) {
      otpEndTime = now + 600 * 1000;
      localStorage.setItem(
        "emailVerification_otpEndTime",
        otpEndTime.toString()
      );
    }
    const remainingOtpTime = Math.max(
      0,
      Math.ceil((parseInt(otpEndTime) - now) / 1000)
    );
    setOtpExpiresIn(remainingOtpTime);
  }, []);

  // Countdown for resend timer
  useEffect(() => {
    if (resendTimer === 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        const newValue = prev - 1;
        if (newValue === 0) {
          localStorage.removeItem("emailVerification_resendEndTime");
        }
        return newValue;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Countdown for OTP expiration
  useEffect(() => {
    if (otpExpiresIn === 0) return;
    const interval = setInterval(() => {
      setOtpExpiresIn((prev) => {
        const newValue = prev - 1;
        if (newValue === 0) {
          localStorage.removeItem("emailVerification_otpEndTime");
        }
        return newValue;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [otpExpiresIn]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const maskEmail = (email) => {
    if (!email) return "";
    const [localPart, domain] = email.split("@");
    const maskedLocal =
      localPart.slice(0, 2) + "*".repeat(localPart.length - 2);
    return `${maskedLocal}@${domain}`;
  };

  const handleOtpSubmit = async () => {
    try {
      if (otp.length !== 6) {
        setError("Please enter a valid 6-digit OTP");
        return;
      }
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/verifyCode`,
        {
          userId,
          code: otp,
        }
      );
      if (res.data.success) {
        // Clear timers from localStorage on successful verification
        localStorage.removeItem("emailVerification_resendEndTime");
        localStorage.removeItem("emailVerification_otpEndTime");
        dispatch(markVerified());
        navigate("/login");
      } else {
        setError(res.data.msg || "Verification failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          err.response?.data?.error ||
          "Verification failed. Please try again."
      );
    }
  };

  const handleResend = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/resendCode`, {
        userId,
      });

      const now = Date.now();
      const resendEndTime = now + 60 * 1000; // 60 seconds from now
      const otpEndTime = now + 600 * 1000; // 10 minutes from now

      localStorage.setItem(
        "emailVerification_resendEndTime",
        resendEndTime.toString()
      );
      localStorage.setItem(
        "emailVerification_otpEndTime",
        otpEndTime.toString()
      );

      setResendTimer(60);
      setOtpExpiresIn(600);
      setError("");
    } catch (err) {
      setError("Failed to resend code");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-2">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-10 space-y-2">
        <h2 className="text-center text-4xl font-bold text-primary mb-2">
          Verify Email
        </h2>
        <p className="text-center text-primary mb-2">
          Enter the 6-digit code sent to <br />
          <span className="font-medium">{maskEmail(email)}</span>
        </p>

        <div className="flex justify-center mb-2">
          <OtpInput length={6} onOtpSubmit={setOtp} />
        </div>

        {otpExpiresIn > 0 && (
          <p className="text-sm text-primary text-center mb-0 ">
            OTP expires in{" "}
            <span className="font-medium">{formatTime(otpExpiresIn)}</span>
          </p>
        )}
        <p className="text-red-500 text-xs text-center h-2.5 ">{error}</p>

        <Button
          text="VERIFY"
          type="button"
          onClick={handleOtpSubmit}
          className={`w-full py-2 rounded cursor-pointer text-white ${
            otpExpiresIn === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-black"
          }`}
          disabled={otpExpiresIn === 0}
        />

        <button
          onClick={handleResend}
          disabled={resendTimer > 0}
          className="w-full text-sm text-blue-600 hover:underline cursor-pointer disabled:opacity-50"
        >
          {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
        </button>
      </div>
    </section>
  );
};

export default EmailVerification;
