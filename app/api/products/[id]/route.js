import { connectMongoDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

// ---------------- GET ----------------
export async function GET(request, { params }) {
  try {
    await connectMongoDB();

    const { id } = await params; // ✅ صح هنا
    const product = await Product.findOne({ _id: id })
      .populate("category")
      .populate("brand")
      .populate("section");

    if (!product) {
        if(process.env.NODE_ENV === 'development') {
            console.log("❌ المنتج غير موجود:", id);
            return NextResponse.json({ message: "المنتج غير موجود" }, { status: 404 });
        }else {

      return NextResponse.json({ message:"!!sory an erorr" }, { status: 404 });
        }
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    if(process.env.NODE_ENV === 'development') {
        console.error("❌ خطأ عند جلب المنتج:", error);
        return NextResponse.json({ message: "حدث خطأ أثناء جلب المنتج" }, { status: 500 });
    }
    
    return NextResponse.json(
      { message: "حدث خطأ   " },
      { status: 500 }
    );
  }
}
