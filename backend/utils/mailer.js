import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationCode = async (email, code) => {
  await transporter.sendMail({
    from: `"rideBook" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email",
    text: `Your verification code is: ${code}`,
  });
};

export default transporter;