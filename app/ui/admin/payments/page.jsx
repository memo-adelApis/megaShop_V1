"use client";
import { useEffect, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import Link from "next/link";

const API_URL = "/api/payments";

export default function AdminPaymentsTable() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    const res = await fetch(`${API_URL}?${params.toString()}`);
    const data = await res.json();
    setPayments(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line
  }, [search, status]);

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف المدفوعات؟")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setPayments((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">المدفوعات</h2>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="بحث برقم العملية أو اسم العميل..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
        <input
          type="text"
          placeholder="بحث بالحالة..."
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow border">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 text-right">رقم العملية</th>
              <th className="p-3 text-right">اسم العميل</th>
              <th className="p-3 text-right">المبلغ</th>
              <th className="p-3 text-right">الحالة</th>
              <th className="p-3 text-right">التاريخ</th>
              <th className="p-3 text-right">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  جاري التحميل...
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  لا توجد مدفوعات
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-bold">{payment.transactionId}</td>
                  <td className="p-3">{payment.customerName}</td>
                  <td className="p-3">{payment.amount} ريال</td>
                  <td className="p-3">{payment.status}</td>
                  <td className="p-3">
                    {payment.date
                      ? new Date(payment.date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-3 flex gap-2">
                    <Link
                      href={`/ui/admin/payments/${payment._id}`}
                      className="p-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                      title="عرض التفاصيل"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(payment._id)}
                      className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200"
                      title="حذف المدفوعات"
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
