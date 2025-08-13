import {
  Gamepad2,
  Sword,
  Map,
  Castle,
  Brain,
  Car,
  Globe2,
  Puzzle,
  Ghost,
  Users,
  Palette,
  Trophy,
  Zap,
  Shield,
  Target,
} from "lucide-react";

/**
 * Genre icon mapping
 */
export const getGenreIcon = (genreName) => {
  const icons = {
    Action: Sword,
    Adventure: Map,
    RPG: Castle,
    Strategy: Brain,
    Sports: Trophy,
    Racing: Car,
    Shooter: Target,
    Simulation: Globe2,
    Puzzle: Puzzle,
    Fighting: Shield,
    Horror: Ghost,
    Platformer: Users,
    Indie: Palette,
    MMORPG: Castle,
    "Battle Royale": Zap,
  };

  return icons[genreName] || Gamepad2;
};

/**
 * Format rating count
 */
export const formatRatingCount = (count) => {
  if (!count) return "0";

  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }

  if (count >= 1000) {
    return `${Math.round(count / 1000)}k`;
  }

  return count.toString();
};

/**
 * Get metacritic score color
 */
export const getMetacriticColor = (score) => {
  if (score >= 80) return "bg-green-600";
  if (score >= 60) return "bg-yellow-600";
  return "bg-red-600";
};

/**
 * Get game age rating
 */
export const getAgeRating = (esrbRating) => {
  const ratings = {
    everyone: { text: "E", color: "bg-green-500", description: "Everyone" },
    "everyone-10-plus": {
      text: "E10+",
      color: "bg-blue-500",
      description: "Everyone 10+",
    },
    teen: { text: "T", color: "bg-yellow-500", description: "Teen" },
    mature: { text: "M", color: "bg-orange-500", description: "Mature 17+" },
    "adults-only": {
      text: "AO",
      color: "bg-red-500",
      description: "Adults Only",
    },
  };

  return (
    ratings[esrbRating?.slug] || {
      text: "NR",
      color: "bg-gray-500",
      description: "Not Rated",
    }
  );
};

/**
 * Generate random game background for placeholders
 */
export const generateGamePlaceholder = (gameName) => {
  const colors = [
    "from-purple-600 to-blue-600",
    "from-green-500 to-teal-600",
    "from-red-500 to-pink-600",
    "from-yellow-500 to-orange-600",
    "from-indigo-500 to-purple-600",
  ];

  const randomIndex = Math.floor(Math.random() * colors.length);
  const randomColor = colors[randomIndex];
  console.log(randomColor);

  return `https://via.placeholder.com/400x225/6366f1/ffffff?text=${encodeURIComponent(
    gameName || "Game"
  )}`;
};

/**
 * Calculate game popularity score
 */
export const getPopularityScore = (game) => {
  const ratingWeight = (game.rating || 0) * 0.3;
  const reviewWeight = Math.min((game.ratings_count || 0) / 1000, 10) * 0.4;
  const metacriticWeight = ((game.metacritic || 0) / 10) * 0.3;

  return ratingWeight + reviewWeight + metacriticWeight;
};

/**
 * Get game status based on release date
 */
export const getGameStatus = (releaseDate) => {
  if (!releaseDate)
    return { status: "upcoming", text: "Coming Soon", color: "text-blue-400" };

  const now = new Date();
  const release = new Date(releaseDate);

  if (release > now) {
    return { status: "upcoming", text: "Coming Soon", color: "text-blue-400" };
  }

  const daysDiff = (now - release) / (1000 * 60 * 60 * 24);

  if (daysDiff <= 30) {
    return { status: "new", text: "New Release", color: "text-green-400" };
  }

  if (daysDiff <= 365) {
    return { status: "recent", text: "Recent", color: "text-yellow-400" };
  }

  return { status: "classic", text: "Classic", color: "text-gray-400" };
};

/**
 * Search and filter utilities
 */
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

export const searchGames = (games, query) => {
  if (!query || query.trim() === "") return games;

  const searchTerm = query.toLowerCase().trim();

  return games.filter((game) => {
    const nameMatch = game.name.toLowerCase().includes(searchTerm);
    const genreMatch = game.genres?.some((g) =>
      g.name.toLowerCase().includes(searchTerm)
    );
    const platformMatch = game.platforms?.some((p) =>
      p.platform?.name.toLowerCase().includes(searchTerm)
    );

    return nameMatch || genreMatch || platformMatch;
  });
};

/**
 * Sort games utility
 */
export const sortGames = (games, sortBy) => {
  const gamesCopy = [...games];

  switch (sortBy) {
    case "name":
      return gamesCopy.sort((a, b) => a.name.localeCompare(b.name));

    case "rating":
      return gamesCopy.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    case "release_date":
      return gamesCopy.sort((a, b) => {
        const dateA = new Date(a.released || 0);
        const dateB = new Date(b.released || 0);
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

export const getPopularGames = (games, limit = 4) =>
  games.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, limit);

/**
 * Get trending games based on various factors
 */
export const getTrendingGames = (games, limit = 10) => {
  return sortGames(games, "popularity").slice(0, limit);
};
