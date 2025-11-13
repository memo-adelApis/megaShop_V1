// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
  lastCode :String ,
  updatedAt : Date,

        // معلومات الشحن
       shippingAddress: {
      name: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      city: { type: String, default: "القاهرة" },
      district: { type: String, default: "" }
    },
    
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        attributes: { type: Object },
        addedAt: { type: Date, default: Date.now }
      }
    ],
    
    preferences: {
      notifications: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

// فقط الـ Virtuals تبقى (لا logic)
userSchema.virtual('cartItemsCount').get(function() {
  return this.cart.reduce((total, item) => total + item.quantity, 0);
});

userSchema.virtual('cartTotal').get(function() {
  return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
});

export default mongoose.models.User || mongoose.model("User", userSchema);