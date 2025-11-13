// app/api/delivery/available-slots/route.js
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Delivery from "@/models/Delivery";

export async function GET(request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const city = searchParams.get('city');

    if (!date) {
      return NextResponse.json(
        { success: false, error: "التاريخ مطلوب" },
        { status: 400 }
      );
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // لا يمكن حجز موعد في تاريخ ماضي
    if (selectedDate < today) {
      return NextResponse.json({ success: false, availableSlots: [] });
    }

    // الفترات المتاحة
    const allSlots = [
      { id: "morning", name: "الصباح (9 ص - 12 ظ)", time: "09:00", available: true },
      { id: "afternoon", name: "الظهر (2 ظ - 5 م)", time: "14:00", available: true },
      { id: "evening", name: "المساء (6 م - 9 م)", time: "18:00", available: true }
    ];

    // التحقق من المواعيد المحجوزة في هذا التاريخ
    const bookedDeliveries = await Delivery.find({
      deliveryDate: selectedDate,
      status: { $in: ["scheduled", "out_for_delivery"] }
    });

    // تحديث الفترات المتاحة بناءً على الحجوزات
    const availableSlots = allSlots.map(slot => {
      const bookedCount = bookedDeliveries.filter(
        delivery => delivery.deliverySlot === slot.id
      ).length;
      
      return {
        ...slot,
        available: bookedCount < 10, // حد أقصى 10 طلبات لكل فترة
        bookedCount,
        remaining: 10 - bookedCount
      };
    });

    return NextResponse.json({
      success: true,
      availableSlots,
      date: selectedDate.toISOString().split('T')[0]
    });

  } catch (error) {
    console.error("Error fetching available slots:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ في جلب المواعيد المتاحة" },
      { status: 500 }
    );
  }
}