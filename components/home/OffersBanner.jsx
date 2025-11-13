const OffersBanner = () => (
  <section
    id="offers"
    className="bg-gradient-to-r from-emerald-600 to-green-600 text-white"
  >
    <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center gap-6">
      <div className="flex-1 space-y-2">
        <h3 className="text-2xl md:text-3xl font-extrabold">
          عرض الأسبوع: خصم يصل إلى 30%
        </h3>
        <p className="text-white/90">
          على مختارات الإلكترونيات والأزياء. الكمية محدودة – لا تفوت الفرصة!
        </p>
      </div>
      <a
        href="#products"
        className="bg-white text-green-700 font-semibold px-6 py-3 rounded-xl hover:bg-white/90"
      >
        تسوق العرض الآن
      </a>
    </div>
  </section>
);

export default OffersBanner;
