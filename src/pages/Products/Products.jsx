import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";

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

const Products = () => {
  useDocumentTitle("Products | PlayGuide");

  const [showScrollTop, setShowScrollTop] = useState(false);

  const gameData = useGameData();
  const favorites = useFavorites();
  const rating = useRating();
  const recentViews = useRecentViews();

  const {
    allGames = [],
    loading = false,
    error = null,
    searchTerm = "",
    showFilters = false,
    setShowFilters = () => {},
    selectedGenre = "",
    sortBy = "popularity",
    searchResults = [],
    showResults = false,
    setShowResults = () => {},
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
      if (window.pageYOffset > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (error) {
    return <ErrorMessage />;
  }

  const combinedHandleClearSearch = () => {
    handleClearSearch();
    handleFilterClear();
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 text-white">
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
      <section className="container mx-auto max-w-7xl px-6 pb-20 -mt-10 relative z-20">
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
            searchResults={searchResults}
            showResults={showResults}
            setShowResults={setShowResults}
            handleGameSelect={handleGameSelect}
            getRatingColor={getRatingColor}
            getUserRating={getUserRating}
            openRatingModal={openRatingModal}
            toggleFavorite={toggleFavorite}
            isGameFavorited={isGameFavorited}
            formatDate={(date) => date || "TBA"}
            popularGames={allGames.slice(0, 10)}
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

        {!loading && (
          <>
            {displayedGames.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "columns-1 sm:columns-2 lg:columns-4 gap-6"
                    : "flex flex-col gap-6"
                }
              >
                {displayedGames.map((game) => (
                  <div key={game.id} className="mb-6 break-inside-avoid">
                    <GameCard
                      game={game}
                      animated={true}
                      getUserRating={getUserRating}
                      onSelect={handleGameSelect}
                      onRate={openRatingModal}
                      onToggleFavorite={toggleFavorite}
                      isFavorited={isGameFavorited(game.id)}
                      showActions={true}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 max-w-md mx-auto">
                  <p className="text-gray-400 text-lg mb-4">No games found</p>
                  <p className="text-gray-500 text-sm mb-6">
                    Try adjusting your search criteria or clear filters to see
                    more results.
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
          </>
        )}
      </section>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full shadow-2xl flex items-center justify-center group"
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
