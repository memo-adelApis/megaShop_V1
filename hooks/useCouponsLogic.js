// hooks/useCouponsLogic.js
"use client";
import { useState } from "react";
import { validateCoupon, applyCouponToOrder } from "@/services/couponService";

export const useCouponsLogic = () => {
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkCoupon = async (code, userId, orderTotal = 0) => {
    console.log("Checking coupon:", { code, userId, orderTotal });
    
    // إعادة تعيين الحالة
    setError(null);
    setCoupon(null);
    
    try {
      setLoading(true);
      
      // التحقق من البيانات المدخلة
      if (!code || !code.trim()) {
        throw new Error("يرجى إدخال كود الكوبون");
      }

      const data = await validateCoupon(code.trim(), userId, orderTotal);
      
      if (data.success) {
        setCoupon(data.coupon);
        setError(null);
        return {
          success: true,
          coupon: data.coupon,
          discountAmount: data.discountAmount,
          finalPrice: data.finalPrice,
          message: data.message
        };
      } else {
        setError(data.error);
        return {
          success: false,
          error: data.error
        };
      }
    } catch (err) {
      const errorMessage = err.message || "فشل في التحقق من الكوبون";
      setError(errorMessage);
      console.error("فشل في التحقق من الكوبون:", err);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async (orderId, code) => {
    setError(null);
    
    try {
      setLoading(true);
      
      if (!orderId || !code) {
        throw new Error("بيانات الطلب والكوبون مطلوبة");
      }

      const data = await applyCouponToOrder(orderId, code);
      
      if (data.success) {
        setError(null);
        return {
          success: true,
          order: data.order,
          coupon: data.coupon,
          message: data.message
        };
      } else {
        setError(data.error);
        return {
          success: false,
          error: data.error
        };
      }
    } catch (err) {
      const errorMessage = err.message || "فشل في تطبيق الكوبون";
      setError(errorMessage);
      console.error("فشل في تطبيق الكوبون:", err);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    coupon,
    loading,
    error,
    checkCoupon,
    applyCoupon,
    removeCoupon,
    clearError
  };
};