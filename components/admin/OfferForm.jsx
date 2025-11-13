import { useState } from "react";

const initialForm = {
  title: "",
  description: "",
  image: "",
};

const OfferForm = ({ onSuccess }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // هنا يمكنك استدعاء API الإضافة
    // await createOffer(form);
    setLoading(false);
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="عنوان العرض"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
        className="border rounded px-4 py-2 w-full"
      />
      <textarea
        placeholder="وصف العرض"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
        className="border rounded px-4 py-2 w-full"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="border rounded px-4 py-2 w-full"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        {loading ? "جاري الإضافة..." : "إضافة العرض"}
      </button>
    </form>
  );
};

export default OfferForm;
