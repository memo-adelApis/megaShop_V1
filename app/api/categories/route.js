import Category from "@/models/Category";
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";



export async function GET() {
    try {
        await connectMongoDB();
        const categories = await Category.find().sort({ createdAt: -1 });
        return NextResponse.json({ categories }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


