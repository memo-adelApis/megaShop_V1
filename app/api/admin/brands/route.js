import cloudinary from "@/lib/cloudinary";
import { connectMongoDB } from "@/lib/mongodb";
import Brand from "@/models/Brand";
import { NextResponse } from "next/server";
import { protectApi } from "../../auth/protect";

export async function GET() {
  const auth = await protectApi(["user", "admin"]);
  if (!auth.ok) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }
  try {
    await connectMongoDB();
    const brands = await Brand.find({});
    const limit = brands.length;
    return NextResponse.json({ brands, limit: limit });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "حدث خطأ أثناء جلب الماركات" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await protectApi(["admin"]);
  if (!auth.ok) {
    return NextResponse.json({ message: auth.message }, { status: auth.status });
  }
  try {
    const form = await request.formData();
    const name = form.get("name");
    const logo = form.get("logo");
    if (!name || !logo) {
      return NextResponse.json({ message: "الرجاء ملء جميع الحقول" }, { status: 400 });
    }

    const bytes = await logo.arrayBuffer();
    const buffer = Buffer.from(bytes);
    //رفع الصورة إلى Cloudinary أو أي خدمة تخزين أخرى
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: `${process.env.CLOUDINARY_FOLDER}/brands`,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(buffer);
    });

    const logoUrl = uploadResult.secure_url;
    const logoId = uploadResult.public_id;
    await connectMongoDB();
    // التحقق من وجود ماركة بنفس الاسم
    const existingBrand = await Brand.findOne({ name });

    if (existingBrand) {
      return NextResponse.json({ message: "هذه الماركة موجودة بالفعل" }, { status: 400 });
    }

    const newBrand = await Brand.create({ name, logo: logoUrl, logoId: logoId });
    return NextResponse.json(newBrand, { status: 201 });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ message: "حدث خطأ أثناء إضافة الماركة" }, { status: 500 });
  }
}
  


