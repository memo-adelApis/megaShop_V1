import axiosInstance from "@/context/axiosContext";

const API_URL = "/users";

// helper to normalize product payloads
const normalizeProductPayload = (productData) => {
  if (!productData) return {};
  // productData may be { productId, quantity } or { product, quantity } or full product object
  const productId =
    productData.productId ||
    productData.product ||
    productData._id ||
    productData.id;
  const quantity = productData.quantity ?? productData.qty ?? 1;
  return { productId, quantity };
};

// إضافة منتج إلى السلة
export const addToCart = async (userId, productData) => {
  try {
    const { productId, quantity } = normalizeProductPayload(productData);
    if (!productId) throw new Error("productId مطلوب");

    const response = await axiosInstance.post(
      `${API_URL}/${userId}/cart`,
      { productId, quantity }
    );

    return response.data;
  } catch (error) {
    console.error("addToCart error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(error.response?.data?.error || "فشل في إضافة المنتج إلى السلة");
  }
};

// تحديث كمية المنتج في السلة
export const updateCartItem = async (userId, productId, quantity) => {
  try {
    if (!productId) throw new Error("productId مطلوب");
    if (typeof quantity !== "number") throw new Error("quantity رقم مطلوب");

    const response = await axiosInstance.put(`${API_URL}/${userId}/cart`, {
      productId,
      quantity,
    });

    return response.data;
  } catch (error) {
    console.error("updateCartItem error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "فشل في تحديث كمية المنتج");
  }
};

// إزالة منتج من السلة
export const removeFromCart = async (userId, productId) => {
  try {
    if (!productId) throw new Error("productId مطلوب");

    // axios.delete supports sending body via `data`
    const response = await axiosInstance.delete(`${API_URL}/${userId}/cart`, {
      data: { productId },
    });

    return response.data;
  } catch (error) {
    console.error("removeFromCart error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "فشل في إزالة المنتج من السلة");
  }
};

// تفريغ السلة
export const clearCart = async (userId) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${userId}/cart`, {
      data: { clearAll: true },
    });

    return response.data;
  } catch (error) {
    console.error("clearCart error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "فشل في تفريغ السلة");
  }
};

// جلب سلة المستخدم
export const getCart = async (userId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${userId}/cart`);
    // the route returns an array of items (not wrapped), so return response.data directly
    return response.data;
  } catch (error) {
    console.error("getCart error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "فشل في جلب سلة المستخدم");
  }
};

// مزامنة سلة الزائر مع السيرفر
export const syncCart = async (userId, guestItems) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/${userId}/cart/sync`, {
      items: Array.isArray(guestItems) ? guestItems : [],
    });

    return response.data;
  } catch (error) {
    console.error("syncCart error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "فشل في مزامنة السلة");
  }
};