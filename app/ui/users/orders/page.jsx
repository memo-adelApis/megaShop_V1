// app/ui/orders/page.js
"use client";
import { useAuth } from "@/context/authContext";
import { useOrdersLogic } from "@/hooks/useOrdersLogic";
import Navbar from "@/components/home/Navbar";
import Link from "next/link";

export default function OrdersPage() {
  const { user } = useAuth();
  const userId = user?.id || user?._id;

  
  const { 
    orders, 
    loading, 
    error, 
    fetchOrders 
  } = useOrdersLogic(userId);

  console.log("orders" ,orders)

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'confirmed': return 'تم التأكيد';
      case 'shipped': return 'قيد الشحن';
      case 'delivered': return 'تم التسليم';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto p-4 text-center">
          <div className="text-xl">جاري تحميل الطلبات...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="container mx-auto p-4 text-center">
          <div className="text-red-600 text-xl mb-4">خطأ في تحميل الطلبات: {error}</div>
          <button 
            onClick={fetchOrders}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">طلباتي</h1>
          <Link 
            href="/"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            العودة للتسوق
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold mb-4">لا توجد طلبات</h2>
            <p className="text-gray-600 mb-6">لم تقم بأي طلبات حتى الآن</p>
            <Link 
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              ابدأ التسوق الآن
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow border overflow-hidden">
                {/* رأس الطلب */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">
                        طلب #{order.orderNumber || order._id}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {new Date(order.createdAt).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        {order.totalPrice?.toFixed(2)} جنيه
                      </span>
                    </div>
                  </div>
                </div>

                {/* عناصر الطلب */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                        {item.product?.images?.[0] && (
                          <img 
                            src={item.product.images[0]} 
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-gray-600 text-sm">الكمية: {item.quantity}</p>
                          {item.attributes && Object.keys(item.attributes).length > 0 && (
                            <div className="text-sm text-gray-500 mt-1">
                              {Object.entries(item.attributes).map(([key, value]) => (
                                <span key={key} className="ml-2">
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} جنيه</p>
                          <p className="text-sm text-gray-500">{item.price} جنيه للقطعة</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* معلومات إضافية */}
                  <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">عنوان الشحن</h4>
                      {order.shippingAddress ? (
                        <div className="text-sm text-gray-600">
                          <p>{order.shippingAddress.name}</p>
                          <p>{order.shippingAddress.phone}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>{order.shippingAddress.city}</p>
                          {order.shippingAddress.district && (
                            <p>الحي: {order.shippingAddress.district}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">لم يتم تحديد عنوان الشحن</p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">معلومات الدفع</h4>
                      <div className="text-sm text-gray-600">
                        <p>طريقة الدفع: {order.paymentMethod === 'cash_on_delivery' ? 'الدفع عند الاستلام' : order.paymentMethod}</p>
                        {order.delivery?.date && (
                          <p>
                            موعد التوصيل: {new Date(order.delivery.date).toLocaleDateString('ar-SA')}
                          </p>
                        )}
                        {order.delivery?.time && (
                          <p>الوقت: {order.delivery.time}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ملخص السعر */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-semibold">الإجمالي</p>
                        {order.discount > 0 && (
                          <p className="text-sm text-green-600">تم تطبيق خصم: -{order.discount} جنيه</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          {order.totalPrice?.toFixed(2)} جنيه
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.items?.reduce((total, item) => total + item.quantity, 0)} منتج
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* أزرار الإجراءات */}
                <div className="bg-gray-50 px-6 py-4 border-t">
                  <div className="flex gap-3">
                    <Link
                      href={`/order-tracking/${order._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                    >
                      تتبع الطلب
                    </Link>
                    <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm">
                      تحميل الفاتورة
                    </button>
                    {order.status === 'pending' && (
                      <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm">
                        إلغاء الطلب
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}