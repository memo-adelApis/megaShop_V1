"use client";
import { useState } from "react";

export default function ProductReviews({ reviews }) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (!comment) return;
    console.log("تعليق جديد:", { comment, rating });
    setComment("");
    setRating(0);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow border space-y-4">
      <h3 className="font-bold text-lg text-gray-800">التعليقات والتقييمات</h3>

      {/* عرض التعليقات */}
      <div className="space-y-3">
        {reviews.map((r, idx) => (
          <div key={idx} className="border-b pb-2">
            <p className="font-semibold text-gray-700">{r.user}</p>
            <p className="text-yellow-500">{"⭐".repeat(r.rating)}</p>
            <p className="text-gray-600">{r.comment}</p>
          </div>
        ))}
      </div>

      {/* إضافة تعليق */}
      <div className="space-y-2">
        <textarea
          placeholder="أضف تعليقك..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
        <div className="flex gap-2 items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl ${
                rating >= star ? "text-yellow-500" : "text-gray-400"
              }`}
              type="button"
            >
              ★
            </button>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          أضف تعليق
        </button>
      </div>
    </div>
  );
}
