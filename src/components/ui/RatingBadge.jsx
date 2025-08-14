import React from "react";

import { Star } from "lucide-react";

export const RatingBadge = ({ rating, size = "sm" }) => {
  if (!rating) return null;
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };
  const iconSizes = { sm: 10, md: 12, lg: 14 };

  return (
    <div
      className={`absolute top-2 left-2 inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-400 ${sizeClasses[size]} rounded-full backdrop-blur-sm`}
    >
      <Star size={iconSizes[size]} fill="currentColor" />
      <span>{rating.toFixed(1)}</span>
    </div>
  );
};
