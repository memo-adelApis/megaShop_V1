// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        attributes: { type: Object }
      },
    ],
    
    // الأسعار
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
    
    // الكوبون
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    
    // معلومات الشحن
    shippingAddress: {
      name: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      district: { type: String, default: "" },
      additionalNotes: { type: String, default: "" }
    },
    
    // الدفع
    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "credit_card", "mada", "apple_pay", "stc_pay"],
      default: "cash_on_delivery"
    },
    
    // حالة الطلب
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    
    orderNumber: { type: String }
  },
  { timestamps: true }
);

// Middleware قبل الحفظ
orderSchema.pre("save", async function (next) {
  try {
    // إنشاء رقم طلب
    if (this.isNew && !this.orderNumber) {
      const count = await mongoose.model('Order').countDocuments();
      this.orderNumber = `ORD-${String(count + 1).padStart(5, '0')}`;
    }
    
    // حساب الأسعار إذا كانت العناصر موجودة
    if (this.items && this.items.length > 0) {
      this.subtotal = this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    }
    
    this.totalPrice = this.subtotal - this.discount + this.shippingFee;
    if (this.totalPrice < 0) this.totalPrice = 0;
    
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);