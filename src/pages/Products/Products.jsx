import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../../layout/Navbar/Navbar";
import Footer from "../../layout/Footer/Footer";
import GameCard from "../../components/common/GameCard";
import SearchBar from "../../components/common/SearchBar";
import RatingModal from "../../components/common/RatingModal";
import { Grid3X3, List, Calendar, Users, Eye, ArrowUpDown } from "lucide-react";
import {
  getPlatformIcon,
  formatReleaseDate,
  capitalize,
  formatRatingScore,
} from "../../utils/gameUtils";
import useGameData from "../../hooks/useGameData";
import useFavorites from "../../hooks/useFavorites";
import useRating from "../../hooks/useRating";
import useRecentViews from "../../hooks/useRecentViews";

const GAMES_PER_PAGE = 12;

// Genre mapping
const genreMapping = {
  action: "4",
  adventure: "3",
  "role-playing-games-rpg": "5",
  strategy: "10",
  shooter: "2",
  sports: "15",
  racing: "1",
  puzzle: "7",
  casual: "40",
  simulation: "14",
  platformer: "83",
  arcade: "11",
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredGames, setFilteredGames] = useState([]);
  const [displayedGames, setDisplayedGames] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  // Hooks - safe destructuring with fallbacks
  const gameDataResult = useGameData();
  const favoritesResult = useFavorites();
  const ratingResult = useRating();
  const recentViewsResult = useRecentViews();

  // Safe extraction with defaults
  const {
    allGames = [],
    loading = false,
    error = null,
    searchTerm = "",
    setSearchTerm = () => {},
    showFilters = false,
    setShowFilters = () => {},
    selectedGenre = "",
    setSelectedGenre = () => {},
    sortBy = "popularity",
    setSortBy = () => {},
    searchResults = [],
    showResults = false,
    setShowResults = () => {},
    searchGames = () => {},
    clearSearch = () => {},
    genres = [],
    formatDate = (date) => date || "TBA",
  } = gameDataResult || {};

  const {
    favorites = [],
    toggleFavorite = () => {},
    isGameFavorited = () => false,
  } = favoritesResult || {};

  const {
    submitRating = () => {},
    getUserRating = () => 0,
    getRatingColor: getCustomRatingColor = () => "#gray",
  } = ratingResult || {};

  const { addToRecentViews = () => {} } = recentViewsResult || {};

  // Check URL parameters on mount
  useEffect(() => {
    const filterFromUrl = searchParams.get("filter");
    if (filterFromUrl && genreMapping[filterFromUrl]) {
      setActiveFilter(filterFromUrl);
      const genreId = genreMapping[filterFromUrl];
      setSelectedGenre(genreId);
      if (searchGames) {
        searchGames("", genreId, sortBy);
      }
    }
  }, [searchParams]);

  // Sort function
  const sortGames = useCallback((games, sortType) => {
    if (!games || !Array.isArray(games)) return [];

    const sortedGames = [...games];
    switch (sortType) {
      case "name":
        return sortedGames.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );
      case "rating":
        return sortedGames.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "released":
      case "release_date":
        return sortedGames.sort((a, b) => {
          const dateA = new Date(a.released || 0);
          const dateB = new Date(b.released || 0);
          return dateB - dateA;
        });
      case "metacritic":
        return sortedGames.sort(
          (a, b) => (b.metacritic || 0) - (a.metacritic || 0)
        );
      case "popularity":
      case "relevance":
      default:
        return sortedGames.sort(
          (a, b) => (b.ratings_count || 0) - (a.ratings_count || 0)
        );
    }
  }, []);

  // Filter games
  useEffect(() => {
    let filtered = [];

    try {
      if (showResults && searchResults.length > 0) {
        filtered = searchResults;
      } else if (activeFilter !== "all" && genreMapping[activeFilter]) {
        const genreId = genreMapping[activeFilter];
        filtered = allGames.filter(
          (game) =>
            game.genres &&
            game.genres.some((g) => g.id && g.id.toString() === genreId)
        );
      } else {
        filtered = allGames;
      }

      // Apply search term filter
      if (searchTerm && searchTerm.trim() && !showResults) {
        filtered = filtered.filter(
          (game) =>
            game.name &&
            game.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Sort games
      filtered = sortGames(filtered, sortBy);

      setFilteredGames(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error filtering games:", error);
      setFilteredGames([]);
    }
  }, [
    allGames,
    activeFilter,
    searchTerm,
    sortBy,
    searchResults,
    showResults,
    sortGames,
  ]);

  // Pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * GAMES_PER_PAGE;
    const endIndex = startIndex + GAMES_PER_PAGE;
    setDisplayedGames(filteredGames.slice(startIndex, endIndex));
  }, [filteredGames, currentPage]);

  // Event handlers
  const handleGameSelect = useCallback(
    (game) => {
      if (game && addToRecentViews) {
        addToRecentViews(game);
      }
    },
    [addToRecentViews]
  );

  const openRatingModal = useCallback((game, e) => {
    if (e) e.stopPropagation();
    if (game) {
      setSelectedGame(game);
      setShowRatingModal(true);
    }
  }, []);

  const handleRatingSubmit = useCallback(
    (rating) => {
      if (selectedGame && submitRating) {
        submitRating(selectedGame.id, rating);
        setShowRatingModal(false);
        setSelectedGame(null);
      }
    },
    [selectedGame, submitRating]
  );

  const handleSearch = useCallback(
    (term) => {
      setSearchTerm(term);
      if (term && term.trim()) {
        searchGames(term, selectedGenre, sortBy);
      } else {
        setShowResults(false);
      }
    },
    [setSearchTerm, searchGames, selectedGenre, sortBy, setShowResults]
  );

  const handleGenreSelect = useCallback(
    (genreId) => {
      setSelectedGenre(genreId);
      searchGames(searchTerm, genreId, sortBy);
    },
    [setSelectedGenre, searchGames, searchTerm, sortBy]
  );

  const handleSortChange = useCallback(
    (newSortBy) => {
      setSortBy(newSortBy);
      searchGames(searchTerm, selectedGenre, newSortBy);
    },
    [setSortBy, searchGames, searchTerm, selectedGenre]
  );

  const handleClearSearch = useCallback(() => {
    clearSearch();
    setActiveFilter("all");
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("filter");
    setSearchParams(newSearchParams);
  }, [clearSearch, searchParams, setSearchParams]);

  const totalPages = useMemo(
    () => Math.ceil(filteredGames.length / GAMES_PER_PAGE),
    [filteredGames]
  );

  // Platform icon renderer
  const renderPlatformIcon = useCallback((platform, index, gameId) => {
    if (!platform) return null;

    try {
      const PlatformIcon = getPlatformIcon ? getPlatformIcon([platform]) : null;
      if (PlatformIcon) {
        return (
          <PlatformIcon
            key={`${gameId}-platform-${index}`}
            className="w-5 h-5 text-gray-400"
          />
        );
      }
    } catch (error) {
      console.error("Platform icon error:", error);
    }

    return (
      <div
        key={`${gameId}-platform-${index}`}
        className="w-5 h-5 bg-gray-600 rounded"
      />
    );
  }, []);

  // Game card wrapper component
  const GameCardWrapper = React.memo(({ game, index }) => {
    if (!game) return null;

    const primaryGenre = game.genres?.[0]?.name || "Unknown";
    const releaseDate = formatReleaseDate
      ? formatReleaseDate(game.released)
      : formatDate(game.released);
    const ratingScore = formatRatingScore
      ? formatRatingScore(game.rating)
      : Math.round((game.rating || 0) * 20);

    if (viewMode === "list") {
      return (
        <div
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer"
          onClick={() => handleGameSelect(game)}
        >
          <div className="flex gap-6">
            <div className="relative w-48 h-28 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={game.background_image || "/placeholder-game.jpg"}
                alt={game.name || "Game"}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  e.target.src = "/placeholder-game.jpg";
                }}
              />
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 rounded-full text-xs font-bold text-white bg-black/70">
                  {ratingScore}%
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <span className="text-sm text-cyan-400 font-medium">
                  {primaryGenre}
                </span>
                <h3 className="text-xl font-bold text-white mb-2 hover:text-cyan-400 transition-colors">
                  {game.name || "Unknown Game"}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {releaseDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {game.ratings_count || 0} reviews
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {(game.platforms || [])
                    .slice(0, 3)
                    .map((p, idx) => renderPlatformIcon(p, idx, game.id))}
                </div>
                <Link to={`/products/${game.id}`}>
                  <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Explore
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Grid view - use GameCard component
    return (
      <GameCard
        key={game.id}
        game={game}
        animated={true}
        getUserRating={getUserRating}
        onGameSelect={handleGameSelect}
        onRate={openRatingModal}
        onToggleFavorite={toggleFavorite}
        isFavorited={isGameFavorited(game.id)}
      />
    );
  });

  // Error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-gray-400 mb-6">Failed to load games data</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-300"
            >
              Reload Page
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-cyan-900/20" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative container mx-auto max-w-7xl px-6 text-white text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Game Products
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover amazing games from every genre. Find your next gaming
            adventure with our curated collection.
          </p>

          <nav className="flex items-center justify-center gap-2 text-sm">
            <Link
              to="/"
              className="text-cyan-400 hover:text-white transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-white font-semibold">Products</span>
          </nav>
        </div>
      </div>

      <section className="container mx-auto max-w-7xl px-6 pb-20 -mt-10 relative z-20">
        {/* Search Bar */}
        <div className="mb-8">
          {setSearchTerm && (
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={handleSearch}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              selectedGenre={selectedGenre}
              setSelectedGenre={handleGenreSelect}
              sortBy={sortBy}
              setSortBy={handleSortChange}
              handleSearch={handleSearch}
              clearSearch={handleClearSearch}
              searchResults={searchResults}
              showResults={showResults}
              setShowResults={setShowResults}
              handleGameSelect={handleGameSelect}
              getRatingColor={getCustomRatingColor}
              getUserRating={getUserRating}
              openRatingModal={openRatingModal}
              toggleFavorite={toggleFavorite}
              isGameFavorited={isGameFavorited}
              formatDate={formatDate}
              popularGames={allGames.slice(0, 10)}
              recentSearches={[]}
              genres={genres}
            />
          )}
        </div>

        {/* Controls */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-2 pr-10 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
              >
                <option value="relevance">Most Relevant</option>
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="released">Latest Release</option>
                <option value="metacritic">Metacritic Score</option>
                <option value="name">A-Z</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-cyan-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-cyan-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-8 text-center">
          <p className="text-gray-400">
            Showing{" "}
            <span className="text-cyan-400 font-semibold">
              {filteredGames.length}
            </span>{" "}
            games
            {activeFilter !== "all" && (
              <span>
                {" "}
                in{" "}
                <span className="text-purple-400 font-semibold">
                  {capitalize
                    ? capitalize(activeFilter.replace(/-/g, " "))
                    : activeFilter}
                </span>{" "}
                category
              </span>
            )}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
              <p className="text-lg text-gray-400">Loading amazing games...</p>
            </div>
          </div>
        )}

        {/* Games Grid/List */}
        {!loading && (
          <>
            {displayedGames.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-6"
                }
              >
                {displayedGames.map((game, index) => (
                  <GameCardWrapper
                    key={`${game.id}-${index}`}
                    game={game}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              /* No Results */
              <div className="text-center py-20">
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 max-w-md mx-auto">
                  <p className="text-gray-400 text-lg mb-4">No games found</p>
                  <p className="text-gray-500 text-sm mb-6">
                    Try adjusting your search criteria or clear filters to see
                    more results.
                  </p>
                  <button
                    onClick={handleClearSearch}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-300"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && displayedGames.length > 0 && (
              <div className="mt-16 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    currentPage === 1
                      ? "bg-gray-800/50 text-gray-500 cursor-not-allowed"
                      : "bg-gray-900/50 text-white hover:bg-gray-700/50"
                  }`}
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + Math.max(1, currentPage - 2);
                  if (page > totalPages) return null;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        currentPage === page
                          ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                          : "bg-gray-900/50 text-gray-300 hover:text-white"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    currentPage === totalPages
                      ? "bg-gray-800/50 text-gray-500 cursor-not-allowed"
                      : "bg-gray-900/50 text-white hover:bg-gray-700/50"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Rating Modal */}
      {showRatingModal && selectedGame && (
        <RatingModal
          show={showRatingModal}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedGame(null);
          }}
          game={selectedGame}
          onSubmitRating={handleRatingSubmit}
          currentRating={getUserRating(selectedGame.id)}
        />
      )}

      <Footer />
    </>
  );
};

export default Products;

// ====================================================== ********************* help me
// *************************************** ==================================================
