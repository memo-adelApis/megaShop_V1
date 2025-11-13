import { useState } from "react";

const initialForm = {
  name: "",
  email: "",
  role: "",
};

const UserForm = ({ onSuccess }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // هنا يمكنك استدعاء API الإضافة
    // await createUser(form);
    setLoading(false);
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="اسم المستخدم"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        className="border rounded px-4 py-2 w-full"
      />
      <input
        type="email"
        placeholder="البريد الإلكتروني"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
        className="border rounded px-4 py-2 w-full"
      />
      <input
        type="text"
        placeholder="الصلاحية"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
        required
        className="border rounded px-4 py-2 w-full"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        {loading ? "جاري الإضافة..." : "إضافة المستخدم"}
      </button>
    </form>
  );
};

export default UserForm;
