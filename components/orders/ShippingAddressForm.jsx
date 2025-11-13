// components/ShippingAddressForm.js
"use client";
import { useState, useEffect } from "react";

export default function ShippingAddressForm({ user, initialAddress, onAddressSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "القاهرة",
    district: "",
    additionalNotes: ""
  });

  // مدن مصر
  const egyptianCities = [
    "القاهرة",
    "الجيزة",
    "الإسكندرية",
    "الدقهلية",
    "البحر الأحمر",
    "البحيرة",
    "الفيوم",
    "الغربية",
    "الإسماعيلية",
    "المنوفية",
    "المنيا",
    "القليوبية",
    "الوادي الجديد",
    "السويس",
    "أسوان",
    "أسيوط",
    "بني سويف",
    "بورسعيد",
    "دمياط",
    "الشرقية",
    "جنوب سيناء",
    "كفر الشيخ",
    "مطروح",
    "الأقصر",
    "قنا",
    "شمال سيناء",
    "سوهاج"
  ];

  useEffect(() => {
    if (initialAddress) {
      setFormData(prev => ({
        ...prev,
        ...initialAddress
      }));
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user?.name || "",
        phone: user.user?.phone || "",
        address: user.user?.address || "",
        city: user.user?.city || "القاهرة"
      }));
    }
  }, [initialAddress, user]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddressSubmit(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <h3 className="text-xl font-bold mb-4">عنوان الشحن</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">الاسم بالكامل *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              disabled={loading}
              placeholder="أدخل اسمك بالكامل"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">رقم الجوال *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              disabled={loading}
              placeholder="01XXXXXXXXX"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">المحافظة *</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            disabled={loading}
          >
            {egyptianCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">الحي / المنطقة</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            disabled={loading}
            placeholder="اسم الحي أو المنطقة"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">العنوان التفصيلي *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows="3"
            className="w-full border rounded px-3 py-2"
            disabled={loading}
            placeholder="اسم الشارع، رقم العمارة، الشقة، الدور..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ملاحظات إضافية</label>
          <textarea
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            rows="2"
            className="w-full border rounded px-3 py-2"
            disabled={loading}
            placeholder="أي تعليمات خاصة للتوصيل أو تفاصيل عن العنوان..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              جاري الحفظ...
            </>
          ) : (
            'متابعة إلى موعد التوصيل'
          )}
        </button>
      </form>
    </div>
  );
}