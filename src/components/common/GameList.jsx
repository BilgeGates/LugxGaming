import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Users, Eye } from "lucide-react";
import GameCard from "./GameCard";
import useGameData from "../../hooks/useGameData";
import { formatReleaseDate, formatRatingScore } from "../../utils";
import { CardOverlay } from "../ui";

/**
 * Fixed GamesList Component
 * Resolved navigation conflicts and improved event handling
 */
const GamesList = ({
  viewMode = "grid",
  handleGameSelect,
  getUserRating,
  openRatingModal,
  toggleFavorite,
  isGameFavorited,
  getPlatformIcon,
  ...props
}) => {
  const { allGames, loading, error, searchResults, showResults } =
    useGameData();
  const navigate = useNavigate();

  const renderPlatformIcon = useCallback((platform, index, gameId) => {
    if (!platform) return null;
    try {
      const PlatformIcon = getPlatformIcon([platform]);
      if (PlatformIcon) {
        return (
          <PlatformIcon
            key={`${gameId}-platform-${index}`}
            className="w-5 h-5 text-gray-400"
          />
        );
      }
    } catch (error) {
      console.error("Platform icon error:", error);
    }
    return (
      <div
        key={`${gameId}-platform-${index}`}
        className="w-5 h-5 bg-gray-600 rounded"
      />
    );
  }, []);

  const handleListItemClick = useCallback(
    (game, event) => {
      const target = event.target;
      const isInteractiveElement =
        target.closest("button") ||
        target.closest("a") ||
        target.closest('[role="button"]');

      if (!isInteractiveElement) {
        if (handleGameSelect && typeof handleGameSelect === "function") {
          handleGameSelect(game);
        }
        navigate(`/products/${game.id}`);
      }
    },
    [handleGameSelect, navigate]
  );

  const handleExploreClick = useCallback(
    (game, event) => {
      event.stopPropagation();
      event.preventDefault();

      if (handleGameSelect && typeof handleGameSelect === "function") {
        handleGameSelect(game);
      }
      navigate(`/products/${game.id}`);
    },
    [handleGameSelect, navigate]
  );

  const ListViewItem = ({ game }) => {
    const primaryGenre = game.genres?.[0]?.name || "Unknown";
    const releaseDate = formatReleaseDate(game.released);
    const ratingScore = formatRatingScore(game.rating);

    return (
      <div
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer max-w-7xl"
        onClick={(e) => handleListItemClick(game, e)}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${game.name}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleListItemClick(game, e);
          }
        }}
      >
        <div className="flex gap-6">
          <div className="relative w-48 h-28 rounded-xl overflow-hidden flex-shrink-0">
            <img
              src={game.background_image || "/placeholder-game.jpg"}
              alt={game.name || "Game"}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              loading="lazy"
              onError={(e) => (e.target.src = "/placeholder-game.jpg")}
            />
            <div className="absolute top-2 right-2">
              <span className="px-2 py-1 rounded-full text-xs font-bold text-white bg-black/70">
                {ratingScore}%
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <span className="text-sm text-cyan-400 font-medium">
                {primaryGenre}
              </span>
              <h3 className="text-xl font-bold text-white mb-2 hover:text-cyan-400 transition-colors">
                {game.name || "Unknown Game"}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {releaseDate}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {game.ratings_count || 0} reviews
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(game.platforms || [])
                  .slice(0, 3)
                  .map((p, idx) => renderPlatformIcon(p, idx, game.id))}
              </div>
              <button
                onClick={(e) => handleExploreClick(game, e)}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2"
                aria-label={`Explore ${game.name}`}
              >
                <Eye className="w-4 h-4" />
                Explore
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const gamesToDisplay = showResults ? searchResults : allGames;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {loading && <p className="text-center text-gray-500">Loading games...</p>}
      {error && (
        <p className="text-center text-red-500 font-semibold">{error}</p>
      )}

      {!loading && !error && (
        <>
          {gamesToDisplay.length === 0 ? (
            <p className="text-center text-gray-600">No results found</p>
          ) : viewMode === "list" ? (
            <div className="space-y-6">
              {gamesToDisplay.map((game) => (
                <ListViewItem key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="masonry-container">
              {gamesToDisplay.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  animated={true}
                  getUserRating={getUserRating}
                  onGameSelect={handleGameSelect}
                  onRate={openRatingModal}
                  onToggleFavorite={toggleFavorite}
                  isFavorited={isGameFavorited(game.id)}
                  style={{ breakInside: "avoid", marginBottom: "1.5rem" }}
                  CardOverlay={CardOverlay}
                  {...props}
                />
              ))}
            </div>
          )}
        </>
      )}

      <style>{`
        .masonry-container {
          columns: 1;
          column-gap: 1.5rem;
        }

        @media (min-width: 640px) { .masonry-container { columns: 2; } }
        @media (min-width: 768px) { .masonry-container { columns: 3; } }
        @media (min-width: 1024px) { .masonry-container { columns: 4; } }
      `}</style>
    </div>
  );
};

export default GamesList;
