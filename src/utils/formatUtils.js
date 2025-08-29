/**
 * =============================
 * Number & Text Formatting Utils
 * =============================
 */

/**
 * Format large reviews counts into short form
 */
export const formatReviewsCount = (count) => {
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
 * Format average rating into a percentage (0–100 scale)
 */
export const formatRatingScore = (rating) => Math.round(rating * 20);

/**
 * Format playtime hours or return "N/A" if missing
 */
export const formatPlaytime = (hours) => (hours ? `${hours} hours` : "N/A");

/**
 * Capitalize the first letter of a given string
 */
export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Convert genre name into a clean slug (used in URLs/classes)
 */
export const sanitizeGenreName = (genre) =>
  genre
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-");

/**
 * =============================
 * Rating & Review Utilities
 * =============================
 */

/**
 * Get background color class based on Metacritic score
 */
export const getMetacriticColor = (score) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

/**
 * Get text color class based on user rating score
 */
export const getRatingColor = (rating) => {
  const score = rating * 20;
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
};

/**
 * Get gradient background color class based on rating score
 */
export const getRatingGradient = (rating) => {
  const score = rating * 20;
  if (score >= 90) return "from-emerald-500 to-green-600";
  if (score >= 80) return "from-green-500 to-emerald-600";
  if (score >= 70) return "from-yellow-500 to-orange-500";
  if (score >= 60) return "from-orange-500 to-red-500";
  return "from-red-500 to-red-700";
};

/**
 * =============================
 * Genre & Category Utilities
 * =============================
 */

/**
 * Get gradient background for a given genre
 */
export const getGenreGradient = () => {
  return "from-purple-500 to-pink-500"; // hamısı eyni rəngdə olacaq
};

/**
 * =============================
 * ESRB Age Rating Utilities
 * =============================
 */

/**
 * Get ESRB age rating metadata (text, color, description)
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
 * =============================
 * Placeholder Utilities
 * =============================
 */

/**
 * Generate a placeholder image for games without cover art
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
