// app/checkout/[orderId]/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/authContext";
import Navbar from "@/components/home/Navbar";
import DeliveryScheduler from "@/components/orders/DeliveryScheduler";
import PaymentMethod from "@/components/orders/PaymentMethod";
import OrderSummary from "@/components/orders/OrderSummary";
import ShippingAddressForm from "@/components/orders/ShippingAddressForm";
import { useOrdersLogic } from "@/hooks/useOrdersLogic";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [deliveryData, setDeliveryData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");

  const orderId = params.id;
  
  const userId = user?.user?.id || user?.user?._id;

  // استخدام الهوك مع orderId و userId
  const {
    order,
    loading,
    updating,
    error,
    updateOrder,
    confirmOrder
  } = useOrdersLogic(userId, orderId);

  // عرض سؤال إن كان لدى المستخدم عنوان مسجّل ولم يملأ الطلب عنوانًا بعد
  const [askUseSavedAddress, setAskUseSavedAddress] = useState(false);

  // عندما يصل الطلب ونوجد أن الطلب بلا عنوان لكن المستخدم لديه عنوان محفوظ
  useEffect(() => {
    if (order) {
      // إذا كان هناك عنوان شحن صالح، ابدأ من الخطوة الثانية
      if (order.shippingAddress && 
          order.shippingAddress.address && 
          order.shippingAddress.address !== "لم يتم التحديد") {
        setStep(2);
      }
      
      // إذا كان هناك بيانات توصيل، ابدأ من الخطوة الثالثة
      if (order.delivery) {
        setDeliveryData(order.delivery);
        setStep(3);
      }
      
      // إذا كانت هناك طريقة دفع، ابدأ من الخطوة الرابعة
      if (order.paymentMethod && order.paymentMethod !== "cash_on_delivery") {
        setPaymentMethod(order.paymentMethod);
        setStep(4);
      }
    } else {
      // إذا لم يتوفر طلب بعد فلا نفعل شيء
    }

    // إذا الطلب بلا عنوان والشخص مسجل ولديه عنوان محفوظ نعرض السؤال مرة
    const hasOrderAddress = order && order.shippingAddress && order.shippingAddress.address;
    const hasUserSavedAddress = user && user.shippingAddress && user.shippingAddress.address;
    if (!hasOrderAddress && hasUserSavedAddress) {
      setAskUseSavedAddress(true);
    } else {
      setAskUseSavedAddress(false);
    }
  }, [order, user]);

  // استعمل عنوان المستخدم المسجّل بوصفه عنوان الطلب
  const applySavedAddress = async () => {
    if (!user || !user.shippingAddress) return;
    try {
      setAskUseSavedAddress(false);
      await updateOrder(orderId, { shippingAddress: user.shippingAddress });
      // تأكد الانتقال إلى خطوة التوصيل
      setStep(2);
    } catch (err) {
      console.error("Error applying saved address:", err);
    }
  };

  const handleAddressSubmit = async (address) => {
    try {
      await updateOrder(orderId, { shippingAddress: address });
      setStep(2);
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  const handleDeliveryScheduled = async (delivery) => {
    try {
      await updateOrder(orderId, { delivery });
      setDeliveryData(delivery);
      setStep(3);
    } catch (error) {
      console.error("Error updating delivery:", error);
    }
  };

  const handlePaymentSelected = async (method) => {
    try {
      await updateOrder(orderId, { paymentMethod: method });
      setPaymentMethod(method);
      setStep(4);
    } catch (error) {
      console.error("Error updating payment method:", error);
    }
  };

  const handleConfirmOrder = async () => {
    try {
      await confirmOrder(orderId);
      router.push(`/ui/order-success/${orderId}`);
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("حدث خطأ أثناء تأكيد الطلب: " + error.message);
    }
  };

  if (loading && !order) {
    return (
      <div>
        <div className="container mx-auto p-4 text-center">
          <div className="text-xl">جاري تحميل بيانات الطلب...</div>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div>
        <div className="container mx-auto p-4 text-center">
          <div className="text-red-600 text-xl mb-4">خطأ في تحميل الطلب</div>
          <button 
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <div className="container mx-auto p-4 text-center">
          <div className="text-xl">الطلب غير موجود</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          إتمام الطلب {order.orderNumber && `#${order.orderNumber}`}
        </h1>
        
        {/* شريط التقدم */}
        <div className="flex justify-between mb-8">
          <div className={`text-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mx-auto mb-2 ${
              step >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-400'
            }`}>
              ١
            </div>
            <span className="text-sm">العنوان</span>
          </div>
          <div className={`text-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mx-auto mb-2 ${
              step >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-400'
            }`}>
              ٢
            </div>
            <span className="text-sm">التوصيل</span>
          </div>
          <div className={`text-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mx-auto mb-2 ${
              step >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-400'
            }`}>
              ٣
            </div>
            <span className="text-sm">الدفع</span>
          </div>
          <div className={`text-center ${step >= 4 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mx-auto mb-2 ${
              step >= 4 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-400'
            }`}>
              ٤
            </div>
            <span className="text-sm">التأكيد</span>
          </div>
        </div>

        {/* عرض السؤال لاستخدام العنوان المسجل */}
        {askUseSavedAddress && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded text-center">
            <div className="mb-2 font-medium">هل تريد التوصيل إلى عنوانك المسجل؟</div>
            <div className="flex justify-center gap-3">
              <button
                onClick={applySavedAddress}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                نعم، استخدم عنواني
              </button>
              <button
                onClick={() => { setAskUseSavedAddress(false); setStep(1); }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                لا، سأدخل عنواناً جديداً
              </button>
            </div>
          </div>
        )}

        {/* عرض الأخطاء */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* الخطوة 1: عنوان الشحن */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">عنوان الشحن</h2>
            <ShippingAddressForm 
              user={user}
              // مبدئياً استخدم عنوان الطلب إن وُجد، وإلا استخدم عنوان المستخدم المسجل إن وُجد
              initialAddress={order.shippingAddress || user?.shippingAddress || null}
              onAddressSubmit={handleAddressSubmit}
              loading={updating}
            />
          </div>
        )}

        {/* الخطوة 2: التوصيل */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">تحديد موعد التوصيل</h2>
            <DeliveryScheduler 
              orderId={orderId}
              // مرّر عنوان الشحن الحالي ليستخدمه Scheduler مباشرة (يمكن أن يكون من الطلب أو من المستخدم)
              shippingAddress={order.shippingAddress || user?.shippingAddress || null}
              onScheduleSuccess={handleDeliveryScheduled}
              loading={updating}
            />
          </div>
        )}

        {/* الخطوة 3: الدفع */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">اختيار طريقة الدفع</h2>
            <PaymentMethod 
              onPaymentSelected={handlePaymentSelected}
              selectedMethod={paymentMethod}
              loading={updating}
            />
          </div>
        )}

        {/* الخطوة 4: التأكيد */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">تأكيد الطلب</h2>
            <OrderSummary 
              orderData={order}
              deliveryData={deliveryData || order.delivery}
              paymentMethod={paymentMethod}
              onConfirm={handleConfirmOrder}
              loading={updating}
            />
          </div>
        )}
      </div>
    </div>
  );
}