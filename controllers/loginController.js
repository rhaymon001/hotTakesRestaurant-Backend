import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

const loginController = async (req, res) => {
  //1. check email and password
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "email and password is required" });
  }

  try {
    const foundUser = await User.findOne({ email }).exec();

    if (!foundUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (!isMatch) {
      console.log("invalid password");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      {
        id: foundUser._id,
        role: foundUser.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      {
        id: foundUser._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      id: foundUser._id,
      email: foundUser.email,
      role: foundUser.role,
      name: foundUser.name,
      accessToken,
      mustChangePassword: foundUser.mustChangePassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error!" });
  }
};

export default loginController;
