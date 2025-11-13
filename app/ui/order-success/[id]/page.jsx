// app/order-success/[id]/page.js
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/home/Navbar";
import Link from "next/link";

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // جلب بيانات الطلب من API
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`);
        const data = await response.json();
        if (data.success) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [params.id]);

  return (
    <div>
      <Navbar />
      
      <div className="container mx-auto p-4 max-w-2xl text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-green-700 mb-4">
            تم تأكيد طلبك بنجاح!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            شكراً لثقتك بنا. سنقوم بتجهيز طلبك وإرساله في أقرب وقت.
          </p>

          {order && (
            <div className="bg-white p-6 rounded-lg shadow border text-right mb-6">
              <h3 className="font-bold text-xl mb-4">تفاصيل الطلب</h3>
              <p><strong>رقم الطلب:</strong> #{order._id}</p>
              <p><strong>الإجمالي:</strong> {order.totalPrice} ريال</p>
              <p><strong>حالة الطلب:</strong> {order.status}</p>
              <p><strong>طريقة الدفع:</strong> {order.paymentMethod}</p>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Link
              href="/orders"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              عرض طلباتي
            </Link>
            <Link
              href="/"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}