import jwt from "jsonwebtoken";
import User from "../model/User.js";

const refreshTokenController = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json({ message: "refreshToken not found!" });
  }

  try {
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
      res.status(403).json({ message: "Forbidden! -invalid refresh token" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser._id.toString() !== decoded.id) {
          res
            .status(403)
            .json({ message: "Forbidden! - Token verifiation failed" });
        }
      }
    );

    const accessToken = jwt.sign(
      {
        id: foundUser._id,
        role: foundUser.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1m" }
    );

    res.json({
      accessToken
    });
  } catch (error) {
    console.error("error in refreshToken controller", error);
    res.status(500).json({ message: "Server error" });
  }
};


export default refreshTokenController;