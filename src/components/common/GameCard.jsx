import React from "react";
import { Link } from "react-router-dom";

import {
  CardOverlay,
  ExploreButton,
  RatingBadge,
  MetacriticScore,
  GameStats,
  GenreBadge,
} from "../ui/index";

const GameCard = ({
  game,
  getUserRating = () => 0,
  showActions = true,
  animated = false,
  className = "",
  onGameSelect,
  onRate,
  onToggleFavorite,
  isFavorited = false,
}) => {
  const handleExploreClick = () => {
    onGameSelect?.(game);
  };

  return (
    <div
      className={`transform transition-all duration-700 max-w-7xl ${
        animated ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
      style={{
        breakInside: "avoid",
        marginBottom: "1.5rem",
      }}
    >
      <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-1 border border-white/10 transition-all duration-300 hover:scale-105 ">
        <div className="relative z-10 p-3">
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
              <CardOverlay
                game={game}
                onSelect={onGameSelect}
                onRate={onRate}
                onToggleFavorite={onToggleFavorite}
                isFavorited={isFavorited}
                getUserRating={getUserRating}
              />
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

          <div className="mt-4">
            <Link to={`/products/${game.id}`}>
              <ExploreButton variant="cardButton" onClick={handleExploreClick}>
                Explore Now
              </ExploreButton>
            </Link>
          </div>
        </div>

        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
      </div>
    </div>
  );
};

export default GameCard;
