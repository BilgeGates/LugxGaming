import React, { useRef, useEffect } from "react";
import { Heart, Pin, Trash2, Gamepad2, Star, Calendar, X } from "lucide-react";

const FavoritesModal = ({
  show,
  onClose,
  favorites,
  pinnedFavorites,
  toggleFavorite,
  togglePin,
  removeFavorite,
  handleGameSelect,
  getSortedFavorites,
  isGamePinned,
  getUserRating,
  openRatingModal,
  getRatingColor,
  formatDate,
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
  }, [onClose, show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden mx-4"
      >
        <div
          className="bg-gradient-to-r from-red-500 to-rose-500
 text-white p-4 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Heart className="text-red-200 flex-shrink-0" size={24} />
              <h2 className="text-lg sm:text-2xl font-bold truncate">
                My Favorites
              </h2>
              <span className="hidden sm:inline-flex bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm flex-shrink-0">
                {favorites.length} games
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors flex-shrink-0"
              aria-label="Close favorites modal"
            >
              <X size={18} />
            </button>
          </div>
          <span className="sm:hidden inline-flex bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs mt-2">
            {favorites.length} games
          </span>
        </div>
        <div className="p-4 sm:p-6">
          {favorites.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Heart
                size={48}
                className="mx-auto text-gray-300 mb-4 sm:w-16 sm:h-16"
              />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                No favorites yet
              </h3>
              <p className="text-sm sm:text-base text-gray-500 px-4">
                Start adding games to your favorites by clicking the heart icon!
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] sm:max-h-96 overflow-y-auto">
              {getSortedFavorites.map((game) => (
                <div
                  key={game.id}
                  className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all duration-200 ${
                    isGamePinned(game.id)
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-400"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  {isGamePinned(game.id) && (
                    <Pin
                      size={14}
                      className="text-blue-500 flex-shrink-0"
                      fill="currentColor"
                    />
                  )}
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
                  <div
                    className="flex-1 cursor-pointer min-w-0"
                    onClick={() => handleGameSelect(game)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleGameSelect(game);
                    }}
                  >
                    <h4 className="font-semibold text-gray-800 hover:text-purple-600 transition-colors text-sm sm:text-base truncate">
                      {game.name}
                    </h4>
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 mt-1 overflow-hidden">
                      {game.genres && game.genres.length > 0 && (
                        <span className="flex items-center gap-1 flex-shrink-0">
                          <Gamepad2 size={10} className="sm:w-3 sm:h-3" />
                          <span className="truncate">
                            {game.genres[0].name}
                          </span>
                        </span>
                      )}
                      {game.rating && (
                        <span
                          className={`flex items-center gap-1 flex-shrink-0 ${getRatingColor(
                            game.rating
                          )}`}
                        >
                          <Star size={10} className="sm:w-3 sm:h-3" />
                          {game.rating}
                        </span>
                      )}
                      <span className="hidden sm:flex items-center gap-1 flex-shrink-0">
                        <Calendar size={12} />
                        {formatDate(game.released)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => openRatingModal(game, e)}
                      className="p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 transition-colors"
                      title="Rate this game"
                      aria-label={`Rate ${game.name}`}
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePin(game.id);
                      }}
                      className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                        isGamePinned(game.id)
                          ? "text-blue-500 bg-blue-50 hover:bg-blue-100"
                          : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                      }`}
                      title={
                        isGamePinned(game.id) ? "Unpin from top" : "Pin to top"
                      }
                      aria-pressed={isGamePinned(game.id)}
                    >
                      <Pin
                        size={14}
                        fill={isGamePinned(game.id) ? "currentColor" : "none"}
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(game.id);
                      }}
                      className="p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Remove from favorites"
                      aria-label={`Remove ${game.name} from favorites`}
                    >
                      <Trash2 size={14} />
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

export default FavoritesModal;
