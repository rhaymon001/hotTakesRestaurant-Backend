// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    items: [
      {
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: "foodItem" },
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    deliveryType: {
      type: String,
      enum: ["pickup", "delivery"],
      required: true,
    },
    deliveryDetails: {
      name: String,
      address: String,
      phone: String,
      notes: String,
      pickupLocation: String,
    },
    payment: {
      method: {
        type: String,
        enum: ["card", "transfer", "cash"],
        default: "card",
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
      reference: String,
    },
    status: {
      type: String,
      enum: ["processing", "completed", "cancelled"],
      default: "processing",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
