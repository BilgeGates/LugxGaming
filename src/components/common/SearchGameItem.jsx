import React, { useCallback } from "react";

import {
  Clock,
  TrendingUp,
  Gamepad2,
  Star,
  Calendar,
  Heart,
} from "lucide-react";

import {
  safeGetRatingColor,
  safeGetUserRating,
  safeIsGameFavorited,
  getDisplayDate,
} from "../../utils";

const SearchGameItem = ({
  game,
  index,
  isRecent = false,
  isPopular = false,
  selectedResultIndex,
  onResultClick,
  onFavoriteToggle,
  onRatingClick,
  getRatingColor,
  getUserRating,
  isGameFavorited,
  formatDate,
}) => {
  const handleFavoriteToggle = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (onFavoriteToggle) {
        onFavoriteToggle(game);
      }
    },
    [onFavoriteToggle, game]
  );

  const handleRatingClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (onRatingClick) {
        onRatingClick(game, e);
      }
    },
    [onRatingClick, game]
  );

  if (!game || !game.id) return null;

  const userRating = safeGetUserRating(getUserRating, game.id);
  const isFavorited = safeIsGameFavorited(isGameFavorited, game.id);

  return (
    <div
      key={`${isRecent ? "recent" : isPopular ? "popular" : "search"}-${
        game.id
      }-${index}`}
      className={`flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out group opacity-0 animate-fadeIn hover:shadow-md ${
        selectedResultIndex === index
          ? "bg-purple-100 transform scale-102"
          : "hover:bg-gray-50"
      }`}
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: "forwards",
      }}
      onClick={() => onResultClick(game)}
      role="option"
      aria-selected={selectedResultIndex === index}
    >
      {(isRecent || isPopular) && (
        <div className="flex-shrink-0 hidden sm:block">
          {isRecent ? (
            <Clock size={16} className="text-blue-500" />
          ) : (
            <TrendingUp size={16} className="text-orange-500" />
          )}
        </div>
      )}

      <img
        src={
          game.background_image ||
          "https://via.placeholder.com/64x40?text=No+Image"
        }
        alt={game.name || "Game image"}
        className="w-12 h-8 sm:w-16 sm:h-10 object-cover rounded-md shadow-sm transition-transform duration-200 ease-in-out group-hover:scale-105 flex-shrink-0"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/64x40?text=No+Image";
        }}
      />

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-200 ease-in-out text-sm sm:text-base truncate">
          {game.name || "Unknown Game"}
          {isRecent && (
            <span className="ml-1 sm:ml-2 text-xs text-blue-500 font-normal hidden sm:inline">
              (Last searched)
            </span>
          )}
        </h4>
        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 flex-wrap">
          {game.genres && game.genres.length > 0 && (
            <span className="flex items-center gap-1">
              <Gamepad2 size={12} />
              <span className="truncate max-w-20 sm:max-w-none">
                {game.genres[0].name}
              </span>
            </span>
          )}
          {game.rating > 0 && (
            <span
              className={`flex items-center gap-1 text-yellow-400 ${safeGetRatingColor(
                getRatingColor,
                game.rating
              )}`}
            >
              <Star size={12} />
              {game.rating.toFixed(1)}
            </span>
          )}
          {game.released && (
            <span className="flex items-center gap-1 sm:flex">
              <Calendar size={12} />
              {getDisplayDate(formatDate, game.released)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {userRating > 0 && (
          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-1.5 sm:px-2 py-1 rounded-full text-xs select-none">
            <Star size={10} fill="currentColor" />
            <span className="hidden sm:inline">{userRating.toFixed(1)}</span>
          </div>
        )}

        <button
          onClick={handleRatingClick}
          title="Rate this game"
          className="p-1.5 sm:p-2 rounded-full text-yellow-500 hover:text-yellow-600 transition-all duration-200 ease-in-out hover:bg-yellow-50 hover:scale-110"
          aria-label={`Rate ${game.name}`}
        >
          <Star
            size={14}
            fill={userRating > 0 ? "currentColor" : "none"}
            stroke="currentColor"
          />
        </button>

        <button
          onClick={handleFavoriteToggle}
          className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 ease-in-out hover:scale-110 ${
            isFavorited
              ? "text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100"
              : "text-gray-400 hover:text-red-500 hover:bg-red-50"
          }`}
          title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          aria-label={
            isFavorited
              ? `Remove ${game.name} from favorites`
              : `Add ${game.name} to favorites`
          }
        >
          <Heart
            size={14}
            fill={isFavorited ? "currentColor" : "none"}
            stroke="currentColor"
          />
        </button>
      </div>
    </div>
  );
};

export default SearchGameItem;
