import cloudinary from "@/lib/cloudinary";
import { connectMongoDB } from "@/lib/mongodb";
import Brand from "@/models/Brand";
import { NextResponse } from "next/server";
import { protectApi } from "../auth/protect";



export async function GET() {
  
  try {
  
    await connectMongoDB();
    const brands = await Brand.find({});
    const limit = brands.length
    return NextResponse.json({ brands, limit: limit });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "حدث خطأ أثناء جلب الماركات" }, { status: 500 })
  }
}





