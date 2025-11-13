// components/DeliveryScheduler.js
"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/context/axiosContext";

const DeliveryScheduler = ({ orderId, onScheduleSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [formData, setFormData] = useState({
    address: {
      name: "",
      phone: "",
      address: "",
      city: "الرياض",
      district: "",
      additionalNotes: ""
    },
    deliveryDate: "",
    deliverySlot: "",
    deliveryTime: ""
  });

  console.log("DeliveryScheduler orderId:", orderId);


  // الحصول على المواعيد المتاحة عند تغيير التاريخ
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (date) => {
    try {
      const response = await axiosInstance.get(
        `/delivery/available-slots?date=${date}&city=${formData.address.city}`
      );
      
      if (response.data.success) {
        setAvailableSlots(response.data.availableSlots);
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log(formData)
      const response = await axiosInstance.post("/delivery/schedule", {
        orderId,
        ...formData
      });

      if (response.data.success) {
        onScheduleSuccess(response.data.delivery);
      }
    } catch (err) {
      setError(err.response?.data?.error || "حدث خطأ أثناء جدولة التوصيل");
    } finally {
      setLoading(false);
    }
  };

  // الخطوة 1: العنوان
  const renderAddressStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold mb-4">عنوان التوصيل</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">الاسم بالكامل *</label>
          <input
            type="text"
            value={formData.address.name}
            onChange={(e) => handleAddressChange("name", e.target.value)}
            required
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">رقم الجوال *</label>
          <input
            type="tel"
            value={formData.address.phone}
            onChange={(e) => handleAddressChange("phone", e.target.value)}
            required
            className="border rounded px-3 py-2 w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">المدينة *</label>
        <select
          value={formData.address.city}
          onChange={(e) => handleAddressChange("city", e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="الرياض">الرياض</option>
          <option value="جدة">جدة</option>
          <option value="مكة">مكة</option>
          <option value="المدينة">المدينة</option>
          <option value="الدمام">الدمام</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">الحي *</label>
        <input
          type="text"
          value={formData.address.district}
          onChange={(e) => handleAddressChange("district", e.target.value)}
          required
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">العنوان التفصيلي *</label>
        <textarea
          value={formData.address.address}
          onChange={(e) => handleAddressChange("address", e.target.value)}
          required
          rows="3"
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">ملاحظات إضافية</label>
        <textarea
          value={formData.address.additionalNotes}
          onChange={(e) => handleAddressChange("additionalNotes", e.target.value)}
          rows="2"
          className="border rounded px-3 py-2 w-full"
          placeholder="أي تعليمات خاصة للتوصيل..."
        />
      </div>

      <button
        type="button"
        onClick={() => setStep(2)}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        التالي إلى اختيار الموعد
      </button>
    </div>
  );

  // الخطوة 2: اختيار الموعد
  const renderTimeStep = () => {
    // حساب التواريخ المتاحة (من اليوم إلى 7 أيام قادمة)
    const today = new Date();
    const availableDates = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      availableDates.push(date);
    }

    // تحديد إذا كان اليوم جمعة
    const isFriday = (date) => date.getDay() === 5;

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-bold mb-4">اختيار موعد التوصيل</h3>
        
        <div>
          <label className="block text-sm font-medium mb-3">اختر تاريخ التوصيل *</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableDates.map((date, index) => {
              const dateString = date.toISOString().split('T')[0];
              const isSelected = formData.deliveryDate === dateString;
              const dayName = date.toLocaleDateString('ar-SA', { weekday: 'long' });
              const isToday = index === 0;
              const isTomorrow = index === 1;
              
              return (
                <button
                  key={dateString}
                  type="button"
                  onClick={() => {
                    setSelectedDate(dateString);
                    setFormData(prev => ({ ...prev, deliveryDate: dateString }));
                  }}
                  className={`p-3 border rounded text-center ${
                    isSelected 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  } ${isFriday(date) ? 'border-orange-300 bg-orange-50' : ''}`}
                >
                  <div className="text-sm font-bold">
                    {isToday ? 'اليوم' : isTomorrow ? 'غداً' : dayName}
                  </div>
                  <div className="text-xs mt-1">
                    {date.toLocaleDateString('ar-SA')}
                  </div>
                  {isFriday(date) && (
                    <div className="text-xs text-orange-600 mt-1">جمعة</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {formData.deliveryDate && (
          <div>
            <label className="block text-sm font-medium mb-3">اختر فترة التوصيل *</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availableSlots.map(slot => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    deliverySlot: slot.id,
                    deliveryTime: slot.time
                  }))}
                  disabled={!slot.available}
                  className={`p-4 border rounded text-center ${
                    formData.deliverySlot === slot.id
                      ? 'bg-green-600 text-white border-green-600'
                      : slot.available
                      ? 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                      : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  }`}
                >
                  <div className="font-bold">{slot.name}</div>
                  {slot.available ? (
                    <div className="text-sm mt-2 text-green-600">
                      متاح ({slot.remaining} باقي)
                    </div>
                  ) : (
                    <div className="text-sm mt-2 text-red-600">مكتمل</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            رجوع
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.deliverySlot}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? "جاري التأكيد..." : "تأكيد موعد التوصيل"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">تحديد موعد التوصيل</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {step === 1 ? renderAddressStep() : renderTimeStep()}
      </form>
    </div>
  );
};

export default DeliveryScheduler;