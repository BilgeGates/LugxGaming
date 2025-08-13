import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import useGameData from "../../../hooks/useGameData";
import useFavorites from "../../../hooks/useFavorites";
import useRating from "../../../hooks/useRating";
import useRecentViews from "../../../hooks/useRecentViews";

import GameCard from "../../common/GameCard";
import RatingModal from "../../common/RatingModal";

import { ExploreButton } from "../../ui/index";

import { TrendingUp } from "lucide-react";

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
  const visibleGames = Array.isArray(allGames) ? allGames.slice(0, 4) : [];

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
    <section className="relative min-h-[700px] overflow-hidden">
      <div className="relative z-10 container mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="p-3 rounded-full"
              style={{
                background:
                  "linear-gradient(45deg, rgb(34, 211, 238), rgb(168, 85, 247))",
              }}
            >
              <TrendingUp size={24} className="text-white" />
            </div>
            <div className="text-cyan-400 uppercase tracking-widest font-bold text-sm">
              Trending Now
            </div>
          </div>

          <h2 className="text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Most{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                background:
                  "linear-gradient(45deg, rgb(34, 211, 238), rgb(168, 85, 247))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Popular
            </span>{" "}
            Games
          </h2>

          <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover the hottest games everyone's playing right now. Join
            millions of gamers worldwide!
          </p>

          <Link to="/products">
            <ExploreButton>Explore All Games</ExploreButton>
          </Link>
        </div>

        {loading && (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
              <div
                className="absolute inset-0 w-16 h-16 border-4 border-cyan-200 border-b-cyan-500 rounded-full animate-spin"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "0.8s",
                }}
              ></div>
            </div>
            <p className="text-xl text-gray-300 animate-pulse">
              Loading games...
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md mx-auto">
              <p className="text-red-400 font-semibold text-lg">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {visibleGames.map((game, index) => (
              <GameCard
                key={game.id}
                game={game}
                onSelect={handleGameSelect}
                onRate={handleRatingClick}
                onToggleFavorite={toggleFavorite}
                isFavorited={isGameFavorited(game.id)}
                getUserRating={getUserRating}
                animated={animatedCards.includes(index)}
                showActions={true}
              />
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
