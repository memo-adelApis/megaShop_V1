"use client";
import { useState, useEffect } from "react";
import { getProducts, deleteProduct } from "@/services/productService";
import { getBrands } from "@/services/brandService";
import { getAllCoupons } from "@/services/couponService";

export const useAdminLogic = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [brandsList, setBrandsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [coupons, setCoupons] = useState(0);

  // 🟢 Pagination
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = async ({ page: newPage = page } = {}) => {
    try {
      setLoading(true);
      const filters = {};
      if (search) filters.search = search;
      if (brand) filters.brand = brand;
      if (category) filters.category = category;

      const data = await getProducts(filters, newPage, 15);
      setProducts(data.products || []);
      setPages(data.pages || 1);
      setPage(data.page || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("فشل في جلب المنتجات:", err);
    } finally {
      setLoading(false);
    }
  };


  const getCopupons = async () => {
    try {
      setLoading(true);
      const data = await getAllCoupons();
      setCoupons(data.length || 0);
      return data;
    } catch (err) {
      console.error("فشل في جلب الكوبونات:", err);
      return [];
    } finally {
      setLoading(false);
    } 
  };

  // 🟢 حذف منتج



  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف المنتج؟")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("فشل في حذف المنتج:", err);
    }
  };

  const fetchBrands = async () => {
    try {
      const brands = await getBrands();
      setBrandsList(brands);
    } catch (err) {
      console.error("فشل في جلب الماركات:", err);
    }
  };

  // 🟢 تحميل البيانات عند التغيير
  useEffect(() => {
    fetchProducts({ page: 1 });
    fetchBrands();
  }, [search, brand, category]);

  return {
    products,
    search,
    setSearch,
    brand,
    setBrand,
    category,
    setCategory,
    brandsList,
    loading,
    open,
    setOpen,
    fetchProducts,
    handleDelete,
    page,
    pages,
    setPage,
    total,
    coupons, 
       getCopupons,
  };
};
