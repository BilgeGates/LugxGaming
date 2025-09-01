import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Layout components
import Navbar from "../../layout/Navbar/Navbar";
import Footer from "../../layout/Footer/Footer";

// Common components
import SearchBar from "../../components/common/SearchBar";
import RatingModal from "../../components/common/RatingModal";
import Controls from "../../components/common/Controls";
import GameCard from "../../components/common/GameCard";
import Pagination from "../../components/common/Pagination";

// Custom hooks
import {
  useGameData,
  useFavorites,
  useRating,
  useRecentViews,
  useDocumentTitle,
  useHandlers,
  useLogic,
} from "../../hooks";

// UI components
import { ErrorMessage, LoadingSpinner } from "../../components/ui";

// Date utilities
import { formatReleaseDate } from "../../utils";

// Icons
import { ArrowUp, Calendar, Users, Star, Heart } from "lucide-react";

const Products = () => {
  useDocumentTitle("Products | PlayGuide");

  const [showScrollTop, setShowScrollTop] = useState(false);

  const gameData = useGameData();
  const favorites = useFavorites();
  const rating = useRating();
  const recentViews = useRecentViews();

  const {
    loading = false,
    error = null,
    searchTerm = "",
    showFilters = false,
    setShowFilters = () => {},
    selectedGenre = "",
    sortBy = "popularity",
    searchResults = [],
    showResults = false,
    genres = [],
  } = gameData || {};

  const { toggleFavorite = () => {}, isGameFavorited = () => false } =
    favorites || {};

  const {
    submitRating = () => {},
    getUserRating = () => 0,
    getRatingColor = () => "#gray",
  } = rating || {};

  const { addToRecentViews = () => {} } = recentViews || {};

  const {
    displayedGames,
    currentPage,
    viewMode,
    totalPages,
    setCurrentPage,
    setViewMode,
    handleFilterClear,
  } = useLogic(gameData, searchResults, showResults);

  const {
    showRatingModal,
    selectedGame,
    setShowRatingModal,
    setSelectedGame,
    handleGameSelect,
    openRatingModal,
    handleRatingSubmit,
    handleSearch,
    handleGenreSelect,
    handleSortChange,
    handleClearSearch,
  } = useHandlers(gameData, addToRecentViews, submitRating);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) return <ErrorMessage />;

  const combinedHandleClearSearch = () => {
    handleClearSearch();
    handleFilterClear();
  };

  // Platform icons helper
  const getPlatformIcon = (platform) => {
    const name = platform?.platform?.name?.toLowerCase() || "";
    if (name.includes("playstation")) return "🎮";
    if (name.includes("xbox")) return "🎮";
    if (name.includes("pc") || name.includes("windows")) return "💻";
    if (name.includes("nintendo")) return "🎮";
    if (name.includes("ios") || name.includes("android")) return "📱";
    return "🎮";
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-28 pb-24 overflow-hidden 0 text-white">
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

      {/* Main Section */}
      <section className="container mx-auto max-w-7xl px-6 pb-32 -mt-10 relative z-20">
        <div className="mb-8">
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
            clearSearch={combinedHandleClearSearch}
            handleGameSelect={handleGameSelect}
            getRatingColor={getRatingColor}
            getUserRating={getUserRating}
            openRatingModal={openRatingModal}
            toggleFavorite={toggleFavorite}
            isGameFavorited={isGameFavorited}
            formatDate={formatReleaseDate}
            recentSearches={[]}
            genres={genres}
          />
        </div>

        <Controls
          sortBy={sortBy}
          handleSortChange={handleSortChange}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {loading && <LoadingSpinner />}

        {!loading && displayedGames.length > 0 && (
          <>
            {viewMode === "grid" ? (
              <div className="colums-1 sm:columns-2 lg:columns-4 gap-6">
                {displayedGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    viewMode={viewMode}
                    animated={true}
                    getUserRating={getUserRating}
                    onSelect={handleGameSelect}
                    onRate={openRatingModal}
                    onToggleFavorite={toggleFavorite}
                    isFavorited={isGameFavorited(game.id)}
                    showActions={true}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {displayedGames.map((game) => (
                  <Link
                    to={`/products/${game.id}`}
                    key={game.id}
                    className="block bg-gray-900/70 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30 hover:border-cyan-500/40 hover:bg-gray-800/70 transition-all duration-300 group"
                  >
                    <div className="flex gap-4 items-center">
                      {/* Game Image */}
                      <div className="w-24 h-16 sm:w-28 sm:h-18 md:w-32 md:h-20 rounded-lg overflow-hidden flex-shrink-0 relative">
                        <img
                          src={game.background_image || "/placeholder-game.jpg"}
                          alt={game.name || "Game"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {game.rating && (
                          <div className="absolute top-2 left-2 bg-black/80 text-green-400 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            {game.rating.toFixed(1)}
                          </div>
                        )}
                      </div>

                      {/* Game Info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                            {game.name || "Unknown Game"}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* User Rating */}
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= getUserRating(game.id)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                            {/* Favorite */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                toggleFavorite(game.id);
                              }}
                              className={`p-1 rounded-full transition-colors ${
                                isGameFavorited(game.id)
                                  ? "text-red-500 hover:text-red-400"
                                  : "text-gray-500 hover:text-red-500"
                              }`}
                            >
                              <Heart
                                className="w-5 h-5"
                                fill={
                                  isGameFavorited(game.id)
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            </button>
                          </div>
                        </div>

                        {/* Genre, Release, Reviews */}
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full font-medium">
                            {game.genres?.[0]?.name || "Unknown Genre"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatReleaseDate(game.released)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {game.ratings_count
                              ? `${Math.round(game.ratings_count / 1000)}k`
                              : "0"}{" "}
                            reviews
                          </span>
                        </div>

                        {/* Platforms and Metacritic */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              Platforms:
                            </span>
                            <div className="flex items-center gap-1">
                              {(game.platforms || [])
                                .slice(0, 4)
                                .map((platform, idx) => (
                                  <span
                                    key={idx}
                                    className="text-sm"
                                    title={platform?.platform?.name}
                                  >
                                    {getPlatformIcon(platform)}
                                  </span>
                                ))}
                              {(game.platforms || []).length > 4 && (
                                <span className="text-xs text-gray-500">
                                  +{(game.platforms || []).length - 4}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {game.metacritic && (
                              <div className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-bold">
                                MC {game.metacritic}
                              </div>
                            )}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                openRatingModal(game);
                              }}
                              className="px-3 py-1.5 bg-gradient-to-r from-yellow-500/80 to-orange-500/80 hover:from-yellow-500 hover:to-orange-500 text-white font-medium rounded-md transition-all duration-300 flex items-center gap-1 text-xs"
                            >
                              <Star className="w-3.5 h-3.5" />
                              Rate
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {!loading && displayedGames.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 max-w-md mx-auto">
              <p className="text-gray-400 text-lg mb-4">No games found</p>
              <p className="text-gray-500 text-sm mb-6">
                Try adjusting your search criteria or clear filters to see more
                results.
              </p>
              <button
                onClick={combinedHandleClearSearch}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </section>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 transition-transform duration-300"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

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
