"use client";

export default function ProductDetails({ product }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow border">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
      <p className="text-gray-600">{product.description}</p>
    </div>
  );
}
