import { Filter } from "lucide-react";

// تعريف التصنيفات


// مكون Chip
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

const SectionsBar = ({ sectios, setCategory, onFiltersClick }) => (
  <div className="flex gap-2 overflow-x-auto py-2">
    {CATEGORIES.map((c) => (
      <Chip
        key={c.id}
        active={category === c.id}
        onClick={() => setCategory(c.id)}
      >
        {c.label}
      </Chip>
    ))}
    <button
      onClick={onFiltersClick}
      className="flex-shrink-0 rounded-full border px-3 text-sm transition-all hover:bg-gray-100"
    >
      <Filter className="h-4 w-4" />
    </button>
  </div>
);

export default CategoriesBar;
