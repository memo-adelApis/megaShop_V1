// context/FavoritesContext.js
"use client";
import { createContext, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // 🟢 تحميل المفضلة من localStorage عند أول مرة
  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  // 🟢 تحديث localStorage كل ما تتغير المفضلة
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // 🟢 إضافة منتج للمفضلة
  const addFavorite = (product) => {
    if (!favorites.find((p) => p._id === product._id)) {
      setFavorites([...favorites, product]);
    }
  };

  // 🟢 حذف منتج من المفضلة
  const removeFavorite = (id) => {
    setFavorites(favorites.filter((p) => p._id !== id));
  };

  // 🟢 التحقق إذا المنتج موجود بالفعل
  const isFavorite = (id) => {
    return favorites.some((p) => p._id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// hook للاستخدام بسهولة
export const useFavorites = () => useContext(FavoritesContext);
