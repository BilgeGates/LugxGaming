import React from "react";
import { Heart, Star, Zap } from "lucide-react";
import { ActionButton } from "./ActionButton";

export const CardOverlay = ({
  onFavorite,
  onRate,
  onView,
  isFavorited,
  userRating,
  show = false,
}) => {
  return (
    <div
      className={`absolute inset-0 bg-black/60 transition-opacity duration-300 flex items-center justify-center gap-3 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <ActionButton
        icon={Heart}
        onClick={onFavorite}
        title={isFavorited ? "Remove from favorites" : "Add to favorites"}
        variant="favorite"
        active={isFavorited}
      />

      <ActionButton
        icon={Star}
        onClick={onRate}
        title="Rate this game"
        variant="rating"
        active={userRating > 0}
      />

      <ActionButton
        icon={Zap}
        onClick={onView}
        title="View game details"
        variant="primary"
      />
    </div>
  );
};
