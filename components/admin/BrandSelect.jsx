import axiosInstance from "@/context/axiosContext";
import { useEffect, useState } from "react";


const BrandSelect = ({ value, onChange }) => {
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await axiosInstance.get("/admin/brands").then(res => res.data.brands);
        setBrands(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("خطأ في جلب الماركات:", err);
        setBrands([]);
      }
    };

    fetchBrands();
  }, []);

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div>
      <label className="block mb-1 font-medium">ماركة المنتج</label>
      <div className="flex gap-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="border rounded px-4 py-2 w-full"
        >
          {filteredBrands.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
       
        <input
          type="text"
          placeholder="بحث..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-2 py-2 w-32"
        />
      </div>
    </div>
  );
};

export default BrandSelect;
