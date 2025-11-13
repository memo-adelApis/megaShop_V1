// hooks/useOrdersLogic.js
"use client";
import { useState, useEffect } from "react";
import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus, 
  deleteOrder, // الآن موجود
  updateOrder
} from "@/services/orderService";
import { id } from "zod/v4/locales";

export const useOrdersLogic = (userId, orderId = null) => {
  console.log("useridinlogic" , userId)
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  // جلب طلب واحد
  const getOneOrder = async (id = orderId) => {
    console.log("userID in logic" ,id)
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 جلب الطلب:", id);
      
      const orderData = await getOrderById(id);
      setOrder(orderData);
      console.log("✅ تم جلب الطلب بنجاح:", orderData);
      return orderData;
    } catch (err) {
      console.error("❌ فشل في جلب الطلب:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // جلب جميع طلبات المستخدم
  const fetchOrders = async () => {
    console.log("userId" ,userId)
    if (!userId) {
      setError("معرف المستخدم مطلوب");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("🔄 جلب طلبات المستخدم:", userId);
      
      const ordersData = await getUserOrders(userId);
      setOrders(ordersData);
      console.log("✅ تم جلب الطلبات بنجاح:", ordersData.length);
    } catch (err) {
      console.error( err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // إنشاء طلب جديد
  const createNewOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 إنشاء طلب جديد:", orderData);
      
      const data = await createOrder(orderData);
      console.log("✅ تم إنشاء الطلب بنجاح:", data.order);
      
      setOrders((prev) => [data.order, ...prev]);
      return data.order;
    } catch (err) {
      console.error("❌ فشل في إنشاء الطلب:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // تحديث طلب
  const updateOrderData = async (id, updateData) => {
    try {
      setUpdating(true);
      setError(null);
      console.log("🔄 تحديث الطلب:", id, updateData);
      
      const data = await updateOrder(id, updateData);
      console.log("✅ تم تحديث الطلب بنجاح:", data.order);
      
      // تحديث الطلب في الحالة
      if (id === orderId && order) {
        setOrder(data.order);
      }
      
      // تحديث الطلب في القائمة
      setOrders(prev =>
        prev.map(item =>
          item._id === id ? data.order : item
        )
      );
      
      return data.order;
    } catch (err) {
      console.error("❌ فشل في تحديث الطلب:", err);
      setError(err.message);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  // تغيير حالة الطلب
  const changeOrderStatus = async (id, status) => {
    try {
      setUpdating(true);
      const data = await updateOrderStatus(id, status);
      
      // تحديث الحالة
      if (id === orderId && order) {
        setOrder(prev => ({ ...prev, status: data.order.status }));
      }
      
      setOrders(prev =>
        prev.map(item =>
          item._id === id ? { ...item, status: data.order.status } : item
        )
      );
      
      return data.order;
    } catch (err) {
      console.error("فشل في تحديث حالة الطلب:", err);
      setError(err.message);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  // تأكيد الطلب
  const confirmOrder = async (id) => {
    return await changeOrderStatus(id, "confirmed");
  };

  // حذف طلب
  const removeOrder = async (id) => {
    try {
      setLoading(true);
      await deleteOrder(id);
      
      setOrders((prev) => prev.filter((order) => order._id !== id));
      if (id === orderId) {
        setOrder(null);
      }
    } catch (err) {
      console.error("فشل في حذف الطلب:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // جلب الطلب تلقائياً إذا كان orderId موجود
  useEffect(() => {
    if (orderId) {
      getOneOrder(orderId);
    }
  }, [orderId]);

  // جلب الطلبات تلقائياً إذا كان userId موجود
  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const clearError = () => setError(null);

  return {
    // البيانات
    orders,
    order,
    loading,
    updating,
    error,
    
    // الدوال
    getOneOrder,
    fetchOrders,
    createOrder: createNewOrder,
    updateOrder: updateOrderData,
    changeOrderStatus,
    confirmOrder,
    removeOrder,
    clearError
  };
};