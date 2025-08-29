import React from "react";

export const ErrorMessage = ({ message, onRetry }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex items-center justify-center">
    <div className="text-center text-white">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-gray-400 mb-6">Failed to load games data</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-300"
      >
        Reload Page
      </button>
    </div>
  </div>
);
