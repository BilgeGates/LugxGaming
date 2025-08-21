import React from "react";

export const GenreBadge = ({ genre }) => {
  if (!genre) return null;

  return (
    <div
      key={genre.id}
      className="px-4 py-2 rounded-lg border text-[13px] font-medium"
      style={{
        backdropFilter: "blur(10px)",
      }}
    >
      <span className="mr-2 text-cyan-400">#</span>
      <span className="text-white">{genre.name}</span>
    </div>
  );
};
