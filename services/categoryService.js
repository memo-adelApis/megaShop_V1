"use server";
import axiosInstance from "../context/axiosContext";

const apiUrl = "/admin/categories";
// إنشاء تصنيف جديد
export const createCategory = async (formData) => {
  try {
    const response = await axiosInstance.post(`${apiUrl}`, formData, {
      headers: { "Content-Type": "application/json" }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error.response?.data?.error || "حدث خطأ أثناء إنشاء التصنيف";
  }
};
// الحصول على جميع التصنيفات
export const getCategories = async () => {
  try {
    const response = await axiosInstance.get(`${apiUrl}`);
    return response.data.categories || [];
  } catch (error) {
    throw error.response?.data?.error || "حدث خطأ أثناء جلب التصنيفات";
  }
};
// الحصول على تصنيف واحد
export const getCategoryById = async (id) => {
  try {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "حدث خطأ أثناء جلب التصنيف";
  }
}
// تحديث تصنيف
export const updateCategory = async (id, formData) => {
  try {
    const response = await axiosInstance.put(`/categories/${id}`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "حدث خطأ أثناء تحديث التصنيف";
  }
};
// حذف تصنيف
export const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "حدث خطأ أثناء حذف التصنيف";
  }

}
