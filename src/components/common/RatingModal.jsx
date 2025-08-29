import React, { useRef, useEffect, useState } from "react";
import { Star, X } from "lucide-react";

const RatingModal = ({
  show,
  onClose,
  game,
  onSubmitRating,
  currentRating = 0,
}) => {
  const modalRef = useRef(null);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(currentRating);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key >= "1" && e.key <= "5") {
        const rating = parseInt(e.key);
        setSelectedRating(rating);
        onSubmitRating(rating);
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, show, onSubmitRating]);

  useEffect(() => {
    if (show && game) {
      setSelectedRating(currentRating);
      setHoveredRating(0);
    }
  }, [show, game, currentRating]);

  if (!show || !game) return null;

  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
    onSubmitRating(rating);
  };

  const handleStarHover = (rating) => {
    setHoveredRating(rating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const getStarState = (starNumber) => {
    const activeRating = hoveredRating || selectedRating;
    return starNumber <= activeRating;
  };

  const getRatingText = (rating) => {
    const texts = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent",
    };
    return texts[rating] || "Rate this game";
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-[999999]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rating-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="text-yellow-200 flex-shrink-0" size={24} />
              <h2 id="rating-modal-title" className="text-xl font-bold">
                Rate Game
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              aria-label="Close rating modal"
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
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/200x120?text=No+Image";
              }}
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {game.name}
            </h3>
            <p className="text-gray-600 mb-2">How would you rate this game?</p>
            {currentRating > 0 && (
              <p className="text-sm text-gray-500">
                Current rating: {currentRating} star
                {currentRating !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div className="text-center mb-4">
            <p className="text-lg font-medium text-gray-700 min-h-[1.5rem]">
              {getRatingText(hoveredRating || selectedRating)}
            </p>
          </div>

          <div
            className="flex justify-center gap-2 mb-6"
            onMouseLeave={handleStarLeave}
            role="radiogroup"
            aria-label="Game rating"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                className="p-2 rounded-full hover:bg-yellow-50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                role="radio"
                aria-checked={selectedRating === star}
                tabIndex={0}
              >
                <Star
                  size={32}
                  className={`transition-all duration-200 ${
                    getStarState(star)
                      ? "text-yellow-500 drop-shadow-sm"
                      : "text-gray-300 group-hover:text-yellow-400"
                  }`}
                  fill={getStarState(star) ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={2}
                />
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            {selectedRating > 0 && (
              <button
                onClick={() => handleRatingClick(selectedRating)}
                className="flex-1 px-4 py-2 text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg transition-all duration-200 font-medium"
              >
                Confirm Rating
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Press 1-5 keys for quick rating or ESC to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
