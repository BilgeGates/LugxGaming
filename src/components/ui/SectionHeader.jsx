import React from "react";
import { Link } from "react-router-dom";

import { ExploreButton } from "../ui";

import { TrendingUp } from "lucide-react";

export const SectionHeader = ({
  title,
  subtitle,
  description,
  className = "",
}) => (
  <div className={`text-center mb-16 ${className}`}>
    {subtitle && (
      <div className="flex items-center justify-center gap-3 mb-4">
        <div
          className="p-3 rounded-full"
          style={{
            background:
              "linear-gradient(45deg, rgb(34, 211, 238), rgb(168, 85, 247))",
          }}
        >
          <TrendingUp size={24} className="text-white" />
        </div>
        <div className="text-cyan-400 uppercase tracking-widest font-bold text-sm">
          {subtitle}
        </div>
      </div>
    )}
    {title && (
      <h2 className="text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
        Most{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{
            background:
              "linear-gradient(45deg, rgb(34, 211, 238), rgb(168, 85, 247))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {title}
        </span>{" "}
        Games
      </h2>
    )}
    {description && (
      <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
        {description}
      </p>
    )}
    <Link to="/products">
      <ExploreButton variant="sectionButton">Explore All Games</ExploreButton>
    </Link>
  </div>
);
