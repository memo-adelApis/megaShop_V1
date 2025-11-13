// context/CartContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { 
  addToCart as apiAddToCart, 
  updateCartItem as apiUpdateCartItem, 
  removeFromCart as apiRemoveFromCart, 
  clearCart as apiClearCart, 
  getCart as apiGetCart,
  syncCart as apiSyncCart 
} from "@/services/cartService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  console.log("userInCart" , user)

  // helper: اعادة المعرف بشكل آمن (قد يكون _id أو id أو uid)
  const getUserId = () => {
    if (!user) return null;
    return (user._id && user._id.toString && user._id.toString()) ||
           (user.id && user.id.toString && user.id.toString()) ||
           (user.uid && user.uid.toString && user.uid.toString()) ||
           null;
  };

  // جلب السلة عند التحميل
  useEffect(() => {
    loadCart();
  }, []);

  // مزامنة السلة عند تسجيل الدخول
  useEffect(() => {
    // only sync when we have a valid user id
    const uid = getUserId();
    if (user && uid) {
      syncCartWithServer();
    }
  }, [user]);

  // تحميل السلة
  const loadCart = async () => {
    const uid = getUserId();
    if (user && uid) {
      await loadServerCart();
    } else {
      loadLocalCart();
    }
  };

  // جلب السلة من localStorage
  const loadLocalCart = () => {
    try {
      const savedCart = localStorage.getItem('guest_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        // قد تكون العناصر مخزنة بأي شكل -> طبّعها
        const normalized = parsed.map(item => {
          // إذا العنصر يبدو كعنصر موحد استخدمه مباشرة وإلا طبّع من product object
          if (item._id && item.product) return {
            ...item,
            id: item.id.toString(),
            product: item.product?.toString?.() ?? item.product
          };
          return normalizeLocalItemFromProduct(item);
        });
        setCart(normalized);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error loading local cart:", error);
      setCart([]);
    }
  };

  // جلب السلة من السيرفر
  const loadServerCart = async () => {
    const uid = getUserId();
    if (!user || !uid) return;
    setLoading(true);
    try {
      const cartItems = await apiGetCart(uid);
      // apiGetCart returns array of items -> طبّعها
      const normalized = Array.isArray(cartItems) ? cartItems.map(normalizeServerItem) : [];
      setCart(normalized);
    } catch (error) {
      console.error("Error loading server cart:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  // مزامنة سلة الزائر مع السيرفر
  const syncCartWithServer = async () => {
    const uid = getUserId();
    if (!user || !uid) return;

    const guestCart = localStorage.getItem('guest_cart');
    if (!guestCart) return;

    setIsSyncing(true);
    try {
      const guestCartItems = JSON.parse(guestCart);
      // ensure payload for sync is [{ product, quantity }]
      const itemsPayload = (Array.isArray(guestCartItems) ? guestCartItems : [])
        .map(it => {
          const pId = it.product || it._id || it.productId || it.id;
          const qty = Number(it.quantity ?? it.qty ?? it.qty ?? 1);
          return pId ? { product: pId, quantity: qty } : null;
        })
        .filter(Boolean);

      if (itemsPayload.length) {
        await apiSyncCart(uid, itemsPayload);
      }
      
      // مسح سلة الزائر وتحديث السلة
      localStorage.removeItem('guest_cart');
      await loadServerCart();
      console.log("✅ تم مزامنة سلة الزائر مع حساب المستخدم");
    } catch (error) {
      console.error("Error syncing cart:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // --- helper: تطبيع عنصر سلة واحد من السيرفر أو من product object ---
  const normalizeServerItem = (item) => {
    // item.product may be Object or id
    const productObj = item.product || {};
    const productId = (productObj._id && productObj._id.toString()) || (typeof productObj === "string" && productObj) || (item.product && item.product.toString && item.product.toString()) || null;
    return {
      id: productId || item._id || `${productId || "p"}_${Math.random().toString(36).slice(2,9)}`,
      product: productId,
      name: item.name || productObj.name || "",
      price: item.price ?? productObj.price ?? productObj.priceAfterDiscount ?? 0,
      image: item.image || (productObj.images && productObj.images[0]) || productObj.image || null,
      quantity: Number(item.quantity ?? item.qty ?? 1),
      attributes: item.attributes || {},
      addedAt: item.addedAt || item.createdAt || new Date().toISOString(),
    };
  };

  // --- helper: تطبيع عنصر قبل حفظه في localStorage (من UI) ---
  const normalizeLocalItemFromProduct = (product) => {
    const productId = product.product || product._id || product.id || null;
    return {
      id: productId ? productId.toString() : `${productId || "p"}_${Math.random().toString(36).slice(2,9)}`,
      product: productId ? productId.toString() : null,
      name: product.name || "",
      price: product.price ?? product.priceAfterDiscount ?? 0,
      image: (product.images && product.images[0]) || product.image || null,
      quantity: Number(product.quantity ?? product.qty ?? 1),
      attributes: product.attributes || {},
      addedAt: product.addedAt || new Date().toISOString(),
    };
  };

  // إضافة إلى سلة localStorage
  const addToLocalCart = (product) => {
    const newItem = normalizeLocalItemFromProduct(product);

    const existingItemIndex = cart.findIndex(
      item => item.product === newItem.product
    );

    let newCart;
    if (existingItemIndex > -1) {
      newCart = cart.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + newItem.quantity }
          : item
      );
    } else {
      newCart = [...cart, newItem];
    }

    setCart(newCart);
    localStorage.setItem('guest_cart', JSON.stringify(newCart));
  };

  // الدالة الرئيسية لإضافة منتج
  const addToCart = async (product) => {
    setLoading(true);
    try {
      const uid = getUserId();
      if (user && uid) {
        await apiAddToCart(uid, product);
        await loadServerCart(); // تحديث السلة
      } else {
        addToLocalCart(product);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("حدث خطأ أثناء إضافة المنتج إلى السلة");
    } finally {
      setLoading(false);
    }
  };

  // تحديث الكمية (للزائرين)
  const updateLocalQuantity = (productId, quantity) => {
    const pid = productId?.toString();
    const newCart = cart.map(item =>
      (item.product?.toString() === pid || item.id?.toString() === pid)
        ? { ...item, quantity: Number(quantity) }
        : item
    ).filter(item => item.quantity > 0);

    setCart(newCart);
    localStorage.setItem('guest_cart', JSON.stringify(newCart));
  };

  // الدالة الرئيسية لتحديث الكمية
  const updateQuantity = async (productId, quantity) => {
    setLoading(true);
    try {
      const uid = getUserId();
      if (user && uid) {
        await apiUpdateCartItem(uid, productId, quantity);
        await loadServerCart(); // تحديث السلة
      } else {
        updateLocalQuantity(productId, quantity);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setLoading(false);
    }
  };

  // إزالة من localStorage
  const removeFromLocalCart = (productId) => {
    const pid = productId?.toString();
    const newCart = cart.filter(item => (item.product?.toString() !== pid && item.id?.toString() !== pid));
    setCart(newCart);
    localStorage.setItem('guest_cart', JSON.stringify(newCart));
  };

  // الدالة الرئيسية للإزالة (حسب المنتج) - موجودة سابقاً
  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      const uid = getUserId();
      if (user && uid) {
        await apiRemoveFromCart(uid, productId);
        await loadServerCart(); // تحديث السلة
      } else {
        removeFromLocalCart(productId);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // حذف عنصر يمكن استدعاؤه من الواجهة: يقبل إما id المحلي أو productId
  const removeItem = async (idOrProductId) => {
    // حاول إيجاد العنصر في السلة الحالية
    const id = idOrProductId?.toString?.();
    const found = cart.find(
      (it) => it.id?.toString() === id || it.product?.toString() === id
    );

    // إذا وجد العنصر واستخرج المنتج الفعلي (في حال كانت السلة محلية)
    const productId = found?.product || id;

    // استخدم الدالة الموجودة للتعامل مع السيرفر/اللوكال
    await removeFromCart(productId);
  };
  
  // تفريغ السلة
  const clearCart = async () => {
    setLoading(true);
    try {
      const uid = getUserId();
      if (user && uid) {
        await apiClearCart(uid);
        setCart([]);
      } else {
        setCart([]);
        localStorage.removeItem('guest_cart');
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // الحسابات
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 0)), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
  };

  const isInCart = (productId) => {
    return cart.some(item => item.product === productId);
  };

  const getStorageType = () => {
    return user ? 'server' : 'local';
  };

  return (
    <CartContext.Provider value={{
      cart,
      isSyncing,
      addToCart,
      updateQuantity,
      removeFromCart,
      removeItem,
      clearCart,
      getCartTotal,
      getCartItemsCount,
      isInCart,
      getStorageType,
      loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};