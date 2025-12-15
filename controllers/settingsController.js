// controllers/settingsController.js
import bcrypt from "bcryptjs";
import User from "../model/User.js"; // adjust path
import sendEmail from "../utils/sendEmail.js"; // optional helper you may create

// Update profile (self) - PATCH /api/users/me
export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id; // verifyJWT should have set req.user
    const { fullName, email } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (fullName !== undefined) user.fullName = fullName;
    if (email !== undefined) {
      // optionally check for duplicate email
      const exists = await User.findOne({ email, _id: { $ne: userId } });
      if (exists)
        return res.status(400).json({ message: "Email already in use" });
      user.email = email;
    }

    await user.save();

    // Optionally: issue new access token if you want JWT to reflect changes.
    // But here we return updated user; frontend can refresh auth state.
    const userSafe = user.toObject();
    delete userSafe.password;
    delete userSafe.refreshToken;

    res.json({ message: "Profile updated", user: userSafe });
  } catch (err) {
    console.error("updateMyProfile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Change password (logged-in / requires old password) - PATCH /api/users/change-password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old and new password required" });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match)
      return res.status(400).json({ message: "Incorrect old password" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.mustChangePassword = false;

    // Optionally: invalidate refresh tokens (clear found refreshToken)
    user.refreshToken = "";
    await user.save();

    // If you want to force logout everywhere, you can clear cookie on client by having client call logout.

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("changePassword:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
