"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Trash2, Plus } from "lucide-react";
import CategoryFormDrawer from "@/components/admin/CategoryFormDrawer";
import { getCategories , deleteCategory } from "@/services/categoryService";



export default function AdminCategoriesTable() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    const data = await getCategories();
    setCategories(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف التصنيف؟")) return;
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">التصنيفات</h2>
        <div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <Plus className="w-5 h-5" />
            إضافة تصنيف
          </button>
          <CategoryFormDrawer open={open} onClose={() => setOpen(false)} />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="بحث باسم التصنيف..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow border">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 text-right">اسم التصنيف</th>
              <th className="p-3 text-right">الوصف</th>
              <th className="p-3 text-right">جزء</th>

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
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8">
                  لا توجد تصنيفات
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-bold">{cat.name}</td>
                  <td className="p-3">{cat.description}</td>
                  <td className="p-3">{cat.section.name}</td>

                  <td className="p-3 flex gap-2">
                    <Link
                      href={`/ui/admin/categories/${cat._id}`}
                      className="p-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                      title="عرض التفاصيل"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200"
                      title="حذف التصنيف"
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
