import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectMongoDB();
    const products = await Product.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    return NextResponse.json({ products });
  } catch (error) {
    console.error("❌ خطأ في جلب المنتجات المميزة:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء جلب المنتجات المميزة" },
      { status: 500 }
    );
  }
}
