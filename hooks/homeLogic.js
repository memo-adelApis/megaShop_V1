"use client";
import axiosInstance from "@/context/axiosContext";
import { useEffect, useState } from "react";

// جلب المنتجات
export const getProductsHome = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/products", { params });
    return response.data.products || [];
  } catch (error) {
    console.error("خطأ أثناء جلب المنتجات:", error);
    return [];
  }
};

// جلب الماركات
export const getBrandsHome = async () => {
  try {
    const response = await axiosInstance.get("/brands");
    return response.data.brands || [];
  } catch (error) {
    console.error("خطأ أثناء جلب الماركات:", error);
    return [];
  }
};

// جلب الأقسام + الفئات (في طلب واحد)
export const getSectionsWithCategories = async () => {
  try {
    const response = await axiosInstance.get("/sections");
    return response.data.sections || [];
  } catch (error) {
    console.error("خطأ أثناء جلب الأقسام والفئات:", error);
    return [];
  }
};

export const getFeaturedProducts = async () => {
  try {
    // fetch featured products via the products route with query param
    const res = await axiosInstance.get("/products", { params: { isFeatured: true } });
    return res.data.products || [];
  } catch (error) {
    console.error("خطأ أثناء جلب المنتجات المميزة:", error);
    return [];
  } 
};

// هوك الصفحة الرئيسية
export function useHomeData(params = {}) {

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sections, setSections] = useState([]);
  const [isFeatured , setIsFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  //console.log(isFeatured)

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [productsRes, brandsRes, sectionsRes , isFeaturedresponse] = await Promise.all([
          getProductsHome(params),
          getBrandsHome(),
          getSectionsWithCategories(),
          getFeaturedProducts()
        ]);
        setProducts(productsRes);
        setBrands(brandsRes);
        setSections(sectionsRes);
        setIsFeatured(isFeaturedresponse);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [JSON.stringify(params)]);

  return { products, brands, sections, isFeatured, loading };
}
