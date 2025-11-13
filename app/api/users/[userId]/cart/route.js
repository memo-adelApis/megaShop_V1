import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";
import User from "@/models/User";
import Product from "@/models/Product";

const mapCartItems = (items) =>
  items.map((i) => {
    const prod = i.product || {};
    return {
      product: prod._id || prod || null,
      name: prod.name || i.name || "",
      price: prod.price ?? prod.priceAfterDiscount ?? i.price ?? 0,
      image:
        (prod.images && prod.images[0]) || prod.image || i.image || null,
      quantity: typeof i.qty !== "undefined" ? i.qty : i.quantity || 0,
      attributes: i.attributes || {},
    };
  });

export async function GET(req, context) {
  const { params } = context;
  const { userId } = await params;
  try {
    await connectMongoDB();

    // Prefer Cart collection; fallback to User.cart
    let cartDoc = await Cart.findOne({ user: userId }).populate("items.product").lean();
    if (cartDoc && cartDoc.items) {
      return NextResponse.json(mapCartItems(cartDoc.items));
    }

    const user = await User.findById(userId).lean();
    if (!user) return NextResponse.json([], { status: 200 });
    return NextResponse.json(
      (user.cart || []).map((i) => ({
        product: i.product,
        name: i.name,
        price: i.price,
        image: i.image,
        quantity: i.quantity,
        attributes: i.attributes || {},
      }))
    );
  } catch (error) {
    console.error("GET /users/[userId]/cart error:", error);
    return NextResponse.json({ message: "حدث خطأ أثناء جلب السلة" }, { status: 500 });
  }
}

export async function POST(req, context) {
  // Add item or increase qty
  const { params } = context;
  const { userId } = await params;
  try {
    await connectMongoDB();
    const body = await req.json();
    const { productId, quantity = 1 } = body;
    if (!productId) return NextResponse.json({ message: "productId مطلوب" }, { status: 400 });

    const product = await Product.findById(productId).lean();
    if (!product) return NextResponse.json({ message: "المنتج غير موجود" }, { status: 404 });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [{ product: productId, qty: quantity }] });
    } else {
      const idx = cart.items.findIndex((it) => it.product.toString() === productId.toString());
      if (idx > -1) cart.items[idx].qty += quantity;
      else cart.items.push({ product: productId, qty: quantity });
    }
    await cart.save();
    await cart.populate("items.product");
    return NextResponse.json(mapCartItems(cart.items));
  } catch (error) {
    console.error("POST /users/[userId]/cart error:", error);
    return NextResponse.json({ message: "حدث خطأ أثناء إضافة المنتج إلى السلة" }, { status: 500 });
  }
}

export async function PUT(req, context) {
  // Update item quantity
  const { params } = context;
  const { userId } = await params;
  try {
    await connectMongoDB();
    const body = await req.json();
    const { productId, quantity } = body;
    if (!productId || typeof quantity !== "number")
      return NextResponse.json({ message: "productId و quantity مطلوبان" }, { status: 400 });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return NextResponse.json({ message: "السلة غير موجودة" }, { status: 404 });

    const idx = cart.items.findIndex((it) => it.product.toString() === productId.toString());
    if (idx === -1) return NextResponse.json({ message: "العنصر غير موجود في السلة" }, { status: 404 });

    if (quantity <= 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].qty = quantity;
    }

    await cart.save();
    await cart.populate("items.product");
    return NextResponse.json(mapCartItems(cart.items));
  } catch (error) {
    console.error("PUT /users/[userId]/cart error:", error);
    return NextResponse.json({ message: "حدث خطأ أثناء تحديث الكمية" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  // Remove specific item or clear cart
  const { params } = context;
  const { userId } = await params;
  try {
    await connectMongoDB();
    const body = await req.json().catch(() => ({}));
    const { productId, clearAll } = body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      // nothing to do
      return NextResponse.json([], { status: 200 });
    }

    if (clearAll || (!productId && clearAll !== false)) {
      cart.items = [];
    } else if (productId) {
      cart.items = cart.items.filter((it) => it.product.toString() !== productId.toString());
    } else {
      // If no productId and clearAll not true, treat as bad request
      return NextResponse.json({ message: "productId مطلوب أو حدد clearAll=true" }, { status: 400 });
    }

    await cart.save();
    await cart.populate("items.product");
    return NextResponse.json(mapCartItems(cart.items));
  } catch (error) {
    console.error("DELETE /users/[userId]/cart error:", error);
    return NextResponse.json({ message: "حدث خطأ أثناء حذف/تفريغ السلة" }, { status: 500 });
  }
}
