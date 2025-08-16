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

import {
  FaWindows,
  FaPlaystation,
  FaXbox,
  FaNintendoSwitch,
  FaMobileAlt,
  FaAndroid,
  FaApple,
  FaLinux,
} from "react-icons/fa";

/**
 * Genre icon mapping with fallback
 */
export const getGenreIcon = (genreName) => {
  if (!genreName || typeof genreName !== "string") {
    return Gamepad2;
  }

  const normalizedGenre = genreName.toLowerCase().trim();

  const icons = {
    action: Sword,
    adventure: Map,
    rpg: Castle,
    "role-playing": Castle,
    strategy: Brain,
    sports: Trophy,
    racing: Car,
    shooter: Target,
    simulation: Globe2,
    puzzle: Puzzle,
    fighting: Shield,
    horror: Ghost,
    platformer: Users,
    indie: Palette,
    mmorpg: Castle,
    "battle royale": Zap,
    arcade: Zap,
    casual: Palette,
  };

  return icons[normalizedGenre] || Gamepad2;
};

/**
 * Format rating count with proper validation
 */
export const formatRatingCount = (count) => {
  // Handle null, undefined, or invalid numbers
  const numericCount = parseInt(count, 10);
  if (!numericCount || isNaN(numericCount) || numericCount <= 0) {
    return "0";
  }

  if (numericCount >= 1000000) {
    return `${(numericCount / 1000000).toFixed(1)}M`;
  }

  if (numericCount >= 1000) {
    return `${Math.round(numericCount / 1000)}k`;
  }

  return numericCount.toString();
};

/**
 * Get metacritic score color with validation
 */
export const getMetacriticColor = (score) => {
  const numericScore = parseInt(score, 10);
  if (isNaN(numericScore) || numericScore < 0) {
    return "bg-gray-500";
  }

  if (numericScore >= 80) return "bg-green-600";
  if (numericScore >= 60) return "bg-yellow-600";
  if (numericScore >= 40) return "bg-orange-600";
  return "bg-red-600";
};

/**
 * Get game age rating with proper validation
 */
export const getAgeRating = (esrbRating) => {
  const defaultRating = {
    text: "NR",
    color: "bg-gray-500",
    description: "Not Rated",
  };

  if (!esrbRating || typeof esrbRating !== "object") {
    return defaultRating;
  }

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

  return ratings[esrbRating.slug] || defaultRating;
};

/**
 * Generate game placeholder with validation
 */
export const generateGamePlaceholder = (gameName) => {
  const colors = [
    "6366f1", // indigo
    "8b5cf6", // violet
    "06b6d4", // cyan
    "10b981", // emerald
    "f59e0b", // amber
    "ef4444", // red
  ];

  const safeGameName =
    typeof gameName === "string" && gameName.trim() ? gameName.trim() : "Game";

  const randomIndex = Math.floor(Math.random() * colors.length);
  const randomColor = colors[randomIndex];

  return `https://via.placeholder.com/400x225/${randomColor}/ffffff?text=${encodeURIComponent(
    safeGameName
  )}`;
};

/**
 * Calculate game popularity score with validation
 */
export const getPopularityScore = (game) => {
  if (!game || typeof game !== "object") {
    return 0;
  }

  const rating = parseFloat(game.rating) || 0;
  const ratingsCount = parseInt(game.ratings_count, 10) || 0;
  const metacritic = parseInt(game.metacritic, 10) || 0;

  const ratingWeight = Math.max(0, Math.min(5, rating)) * 0.3; // 0-5 scale
  const reviewWeight = Math.min(ratingsCount / 1000, 10) * 0.4; // cap at 10
  const metacriticWeight = (Math.max(0, Math.min(100, metacritic)) / 10) * 0.3; // 0-10 scale

  return ratingWeight + reviewWeight + metacriticWeight;
};

/**
 * Get game status based on release date with validation
 */
