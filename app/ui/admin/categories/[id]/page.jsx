"use client";
import { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import CategoryFormDrawer from "@/components/admin/CategoryFormDrawer";
import { useParams } from "next/navigation";

const API_URL = "/api/categories";

export default function AdminCategoryDetails() {
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then((res) => res.json())
      .then(setCategory);
  }, [id]);

  if (!category) {
    return (
      <div className="p-8 text-center text-gray-500">
        جاري تحميل بيانات التصنيف...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{category.name}</h2>
        <button
          onClick={() => setEditOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Edit className="w-5 h-5" />
          تعديل التصنيف
        </button>
      </div>
      <div className="mb-4">
        <div className="font-semibold mb-2">الوصف:</div>
        <div className="text-gray-700">{category.description}</div>
      </div>
      <CategoryFormDrawer
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        initialData={category}
      />
    </div>
  );
}
