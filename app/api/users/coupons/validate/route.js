// app/api/coupons/validate/route.js
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function POST(request) {
  try {
    await connectMongoDB();

    // الحصول على البيانات من body بدلاً من query parameters
    const { code, userId, orderTotal = 0 } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: "يرجى إدخال كود الكوبون" },
        { status: 400 }
      );
    }

    // البحث عن الكوبون (مع تحويل الكود إلى uppercase)
    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: "كود الكوبون غير صحيح" },
        { status: 400 }
      );
    }

    // التحقق من حالة الكوبون
    if (!coupon.active) {
      return NextResponse.json(
        { success: false, error: "الكوبون غير مفعل" },
        { status: 400 }
      );
    }

    // التحقق من تاريخ الانتهاء
    const now = new Date();
    if (coupon.expiryDate < now) {
      return NextResponse.json(
        { success: false, error: "الكوبون منتهي الصلاحية" },
        { status: 400 }
      );
    }

    // التحقق من عدد مرات الاستخدام
    if (coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, error: "تم استنفاذ الحد الأقصى لاستخدام هذا الكوبون" },
        { status: 400 }
      );
    }

    // التحقق من الحد الأدنى للشراء
    if (coupon.minPurchase > 0 && orderTotal < coupon.minPurchase) {
      return NextResponse.json(
        { 
          success: false, 
          error: `الحد الأدنى للطلب هو ${coupon.minPurchase} ريال لتطبيق هذا الكوبون` 
        },
        { status: 400 }
      );
    }

    // حساب قيمة الخصم
    let discountAmount = 0;
    let finalPrice = orderTotal;

    if (coupon.discountType === "percent") {
      discountAmount = orderTotal * (coupon.discountValue / 100);
    } else if (coupon.discountType === "fixed") {
      discountAmount = coupon.discountValue;
    }

    // التأكد من أن الخصم لا يتجاوز سعر الطلب
    discountAmount = Math.min(discountAmount, orderTotal);
    finalPrice = Math.max(0, orderTotal - discountAmount);

    // إرجاع بيانات الكوبون والخصم
    return NextResponse.json({
      success: true,
      coupon: {
        _id: coupon._id,
        name: coupon.name,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minPurchase: coupon.minPurchase,
        expiryDate: coupon.expiryDate,
        usageLimit: coupon.usageLimit,
        usedCount: coupon.usedCount,
        active: coupon.active
      },
      discountAmount,
      finalPrice,
      message: "الكوبون صالح للاستخدام"
    });

  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "حدث خطأ أثناء التحقق من الكوبون",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}