"use client";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Eye, ShoppingCart, X, Heart } from "lucide-react";
import { useState } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import { useCart } from "@/context/CartContext"; // 🟢 لازم تضيفه
import Link from "next/link";

const ProductCard = ({ product }) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToCart, loading, isInCart } = useCart();
  const [current, setCurrent] = useState(0);

  const handleAddToCart = () => {
    addToCart({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image,
      quantity: 1,
    });
  };
 
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev + 1) % images.length);
  };
  const prevImage = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const renderAttributes = () => {
    if (!Array.isArray(product.attributes) || product.attributes.length === 0) return null;
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {product.attributes.map((attr, idx) =>
          attr.key && Array.isArray(attr.value) && attr.value.length > 0 ? (
            <div
              key={idx}
              className="bg-gray-100 rounded px-2 py-1 text-xs flex items-center gap-1 border border-gray-200"
            >
              <span className="font-bold text-gray-700">{attr.key}:</span>
              <span className="text-gray-600">
                {attr.value
                  .map((v) => (typeof v === "object" && v !== null && v.name ? v.name : v))
                  .join(", ")}
              </span>
            </div>
          ) : null
        )}
      </div>
    );
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg ring-1 ring-gray-100 overflow-hidden"
    >
      {/* زر المفضلة */}
      <button
        className="absolute top-3 left-3 z-10 bg-white/90 p-2 rounded-full shadow hover:bg-red-100 transition"
        onClick={() =>
          isFavorite(product._id) ? removeFavorite(product._id) : addFavorite(product)
        }
        type="button"
        title={isFavorite(product._id) ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
      >
        <Heart
          className={`w-5 h-5 ${
            isFavorite(product._id) ? "fill-red-500 text-red-500" : "text-gray-600"
          }`}
        />
      </button>

      {product.badge && (
        <span className="absolute top-3 right-3 z-10 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
          {product.badge}
        </span>
      )}

      {/* الصور */}
      <div className="aspect-[4/3] w-full overflow-hidden relative">
        <img
          src={images[current]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {images.length > 1 && (
          <>
            <button
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow"
              onClick={prevImage}
              type="button"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow"
              onClick={nextImage}
              type="button"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`inline-block w-2 h-2 rounded-full ${
                    idx === current ? "bg-green-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* تفاصيل المنتج */}
      <div className="p-4 flex flex-col gap-3">
        <h3 className="font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
        {renderAttributes()}
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg text-gray-900">{product.price} جنية مصري</span>
        </div>

        {/* أزرار */}
        <div className="flex items-center gap-2">
          <Link href={`/products/${product._id}`}>
            <button
              className="bg-blue-100 text-blue-700 rounded-xl p-2 hover:bg-blue-200 transition"
              title="عرض التفاصيل"
              type="button"
            >
              <Eye className="w-5 h-5" />
            </button>
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={   isInCart(product._id) || (product.stockRemaining === 0) }
            className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
              product.stockRemaining === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : isInCart(product._id)
                ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
            aria-label={product.stockRemaining === 0 ? "غير متوفر" : "أضف إلى السلة"}
            type="button"
          >
            {loading ? (
              "جاري الإضافة..."
            ) : product.stockRemaining === 0 ? (
              <>
               سيتوفر قريباً<X className="w-5 h-5 text-red-400" />
              </>
            ) : isInCart(product._id) ? (
              <>

                تمت الإضافة ✓ <ShoppingCart className="w-5 h-5 text-green-500" />
              </>
            ) : (
              <>
                أضف إلى السلة <ShoppingCart className="w-5 h-5 text-blou-300" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
