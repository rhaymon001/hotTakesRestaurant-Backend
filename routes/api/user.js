import express from "express";
import verifyRole from "../../middleware/verifyRoles.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../../controllers/userController.js";

import { validate } from "../../middleware/validate.js";
import {
  userIdParamSchema,
  createUserSchema,
  updateUserSchema,
} from "../../validators/user.validators.js";
const router = express.Router();
const verifyAdmin = verifyRole(["admin", "superadmin"]);
// /api/admin/users
router.get("/", verifyAdmin, getAllUsers);
router.get("/:id", verifyAdmin, validate(userIdParamSchema), getUserById);
router.post("/", verifyAdmin, validate(createUserSchema), createUser);
router.put("/:id", validate(updateUserSchema), updateUser);
router.delete("/:id", verifyAdmin, validate(userIdParamSchema), deleteUser);

export default router;
