import React from "react";
import { AnimatedCounter } from "./AnimatedCounter";

export const QuickStats = ({ stats, className = "" }) => (
  <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
    {stats.map((stat, index) => (
      <div
        key={index}
        className="bg-white/5 rounded-xl p-4 text-center border border-white/10"
      >
        <div className="text-2xl mb-2">{stat.icon}</div>
        <div className="text-2xl font-bold text-white mb-1">
          <AnimatedCounter value={stat.value} />
        </div>
        <div className="text-sm text-gray-400">{stat.label}</div>
      </div>
    ))}
  </div>
);
