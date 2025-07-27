import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import { otpTemplate,resetPasswordTemplate,sendContactEmailTemplate,bookingConfirmationTemplate,bookingCancellationTemplate, driverBookingConfirmationTemplate, driverBookingCancellationTemplate, reviewRequestTemplate } from "./emailTemplates.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, html, from }) => {
  await transporter.sendMail({
    from: from || `"rideBook" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export const sendVerificationCode = async (userName, email, code) => {
  await sendEmail({
    to: email,
    subject: "Verify Your Email",
    html: otpTemplate(userName, code),
  });
};

export const sendResetPasswordEmail = async (name, email, resetLink) => {
  await sendEmail({
    to: email,
    subject: "Reset Your Password",
    html: resetPasswordTemplate(name, resetLink),
  });
};

export const sendContactEmail = async (name, email, subject, message) => {
  await sendEmail({
    from: email,
    to: `${process.env.EMAIL_USER}`,
    subject: "Contact Form Submission",
    html: sendContactEmailTemplate(name, email, subject, message),
  });
};

export const sendBookingConfirmationEmail = async (userName, email, details) => {
  await sendEmail({
    to: email,
    subject: "Your Booking is Confirmed!",
    html: bookingConfirmationTemplate(userName, details),
  });
};

export const sendBookingCancellationEmail = async (userName, email, details) => {
  await sendEmail({
    to: email,
    subject: "Your Booking has been Cancelled",
    html: bookingCancellationTemplate(userName, details),
  });
};

export const sendDriverBookingConfirmationEmail = async (driverName, email, details) => {
  await sendEmail({
    to: email,
    subject: "New Booking Assigned!",
    html: driverBookingConfirmationTemplate(driverName, details),
  });
};

export const sendDriverBookingCancellationEmail = async (driverName, email, details) => {
  await sendEmail({
    to: email,
    subject: "Booking Cancelled",
    html: driverBookingCancellationTemplate(driverName, details),
  });
};

export const sendReviewRequestEmail = async (userName, email, bookingDetails) => {
  await sendEmail({
    to: email,
    subject: "How was your ride? Please leave a review",
    html: reviewRequestTemplate(userName, bookingDetails),
  });
};