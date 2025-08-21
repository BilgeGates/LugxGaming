// Date utilities
export {
  formatDate,
  formatTimeAgo,
  formatReleaseDate,
  getGameStatus,
} from "./dateUtils";

// Search utilities
export {
  searchGames,
  filterGamesByGenre,
  filterGamesByPlatform,
  sortGames,
  getPopularityScore,
  getPopularGames,
  getTrendingGames,
} from "./searchUtils";

// Format utilities
export {
  formatRatingCount,
  formatRatingScore,
  capitalize,
  sanitizeGenreName,
  getMetacriticColor,
  getRatingColor,
  getGenreGradient,
  getAgeRating,
  generateGamePlaceholder,
} from "./formatUtils";

// Icon utilities
export { getGenreIcon, getPlatformIcon } from "./iconUtils";
