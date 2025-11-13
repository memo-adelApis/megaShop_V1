import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";
import Category from "@/models/Category";
import Brand from "@/models/Brand";
import Sections from "@/models/sections";


export async function GET(req) {

  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);

    // 🟢 البحث
    const search = searchParams.get("search") || "";

    // 🟢 عوامل التصفية
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const section = searchParams.get("section");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const isFeatured = searchParams.get("isFeatured");

    // 🟢 الترتيب
    const sortBy = searchParams.get("sortBy") || "createdAt"; // createdAt | price | rating
    const order = searchParams.get("order") === "asc" ? 1 : -1; // asc | desc

    // 🟢 Pagination
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // 🟢 بناء query
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (section) query.section = section;
    if (isFeatured) query.isFeatured = isFeatured === "true";
    if (minPrice || maxPrice) {
      query.priceAfterDiscount = {};
      if (minPrice) query.priceAfterDiscount.$gte = Number(minPrice);
      if (maxPrice) query.priceAfterDiscount.$lte = Number(maxPrice);
    }

    // 🟢 التنفيذ
    const products = await Product.find(query).lean()
      .populate("brand")
      .populate("category")
      .populate("section")
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء جلب المنتجات" },
      { status: 500 }
    );
  }
}