export const getGameStatus = (releaseDate) => {
  const defaultStatus = {
    status: "unknown",
    text: "Unknown",
    color: "text-gray-400",
  };

  if (!releaseDate || typeof releaseDate !== "string") {
    return { status: "upcoming", text: "Coming Soon", color: "text-blue-400" };
  }

  try {
    const now = new Date();
    const release = new Date(releaseDate);

    if (isNaN(release.getTime())) {
      return defaultStatus;
    }

    if (release > now) {
      return {
        status: "upcoming",
        text: "Coming Soon",
        color: "text-blue-400",
      };
    }

    const daysDiff = (now - release) / (1000 * 60 * 60 * 24);

    if (daysDiff <= 30) {
      return { status: "new", text: "New Release", color: "text-green-400" };
    }

    if (daysDiff <= 365) {
      return { status: "recent", text: "Recent", color: "text-yellow-400" };
    }

    return { status: "classic", text: "Classic", color: "text-gray-400" };
  } catch (error) {
    console.error("Error parsing release date:", error);
    return defaultStatus;
  }
};

/**
 * Search and filter utilities with validation
 */
export const filterGamesByGenre = (games, genre) => {
  if (!Array.isArray(games)) {
    return [];
  }

  if (!genre || genre === "all" || typeof genre !== "string") {
    return games;
  }

  const normalizedGenre = genre.toLowerCase().trim();

  return games.filter((game) => {
    if (!game || !Array.isArray(game.genres)) {
      return false;
    }

    return game.genres.some(
      (g) =>
        g &&
        g.name &&
        typeof g.name === "string" &&
        g.name.toLowerCase().includes(normalizedGenre)
    );
  });
};

export const filterGamesByPlatform = (games, platform) => {
  if (!Array.isArray(games)) {
    return [];
  }

  if (!platform || platform === "all" || typeof platform !== "string") {
    return games;
  }

  const normalizedPlatform = platform.toLowerCase().trim();

  return games.filter((game) => {
    if (!game || !Array.isArray(game.platforms)) {
      return false;
    }

    return game.platforms.some(
      (p) =>
        p &&
        p.platform &&
        p.platform.name &&
        typeof p.platform.name === "string" &&
        p.platform.name.toLowerCase().includes(normalizedPlatform)
    );
  });
};

export const searchGames = (games, query) => {
  if (!Array.isArray(games)) {
    return [];
  }

  if (!query || typeof query !== "string" || query.trim() === "") {
    return games;
  }

  const searchTerm = query.toLowerCase().trim();

  return games.filter((game) => {
    if (!game || typeof game.name !== "string") {
      return false;
    }

    const nameMatch = game.name.toLowerCase().includes(searchTerm);

    const genreMatch =
      Array.isArray(game.genres) &&
      game.genres.some(
        (g) =>
          g &&
          g.name &&
          typeof g.name === "string" &&
          g.name.toLowerCase().includes(searchTerm)
      );

    const platformMatch =
      Array.isArray(game.platforms) &&
      game.platforms.some(
        (p) =>
          p &&
          p.platform &&
          p.platform.name &&
          typeof p.platform.name === "string" &&
          p.platform.name.toLowerCase().includes(searchTerm)
      );

    return nameMatch || genreMatch || platformMatch;
  });
};

/**
 * Sort games utility with validation
 */
export const sortGames = (games, sortBy) => {
  if (!Array.isArray(games)) {
    return [];
  }

  const gamesCopy = [...games];

  try {
    switch (sortBy) {
      case "name":
        return gamesCopy.sort((a, b) => {
          const nameA = a?.name || "";
          const nameB = b?.name || "";
          return nameA.localeCompare(nameB);
        });

      case "rating":
        return gamesCopy.sort((a, b) => {
          const ratingA = parseFloat(a?.rating) || 0;
          const ratingB = parseFloat(b?.rating) || 0;
          return ratingB - ratingA;
        });

      case "release_date":
      case "released":
        return gamesCopy.sort((a, b) => {
          try {
            const dateA = new Date(a?.released || 0);
            const dateB = new Date(b?.released || 0);
            return dateB - dateA;
          } catch (error) {
            return 0;
          }
        });

      case "metacritic":
        return gamesCopy.sort((a, b) => {
          const scoreA = parseInt(a?.metacritic, 10) || 0;
          const scoreB = parseInt(b?.metacritic, 10) || 0;
          return scoreB - scoreA;
        });

      case "popularity":
        return gamesCopy.sort(
          (a, b) => getPopularityScore(b) - getPopularityScore(a)
        );

      default:
        return gamesCopy;
    }
  } catch (error) {
    console.error("Error sorting games:", error);
    return gamesCopy;
  }
};

