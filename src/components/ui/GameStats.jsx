import React from "react";

import { Calendar, Users } from "lucide-react";

export const GameStats = ({ game, className = "" }) => {
  return (
    <div
      className={`flex items-center justify-between text-xs text-gray-300 ${className}`}
    >
      <div className="flex items-center gap-1">
        <Calendar size={12} />
        <span>
          {game.released ? new Date(game.released).getFullYear() : "TBA"}
        </span>
      </div>

      {game.ratings_count && (
        <div className="flex items-center gap-1">
          <Users size={12} />
          <span>
            {game.ratings_count > 1000
              ? `${Math.round(game.ratings_count / 1000)}k`
              : game.ratings_count}
          </span>
        </div>
      )}
    </div>
  );
};
