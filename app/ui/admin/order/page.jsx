"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Trash2 } from "lucide-react";

const API_URL = "/api/orders";

// بيانات وهمية للطلبات
const DUMMY_ORDERS = [
  {
    _id: "1",
    orderNumber: "1001",
    customerName: "أحمد محمد",
    status: "جديد",
    total: 250,
  },
  {
    _id: "2",
    orderNumber: "1002",
    customerName: "سارة علي",
    status: "مكتمل",
    total: 400,
  },
];

export default function AdminOrdersTable() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    try {
      const res = await fetch(`${API_URL}?${params.toString()}`);
      const data = await res.json();
      setOrders(data && data.length > 0 ? data : DUMMY_ORDERS);
    } catch {
      setOrders(DUMMY_ORDERS);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف الطلب؟")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setOrders((prev) => prev.filter((o) => o._id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">الطلبات</h2>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="بحث برقم الطلب أو اسم العميل..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow border">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 text-right">رقم الطلب</th>
              <th className="p-3 text-right">اسم العميل</th>
              <th className="p-3 text-right">الحالة</th>
              <th className="p-3 text-right">الإجمالي</th>
              <th className="p-3 text-right">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8">
                  جاري التحميل...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8">
                  لا توجد طلبات
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-bold">{order.orderNumber}</td>
                  <td className="p-3">{order.customerName}</td>
                  <td className="p-3">{order.status}</td>
                  <td className="p-3">{order.total} ريال</td>
                  <td className="p-3 flex gap-2">
                    <Link
                      href={`/ui/admin/order/${order._id}`}
                      className="p-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                      title="عرض التفاصيل"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200"
                      title="حذف الطلب"
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
