import React from "react";

export const ExploreButton = ({
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  children,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`group relative inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${className}`}
    >
      {LeftIcon && (
        <LeftIcon size={20} className="group-hover:animate-bounce" />
      )}
      <span>{children}</span>
      {RightIcon && <RightIcon size={20} />}
    </button>
  );
};
