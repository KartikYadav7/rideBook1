import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import { otpTemplate,resetPasswordTemplate } from "./emailTemplates.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationCode = async (userName,email, code) => {
  await transporter.sendMail({
    from: `"rideBook" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email",
   html: otpTemplate(userName, code)
  });
};

export const sendResetPasswordEmail = async (name,email, resetLink) => {
  await transporter.sendMail({    
    from: `"rideBook" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your password",
    html: resetPasswordTemplate(name,resetLink)  
  });
};

