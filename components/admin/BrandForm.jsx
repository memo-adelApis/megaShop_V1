//import { createBrand } from "@/services/brandService";
import { useState } from "react";
import BrandFormDrawer from "./BrandFormDrawer";
import { useAuth } from "@/context/authContext";
import axiosInstance from "@/context/axiosContext";

const initialForm = {
  name: "",
  logo: "",
};

const BrandForm = ({ onSuccess }) => {
  const user = useAuth()

  const role = user?.role
  console.log("user role in brand form:", role)

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({
      ...prev,
      logo: file,
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData();
  formData.append("name", form.name);
  if (form.logo) formData.append("logo", form.logo);

  await axiosInstance.post("/admin/brands", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
  
    },
  });
  

  setLoading(false);
  if (onSuccess) onSuccess();
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="اسم الماركة"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        className="border rounded px-4 py-2 w-full"
      />
     

      <input
        type="file"
        accept="image/*"
        onChange={handleLogoChange}
        className="border rounded px-4 py-2 w-full"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        {loading ? "جاري الإضافة..." : "إضافة الماركة"}
      </button>
    </form>
  );
};

export default BrandForm;
