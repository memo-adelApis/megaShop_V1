import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: String,       // نخزن اسم المنتج وقت الطلب
    price: Number,      // نخزن السعر وقت الطلب (حتى لو السعر اتغير بعدين)
    quantity: { type: Number, required: true },
    image: String,      // صورة المنتج (أول صورة مثلاً)
  },

);

export default mongoose.models.OrderItem ||
  mongoose.model("OrderItem", orderItemSchema);
