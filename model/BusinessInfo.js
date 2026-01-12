import mongoose from "mongoose";

const openingHoursSchema = new mongoose.Schema(
  {
    day: { type: String, required: true }, // Monday
    open: { type: String, required: true }, // 09:00
    close: { type: String, required: true }, // 22:00
    closed: { type: Boolean, default: false },
  },
  { _id: false }
);

const businessInfoSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      default: "HotTakes Restaurant",
    },

    tagline: String,

    description: String,

    logoUrl: String, // later Cloudinary / S3

    contact: {
      email: String,
      phone: String,
    },

    address: {
      street: String,
      city: String,
      state: String,
      country: String,
    },

    openingHours: [openingHoursSchema],

    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      tiktok: String,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("BusinessInfo", businessInfoSchema);
