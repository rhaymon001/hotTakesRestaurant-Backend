import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
console.log("Cloudinary config check:", {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "loaded" : "MISSING",
  secret: process.env.CLOUDINARY_API_SECRET ? "loaded" : "MISSING",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
