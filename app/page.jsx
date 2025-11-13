"use client";
import React, { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import CategoriesBar from "@/components/home/CategoriesBar";
import ProductsGrid from "@/components/home/ProductsGrid";
import OffersBanner from "@/components/home/OffersBanner";
import FooterSection from "@/components/home/FooterSection";
import CartDrawer from "@/components/home/CartDrawer";
import FiltersDrawer from "@/components/home/FiltersDrawer";
import SectionTitle from "@/components/home/SectionTitle";
import Spenner from "@/components/Spenner";
import IsFeaturedProduct from "@/components/home/isFeaturedProduct";
import { useHomeData } from "@/hooks/homeLogic";

const CardWrapper = ({ children, className = "" }) => (
  <div className={`w-full px-4 ${className}`}>
    <div className="rounded-2xl shadow-lg w-full">{children}</div>
  </div>
);

export default function EcommercePage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("popular");
  const [showCart, setShowCart] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [dark, setDark] = useState(false);

  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // استخدم الـ CartContext لتعزيز الوصول للسلة من أي مكان
  const { cart, addToCart, getCartTotal, getCartItemsCount } = useCart();

  // 🟢 جلب المنتجات من الـ API بالفلترة
  const { products, brands, sections, loading, isFeatured } = useHomeData({
    search: query,
    section: selectedSection,
    category: selectedCategory,
    sortBy: sort,
  });

  const filtered = useMemo(() => {
    let list = products || [];

    if (query.trim()) {
      list = list.filter((p) =>
        p.name?.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [products, query, sort]);

  // addToCart and cart are provided by context; total computed via helper
  const total = getCartTotal();

  return (
    <div dir="rtl" className={dark ? "dark" : ""}>
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-green-100 dark:bg-neutral-900 dark:text-neutral-100 font-sans">
        {/* Navbar */}

        {/* Hero */}
        <div className="mb-8">
          <Hero />
        </div>

        {/* Categories */}
        <CardWrapper className="bg-white/80 py-4 mb-8">
          <CategoriesBar
            sections={sections}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onFiltersClick={() => setShowFilters(true)}
          />
        </CardWrapper>

        {/* Products */}
        <CardWrapper className="bg-white/90 p-6 mb-8 ">
          <SectionTitle description="تسوق أحدث المنتجات والعروض الحصرية بمتجرنا">
            <IsFeaturedProduct isFeatured ={isFeatured}/>
          </SectionTitle>

          {loading ? (
            <div className="flex justify-center py-10">
              <Spenner size={30} />
            </div>
          ) : (
            <ProductsGrid
              filtered={filtered}
              sort={sort}
              setSort={setSort}
              addToCart={addToCart}
              brands={brands}
            />
          )}
        </CardWrapper>

        {/* Offers */}
       

      

        {/* Drawers */}
        <CartDrawer
          showCart={showCart}
          setShowCart={setShowCart}
          cart={cart}
          total={total}
        />
        <FiltersDrawer
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          sort={sort}
          setSort={setSort}
          brands={brands}
          categories={sections}
        />

          <CardWrapper className="bg-gradient-to-r from-green-400 via-blue-300 to-blue-500 mb-8">
          <OffersBanner />
        </CardWrapper>

        {/* Featured Products */}
        <CardWrapper className="bg-white/90 p-6 mb-8 shadow-xl">
          <SectionTitle description="المنتجات المميزة">
            المنتجات المميزة
          </SectionTitle>
          <IsFeaturedProduct isFeatured={isFeatured} loading={loading} />
        </CardWrapper>
      </div>
        {/* Footer */}
        <CardWrapper className="bg-white/80 mt-8">
          <FooterSection />
        </CardWrapper>
     
    </div>
  );
}
         