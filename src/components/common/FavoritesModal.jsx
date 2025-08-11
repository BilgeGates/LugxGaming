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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
      >
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="text-red-300" size={24} fill="currentColor" />
              <h2 className="text-2xl font-bold">My Favorites</h2>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                {favorites.length} games
              </span>
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
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No favorites yet
              </h3>
              <p className="text-gray-500">
                Start adding games to your favorites by clicking the heart icon!
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getSortedFavorites.map((game) => (
                <div
                  key={game.id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                    isGamePinned(game.id)
                      ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  {isGamePinned(game.id) && (
                    <Pin
                      size={16}
                      className="text-yellow-500"
                      fill="currentColor"
                    />
                  )}
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
                    <h4 className="font-semibold text-gray-800 hover:text-purple-600 transition-colors">
                      {game.name}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                      {game.genres && game.genres.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Gamepad2 size={12} />
                          {game.genres[0].name}
                        </span>
                      )}
                      {game.rating && (
                        <span
                          className={`flex items-center gap-1 ${getRatingColor(
                            game.rating
                          )}`}
                        >
                          <Star size={12} />
                          {game.rating}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(game.released)}
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
                        togglePin(game.id);
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        isGamePinned(game.id)
                          ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100"
                          : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                      }`}
                      title={
                        isGamePinned(game.id) ? "Unpin from top" : "Pin to top"
                      }
                    >
                      <Pin
                        size={16}
                        fill={isGamePinned(game.id) ? "currentColor" : "none"}
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(game.id);
                      }}
                      className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 size={16} />
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
