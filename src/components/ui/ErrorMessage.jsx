import React from "react";

export const ErrorMessage = ({ message, onRetry }) => (
  <div className="text-center py-16">
    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md mx-auto">
      <div className="text-red-400 text-4xl mb-4">⚠️</div>
      <p className="text-red-400 font-semibold text-lg mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);
