  "use client";

  import { ShoppingBag, Users, ListOrdered, CreditCard } from "lucide-react";
  import { useState } from "react";
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
  } from "chart.js";
  import { Bar, Pie, Line } from "react-chartjs-2";
  import { useLanguage } from "@/context/LanguageContext";

  // تسجيل عناصر Chart.js
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    ChartTooltip,
    Legend,
    ArcElement
  );

  // بيانات الكروت (القيم فقط، النصوص من الترجمة)
  const stats = (t) => [
    {
      label: t.products,
      value: 120,
      icon: <ShoppingBag className="w-8 h-8 text-green-600" />,
    },
    {
      label: t.users,
      value: 45,
      icon: <Users className="w-8 h-8 text-blue-600" />,
    },
    {
      label: t.orders,
      value: 32,
      icon: <ListOrdered className="w-8 h-8 text-orange-600" />,
    },
    {
      label: t.payments,
      value: "15,200 " + t.currency,
      icon: <CreditCard className="w-8 h-8 text-purple-600" />,
    },
  ];

  // بيانات الإيرادات الشهرية
  const revenueData = (t) => ({
    labels: [t.january, t.february, t.march, t.april, t.may, t.june],
    datasets: [
      {
        label: t.monthlyRevenue,
        data: [1200, 2500, 1800, 2200, 3000, 4200],
        fill: false,
        borderColor: "#9333ea",
        backgroundColor: "#9333ea",
        tension: 0.3,
      },
    ],
  });

  // بيانات الأكثر مبيعًا
  const salesData = (t) => ({
    labels: [t.shoes, t.clothes, t.accessories, t.electronics],
    datasets: [
      {
        label: t.salesByCategory,
        data: [120, 95, 80, 140],
        backgroundColor: "#2563eb",
        borderRadius: 6,
      },
    ],
  });

  // بيانات أكثر الفئات بحثًا
  const searchData = (t) => ({
    labels: [t.shoes, t.clothes, t.accessories, t.electronics],
    datasets: [
      {
        label: t.mostSearched,
        data: [400, 300, 200, 500],
        backgroundColor: ["#16a34a", "#2563eb", "#f59e0b", "#9333ea"],
      },
    ],
  });

  // بيانات الطلبات الشهرية
  const ordersData = (t) => ({
    labels: [t.january, t.february, t.march, t.april, t.may, t.june],
    datasets: [
      {
        label: t.monthlyOrders,
        data: [5, 8, 12, 7, 10, 15],
        backgroundColor: "#16a34a",
        borderRadius: 6,
      },
    ],
  });

  // بيانات أفضل العملاء
  const topCustomers = [
    { id: 1, name: "أحمد محمد", total: 2500, orders: 12 },
    { id: 2, name: "سارة علي", total: 1800, orders: 9 },
    { id: 3, name: "محمد يوسف", total: 1500, orders: 7 },
  ];

  export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("products");
    const { t } = useLanguage();

    return (
      <div className="p-8 m-9">
        <h1 className="text-2xl mb-4 mt-4 font-bold">{t.dashboard}</h1>

        {/* الكروت بجانب بعض */}
        <div className="flex w-full mb-6 md:grid-cols-4 gap-6 ">
          {stats(t).map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl w-full mb-3 shadow p-6 flex items-center gap-4"
            >
              {stat.icon}
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* الأكثر مبيعًا حسب الفئة و الإيرادات الشهرية بجانب بعض */}
        <div className="grid mb-4 grid-cols-1 md:grid-cols-2 mt-4 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white col-span-1 rounded-xl shadow p-4 flex flex-col items-center">
              <h2 className="text-md font-bold mb-2">{t.mostSearched}</h2>
              <div className="w-full max-w-xs ">
                <Pie
                  data={searchData(t)}
                  options={{ responsive: true, maintainAspectRatio: false }}
                  height={140}
                  width={140}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl col-span-1 shadow p-4 flex flex-col items-center">
              <h2 className="text-md font-bold mb-2">{t.monthlyOrders}</h2>
              <div className="w-full max-w-xs h-40">
                <Bar
                  data={ordersData(t)}
                  options={{ responsive: true, maintainAspectRatio: false }}
                  height={140}
                />
              </div>
            </div>
          </div>
          <div className="bg-white col-span-1 rounded-xl shadow p-4 flex flex-col items-center">
            <h2 className="text-md font-bold mb-2">{t.monthlyRevenue}</h2>
            <div className="w-full max-w-xs">
              <Line
                data={revenueData(t)}
                options={{ responsive: true, maintainAspectRatio: false }}
                height={200}
              />
            </div>
          </div>
          <div className="bg-white col-span-1 rounded-xl shadow p-4 flex flex-col items-center">
            <h2 className="text-md font-bold mb-2">{t.salesByCategory}</h2>
            <div className="w-full max-w-xs">
              <Bar
                data={salesData(t)}
                options={{ responsive: true, maintainAspectRatio: false }}
                height={200}
              />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 mt-8">
            <h2 className="text-lg font-bold mb-4">{t.topCustomers}</h2>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 text-right">{t.customer}</th>
                  <th className="p-3 text-right">{t.orderCount}</th>
                  <th className="p-3 text-right">{t.totalPurchases}</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b">
                    <td className="p-3">{customer.name}</td>
                    <td className="p-3">{customer.orders}</td>
                    <td className="p-3">
                      {customer.total} {t.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* أكثر الفئات بحثًا و عدد الطلبات خلال الأشهر بجانب بعض */}

        {/* جدول أفضل العملاء */}
      </div>
    );
  }
