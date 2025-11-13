// app/product/[id]/page.js
"use client";
import IsFeaturedProduct from "@/components/home/isFeaturedProduct";
import ProductGallery from "@/components/productDetails/ProductGallery";
import ProductDetails from "@/components/productDetails/ProductDetails";
import ProductReviews from "@/components/productDetails/ProductReviews";
import ProductPriceBox from "@/components/productDetails/ProductPriceBox";
import ProductOrderSummary from "@/components/productDetails/ProductOrderSummary";
import ProductCheckoutBox from "@/components/productDetails/ProductCheckoutBox";
import { useParams } from "next/navigation";
import Spenner from "@/components/Spenner";
import { getProductById } from "@/hooks/_ProductLogic";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/authContext";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("order");
  const { addToCart, cart, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    try {
      await addToCart({
        _id: product._id,
        product: product._id,
        id: product._id,
        quantity: 1,
        name: product.name,
        price: product.price,
        priceAfterDiscount: product.priceAfterDiscount,
        images: product.images,
        image: product.images?.[0],
        attributes: product.attributes,
        stock: product.stock
      });
      
      showSuccessMessage("تمت إضافة المنتج إلى السلة بنجاح!");
      window.dispatchEvent(new CustomEvent("open-cart"));
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      showErrorMessage("فشل في إضافة المنتج إلى السلة");
    } finally {
      setAddingToCart(false);
    }
  };

  const showSuccessMessage = (message) => {
    const existingMessage = document.getElementById('cart-message');
    if (existingMessage) existingMessage.remove();
    
    const messageEl = document.createElement('div');
    messageEl.id = 'cart-message';
    messageEl.className = 'fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-xl z-50 font-medium animate-fade-in';
    messageEl.textContent = message;
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.parentNode.removeChild(messageEl);
      }
    }, 3000);
  };

  const showErrorMessage = (message) => {
    const existingMessage = document.getElementById('cart-message');
    if (existingMessage) existingMessage.remove();
    
    const messageEl = document.createElement('div');
    messageEl.id = 'cart-message';
    messageEl.className = 'fixed top-4 right-4 bg-rose-500 text-white px-6 py-3 rounded-xl shadow-xl z-50 font-medium animate-fade-in';
    messageEl.textContent = message;
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.parentNode.removeChild(messageEl);
      }
    }, 3000);
  };

  const isInCart = Array.isArray(cart) && product
    ? cart.some(item => {
        const itemProductId = item.product?.toString?.() || item._id?.toString?.() || item.id?.toString?.();
        const currentProductId = product._id?.toString?.();
        return itemProductId === currentProductId;
      })
    : false;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center py-8">
        <Spenner size={12} />
        <p className="mt-6 text-gray-600 text-lg font-medium">جاري تحميل المنتج...</p>
      </div>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center py-8 max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 bg-rose-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">المنتج غير موجود</h2>
        <p className="text-gray-600 mb-6">قد يكون المنتج محذوفاً أو غير متاح حالياً</p>
        <a 
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          العودة للمتجر
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* زر العودة */}
      <div className="container mx-auto mt-6 px-4">
        <a 
          href="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          العودة للمتجر
        </a>
      </div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-4 p-4">
        {/* العمود الأول - معرض الصور وتفاصيل المنتج */}
        <div className="lg:col-span-2 xl:col-span-2 flex flex-col gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <ProductGallery images={product.images} />
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <ProductDetails product={product} />
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <ProductReviews reviews={product.reviews} />
          </div>
        </div>

        {/* العمود الثاني - السعر والخصائص */}
        <div className="lg:col-span-1 xl:col-span-1">
          <div className="sticky top-6 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <ProductPriceBox 
                price={product.price} 
                priceAfterDiscount={product.priceAfterDiscount}
                stock={product.stock} 
                attributes={product.attributes}
                views={product.views}
                onAddToCart={handleAddToCart}
                isInCart={isInCart}
                addingToCart={addingToCart || cartLoading}
              />
            </div>
          </div>
        </div>

        {/* العمود الثالث - ملخص الطلب */}
        <div className="lg:col-span-2 xl:col-span-4 w-full lg:hidden">
          <div className="sticky top-6 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  className={`flex-1 py-4 text-center font-semibold transition-all duration-300 ${
                    activeTab === "order" 
                      ? "text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md" 
                      : "text-gray-600 bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("order")}
                >
                  ملخص الطلب
                </button>
              </div>

              <div className="p-4">
                {activeTab === "order" && (
                  <ProductOrderSummary 
                    product={product}
                    attributes={product.attributes} 
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* المنتجات المميزة */}
      <div className="container mx-auto mt-16 mb-8 px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">منتجات قد تعجبك</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">اكتشف المزيد من المنتجات المميزة التي تناسب ذوقك</p>
        </div>
        <IsFeaturedProduct />
      </div>

      {/* إضافة أنيميشن للرسائل */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}