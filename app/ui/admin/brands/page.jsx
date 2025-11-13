"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Trash2, Plus } from "lucide-react";
import BrandFormDrawer from "@/components/admin/BrandFormDrawer";
import axiosInstance from "@/context/axiosContext"; // Add this import

//import { getBrands, deleteBrand } from "@/services/brandService";

export default function AdminBrandsTable() {
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchBrands = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    try {
      const response = await axiosInstance.get(`/admin/brands?${params.toString()}`);
      setBrands(response.data.brands && response.data.brands.length > 0 ? response.data.brands : []);
    } catch {
      setBrands([]);
      console.log(brands);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBrands();
    // eslint-disable-next-line
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف الماركة؟")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setBrands((prev) => prev.filter((b) => b._id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">الماركات</h2>
        <div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <Plus className="w-5 h-5" />
            إضافة ماركة
          </button>
          <BrandFormDrawer open={open} onClose={() => setOpen(false)} />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="بحث باسم الماركة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow border">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 text-right">اسم الماركة</th>
              <th className="p-3 text-right">الشعار</th>
              <th className="p-3 text-right">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-8">
                  جاري التحميل...
                </td>
              </tr>
            ) : brands.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8">
                  لا توجد ماركات
                </td>
              </tr>
            ) : (
              brands.map((brand) => (
                <tr key={brand._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-bold">{brand.name}</td>
                  <td className="p-3">
                    {brand.logo && (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-12 h-12 object-cover rounded border"
                      />
                    )}
                  </td>
                  <td className="p-3 flex gap-2">
                    <Link
                      href={`/ui/admin/brands/${brand._id}`}
                      className="p-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                      title="عرض التفاصيل"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(brand._id)}
                      className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200"
                      title="حذف الماركة"
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
    </div>
  );
}
