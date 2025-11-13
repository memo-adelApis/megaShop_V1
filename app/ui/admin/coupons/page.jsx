// components/admin/CouponsTable.js
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Trash2, Plus, Edit } from "lucide-react";
import CouponFormDrawer from "@/components/admin/CopuonFormDrawer";
import axiosInstance from "@/context/axiosContext";

export default function AdminCouponsTable() {
  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const fetchCoupons = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    try {
      const response = await axiosInstance.get(`/admin/coupons?${params.toString()}`);
      setCoupons(response.data.coupons && response.data.coupons.length > 0 ? response.data.coupons : []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setCoupons([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
    // eslint-disable-next-line
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف الكوبون؟")) return;
    try {
      await axiosInstance.delete(`/admin/coupons/${id}`);
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting coupon:", error);
      alert("حدث خطأ أثناء حذف الكوبون");
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setOpen(true);
  };

  const handleAdd = () => {
    setEditingCoupon(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCoupon(null);
    fetchCoupons(); // تحديث البيانات بعد الإغلاق
  };

  const getDiscountDisplay = (coupon) => {
    if (coupon.discountType === "percent") {
      return `${coupon.discountValue}%`;
    } else {
      return `${coupon.discountValue} جنيه`;
    }
  };

  const getStatusBadge = (coupon) => {
    const now = new Date();
    const expiryDate = new Date(coupon.expiryDate);
    
    if (!coupon.active) {
      return <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">غير مفعل</span>;
    }
    if (expiryDate < now) {
      return <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">منتهي</span>;
    }
    if (coupon.usedCount >= coupon.usageLimit) {
      return <span className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-800">مستنفذ</span>;
    }
    return <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">نشط</span>;
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">الكوبونات</h2>
        <div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <Plus className="w-5 h-5" />
            إضافة كوبون
          </button>
          <CouponFormDrawer 
            open={open} 
            onClose={handleClose}
            mode={editingCoupon ? "edit" : "add"}
            initialData={editingCoupon}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="بحث باسم الكوبون أو الكود..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow border">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 text-right">اسم الكوبون</th>
              <th className="p-3 text-right">كود الكوبون</th>
              <th className="p-3 text-right">نوع الخصم</th>
              <th className="p-3 text-right">قيمة الخصم</th>
              <th className="p-3 text-right">الحد الأدنى</th>
              <th className="p-3 text-right">تاريخ الانتهاء</th>
              <th className="p-3 text-right">الحالة</th>
              <th className="p-3 text-right">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-8">
                  جاري التحميل...
                </td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8">
                  لا توجد كوبونات
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-bold">{coupon.name}</td>
                  <td className="p-3 font-mono text-blue-600">{coupon.code}</td>
                  <td className="p-3">
                    {coupon.discountType === "percent" ? "نسبة مئوية" : "قيمة ثابتة"}
                  </td>
                  <td className="p-3 font-bold text-green-600">
                    {getDiscountDisplay(coupon)}
                  </td>
                  <td className="p-3">
                    {coupon.minPurchase ? `${coupon.minPurchase} جنيه` : "لا يوجد"}
                  </td>
                  <td className="p-3">
                    {new Date(coupon.expiryDate).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="p-3">
                    {getStatusBadge(coupon)}
                  </td>
                  <td className="p-3 flex gap-2">
                    <Link
                      href={`/admin/coupons/${coupon._id}`}
                      className="p-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                      title="عرض التفاصيل"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="p-2 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      title="تعديل الكوبون"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200"
                      title="حذف الكوبون"
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