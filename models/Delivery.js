// models/Delivery.js
import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    order: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Order", 
      required: true 
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    address: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String }, // الحي
      additionalNotes: { type: String } // ملاحظات إضافية
    },
    deliveryDate: { type: Date, required: true }, // تاريخ التوصيل
    deliveryTime: { type: String, required: true }, // وقت التوصيل
    deliverySlot: { 
      type: String,
      enum: ["morning", "afternoon", "evening"],
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "scheduled", "out_for_delivery", "delivered", "cancelled"],
      default: "pending"
    },
    deliveryFee: { type: Number, default: 0 },
    driver: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    trackingNumber: { type: String },
    estimatedArrival: { type: Date }, // الوقت المتوقع للوصول
    actualDeliveryTime: { type: Date } // وقت التوصيل الفعلي
  },
  { timestamps: true }
);

export default mongoose.models.Delivery || mongoose.model("Delivery", deliverySchema);