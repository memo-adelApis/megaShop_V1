"use client";

import { useState, useTransition } from "react";
import { forgetPassword ,verifyCode, resetPassword } from "@/app/actions/authAcions";

export default function ForgetPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [result, setResult] = useState(null);
  const [pending, startTransition] = useTransition();

  async function handleForget(e) {
    e.preventDefault();
    startTransition(async () => {
      const res = await forgetPassword(email);
      setResult(res);
      if (res.success) setStep(2);
    });
  }

  async function handleVerify(e) {
    e.preventDefault();
    startTransition(async () => {
      console.log(email ,code)

      const res = await verifyCode(email, code);
      setResult(res);
      if (res.success) setStep(3);
    });
  }

  async function handleReset(e) {
    e.preventDefault();
    startTransition(async () => {
      const res = await resetPassword(email, code, newPassword);
      setResult(res);
      if (res.success) setStep(4);
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          {step === 1 && "نسيت كلمة المرور"}
          {step === 2 && "أدخل رمز التحقق"}
          {step === 3 && "أدخل كلمة مرور جديدة"}
          {step === 4 && "تم التغيير بنجاح 🎉"}
        </h1>

        {result && (
          <div
            className={`p-3 rounded text-sm font-medium ${
              result.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {result.message}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleForget} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              required
              className="w-full border p-3 rounded-lg"
            />
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
            >
              {pending ? "جارٍ الإرسال..." : "إرسال رمز التحقق"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerify} className="space-y-3">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="رمز التحقق"
              required
              className="w-full border p-3 rounded-lg tracking-[0.5em] text-center"
            />
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold"
            >
              {pending ? "جارٍ التحقق..." : "تحقق"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleReset} className="space-y-3">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="كلمة مرور جديدة"
              required
              className="w-full border p-3 rounded-lg"
            />
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold"
            >
              {pending ? "جارٍ التحديث..." : "تغيير كلمة المرور"}
            </button>
          </form>
        )}

        {step === 4 && (
          <div className="text-center">
            <p className="text-green-700 font-medium">
              تم تغيير كلمة المرور بنجاح 🎉
            </p>
            <a
              href="/login"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              تسجيل الدخول
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
