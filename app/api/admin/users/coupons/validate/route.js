import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function GET(request) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const userId = searchParams.get("userId"); // 🔥 العميل اللي بيحاول يستخدم الكوبون

    if (!code) {
      return NextResponse.json(
        { success: false, error: "يرجى إدخال كود الكوبون" },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: "الكوبون غير موجود" },
        { status: 404 }
      );
    }

    if (!coupon.isActive) {
      return NextResponse.json(
        { success: false, error: "الكوبون غير مفعل" },
        { status: 400 }
      );
    }

    // 🔥 تحقق لو العميل استخدم الكوبون قبل كده
    if (userId && coupon.usedBy.includes(userId)) {
      return NextResponse.json(
        { success: false, error: "لقد استخدمت هذا الكوبون بالفعل" },
        { status: 400 }
      );
    }

    // 🔥 حساب نوع الخصم
    let discountText = "";
    if (coupon.type === "percentage") {
      discountText = `خصم ${coupon.value}%`;
    } else if (coupon.type === "fixed") {
      discountText = `خصم ${coupon.value} جنيه`;
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon._id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountText,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
