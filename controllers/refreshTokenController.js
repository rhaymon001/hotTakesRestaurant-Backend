import jwt from "jsonwebtoken";
import User from "../model/User.js";

const refreshTokenController = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Refresh token not found!" });
  }

  const refreshToken = cookies.jwt;

  try {
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
      // Refresh token exists but not tied to any user
      return res
        .status(403)
        .json({ message: "Invalid refresh token (no user)!" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          // Token expired OR invalid signature
          return res
            .status(401)
            .json({ message: "Refresh token expired or invalid!" });
        }

        if (foundUser._id.toString() !== decoded.id) {
          // Valid token but doesn't match user
          return res
            .status(403)
            .json({ message: "Forbidden: token-user mismatch!" });
        }

        // ✅ Issue new access token
        const accessToken = jwt.sign(
          {
            id: foundUser._id,
            role: foundUser.role,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" } // short expiry for security
        );

        return res.json({ accessToken });
      }
    );
  } catch (error) {
    console.error("Error in refreshToken controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default refreshTokenController;
