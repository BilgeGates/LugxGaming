import React, { useRef, useEffect } from "react";
import { Search, Gamepad2, Calendar, Star, Heart, X } from "lucide-react";

const RecentModal = ({
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Search className="text-blue-300" size={24} />
              <h2 className="text-2xl font-bold">Recent Views</h2>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                {recentViews.length} games
              </span>
            </div>
            <div className="flex items-center gap-2">
              {recentViews.length > 0 && (
                <button
                  onClick={clearRecentViews}
                  className="px-3 py-2 bg-white bg-opacity-20 rounded-lg text-sm hover:bg-opacity-30 transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
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
                Games you view will appear here for quick access!
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentViews.map((game) => (
                <div
                  key={`${game.id}-${game.viewedAt}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
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

                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => handleGameSelect(game)}
                  >
                    <h4 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                      {game.name}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                      {game.genres && game.genres.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Gamepad2 size={12} />
                          {game.genres[0].name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        Viewed {formatTimeAgo(game.viewedAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => openRatingModal(game, e)}
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

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(game);
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        isGameFavorited(game.id)
                          ? "text-red-500 hover:text-red-600"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        size={16}
                        fill={
                          isGameFavorited(game.id) ? "currentColor" : "none"
                        }
                      />
                    </button>

                    {getUserRating(game.id) > 0 && (
                      <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                        <Star size={12} fill="currentColor" />
                        {getUserRating(game.id)}
                      </div>
                    )}

                    {game.metacritic && (
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${
                          game.metacritic >= 80
                            ? "bg-green-100 text-green-800"
                            : game.metacritic >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {game.metacritic}
                      </div>
                    )}
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

export default RecentModal;
