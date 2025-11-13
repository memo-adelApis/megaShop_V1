"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaEye, FaEyeSlash, FaGoogle, FaGithub, FaLock } from "react-icons/fa";
import { MdEmail, MdStorefront } from "react-icons/md";
import { BarLoader } from "react-spinners";
import { z } from "zod";
import toast from "react-hot-toast";
import Link from "next/link";


const loginSchema = z.object({
  email: z.string().email("📧 Please enter a valid email"),
  password: z.string().min(6, "🔑 Password must be at least 6 characters"),
});

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // ✅ تحقق من صحة البيانات باستخدام zod
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      result.error.errors.forEach((err) => toast.error(err.message));
      setIsLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res.error) {
        toast.error("❌ " + res.error);
      } else {
        toast.success("✅ Welcome back!");
        router.push("/");
      }
    } catch (err) {
      toast.error("⚠️ Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
        <div className="flex flex-col items-center mb-4">
          <MdStorefront className="text-6xl text-green-600 mb-2 drop-shadow-lg" />
          <h1 className="text-4xl font-black text-gray-800 mb-1 tracking-tight">
            ShopMaster
          </h1>
          <span className="text-gray-500 text-base">
            Sign in to your account to start shopping
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <div className="flex items-center border-2 border-blue-200 rounded-xl px-4 py-3 bg-blue-50">
              <MdEmail className="text-2xl text-blue-400 mr-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none text-lg"
                placeholder="you@email.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <div className="flex items-center border-2 border-blue-200 rounded-xl px-4 py-3 bg-blue-50">
              <FaLock className="text-2xl text-blue-400 mr-3" />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-lg"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="ml-2 text-blue-400"
                onClick={() => setShowPass((v) => !v)}
                tabIndex={-1}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-blue-600 text-white font-bold py-3 rounded-xl text-lg shadow transition"
            disabled={isLoading}
          >
            {isLoading ? (
              <BarLoader color="#fff" height={5} width={100} />
            ) : (
              "Login"
            )}
          </button>

          {/* Socials */}
          <div className="flex items-center justify-center gap-6 mt-2">
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition font-semibold"
              onClick={() => signIn("google")}
            >
              <FaGoogle className="text-red-500 text-xl" /> Google
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition font-semibold"
              onClick={() => signIn("github")}
            >
              <FaGithub className="text-gray-700 text-xl" /> Github
            </button>
          </div>

          {/* Register */}
          <div className="text-center mt-6 text-base text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 font-bold underline">
              Register
            </Link>
            {" | "}
                 <Link href="/ui/auth/fogetPassword" className="text-blue-600 font-bold underline">
              forget Password
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
