// components/OrderSummary.js
export default function OrderSummary({ orderData, deliveryData, paymentMethod, onConfirm }) {
  console.log("orderData" ,orderData)
  return (
    
    <div className="bg-white p-6 rounded-lg shadow border">
      <h3 className="text-xl font-bold mb-4">ملخص الطلب </h3>
      
      {/* المنتجات */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">المنتجات</h4>
        {orderData.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center border-b py-3">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
            </div>
            <p className="font-semibold">{item.price * item.quantity} جنيه</p>
          </div>
        ))}
      </div>

      {/* التوصيل */}
      {deliveryData && (
        <div className="mb-6">
          <h4 className="font-semibold mb-3">معلومات التوصيل</h4>
          <p>التاريخ: {new Date(deliveryData.deliveryDate).toLocaleDateString('ar-SA')}</p>
          <p>الوقت: {deliveryData.deliveryTime}</p>
          <p>العنوان: {deliveryData.address.address}</p>
          <p>رسوم التوصيل: {deliveryData.deliveryFee} جنيه</p>
        </div>
      )}

      {/* الدفع */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">طريقة الدفع</h4>
        <p>{paymentMethod}</p>
      </div>

      {/* الإجمالي */}
      <div className="border-t pt-4">
        <div className="flex justify-between text-lg mb-2">
          <span>المجموع:</span>
          <span>{orderData.totalPrice + (deliveryData?.deliveryFee || 0)} جنيه</span>
        </div>
        {orderData.discount > 0 && (
          <div className="flex justify-between text-green-600 mb-2">
            <span>الخصم:</span>
            <span>-{orderData.discount} جنيه</span>
          </div>
        )}
        <div className="flex justify-between text-xl font-bold border-t pt-2">
          <span>الإجمالي النهائي:</span>
          <span className="text-green-600">
            {orderData.totalPrice + (deliveryData?.deliveryFee || 0) - orderData.discount} جنيه
          </span>
        </div>
      </div>

      {/* زر التأكيد */}
      <button
        onClick={onConfirm}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold mt-6"
      >
        تأكيد الطلب
      </button>
    </div>
  );
}