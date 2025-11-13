// components/admin/ExpandableDescription.jsx
"use client";
import { useState } from "react";

const DescriptionTD = ({ description, maxLines = 1 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!description) return "-";
  
  const shouldTruncate = description.length > 100; // يمكنك تعديل هذا الرقم
  
  return (
    <div className="p-3">
      <div 
        className={`${!isExpanded ? 'line-clamp-1' : ''} whitespace-pre-wrap`}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: !isExpanded ? maxLines : 'unset',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {description}
      </div>
      
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm mt-1 font-medium"
        >
          {isExpanded ? 'عرض أقل' : 'تحميل المزيد'}
        </button>
      )}
    </div>
  );
};

export default DescriptionTD;