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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
      >
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-200" size={24} />
              <h2 className="text-2xl font-bold">Recently Viewed</h2>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                {recentViews.length} games
              </span>
            </div>
            <div className="flex items-center gap-2">
              {recentViews.length > 0 && (
                <button
                  onClick={clearRecentViews}
                  className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                aria-label="Close recent views modal"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {recentViews.length === 0 ? (
            <div className="text-center py-12">
              <Search size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No recent views
              </h3>
              <p className="text-gray-500">
                Start browsing games and your recent views will appear here!
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentViews.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(game);
                      }}
                      className={`p-2 rounded-full transition-colors ${
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
                        size={16}
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
                      className="p-2 rounded-full text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 transition-colors"
                      title="Rate this game"
                    >
                      <Star
                        size={16}
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
