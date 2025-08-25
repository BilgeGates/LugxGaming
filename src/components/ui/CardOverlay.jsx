import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Heart, Star, Zap } from "lucide-react";

import { ActionButton } from "../ui";

export const CardOverlay = ({
  game,
  onSelect,
  onRate,
  onToggleFavorite,
  isFavorited = false,
  getUserRating = () => 0,
  className = "",
}) => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const navigate = useNavigate();

  const handleGameSelect = (e) => {
    e.stopPropagation();
    onSelect?.(game);
    navigate(`/products/${game.id}`);
  };

  const handleRatingClick = (e) => {
    e.stopPropagation();
    onRate?.(game, e);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite?.(game);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setOverlayVisible(!overlayVisible);
    }
  };

  return (
    <div
      className={`absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 ${className}`}
      onClick={handleOverlayClick}
    >
      <ActionButton
        icon={Heart}
        onClick={handleFavoriteClick}
        title={isFavorited ? "Remove from favorites" : "Add to favorites"}
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
  );
};
