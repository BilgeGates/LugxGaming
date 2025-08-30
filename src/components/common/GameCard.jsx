import React, { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  CardOverlay,
  ExploreButton,
  RatingBadge,
  MetacriticScore,
  GameStats,
  GenreBadge,
} from "../ui/index";

/**
 * GameCard Component
 *
 * Enhanced game card component with:
 * - Reliable navigation handling
 * - Memory leak prevention
 * - Proper event handling
 * - Performance optimizations
 * - Better error handling
 */
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
  const navigate = useNavigate();

  /**
   * Handle game selection and navigation
   * Using useCallback for performance and useNavigate for reliability
   * Ensures proper navigation without Link/onClick conflicts
   */
  const handleExploreClick = useCallback(
    (event) => {
      // Prevent default link behavior to avoid conflicts
      event.preventDefault();
      event.stopPropagation();

      // Call game selection callback if provided
      if (onGameSelect && typeof onGameSelect === "function") {
        onGameSelect(game);
      }

      // Navigate programmatically for better control
      if (game?.id) {
        navigate(`/products/${game.id}`);
      }
    },
    [game, onGameSelect, navigate]
  );

  /**
   * Handle card click (entire card is clickable)
   * Provides better UX by making entire card interactive
   */
  const handleCardClick = useCallback(
    (event) => {
      // Only handle if click is not on interactive elements
      const target = event.target;
      const isInteractiveElement =
        target.closest("button") ||
        target.closest('[role="button"]') ||
        target.closest("a") ||
        target.closest(".interactive-element");

      if (!isInteractiveElement && game?.id) {
        navigate(`/products/${game.id}`);

        // Call game selection callback if provided
        if (onGameSelect && typeof onGameSelect === "function") {
          onGameSelect(game);
        }
      }
    },
    [game, onGameSelect, navigate]
  );

  /**
   * Handle image load errors
   * Provides fallback image and prevents broken images
   */
  const handleImageError = useCallback((event) => {
    event.target.src = "https://via.placeholder.com/400x225?text=No+Image";
  }, []);

  // Early return if no game data
  if (!game) {
    return null;
  }

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
      <div
        className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-1 border border-white/10 transition-all duration-300 hover:scale-105 cursor-pointer"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${game.name}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick(e);
          }
        }}
      >
        <div className="relative z-10 p-3">
          {/* Game Image Section */}
          <div className="relative aspect-video mb-4 rounded-xl overflow-hidden group/image">
            <img
              src={
                game.background_image ||
                "https://via.placeholder.com/400x225?text=No+Image"
              }
              alt={game.name || "Game image"}
              className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-500"
              onError={handleImageError}
              loading="lazy"
            />

            {/* Card Actions Overlay */}
            {showActions && (
              <div className="interactive-element">
                <CardOverlay
                  game={game}
                  onSelect={onGameSelect}
                  onRate={onRate}
                  onToggleFavorite={onToggleFavorite}
                  isFavorited={isFavorited}
                  getUserRating={getUserRating}
                />
              </div>
            )}

            {/* Rating and Metacritic Badges */}
            {game.rating && <RatingBadge rating={game.rating} />}
            {game.metacritic && <MetacriticScore score={game.metacritic} />}
          </div>

          {/* Game Information Section */}
          <div className="space-y-3">
            {/* Game Title */}
            <h3 className="font-bold text-white text-lg leading-tight group-hover:text-cyan-400 transition-colors line-clamp-2">
              {game.name || "Unknown Game"}
            </h3>

            {/* Genre Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {game.genres &&
                game.genres.length > 0 &&
                game.genres.map((genre, idx) => {
                  return (
                    <GenreBadge key={`${game.id}-genre-${idx}`} genre={genre} />
                  );
                })}
            </div>

            {/* Game Statistics */}
            <GameStats game={game} getUserRating={getUserRating} />
          </div>

          {/* Explore Button Section */}
          <div className="mt-4 interactive-element">
            {/* Using div instead of Link to avoid nested navigation issues */}
            <div onClick={handleExploreClick}>
              <ExploreButton
                variant="cardButton"
                onClick={handleExploreClick}
                aria-label={`Explore ${game.name}`}
              >
                Explore Now
              </ExploreButton>
            </div>
          </div>
        </div>

        {/* Hover Effect Background */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
      </div>
    </div>
  );
};

export default GameCard;
