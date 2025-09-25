import mongoose from "mongoose";
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  available: { type: Boolean, default: true },
});

export default mongoose.model("foodItem", foodSchema);
