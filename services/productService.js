import axiosInstance from "@/context/axiosContext";
const API_URL = "/admin/products";

// إنشاء منتج جديد
export const createProduct = async (formData) => {
  try {
    const response = await axiosInstance.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "حدث خطأ أثناء إنشاء المنتج";
  }
};

// 🟢 الحصول على جميع المنتجات مع فلترة + Pagination
export const getProducts = async (filters = {}, page = 1, limit = 15) => {
  try {
    const params = new URLSearchParams({ page, limit, ...filters });
    const response = await axiosInstance.get(`${API_URL}?${params.toString()}`);
    // رجع كل البيانات (products + page + pages + total)
    return response.data;
  } catch (error) {
    throw error;
  }
};

// الحصول على منتج واحد
export const getProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "حدث خطأ أثناء جلب المنتج";
  }
};

// تحديث منتج
export const updateProduct = async (id, formData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "حدث خطأ أثناء تحديث المنتج";
  }
};

// حذف منتج
export const deleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "حدث خطأ أثناء حذف المنتج";
  }
};
