const FooterSection = () => (
  <footer className="border-t">
    <div className="container mx-auto px-4 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
      <div>
        <div className="font-extrabold text-lg mb-2">متجرك</div>
        <p className="text-gray-600 dark:text-neutral-400">
          تجربة تسوق سهلة وسريعة مع خيارات دفع آمنة وشحن موثوق.
        </p>
      </div>
      <div>
        <div className="font-semibold mb-2">روابط مفيدة</div>
        <ul className="space-y-2 text-gray-600 dark:text-neutral-400">
          <li>
            <a href="#products" className="hover:underline">
              المنتجات
            </a>
          </li>
          <li>
            <a href="#offers" className="hover:underline">
              العروض
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              سياسة الخصوصية
            </a>
          </li>
        </ul>
      </div>
      <div>
        <div className="font-semibold mb-2">الدعم</div>
        <ul className="space-y-2 text-gray-600 dark:text-neutral-400">
          <li>
            <a href="#" className="hover:underline">
              الأسئلة الشائعة
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              تواصل معنا
            </a>
          </li>
        </ul>
      </div>
      <div>
        <div className="font-semibold mb-2">النشرة البريدية</div>
        <div className="flex gap-2">
          <input
            className="flex-1 px-3 py-2 rounded-xl border"
            placeholder="أدخل بريدك الإلكتروني"
          />
          <button className="px-4 py-2 rounded-xl bg-green-600 text-white">
            اشترك
          </button>
        </div>
      </div>
    </div>
    <div className="text-center text-xs text-gray-500 pb-6">
      © {new Date().getFullYear()} جميع الحقوق محفوظة.
    </div>
  </footer>
);

export default FooterSection;
