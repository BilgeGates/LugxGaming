import React from "react";
import { Link } from "react-router-dom";

import {
  ActionButton,
  RatingBadge,
  MetacriticScore,
  GameStats,
  GenreBadge,
} from "../ui/index";

import { Star, Heart, Trophy, Zap } from "lucide-react";

const GameCard = ({
  game,
  onSelect,
  onRate,
  onToggleFavorite,
  isFavorited = false,
  getUserRating = () => 0,
  showActions = true,
  animated = false,
  className = "",
}) => {
  const handleGameSelect = () => onSelect?.(game);
  const handleRatingClick = (e) => {
    e.stopPropagation();
    onRate?.(game, e);
  };
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite?.(game);
  };

  return (
    <div
      className={`transform transition-all duration-700 ${
        animated ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-1 border border-white/10 transition-all duration-300 hover:scale-105">
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
                <ActionButton
                  icon={Heart}
                  onClick={handleFavoriteClick}
                  title={
                    isFavorited ? "Remove from favorites" : "Add to favorites"
                  }
                  variant="favorite"
                  active={isFavorited}
                  size="md"
                />
                <ActionButton
                  icon={Star}
                  onClick={handleRatingClick}
                  title="Rate this game"
                  variant="rating"
                  active={getUserRating(game.id) > 0}
                  size="md"
                />
                <ActionButton
                  icon={Zap}
                  onClick={handleGameSelect}
                  title="View game details"
                  variant="primary"
                  size="md"
                />
              </div>
            )}

            {game.rating && <RatingBadge rating={game.rating} />}
            {game.metacritic && <MetacriticScore score={game.metacritic} />}
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-white text-lg leading-tight group-hover:text-cyan-400 transition-colors line-clamp-2">
              {game.name}
            </h3>

            <div className="flex items-center gap-2 flex-wrap">
              {game.genres &&
                game.genres.map((genre, idx) => {
                  return <GenreBadge key={idx} genre={genre} />;
                })}
            </div>

            <GameStats game={game} getUserRating={getUserRating} />
          </div>

          <Link to={`/products/${game.id}`}>
            <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
              <Trophy size={16} />
              Explore Now
            </button>
          </Link>
        </div>

        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
      </div>
    </div>
  );
};

export default GameCard;
