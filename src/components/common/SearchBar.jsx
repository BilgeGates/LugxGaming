import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  Search,
  X,
  Filter,
  Gamepad2,
  Star,
  Heart,
  Calendar,
  TrendingUp,
  Clock,
} from "lucide-react";

const genres = [
  { id: "action", name: "Action" },
  { id: "adventure", name: "Adventure" },
  { id: "role-playing-games-rpg", name: "RPG" },
  { id: "shooter", name: "Shooter" },
  { id: "strategy", name: "Strategy" },
  { id: "sports", name: "Sports" },
  { id: "racing", name: "Racing" },
  { id: "puzzle", name: "Puzzle" },
];

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  selectedGenre,
  setSelectedGenre,
  sortBy,
  setSortBy,
  handleSearch,
  clearSearch,
  searchResults = [],
  showResults,
  setShowResults,
  handleGameSelect,
  getRatingColor,
  getUserRating,
  openRatingModal,
  toggleFavorite,
  isGameFavorited,
  formatDate,
  popularGames = [],
  recentSearches = [],
  onAddRecentSearch,
}) => {
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [visibleCount, setVisibleCount] = useState(7);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        setShowFilters(false);
        setShowSuggestions(false);
        setSelectedResultIndex(-1);
      }
    };

    const handleKeyDown = (event) => {
      const currentResults = searchTerm.trim()
        ? searchResults
        : [...recentSearches, ...popularGames];

      if ((!showResults && !showSuggestions) || currentResults.length === 0)
        return;

      switch (event.key) {
        case "Escape":
          setShowResults(false);
          setShowSuggestions(false);
          setSelectedResultIndex(-1);
          break;
        case "ArrowDown":
          event.preventDefault();
          setSelectedResultIndex((prev) =>
            prev < Math.min(visibleCount - 1, currentResults.length - 1)
              ? prev + 1
              : prev
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedResultIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          event.preventDefault();
          if (selectedResultIndex >= 0 && currentResults[selectedResultIndex]) {
            const selectedGame = currentResults[selectedResultIndex];
            handleGameSelect(selectedGame);
            if (onAddRecentSearch) {
              onAddRecentSearch(selectedGame);
            }
            setShowResults(false);
            setShowSuggestions(false);
            setSelectedResultIndex(-1);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    showResults,
    showSuggestions,
    searchResults,
    selectedResultIndex,
    handleGameSelect,
    visibleCount,
    searchTerm,
    recentSearches,
    popularGames,
    onAddRecentSearch,
    setShowResults,
    setShowFilters,
  ]);

  const debouncedSearch = useCallback(
    (value, genre, sort) => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

      if (value.trim() || genre) {
        setIsSearching(true);
        setShowSuggestions(false);
        setShowResults(true);
      }

      searchTimeoutRef.current = setTimeout(async () => {
        if (handleSearch) {
          await handleSearch(value, genre, sort);
        }
        setVisibleCount(7);
        setIsSearching(false);
      }, 300);
    },
    [handleSearch, setShowResults]
  );

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchTerm(value);
      setSelectedResultIndex(-1);

      if (value.trim()) {
        setShowResults(true);
        setShowSuggestions(false);
        debouncedSearch(value, selectedGenre, sortBy);
      } else {
        setShowResults(false);
        setShowSuggestions(true);
        setIsSearching(false);
      }
    },
    [setSearchTerm, setShowResults, debouncedSearch, selectedGenre, sortBy]
  );

  const handleInputFocus = useCallback(() => {
    if (!searchTerm.trim()) {
      setShowSuggestions(true);
      setShowResults(false);
    } else {
      setShowResults(true);
      setShowSuggestions(false);
    }
  }, [searchTerm, setShowResults]);

  const handleClearSearch = useCallback(() => {
    if (clearSearch) clearSearch();
    setShowResults(false);
    setShowSuggestions(true);
    setSelectedResultIndex(-1);
    setVisibleCount(7);
    setIsSearching(false);
  }, [clearSearch, setShowResults]);

  const handleFilterChange = useCallback(
    (filterType, value) => {
      if (filterType === "genre") setSelectedGenre(value);
      else if (filterType === "sort") setSortBy(value);

      const newGenre = filterType === "genre" ? value : selectedGenre;
      const newSort = filterType === "sort" ? value : sortBy;

      setShowResults(true);
      setShowSuggestions(false);
      debouncedSearch(searchTerm, newGenre, newSort);
    },
    [
      setSelectedGenre,
      setSortBy,
      selectedGenre,
      sortBy,
      searchTerm,
      debouncedSearch,
      setShowResults,
    ]
  );

  const handleResultClick = useCallback(
    (game) => {
      handleGameSelect(game);
      if (onAddRecentSearch) {
        onAddRecentSearch(game);
      }
      setShowResults(false);
      setShowSuggestions(false);
      setSelectedResultIndex(-1);
      setVisibleCount(7);
    },
    [handleGameSelect, onAddRecentSearch, setShowResults]
  );

  const handleFavoriteToggle = useCallback(
    (e, game) => {
      e.preventDefault();
      e.stopPropagation();

      if (toggleFavorite && typeof toggleFavorite === "function") {
        toggleFavorite(game);
      }
    },
    [toggleFavorite]
  );

  const safeGetRatingColor = (rating) => {
    try {
      return getRatingColor ? getRatingColor(rating) : "text-gray-500";
    } catch {
      return "text-gray-500";
    }
  };

  const safeGetUserRating = (gameId) => {
    try {
      return getUserRating ? getUserRating(gameId) : 0;
    } catch {
      return 0;
    }
  };

  const safeIsGameFavorited = (gameId) => {
    try {
      return isGameFavorited ? isGameFavorited(gameId) : false;
    } catch {
      return false;
    }
  };

  const handlePopularGenreClick = useCallback(
    (genre) => {
      setSelectedGenre(genre.id);
      setSearchTerm("");
      setShowResults(true);
      setShowSuggestions(false);
      if (handleSearch) {
        handleSearch("", genre.id, sortBy);
      }
      setVisibleCount(7);
    },
    [setSelectedGenre, setSearchTerm, setShowResults, handleSearch, sortBy]
  );

  const onResultsScroll = (e) => {
    const target = e.target;
    const currentResults = searchTerm.trim()
      ? searchResults
      : [...recentSearches, ...popularGames];

    if (
      !loadingMore &&
      target.scrollTop + target.clientHeight >= target.scrollHeight - 20 &&
      visibleCount < currentResults.length
    ) {
      setLoadingMore(true);
      setTimeout(() => {
        setVisibleCount((v) => Math.min(v + 7, currentResults.length));
        setLoadingMore(false);
      }, 700);
    }
  };

  const renderGameItem = (game, index, isRecent = false, isPopular = false) => {
    if (!game || !game.id) return null;

    const userRating = safeGetUserRating(game.id);
    const isFavorited = safeIsGameFavorited(game.id);

    return (
      <div
        key={`${isRecent ? "recent" : isPopular ? "popular" : "search"}-${
          game.id
        }-${index}`}
        className={`flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out group opacity-0 animate-fadeIn hover:shadow-md ${
          selectedResultIndex === index
            ? "bg-purple-100 transform scale-102"
            : "hover:bg-gray-50"
        }`}
        style={{
          animationDelay: `${index * 50}ms`,
          animationFillMode: "forwards",
        }}
        onClick={() => handleResultClick(game)}
        role="option"
        aria-selected={selectedResultIndex === index}
      >
        {(isRecent || isPopular) && (
          <div className="flex-shrink-0 hidden sm:block">
            {isRecent ? (
              <Clock size={16} className="text-blue-500" />
            ) : (
              <TrendingUp size={16} className="text-orange-500" />
            )}
          </div>
        )}

        <img
          src={
            game.background_image ||
            "https://via.placeholder.com/64x40?text=No+Image"
          }
          alt={game.name || "Game image"}
          className="w-12 h-8 sm:w-16 sm:h-10 object-cover rounded-md shadow-sm transition-transform duration-200 ease-in-out group-hover:scale-105 flex-shrink-0"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/64x40?text=No+Image";
          }}
        />

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-200 ease-in-out text-sm sm:text-base truncate">
            {game.name || "Unknown Game"}
            {isRecent && (
              <span className="ml-1 sm:ml-2 text-xs text-blue-500 font-normal hidden sm:inline">
                (Last searched)
              </span>
            )}
            {isPopular && (
              <span className="ml-1 sm:ml-2 text-xs text-orange-500 font-normal hidden sm:inline">
                (Popular)
              </span>
            )}
          </h4>
          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 flex-wrap">
            {game.genres && game.genres.length > 0 && (
              <span className="flex items-center gap-1">
                <Gamepad2 size={12} />
                <span className="truncate max-w-20 sm:max-w-none">
                  {game.genres[0].name}
                </span>
              </span>
            )}
            {game.rating > 0 && (
              <span
                className={`flex items-center gap-1 ${safeGetRatingColor(
                  game.rating
                )}`}
              >
                <Star size={12} />
                {game.rating.toFixed(1)}
              </span>
            )}
            {game.released && (
              <span className="flex items-center gap-1 sm:flex">
                <Calendar size={12} />
                {formatDate
                  ? formatDate(game.released)
                  : new Date(game.released).getFullYear()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {userRating > 0 && (
            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-1.5 sm:px-2 py-1 rounded-full text-xs select-none">
              <Star size={10} fill="currentColor" />
              <span className="hidden sm:inline">{userRating.toFixed(1)}</span>
            </div>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (openRatingModal) openRatingModal(game, e);
            }}
            title="This game has a user rating"
            className="p-1.5 sm:p-2 rounded-full text-yellow-500 hover:text-yellow-600 transition-all duration-200 ease-in-out hover:bg-yellow-50 hover:scale-110"
            aria-label={`${game.name} Rated the game`}
          >
            <Star
              size={14}
              fill={userRating > 0 ? "currentColor" : "none"}
              stroke="currentColor"
            />
          </button>

          <button
            onClick={(e) => handleFavoriteToggle(e, game)}
            className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 ease-in-out hover:scale-110 ${
              isFavorited
                ? "text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100"
                : "text-gray-400 hover:text-red-500 hover:bg-red-50"
            }`}
            title={isFavorited ? "Remove from favorites" : "Added to favorites"}
            aria-label={
              isFavorited
                ? `${game.name} Remove from favorites`
                : `${game.name} Added to favorites`
            }
          >
            <Heart
              size={14}
              fill={isFavorited ? "currentColor" : "none"}
              stroke="currentColor"
            />
          </button>
        </div>
      </div>
    );
  };

  const shouldShowSuggestions =
    !isSearching && !searchTerm.trim() && showSuggestions;
  const shouldShowSearchResults =
    !isSearching && (searchTerm.trim() || selectedGenre) && showResults;
  const hasAnyResults = searchResults.length > 0;
  const hasRecentSearches = recentSearches.length > 0;
  const hasPopularGames = popularGames.length > 0;

  return (
    <div className="relative w-full max-w-4xl mx-auto sm:px-4" ref={searchRef}>
      <div className="flex flex-col gap-3">
        {/* Search Input and Filter Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder="Search by game name, genre or keyword..."
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 border text-sm sm:text-base"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
              aria-label="Oyun axtar"
              autoComplete="off"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-3 sm:px-4 sm:py-4 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 ${
              showFilters
                ? "bg-purple-700 text-white shadow-lg"
                : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg"
            }`}
            aria-label={showFilters ? "Hide filters" : "Show filters"}
            aria-expanded={showFilters}
          >
            <Filter size={18} />
          </button>
        </div>

        {/* Genre Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 px-1">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handlePopularGenreClick(genre)}
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-105 border backdrop-blur-sm ${
                selectedGenre === genre.id
                  ? "bg-white bg-opacity-20 text-white border-white border-opacity-40 shadow-lg"
                  : "bg-white bg-opacity-10 text-white border-white border-opacity-20 hover:bg-opacity-15 hover:border-opacity-30 shadow-md"
              }`}
              style={{
                backdropFilter: "blur(10px)",
              }}
              aria-pressed={selectedGenre === genre.id}
              aria-label={`${genre.name} janrında axtar`}
            >
              <span className="mr-1 sm:mr-2 text-cyan-400">#</span>
              {genre.name}
            </button>
          ))}
        </div>

        {/* Filters Panel - Fixed spacing for mobile */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showFilters
              ? "max-h-56 sm:max-h-40 opacity-100 mb-2"
              : "max-h-0 opacity-0"
          }`}
        >
          <div
            className="p-3 sm:p-4 rounded-xl border transform transition-all duration-300 ease-in-out"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderColor: "rgba(255, 255, 255, 0.2)",
              transform: showFilters ? "translateY(0)" : "translateY(-10px)",
            }}
            role="region"
            aria-label="Search filters"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 sm:pt-4">
              <div className="w-full sm:flex-1">
                <label
                  htmlFor="genre-select"
                  className="block text-sm text-gray-300 mb-2"
                >
                  Genre
                </label>
                <select
                  id="genre-select"
                  value={selectedGenre}
                  onChange={(e) => handleFilterChange("genre", e.target.value)}
                  className="w-full px-3 py-2.5 pr-8 rounded-lg bg-gray-900 bg-opacity-90 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-0 appearance-none transition-all duration-200 ease-in-out hover:border-gray-600 focus:border-cyan-500 text-sm"
                >
                  <option className="bg-gray-900 text-gray-200" value="">
                    All genres
                  </option>
                  {genres.map((genre) => (
                    <option
                      key={genre.id}
                      value={genre.id}
                      className="bg-gray-900 text-gray-200"
                    >
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:flex-1">
                <label
                  htmlFor="sort-select"
                  className="block text-sm text-gray-300 mb-2"
                >
                  Sort
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  className="w-full px-3 py-2.5 pr-8 rounded-lg bg-gray-900 bg-opacity-90 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-0 appearance-none transition-all duration-200 ease-in-out hover:border-gray-600 focus:border-cyan-500 text-sm"
                >
                  <option
                    className="bg-gray-900 text-gray-200"
                    value="relevance"
                  >
                    Relevance
                  </option>
                  <option className="bg-gray-900 text-gray-200" value="rating">
                    Rating
                  </option>
                  <option
                    className="bg-gray-900 text-gray-200"
                    value="released"
                  >
                    Release Date
                  </option>
                  <option
                    className="bg-gray-900 text-gray-200"
                    value="metacritic"
                  >
                    Metacritic Score
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Dropdown */}
      <div
        className={`absolute top-full left-0 right-0 mt-1 mx-2 sm:mx-0 rounded-xl shadow-2xl overflow-y-auto border z-[9999]
          bg-white bg-opacity-95 backdrop-blur
          transition-all duration-300 ease-in-out
          ${
            (shouldShowSearchResults && hasAnyResults) ||
            (shouldShowSuggestions && (hasRecentSearches || hasPopularGames))
              ? "opacity-100 max-h-80 sm:max-h-96 pointer-events-auto"
              : "opacity-0 max-h-0 pointer-events-none"
          }`}
        style={{ borderColor: "rgba(255, 255, 255, 0.2)", zIndex: "9999" }}
        role="listbox"
        aria-label="Search results"
        onScroll={onResultsScroll}
      >
        {/* Loading State */}
        {isSearching && (
          <div className="flex items-center justify-center p-6 sm:p-8 animate-fadeIn">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-600 mb-3 sm:mb-4"></div>
              <div className="text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                Searching game...
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {shouldShowSearchResults && hasAnyResults && (
          <div className="p-3 sm:p-4">
            <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
              <Search size={14} />
              {searchResults.length} game found
            </h3>
            <div className="space-y-1">
              {searchResults
                .slice(0, visibleCount)
                .map((game, index) =>
                  renderGameItem(game, index, false, false)
                )}
            </div>
          </div>
        )}

        {/* Suggestions (Recent Searches and Popular Games) */}
        {shouldShowSuggestions && (hasRecentSearches || hasPopularGames) && (
          <div className="p-3 sm:p-4">
            {hasRecentSearches && (
              <div className="mb-6">
                <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <Clock size={14} className="text-blue-500" />
                  Last searches
                </h3>
                <div className="space-y-1">
                  {recentSearches
                    .slice(0, Math.min(3, visibleCount))
                    .map((game, index) =>
                      renderGameItem(game, index, true, false)
                    )}
                </div>
              </div>
            )}

            {hasPopularGames && (
              <div>
                <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <TrendingUp size={14} className="text-orange-500" />
                  Popular games
                </h3>
                <div className="space-y-1">
                  {popularGames
                    .slice(0, visibleCount - Math.min(3, recentSearches.length))
                    .map((game, index) =>
                      renderGameItem(
                        game,
                        recentSearches.length + index,
                        false,
                        true
                      )
                    )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {shouldShowSearchResults && !hasAnyResults && (
          <div className="p-6 sm:p-8 text-center">
            <div className="text-gray-500 italic text-base sm:text-lg">
              "{searchTerm}" no results found
            </div>
            <div className="text-gray-400 text-sm mt-2">
              Choose a different game or genre
            </div>
          </div>
        )}

        {/* Empty State */}
        {shouldShowSuggestions && !hasRecentSearches && !hasPopularGames && (
          <div className="p-6 sm:p-8 text-center">
            <div className="text-gray-500 italic text-base sm:text-lg">
              You haven't searched for any games yet
            </div>
            <div className="text-gray-400 text-sm mt-2">
              Start searching for games
            </div>
          </div>
        )}

        {/* Load More Indicator */}
        {loadingMore && (
          <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 flex justify-center items-center p-3 rounded-b-xl pointer-events-none">
            <div className="flex items-center gap-2 text-purple-600">
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs sm:text-sm font-medium">
                Loading more results...
              </span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        /* Mobile specific styles for better text truncation */
        @media (max-width: 640px) {
          .max-w-20 {
            max-width: 4rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
