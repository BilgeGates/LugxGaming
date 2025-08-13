import React from "react";

export const GenreBadge = ({ genre }) => {
  if (!genre) return null;

  return (
    <div className="bg-cyan-400">
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded  text-white text-xs  bg-transparent font-medium">
        {genre.name}
      </span>
    </div>
  );
};
