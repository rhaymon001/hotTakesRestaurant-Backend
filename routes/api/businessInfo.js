import express from "express";
import {
  getBusinessInfo,
  updateBusinessInfo,
} from "../../controllers/businessInfoController.js";
import verifyJWT from "../../middleware/verifyJWT.js";
import verifyRoles from "../../middleware/verifyRoles.js";

const router = express.Router();

// Public
router.get("/", getBusinessInfo);

// Admin only
router.patch(
  "/",
  verifyJWT,
  verifyRoles(["admin", "superadmin"]),
  updateBusinessInfo
);

export default router;
