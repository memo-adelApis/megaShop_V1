// app/api/coupons/apply/route.js
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import Order from "@/models/Order";

export async function PATCH(request) {
  try {
    await connectMongoDB();
    const { code, orderId } = await request.json();

    // 🔍 التحقق من وجود البيانات المطلوبة
    if (!code || !orderId) {
      return NextResponse.json(
        { success: false, error: "الكود ورقم الطلب مطلوبان" },
        { status: 400 }
      );
    }

    // 🔍 البحث عن الكوبون
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return NextResponse.json(
        { success: false, error: "كود الكوبون غير صحيح" },
        { status: 400 }
      );
    }

    // 🔍 التحقق من صلاحية الكوبون
    const validation = coupon.isValid();
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.reason },
        { status: 400 }
      );
    }

    // 🔍 التحقق من الحد الأدنى للشراء
    if (coupon.minPurchase > 0) {
      const order = await Order.findById(orderId);
      if (!order) {
        return NextResponse.json(
          { success: false, error: "الطلب غير موجود" },
          { status: 404 }
        );
      }

      if (order.totalPrice < coupon.minPurchase) {
        return NextResponse.json(
          { 
            success: false, 
            error: `الحد الأدنى للطلب هو ${coupon.minPurchase} ريال لتطبيق هذا الكوبون` 
          },
          { status: 400 }
        );
      }
    }

    // 🔍 البحث عن الطلب مرة أخرى مع البيانات الكاملة
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "الطلب غير موجود" },
        { status: 404 }
      );
    }

    // 🔍 التحقق إذا كان الكوبون مستخدم مسبقاً في هذا الطلب
    if (order.coupon && order.coupon.toString() === coupon._id.toString()) {
      return NextResponse.json(
        { success: false, error: "تم تطبيق هذا الكوبون مسبقاً على الطلب" },
        { status: 400 }
      );
    }

    let discountApplied = 0;
    const originalPrice = order.totalPrice;

    // 🎯 حساب الخصم بناءً على نوع الكوبون
    if (coupon.discountType === "percent") {
      discountApplied = originalPrice * (coupon.discountValue / 100);
    } else if (coupon.discountType === "fixed") {
      discountApplied = coupon.discountValue;
    }

    // 🛑 منع الخصم من تجاوز سعر الطلب
    if (discountApplied > originalPrice) {
      discountApplied = originalPrice;
    }

    // 💰 تحديث سعر الطلب بعد الخصم
    order.totalPrice = Math.max(0, originalPrice - discountApplied);
    order.discount = discountApplied;
    order.coupon = coupon._id;
    order.originalPrice = originalPrice; // حفظ السعر الأصلي

    // 📈 زيادة عداد استخدامات الكوبون
    coupon.usedCount += 1;

    // 💾 حفظ التغييرات في قاعدة البيانات
    await Promise.all([order.save(), coupon.save()]);

    return NextResponse.json({
      success: true,
      order: {
        _id: order._id,
        totalPrice: order.totalPrice,
        originalPrice: originalPrice,
        discount: discountApplied,
        coupon: {
          _id: coupon._id,
          name: coupon.name,
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue
        }
      },
      message: "تم تطبيق الكوبون بنجاح"
    });

  } catch (error) {
    console.error("Error applying coupon:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "حدث خطأ أثناء تطبيق الكوبون",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}