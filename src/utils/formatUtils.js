/**
 * Formatting utilities
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

export const formatRatingScore = (rating) => Math.round(rating * 20);

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const sanitizeGenreName = (genre) =>
  genre
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-");

export const getMetacriticColor = (score) => {
  if (score >= 80) return "bg-green-600";
  if (score >= 60) return "bg-yellow-600";
  return "bg-red-600";
};

export const getRatingColor = (rating) => {
  const score = rating * 20;
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
};

export const getGenreGradient = (genreName) => {
  const gradients = {
    Action: "from-red-500 to-orange-500",
    Adventure: "from-green-500 to-blue-500",
    RPG: "from-purple-500 to-pink-500",
    Shooter: "from-yellow-500 to-red-500",
    Strategy: "from-blue-500 to-indigo-500",
    Default: "from-gray-500 to-gray-700",
  };
  return gradients[genreName] || gradients.Default;
};

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
