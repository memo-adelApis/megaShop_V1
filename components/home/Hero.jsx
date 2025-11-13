import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

// دالة تنسيق العملة المحدثة لمصر
const formatEGP = (amount) => {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(amount ?? 0));
};

const Hero = () => {
  const slides = [
    {
      id: "s1",
      src: "/hero.jpg",
      title: "عروض نهاية الموسم",
      subtitle: "خصومات حتى ٥٠٪ على مختاراتنا المميزة",
      price: 299,
      originalPrice: 599,
      href: "/products/featured",
      badge: "عرض محدود"
    },
    {
      id: "s2",
      src: "/hero2.jpg",
      title: "أحدث الأجهزة الإلكترونية",
      subtitle: "تسوق أحدث التقنيات بأسعار تنافسية",
      price: 499,
      originalPrice: 799,
      href: "/products/electronics",
      badge: "جديد"
    },
    {
      id: "s3",
      src: "/hero3.jpg",
      title: "الموسم الصيفي",
      subtitle: "استقبل الصيف بأحدث صيحات الموضة",
      price: 199,
      originalPrice: 399,
      href: "/products/fashion",
      badge: "الأكثر مبيعاً"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((current) => (current + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((current) => (current - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // التشغيل التلقائي مع التحكم
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isAutoPlaying]);

  const currentSlideData = slides[currentSlide];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white relative overflow-hidden" aria-label="شريحة العرض الرئيسية">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* النص الدعائي */}
          <div className="space-y-8 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                  اكتشف أفضل
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    العروض الحصرية
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mt-4 leading-relaxed max-w-xl">
                  تسوق أحدث الإلكترونيات، الموضة، الجمال والمزيد مع شحن سريع 
                  وإرجاع مجاني. استمتع بتجربة تسوق فريدة وأسعار لا تُضاهى.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href="#products"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  ابدأ التسوق الآن
                  <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </motion.a>

                <motion.a
                  href="#offers"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                >
                  تصفح العروض
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                  </svg>
                </motion.a>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">🚚</span>
                  </div>
                  <span className="text-sm font-medium">شحن سريع مجاني</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">↩️</span>
                  </div>
                  <span className="text-sm font-medium">إرجاع خلال ١٤ يوم</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">🔒</span>
                  </div>
                  <span className="text-sm font-medium">دفع آمن</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* السلايدر */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative order-1 lg:order-2"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlideData.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full"
                  >
                    <Image
                      src={currentSlideData.src}
                      alt={currentSlideData.title}
                      fill
                      className="object-cover"
                      priority={currentSlide === 0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    
                    {/* شارة العرض */}
                    {currentSlideData.badge && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full shadow-lg">
                          {currentSlideData.badge}
                        </span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* أزرار التنقل */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
                  <motion.button
                    onClick={prevSlide}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                    aria-label="الشريحة السابقة"
                  >
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </motion.button>
                  
                  <motion.button
                    onClick={nextSlide}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                    aria-label="الشريحة التالية"
                  >
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </div>

                {/* مؤشرات الشرائح */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? "bg-white w-8" 
                          : "bg-white/60 hover:bg-white/80"
                      }`}
                      aria-label={`انتقل إلى الشريحة ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* بطاقة المنتج */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -left-6 w-80 bg-white rounded-2xl shadow-2xl p-6 hidden lg:block border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 relative flex-shrink-0 rounded-xl overflow-hidden shadow-md">
                  <Image 
                    src={currentSlideData.src} 
                    alt={currentSlideData.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg truncate">
                    {currentSlideData.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {currentSlideData.subtitle}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xl font-bold text-gray-900">
                      {formatEGP(currentSlideData.price)}
                    </span>
                    {currentSlideData.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatEGP(currentSlideData.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <motion.a
                href={currentSlideData.href}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                عرض التفاصيل
                <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;