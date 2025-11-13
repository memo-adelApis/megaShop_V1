import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

// 🟢 إنشاء كوبون جديد


export async function POST(request) {
  try {
    await connectMongoDB();
    const data = await request.json();

    // 🔥 تحقق من وجود الكود مسبقًا
    const existingCoupon = await Coupon.findOne({ code: data.code });
    if (existingCoupon) {
      return NextResponse.json(
        { success: false, error: "الكوبون موجود مسبقًا" },
        { status: 400 }
      );
    }

    const coupon = new Coupon(data);

    // // 🟢 حساب قيمة الخصم
    // if (coupon.discountType === "percent") {
    //   if (!data.amount) {
    //     return NextResponse.json(
    //       { success: false, error: "مطلوب تمرير amount لحساب الخصم" },
    //       { status: 400 }
    //     );
    //   }
    //   coupon.discountValue = (coupon.discountPercent * data.amount) / 100;
    // } else {
    //   coupon.discountValue = data.discountValue;
    // }

    await coupon.validate();
    await coupon.save();

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}



// 🟡 جلب كل الكوبونات
export async function GET() {
  try {
    await connectMongoDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
