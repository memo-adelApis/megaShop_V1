import Category from "@/models/Category";
import Section from "@/models/sections";
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { protectApi } from "@/app/api/auth/protect";



export async function GET() {
    try {
        await connectMongoDB();
        const categories = await Category.find().sort({ createdAt: -1 }).populate('section');
        return NextResponse.json({ categories }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function POST(request) {
    
    try {
           const auth = await protectApi(["admin"]);
         if (!auth.ok) {
          return NextResponse.json({ message: auth.message }, { status: auth.status });
        }
        await connectMongoDB();
        const { name, description ,section } = await request.json();
        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return NextResponse.json({ error: "Category already exists" }, { status: 400 });
        }
        const category = new Category({ name, description ,section });
        await category.save();
        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
