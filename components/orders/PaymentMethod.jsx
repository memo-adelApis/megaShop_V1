// components/PaymentMethod.js
"use client";
import { useState } from "react";

export default function PaymentMethod({ onPaymentSelected, selectedMethod }) {
  const [selected, setSelected] = useState(selectedMethod);

  const paymentMethods = [
    {
      id: "cash_on_delivery",
      name: "الدفع عند الاستلام",
      description: "ادفع عند استلام الطلب",
      icon: "💰"
    },
    {
      id: "credit_card",
      name: "بطاقة ائتمانية",
      description: "Visa, MasterCard, Mada",
      icon: "💳"
    },
    {
      id: "apple_pay",
      name: "Apple Pay",
      description: "الدفع عبر Apple Pay",
      icon: "📱"
    },
    {
      id: "stc_pay",
      name: "STC Pay",
      description: "الدفع عبر STC Pay",
      icon: "📲"
    }
  ];

  const handleSelect = (method) => {
    setSelected(method.id);
    onPaymentSelected(method.name);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`border rounded-lg p-4 cursor-pointer transition ${
              selected === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-300'
            }`}
            onClick={() => handleSelect(method)}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{method.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{method.name}</h3>
                <p className="text-gray-600">{method.description}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 ${
                selected === method.id
                  ? 'bg-blue-500 border-blue-500'
                  : 'border-gray-400'
              }`}>
                {selected === method.id && (
                  <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected === "credit_card" && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-3">بيانات البطاقة</h4>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="اسم حامل البطاقة"
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="رقم البطاقة"
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="تاريخ الانتهاء (MM/YY)"
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="CVV"
              className="border rounded px-3 py-2"
            />
          </div>
        </div>
      )}
    </div>
  );
}