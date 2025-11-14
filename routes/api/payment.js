import express from "express";
import {
  initializePayment,
  verifyPayment,
  handleWebhook,
} from "../../controllers/paymentController.js";

const router = express.Router();

router.post("/initialize", initializePayment);
router.get("/verify", verifyPayment);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

export default router;
