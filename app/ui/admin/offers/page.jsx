"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Trash2, Plus } from "lucide-react";
import OfferFormDrawer from "@/components/admin/OfferFormDrawer";

const API_URL = "/api/offers";

export default function AdminOffersTable() {
  const [offers, setOffers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchOffers = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    const res = await fetch(`${API_URL}?${params.toString()}`);
    const data = await res.json();
    setOffers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOffers();
    // eslint-disable-next-line
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف العرض؟")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setOffers((prev) => prev.filter((o) => o._id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">العروض</h2>
        <div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <Plus className="w-5 h-5" />
            إضافة عرض
          </button>
          <OfferFormDrawer open={open} onClose={() => setOpen(false)} />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="بحث بعنوان العرض..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow border">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 text-right">العنوان</th>
              <th className="p-3 text-right">الوصف</th>
              <th className="p-3 text-right">الصورة</th>
              <th className="p-3 text-right">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-8">
                  جاري التحميل...
                </td>
              </tr>
            ) : offers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8">
                  لا توجد عروض
                </td>
              </tr>
            ) : (
              offers.map((offer) => (
                <tr key={offer._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-bold">{offer.title}</td>
                  <td className="p-3">{offer.description}</td>
                  <td className="p-3">
                    {offer.image && (
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-12 h-12 object-cover rounded border"
                      />
                    )}
                  </td>
                  <td className="p-3 flex gap-2">
                    <Link
                      href={`/ui/admin/offers/${offer._id}`}
                      className="p-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                      title="عرض التفاصيل"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(offer._id)}
                      className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200"
                      title="حذف العرض"
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
