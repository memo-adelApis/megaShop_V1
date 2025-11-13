// app/api/orders/user/[id]/route.js
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import mongoose from "mongoose";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";

export async function GET(request, { params }) {
  try {
    await connectMongoDB();

    // استخدام await مع params في Next.js 13+
    const { id } = await params;
    
    console.log("🔍 جلب طلبات المستخدم:", id);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "معرف المستخدم مطلوب" },
        { status: 400 }
      );
    }

    // التحقق من أن id هو ObjectId صالح
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("❌ معرف مستخدم غير صالح:", id);
      return NextResponse.json(
        { success: false, error: "معرف المستخدم غير صالح" },
        { status: 400 }
      );
    }

    // تحويل id إلى ObjectId
    const userObjectId = new mongoose.Types.ObjectId(id);

    // جلب جميع طلبات المستخدم مع تفاصيل المنتجات
    const orders = await Order.find({ user: userObjectId })
      .populate('items.product', 'name images price')
      .populate('coupon', 'name code discountType discountValue')
      .sort({ createdAt: -1 }); // أحدث الطلبات أولاً

    console.log(`✅ تم العثور على ${orders.length} طلب للمستخدم ${id}`);

    return NextResponse.json({
      success: true,
      orders: orders,
      count: orders.length
    });

  } catch (error) {
    console.error("💥 خطأ في جلب طلبات المستخدم:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "حدث خطأ أثناء جلب الطلبات",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}