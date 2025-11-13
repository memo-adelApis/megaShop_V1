// seed.js
import mongoose from "mongoose";
import Brand from "./models/Brand.js";
import Product from "./models/Product.js";
import Offer from "./models/Offer.js";
import { connectMongoDB } from "./lib/mongodb.js";

// الاتصال بقاعدة البيانات
mongoose
  .connect("mongodb+srv://memo:702032@cluster0.zntunoh.mongodb.net/SHOP_DB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// بيانات وهمية للماركات
const brands = [
  { name: "Nike", logo: "/brands/nike.png" },
  { name: "Adidas", logo: "/brands/adidas.png" },
  { name: "Puma", logo: "/brands/puma.png" },
];

// بيانات وهمية للمنتجات
const products = [
  {
    name: "حذاء رياضي Nike Air",
    description: "مريح وخفيف مناسب للجري.",
    price: 350,
    images: ["/products/nike1.png"],
    brand: null, // سنربطها لاحقاً
    stock: 20,
  },
  {
    name: "حذاء Adidas Superstar",
    description: "تصميم كلاسيكي أنيق.",
    price: 300,
    images: ["/products/adidas1.png"],
    brand: null,
    stock: 15,
  },
  {
    name: "حذاء Puma Casual",
    description: "مناسب للاستخدام اليومي.",
    price: 250,
    images: ["/products/puma1.png"],
    brand: null,
    stock: 10,
  },
];

// بيانات وهمية للعروض
const offers = [
  {
    title: "خصم 30% على كل منتجات Nike",
    description: "العرض ساري حتى نهاية الشهر",
    image: "/offers/offer1.png",
  },
  {
    title: "اشترِ 2 واحصل على الثالث مجاناً",
    description: "العرض يشمل منتجات Adidas",
    image: "/offers/offer2.png",
  },
];

async function seedData() {
  try {
    await Brand.deleteMany();
    await Product.deleteMany();
    await Offer.deleteMany();

    // إدخال الماركات
    const createdBrands = await Brand.insertMany(brands);

    // ربط المنتجات بالماركات
    products[0].brand = createdBrands[0]._id;
    products[1].brand = createdBrands[1]._id;
    products[2].brand = createdBrands[2]._id;

    // إدخال المنتجات والعروض
    await Product.insertMany(products);
    await Offer.insertMany(offers);

    console.log("🌱 Seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seedData();
