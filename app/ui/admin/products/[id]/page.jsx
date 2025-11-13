"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Edit } from "lucide-react";
import ProductFormDrawer from "@/components/admin/ProductFormDrawer";
import { useParams } from "next/navigation";
import { getProductById } from "@/services/productService";

export default function AdminProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    getProductById(id).then((data) => {
      setProduct(data);
      setMainImage(data?.images?.[0] || "/no-image.png");
    });
  }, [id]);

  if (!product) {
    return (
      <div className="p-8 text-center text-gray-500">
        جاري تحميل بيانات المنتج...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* العنوان + زر تعديل */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <button
          onClick={() => setEditOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Edit className="w-5 h-5" />
          تعديل المنتج
        </button>
      </div>

      {/* الصور */}
      <div className="mb-8">
        <div className="flex flex-col items-center">
          {/* الصورة الرئيسية */}
          <div className="w-full flex justify-center mb-6">
            <Image
              src={mainImage}
              alt={product.name}
              width={500}
              height={500}
              className="rounded-xl shadow-lg object-cover w-full max-w-lg h-80"
            />
          </div>

          {/* صور مصغرة 100x100 - صف 4 صور */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(product.images || []).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setMainImage(img)}
                className={`border rounded overflow-hidden hover:ring-2 hover:ring-blue-400 ${
                  mainImage === img ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <Image
                  src={img}
                  alt={`صورة ${idx + 1}`}
                  width={100}
                  height={100}
                  className="object-cover w-[100px] h-[100px]"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* الوصف */}
      <div className="mb-6">
        <div className="font-semibold mb-2">الوصف:</div>
        <div className="text-gray-700">{product.description}</div>
      </div>

      {/* بيانات أساسية */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-sm">
        <div><span className="font-semibold">السعر:</span> {product.price} ريال</div>
        <div><span className="font-semibold">بعد الخصم:</span> {product.priceAfterDiscount} ريال</div>
        <div><span className="font-semibold">نسبة الخصم:</span> {product.discountRate}%</div>
        <div><span className="font-semibold">الوحدة:</span> {product.unit}</div>
        <div><span className="font-semibold">الماركة:</span> {product.brand?.name || "-"}</div>
        <div><span className="font-semibold">التصنيف:</span> {product.category?.name || "-"}</div>
        <div><span className="font-semibold">المخزون:</span> {product.stock}</div>
        <div><span className="font-semibold">المباع:</span> {product.stockSold}</div>
        <div><span className="font-semibold">المتبقي:</span> {product.stockRemaining}</div>
        <div><span className="font-semibold">التقييم:</span> {product.rating} ⭐</div>
        <div><span className="font-semibold">المراجعات:</span> {product.numOfReviews}</div>
        <div><span className="font-semibold">مميز؟</span> {product.isFeatured ? "✔️" : "❌"}</div>
      </div>

      {/* الخصائص */}
      <div className="mb-6">
        <div className="font-semibold mb-2">الخصائص:</div>
        <table className="w-full border rounded text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-right border">المفتاح</th>
              <th className="p-2 text-right border">القيمة</th>
            </tr>
          </thead>
          <tbody>
            {(product.attributes || []).map((attr) => (
              <tr key={attr._id?.$oid || attr.key}>
                <td className="p-2 border">{attr.key}</td>
                <td className="p-2 border">
                  {Array.isArray(attr.value) ? attr.value.join(", ") : attr.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* معلومات النظام */}
      <div className="text-sm text-gray-500 mb-6 space-y-1">
        <div>تاريخ الإنشاء: {new Date(product.createdAt).toLocaleString("ar-EG")}</div>
        <div>آخر تحديث: {new Date(product.updatedAt).toLocaleString("ar-EG")}</div>
      </div>
      <button
        onClick={() => setEditOpen(true)}
        className="mt-6 flex items-center border border-blue-600 gap-2 bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700"
      >
        تعديل المنتج
      </button>

      {/* Drawer للتعديل */}
      <ProductFormDrawer
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        initialData={product}
      />
    </div>
  );
}
