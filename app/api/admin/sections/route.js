import Sections from "@/models/sections";
import { NextResponse } from "next/server";
export async function POST(req) {
    try {
        const body = await req.json();
        
        const { name, description } = body;
        if (!name) {
            return new Response(JSON.stringify({ message: "الرجاء ملء جميع الحقول" }), { status: 400 });
        }
        const newSection = new Sections({ name, description });
        await newSection.save();
        return NextResponse.json({ message: "تم إنشاء القسم بنجاح", section: newSection }, { status: 201 });
    }
    catch (error) {
        console.error("Error creating section:", error);
        return new Response(JSON.stringify({ message: "حدث خطأ أثناء إنشاء القسم" }), { status: 500 });
    }
}

export async function GET() {
    try {
        const sections = await Sections.find({});
        return NextResponse.json({ sections, limit: sections.length });
    }
    catch (error) {
        console.error("Error fetching sections:", error);
        return new Response(JSON.stringify({ message: "حدث خطأ أثناء جلب الأقسام" }), { status: 500 });
    }
}

