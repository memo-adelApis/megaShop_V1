// models/Coupon.js
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    discountType: {
      type: String,
      enum: ["percent", "fixed"],
      required: true,
    },
    discountValue: { type: Number, required: true, min: 1 },
    discountPercent: { type: Number, min: 1, max: 100 }, // للنسبة المئوية
    minPurchase: { type: Number, default: 0 }, // الحد الأدنى للسعر
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ✅ Method: تحقق إذا الكوبون صالح للاستخدام
couponSchema.methods.isValid = function () {
  const now = new Date();

  if (!this.active) return { valid: false, reason: "الكوبون غير مفعل" };
  if (this.expiryDate < now)
    return { valid: false, reason: "الكوبون منتهي الصلاحية" };
  if (this.usedCount >= this.usageLimit)
    return { valid: false, reason: "تم استنفاذ الحد الأقصى للاستخدام" };

  return { valid: true };
};

export default mongoose.models.Coupon ||
  mongoose.model("Coupon", couponSchema);