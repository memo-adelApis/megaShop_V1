import { Star } from "lucide-react";

const Rating = ({ value }) => (
  <div className="flex items-center gap-1" aria-label={`تقييم ${value}`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i + 1 <= Math.round(value)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ))}
    <span className="text-sm text-gray-500">{value.toFixed(1)}</span>
  </div>
);

export default Rating;
