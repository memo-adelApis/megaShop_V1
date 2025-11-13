// components/productDetails/ProductOrderSummary.jsx
"use client";
import { useAuth } from "@/context/authContext";
import { useCouponsLogic } from "@/hooks/useCouponsLogic";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useOrdersLogic } from "@/hooks/useOrdersLogic";

export default function ProductOrderSummary({ product, attributes }) {
  const router = useRouter();
  const user = useAuth();
  const userId = user?.user?.id || user?.user?._id;
  const { addToCart } = useCart();
  const { createOrder } = useOrdersLogic(userId);
  
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [finalPrice, setFinalPrice] = useState(product?.price || 0);
  const [couponError, setCouponError] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);
  
  const { checkCoupon, loading: couponLoading } = useCouponsLogic();

  // حساب إجمالي الطلب قبل الخصم
  const orderTotal = (product?.price || 0) * quantity;

  // تهيئة الخصائص المختارة
  useEffect(() => {
    const initialAttributes = {};
    attributes.forEach(attr => {
      if (attr.value.length > 0) {
        const values = attr.value.join("").split("-");
        if (values.length > 0) {
          initialAttributes[attr.key] = values[0].trim();
        }
      }
    });
    setSelectedAttributes(initialAttributes);
  }, [attributes]);

  // تحديث السعر النهائي عند تغيير الكمية أو الكوبون
  useEffect(() => {
    if (appliedCoupon) {
      const discount = appliedCoupon.discountValue || 0;
      let discountedPrice = 0;
      
      if (appliedCoupon.discountType === 'percent') {
        discountedPrice = product.price - (product.price * discount / 100);
      } else {
        discountedPrice = product.price - (discount / quantity);
      }
      
      setFinalPrice(Math.max(0, discountedPrice));
    } else {
      setFinalPrice(product.price);
    }
  }, [appliedCoupon, product.price, quantity]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("يرجى إدخال كود الكوبون");
      return;
    }

    setCouponError("");
    
    const result = await checkCoupon(couponCode, userId, orderTotal);
    
    if (result.success) {
      setAppliedCoupon(result.coupon);
      setCouponError("");
    } else {
      setCouponError(result.error);
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    setFinalPrice(product.price);
  };

  const handleAddToCart = () => {
    if (!user) {
      alert("يجب تسجيل الدخول أولاً");
      return;
    }

    const cartItem = {
      _id: product._id,
      name: product.name,
      price: finalPrice,
      originalPrice: product.price,
      image: product.images[0],
      quantity: quantity,
      attributes: selectedAttributes,
      coupon: appliedCoupon
    };

    addToCart(cartItem);
    alert("تمت إضافة المنتج إلى السلة");
  };

  const handleBuyNow = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (product.stock <= 0) {
      alert("المنتج غير متوفر حالياً");
      return;
    }

    setOrderLoading(true);

    try {
      // حساب الأسعار
      const subtotal = product.price * quantity;
      const discount = appliedCoupon ? (product.price * quantity) - (finalPrice * quantity) : 0;
      const totalPrice = finalPrice * quantity;

      // إنشاء طلب فوري مع البيانات المطلوبة
      const orderData = {
        user: userId,
        items: [{
          product: product._id,
          name: product.name,
          price: finalPrice,
          quantity: quantity,
          attributes: selectedAttributes
        }],
        subtotal: subtotal,
        discount: discount,
        totalPrice: totalPrice,
        coupon: appliedCoupon?._id,
        shippingAddress: {
          name: user.user?.name || "لم يتم التحديد",
          phone: user.user?.phone || "لم يتم التحديد", 
          address: user.user?.address || "لم يتم التحديد",
          city: user.user?.city || "لم يتم التحديد"
        },
        paymentMethod: "cash_on_delivery", // استخدام القيمة الصحيحة من enum
        status: "pending"
      };

      console.log("بيانات الطلب المرسلة:", orderData);

      // إنشاء الطلب في قاعدة البيانات
      const result = await createOrder(orderData);
      
      if (result) {
        console.log("تم إنشاء الطلب بنجاح:", result);
        // الانتقال إلى صفحة تأكيد الطلب
      router.push(`/ui/checkout/${result._id}`);
      } else {
        alert("فشل في إنشاء الطلب");
      }
    } catch (error) {
      console.error("خطأ في إنشاء الطلب:", error);
      alert("حدث خطأ أثناء إنشاء الطلب: " + error.message);
    } finally {
      setOrderLoading(false);
    }
  };

  const handleAttributeChange = (attributeKey, value) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attributeKey]: value
    }));
  };

  // حساب الإجمالي النهائي
  const totalPrice = finalPrice * quantity;
  const totalDiscount = appliedCoupon ? (product.price * quantity) - totalPrice : 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow border space-y-6 sticky top-4">
      <h3 className="font-bold text-xl text-gray-800 border-b pb-3">تفاصيل الطلب</h3>

      {/* اختيار الخصائص */}
      {attributes.map((attr) => (
        <div key={attr._id}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {attr.key}
          </label>
          <select 
            className="w-full border rounded-lg px-3 py-2"
            value={selectedAttributes[attr.key] || ''}
            onChange={(e) => handleAttributeChange(attr.key, e.target.value)}
          >
            {attr.value.join("").split("-").map((val, index) => (
              <option key={index} value={val.trim()}>
                {val.trim()}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* الكمية */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الكمية
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
            className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition"
          >
            -
          </button>
          <span className="text-lg font-semibold px-4">{quantity}</span>
          <button
            onClick={() => setQuantity(prev => prev + 1)}
            disabled={quantity >= product.stock}
            className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition disabled:opacity-50"
          >
            +
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          المتاح: {product.stock} قطعة
        </p>
      </div>

      {/* الكوبون */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          كوبون الخصم
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="أدخل كوبون الخصم"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value.toUpperCase());
              setCouponError("");
            }}
            className="flex-1 border rounded-lg px-3 py-2"
            disabled={couponLoading}
          />
          <button
            onClick={handleApplyCoupon}
            disabled={couponLoading || !couponCode.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            {couponLoading ? "..." : "تطبيق"}
          </button>
        </div>
        
        {couponError && (
          <p className="text-red-600 text-sm mt-2">{couponError}</p>
        )}
      </div>

      {/* عرض الكوبون المطبق */}
      {appliedCoupon && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-700 font-bold">{appliedCoupon.name}</p>
              <p className="text-green-600 text-sm">
                خصم: {appliedCoupon.discountType === 'percent' 
                  ? `${appliedCoupon.discountValue}%` 
                  : `${appliedCoupon.discountValue} جنيه`}
              </p>
              <p className="text-green-600 text-xs">
                إجمالي الطلب قبل الخصم: {orderTotal} جنيه
              </p>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              إزالة
            </button>
          </div>
        </div>
      )}

      {/* الإجمالي */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between text-lg">
          <span className="font-semibold">السعر الأصلي:</span>
          <span>{orderTotal.toFixed(2)} جنيه</span>
        </div>
        
        {appliedCoupon && (
          <div className="flex justify-between text-green-600">
            <span>الخصم:</span>
            <span>-{totalDiscount.toFixed(2)} جنيه</span>
          </div>
        )}
        
        <div className="flex justify-between text-xl font-bold border-t pt-2">
          <span>الإجمالي النهائي:</span>
          <span className="text-green-600">{totalPrice.toFixed(2)} جنيه</span>
        </div>
      </div>

      {/* أزرار الإجراءات */}
      <div className="space-y-3">
        {/* <button 
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:bg-gray-400"
        >
          {product.stock <= 0 ? 'غير متوفر' : 'إضافة إلى السلة'}
        </button> */}
        
        <button 
          onClick={handleBuyNow}
          disabled={product.stock <= 0 || orderLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          {orderLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              جاري إنشاء الطلب...
            </>
          ) : (
            'شراء الآن'
          )}
        </button>
      </div>
    </div>
  );
}