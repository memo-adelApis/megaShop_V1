export default function FiltersDrawer({
  showFilters,
  setShowFilters,
  sections,
  selectedSection,
  setSelectedSection,
  selectedCategory,
  setSelectedCategory,
  sort,
  setSort,
  brands
}) {
  if (!showFilters) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end">
      <div className="w-80 bg-white p-4 shadow-lg overflow-y-auto">
        <h3 className="font-bold mb-4">تصفية</h3>

        {/* الفئات */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2">الأقسام</h4>
          <button
            className={`block px-2 py-1 rounded ${!selectedSection ? "bg-green-100" : ""}`}
            onClick={() => {
              setSelectedSection(null);
              setSelectedCategory(null);
            }}
          >
            الكل
          </button>
          {sections.map((s) => (
            <div key={s._id}>
              <button
                className={`block px-2 py-1 rounded ${selectedSection === s._id ? "bg-green-100" : ""}`}
                onClick={() => {
                  setSelectedSection(s._id);
                  setSelectedCategory(null);
                }}
              >
                {s.name}
              </button>
              {selectedSection === s._id && s.categories?.length > 0 && (
                <div className="pl-4 mt-1 space-y-1">
                  <button
                    className={`block px-2 py-1 rounded ${!selectedCategory ? "bg-green-50" : ""}`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    كل {s.name}
                  </button>
                  {s.categories.map((c) => (
                    <button
                      key={c._id}
                      className={`block px-2 py-1 rounded ${selectedCategory === c._id ? "bg-green-200" : ""}`}
                      onClick={() => setSelectedCategory(c._id)}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ترتيب */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2">الترتيب</h4>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="popular">الأكثر شيوعًا</option>
            <option value="price-asc">السعر: من الأقل للأعلى</option>
            <option value="price-desc">السعر: من الأعلى للأقل</option>
            <option value="rating">الأعلى تقييمًا</option>
          </select>
        </div>
      </div>
    </div>
  );
}
