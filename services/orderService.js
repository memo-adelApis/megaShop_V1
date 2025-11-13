// services/orderService.js
import axiosInstance from "@/context/axiosContext";

const API_URL = "/orders";

// إنشاء طلب جديد
export const createOrder = async (orderData) => {
  try {
    console.log("🚀 إرسال طلب إنشاء الطلب:", orderData);
    
    const response = await axiosInstance.post(API_URL, orderData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log("✅ استجابة إنشاء الطلب:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ خطأ في إنشاء الطلب:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("فشل في إنشاء الطلب");
    }
  }
};

// جلب طلبات المستخدم
export const getUserOrders = async (id) => {
  try {
    console.log("🔍 جلب طلبات المستخدم:", id);
    
    const response = await axiosInstance.get(`${API_URL}/user/${id}`);
    
    console.log("✅ استجابة جلب الطلبات:", response.data);
    
    return response.data.orders;
  } catch (error) {
    console.error("❌ خطأ في جلب الطلبات:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("فشل في جلب الطلبات");
    }
  }
};

// جلب طلب محدد
export const getOrderById = async (orderId) => {
  try {
    console.log("🔍 جلب الطلب:", orderId);
    
    const response = await axiosInstance.get(`${API_URL}/${orderId}`);
    
    console.log("✅ استجابة جلب الطلب:", response.data);
    return response.data.order;
  } catch (error) {
    console.error("❌ خطأ في جلب الطلب:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("فشل في جلب الطلب");
    }
  }
};

// تحديث طلب
export const updateOrder = async (orderId, updateData) => {
  try {
    console.log("🔄 تحديث الطلب:", orderId, updateData);
    
    const response = await axiosInstance.patch(`${API_URL}/${orderId}`, updateData);
    
    console.log("✅ استجابة تحديث الطلب:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ خطأ في تحديث الطلب:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("فشل في تحديث الطلب");
    }
  }
};

// تحديث حالة الطلب
export const updateOrderStatus = async (orderId, status) => {
  try {
    console.log("🔄 تحديث حالة الطلب:", orderId, status);
    
    const response = await axiosInstance.patch(`${API_URL}/${orderId}`, { status });
    
    console.log("✅ استجابة تحديث الحالة:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ خطأ في تحديث حالة الطلب:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("فشل في تحديث حالة الطلب");
    }
  }
};

// حذف طلب - إضافة هذه الدالة المفقودة
export const deleteOrder = async (orderId) => {
  try {
    console.log("🗑️ حذف الطلب:", orderId);
    
    const response = await axiosInstance.delete(`${API_URL}/${orderId}`);
    
    console.log("✅ استجابة حذف الطلب:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ خطأ في حذف الطلب:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("فشل في حذف الطلب");
    }
  }
};