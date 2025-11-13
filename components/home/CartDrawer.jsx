// components/CartDrawer.js
import Drawer from "./Drawer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

// دالة تنسيق العملة
const formatSAR = (n) =>
  new Intl.NumberFormat("ar-EG", { style: "currency", currency: "EGP" }).format(n);

const CartDrawer = ({ showCart, setShowCart, cart: cartProp, total: totalProp }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { 
    removeItem, 
    cart: cartCtx = [], 
    getCartTotal,
    clearCart 
  } = useCart();

  const cart = Array.isArray(cartProp) ? cartProp : Array.isArray(cartCtx) ? cartCtx : [];
  const total = typeof totalProp !== "undefined" ? totalProp : (typeof getCartTotal === "function" ? getCartTotal() : 0);

  const handleCheckout = async () => {
    // استخرج معرف المستخدم بأمان (قد يكون _id أو id أو uid)
    const getUserId = (u) => {
      if (!u) return null;
      return (u._id && u._id.toString && u._id.toString()) ||
             (u.id && u.id.toString && u.id.toString()) ||
             (u.uid && u.uid.toString && u.uid.toString()) ||
             null;
    };
    const userId = getUserId(user);

    if (!userId) {
      // إذا لم يكن مسجلاً أو المعرف غير متوفر، نوجهه للتسجيل/تسجيل الدخول
      setShowCart(false);
      router.push('/login?redirect=checkout');
      return;
    }

    if (cart.length === 0) {
      alert("السلة فارغة");
      return;
    }

    try {
      setShowCart(false);
      
      // إنشاء طلب من محتويات السلة
      const orderData = {
        items: cart.map(item => ({
          product: (item.product || item._id || item.id),
          name: item.name || item.title,
          price: item.price,
          image: item.image || (item.images && item.images[0]),
          quantity: item.quantity || item.qty || 1,
          attributes: item.attributes || {}
        })),
        subtotal: total,
        discount: 0, // يمكن إضافة كوبون لاحقاً
        totalPrice: total,
        shippingAddress: user.shippingAddress || {},
        paymentMethod: "cash_on_delivery",
        status: "pending",
        user: userId // أرسل معرف المستخدم الصحيح هنا
      };

      // إنشاء الطلب في قاعدة البيانات
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (result.success) {
        // تفريغ السلة بعد إنشاء الطلب
        await clearCart();
        
        // التوجيه إلى صفحة checkout
        router.push(`/ui/checkout/${result.order._id}`);
      } else {
        console.error("Order creation failed response:", result);
        alert("حدث خطأ أثناء إنشاء الطلب: " + (result.error || "خطأ غير معروف"));
      }

    } catch (error) {
      console.error("Error during checkout:", error);
      alert("حدث خطأ أثناء إتمام الشراء");
    }
  };

  // helper لتنسيق قيمة السمة إلى نص آمن للعرض
  const formatAttrValue = (v) => {
    if (v == null) return "";
    if (Array.isArray(v)) {
      return v
        .map((x) => (typeof x === "object" && x !== null ? (x.name ?? x.value ?? JSON.stringify(x)) : String(x)))
        .join(", ");
    }
    if (typeof v === "object") {
      return v.name ?? v.value ?? JSON.stringify(v);
    }
    return String(v);
  };

  return (
    <Drawer
      open={showCart}
      onClose={() => setShowCart(false)}
      title="عربة التسوق"
    >
      {!cart || cart.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-gray-500 mb-4">لا توجد منتجات في العربة</p>
          <button
            onClick={() => setShowCart(false)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            متابعة التسوق
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="max-h-96 overflow-y-auto">
            {cart.map((item) => (
              <div
                key={item.id || item.product || item._id}
                className="flex items-center justify-between gap-3 border-b pb-3"
              >
                <img
                  src={item.image || (item.images && item.images[0]) || "/no-image.png"}
                  className="w-16 h-16 rounded-lg object-cover"
                  alt={item.name || item.title || ""}
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.name || item.title}</div>
                  <div className="text-xs text-gray-500">
                    {formatSAR(item.price || 0)} × {Number(item.quantity || item.qty || 1)}
                  </div>
                  {item.attributes && (
                    <div className="text-xs text-gray-400 mt-1">
                      {Array.isArray(item.attributes)
                        ? item.attributes.map((a) => (
                            <span key={a._id || a.key} className="inline-block mr-2">
                              {a.key}: {formatAttrValue(a.value)}
                            </span>
                          ))
                        : Object.entries(item.attributes).map(([k, v]) => (
                            <span key={k} className="inline-block mr-2">
                              {k}: {formatAttrValue(v)}
                            </span>
                          ))}
                    </div>
                  )}
                </div>
                <div className="font-semibold text-sm">
                  {formatSAR((item.price || 0) * Number(item.quantity || item.qty || 1))}
                </div>
                <button
                  onClick={() => removeItem(item.id || item.product || item._id)}
                  aria-label="حذف من السلة"
                  className="text-red-500 hover:text-red-700 px-2 py-1"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>المجموع:</div>
              <div>{formatSAR(total)}</div>
            </div>
            
            {!user && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-700">
                ⚠️ سجل الدخول لحفظ سلة التسوق وإتمام الشراء
              </div>
            )}

            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            >
              إتمام الشراء
            </button>

            <button 
              onClick={() => setShowCart(false)}
              className="w-full bg-gray-600 text-white py-2 rounded-xl hover:bg-gray-700"
            >
              متابعة التسوق
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default CartDrawer;