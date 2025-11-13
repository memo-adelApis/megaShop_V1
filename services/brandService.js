"use server";
import axiosInstance from "@/context/axiosContext";
const apiUrl = "/admin/brands";



// إنشاء براند جديد
export const createBrand = async (formData ) => {


  try {
    const response = await axiosInstance.post(`${apiUrl}`, formData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data?.error || "حدث خطأ أثناء إنشاء البراند";
  }
};

// الحصول على جميع البراندات مع فلترة + Pagination
export const getBrands = async (cookie) => {
  try {
    const config = {};
    if (cookie) {
      config.headers = { Cookie: cookie };
    }
    const response = await axiosInstance.get("/admin/brands", config);
    return response.data.brands || [];
  } catch (error) {
    console.log(error);
    throw error.response?.data?.error || "حدث خطأ أثناء جلب البراندات";
  }
};

// الحصول على براند واحد
export const getBrandById = async (id) => {
  try {
    const response = await axiosInstance.get(`/brands/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "حدث خطأ أثناء جلب البراند";
  }
};

// تحديث براند
export const updateBrand = async (id, formData) => {
  try {
    const response = await axiosInstance.put(`/brands/${id}`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "حدث خطأ أثناء تحديث البراند";
  }
};

// حذف براند
export const deleteBrand = async (id) => {
  try {
    const response = await axiosInstance.delete(`/brands/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "حدث خطأ أثناء حذف البراند";
  }
};
