import express from "express";
import {
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} from "../../controllers/orderController.js";
import verifyRole from "../../middleware/verifyRoles.js";

const router = express.Router();
const verifyAdmin = verifyRole(["admin", "superadmin"]);
// 🔹 Fetch all orders (Admin)
router.get("/", verifyAdmin, getAllOrders);

// 🔹 Fetch all orders for a user
router.get("/user/:userId", getUserOrders);

// 🔹 Fetch a specific order by ID
router.get("/:id", getOrderById);

// 🔹 Update order status (Admin)
router.put("/:id/status", updateOrderStatus);

export default router;
