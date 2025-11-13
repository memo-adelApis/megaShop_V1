"use client";
import { useState } from "react";

export default function ProductGallery({ images }) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="bg-white p-4 rounded-xl shadow border">
      <img
        src={images[current]}
        alt="صورة المنتج"
        className="w-full h-64 object-cover rounded-lg"
      />
      <div className="flex gap-2 mt-3">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt=""
            onClick={() => setCurrent(idx)}
            className={`w-16 h-16 object-cover rounded-lg cursor-pointer border 
              ${current === idx ? "border-green-500" : "border-gray-200"}`}
          />
        ))}
      </div>
    </div>
  );
}
