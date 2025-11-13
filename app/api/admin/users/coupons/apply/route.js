import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import Order from "@/models/Order";

export async function PATCH(request) {
  try {
    await connectMongoDB();
    const { code, orderId } = await request.json();

    // 🟢 تحقق من الكوبون
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return NextResponse.json(
        { success: false, error: "Invalid coupon code" },
        { status: 400 }
      );
    }
    if (!coupon.active) {
      return NextResponse.json(
        { success: false, error: "Coupon is not active" },
        { status: 400 }
      );
    }

    // 🟢 تحقق من الأوردر
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    let discountApplied = 0;

    // ✅ احسب الخصم بناءً على نوع الكوبون
    if (coupon.discountType === "percent") {
      discountApplied = order.totalPrice * (coupon.discountPercent / 100);
    } else if (coupon.discountType === "fixed") {
      discountApplied = coupon.discountValue;
    }

    // 🛑 حماية: لو الخصم أكبر من سعر الأوردر → نرفض
    if (discountApplied > order.totalPrice) {
      return NextResponse.json(
        { success: false, error: "Discount cannot exceed order total" },
        { status: 400 }
      );
    }

    // 🟢 خصم المبلغ
    order.totalPrice -= discountApplied;

    // 🟢 حفظ بيانات الخصم والكوبون
    order.discount = discountApplied;
    order.coupon = coupon._id;

    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
