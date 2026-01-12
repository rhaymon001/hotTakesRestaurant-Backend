import express from "express";
import verifyRole from "../../middleware/verifyRoles.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../../controllers/userController.js";

const router = express.Router();
const verifyAdmin = verifyRole(["admin", "superadmin"]);
// /api/admin/users
router.get("/", verifyAdmin, getAllUsers);
router.get("/:id", verifyAdmin, getUserById);
router.post("/", verifyAdmin, createUser);
router.put("/:id", updateUser);
router.delete("/:id", verifyAdmin, deleteUser);

export default router;
