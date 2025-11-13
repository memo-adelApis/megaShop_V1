import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";

export async function POST(request) {
  try {
    await connectMongoDB();
    const body = await request.json();

    // 🛒 إنشاء الطلب
    const order = new Order(body);

console.log("ffff:", order.items.quantity);

    // 🧮 جمع الكمية وتحديث المنتجات
    const item = order.items[0];

    console.log("item:", item);

      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`المنتج غير موجود: ${item.product}`);
      }
      console.log("المنتج:", product);

      if (product.stock < item.quantity) {
        throw new Error(
          `المخزون غير كافي للمنتج: ${product.name}, المتاح: ${product.stock}`
        );
      }

      if (product.stockRemaining < product.stockSold) {
        product.stockRemaining = 0;
      }
 

      // تحديث الكميات
      product.stock -= item.quantity;
      product.stockSold += item.quantity;
      await product.save();

      
    //فى حالة وجود كبون

    

    // 💾 حفظ الطلب
    order.totalPrice = product.price * item.quantity;
    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// 📌 جلب جميع الطلبات
export async function GET() {
  try {
    await connectMongoDB();
    const orders = await Order.find()
      .populate("items.product", "name price images")
      .populate("coupon", "code type value");
      const count = orders.length;

    return NextResponse.json({ success: true, orders , count });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
