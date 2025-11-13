// app/forget-password/ForgetPasswordClient.jsx
"use client";

import { useState } from "react";

export default function ForgetPasswordClient() {
  const [step, setStep] = useState(1); // 1=email, 2=verify code, 3=reset password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const postJson = async (url, body) => {
    setError(null);
    setMessage(null);
    try {
      setLoading(true);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setLoading(false);
      return { ok: res.ok, data };
    } catch (err) {
      setLoading(false);
      return { ok: false, data: { message: err.message } };
    }
  };

  const handleSendCode = async (e) => {
    e?.preventDefault();
    const { ok, data } = await postJson("/api/auth/forget", { email });
    if (!ok) {
      setError(data.message || "حدث خطأ");
      return;
    }
    setMessage(data.message || "تم الإرسال");
    setStep(2);
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    const { ok, data } = await postJson("/api/auth/verify", { email, code });
    if (!ok) {
      setError(data.message || "رمز غير صالح");
      return;
    }
    setMessage(data.message || "رمز صحيح");
    setStep(3);
  };

  const handleReset = async (e) => {
    e?.preventDefault();
    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    if (password !== confirm) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    const { ok, data } = await postJson("/api/auth/reset", {
      email,
      code,
      newPassword: password,
    });
    if (!ok) {
      setError(data.message || "حدث خطأ");
      return;
    }
    setMessage(data.message || "تم تغيير كلمة المرور");
    setStep(1);
    setEmail("");
    setCode("");
    setPassword("");
    setConfirm("");
  };

  return (
    <div>
      <div className="mb-4">
        {message && <div className="p-2 mb-2 bg-green-100 text-green-800 rounded">{message}</div>}
        {error && <div className="p-2 mb-2 bg-red-100 text-red-800 rounded">{error}</div>}
      </div>

      {step === 1 && (
        <form onSubmit={handleSendCode} className="space-y-4">
          <label className="block text-sm font-medium">البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded p-2"
            placeholder="you@example.com"
          />
          <div className="flex gap-2">
            <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
              {loading ? "جاري الإرسال..." : "إرسال رمز التحقق"}
            </button>
            <button type="button" onClick={() => { setEmail(""); setError(null); setMessage(null); }} className="px-4 py-2 border rounded">
              مسح
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerify} className="space-y-4">
          <label className="block text-sm font-medium">أدخل رمز التحقق (6 أرقام)</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full border rounded p-2"
            placeholder="123456"
            maxLength={6}
          />
          <div className="flex gap-2">
            <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
              {loading ? "جاري التحقق..." : "تحقق"}
            </button>
            <button type="button" onClick={() => setStep(1)} className="px-4 py-2 border rounded">
              رجوع
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleReset} className="space-y-4">
          <label className="block text-sm font-medium">كلمة المرور الجديدة</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded p-2"
            placeholder="كلمة المرور"
          />
          <label className="block text-sm font-medium">تأكيد كلمة المرور</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full border rounded p-2"
            placeholder="تأكيد"
          />
          <div className="flex gap-2">
            <button disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
              {loading ? "جاري التحديث..." : "تغيير كلمة المرور"}
            </button>
            <button type="button" onClick={() => setStep(2)} className="px-4 py-2 border rounded">
              رجوع
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
