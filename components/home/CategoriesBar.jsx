"use client";
import { Filter } from "lucide-react";

// مكون Chip (زر صغير دائري)
const Chip = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
      active
        ? "bg-green-600 text-white border-green-600 shadow"
        : "hover:bg-gray-100 border-gray-200"
    }`}
  >
    {children}
  </button>
);

export default function CategoriesBar({
  sections = [],
  selectedSection,
  setSelectedSection,
  selectedCategory,
  setSelectedCategory,
  onFiltersClick,
}) {
  return (
    <div>
      {/* الأقسام الرئيسية */}
      <div className="flex gap-2 overflow-x-auto w-full py-2">
        {/* زر الكل */}
        <Chip
          active={!selectedSection && !selectedCategory}
          onClick={() => {
            setSelectedSection(null);
            setSelectedCategory(null);
          }}
        >
          الكل
        </Chip>

        {/* باقي الأقسام */}
        {sections.map((sec) => (
          <Chip
            key={sec._id}
            active={selectedSection === sec._id}
            onClick={() => {
              setSelectedSection(sec._id);
              setSelectedCategory(null); // تصفير الفئة عند تغيير القسم
            }}
          >
            {sec.name}
          </Chip>
        ))}

        <button
          onClick={onFiltersClick}
          className="flex-shrink-0 rounded-full border px-3 text-sm transition-all hover:bg-gray-100"
        >
          <Filter className="h-4 w-4" />
        </button>
      </div>

      {/* الفئات التابعة للقسم المختار */}
      {selectedSection && (
        <div className="flex gap-2 overflow-x-auto py-2 mt-2">
          {sections
            .find((s) => s._id === selectedSection)
            ?.categories.map((cat) => (
              <Chip
                key={cat._id}
                active={selectedCategory === cat._id}
                // 🟢 مرر id الفئة
                onClick={() => setSelectedCategory(cat._id)}
              >
                {cat.name}
              </Chip>
            ))}
        </div>
      )}
    </div>
  );
}
