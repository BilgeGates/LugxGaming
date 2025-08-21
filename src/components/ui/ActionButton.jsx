import React from "react";

export const ActionButton = ({
  icon: Icon,
  onClick,
  title,
  variant = "default",
  active = false,
  size = "md",
}) => {
  const variants = {
    default: "bg-white/20 text-white border-white/30 hover:bg-white/30",
    favorite: active
      ? "bg-red-500/80 text-white border-red-400 shadow-lg shadow-red-500/30"
      : "bg-white/20 text-white border-white/30 hover:bg-red-500/80 hover:border-red-400",
    rating: active
      ? "bg-yellow-500/80 text-white border-yellow-400 shadow-lg shadow-yellow-500/30"
      : "bg-white/20 text-white border-white/30 hover:bg-yellow-500/80 hover:border-yellow-400",
    primary:
      "bg-purple-600/80 text-white border-purple-400 hover:bg-purple-700/80 shadow-lg shadow-purple-500/30",
  };

  const sizes = { sm: "p-2", md: "p-3", lg: "p-4" };
  const iconSizes = { sm: 14, md: 18, lg: 22 };

  return (
    <button
      onClick={onClick}
      className={`${sizes[size]} rounded-full backdrop-blur-sm border transition-all duration-300 hover:scale-110 ${variants[variant]}`}
      title={title}
      aria-label={title}
    >
      <Icon size={iconSizes[size]} fill={active ? "currentColor" : "none"} />
    </button>
  );
};
