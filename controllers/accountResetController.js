// controllers/settingsController.js
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../model/User.js"; // adjust path
import sendEmail from "../utils/sendEmail.js"; // optional helper you may create

// Request password reset (forgot password) - POST /auth/request-password-reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) {
      // don't reveal that user doesn't exist — respond success for security
      return res.json({
        message: "Password reset email sent if account exists",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 minutes
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Try to send email; if your dev env doesn't have mailer, fallback to console
    try {
      await sendEmail({
        to: user.email,
        subject: "Password reset",
        text: `Reset your password by visiting: ${resetUrl}`,
        html: `
    <h2>Password Reset</h2>
    <p>You requested to reset your password.</p>
    <p>
      <a href="${resetUrl}" 
         style="padding:10px 15px;background:#2563eb;color:white;text-decoration:none;border-radius:5px;">
        Reset Password
      </a>
    </p>
    <p>This link expires in 15 minutes.</p>
  `,
      });
      return res.json({ message: "Password reset email sent" });
    } catch (emailErr) {
      console.warn("Email failed, fallback to console:", emailErr);
      // For dev: return token in response (or log)
      console.log("Password reset URL (dev):", resetUrl);
      return res.json({
        message: "Password reset token generated (dev)",
        resetUrl,
      });
    }
  } catch (err) {
    console.error("requestPasswordReset:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reset password by token - POST /auth/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    if (!token || !newPassword)
      return res.status(400).json({ message: "Invalid request" });

    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+password");

    if (!user)
      return res.status(400).json({ message: "Token invalid or expired" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.mustChangePassword = false;
    await user.save();

    res.json({ message: "Password has been reset. You can now log in." });
  } catch (err) {
    console.error("resetPassword:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
