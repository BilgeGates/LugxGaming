import React from "react";

export const MetacriticScore = ({ score, size = "sm" }) => {
  if (!score) return null;

  const getColor = (score) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-yellow-600";
    return "bg-red-600";
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  return (
    <div
      className={`${getColor(
        score
      )} absolute top-2 right-2 text-white font-bold rounded-lg backdrop-blur-sm ${
        sizeClasses[size]
      }`}
      title={`Metacritic Score: ${score}`}
    >
      {score}
    </div>
  );
};
