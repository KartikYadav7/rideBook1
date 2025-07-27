

const baseEmailTemplate = ({ bodyContent, background = '#f1f5f9', maxWidth = 600 }) => `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; font-family: 'Segoe UI', sans-serif; background-color: ${background};">
    <div style="max-width: ${maxWidth}px; margin: 40px auto; background-color: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      ${bodyContent}
      <div style="margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 16px; font-size: 12px; color: #6b7280;">&copy; 2024 RideBook App - All rights reserved.</div>
    </div>
  </body>
</html>
`;

const bookingDetailsList = (details, showPrice = false) => {
  let list = `
    <ul>
      <li><strong>Tracking Number:</strong> ${details.trackingNumber}</li>
      <li><strong>Type:</strong> ${details.type}</li>
      <li><strong>Pickup:</strong> ${details.pickup}</li>
      <li><strong>Drop:</strong> ${details.drop}</li>
      <li><strong>Date:</strong> ${details.date}</li>
  `;
  if (showPrice && details.price !== undefined) {
    list += `<li><strong>Price:</strong> ₹${details.price}</li>`;
  }
  list += '</ul>';
  return list;
};

const sectionHeader = (text, color = '#2563eb') => `<h2 style="font-size: 24px; font-weight: bold; color: ${color};">${text}</h2>`;

export const otpTemplate = (userName, otpCode) => baseEmailTemplate({
  bodyContent: `
    ${sectionHeader('Verify Your Account')}
    <p style="margin-top: 16px; margin-bottom:4px;font-size: 16px;">Hello <strong>${userName}</strong>,</p>
    <p style="margin: 2px 0;">Your one-time password (OTP) for verifying your RideBook account is:</p>
    <div style="font-size: 28px; font-weight: bold; color: #10b981; margin:8px 0 2px 0 ;text-align: center; ">${otpCode}</div>
    <p style="font-size: 14px;">The code is valid for 10 minutes.</p>
  `
});

export const resetPasswordTemplate = (userName, resetLink) => baseEmailTemplate({
  bodyContent: `
    <h2 style="font-size: 24px; color: #dc2626; font-weight: 600;">Reset Your Password</h2>
    <p style="margin-bottom: 0;">Hi <strong>${userName}</strong>,</p>
    <p style="margin-top:4px;">You recently requested to reset your RideBook password.</p>
    <div style="margin: 24px 0;">
      <a href="${resetLink}" style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; border-radius: 6px; font-weight: 500; text-decoration: none;cursor: pointer; ">
        Reset Password
      </a>
    </div>
    <p style="margin-top: 0px;">The Link will expire in 10 mins.</p>
    <p style="margin-top: 9px;">Thanks, <br />The RideBook Team</p>
  `,
  background: '#f8fafc',
  maxWidth: 600
});

export const sendContactEmailTemplate = (userName, email, subject, message) => baseEmailTemplate({
  bodyContent: `
    <h2 style="margin:0; color:#333333; font-size:24px; text-align:center;">Contact Form Submission</h2>
    <p style="margin:4px 0 0 0; font-size:14px; color:#888; text-align:center;">You received a new message from rideBook</p>
    <hr style="border-top:1px solid #e0e0e0; margin:20px 0;" />
    <div style="padding: 12px 0;"><strong style="color:#444;">👤 Name:</strong><br /><span style="color:#333;">${userName}</span></div>
    <div style="padding: 12px 0;"><strong style="color:#444;">📧 Email:</strong><br /><span style="color:#333;">${email}</span></div>
    <div style="padding: 12px 0;"><strong style="color:#444;">📧 Subject:</strong><br /><span style="color:#333;">${subject}</span></div>
    <div style="padding: 12px 0;"><strong style="color:#444;">💬 Message:</strong><br /><p style="color:#333; line-height:1.6; margin-top:6px;">${message}</p></div>
    <hr style="border-top:1px solid #e0e0e0; margin:20px 0;" />
    <div style="padding-top:10px; text-align:center; font-size:12px; color:#aaa;">This is an automated email from <strong>RideBook</strong>. Please do not reply.</div>
  `,
  background: '#f7f9fc',
  maxWidth: 600
});

export const bookingConfirmationTemplate = (userName, details) => baseEmailTemplate({
  bodyContent: `
    ${sectionHeader('Booking Confirmed!', '#10b981')}
    <p>Hello <strong>${userName}</strong>,</p>
    <p>Your booking has been confirmed. Here are your details:</p>
    ${bookingDetailsList(details, true)}
    <p>Thank you for choosing RideBook!</p>
  `
});

export const bookingCancellationTemplate = (userName, details, contactForm = `${process.env.FRONTEND_URL}/contact`) => baseEmailTemplate({
  bodyContent: `
    ${sectionHeader('Booking Cancelled', '#dc2626')}
    <p>Hello <strong>${userName}</strong>,</p>
    <p>Your booking has been cancelled. Here are the details:</p>
    ${bookingDetailsList(details)}
    <p>Your Money will be refunded to your account within next 24 hours.</p>
    <p>If this was a mistake or you have questions, please contact support.</p>
    <a href="${contactForm}" style="cursor:pointer;"><button style="background-color: #dc2626; padding:10px 20px; color: #f1f5f9; font-weight: 600; border: none; border-radius: 10px;cursor:pointer;">Contact Support</button></a>
  `
});

export const driverBookingConfirmationTemplate = (driverName, details) => baseEmailTemplate({
  bodyContent: `
    ${sectionHeader('New Booking Assigned!', '#10b981')}
    <p>Hello <strong>${driverName}</strong>,</p>
    <p>You have been assigned a new booking. Here are the details:</p>
    ${bookingDetailsList(details)}
    <p>Please check your dashboard for more information.</p>
  `
});

export const driverBookingCancellationTemplate = (driverName, details) => baseEmailTemplate({
  bodyContent: `
    ${sectionHeader('Booking Cancelled', '#dc2626')}
    <p>Hello <strong>${driverName}</strong>,</p>
    <p>A booking assigned to you has been cancelled. Here are the details:</p>
    ${bookingDetailsList(details)}
    <p>No further action is required.</p>
  `
});

export const reviewRequestTemplate = (userName, bookingDetails) => baseEmailTemplate({
  bodyContent: `
    ${sectionHeader('How was your ride?', '#10b981')}
    <p style="margin-top: 16px; margin-bottom: 4px; font-size: 16px;">Hello <strong>${userName}</strong>,</p>
    <p style="margin: 2px 0;">Your recent booking has been completed! We'd love to hear about your experience.</p>
    
    ${sectionHeader('Booking Details', '#3b82f6')}
    ${bookingDetailsList(bookingDetails)}
    
    <div style="margin-top: 24px; padding: 16px; background-color: #f0f9ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
      <p style="margin: 0; font-weight: 600; color: #1e40af;">Please take a moment to rate your experience and provide feedback.</p>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #64748b;">Your review helps us improve our service and helps other customers make informed decisions.</p>
    </div>
    
    <div style="margin-top: 24px; text-align: center;">
      <a href="${process.env.FRONTEND_URL}/review/${bookingDetails.trackingNumber}" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Write a Review</a>
    </div>
    
    <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">Thank you for choosing RideBook!</p>
  `
});