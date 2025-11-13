"use client";
import { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import BrandFormDrawer from "@/components/admin/BrandFormDrawer";
import { useParams } from "next/navigation";

const API_URL = "/api/brands";

export default function AdminBrandDetails() {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/${id}`)
      .then((res) => res.json())
      .then(setBrand);
  }, [id]);

  if (!brand) {
    return (
      <div className="p-8 text-center text-gray-500">
        جاري تحميل بيانات الماركة...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{brand.name}</h2>
        <button
          onClick={() => setEditOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Edit className="w-5 h-5" />
          تعديل الماركة
        </button>
      </div>
      <div className="mb-4">
        <div className="font-semibold mb-2">الشعار:</div>
        {brand.logo && (
          <img
            src={brand.logo}
            alt={brand.name}
            className="w-24 h-24 object-cover rounded border"
          />
        )}
      </div>
      <BrandFormDrawer
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        initialData={brand}
      />
    </div>
  );
}
