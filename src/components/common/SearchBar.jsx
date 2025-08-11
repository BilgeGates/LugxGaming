import React, { useRef, useEffect } from "react";
import {
  Search,
  X,
  Filter,
  Gamepad2,
  Star,
  Calendar,
  Heart,
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
  genres,
  handleSearch,
  clearSearch,
  searchResults,
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowResults, setShowFilters]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      handleSearch(value, selectedGenre, sortBy);
    }, 500);
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
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
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
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-300 mb-1">
                  Genre
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => {
                    setSelectedGenre(e.target.value);
                    handleSearch(searchTerm, e.target.value, sortBy);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-black bg-opacity-20 text-white border border-white border-opacity-20"
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
                <label className="block text-sm text-gray-300 mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    handleSearch(searchTerm, selectedGenre, e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-black bg-opacity-20 text-white border border-white border-opacity-20"
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

      {showResults && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl overflow-y-auto z-50 max-h-screen border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          }}
        >
          {searchResults.length > 0 ? (
            <div className="p-4">
              <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                <Search size={16} />
                Found {searchResults.length} games
                {selectedGenre && (
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                    {genres.find((g) => g.id === selectedGenre)?.name}
                  </span>
                )}
              </h3>

              <div className="space-y-3">
                {searchResults.map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors group"
                    onClick={() => handleGameSelect(game)} // 🔹 bütün kart klikində işləyir
                  >
                    <img
                      src={
                        game.background_image ||
                        "https://via.placeholder.com/64x40?text=No+Image"
                      }
                      alt={game.name}
                      className="w-16 h-10 object-cover rounded-md"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/64x40?text=No+Image";
                      }}
                    />

                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                        {game.name}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                        {game.genres && game.genres.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Gamepad2 size={14} />
                            {game.genres[0].name}
                          </span>
                        )}
                        {game.rating && (
                          <span
                            className={`flex items-center gap-1 ${getRatingColor(
                              game.rating
                            )}`}
                          >
                            <Star size={14} />
                            {game.rating}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(game.released)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openRatingModal(game, e);
                        }}
                        className="p-1 rounded-full text-gray-400 hover:text-yellow-500 transition-colors"
                        title="Rate this game"
                      >
                        <Star
                          size={16}
                          fill={
                            getUserRating(game.id) > 0 ? "currentColor" : "none"
                          }
                          className={
                            getUserRating(game.id) > 0 ? "text-yellow-500" : ""
                          }
                        />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(game);
                        }}
                        className={`p-1 rounded-full transition-colors ${
                          isGameFavorited(game.id)
                            ? "text-red-500 hover:text-red-600"
                            : "text-gray-400 hover:text-red-500"
                        }`}
                      >
                        <Heart
                          size={16}
                          fill={
                            isGameFavorited(game.id) ? "currentColor" : "none"
                          }
                        />
                      </button>

                      {getUserRating(game.id) > 0 && (
                        <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                          <Star size={12} fill="currentColor" />
                          {getUserRating(game.id)}
                        </div>
                      )}

                      {game.metacritic && (
                        <div
                          className={`text-xs px-2 py-1 rounded ${
                            game.metacritic >= 80
                              ? "bg-green-100 text-green-800"
                              : game.metacritic >= 60
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {game.metacritic}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-600">
              <Search size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No games found</h3>
              <p>Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
