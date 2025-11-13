"use client";
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: BASE_URL + "/api",
  timeout: 15000, // 15 ثانية
  maxContentLength: 5 * 1024 * 1024, // 5MB للـ response
  maxBodyLength: 5 * 1024 * 1024,    // 5MB للـ request
});

// ✅ Interceptors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      toast?.error("⏱ انتهى وقت الاتصال بالخادم");
    } else if (error.response?.status === 413) {
      toast?.error("📦 حجم البيانات كبير جدًا (تجاوز 5MB)");
    } else {
      toast?.error("⚠ حدث خطأ في الاتصال بالخادم");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
