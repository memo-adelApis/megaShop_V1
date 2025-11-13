"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/authContext";
import { ShoppingCart, Search, Menu, Sun, Moon, User, LogOut, Package, ChevronDown, X } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import CartDrawer from "./CartDrawer";

const Navbar = ({
  cartCount,
  onCartClick,
  onFiltersClick,
  dark,
  setDark,
  query,
  setQuery,
}) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // بيانات افتراضية للاقتراحات (يمكن استبدالها ببيانات حقيقية من API)
  const popularSearches = [
    "هواتف ذكية",
    "لابتوبات",
    "أجهزة كهربائية",
    "ملابس رياضية",
    "أحذية",
    "ساعات",
    "عطور",
    "ألعاب إلكترونية"
  ];

  const handleLogout = () => {
    signOut();
    logout?.();
    setDropdownOpen(false);
  };

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // محاكاة البحث عن الاقتراحات
  useEffect(() => {
    if (query?.length > 0) {
      const filtered = popularSearches.filter(item =>
        item.includes(query)
      );
      setSearchSuggestions(filtered);
    } else {
      setSearchSuggestions(popularSearches);
    }
  }, [query]);

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSearchOpen(false);
    // هنا يمكن إضافة منطق البحث الفعلي
  };

  const clearSearch = () => {
    setQuery("");
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg supports-[backdrop-filter]:bg-white/95 bg-white/95 dark:bg-neutral-900/95 border-b border-gray-200 dark:border-neutral-700 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* ✅ الجزء الخاص بالترحيب */}
          <div className="flex items-center gap-3 flex-1">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <span className="hidden sm:block">مرحبًا، {user.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white dark:bg-neutral-800 shadow-xl rounded-xl py-2 w-48 border border-gray-200 dark:border-neutral-700 z-50">
                    <Link href={`/ui/users/${user.id}`}>
                      <button className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-700 text-sm text-gray-700 dark:text-gray-200 transition-colors duration-200">
                        <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        الملف الشخصي
                      </button>
                    </Link>
                    
                    <Link href="/ui/users/orders">
                      <button className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-700 text-sm text-gray-700 dark:text-gray-200 transition-colors duration-200">
                        <Package className="w-4 h-4 text-blue-500" />
                        طلباتي
                      </button>
                    </Link>

                    <div className="border-t border-gray-200 dark:border-neutral-700 my-1"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-600 dark:text-red-400 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span>مرحبًا! </span>
                <Link 
                  href="/login" 
                  className="text-green-600 dark:text-green-400 font-semibold hover:text-green-700 dark:hover:text-green-300 underline transition-colors duration-200"
                >
                  سجل الدخول
                </Link>
                <span> للاستمتاع بالتجربة</span>
              </div>
            )}
          </div>

          {/* ✅ اللوجو */}
          <div className="flex-shrink-0">
            <Link href="/" className="font-extrabold text-xl text-gray-800 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
              <div className="text-center">
                <h1 className="text-lg font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  MegaShop
                </h1>
                <div className="w-2 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mt-1"></div>
              </div>
            </Link>
          </div>

          {/* ✅ مربع البحث مع القائمة المنسدلة */}
          <div className="hidden md:flex items-center flex-1 max-w-2xl" ref={searchRef}>
            <div className="relative w-full">
              <div className="relative">
                <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="ابحث عن منتج، فئة أو ماركة..."
                  className="w-full rounded-2xl border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 pl-3 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white transition-all duration-200"
                />
                {query && (
                  <button
                    onClick={clearSearch}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* قائمة الاقتراحات */}
              {searchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-xl overflow-hidden z-40">
                  <div className="p-3 border-b border-gray-100 dark:border-neutral-700">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {query ? "نتائج مقترحة" : "العمليات الشائعة"}
                    </h3>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-right px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-200 border-b border-gray-100 dark:border-neutral-700 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-200">{suggestion}</span>
                          <Search className="w-4 h-4 text-gray-400" />
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-neutral-700/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      اضغط على Enter للبحث المتقدم
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ✅ أزرار الوضع والسلة */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* زر البحث للموبايل */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-300 transition-colors duration-200"
              aria-label="بحث"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* زر تغيير المظهر */}
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-300 transition-colors duration-200"
              aria-label="تغيير المظهر"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* زر السلة */}
            <button
              onClick={onCartClick}
              className="relative flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2.5 rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:block">السلة</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ✅ مربع البحث للموبايل (منفصل) */}
        {searchOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="relative" ref={searchRef}>
              <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="w-full rounded-xl border border-gray-300 bg-white pl-3 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                autoFocus
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* اقتراحات البحث للموبايل */}
            {searchSuggestions.length > 0 && (
              <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* أنيميشن للرسائل */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Navbar;