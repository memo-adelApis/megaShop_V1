"use client"
import { Bell, UserCircle, ChevronDown, Menu, Globe } from "lucide-react";
import { useState } from "react";

import { useLanguage } from "@/context/LanguageContext";
export default function AdminNavbar({ sidebarOpen, setSidebarOpen }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { lang, setLang } = useLanguage();


  return (
    <header className="sticky top-0 z-30 bg-white border-b flex items-center justify-between px-2 md:px-6 h-16">
      <button
        onClick={() => setLang(lang === "ar" ? "en" : "ar")}
        className="flex items-center gap-2 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300"
      >
        <Globe className="w-5 h-5" />
        {lang === "ar" ? "English" : "العربية"}
      </button>
      {/* زر فتح الشريط الجانبي للـ mobile */}
      <button
        className="md:hidden mr-2"
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label="فتح القائمة"
      >
        <Menu />
      </button>
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        {/* زر الإشعارات */}
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-6 h-6" />
          {/* عدد الإشعارات (مثال وهمي) */}
          <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>
        {/* زر المستخدم */}
        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
            onClick={() => setUserMenuOpen((v) => !v)}
          >
            <UserCircle className="w-7 h-7 text-gray-700" />
            <span className="font-medium hidden sm:block">Admin</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {userMenuOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded shadow-lg border z-50">
              <a href="/profile" className="block px-4 py-2 hover:bg-gray-50">
                الملف الشخصي
              </a>
              <a href="/settings" className="block px-4 py-2 hover:bg-gray-50">
                الإعدادات
              </a>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-50">
                تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
