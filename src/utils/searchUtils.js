/**
 * Search and filtering utilities
 */

export const searchGames = (games, term, genre = "", sort = "relevance") => {
  if (term.trim() === "" && genre === "") {
    return [];
  }

  let results = [...games];

  // Text search
  if (term.trim()) {
    const searchTermLower = term.toLowerCase();
    results = results.filter((g) =>
      g.name?.toLowerCase().includes(searchTermLower)
    );
  }

  // Genre filter
  if (genre) {
    const genreLower = genre.toLowerCase();
    results = results.filter((g) =>
      g.genres?.some((gen) => gen.name?.toLowerCase() === genreLower)
    );
  }

  // Sort results
  return sortGames(results, sort);
};

export const filterGamesByGenre = (games, genre) => {
  if (!genre || genre === "all") return games;

  return games.filter((game) =>
    game.genres?.some((g) => g.name.toLowerCase().includes(genre.toLowerCase()))
  );
};

export const filterGamesByPlatform = (games, platform) => {
  if (!platform || platform === "all") return games;

  return games.filter((game) =>
    game.platforms?.some((p) =>
      p.platform?.name.toLowerCase().includes(platform.toLowerCase())
    )
  );
};

export const sortGames = (games, sortBy) => {
  const gamesCopy = [...games];

  switch (sortBy) {
    case "name":
      return gamesCopy.sort((a, b) => a.name.localeCompare(b.name));

    case "rating":
      return gamesCopy.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    case "released":
    case "release_date":
      return gamesCopy.sort((a, b) => {
        const dateA = a.released ? new Date(a.released) : new Date(0);
        const dateB = b.released ? new Date(b.released) : new Date(0);
        return dateB - dateA;
      });

    case "metacritic":
      return gamesCopy.sort(
        (a, b) => (b.metacritic || 0) - (a.metacritic || 0)
      );

    case "popularity":
      return gamesCopy.sort(
        (a, b) => getPopularityScore(b) - getPopularityScore(a)
      );

    default:
      return gamesCopy;
  }
};

export const getPopularityScore = (game) => {
  const ratingWeight = (game.rating || 0) * 0.3;
  const reviewWeight = Math.min((game.ratings_count || 0) / 1000, 10) * 0.4;
  const metacriticWeight = ((game.metacritic || 0) / 10) * 0.3;

  return ratingWeight + reviewWeight + metacriticWeight;
};

export const getPopularGames = (games, limit = 12) =>
  games.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, limit);

export const getTrendingGames = (games, limit = 10) => {
  return sortGames(games, "popularity").slice(0, limit);
};

// Genre definitions
export const genres = [
  { id: "action", name: "Action" },
  { id: "adventure", name: "Adventure" },
  { id: "role-playing-games-rpg", name: "RPG" },
  { id: "shooter", name: "Shooter" },
  { id: "strategy", name: "Strategy" },
  { id: "sports", name: "Sports" },
];

export const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "rating", label: "Rating" },
  { value: "released", label: "Release Date" },
  { value: "metacritic", label: "Metacritic Score" },
];

// Safe utility functions for handling game data
export const safeGetRatingColor = (getRatingColor, rating) => {
  try {
    return getRatingColor ? getRatingColor(rating) : "text-yellow-400";
  } catch {
    return "text-yellow-400";
  }
};

export const safeGetUserRating = (getUserRating, gameId) => {
  try {
    return getUserRating ? getUserRating(gameId) : 0;
  } catch {
    return 0;
  }
};

export const safeIsGameFavorited = (isGameFavorited, gameId) => {
  try {
    return isGameFavorited ? isGameFavorited(gameId) : false;
  } catch {
    return false;
  }
};

// Date formatting utility
export const formatGameDate = (formatDate, dateString) => {
  try {
    return formatDate
      ? formatDate(dateString)
      : new Date(dateString).getFullYear();
  } catch {
    return "Unknown";
  }
};

export const getDisplayDate = (formatDate, dateString) => {
  if (formatDate) {
    return formatDate(dateString);
  }
  return dateString ? new Date(dateString).getFullYear() : "N/A";
};
