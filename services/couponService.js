// services/couponService.js
import axiosInstance from "@/context/axiosContext";

const API_URL = "/coupons";

// 🟢 التحقق من الكوبون باستخدام POST
export const validateCoupon = async (code, userId, orderTotal = 6000) => {
  console.log("Validating coupon:", { code, userId, orderTotal });
  try {
    const response = await axiosInstance.post(`${API_URL}/validate`, {
      code: code.toUpperCase().trim(),
      userId,
      orderTotal
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "فشل في التحقق من الكوبون";
  }
};

// 🟢 تطبيق الكوبون على طلب
export const applyCouponToOrder = async (orderId, code) => {
  try {
    const response = await axiosInstance.patch(`${API_URL}/apply`, { 
      orderId, 
      code: code.toUpperCase().trim()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "فشل في تطبيق الكوبون";
  }
};

// 🟢 إنشاء كوبون جديد (للمسؤول)
export const createCoupon = async (couponData) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/admin`, couponData);
    return response.data;
  } catch (error) { 
    throw error.response?.data?.error || "فشل في إنشاء الكوبون";  
  }
};

// 🟢 جلب جميع الكوبونات (للمسؤول)
export const getAllCoupons = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/admin`);
    return response.data.coupons; 
  } catch (error) {
    throw error.response?.data?.error || "فشل في جلب الكوبونات";
  } 
};