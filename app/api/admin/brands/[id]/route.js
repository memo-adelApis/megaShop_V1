import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Brand from "@/models/Brand";
import cloudinary from "@/lib/cloudinary";
import { a } from "framer-motion/dist/types.d-Cjd591yU";

// ---------------- GET ----------------
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectMongoDB();

    const brand = await Brand.findById(id);

    if (!brand) {
      return NextResponse.json({ message: "الماركة غير موجودة" }, { status: 404 });
    }

    return NextResponse.json(brand);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "حدث خطأ أثناء جلب الماركة" }, { status: 500 });
  }
}

// ---------------- DELETE ----------------
export async function DELETE(request, { params }) {
  try {
    await connectMongoDB();
    const { id } = await params;

    const brand = await Brand.findByIdAndDelete(id);

    if (!brand) {
      return NextResponse.json({ message: "الماركة غير موجودة" }, { status: 404 });
    }

    // حذف الشعار من Cloudinary
    const publicId = brand.logo.split("/").slice(-2).join("/").split(".")[0];
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });

    return NextResponse.json({ message: "تم حذف الماركة بنجاح" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "حدث خطأ أثناء حذف الماركة" }, { status: 500 });
  }
}

// ---------------- PUT ----------------
export async function PUT(req, { params }) {
  try {
    await connectMongoDB();
    const { id } = await params;

    const form = await req.formData();
    const name = form.get("name");
    const logo = form.get("logo");

    if (!name) {
      return NextResponse.json({ message: "الرجاء ملء جميع الحقول" }, { status: 400 });
    }

    const brand = await Brand.findById(id);
    if (!brand) {
      return NextResponse.json({ message: "الماركة غير موجودة" }, { status: 404 });
    }

    let logoUrl = brand.logo;
    let logoId = brand.logoId;

    if (logo && logo.size > 0) {
      // 🟢 احذف القديم باستخدام logoId المخزن
      if (brand.logoId) {
        await cloudinary.uploader.destroy(brand.logoId, { resource_type: "image" });
      }

      // 🟢 ارفع الجديد
      const bytes = await logo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: `${process.env.CLOUDINARY_FOLDER}/brands`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      logoUrl = uploadResult.secure_url;
      logoId = uploadResult.public_id;
    }

    brand.name = name;
    brand.logo = logoUrl;
    brand.logoId = logoId;
    await brand.save();

    return NextResponse.json({ message: "تم تحديث الماركة بنجاح" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "حدث خطأ أثناء تحديث الماركة" }, { status: 500 });
  }
}
