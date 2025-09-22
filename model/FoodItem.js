import mongoose from "mongoose";
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
  available: { type: Boolean, default: true },
});

export default mongoose.model("foodItem", foodSchema);
