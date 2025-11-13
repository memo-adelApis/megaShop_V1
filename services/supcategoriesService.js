import axios from "axios";

const API_URL = `${process.env.BASE_URL}/supcategories`;
console.log(API_URL);

// Get all supcategories
export const getAllSupcategories = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get a supcategory by ID
export const getSupcategoryById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Add a new supcategory
export const addSupcategory = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("السرفس", formData);

    return response.data;
  } catch (error) {
      console.log(error);
    throw error.response?.data?.error || "حدث خطأ أثناء إنشاء المنتج";
  }
};
// Update an existing supcategory
export const updateSupcategory = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedData);
  return response.data;
};

// Delete a supcategory by ID
export const deleteSupcategory = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
