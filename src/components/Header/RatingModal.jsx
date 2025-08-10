import React, { useRef, useEffect } from "react";
import { Star, X } from "lucide-react";

const RatingModal = ({ show, onClose, game, onSubmitRating }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!show || !game) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="text-yellow-200" size={24} fill="currentColor" />
              <h2 className="text-xl font-bold">Rate Game</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <img
              src={
                game.background_image ||
                "https://via.placeholder.com/200x120?text=No+Image"
              }
              alt={game.name}
              className="w-32 h-20 object-cover rounded-lg mx-auto mb-4 shadow-md"
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {game.name}
            </h3>
            <p className="text-gray-600">How would you rate this game?</p>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => onSubmitRating(star)}
                className="p-2 rounded-full hover:bg-yellow-50 transition-colors group"
              >
                <Star
                  size={32}
                  className="text-yellow-400 group-hover:text-yellow-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                />
              </button>
            ))}
          </div>

          <div className="text-center text-sm text-gray-500">
            Click on a star to rate from 1 to 5
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
