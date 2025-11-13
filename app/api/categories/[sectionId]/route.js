import Category from "@/models/Category";
import section from "@/models/sections";
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";



export async function GET({ params }) {
    try {
        const { sectionId } = params;
        if (!sectionId.match(/^[0-9a-fA-F]{24}$/)) {
            return NextResponse.json({ error: "معرف القسم غير صالح" }, { status: 400 });
        }

        await connectMongoDB();
        const categories = await Category.findById(sectionId).sort({ createdAt: -1 });
        return NextResponse.json({ categories }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

