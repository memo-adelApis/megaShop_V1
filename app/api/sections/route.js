import { connectMongoDB } from "@/lib/mongodb";
import Section from "@/models/sections";
import Category from "@/models/Category";

export async function GET() {
  await connectMongoDB();

  try {
    // جيب كل الأقسام
    const sections = await Section.find().lean();

    // جيب كل الفئات
    const categories = await Category.find().lean();

    // اربط الفئات مع القسم المناسب
    const sectionsWithCategories = sections.map((sec) => ({
      ...sec,
      categories: categories.filter(
        (cat) => cat.section.toString() === sec._id.toString()
      ),
    }));

    return new Response(
      JSON.stringify({ sections: sectionsWithCategories }),
      { status: 200 }
    );
  } catch (err) {
    console.error("خطأ في جلب الأقسام مع الفئات:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
