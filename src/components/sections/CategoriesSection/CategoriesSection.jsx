import React, { useState, useEffect } from "react";

import useGameData from "../../../hooks/useGameData";
import useFavorites from "../../../hooks/useFavorites";
import useRating from "../../../hooks/useRating";
import useRecentViews from "../../../hooks/useRecentViews";

import GameCard from "../../common/GameCard";
import RatingModal from "../../common/RatingModal";

import { SectionHeader, LoadingSpinner, ErrorMessage } from "../../ui";

const Section = () => {
  const { allGames, loading, error } = useGameData();
  const { toggleFavorite, isGameFavorited } = useFavorites();
  const { getUserRating, submitRating } = useRating();
  const { addToRecentViews } = useRecentViews();

  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedGameForRating, setSelectedGameForRating] = useState(null);
  const [animatedCards, setAnimatedCards] = useState([]);

  const handleGameSelect = (game) => {
    addToRecentViews(game);
    window.open(`/products/${game.id}`, "_self");
  };

  const handleRatingClick = (game, e) => {
    e.stopPropagation();
    setSelectedGameForRating(game);
    setRatingModalOpen(true);
  };

  const handleRatingSubmit = (rating) => {
    if (selectedGameForRating) {
      submitRating(selectedGameForRating.id, rating);
      setRatingModalOpen(false);
      setSelectedGameForRating(null);
    }
  };

  const closeRatingModal = () => {
    setRatingModalOpen(false);
    setSelectedGameForRating(null);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // Genre popularity hesablama - daha dəqiq
  const genreStats = React.useMemo(() => {
    if (!Array.isArray(allGames)) return {};

    const stats = {};

    allGames.forEach((game) => {
      if (game.genres?.length > 0) {
        game.genres.forEach((genre) => {
          if (!stats[genre.id]) {
            stats[genre.id] = {
              id: genre.id,
              name: genre.name,
              count: 0,
              totalRating: 0,
              totalAdded: 0,
              games: [],
            };
          }

          stats[genre.id].count += 1;
          stats[genre.id].totalRating += game.rating || 0;
          stats[genre.id].totalAdded += game.added || 0;
          stats[genre.id].games.push(game);
        });
      }
    });

    return stats;
  }, [allGames]);

  // Ən populyar genrələri müəyyən et
  const popularGenres = React.useMemo(() => {
    return Object.values(genreStats)
      .sort((a, b) => {
        // Popularity formula: game count + average rating + total added
        const aScore =
          a.count * 0.4 +
          (a.totalRating / a.count || 0) * 0.3 +
          (a.totalAdded / 1000) * 0.3;
        const bScore =
          b.count * 0.4 +
          (b.totalRating / b.count || 0) * 0.3 +
          (b.totalAdded / 1000) * 0.3;
        return bScore - aScore;
      })
      .slice(0, 12);
  }, [genreStats]);

  // Hər genre üçün unique oyunu seç
  const visibleGames = React.useMemo(() => {
    const usedGameIds = new Set();
    const result = [];

    for (const genre of popularGenres) {
      // Genre-dəki oyunları rating və popularity-yə görə sort et
      const sortedGames = genre.games.sort((a, b) => {
        const aScore =
          (a.rating || 0) * 0.5 +
          (a.added || 0) * 0.3 +
          (a.metacritic || 0) * 0.2;
        const bScore =
          (b.rating || 0) * 0.5 +
          (b.added || 0) * 0.3 +
          (b.metacritic || 0) * 0.2;
        return bScore - aScore;
      });

      // İlk dəfə istifadə olunan oyunu tap
      const availableGame = sortedGames.find(
        (game) => !usedGameIds.has(game.id)
      );

      if (availableGame) {
        usedGameIds.add(availableGame.id);
        result.push({
          ...availableGame,
          genreInfo: {
            name: genre.name,
            gameCount: genre.count,
            averageRating: (genre.totalRating / genre.count).toFixed(1),
          },
        });
      }
    }

    return result;
  }, [popularGenres]);

  useEffect(() => {
    if (!loading && visibleGames.length > 0) {
      visibleGames.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedCards((prev) => [...prev, index]);
        }, index * 150);
      });
    }
  }, [loading, visibleGames, visibleGames.length]);

  return (
    <section className="relative min-h-[700px] overflow-hidden ">
      <div className="relative z-10 container mx-auto max-w-7xl px-6 py-20">
        <SectionHeader
          subtitle="Browse by Genre"
          title="Categories"
          description="Explore games by your favorite genres. From action-packed adventures to mind-bending puzzles, find your perfect match!"
        />

        {loading && <LoadingSpinner />}

        {error && <ErrorMessage />}

        {!loading && !error && (
          <div className="columns-1 sm:columns-2 lg:columns-4 gap-6">
            {visibleGames.map((game, index) => (
              <div key={game.id} className="mb-6 break-inside-avoid">
                <GameCard
                  game={game}
                  onSelect={handleGameSelect}
                  onRate={handleRatingClick}
                  onToggleFavorite={toggleFavorite}
                  isFavorited={isGameFavorited(game.id)}
                  getUserRating={getUserRating}
                  animated={animatedCards.includes(index)}
                  showActions={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <RatingModal
        show={ratingModalOpen}
        onClose={closeRatingModal}
        game={selectedGameForRating}
        onSubmitRating={handleRatingSubmit}
        currentRating={
          selectedGameForRating ? getUserRating(selectedGameForRating.id) : 0
        }
      />
    </section>
  );
};

export default Section;
