import React from "react";

export const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  description,
  action,
  className = "",
}) => (
  <div className={`text-center mb-16 ${className}`}>
    <div className="flex items-center justify-center gap-3 mb-4">
      <div
        className="p-3 rounded-full"
        style={{
          background:
            "linear-gradient(45deg, rgb(34, 211, 238), rgb(168, 85, 247))",
        }}
      >
        <Icon size={24} className="text-white" />
      </div>
      {subtitle && (
        <div className="text-cyan-400 uppercase tracking-widest font-bold text-sm">
          {subtitle}
        </div>
      )}
    </div>

    <h2 className="text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
      {title}
    </h2>

    {description && (
      <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
        {description}
      </p>
    )}

    {action && action}
  </div>
);
