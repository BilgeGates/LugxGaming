import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  Search,
  X,
  Filter,
  Gamepad2,
  Star,
  Heart,
  Calendar,
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
}) => {
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false); // Yeni state

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
        setSelectedResultIndex(-1);
      }
    };

    const handleKeyDown = (event) => {
      if (!showResults || searchResults.length === 0) return;

      // eslint-disable-next-line default-case
      switch (event.key) {
        case "Escape":
          setShowResults(false);
          setSelectedResultIndex(-1);
          break;
        case "ArrowDown":
          event.preventDefault();
          setSelectedResultIndex((prev) =>
            prev < visibleCount - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedResultIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          event.preventDefault();
          if (selectedResultIndex >= 0) {
            handleGameSelect(searchResults[selectedResultIndex]);
            setShowResults(false);
            setSelectedResultIndex(-1);
          }
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
    setShowResults,
    setShowFilters,
    showResults,
    searchResults,
    selectedResultIndex,
    handleGameSelect,
    visibleCount,
  ]);

  const debouncedSearch = useCallback(
    (value, genre, sort) => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

      if (value.trim() || genre) {
        setIsSearching(true);
      }

      searchTimeoutRef.current = setTimeout(async () => {
        if (handleSearch) {
          await handleSearch(value, genre, sort);
        }
        setVisibleCount(4);
        setIsSearching(false);
      }, 300);
    },
    [handleSearch]
  );

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchTerm(value);
      setSelectedResultIndex(-1);

      if (value.trim()) {
        setShowResults(true);
        debouncedSearch(value, selectedGenre, sortBy);
      } else {
        setShowResults(false);
        setIsSearching(false);
        debouncedSearch("", "", "relevance");
      }
    },
    [setSearchTerm, selectedGenre, sortBy, debouncedSearch, setShowResults]
  );

  const handleClearSearch = useCallback(() => {
    if (clearSearch) clearSearch();
    setShowResults(false);
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

      if (searchTerm.trim() || newGenre || newSort !== "relevance") {
        debouncedSearch(searchTerm, newGenre, newSort);
        setShowResults(true);
      } else {
        setShowResults(false);
        setIsSearching(false);
      }
    },
    [
      searchTerm,
      selectedGenre,
      sortBy,
      setSelectedGenre,
      setSortBy,
      debouncedSearch,
      setShowResults,
    ]
  );

  const handleResultClick = useCallback(
    (game) => {
      handleGameSelect(game);
      setShowResults(false);
      setSelectedResultIndex(-1);
      setVisibleCount(7);
    },
    [handleGameSelect, setShowResults]
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

  const handlePopularGenreClick = (genre) => {
    setSelectedGenre(genre.id);
    setSearchTerm("");
    setShowResults(false);
    if (handleSearch) handleSearch("", genre.id, sortBy);
    setVisibleCount(7);
  };

  const onResultsScroll = (e) => {
    const target = e.target;
    if (
      !loadingMore &&
      target.scrollTop + target.clientHeight >= target.scrollHeight - 20 &&
      visibleCount < searchResults.length
    ) {
      setLoadingMore(true);
      setTimeout(() => {
        setVisibleCount((v) => Math.min(v + 7, searchResults.length));
        setLoadingMore(false);
      }, 700);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto" ref={searchRef}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search games by name, genre, or keyword..."
              className="w-full pl-12 pr-12 py-4 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 border"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
              aria-label="Search games"
              autoComplete="off"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-4 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 ${
              showFilters
                ? "bg-purple-700 text-white shadow-lg"
                : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg"
            }`}
            aria-label={showFilters ? "Hide filters" : "Show filters"}
            aria-expanded={showFilters}
          >
            <Filter size={20} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 px-1">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handlePopularGenreClick(genre)}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 ${
                selectedGenre === genre.id
                  ? "bg-purple-700 text-white shadow-md"
                  : "bg-purple-100 text-purple-800 hover:bg-purple-200 hover:shadow-sm"
              }`}
              aria-pressed={selectedGenre === genre.id}
              aria-label={`Search popular genre ${genre.name}`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showFilters ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div
            className="p-4 rounded-xl border transform transition-all duration-300 ease-in-out"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderColor: "rgba(255, 255, 255, 0.2)",
              transform: showFilters ? "translateY(0)" : "translateY(-10px)",
            }}
            role="region"
            aria-label="Search filters"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label
                  htmlFor="genre-select"
                  className="block text-sm text-gray-300 mb-1"
                >
                  Genre
                </label>
                <select
                  id="genre-select"
                  value={selectedGenre}
                  onChange={(e) => handleFilterChange("genre", e.target.value)}
                  className="w-full px-3 py-2 pr-8 rounded-lg bg-gray-900 bg-opacity-90 text-gray-200 border border-gray-700
             focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-0
             appearance-none transition-all duration-200 ease-in-out hover:border-gray-600 focus:border-cyan-500
             bg-no-repeat bg-[left_1rem_center] bg-[length:12px_12px]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='lightgray' height='12' viewBox='0 0 24 24' width='12' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
                  }}
                >
                  <option className="bg-gray-900 text-gray-200" value="">
                    All Genres
                  </option>
                  {genres.map((genre) => (
                    <option
                      key={genre.id}
                      value={genre.id}
                      className="bg-gray-900 text-gray-200 hover:bg-cyan-600 hover:text-white"
                    >
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="sort-select"
                  className="block text-sm text-gray-300 mb-1"
                >
                  Sort By
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  className="w-full px-3 py-2 pr-8 rounded-lg bg-gray-900 bg-opacity-90 text-gray-200 border border-gray-700
             focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-0
             appearance-none transition-all duration-200 ease-in-out hover:border-gray-600 focus:border-cyan-500
             bg-no-repeat bg-[left_1rem_center] bg-[length:12px_12px]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='lightgray' height='12' viewBox='0 0 24 24' width='12' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
                  }}
                >
                  <option
                    className="bg-gray-900 text-gray-200"
                    value="relevance"
                  >
                    Relevance
                  </option>
                  <option
                    className="bg-gray-900 text-gray-200 hover:bg-cyan-600 hover:text-white"
                    value="rating"
                  >
                    Rating
                  </option>
                  <option
                    className="bg-gray-900 text-gray-200 hover:bg-cyan-600 hover:text-white"
                    value="released"
                  >
                    Release Date
                  </option>
                  <option
                    className="bg-gray-900 text-gray-200 hover:bg-cyan-600 hover:text-white"
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

      <div
        className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl overflow-y-auto z-50 border
          bg-white bg-opacity-95 backdrop-blur
          transition-all duration-300 ease-in-out
          ${
            showResults && (searchTerm.trim() || selectedGenre)
              ? "opacity-100 max-h-96 pointer-events-auto"
              : "opacity-0 max-h-0 pointer-events-none"
          }`}
        style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
        role="listbox"
        aria-label="Search results"
        onScroll={onResultsScroll}
      >
        {isSearching && (
          <div className="flex items-center justify-center p-8 animate-fadeIn">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
              <div className="text-lg font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                Searching for games...
              </div>
            </div>
          </div>
        )}

        {!isSearching && searchResults.length > 0 ? (
          <div className="p-4 relative">
            <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
              <Search size={16} />
              Found {searchResults.length} games
            </h3>
            <div className="space-y-1">
              {searchResults.slice(0, visibleCount).map((game, index) => {
                if (!game || !game.id) return null;

                const userRating = safeGetUserRating(game.id);
                const isFavorited = safeIsGameFavorited(game.id);

                return (
                  <div
                    key={game.id}
                    className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out group opacity-0 animate-fadeIn hover:shadow-md ${
                      selectedResultIndex === index
                        ? "bg-purple-100 transform scale-102"
                        : "hover:bg-gray-50"
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: "forwards",
                    }}
                    onClick={() => handleResultClick(game)}
                    role="option"
                    aria-selected={selectedResultIndex === index}
                  >
                    <img
                      src={
                        game.background_image ||
                        "https://via.placeholder.com/64x40?text=No+Image"
                      }
                      alt={game.name || "Game image"}
                      className="w-16 h-10 object-cover rounded-md shadow-sm transition-transform duration-200 ease-in-out group-hover:scale-105"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/64x40?text=No+Image";
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-200 ease-in-out">
                        {game.name || "Unknown Game"}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                        {game.genres && game.genres.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Gamepad2 size={14} />
                            {game.genres[0].name}
                          </span>
                        )}
                        {game.rating > 0 && (
                          <span
                            className={`flex items-center gap-1 ${safeGetRatingColor(
                              game.rating
                            )}`}
                          >
                            <Star size={14} />
                            {game.rating.toFixed(1)}
                          </span>
                        )}
                        {game.released && (
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate
                              ? formatDate(game.released)
                              : new Date(game.released).getFullYear()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {userRating > 0 && (
                        <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs select-none">
                          <Star size={12} fill="currentColor" />
                          {userRating.toFixed(1)}
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (openRatingModal) openRatingModal(game, e);
                        }}
                        title="Rate this game"
                        className="p-2 rounded-full text-yellow-500 hover:text-yellow-600 transition-all duration-200 ease-in-out hover:bg-yellow-50 hover:scale-110"
                        aria-label={`Rate ${game.name} game`}
                      >
                        <Star
                          size={16}
                          fill={userRating > 0 ? "currentColor" : "none"}
                          stroke="currentColor"
                        />
                      </button>

                      <button
                        onClick={(e) => handleFavoriteToggle(e, game)}
                        className={`p-2 rounded-full transition-all duration-200 ease-in-out hover:scale-110 ${
                          isFavorited
                            ? "text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100"
                            : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                        }`}
                        title={
                          isFavorited
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                        aria-label={
                          isFavorited
                            ? `Remove ${game.name} from favorites`
                            : `Add ${game.name} to favorites`
                        }
                      >
                        <Heart
                          size={16}
                          fill={isFavorited ? "currentColor" : "none"}
                          stroke="currentColor"
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {loadingMore && (
              <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 flex justify-center items-center p-3 rounded-b-xl pointer-events-none">
                <div className="flex items-center gap-2 text-purple-600">
                  <div className="w-6 h-6 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium">
                    Loading more games...
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : !isSearching && (searchTerm.trim() || selectedGenre) ? (
          <div className="p-8 text-center">
            <div className="text-gray-500 italic text-lg">
              No games found matching your search.
            </div>
            <div className="text-gray-400 text-sm mt-2">
              Try different keywords or clear your filters.
            </div>
          </div>
        ) : null}
      </div>

      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default SearchBar;
