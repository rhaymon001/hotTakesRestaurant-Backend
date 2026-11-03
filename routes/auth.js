// routes/auth.js
import express from "express";
import {
  requestPasswordReset,
  resetPassword,
} from "../controllers/accountResetController.js";
import {
  resetPasswordSchema,
  requestPasswordResetSchema,
} from "../validators/passwordreset.validator.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/request-password-reset",
  validate(requestPasswordResetSchema),
  requestPasswordReset,
);
router.post(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  resetPassword,
);

export default router;
