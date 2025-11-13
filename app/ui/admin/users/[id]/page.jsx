"use client";
import { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import UserFormDrawer from "@/components/admin/UserFormDrawer";

const API_URL = "/api/users";

export default function AdminUserDetails({ params }) {
  const [user, setUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/${params.id}`)
      .then((res) => res.json())
      .then(setUser);
  }, [params.id]);

  if (!user) {
    return (
      <div className="p-8 text-center text-gray-500">
        جاري تحميل بيانات المستخدم...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <button
          onClick={() => setEditOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Edit className="w-5 h-5" />
          تعديل المستخدم
        </button>
      </div>
      <div className="mb-4">
        <div className="font-semibold mb-2">البريد الإلكتروني:</div>
        <div className="text-gray-700">{user.email}</div>
      </div>
      <div className="mb-4">
        <div className="font-semibold mb-2">الصلاحية:</div>
        <div className="text-gray-700">{user.role}</div>
      </div>
      <UserFormDrawer
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        initialData={user}
      />
    </div>
  );
}
