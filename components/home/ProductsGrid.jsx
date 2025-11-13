import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ProductCard from "./ProductCard";
import SectionTitle from "./SectionTitle";



const ProductsGrid = ({ filtered, sort, setSort, addToCart }) => (
  <section id="products" className="container mx-auto px-4 pb-14">
    <SectionTitle description="منتجات مختارة بعناية مع أسعار مميزة وتقييمات من عملائنا.">
      منتجاتنا
    </SectionTitle>
    <div className="flex items-center justify-end gap-2 mb-4">
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="px-3 py-2 rounded-xl border"
      >
        <option value="popular">الأكثر شيوعًا</option>
        <option value="price-asc">السعر: من الأقل للأعلى</option>
        <option value="price-desc">السعر: من الأعلى للأقل</option>
        <option value="rating">الأعلى تقييمًا</option>
      </select>
    </div>
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {filtered.map((p) => (
        <ProductCard key={p._id} product={p} onAdd={addToCart} />
      ))}
    </motion.div>
    <div className="mt-8 flex items-center justify-center gap-2">
      <button className="p-2 rounded-lg border">
        <ChevronRight className="w-4 h-4" />
      </button>
      <button className="px-4 py-2 rounded-lg border bg-gray-100">1</button>
      <button className="px-4 py-2 rounded-lg border">2</button>
      <button className="p-2 rounded-lg border">
        <ChevronLeft className="w-4 h-4" />
      </button>
    </div>
  </section>
);

export default ProductsGrid;
