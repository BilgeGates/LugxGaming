import React, { useRef, useCallback } from "react";

import { Search, X, Filter, Clock, TrendingUp } from "lucide-react";

import SearchGameItem from "./SearchGameItem";

import { useSearch, useSearchKeyboard } from "../../hooks";
import { genres } from "../../utils";

const SearchBar = ({
  searchTerm: externalSearchTerm,
  setSearchTerm: externalSetSearchTerm,
  showFilters: externalShowFilters,
  setShowFilters: externalSetShowFilters,
  selectedGenre: externalSelectedGenre,
  setSelectedGenre: externalSetSelectedGenre,
  sortBy: externalSortBy,
  setSortBy: externalSetSortBy,
  handleSearch,
  clearSearch,
  searchResults = [],
  showResults: externalShowResults,
  setShowResults: externalSetShowResults,
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

  const {
    searchTerm,
    selectedGenre,
    sortBy,
    showFilters,
    showResults,
    showSuggestions,
    selectedResultIndex,
    isSearching,
    visibleCount,
    loadingMore,
    setSearchTerm,
    setShowFilters,
    setShowResults,
    setShowSuggestions,
    setSelectedResultIndex,
    setVisibleCount,
    handleInputChange,
    handleInputFocus,
    handleClearSearch,
    handleFilterChange,
    handleResultClick,
    handlePopularGenreClick,
  } = useSearch({
    handleSearch,
    onAddRecentSearch,
  });

  // Use external props if provided, otherwise use internal state
  const currentSearchTerm = externalSearchTerm ?? searchTerm;
  const currentShowFilters = externalShowFilters ?? showFilters;
  const currentSelectedGenre = externalSelectedGenre ?? selectedGenre;
  const currentSortBy = externalSortBy ?? sortBy;
  const currentShowResults = externalShowResults ?? showResults;

  const setCurrentSearchTerm = externalSetSearchTerm ?? setSearchTerm;
  const setCurrentShowFilters = externalSetShowFilters ?? setShowFilters;

  console.log({
    currentSearchTerm,
    searchTerm,
    externalSearchTerm,
    searchResults,
    recentSearches,
    popularGames,
    visibleCount,
    loadingMore,
    isSearching,
    currentShowResults,
    currentShowFilters,
    currentSelectedGenre,
    currentSortBy,
  });

  useSearchKeyboard({
    searchRef,
    showResults: currentShowResults,
    showSuggestions,
    searchResults,
    recentSearches,
    popularGames,
    selectedResultIndex,
    setSelectedResultIndex,
    visibleCount,
    searchTerm: currentSearchTerm,
    handleResultClick,
    handleGameSelect,
    onAddRecentSearch,
    setShowResults: externalSetShowResults ?? setShowResults,
    setShowSuggestions,
    setShowFilters: setCurrentShowFilters,
  });

  const onInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setCurrentSearchTerm(value);
      handleInputChange(value);
    },
    [setCurrentSearchTerm, handleInputChange]
  );

  const onClearSearch = useCallback(() => {
    setCurrentSearchTerm("");
    handleClearSearch(clearSearch);
  }, [setCurrentSearchTerm, handleClearSearch, clearSearch]);

  const onFilterChange = useCallback(
    (filterType, value) => {
      // Update internal state through hook
      handleFilterChange(filterType, value);

      // Update external state if callbacks are provided
      if (filterType === "genre" && externalSetSelectedGenre) {
        externalSetSelectedGenre(value);
      }
      if (filterType === "sort" && externalSetSortBy) {
        externalSetSortBy(value);
      }

      // Trigger search with new filters
      if (handleSearch && typeof handleSearch === "function") {
        // Determine current values after update
        const newGenre = filterType === "genre" ? value : currentSelectedGenre;
        const newSort = filterType === "sort" ? value : currentSortBy;

        // Call handleSearch with updated parameters
        handleSearch(currentSearchTerm, newGenre, newSort);
      }
    },
    [
      handleFilterChange,
      externalSetSelectedGenre,
      externalSetSortBy,
      handleSearch,
      currentSearchTerm,
      currentSelectedGenre,
      currentSortBy,
    ]
  );

  console.log({ onFilterChange });

  const onPopularGenreClick = useCallback(
    (genre) => {
      handlePopularGenreClick(genre);
      if (externalSetSelectedGenre) {
        externalSetSelectedGenre(genre.id);
      }
      if (externalSetSearchTerm) {
        externalSetSearchTerm("");
      }

      // Trigger search with selected genre
      if (handleSearch && typeof handleSearch === "function") {
        handleSearch("", genre.id, currentSortBy);
      }
    },
    [
      handlePopularGenreClick,
      externalSetSelectedGenre,
      externalSetSearchTerm,
      handleSearch,
      currentSortBy,
    ]
  );

  const onResultsScroll = useCallback(
    (e) => {
      const target = e.target;
      const currentResults = currentSearchTerm.trim()
        ? searchResults
        : [...recentSearches, ...popularGames];

      if (
        !loadingMore &&
        target.scrollTop + target.clientHeight >= target.scrollHeight - 20 &&
        visibleCount < currentResults.length
      ) {
        setVisibleCount((v) => Math.min(v + 7, currentResults.length));
      }
    },
    [
      loadingMore,
      visibleCount,
      currentSearchTerm,
      searchResults,
      recentSearches,
      popularGames,
      setVisibleCount,
    ]
  );

  const handleFavoriteToggle = useCallback(
    (game) => {
      if (toggleFavorite && typeof toggleFavorite === "function") {
        toggleFavorite(game);
      }
    },
    [toggleFavorite]
  );

  const shouldShowSuggestions =
    !isSearching && !currentSearchTerm.trim() && showSuggestions;
  const shouldShowSearchResults =
    !isSearching &&
    (currentSearchTerm.trim() || currentSelectedGenre) &&
    currentShowResults;
  const hasAnyResults = searchResults.length > 0;
  const hasRecentSearches = recentSearches.length > 0;
  const hasPopularGames = popularGames.length > 0;

  const currentResults = currentSearchTerm.trim()
    ? searchResults
    : [...recentSearches, ...popularGames];

  console.log({ currentResults, searchResults, recentSearches, popularGames });

  return (
    <div className="relative w-full " ref={searchRef}>
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
              value={currentSearchTerm}
              onChange={onInputChange}
              onFocus={handleInputFocus}
              placeholder="Search by game name, genre or keyword..."
              className="w-full pl-5 sm:pl-6 pr-10 sm:pr-12 py-3 sm:py-4 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-cyan-500 transition-all duration-300 border text-sm sm:text-base"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
              aria-label="Search games"
              autoComplete="off"
            />
            {currentSearchTerm && (
              <button
                onClick={onClearSearch}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <button
            onClick={() => setCurrentShowFilters(!currentShowFilters)}
            className={`px-3 py-3 sm:px-4 sm:py-4 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 ${
              currentShowFilters
                ? "bg-purple-700 text-white shadow-lg"
                : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg"
            }`}
            aria-label={currentShowFilters ? "Hide filters" : "Show filters"}
            aria-expanded={currentShowFilters}
          >
            <Filter size={18} />
          </button>
        </div>

        {/* Genre Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => onPopularGenreClick(genre)}
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-105 border backdrop-blur-sm ${
                currentSelectedGenre === genre.id
                  ? "bg-white bg-opacity-20 text-white border-white border-opacity-40 shadow-lg"
                  : "bg-white bg-opacity-10 text-white border-white border-opacity-20 hover:bg-opacity-15 hover:border-opacity-30 shadow-md"
              }`}
              style={{ backdropFilter: "blur(10px)" }}
              aria-pressed={currentSelectedGenre === genre.id}
            >
              <span className="mr-1 sm:mr-2 text-cyan-400">#</span>
              {genre.name}
            </button>
          ))}
        </div>

        {/* Filters Panel */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            currentShowFilters
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
              transform: currentShowFilters
                ? "translateY(0)"
                : "translateY(-10px)",
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
                  value={currentSelectedGenre}
                  onChange={(e) => onFilterChange("genre", e.target.value)}
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
                  value={currentSortBy}
                  onChange={(e) => onFilterChange("sort", e.target.value)}
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
          bg-white bg-opacity-95 backdrop-blur-md
          transition-all duration-300 ease-in-out
          ${
            (shouldShowSearchResults && hasAnyResults) ||
            (shouldShowSuggestions && (hasRecentSearches || hasPopularGames))
              ? "opacity-100 max-h-80 sm:max-h-96 pointer-events-auto"
              : "opacity-0 max-h-0 pointer-events-none"
          }`}
        style={{ borderColor: "rgba(255, 255, 255, 0.2)", zIndex: "9999" }}
        onScroll={onResultsScroll}
      >
        {/* Loading State */}
        {isSearching && (
          <div className="flex items-center justify-center p-6 sm:p-8 animate-fadeIn">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-600 mb-3 sm:mb-4"></div>
              <div className="text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                Searching games...
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {shouldShowSearchResults && hasAnyResults && (
          <div className="p-3 sm:p-4">
            <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
              <Search size={14} />
              {searchResults.length} games found
            </h3>
            <div className="space-y-1">
              {searchResults.slice(0, visibleCount).map((game, index) => (
                <SearchGameItem
                  key={`search-${game.id}-${index}`}
                  game={game}
                  index={index}
                  selectedResultIndex={selectedResultIndex}
                  onResultClick={(game) =>
                    handleResultClick(game, handleGameSelect)
                  }
                  onFavoriteToggle={handleFavoriteToggle}
                  onRatingClick={openRatingModal}
                  getRatingColor={getRatingColor}
                  getUserRating={getUserRating}
                  isGameFavorited={isGameFavorited}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {shouldShowSuggestions && (hasRecentSearches || hasPopularGames) && (
          <div className="p-3 sm:p-4">
            {hasRecentSearches && (
              <div className="mb-6">
                <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <Clock size={14} className="text-blue-500" />
                  Recent Searches
                </h3>
                <div className="space-y-1">
                  {recentSearches
                    .slice(0, Math.min(3, visibleCount))
                    .map((game, index) => (
                      <SearchGameItem
                        key={`recent-${game.id}-${index}`}
                        game={game}
                        index={index}
                        isRecent={true}
                        selectedResultIndex={selectedResultIndex}
                        onResultClick={(game) =>
                          handleResultClick(game, handleGameSelect)
                        }
                        onFavoriteToggle={handleFavoriteToggle}
                        onRatingClick={openRatingModal}
                        getRatingColor={getRatingColor}
                        getUserRating={getUserRating}
                        isGameFavorited={isGameFavorited}
                        formatDate={formatDate}
                      />
                    ))}
                </div>
              </div>
            )}

            {hasPopularGames && (
              <div>
                <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <TrendingUp size={14} className="text-orange-500" />
                  Popular Games
                </h3>
                <div className="space-y-1">
                  {popularGames
                    .slice(0, visibleCount - Math.min(3, recentSearches.length))
                    .map((game, index) => (
                      <SearchGameItem
                        key={`popular-${game.id}-${index}`}
                        game={game}
                        index={recentSearches.length + index}
                        isPopular={true}
                        selectedResultIndex={selectedResultIndex}
                        onResultClick={(game) =>
                          handleResultClick(game, handleGameSelect)
                        }
                        onFavoriteToggle={handleFavoriteToggle}
                        onRatingClick={openRatingModal}
                        getRatingColor={getRatingColor}
                        getUserRating={getUserRating}
                        isGameFavorited={isGameFavorited}
                        formatDate={formatDate}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {shouldShowSearchResults && !hasAnyResults && (
          <div className="p-6 sm:p-8 text-center">
            <div className="text-gray-500 italic text-base sm:text-lg">
              No results found for "{currentSearchTerm}"
            </div>
            <div className="text-gray-400 text-sm mt-2">
              Try a different search term or genre
            </div>
          </div>
        )}

        {/* Empty State */}
        {shouldShowSuggestions && !hasRecentSearches && !hasPopularGames && (
          <div className="p-6 sm:p-8 text-center">
            <div className="text-gray-500 italic text-base sm:text-lg">
              No recent searches yet
            </div>
            <div className="text-gray-400 text-sm mt-2">
              Start searching for games to see suggestions
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
