"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/context/axiosContext";

const initialForm = {
  name: "",
  description: "",
  section: "", // القسم الرئيسي المرتبط بالفئة
};

const CategoryForm = ({ onSuccess }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [showNewSection, setShowNewSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  // 🟢 تحميل الأقسام
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await axiosInstance.get("/admin/sections");
        setSections(res.data.sections || []);
      } catch (error) {
        console.error("فشل في جلب الأقسام:", error);
      }
    };
    fetchSections();
  }, []);

  // 🟢 إضافة قسم جديد
  const handleAddSection = async () => {
    if (!newSectionName.trim()) return;
    try {
      const res = await axiosInstance.post("/admin/sections", {
        name: newSectionName,
      });
      setSections((prev) => [...prev, res.data.section]); // أضف القسم الجديد
      setForm({ ...form, section: res.data.section._id }); // عين القسم الجديد
      setNewSectionName("");
      setShowNewSection(false); // أخفي الفورم بعد الحفظ
    } catch (error) {
      console.error("فشل في إضافة القسم:", error);
    }
  };

  // 🟢 إضافة التصنيف
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axiosInstance.post(`/admin/categories`, form);
    setLoading(false);
    if (onSuccess) onSuccess();
    setForm(initialForm);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* اختيار القسم الرئيسي */}
      <div>
        <label className="block mb-1 font-medium">القسم الرئيسي</label>
        <div className="flex gap-2">
          <select
            value={form.section}
            onChange={(e) => setForm({ ...form, section: e.target.value })}
            required
            className="border rounded px-4 py-2 w-full"
          >
            <option value="">اختر قسم</option>
            {sections.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowNewSection(!showNewSection)}
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
          >
            {showNewSection ? "إلغاء" : "إضافة جزء"}
          </button>
        </div>
      </div>

      {/* فورم إضافة جزء جديد */}
      {showNewSection && (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="اسم الجزء الجديد"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            className="border rounded px-4 py-2 w-full"
          />
          <button
            type="button"
            onClick={handleAddSection}
            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
          >
            حفظ
          </button>
        </div>
      )}

      {/* اسم التصنيف */}
      <input
        type="text"
        placeholder="اسم التصنيف"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        className="border rounded px-4 py-2 w-full"
      />

      {/* وصف التصنيف */}
      <textarea
        placeholder="وصف التصنيف"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
        className="border rounded px-4 py-2 w-full"
      />

      {/* زر الإضافة */}
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        {loading ? "جاري الإضافة..." : "إضافة التصنيف"}
      </button>
    </form>
  );
};

export default CategoryForm;