export const getPopularGames = (games, limit = 4) => {
  if (!Array.isArray(games)) {
    return [];
  }

  try {
    return games
      .filter((game) => game && typeof game.rating === "number")
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, Math.max(1, parseInt(limit, 10) || 4));
  } catch (error) {
    console.error("Error getting popular games:", error);
    return [];
  }
};

/**
 * Get trending games based on various factors
 */
export const getTrendingGames = (games, limit = 10) => {
  if (!Array.isArray(games)) {
    return [];
  }

  try {
    return sortGames(games, "popularity").slice(
      0,
      Math.max(1, parseInt(limit, 10) || 10)
    );
  } catch (error) {
    console.error("Error getting trending games:", error);
    return [];
  }
};

/**
 * Format release date with validation
 */
export const formatReleaseDate = (dateString) => {
  if (!dateString || typeof dateString !== "string") {
    return "TBA";
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "TBA";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting release date:", error);
    return "TBA";
  }
};

/**
 * Get platform icon with improved mapping
 */
export const getPlatformIcon = (platforms) => {
  if (!Array.isArray(platforms) || platforms.length === 0) {
    return () => Gamepad2;
  }

  // Get the first platform or find the most relevant one
  const platform = platforms[0];
  if (!platform || !platform.platform) {
    return () => Gamepad2;
  }

  const platformName = platform.platform.name?.toLowerCase() || "";

  const iconMap = {
    // PC platforms
    pc: FaWindows,
    windows: FaWindows,
    linux: FaLinux,
    mac: FaApple,
    macos: FaApple,

    // Console platforms
    playstation: FaPlaystation,
    "playstation 4": FaPlaystation,
    "playstation 5": FaPlaystation,
    ps4: FaPlaystation,
    ps5: FaPlaystation,

    xbox: FaXbox,
    "xbox one": FaXbox,
    "xbox series": FaXbox,
    "xbox 360": FaXbox,

    nintendo: FaNintendoSwitch,
    "nintendo switch": FaNintendoSwitch,
    switch: FaNintendoSwitch,

    // Mobile platforms
    android: FaAndroid,
    ios: FaApple,
    mobile: FaMobileAlt,
  };

  // Find matching icon
  for (const [key, icon] of Object.entries(iconMap)) {
    if (platformName.includes(key)) {
      return icon;
    }
  }

  return () => Gamepad2;
};

/**
 * Get genre gradient with validation
 */
export const getGenreGradient = (genreName) => {
  if (!genreName || typeof genreName !== "string") {
    return "from-gray-500 to-gray-700";
  }

  const normalizedGenre = genreName.toLowerCase().trim();

  const gradients = {
    action: "from-red-500 to-orange-500",
    adventure: "from-green-500 to-blue-500",
    rpg: "from-purple-500 to-pink-500",
    "role-playing": "from-purple-500 to-pink-500",
    shooter: "from-yellow-500 to-red-500",
    strategy: "from-blue-500 to-indigo-500",
    sports: "from-green-400 to-blue-500",
    racing: "from-orange-500 to-red-500",
    simulation: "from-teal-500 to-cyan-500",
    puzzle: "from-purple-400 to-indigo-500",
    horror: "from-gray-700 to-red-900",
    platformer: "from-yellow-400 to-orange-500",
    fighting: "from-red-600 to-pink-600",
    arcade: "from-cyan-400 to-blue-500",
    casual: "from-green-300 to-teal-400",
    indie: "from-pink-400 to-purple-500",
  };

  return gradients[normalizedGenre] || "from-gray-500 to-gray-700";
};

/**
 * Utility functions with validation
 */
export const sanitizeGenreName = (genre) => {
  if (!genre || typeof genre !== "string") {
    return "unknown";
  }

  return genre
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "") // Remove special chars except spaces
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/-+/g, "-") // Remove multiple consecutive dashes
    .replace(/^-|-$/g, ""); // Remove leading/trailing dashes
};

export const capitalize = (str) => {
  if (!str || typeof str !== "string") {
    return "";
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatRatingScore = (rating) => {
  const numericRating = parseFloat(rating);
  if (isNaN(numericRating) || numericRating < 0) {
    return 0;
  }

  return Math.round(Math.min(5, numericRating) * 20); // Convert 0-5 scale to 0-100
};

export const getRatingColor = (rating) => {
  const score = formatRatingScore(rating);

  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
};
