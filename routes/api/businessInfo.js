import express from "express";
import {
  getBusinessInfo,
  updateBusinessInfo,
} from "../../controllers/businessInfoController.js";
import verifyJWT from "../../middleware/verifyJWT.js";
import verifyRoles from "../../middleware/verifyRoles.js";
import { validate } from "../../middleware/validate.js";
import { businessInfoSchema } from "../../validators/buisnessInfo.validators.js";

const router = express.Router();

// Public
router.get(
  "/",
  getBusinessInfo,
);

// Admin only
router.patch(
  "/",
  verifyJWT,
  verifyRoles(["admin", "superadmin"]),
  validate(businessInfoSchema.partial()),
  updateBusinessInfo,
);

export default router;
