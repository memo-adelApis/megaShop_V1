"use client";
import { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import OfferFormDrawer from "@/components/admin/OfferFormDrawer";
import { useParams } from "next/navigation";

const API_URL = "/api/offers";

export default function AdminOfferDetails() {
      const { id } = useParams();
    
  const [offer, setOffer] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then((res) => res.json())
      .then(setOffer);
  }, [id]);

  if (!offer) {
    return (
      <div className="p-8 text-center text-gray-500">
        جاري تحميل بيانات العرض...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{offer.title}</h2>
        <button
          onClick={() => setEditOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Edit className="w-5 h-5" />
          تعديل العرض
        </button>
      </div>
      <div className="mb-4">
        <div className="font-semibold mb-2">الوصف:</div>
        <div className="text-gray-700">{offer.description}</div>
      </div>
      <div className="mb-4">
        <div className="font-semibold mb-2">الصورة:</div>
        {offer.image && (
          <img
            src={offer.image}
            alt={offer.title}
            className="w-24 h-24 object-cover rounded border"
          />
        )}
      </div>
      <OfferFormDrawer
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        initialData={offer}
      />
    </div>
  );
}
