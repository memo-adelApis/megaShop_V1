"use client";
import { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import { useParams } from "next/navigation";

const API_URL = "/api/orders";

export default function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/${id}`)
      .then((res) => res.json())
      .then(setOrder);
  }, [id]);

  if (!order) {
    return (
      <div className="p-8 text-center text-gray-500">
        جاري تحميل بيانات الطلب...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          تفاصيل الطلب #{order.orderNumber}
        </h2>
        {/* زر تعديل الطلب إذا أردت */}
      </div>
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <span className="font-semibold">اسم العميل:</span>{" "}
          {order.customerName}
        </div>
        <div>
          <span className="font-semibold">الحالة:</span> {order.status}
        </div>
        <div>
          <span className="font-semibold">الإجمالي:</span> {order.total} ريال
        </div>
        <div>
          <span className="font-semibold">تاريخ الطلب:</span>{" "}
          {order.date ? new Date(order.date).toLocaleDateString() : "-"}
        </div>
      </div>
      <div className="mb-6">
        <span className="font-semibold">العنوان:</span>
        <div className="text-gray-700">{order.address?.full || "-"}</div>
      </div>
      {/* خريطة للعنوان إذا توفر lat/lng */}
      {order.address?.lat && order.address?.lng && (
        <div className="mb-6">
          <iframe
            title="خريطة العنوان"
            width="100%"
            height="300"
            style={{ borderRadius: "12px", border: "1px solid #eee" }}
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${order.address.lat},${order.address.lng}&z=15&output=embed`}
          />
        </div>
      )}
      <div>
        <span className="font-semibold">المنتجات:</span>
        <ul className="list-disc pl-6">
          {order.items?.map((item, idx) => (
            <li key={idx}>
              {item.name} × {item.qty} ({item.price} ريال)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
