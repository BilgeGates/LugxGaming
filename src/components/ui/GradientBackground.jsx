import React from "react";

export const GradientBackground = ({ className = "" }) => (
  <>
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-20 left-16 w-32 h-32 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
      <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-75"></div>
      <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-gradient-to-r from-green-400 to-teal-500 rounded-full"></div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
    <div
      className={`absolute inset-0 opacity-20 ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, cyan 1px, transparent 1px), 
                          radial-gradient(circle at 75% 75%, purple 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
      }}
    />
  </>
);
