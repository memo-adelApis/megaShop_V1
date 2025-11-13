import axiosInstance from "@/context/axiosContext";
import { useEffect, useState } from "react";

// دالة لجلب المنتج بالـ id
export async function getProductById(id) {
  try {
    const res = await axiosInstance.get(`/products/${id}`);
    console.log("🔍 جلب المنتج:", id);
    return res.data || null; // ✅ API بيرجع المنتج نفسه مش داخل product
  } catch (error) {
    console.error("❌ خطأ أثناء جلب بيانات المنتج:", error);
    return null;
  }
}

// hook لإدارة منطق المنتج

