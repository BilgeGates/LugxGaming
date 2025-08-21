import React from "react";

import { ArrowRight, Gamepad2 } from "lucide-react";

const styles = {
  sectionButton:
    "group relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-sky-400 hover:from-indigo-600 hover:to-sky-500 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105",
  cardButton:
    "w-full mt-4 bg-gradient-to-r from-indigo-500 to-sky-400 hover:from-indigo-600 hover:to-sky-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2",
};

export const ExploreButton = ({
  children,
  variant = "sectionButton",
  className = "",
  onClick,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={`${styles[variant]} ${className}`}
      {...props}
    >
      <Gamepad2 size={20} className="group-hover:animate-bounce" />
      <span>{children}</span>
      <ArrowRight size={20} />
    </button>
  );
};
