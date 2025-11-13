"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { LanguageProvider } from "@/context/LanguageContext";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <LanguageProvider>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar: ثابت في الديسكتوب، منبثق في الجوال */}
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col">
          <AdminNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 p-2 md:p-6">{children}</main>
      </div>
      </div>
    </LanguageProvider>
  );
}
