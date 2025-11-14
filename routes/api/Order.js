import express from "express";
import {
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} from "../../controllers/orderController.js";

const router = express.Router();

// 🔹 Fetch all orders (Admin)
router.get("/", getAllOrders);

// 🔹 Fetch all orders for a user
router.get("/user/:userId", getUserOrders);

// 🔹 Fetch a specific order by ID
router.get("/:id", getOrderById);

// 🔹 Update order status (Admin)
router.put("/:id/status", updateOrderStatus);

export default router;
