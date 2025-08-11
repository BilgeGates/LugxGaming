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

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  selectedGenre,
  setSelectedGenre,
  sortBy,
  setSortBy,
  genres = [],
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

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
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
            prev < searchResults.length - 1 ? prev + 1 : prev
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
  ]);

  const debouncedSearch = useCallback(
    (value, genre, sort) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        if (handleSearch) {
          handleSearch(value, genre, sort);
        }
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
      }
    },
    [setSearchTerm, selectedGenre, sortBy, debouncedSearch, setShowResults]
  );

  const handleClearSearch = useCallback(() => {
    if (clearSearch) {
      clearSearch();
    }
    setShowResults(false);
    setSelectedResultIndex(-1);
  }, [clearSearch, setShowResults]);

  const handleFilterChange = useCallback(
    (filterType, value) => {
      if (filterType === "genre") {
        setSelectedGenre(value);
      } else if (filterType === "sort") {
        setSortBy(value);
      }

      if (searchTerm.trim()) {
        debouncedSearch(
          searchTerm,
          filterType === "genre" ? value : selectedGenre,
          filterType === "sort" ? value : sortBy
        );
      }
    },
    [
      searchTerm,
      selectedGenre,
      sortBy,
      setSelectedGenre,
      setSortBy,
      debouncedSearch,
    ]
  );

  const handleResultClick = useCallback(
    (game) => {
      handleGameSelect(game);
      setShowResults(false);
      setSelectedResultIndex(-1);
    },
    [handleGameSelect, setShowResults]
  );

  const safeGetRatingColor = (rating) => {
    try {
      return getRatingColor ? getRatingColor(rating) : "text-gray-500";
    } catch (error) {
      console.warn("Error getting rating color:", error);
      return "text-gray-500";
    }
  };

  const safeGetUserRating = (gameId) => {
    try {
      return getUserRating ? getUserRating(gameId) : 0;
    } catch (error) {
      console.warn("Error getting user rating:", error);
      return 0;
    }
  };

  const safeIsGameFavorited = (gameId) => {
    try {
      return isGameFavorited ? isGameFavorited(gameId) : false;
    } catch (error) {
      console.warn("Error checking if game is favorited:", error);
      return false;
    }
  };

  return (
    <div className="relative max-w-4xl" ref={searchRef}>
      <div className="flex flex-col gap-4">
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
            className={`px-4 py-4 rounded-xl transition-colors ${
              showFilters
                ? "bg-purple-700 text-white"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
            aria-label={showFilters ? "Hide filters" : "Show filters"}
            aria-expanded={showFilters}
          >
            <Filter size={20} />
          </button>
        </div>

        {showFilters && (
          <div
            className="p-4 rounded-xl border"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderColor: "rgba(255, 255, 255, 0.2)",
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
                  className="w-full px-3 py-2 rounded-lg text-gray-900 bg-white bg-opacity-90 border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
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
                  className="w-full px-3 py-2 rounded-lg text-gray-900 bg-white bg-opacity-90 border border-white border-opacity-20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Rating</option>
                  <option value="released">Release Date</option>
                  <option value="metacritic">Metacritic Score</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {showResults && searchTerm.trim() && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl overflow-y-auto z-50 max-h-96 border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
          role="listbox"
          aria-label="Search results"
        >
          {searchResults.length > 0 ? (
            <div className="p-4">
              <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                <Search size={16} />
                Found {searchResults.length} games
              </h3>
              <div className="space-y-1">
                {searchResults.map((game, index) => {
                  if (!game || !game.id) return null;

                  return (
                    <div
                      key={game.id}
                      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors group ${
                        selectedResultIndex === index
                          ? "bg-purple-100 border border-purple-300"
                          : "hover:bg-gray-100"
                      }`}
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
                        className="w-16 h-10 object-cover rounded-md shadow-sm"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/64x40?text=No+Image";
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
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
                        {safeGetUserRating(game.id) > 0 && (
                          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                            <Star size={12} fill="currentColor" />
                            {safeGetUserRating(game.id).toFixed(1)}
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (toggleFavorite) {
                              toggleFavorite(game);
                            }
                          }}
                          className={`p-2 rounded-full transition-colors ${
                            safeIsGameFavorited(game.id)
                              ? "text-red-500 hover:text-red-600 bg-red-50"
                              : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                          }`}
                          title={
                            safeIsGameFavorited(game.id)
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                          aria-label={
                            safeIsGameFavorited(game.id)
                              ? `Remove ${game.name} from favorites`
                              : `Add ${game.name} to favorites`
                          }
                        >
                          <Heart
                            size={16}
                            fill={
                              safeIsGameFavorited(game.id)
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500 text-center">
                Use ↑↓ arrows to navigate, Enter to select, Esc to close
              </div>
            </div>
          ) : (
            <div className="p-4 text-gray-800 text-center">
              <Search size={32} className="mx-auto mb-2 text-gray-400" />
              <p>No games found for "{searchTerm}"</p>
              <p className="text-sm text-gray-500 mt-1">
                Try different keywords or check filters
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
