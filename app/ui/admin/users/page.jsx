"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Trash2, Plus } from "lucide-react";
import UserFormDrawer from "@/components/admin/UserFormDrawer";

const API_URL = "/api/users";

// بيانات وهمية للمستخدمين
const DUMMY_USERS = [
  { _id: "1", name: "أحمد محمد", email: "ahmed@test.com", role: "admin" },
  { _id: "2", name: "سارة علي", email: "sara@test.com", role: "user" },
];

export default function AdminUsersTable() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (role) params.append("role", role);
    try {
      const res = await fetch(`${API_URL}?${params.toString()}`);
      const data = await res.json();
      setUsers(data && data.length > 0 ? data : DUMMY_USERS);
    } catch {
      setUsers(DUMMY_USERS);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [search, role]);

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف المستخدم؟")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">المستخدمون</h2>
        <div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <Plus className="w-5 h-5" />
            إضافة مستخدم
          </button>
          <UserFormDrawer open={open} onClose={() => setOpen(false)} />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="بحث بالاسم أو البريد..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
        <input
          type="text"
          placeholder="بحث بالصلاحية..."
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded px-3 py-2 w-64"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow border">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 text-right">الاسم</th>
              <th className="p-3 text-right">البريد</th>
              <th className="p-3 text-right">الصلاحية</th>
              <th className="p-3 text-right">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-8">
                  جاري التحميل...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8">
                  لا يوجد مستخدمون
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-bold">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3 flex gap-2">
                    <Link
                      href={`/ui/admin/users/${user._id}`}
                      className="p-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                      title="عرض التفاصيل"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200"
                      title="حذف المستخدم"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
