import axios from "axios";
import Order from "../model/Order.js";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

// 🔹 Initialize Payment
const initializePayment = async (req, res) => {
  const { userId, totalAmount, orderDetails } = req.body;

  // Create new order in DB
  const order = await Order.create({
    user: userId,
    items: orderDetails.items,
    totalAmount,
    deliveryType: orderDetails.deliveryType,
    deliveryDetails: orderDetails.deliveryDetails,
  });

  // Call Paystack initialize endpoint
  const response = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    {
      email: orderDetails.email,
      amount: totalAmount * 100, // Paystack expects kobo
      reference: order._id.toString(), // link order to payment
      callback_url: `${process.env.FRONTEND_URL}/payment-success`,
    },
    {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` },
    }
  );

  res.json(response.data);
};

// 🔹 Verify Payment Manually (optional)
const verifyPayment = async (req, res) => {
  const { reference } = req.query;

  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` },
    }
  );

  if (response.data.data.status === "success") {
    await Order.findByIdAndUpdate(reference, {
      "payment.status": "paid",
      status: "completed",
    });
  }

  res.json(response.data);
};

// 🔹 Handle Paystack Webhook

const handleWebhook = async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET;
    const signature = req.headers["x-paystack-signature"];

    // Verify signature
    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body)) // must match raw body used by paystack
      .digest("hex");

    if (hash !== signature) {
      return res.status(401).send("Invalid signature");
    }

    const event = req.body;

    // Only handle successful payment
    if (event.event === "charge.success") {
      const paystackReference = event.data.reference;

      // Update order matching the reference
      const updatedOrder = await Order.findByIdAndUpdate(
        paystackReference,
        {
          $set: {
            "payment.status": "paid",
            status: "completed",
          },
        },
        { new: true }
      );

      if (!updatedOrder) {
        console.log("Order not found for reference:", paystackReference);
      } else {
        console.log("Order updated successfully:", updatedOrder._id);
      }
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    return res.sendStatus(500);
  }
};

export { initializePayment, verifyPayment, handleWebhook };
