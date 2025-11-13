"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  ListOrdered,
  Layers,
  BadgePercent,
  Tag,
  Users,
  CreditCard,
  Menu,
  X,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

const navItems = (t) => [
  {
    name: t.dashboard,
    href: "/ui/admin",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: t.products,
    href: "/ui/admin/products",
    icon: <ShoppingBag className="w-5 h-5" />,
  },
  {
    name: t.orders,
    href: "/ui/admin/order",
    icon: <ListOrdered className="w-5 h-5" />,
  },
   {
    name: t.coupons,
    href: "/ui/admin/coupons",
    icon: <Gift className="w-5 h-5" />,
  },
  {
    name: t.categories,
    href: "/ui/admin/categories",
    icon: <Layers className="w-5 h-5" />,
  },
  {
    name: t.brands,
    href: "/ui/admin/brands",
    icon: <Tag className="w-5 h-5" />,
  },
  {
    name: t.offers,
    href: "/ui/admin/offers",
    icon: <BadgePercent className="w-5 h-5" />,
  },
  {
    name: t.users,
    href: "/ui/admin/users",
    icon: <Users className="w-5 h-5" />,
  },
  {
    name: t.payments,
    href: "/ui/admin/payments",
    icon: <CreditCard className="w-5 h-5" />,
  },
];

export default function Sidebar({ open, setOpen }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity md:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={cn(
          "fixed md:static z-50 top-0 left-0 min-h-screen h-screen w-64 bg-white shadow-lg transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-64",
          "md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="text-2xl font-bold">{t.dashboard}</span>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>
        <nav className="p-4 flex flex-col gap-2">
          {navItems(t).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200",
                pathname === item.href ? "bg-gray-300 font-semibold" : ""
              )}
              onClick={() => setOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
      {/* زر فتح الشريط الجانبي للجوال */}
      {!open && (
        <button
          className="fixed top-4 left-4 z-50 md:hidden bg-white shadow rounded-full p-2"
          onClick={() => setOpen(true)}
        >
          <Menu />
        </button>
      )}
    </>
  );
}
