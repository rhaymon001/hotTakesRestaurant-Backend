// controllers/user.controller.js

import User from "../model/User.js";
import bcrypt from "bcryptjs";
import { roleHierarchy } from "../utils.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const loggedInUser = req.user; // admin creating another user

    const { name, email, role = "user", password } = req.body;

    if (roleHierarchy[loggedInUser.role] <= roleHierarchy[role]) {
      return res.status(403).json({
        message: "You cannot create a user with equal or higher role",
      });
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      role,
      password: hashed,
    });

    newUser.password = undefined;

    res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // user to update
    const loggedInUser = req.user; // user making the request
    const updates = req.body;

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (loggedInUser.id !== id) {
      // Logged-in user must have a higher role
      if (roleHierarchy[loggedInUser.role] <= roleHierarchy[targetUser.role]) {
        return res.status(403).json({
          message: "You do not have permission to update this user",
        });
      }
    }

    // --- ❌ Prevent privilege escalation ---
    if (updates.role) {
      if (roleHierarchy[updates.role] > roleHierarchy[loggedInUser.role]) {
        return res.status(403).json({
          message: "You cannot assign a role higher than your own",
        });
      }
    }

    // Apply updates safely
    const allowedUpdates = ["name", "email", "role", "status"];
    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        targetUser[field] = updates[field];
      }
    });

    const updatedUser = await targetUser.save();

    // Remove password
    updatedUser.password = undefined;
    updatedUser.refreshToken = undefined;

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // user to delete
    const loggedInUser = req.user; // user performing the action

    // 1. Get target user
    const targetUser = await User.findById(id);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Prevent self-deletion
    if (loggedInUser.id === id) {
      return res.status(403).json({
        message: "Administrators cannot delete their own accounts",
      });
    }

    // 3. Permission check — role hierarchy must be HIGHER
    if (roleHierarchy[loggedInUser.role] <= roleHierarchy[targetUser.role]) {
      return res.status(403).json({
        message: "You do not have permission to delete this user",
      });
    }

    // 4. Delete user
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUserId: id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
