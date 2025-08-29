import React, { useState, useEffect } from "react";

import useGameData from "../../../hooks/useGameData";
import useFavorites from "../../../hooks/useFavorites";
import useRating from "../../../hooks/useRating";
import useRecentViews from "../../../hooks/useRecentViews";

import GameCard from "../../common/GameCard";
import RatingModal from "../../common/RatingModal";

import { SectionHeader, LoadingSpinner, ErrorMessage } from "../../ui";

const TrendingSection = () => {
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
  const visibleGames = Array.isArray(allGames)
    ? [...allGames].sort((a, b) => (b.added || 0) - (a.added || 0)).slice(0, 12)
    : [];

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
          subtitle="Trending Now"
          title="Popular"
          description="Discover the hottest games everyone's playing right now. Join millions of gamers worldwide!"
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

export default TrendingSection;
