import React from "react";
import { Star, Heart, Calendar, Gamepad2, Pin, Trash2 } from "lucide-react";

const GameCard = ({
  game,
  onSelect,
  onRate,
  onToggleFavorite,
  onTogglePin,
  onRemoveFavorite,
  isFavorited = false,
  isPinned = false,
  userRating = 0,
  showActions = true,
  showPin = false,
  showRemove = false,
  viewedAt = null,
  formatTimeAgo = null,
  variant = "default",
}) => {
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-green-500";
    if (rating >= 4) return "text-yellow-500";
    if (rating >= 3) return "text-orange-500";
    return "text-red-500";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).getFullYear();
  };

  const cardClasses = {
    default:
      "flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors group",
    search:
      "flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors group",
    favorites: `flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
      isPinned
        ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400"
        : "bg-gray-50 hover:bg-gray-100"
    }`,
    recent:
      "flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors",
  };

  return (
    <div className={cardClasses[variant]}>
      {variant === "favorites" && isPinned && (
        <Pin size={16} className="text-yellow-500" fill="currentColor" />
      )}

      <img
        src={
          game.background_image ||
          "https://via.placeholder.com/80x60?text=No+Image"
        }
        alt={game.name}
        className={`object-cover rounded-lg shadow-sm ${
          variant === "search" ? "w-16 h-10" : "w-20 h-12"
        }`}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/80x60?text=No+Image";
        }}
      />

      <div className="flex-1 cursor-pointer" onClick={() => onSelect(game)}>
        <h4
          className={`font-semibold transition-colors ${
            variant === "search"
              ? "text-gray-800 group-hover:text-purple-600"
              : variant === "favorites"
              ? "text-gray-800 hover:text-purple-600"
              : variant === "recent"
              ? "text-gray-800 hover:text-blue-600"
              : "text-gray-800"
          }`}
        >
          {game.name}
        </h4>

        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1 flex-wrap">
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
            {viewedAt && formatTimeAgo
              ? `Viewed ${formatTimeAgo(viewedAt)}`
              : formatDate(game.released)}
          </span>
        </div>
      </div>

      {showActions && (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRate?.(game, e);
            }}
            className="p-2 rounded-full text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 transition-colors"
            title="Rate this game"
          >
            <Star
              size={16}
              fill={userRating > 0 ? "currentColor" : "none"}
              className={userRating > 0 ? "text-yellow-500" : ""}
            />
          </button>

          {showPin && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin?.(game.id);
              }}
              className={`p-2 rounded-full transition-colors ${
                isPinned
                  ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100"
                  : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
              }`}
              title={isPinned ? "Unpin from top" : "Pin to top"}
            >
              <Pin size={16} fill={isPinned ? "currentColor" : "none"} />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(game);
            }}
            className={`p-2 rounded-full transition-colors ${
              isFavorited
                ? "text-red-500 hover:text-red-600"
                : "text-gray-400 hover:text-red-500"
            } hover:bg-red-50`}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={16} fill={isFavorited ? "currentColor" : "none"} />
          </button>

          {showRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFavorite?.(game.id);
              }}
              className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Remove from favorites"
            >
              <Trash2 size={16} />
            </button>
          )}

          {userRating > 0 && (
            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
              <Star size={12} fill="currentColor" />
              {userRating}
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
      )}
    </div>
  );
};

export default GameCard;
