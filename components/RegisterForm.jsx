"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerUser } from "@/services/authService";
import Spinner from "./Spenner";
import { FaUser, FaEnvelope, FaLock, FaStore } from "react-icons/fa";
import toast from "react-hot-toast";



export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSupmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!name || !email || !password) {
        toast.error("All fields are required");
      }

      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      if(name.length > 50 || email.length > 50 || password.length > 50){
        toast.error("Input values are too long");
      }

      if(name.length<5){
        toast.error("Name must be at least 5 characters");
      }
      await registerUser(name, email, password);
      toast.success("Registration successful! Please login.");
      router.push('/login');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
        <div className="flex flex-col items-center mb-6">
          <FaStore className="text-green-600 text-5xl mb-2" />
          <h1 className="text-3xl font-extrabold text-gray-800 mb-1">MegaShop</h1>
          <span className="text-gray-500 text-sm">Create your account</span>
        </div>
        <form onSubmit={handleSupmit} className="p-4 mb-5">
          <div className="relative mb-4">
            <FaUser className="absolute left-3 top-3 text-gray-400 text-lg" />
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Full Name"
              type="text"
              id="name"
              className="pl-10 w-full border p-2 border-gray-300 rounded-lg py-2 focus:outline-none focus:border-green-500 transition"
              autoComplete="name"
            />
          </div>
          <div className="relative mb-4">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400 text-lg" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Email"
              type="email"
              id="email"
              className="pl-10 w-full border border-gray-300 p-2 rounded-lg py-2 focus:outline-none focus:border-green-500 transition"
              autoComplete="email"
            />
          </div>
          <div className="relative mb-4 ">
            <FaLock className="absolute left-3 top-3 text-gray-400 text-lg" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
              type="password"
              id="password"
              className="pl-10 w-full border border-gray-300 p-2 rounded-lg py-2 focus:outline-none focus:border-green-500 transition"
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <Spinner size={8} /> : "Register"}
          </button>
          <div className="text-center mt-2">
            <Link href="/login" className="text-blue-600 hover:underline text-sm">
              Already have an account? <span className="font-semibold">Login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}