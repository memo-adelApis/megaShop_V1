import { connectMongoDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Brand from "@/models/Brand";
import MainCategory from "@/models/MainCategory";
import SubCategory from "@/models/Sections";

export async function GET() {
  await connectMongoDB();

  const brands = await Brand.insertMany([
    { name: "Nike" },
    { name: "Adidas" },
    { name: "Apple" },
  ]);

  const mainCategories = await MainCategory.insertMany([
    { name: "ملابس", description : "ملابس" },
    { name: "هواتف" , description : "هواتف"},
    { name: "إلكترونيات" , description : "إلكترونيات"},
  ]);

  const subCategories = await SubCategory.insertMany([
    { name: "تيشيرت", category: mainCategories[0]._id },
    { name: "هاتف", category: mainCategories[1]._id },
  ]);

  const products = [];

  for (let i = 1; i <= 500; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const sub = subCategories[Math.floor(Math.random() * subCategories.length)];

    products.push({
      name: `منتج رقم ${i}`,
      description: `وصف المنتج رقم ${i}`,
      price: Math.floor(Math.random() * 500) + 100,
      quantity: Math.floor(Math.random() * 100),
      brand: brand._id,
      category: sub.category,
      subcategory: sub._id,
      attributes: {
        اللون: ["أحمر", "أزرق", "أخضر"][Math.floor(Math.random() * 3)],
        المقاس: ["S", "M", "L"][Math.floor(Math.random() * 3)],
      },
      images: [],
      actviv: true,
    });
  }

  await Product.insertMany(products);

  return Response.json({ message: "تم إنشاء البيانات الوهمية بنجاح ✅" });
}
