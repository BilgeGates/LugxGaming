import React, { useRef, useEffect } from "react";
import { Clock, X, Star, Gamepad2, Heart } from "lucide-react";

const RecentViewsModal = ({
  show,
  onClose,
  recentViews,
  clearRecentViews,
  handleGameSelect,
  formatTimeAgo,
  getUserRating,
  openRatingModal,
  toggleFavorite,
  isGameFavorited,
}) => {
  const modalRef = useRef(null);

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

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock size={24} />
            <h2 className="text-2xl font-bold">Recently Viewed</h2>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
              {recentViews.length} games
            </span>
          </div>
          <div>
            {recentViews.length > 0 && (
              <button
                onClick={clearRecentViews}
                className="text-white bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 transition"
                aria-label="Clear all recent views"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="ml-3 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              aria-label="Close recent views modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-3">
          {recentViews.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              No recent views yet.
            </p>
          ) : (
            recentViews.map((game) => (
              <div
                key={game.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
                onClick={() => handleGameSelect(game)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleGameSelect(game);
                }}
              >
                <img
                  src={
                    game.background_image || "https://via.placeholder.com/80x60"
                  }
                  alt={game.name}
                  className="w-20 h-12 object-cover rounded-lg shadow-sm"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/80x60?text=No+Image";
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{game.name}</h4>
                  <p className="text-sm text-gray-500">
                    Viewed {formatTimeAgo(game.released)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(game);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      isGameFavorited(game.id)
                        ? "text-red-500 hover:bg-red-50"
                        : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                    }`}
                    title={
                      isGameFavorited(game.id)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                    aria-pressed={isGameFavorited(game.id)}
                    aria-label={`${
                      isGameFavorited(game.id) ? "Remove" : "Add"
                    } ${game.name} from favorites`}
                  >
                    <Heart
                      size={20}
                      fill={isGameFavorited(game.id) ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openRatingModal(game, e);
                    }}
                    className="p-2 rounded-full text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 transition-colors"
                    title="Rate this game"
                    aria-label={`Rate ${game.name}`}
                  >
                    <Star
                      size={20}
                      fill={
                        getUserRating(game.id) > 0 ? "currentColor" : "none"
                      }
                      className={
                        getUserRating(game.id) > 0 ? "text-yellow-500" : ""
                      }
                    />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentViewsModal;
