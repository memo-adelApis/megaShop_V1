import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";
import Category from "@/models/Category";
import Brand from "@/models/Brand";
import Section from "@/models/sections";
import { protectApi } from "../../auth/protect";


export async function GET(req) {

  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);

    // 🟢 البحث
    const search = searchParams.get("search") || "";

    // 🟢 عوامل التصفية
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
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



export async function POST(request) {
  const auth = await protectApi(["admin"]);
  if (!auth.ok) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }

  try {
    await connectMongoDB();
        const form = await request.formData();

      const invoiceId = form.get("invoiceId");
    const invoiceDate = form.get("invoiceDate");
    const name = form.get("name");
    const description = form.get("description");
    const price = parseFloat(form.get("price"));
    const stock = parseInt(form.get("stock") || 0);
    const stockSold = parseInt(form.get("stockSold") || 0); // ✅ جديد
    const category = form.get("category");
    const section = form.get("section");
    const additionalOnProduct = parseFloat(form.get("additionalOnProduct") || 0);
    const discountOnProduct = parseFloat(form.get("discountOnProduct") || 0);
    const brand = form.get("brand");
    const discountRate = parseFloat(form.get("discountRate") || 0);
    const unit = form.get("unit") || "قطعة"; // ✅ جديد
    const isFeatured = form.get("isFeatured") === "true";

    // 🔑 هنا نجيب attributes كـ string ونحوله Array
    let attributes = [];
    const attributesRaw = form.get("attributes");
    if (attributesRaw) {
      try {
        attributes = JSON.parse(attributesRaw);
      } catch (err) {
        console.error("خطأ في JSON.parse لـ attributes:", err);
        attributes = [];
      }
    }

    // ✅ جلب كل الصور المرفوعة (ممكن تكون 1 - 4 صور)
    const images = form.getAll("images");

    if (!name || !price || images.length === 0) {
      return NextResponse.json(
        { message: "الاسم، السعر وصورة واحدة على الأقل مطلوبة" },
        { status: 400 }
      );
    }

    let uploadedImages = [];
    let uploadedIds = [];

    for (const image of images) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: `${process.env.CLOUDINARY_FOLDER}/products`,
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      uploadedImages.push(result.secure_url);
      uploadedIds.push(result.public_id);
    }

    // ✅ إنشاء المنتج
   const product = await Product.create({
      invoiceId,
      invoiceDate,
      name,
      description,
      price,
      stock,
      stockSold, // ✅ جديد
      category,
      section,
      brand,
      discountRate,
      discountOnProduct, // ✅ جديد
      additionalOnProduct, // ✅ جديد
      unit, // ✅ جديد
      isFeatured, // ✅ جديد
      attributes, 
      images: uploadedImages,
      imageIds: uploadedIds, 
      totleInvoice : price * stock,
      priceAfterDiscount : (price * stock) - ((price * stock * discountRate) / 100),
      productPriceAfterDiscount : ((price * stock) - ((price * stock * discountRate) / 100)) / stock,
      sellingPrice : (((price * stock) - ((price * stock * discountRate) / 100)) / stock) + additionalOnProduct - discountOnProduct
    });


    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "فشل إنشاء المنتج" },
      { status: 500 }
    );
  }
}
