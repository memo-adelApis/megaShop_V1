// models/Offer.js
import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    discountPercentage: {
      type: Number,
      default: 0, // تقدر تخليها اختيارية
    },
    validUntil: {
      type: Date,
      default: null, // مثلاً تاريخ انتهاء العرض
    },
  },
  { timestamps: true }
);

const Offer = mongoose.models.Offer || mongoose.model("Offer", OfferSchema);
export default Offer;
