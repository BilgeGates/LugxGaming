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

export const getPopularGames = (games, limit = 4) =>
  games.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, limit);

export const getTrendingGames = (games, limit = 10) => {
  return sortGames(games, "popularity").slice(0, limit);
};
