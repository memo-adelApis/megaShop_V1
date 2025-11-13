import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

const mapCartItems = (items) =>
  items.map((i) => {
    const prod = i.product || {};
    return {
      product: prod._id || prod || null,
      name: prod.name || "",
      price: prod.price ?? prod.priceAfterDiscount ?? 0,
      image: (prod.images && prod.images[0]) || prod.image || null,
      quantity: typeof i.qty !== "undefined" ? i.qty : i.quantity || 0,
      attributes: i.attributes || {},
    };
  });

export async function POST(req, context) {
  const { params } = context;
  const { userId } = await params;
  try {
    await connectMongoDB();
    const body = await req.json();
    const guestItems = Array.isArray(body.items) ? body.items : [];

    if (!guestItems.length) return NextResponse.json({ message: "لا عناصر للمزامنة" }, { status: 400 });

    // Validate product ids
    const productIds = guestItems.map((it) => it.product);
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const existingIds = new Set(products.map((p) => p._id.toString()));

    // Filter out invalid products
    const itemsToMerge = guestItems
      .filter((it) => it.product && existingIds.has(it.product.toString()))
      .map((it) => ({ product: it.product, qty: Math.max(1, Number(it.quantity || it.qty || 1)) }));

    if (!itemsToMerge.length) return NextResponse.json({ message: "لا عناصر صالحة للمزامنة" }, { status: 400 });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    for (const g of itemsToMerge) {
      const idx = cart.items.findIndex((it) => it.product.toString() === g.product.toString());
      if (idx > -1) {
        cart.items[idx].qty = cart.items[idx].qty + g.qty;
      } else {
        cart.items.push({ product: g.product, qty: g.qty });
      }
    }

    await cart.save();
    await cart.populate("items.product");
    return NextResponse.json(mapCartItems(cart.items));
  } catch (error) {
    console.error("POST /users/[userId]/cart/sync error:", error);
    return NextResponse.json({ message: "حدث خطأ أثناء مزامنة السلة" }, { status: 500 });
  }
}
