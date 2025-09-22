import bcrypt from "bcryptjs";
import User from "../model/User.js";

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "user aleady exists" });
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered succesfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "server error" });
  }
};

export default registerController;
