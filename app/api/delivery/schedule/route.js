// app/api/delivery/schedule/route.js
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Delivery from "@/models/Delivery";
import Order from "@/models/Order";

export async function POST(request) {
  try {
    await connectMongoDB();
    const { orderId, deliveryDate, deliveryTime, deliverySlot, address } = await request.json();

    // التحقق من البيانات المطلوبة
    if (!orderId || !deliveryDate || !deliveryTime || !deliverySlot || !address) {
      return NextResponse.json(
        { success: false, error: "جميع بيانات التوصيل مطلوبة" },
        { status: 400 }
      );
    }

    // التحقق من وجود الطلب
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "الطلب غير موجود" },
        { status: 404 }
      );
    }

    // التحقق من تاريخ التوصيل (لا يمكن اختيار تاريخ ماضي)
    const selectedDate = new Date(deliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return NextResponse.json(
        { success: false, error: "لا يمكن اختيار تاريخ ماضي" },
        { status: 400 }
      );
    }

    // التحقق من توفر المواعيد (لمنع الازدحام)
    const existingDeliveries = await Delivery.countDocuments({
      deliveryDate: selectedDate,
      deliverySlot: deliverySlot,
      status: { $in: ["scheduled", "out_for_delivery"] }
    });

    // افترض أن الحد الأقصى 10 طلبات لكل فترة
    if (existingDeliveries >= 10) {
      return NextResponse.json(
        { success: false, error: "هذه الفترة ممتلئة، يرجى اختيار فترة أخرى" },
        { status: 400 }
      );
    }

    // حساب رسوم التوصيل بناءً على المدينة والفترة
    const deliveryFee = calculateDeliveryFee(address.city, deliverySlot);

    // إنشاء موعد التوصيل
    const delivery = new Delivery({
      order: orderId,
      user: order.user,
      address,
      deliveryDate: selectedDate,
      deliveryTime,
      deliverySlot,
      deliveryFee,
      status: "scheduled",
      estimatedArrival: calculateEstimatedArrival(selectedDate, deliverySlot)
    });

    await delivery.save();

    // تحديث الطلب برسوم التوصيل
    order.deliveryFee = deliveryFee;
    order.totalPrice += deliveryFee;
    await order.save();

    return NextResponse.json({
      success: true,
      delivery,
      message: "تم جدولة التوصيل بنجاح"
    });

  } catch (error) {
    console.error("Error scheduling delivery:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء جدولة التوصيل" },
      { status: 500 }
    );
  }
}

function calculateDeliveryFee(city, slot) {
  const baseFee = 15; // رسوم أساسية
  
  // رسوم إضافية حسب المدينة
  const cityFees = {
    "الرياض": 5,
    "جدة": 7,
    "مكة": 10,
    "المدينة": 8,
    "الدمام": 6
  };

  // رسوم إضافية للفترة المسائية
  const slotFees = {
    "morning": 0,
    "afternoon": 0,
    "evening": 5
  };

  return baseFee + (cityFees[city] || 5) + (slotFees[slot] || 0);
}

function calculateEstimatedArrival(date, slot) {
  const estimated = new Date(date);
  
  switch(slot) {
    case "morning":
      estimated.setHours(9, 0, 0, 0); // 9 صباحاً
      break;
    case "afternoon":
      estimated.setHours(14, 0, 0, 0); // 2 ظهراً
      break;
    case "evening":
      estimated.setHours(18, 0, 0, 0); // 6 مساءً
      break;
    default:
      estimated.setHours(12, 0, 0, 0);
  }
  
  return estimated;
}