// components/admin/CouponForm.js
import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import axiosInstance from "@/context/axiosContext";

const initialForm = {
  name: "",
  code: "",
  discountType: "percent",
  discountValue: "",
  discountPercent: "",
  minPurchase: "",
  expiryDate: "",
  usageLimit: 1,
  active: true,
};

const CouponForm = ({ onSuccess, mode = "add", initialData }) => {
  const user = useAuth();
  const role = user?.role;
  
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // تعبئة البيانات في وضع التعديل
  useEffect(() => {
    if (mode === "edit" && initialData) {
      const expiryDate = new Date(initialData.expiryDate);
      const localExpiryDate = expiryDate.toISOString().slice(0, 16);
      
      setForm({
        name: initialData.name || "",
        code: initialData.code || "",
        discountType: initialData.discountType || "percent",
        discountValue: initialData.discountValue || "",
        discountPercent: initialData.discountPercent || initialData.discountValue || "",
        minPurchase: initialData.minPurchase || "",
        expiryDate: localExpiryDate,
        usageLimit: initialData.usageLimit || 1,
        active: initialData.active !== undefined ? initialData.active : true,
      });
    } else {
      setForm(initialForm);
    }
  }, [mode, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // تحضير البيانات للإرسال
      const formData = {
        name: form.name,
        code: form.code,
        discountType: form.discountType,
        minPurchase: form.minPurchase ? Number(form.minPurchase) : 0,
        expiryDate: form.expiryDate,
        usageLimit: Number(form.usageLimit),
        active: form.active,
      };

      // إضافة القيمة المناسبة بناءً على نوع الخصم
      if (form.discountType === "percent") {
        formData.discountPercent = Number(form.discountPercent);
        formData.discountValue = Number(form.discountPercent);
      } else {
        formData.discountValue = Number(form.discountValue);
      }

      if (mode === "add") {
        await axiosInstance.post("/admin/coupons", formData);
      } else if (mode === "edit") {
        await axiosInstance.put(`/admin/coupons/${initialData._id}`, formData);
      }

      setLoading(false);
      setForm(initialForm);
      if (onSuccess) onSuccess();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || `حدث خطأ أثناء ${mode === "add" ? "إنشاء" : "تعديل"} الكوبون`);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">اسم الكوبون *</label>
        <input
          type="text"
          name="name"
          placeholder="اسم الكوبون"
          value={form.name}
          onChange={handleChange}
          required
          className="border rounded px-4 py-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">كود الكوبون *</label>
        <input
          type="text"
          name="code"
          placeholder="كود الكوبون"
          value={form.code}
          onChange={handleChange}
          required
          disabled={mode === "edit"}
          className="border rounded px-4 py-2 w-full uppercase disabled:bg-gray-100"
        />
        <p className="text-xs text-gray-500 mt-1">سيتم تحويل الكود إلى أحرف كبيرة تلقائياً</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">نوع الخصم *</label>
        <select
          name="discountType"
          value={form.discountType}
          onChange={handleChange}
          className="border rounded px-4 py-2 w-full"
        >
          <option value="percent">نسبة مئوية %</option>
          <option value="fixed">قيمة ثابتة</option>
        </select>
      </div>

      {form.discountType === "percent" ? (
        <div>
          <label className="block text-sm font-medium mb-1">نسبة الخصم % *</label>
          <input
            type="number"
            name="discountPercent"
            placeholder="نسبة الخصم"
            min="1"
            max="100"
            value={form.discountPercent}
            onChange={handleChange}
            required
            className="border rounded px-4 py-2 w-full"
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium mb-1">قيمة الخصم *</label>
          <input
            type="number"
            name="discountValue"
            placeholder="قيمة الخصم"
            min="1"
            value={form.discountValue}
            onChange={handleChange}
            required
            className="border rounded px-4 py-2 w-full"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">الحد الأدنى للسعر</label>
        <input
          type="number"
          name="minPurchase"
          placeholder="الحد الأدنى للسعر"
          min="0"
          value={form.minPurchase}
          onChange={handleChange}
          className="border rounded px-4 py-2 w-full"
        />
        <p className="text-xs text-gray-500 mt-1">اتركه 0 إذا لم يكن هناك حد أدنى</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">تاريخ الانتهاء *</label>
        <input
          type="datetime-local"
          name="expiryDate"
          value={form.expiryDate}
          onChange={handleChange}
          required
          className="border rounded px-4 py-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">الحد الأقصى للاستخدام *</label>
        <input
          type="number"
          name="usageLimit"
          placeholder="الحد الأقصى للاستخدام"
          min="1"
          value={form.usageLimit}
          onChange={handleChange}
          required
          className="border rounded px-4 py-2 w-full"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="active"
          id="active"
          checked={form.active}
          onChange={handleChange}
          className="w-4 h-4"
        />
        <label htmlFor="active" className="text-sm font-medium">
          كوبون مفعل
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full disabled:bg-gray-400"
      >
        {loading 
          ? `جاري ${mode === "add" ? "إنشاء" : "تعديل"} الكوبون...` 
          : `${mode === "add" ? "إنشاء" : "تعديل"} الكوبون`}
      </button>
    </form>
  );
};

export default CouponForm;