import React, { useState, useEffect, useRef } from "react";
import { Star, X } from "lucide-react";

const RatingModal = ({
  show,
  onClose,
  game,
  onSubmitRating,
  currentRating,
}) => {
  const [rating, setRating] = useState(currentRating || 0);
  const modalRef = useRef(null);

  useEffect(() => {
    setRating(currentRating || 0);
  }, [currentRating]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show, onClose]);

  if (!show || !game) return null;

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleSubmit = () => {
    onSubmitRating(rating);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-lg p-6 w-96 max-w-full"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rating-modal-title"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="rating-modal-title" className="text-xl font-semibold">
            Rate {game.name}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close rating modal"
            className="p-1 hover:bg-gray-200 rounded"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={32}
              className={`cursor-pointer ${
                rating >= star ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => handleStarClick(star)}
              aria-label={`${star} star`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleStarClick(star);
              }}
            />
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition"
        >
          Submit Rating
        </button>
      </div>
    </div>
  );
};

export default RatingModal;
