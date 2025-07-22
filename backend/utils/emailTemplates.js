
export const otpTemplate = (userName, otpCode) => `
<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; font-family: 'Segoe UI', sans-serif; background-color: #f1f5f9;">
    <div style="max-width: 600px; margin: 40px auto; background-color: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <h2 style="font-size: 24px; font-weight: bold; color: #2563eb;">Verify Your Account</h2>
      <p style="margin-top: 16px; margin-bottom:4px;font-size: 16px;">Hello <strong>${userName}</strong>,</p>
      <p style="margin: 2px 0;">Your one-time password (OTP) for verifying your RideBook account is:</p>
      <div style="font-size: 28px; font-weight: bold; color: #10b981; margin:8px 0 2px 0 ;text-align: center; ">${otpCode}</div>
      <p style="font-size: 14px;">The code is valid for 10 minutes.</p>
     <div style="margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 16px; font-size: 12px; color: #6b7280;">&copy; 2024 RideBook App - All rights reserved.</div>
    </div>
  </body>
</html>
`;

export const resetPasswordTemplate = (userName, resetLink) => `
<!DOCTYPE html>
<html lang="en">
  <body style="background-color: #f8fafc; font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 40px auto; background: #ffffff; padding: 32px; border-radius: 10px; box-shadow: 0px 0px 20px rgba(0,0,0,0.05); ">

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

      <div style="margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 16px; font-size: 12px; color: #6b7280;">
        &copy;2024 RideBook App - All rights reserved.</div>
    </div>
  </body>
</html>

`;
