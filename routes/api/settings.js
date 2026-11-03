// routes/settings.js
import express from "express";
import {
  updateMyProfile,
  changePassword,
} from "../../controllers/settingsController.js";
import verifyJWT from "../../middleware/verifyJWT.js";
import { validate } from "../../middleware/validate.js";
import {
  updateMyProfileSchema,
  changePasswordSchema,
} from "../../validators/settings.validators.js";
const router = express.Router();

router.patch(
  "/me",
  verifyJWT,
  validate(updateMyProfileSchema),
  updateMyProfile,
);
router.patch(
  "/change-password",
  verifyJWT,
  validate(changePasswordSchema),
  changePassword,
);

export default router;
