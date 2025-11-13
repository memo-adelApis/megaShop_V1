"use client";
import Link from "next/link";
import { Eye, Trash2, Plus } from "lucide-react";
import ProductFormDrawer from "@/components/admin/ProductFormDrawer";
import { useAdminLogic } from "@/hooks/adminLogic";
import DescriptionTD from "@/components/admin/DescriptionTD"; // ✅ استيراد المكون الجديد
import Spenner from "@/components/Spenner";

export default function AdminProductsTable() {
  const {
    products,
    search,
    setSearch,
    brand,
    setBrand,
    category,
    setCategory,
    brandsList,
    loading,
    open,
    setOpen,
    fetchProducts,
    handleDelete,
    page,
    pages,
  } = useAdminLogic();

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">المنتجات</h2>
      </div>

      {/* زر الإضافة */}
      <div className="p-6">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center mb-4 gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
          إضافة منتج
        </button>
        <label className="flex items-center gap-2 mt-4 text-gray-800 px-4 py-2 rounded">
          {products.length} عدد المنتجات
        </label>
        <ProductFormDrawer
          open={open}
          onClose={() => setOpen(false)}
          onSuccess={fetchProducts}
        />
      </div>

      {/* 🟢 الفلاتر */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="بحث باسم المنتج..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />

        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        >
          <option value="">كل الماركات</option>
          {brandsList.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="بحث باسم التصنيف..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
      </div>

      {/* 🟢 الجدول */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow border text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 text-right">الصورة</th>
              <th className="p-3 text-right">الاسم</th>
              <th className="p-3 text-right">الوصف</th>
              <th className="p-3 text-right">السعر</th>
              <th className="p-3 text-right">خصم على المنتج</th>
              <th className="p-3 text-right">اضافي على المنتج</th>
              <th className="p-3 text-right">سعر البيع</th>
              <th className="p-3 text-right">الماركة</th>
              <th className="p-3 text-right">التصنيف</th>
              <th className="p-3 text-right">القسم</th>
              <th className="p-3 text-right">المخزون</th>
              <th className="p-3 text-right">المباع</th>
              <th className="p-3 text-right">المتبقي</th>
              <th className="p-3 text-right">خصم %</th>
              <th className="p-3 text-right">مميز</th>
              <th className="p-3 text-right">التقييم</th>
              <th className="p-3 text-right">المراجعات</th>
              <th className="p-3 text-right">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={16} className="text-center py-8">
                  <Spenner size={10} /> جاري التحميل...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={16} className="text-center py-8">
                  لا توجد منتجات
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  {/* صورة واحدة */}
                  <td className="p-3">
                    {(product.images || []).length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 object-contain rounded border bg-gray-50"
                      />
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* البيانات */}
                  <td className="p-3 font-bold">{product.name}</td>
                  
                  {/* ✅ الوصف مع خاصية التوسيع */}
                  <td className="max-w-xs">
                    <DescriptionTD 
                      description={product.description} 
                      maxLines={1}
                    />
                  </td>
                  
                  <td className="p-3">{product.price} جنيه</td>
                  <td className="p-3 text-green-700">
                    {product.discountOnProduct || 0.0} جنيه
                  </td>
                  <td className="p-3 text-green-700">
                    {product.additionalOnProduct || 0.0} جنيه
                  </td>
                       <td className="p-3 text-green-700">
                    {product.sellingPrice || 0.0} جنيه
                  </td>
                  <td className="p-3">{product.brand?.name || "-"}</td>
                  <td className="p-3">{product.category?.name || "-"}</td>
                  <td className="p-3">{product.section?.name || "-"}</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3">{product.stockSold}</td>
                  <td className="p-3">{product.stockRemaining}</td>
                  <td className="p-3">{product.discountRate}%</td>
                  <td className="p-3">
                    {product.isFeatured ? "✅" : "❌"}
                  </td>
                  <td className="p-3">{product.rating.toFixed(1)}</td>
                  <td className="p-3">{product.numOfReviews}</td>

                  {/* الإجراءات */}
                  <td className="p-3 flex gap-2">
                    <Link
                      href={`/ui/admin/products/${product._id}`}
                      className="p-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                      title="عرض التفاصيل"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200"
                      title="حذف المنتج"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🟢 Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            onClick={() => fetchProducts({ page: i + 1 })}
            className={`px-3 py-1 rounded ${
              page === i + 1 ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}