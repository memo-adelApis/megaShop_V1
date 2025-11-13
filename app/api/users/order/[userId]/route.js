import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Order from "@/models/Order";


// جلب كل الطلبات للمستخدم
export async function GET(request , { params }  ) {
    try {
        await connectMongoDB();
        const userId = params.userId;
        if (!userId) {
            return NextResponse.json({ success: false, error: "معرف المستخدم مطلوب" }, { status: 400 });
        }
        const orders = await Order.find({ user: userId }).populate("items.product");
        return NextResponse.json({ success: true, orders });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    
}
