import User from "../models/user.js";
import DriverProfile from "../models/driverProfile.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  sendVerificationCode,
  sendResetPasswordEmail,
} from "../utils/mailer.js";

const FRONTEND_URL = process.env.FRONTEND_URL;

export const register = async (req, res) => {
  const { userName, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "Email Already Exists" });

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: userName,
      email,
      password: hashedPassword,
      verificationCode,
      codeExpiresAt,
      role: role === "drivingPartner" ? "drivingPartner" : "user",
    });
    await newUser.save();
    if (role === "drivingPartner") {
      const { licenseNumber } = req.body;

      const driverProfile = new DriverProfile({
        user: newUser._id,
        licenseNumber,
      });

      await driverProfile.save();
    }
    await sendVerificationCode(newUser.name, email, verificationCode);

    return res.status(200).json({
      msg: "Registration Successful",
      userId: newUser._id,
      email: newUser.email,
      isVerified: newUser.isVerified,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const verifyCode = async (req, res) => {
  try {
    const { userId, code } = req.body;
    const user = await User.findById(userId);

    if (!user || user.verificationCode !== code)
      return res.status(400).json({ msg: "Invalid code" });
    if (new Date() > user.codeExpiresAt) {
      return res.status(400).json({ success: false, msg: "OTP expired" });
    }
    user.isVerified = true;
    user.verificationCode = null;
    user.codeExpiresAt = null;

    await user.save();

    res.status(200).json({ msg: "Verified successfully", success: true });
  } catch (err) {
    res.status(500).json({ msg: "Code verification failed", err });
  }
};

export const resendCode = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, msg: "User not found" });

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.codeExpiresAt = codeExpiresAt;
    await user.save();

    await sendVerificationCode(user.name, user.email, verificationCode);

    res.json({ success: true, msg: "OTP resent" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Failed to resend OTP", err });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Email Doesn't Exist" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid Password" });

    const token = jwt.sign(
      { userId: user._id, userEmail: user.email, userRole: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "999D",
      }
    );

    return res.json({
      token,
      userId: user._id,
      userEmail: user.email,
      userName: user.name,
      isVerified: user.isVerified,
      userRole: user.role,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const resetPasswordLink = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    const resetLink = `${FRONTEND_URL}/resetpassword/${token}`;
    await sendResetPasswordEmail(user.name, user.email, resetLink);
    res.json({ msg: "Password reset link sent to your email." });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ msg: "Server error." });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(400).json({ msg: "Invalid or Expired token." });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ msg: "Your password has been updated successfully." });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ msg: "Try Again with a New ResetLink" });
    }
    return res.status(500).json({ msg: "Internal Server Error." });
  }
};
