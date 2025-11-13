import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";



// 📌 تحديث حالة الطلب (pending → paid → cancelled)
export async function PATCH(request, context) {
  try {
    await connectMongoDB();
    const { params } = context;
    const { id } = await params;
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

//جلب طلب محدد

export async function GET(request, { params }) {
  try {
    await connectMongoDB();
    const { id } =await params;
    const order = await Order.findById(id).populate("items.product");
    if (!order) {
      return NextResponse.json({ success: false, error: "الطلب غير موجود" }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });  
  }   
}