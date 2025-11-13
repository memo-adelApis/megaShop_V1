import { Star } from "lucide-react";
import Link from "next/link";

// دالة تنسيق السعر
const formatSAR = (n) =>
  new Intl.NumberFormat("ar-EG", { style: "currency", currency: "EGP" }).format(n);

const IsFeaturedProduct = ({ isFeatured, products: productsProp, loading }) => {
  // استخدم أيًّا من الحقول الممرّرة أو مصفوفة افتراضية
  const list = Array.isArray(isFeatured) ? isFeatured : Array.isArray(productsProp) ? productsProp : [];

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>;
  if (!list || list.length === 0) return <div className="text-center py-8">لا توجد منتجات مميزة</div>;

  return (
    <section className="my-8">
      <h2 className="text-xl font-bold mb-4 text-green-700 text-center">المنتجات المميزة</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {list.map((product) => (
          <div
            key={product._id || product.id}
            className="relative bg-white rounded-lg shadow-md p-3 flex flex-col items-center transition-transform hover:shadow-xl hover:-translate-y-1 min-h-[240px] max-w-[200px] mx-auto"
          >
            {/* أيقونة النجمة الذهبية أعلى المنتج */}
            <span className="absolute top-2 right-2 z-10">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </span>

            <div className="w-full flex items-center justify-center mb-2">
              <img
                src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : "/no-image.png"}
                alt={product.name}
                className="w-full h-28 object-cover rounded-md border-b-4 border-green-200"
              />
            </div>

            <h3 className="font-semibold text-gray-800 text-center text-sm line-clamp-2 px-1">{product.name}</h3>

            <div className="mt-2 w-full flex items-center justify-between px-2">
              <div className="text-green-600 font-bold text-sm">
                {formatSAR(product.price ?? product.priceAfterDiscount ?? 0)}
              </div>
              <div className="text-xs text-gray-500">متاح</div>
            </div>

            <div className="mt-3 w-full px-2">
              <Link href={`/products/${product._id || product.id}`} className="w-full block">
                <button className="w-full text-center bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition text-sm">
                  اشتري الآن
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default IsFeaturedProduct;

