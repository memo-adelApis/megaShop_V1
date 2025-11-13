"use client";

import React, { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react"; // ✅
import { AuthProvider } from "@/context/authContext";
import AppToaster from "@/components/Toaster";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { CartProvider, useCart } from "@/context/CartContext";
import Navbar from "@/components/home/Navbar";
import CartDrawer from "@/components/home/CartDrawer";

export default function ProvidersWrapper({ children }) {
  // واجهة تحكم عامة للـ layout (يمكن تمريرها للمكونات)
  const [showCart, setShowCart] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("");
  

  // استخدم مكوّن داخلي لقراءة عداد السلة من الـ Context بعد وضع CartProvider
  function NavbarWithCart() {
    const { getCartItemsCount } = useCart();
    const cartCount =
      typeof getCartItemsCount === "function" ? getCartItemsCount() : 0;

    return (
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setShowCart(true)}
        onFiltersClick={() => setShowFilters(true)}
        dark={dark}
        setDark={setDark}
        query={query}
        setQuery={setQuery}
      />
    );
  }

  // استمع لحدث عام لفتح درج السلة من أي صفحة/component
  useEffect(() => {
    const openHandler = () => setShowCart(true);
    window.addEventListener("open-cart", openHandler);
    return () => window.removeEventListener("open-cart", openHandler);
  }, []);

  return (
    <SessionProvider>
      <AuthProvider>
        <AppToaster />
        <FavoritesProvider>
          <CartProvider>
            {/* Navbar داخل CartProvider حتى يمكنه قراءة حالة السلة عبر useCart */}
            <NavbarWithCart />
            {/* الدرج العام للسلة متوفر بشكل مركزي لتفتح من أي صفحة */}
            <CartDrawer showCart={showCart} setShowCart={setShowCart} />

            {/* بقية التطبيق */}
            {children}
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
