import React from "react";
import {
  Star,
  Heart,
  Calendar,
  Gamepad2,
  Zap,
  Users,
  Trophy,
  ArrowRight,
  Monitor,
  Smartphone,
} from "lucide-react";

const GameCard = ({
  game,
  onSelect,
  onRate,
  onToggleFavorite,
  isFavorited = false,
  userRating = 0,
  getUserRating = () => 0,
  showActions = true,
  animated = false,
  className = "",
}) => {
  const getPlatformIcon = (platforms) => {
    if (!platforms || platforms.length === 0) return <Gamepad2 size={14} />;

    const platformNames = platforms.map(
      (p) => p.platform?.name?.toLowerCase() || ""
    );

    if (platformNames.some((name) => name.includes("playstation")))
      return <Gamepad2 size={14} className="text-blue-400" />;
    if (platformNames.some((name) => name.includes("xbox")))
      return <Monitor size={14} className="text-green-400" />;
    if (
      platformNames.some(
        (name) => name.includes("pc") || name.includes("windows")
      )
    )
      return <Monitor size={14} className="text-gray-400" />;
    if (platformNames.some((name) => name.includes("nintendo")))
      return <Smartphone size={14} className="text-red-400" />;

    return <Gamepad2 size={14} />;
  };

  const getGenreColor = (genreName) => {
    const colors = {
      Action: "from-red-500 to-orange-500",
      Adventure: "from-green-500 to-teal-500",
      RPG: "from-purple-500 to-pink-500",
      Strategy: "from-blue-500 to-cyan-500",
      Sports: "from-yellow-500 to-orange-500",
      Racing: "from-red-500 to-yellow-500",
      Shooter: "from-gray-600 to-gray-800",
      Simulation: "from-indigo-500 to-purple-500",
    };

    return colors[genreName] || "from-gray-500 to-gray-600";
  };

  const handleGameSelect = () => {
    if (onSelect) {
      onSelect(game);
    }
  };

  const handleRatingClick = (e) => {
    e.stopPropagation();
    if (onRate) {
      onRate(game, e);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(game);
    }
  };

  return (
    <div
      className={`transform transition-all duration-700 ${
        animated ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-1 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
        <div className="relative z-10 p-5">
          <div className="relative aspect-video mb-4 rounded-xl overflow-hidden group/image">
            <img
              src={
                game.background_image ||
                "https://via.placeholder.com/400x225?text=No+Image"
              }
              alt={game.name}
              className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/400x225?text=No+Image";
              }}
            />

            {showActions && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                <button
                  onClick={handleFavoriteClick}
                  className={`p-3 rounded-full backdrop-blur-sm border transition-all duration-300 hover:scale-110 ${
                    isFavorited
                      ? "bg-red-500/80 text-white border-red-400 shadow-lg shadow-red-500/30"
                      : "bg-white/20 text-white border-white/30 hover:bg-red-500/80 hover:border-red-400"
                  }`}
                  title={
                    isFavorited ? "Remove from favorites" : "Add to favorites"
                  }
                  aria-label={
                    isFavorited ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  <Heart
                    size={18}
                    fill={isFavorited ? "currentColor" : "none"}
                  />
                </button>

                <button
                  onClick={handleRatingClick}
                  className={`p-3 rounded-full backdrop-blur-sm border transition-all duration-300 hover:scale-110 ${
                    getUserRating(game.id) > 0
                      ? "bg-yellow-500/80 text-white border-yellow-400 shadow-lg shadow-yellow-500/30"
                      : "bg-white/20 text-white border-white/30 hover:bg-yellow-500/80 hover:border-yellow-400"
                  }`}
                  title="Rate this game"
                  aria-label="Rate this game"
                >
                  <Star
                    size={18}
                    fill={getUserRating(game.id) > 0 ? "currentColor" : "none"}
                  />
                </button>

                <button
                  onClick={() => handleGameSelect()}
                  className="p-3 rounded-full bg-purple-600/80 text-white border border-purple-400 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-purple-700/80 shadow-lg shadow-purple-500/30"
                  title="View game details"
                  aria-label="View game details"
                >
                  <Zap size={18} />
                </button>
              </div>
            )}

            {game.rating && (
              <div className="absolute top-3 left-3 bg-black/80 text-white px-2 py-1 rounded-lg text-sm font-semibold flex items-center gap-1 backdrop-blur-sm">
                <Star
                  size={12}
                  className="text-yellow-400"
                  fill="currentColor"
                />
                {game.rating.toFixed(1)}
              </div>
            )}

            {game.metacritic && (
              <div
                className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-sm font-bold backdrop-blur-sm ${
                  game.metacritic >= 80
                    ? "bg-green-600/80 text-white"
                    : game.metacritic >= 60
                    ? "bg-yellow-600/80 text-white"
                    : "bg-red-600/80 text-white"
                }`}
              >
                {game.metacritic}
              </div>
            )}
          </div>

          <div className="space-y-3">
            {/* Game Title */}
            <h3 className="font-bold text-white text-lg leading-tight group-hover:text-cyan-400 transition-colors line-clamp-2">
              {game.name}
            </h3>

            <div className="flex items-center gap-2 flex-wrap">
              {game.genres && game.genres[0] && (
                <span
                  className={`inline-flex items-center gap-1 bg-gradient-to-r ${getGenreColor(
                    game.genres[0].name
                  )} text-white text-xs font-semibold px-2 py-1 rounded-full`}
                >
                  <Gamepad2 size={10} />
                  {game.genres[0].name}
                </span>
              )}

              {game.platforms && game.platforms.length > 0 && (
                <span className="inline-flex items-center gap-1 bg-gray-600/50 text-gray-200 text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                  {getPlatformIcon(game.platforms)}
                  <span className="max-w-16 truncate">
                    {game.platforms[0]?.platform?.name || "Multi"}
                  </span>
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-300">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>
                  {game.released
                    ? new Date(game.released).getFullYear()
                    : "TBA"}
                </span>
              </div>

              {game.ratings_count && (
                <div className="flex items-center gap-1">
                  <Users size={12} />
                  <span>
                    {game.ratings_count > 1000
                      ? `${Math.round(game.ratings_count / 1000)}k`
                      : game.ratings_count}
                  </span>
                </div>
              )}

              {getUserRating(game.id) > 0 && (
                <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                  <Star size={10} fill="currentColor" />
                  <span>{getUserRating(game.id).toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => handleGameSelect()}
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group/btn"
          >
            <Trophy size={16} className="group-hover/btn:animate-bounce" />
            Play Now
            <ArrowRight
              size={16}
              className="group-hover/btn:translate-x-1 transition-transform"
            />
          </button>
        </div>

        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
      </div>
    </div>
  );
};

export default GameCard;
