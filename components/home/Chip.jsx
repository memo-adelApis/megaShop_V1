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

export default Chip;
