import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    await connectMongoDB();
    const data = await req.json();

    const order = new Order(data);
    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// جلب كل الطلبات للمستخدم
