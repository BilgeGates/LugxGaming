import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useGameData,
  useFavorites,
  useRecentViews,
  useRating,
} from "../../../hooks";

import FavoritesModal from "../../../components/common/FavoritesModal";
import RecentViewsModal from "../../../components/common/RecentViewsModal";
import RatingModal from "../../../components/common/RatingModal";

import HeroSection from "./HeroSection";

import { Search, Star, TrendingUp, Heart } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showRecentModal, setShowRecentModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingGameData, setRatingGameData] = useState(null);

  const gameData = useGameData();
  const favorites = useFavorites();
  const recentViews = useRecentViews();
  const rating = useRating();

  const handleGameSelect = (game) => {
    recentViews.addToRecentViews(game);
    navigate(`/products/${game.id}`);
    setShowFavoritesModal(false);
    setShowRecentModal(false);
  };

  const openRatingModal = (game, event) => {
    event?.stopPropagation();
    setRatingGameData(game);
    setShowRatingModal(true);
  };

  const submitRating = (ratingValue) => {
    if (ratingGameData) {
      rating.submitRating(ratingGameData.id, ratingValue);
      setShowRatingModal(false);
      setRatingGameData(null);
    }
  };

  const stats = [
    {
      icon: TrendingUp,
      label: `${gameData.allGames?.length ?? 0} games`,
      color: "text-cyan-400",
    },
    {
      icon: Star,
      label: "RAWG DB",
      color: "text-yellow-400",
    },
    {
      icon: Heart,
      label: `${favorites.favorites?.length ?? 0} favorites`,
      color: "text-red-400",
      onClick: () => setShowFavoritesModal(true),
      clickable: true,
    },
    {
      icon: Search,
      label: `${recentViews.recentViews?.length ?? 0} recent`,
      color: "text-blue-400",
      onClick: () => setShowRecentModal(true),
      clickable: true,
    },
  ];

  return (
    <div className="relative z-[9996] max-w-7xl mx-auto ">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-pink-500 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-cyan-500 rounded-full animate-bounce"></div>
        <div
          className="absolute bottom-32 left-32 w-24 h-24 bg-yellow-500 rounded-full opacity-75"
          style={{ animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite" }}
        ></div>
        <div className="absolute bottom-10 right-10 w-12 h-12 bg-green-500 rounded-full animate-spin"></div>
      </div>

      <RatingModal
        show={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        game={ratingGameData}
        onSubmitRating={submitRating}
        currentRating={rating.getUserRating(ratingGameData?.id)}
      />

      <FavoritesModal
        show={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        favorites={favorites.favorites}
        toggleFavorite={favorites.toggleFavorite}
        pinnedFavorites={favorites.pinnedFavorites}
        togglePin={favorites.togglePin}
        isGamePinned={favorites.isGamePinned}
        removeFavorite={favorites.removeFavorite}
        handleGameSelect={handleGameSelect}
        openRatingModal={openRatingModal}
        getUserRating={rating.getUserRating}
        getRatingColor={rating.getRatingColor}
        formatDate={gameData.formatDate}
        getSortedFavorites={favorites.getSortedFavorites}
      />

      <RecentViewsModal
        show={showRecentModal}
        onClose={() => setShowRecentModal(false)}
        recentViews={recentViews.recentViews}
        clearRecentViews={recentViews.clearRecentViews}
        handleGameSelect={handleGameSelect}
        formatTimeAgo={gameData.formatTimeAgo}
        getUserRating={rating.getUserRating}
        openRatingModal={openRatingModal}
        toggleFavorite={favorites.toggleFavorite}
        isGameFavorited={favorites.isGameFavorited}
      />

      <HeroSection
        allGames={gameData.allGames}
        loading={gameData.loading}
        stats={stats}
        handleGameSelect={handleGameSelect}
        openRatingModal={openRatingModal}
        getUserRating={rating.getUserRating}
        getRatingColor={rating.getRatingColor}
        searchTerm={gameData.searchTerm}
        setSearchTerm={gameData.setSearchTerm}
        showFilters={gameData.showFilters}
        setShowFilters={gameData.setShowFilters}
        selectedGenre={gameData.selectedGenre}
        setSelectedGenre={gameData.setSelectedGenre}
        sortBy={gameData.sortBy}
        setSortBy={gameData.setSortBy}
        genres={gameData.genres}
        handleSearch={gameData.searchGames}
        clearSearch={gameData.clearSearch}
        searchResults={gameData.searchResults}
        showResults={gameData.showResults}
        setShowResults={gameData.setShowResults}
        toggleFavorite={favorites.toggleFavorite}
        isGameFavorited={favorites.isGameFavorited}
        formatDate={gameData.formatDate}
      />
    </div>
  );
};

export default Header;
