import React from "react";

export const LoadingSpinner = ({ size = "md", text = "Loading games..." }) => {
  const sizeClasses = { sm: "w-8 h-8", md: "w-16 h-16", lg: "w-24 h-24" };
  return (
    <div className="flex flex-col items-center gap-4 py-16">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin`}
        ></div>
        <div
          className={`absolute inset-0 ${sizeClasses[size]} border-4 border-cyan-200 border-b-cyan-500 rounded-full animate-spin`}
          style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
        />
      </div>
      {text && <p className="text-xl text-gray-300 animate-pulse">{text}</p>}
    </div>
  );
};
