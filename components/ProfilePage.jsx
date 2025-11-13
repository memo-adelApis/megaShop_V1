"use client";
import { useState } from "react";
import { FaEdit, FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { MdEmail, MdPerson, MdPhone } from "react-icons/md";

const mockUser = {
  name: "Ahmed Ali",
  email: "ahmed@email.com",
  phone: "01012345678",
};

const mockOrders = [
  { id: 1, title: "Order #1", status: "completed" },
  { id: 2, title: "Order #2", status: "pending" },
  { id: 3, title: "Order #3", status: "pending" },
  { id: 4, title: "Order #4", status: "completed" },
];

export default function Profile() {
  const [user, setUser] = useState(mockUser);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(user);
  const [orders, setOrders] = useState(mockOrders);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    setUser(form);
    setEditMode(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCompleteOrder = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: "completed" } : order
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex justify-center py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          My Profile
        </h2>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <MdPerson className="text-4xl text-blue-500" />
              <span className="text-xl font-semibold text-gray-700">
                {user.name}
              </span>
              <button
                className="ml-auto text-blue-500 hover:text-blue-700"
                onClick={handleEdit}
                title="Edit Profile"
              >
                <FaEdit />
              </button>
            </div>
            <div className="mb-2 flex items-center gap-2">
              <MdEmail className="text-lg text-gray-400" />
              <span>{user.email}</span>
            </div>
            <div className="mb-2 flex items-center gap-2">
              <MdPhone className="text-lg text-gray-400" />
              <span>{user.phone}</span>
            </div>
            {editMode && (
              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Name"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Email"
                />
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Phone"
                />
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded font-bold mt-2"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            )}
          </div>
          {/* Orders */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              My Orders
            </h3>
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between bg-gray-50 border rounded-lg px-4 py-3"
                >
                  <span className="font-medium">{order.title}</span>
                  <div className="flex items-center gap-2">
                    {order.status === "completed" ? (
                      <span className="flex items-center text-green-600 font-semibold">
                        <FaCheckCircle className="mr-1" /> Completed
                      </span>
                    ) : (
                      <>
                        <span className="flex items-center text-yellow-600 font-semibold">
                          <FaRegCircle className="mr-1" /> Pending
                        </span>
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          onClick={() => handleCompleteOrder(order.id)}
                        >
                          Complete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
