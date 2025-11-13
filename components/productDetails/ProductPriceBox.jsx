// components/productDetails/ProductPriceBox.jsx
export default function ProductPriceBox({ 
  price, 
  priceAfterDiscount,
  stock, 
  attributes, 
  views, 
  onAddToCart, 
  isInCart, 
  addingToCart 
}) {
  const finalPrice = priceAfterDiscount || price;
  const hasDiscount = priceAfterDiscount && priceAfterDiscount < price;

  // --- helper: تنسيق قيمة الخاصية لأي نوع ---
  const formatAttrValue = (val) => {
    if (val == null) return "";
    if (Array.isArray(val)) {
      return val
        .map(v => (typeof v === "object" && v !== null ? (v.name ?? v.value ?? JSON.stringify(v)) : String(v)))
        .join(", ");
    }
    if (typeof val === "object") {
      return val.name ?? val.value ?? JSON.stringify(val);
    }
    return String(val);
  };
  
  // --- helper: رندر شارات للقيم ---
  const renderValueChips = (val) => {
    if (val == null) return null;
    if (Array.isArray(val)) {
      return val.map((v, i) => (
        <span key={i} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mr-2 mb-2">
          {formatAttrValue(v)}
        </span>
      ));
    }
    return (
      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mr-2 mb-2">
        {formatAttrValue(val)}
      </span>
    );
  };
 
  return (
    <div className="bg-white rounded-xl shadow border p-6 sticky top-4">
      {/* السعر */}
      <div className="mb-4">
        {hasDiscount ? (
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-green-600">
              {finalPrice.toFixed(2)} ر.س
            </span>
            <span className="text-lg text-gray-500 line-through">
              {price.toFixed(2)} ر.س
            </span>
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
              وفر {((price - finalPrice) / price * 100).toFixed(0)}%
            </span>
          </div>
        ) : (
          <span className="text-2xl font-bold text-gray-800">
            {finalPrice.toFixed(2)} ر.س
          </span>
        )}
      </div>

      {/* المخزون */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">المخزون:</span>
          <span className={`font-medium ${
            stock > 10 ? 'text-green-600' : 
            stock > 0 ? 'text-orange-600' : 'text-red-600'
          }`}>
            {stock > 10 ? 'متوفر' : stock > 0 ? `آخر ${stock} قطع` : 'غير متوفر'}
          </span>
        </div>
      </div>

      {/* عدد المشاهدات */}
      {views && (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">المشاهدات:</span>
            <span className="font-medium text-gray-800">{views}</span>
          </div>
        </div>
      )}

      {/* الخصائص */}
      {attributes && (
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2 font-semibold">الخصائص</div>
          <div className="flex flex-col gap-3">
            {Array.isArray(attributes)
              ? attributes.map((attr) => (
                  <div key={attr._id ?? attr.key} className="flex items-start gap-3">
                    <div className="w-28 text-xs text-gray-700 font-medium">{attr.key}:</div>
                    <div className="flex-1">{renderValueChips(attr.value)}</div>
                  </div>
                ))
              : Object.keys(attributes || {}).length > 0
              ? Object.entries(attributes).map(([k, v]) => (
                  <div key={k} className="flex items-start gap-3">
                    <div className="w-28 text-xs text-gray-700 font-medium">{k}:</div>
                    <div className="flex-1">{renderValueChips(v)}</div>
                  </div>
                ))
              : null}
          </div>
        </div>
      )}
   
      {/* زر إضافة إلى السلة */}
      <button
        onClick={onAddToCart}
        disabled={addingToCart || stock === 0 || isInCart}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
          isInCart
            ? 'bg-green-100 text-green-700 cursor-not-allowed'
            : stock === 0
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : addingToCart
            ? 'bg-blue-400 text-white cursor-wait'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {addingToCart ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            جاري الإضافة...
          </div>
        ) : isInCart ? (
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            موجود في السلة
          </div>
        ) : stock === 0 ? (
          'غير متوفر'
        ) : (
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            أضف إلى السلة
          </div>
        )}
      </button>

      {/* رسالة حالة المخزون */}
      {stock === 0 && (
        <p className="text-red-500 text-sm text-center mt-2">
          المنتج غير متوفر حالياً
        </p>
      )}

      {stock > 0 && stock <= 5 && (
        <p className="text-orange-500 text-sm text-center mt-2">
          فقط {stock} قطع متبقية
        </p>
      )}
    </div>
  );
}