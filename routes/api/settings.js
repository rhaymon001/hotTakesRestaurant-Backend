// routes/settings.js
import express from "express";
import {
  updateMyProfile,
  changePassword,
} from "../../controllers/settingsController.js";
import verifyJWT from "../../middleware/verifyJWT.js";
const router = express.Router();

router.patch("/me", verifyJWT, updateMyProfile);
router.patch("/change-password", verifyJWT, changePassword);

export default router;
