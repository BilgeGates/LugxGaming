// Date utilities
export {
  formatDate,
  formatTimeAgo,
  formatReleaseDate,
  getGameStatus,
} from "./dateUtils";

// Search & filter utilities
export {
  searchGames,
  filterGamesByGenre,
  filterGamesByPlatform,
  sortGames,
  getPopularityScore,
  getPopularGames,
  getTrendingGames,
  sortOptions,
  getDisplayDate,
} from "./searchUtils";

// Format & display utilities
export {
  formatReviewsCount,
  formatRatingScore,
  formatPlaytime,
  capitalize,
  sanitizeGenreName,
  getMetacriticColor,
  getRatingColor,
  getRatingGradient,
  getGenreGradient,
  getAgeRating,
  generateGamePlaceholder,
} from "./formatUtils";

// Safe wrappers
export {
  safeGetRatingColor,
  safeGetUserRating,
  safeIsGameFavorited,
  formatGameDate,
} from "./searchUtils";

// Icon utilities
export { getGenreIcon, getPlatformIcon } from "./iconUtils";

// Genre constants
export { genres } from "./searchUtils";
