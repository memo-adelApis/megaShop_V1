import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/Order";

// 📌 جلب طلب محدد
export async function GET(request, { params }) {
  try {
    await connectMongoDB();
    const { id } = params;

    const order = await Order.findById(id)
      .populate("items.product", "name price images")
      .populate("coupon", "code type value");

    if (!order) {
      return NextResponse.json({ success: false, error: "الطلب غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// 📌 تحديث حالة الطلب (pending → paid → cancelled)
export async function PATCH(request, { params }) {
  try {
    await connectMongoDB();
    const { id } = params;
    const { status } = await request.json();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: "الطلب غير موجود" }, { status: 404 });
    }

    order.status = status;
    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// 📌 حذف طلب
export async function DELETE(request, { params }) {
  try {
    await connectMongoDB();
    const { id } = params;

    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return NextResponse.json({ success: false, error: "الطلب غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "تم حذف الطلب بنجاح" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
