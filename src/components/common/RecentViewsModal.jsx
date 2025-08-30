import React, { useRef, useEffect } from "react";
import { Clock, X, Star, Heart, Search } from "lucide-react";

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
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden mx-4"
      >
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Clock className="text-purple-200 flex-shrink-0" size={24} />
              <h2 className="text-lg sm:text-2xl font-bold truncate">
                Recently Viewed
              </h2>
              <span className="hidden sm:inline-flex bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm flex-shrink-0">
                {recentViews.length} games
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {recentViews.length > 0 && (
                <button
                  onClick={clearRecentViews}
                  className="px-2 py-1 sm:px-3 sm:py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                aria-label="Close recent views modal"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          <span className="sm:hidden inline-flex bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs mt-2">
            {recentViews.length} games
          </span>
        </div>

        <div className="p-4 sm:p-6">
          {recentViews.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Search
                size={48}
                className="mx-auto text-gray-300 mb-4 sm:w-16 sm:h-16"
              />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                No recent views
              </h3>
              <p className="text-sm sm:text-base text-gray-500 px-4">
                Start browsing games and your recent views will appear here!
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] sm:max-h-96 overflow-y-auto">
              {recentViews.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleGameSelect(game)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleGameSelect(game);
                  }}
                >
                  <img
                    src={
                      game.background_image ||
                      "https://via.placeholder.com/80x60?text=No+Image"
                    }
                    alt={game.name}
                    className="w-16 h-10 sm:w-20 sm:h-12 object-cover rounded-lg shadow-sm flex-shrink-0"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/80x60?text=No+Image";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                      {game.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      Viewed {formatTimeAgo(game.released)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(game);
                      }}
                      className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                        isGameFavorited(game.id)
                          ? "text-red-500 bg-red-50 hover:bg-red-100"
                          : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                      }`}
                      title={
                        isGameFavorited(game.id)
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      <Heart
                        size={14}
                        fill={
                          isGameFavorited(game.id) ? "currentColor" : "none"
                        }
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openRatingModal(game, e);
                      }}
                      className="p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 transition-colors"
                      title="Rate this game"
                    >
                      <Star
                        size={14}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentViewsModal;
