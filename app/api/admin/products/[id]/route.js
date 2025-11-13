import { connectMongoDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";




// ---------------- GET ----------------
export async function GET(req, { params }) {
    try {
    await connectMongoDB();
    const { id } = await params;
    const product = await Product
        .findOne({ _id: id })
        .populate("category")
        .populate("brand");
    if (!product) {
      return NextResponse.json({ message: "المنتج غير موجود" }, { status: 404 });
    }
    return NextResponse.json(product);
    } catch (error) {
    console.error(error);
    return NextResponse.json(
        { message: "حدث خطأ أثناء جلب المنتج" },
        { status: 500 }
    );
    }
}





// ---------------- PUT ----------------


export async function PUT(req, { params }) {
  try {
    await connectMongoDB();
    const { id } = await params;

    const form = await req.formData();

    const name = form.get("name");
    const description = form.get("description");
    const price = parseFloat(form.get("price"));
    const stock = parseInt(form.get("stock") || 0);
    const category = form.get("category");
    const brand = form.get("brand");
    const discountRate = parseFloat(form.get("discountRate") || 0);

    // صور جديدة (لو موجودة)
    const newImages = form.getAll("images");

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: "المنتج غير موجود" }, { status: 404 });
    }

    let updatedImages = product.images;
    let updatedImageIds = product.imageIds;

    // ✅ لو فيه صور جديدة نرفعها
    if (newImages && newImages.length > 0 && newImages[0].size > 0) {
      // 1. حذف الصور القديمة من Cloudinary
      for (const publicId of product.imageIds) {
        await cloudinary.uploader.destroy(publicId);
      }

      // 2. رفع الصور الجديدة
      updatedImages = [];
      updatedImageIds = [];
      for (const image of newImages) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: `${process.env.CLOUDINARY_FOLDER}/products` },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(buffer);
        });

        updatedImages.push(result.secure_url);
        updatedImageIds.push(result.public_id);
      }
    }

    // ✅ تحديث باقي البيانات
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock ?? product.stock;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.discountRate = discountRate || product.discountRate;
    product.images = updatedImages;
    product.imageIds = updatedImageIds;

    await product.save();

    return NextResponse.json({ message: "تم تحديث المنتج بنجاح" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء تحديث المنتج" },
      { status: 500 }
    );
  }
}


// ---------------- DELETE ----------------

export async function DELETE(req, { params }) {
  try {
    await connectMongoDB();
    const { id } = await params;

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: "المنتج غير موجود" }, { status: 404 });
    }

    // ✅ حذف الصور من Cloudinary
    for (const publicId of product.imageIds) {
      await cloudinary.uploader.destroy(publicId);
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: "تم حذف المنتج بنجاح" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء حذف المنتج" },
      { status: 500 }
    );
  }
}
