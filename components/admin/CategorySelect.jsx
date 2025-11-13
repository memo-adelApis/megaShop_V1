"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/context/axiosContext";

const CategorySelect = ({ value, onChange }) => {
  const [sections, setSections] = useState([]); // الأقسام الرئيسية
  const [categories, setCategories] = useState([]); // الفئات التابعة للقسم
  const [selectedSection, setSelectedSection] = useState(""); // القسم المختار
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const data = await axiosInstance
          .get("/sections") // 🟢 API يرجع الأقسام مع الفئات
          .then((res) => res.data.sections);

        setSections(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("فشل في جلب الأقسام:", error);
      }
    };
    fetchSections();
  }, []);

  // لما يختار القسم يحدث الفئات
  useEffect(() => {
    if (selectedSection) {
      const section = sections.find((s) => s._id === selectedSection);
      setCategories(section ? section.categories : []);
    } else {
      setCategories([]); // لو ما اختارش قسم
    }
  }, [selectedSection, sections]);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ دالة محسنة لتغيير الفئة
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    
    if (categoryId) {
      const selectedCategory = categories.find(c => c._id === categoryId);
      // ✅ نرسل sectionId فقط إذا كانت موجودة، وإلا نرسل null
      const sectionId = selectedCategory?.section?._id || selectedSection || null;
      onChange(categoryId, sectionId);
    } else {
      // ✅ إذا لم يتم اختيار فئة، نرسل قيم فارغة
      onChange("", null);
    }
  };

  // ✅ دالة محسنة لتغيير القسم
  const handleSectionChange = (e) => {
    const sectionId = e.target.value;
    setSelectedSection(sectionId);
    
    // ✅ إذا تم تغيير القسم، نعيد تعيين الفئة
    if (sectionId) {
      // ننتظر حتى يتم تحديث categories ثم نختار أول فئة تلقائياً إذا أردت
      // أو نترك المستخدم يختار يدوياً
    } else {
      // ✅ إذا لم يتم اختيار قسم، نرسل قيم فارغة
      onChange("", null);
      setCategories([]);
    }
  };

  return (
    <div>
      {/* اختيار القسم */}
      <label className="block mb-1 font-medium">القسم الرئيسي</label>
      <select
        value={selectedSection}
        onChange={handleSectionChange}
        className="border rounded px-4 py-2 w-full mb-3"
      >
        <option value="">اختر قسم</option>
        {sections.map((s) => (
          <option key={s._id} value={s._id}>
            {s.name}
          </option>
        ))}
      </select>

      {/* اختيار الفئة */}
      <label className="block mb-1 font-medium">فئة المنتج</label>
      <div className="flex gap-2">
        <select
          value={value}
          onChange={handleCategoryChange}
          required
          className="border rounded px-4 py-2 w-full"
          disabled={!selectedSection} // ✅ تعطيل إذا لم يتم اختيار قسم
        >
          <option value="">اختر فئة</option>
          {filteredCategories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        
        {/* مربع البحث */}
        <input
          type="text"
          placeholder="بحث..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-2 py-2 w-32"
          disabled={!selectedSection}
        />
      </div>
      
      {/* ✅ عرض معلومات التتبع (للتdebug) */}
      <div className="mt-2 text-xs text-gray-500">
        <div>القسم المختار: {selectedSection || "لم يتم الاختيار"}</div>
        <div>الفئة المختارة: {value || "لم يتم الاختيار"}</div>
      </div>
    </div>
  );
};

export default CategorySelect;