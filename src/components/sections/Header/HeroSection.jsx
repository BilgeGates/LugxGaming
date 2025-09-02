import { useState, useEffect } from "react";

import { getPopularGames } from "../../../utils";

import SearchBar from "../../../components/common/SearchBar";

import { Gamepad2, Star, Users } from "lucide-react";

// Hero section background images (auto-cycling slideshow)
const heroImages = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop&crop=center",
];

const HeroSection = ({
  allGames,
  loading,
  stats,
  handleGameSelect,
  openRatingModal,
  getUserRating,
  getRatingColor,
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
  toggleFavorite,
  isGameFavorited,
  formatDate,
}) => {
  // Tracks which hero image is currently shown
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Stores the last few recent searches
  const [recentSearches, setRecentSearches] = useState([]);

  /**
   * Adds a game to the recent searches list.
   * Ensures no duplicates and keeps only the latest 5.
   */
  const handleAddRecentSearch = (game) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((g) => g.id !== game.id);
      return [game, ...filtered].slice(0, 1000);
    });
  };

  /**
   * Auto-rotate hero images every 5 seconds
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative z-10 pt-20">
      <div className="container mx-auto px-6 py-8">
        <div
          className="flex flex-col lg:flex-row items-center justify-between min-h-screen lg:min-h-0"
          style={{ minHeight: "80vh" }}
        >
          {/* Left side: heading, description, search bar, stats */}
          <div className="lg:w-1/2 space-y-8">
            <div className="space-y-4">
              {/* Section label with small icon */}
              <div className="flex items-center gap-2 text-cyan-400">
                <Gamepad2 size={24} />
                <span className="text-sm font-semibold tracking-wider uppercase">
                  Welcome to Play Guide
                </span>
              </div>

              {/* Main headline */}
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight select-none">
                Best{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(45deg, rgb(34, 211, 238), rgb(168, 85, 247))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Gaming
                </span>{" "}
                Site Ever!
              </h1>

              {/* Short description */}
              <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
                Discover amazing games from our curated collection. Search,
                filter, and find your next favorite game with advanced search
                capabilities.
              </p>

              {/* Loading state */}
              {loading && (
                <div className="flex items-center gap-2 text-cyan-400">
                  <div className="w-4 h-4 border-2 border-cyan-200 border-t-cyan-400 rounded-full animate-spin"></div>
                  <span>Loading games...</span>
                </div>
              )}

              {/* Search bar with filters, favorites, rating modal, etc. */}
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                sortBy={sortBy}
                setSortBy={setSortBy}
                genres={genres.slice(0, 5)}
                handleSearch={handleSearch}
                clearSearch={clearSearch}
                searchResults={searchResults}
                showResults={showResults}
                setShowResults={setShowResults}
                handleGameSelect={handleGameSelect}
                getRatingColor={getRatingColor}
                getUserRating={getUserRating}
                toggleFavorite={toggleFavorite}
                isGameFavorited={isGameFavorited}
                formatDate={formatDate}
                openRatingModal={openRatingModal}
                recentSearches={recentSearches}
                onAddRecentSearch={handleAddRecentSearch}
              />

              {/* Game statistics (clickable shortcuts) */}
              {!loading && (
                <div className="flex items-center gap-6 text-sm text-gray-300 flex-wrap">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 ${
                        stat.clickable
                          ? "cursor-pointer text-white"
                          : "disabled:bg-gray-400 disabled:cursor-not-allowed select-none opacity-70"
                      }`}
                      onClick={stat.onClick}
                    >
                      <stat.icon size={16} className={stat.color} />
                      <span>{stat.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side: hero image with overlay badges and effects */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end w-full mt-12 lg:mt-0">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
              {/* Hero image (auto-rotating) */}
              <img
                src={heroImages[currentImageIndex]}
                alt="Gaming Hero"
                className="relative w-full h-auto rounded-xl sm:rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-500"
              />

              {/* Hero image navigation dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-white"
                        : "bg-white bg-opacity-50"
                    }`}
                    aria-label={`Show hero image ${index + 1}`}
                  />
                ))}
              </div>

              {/* Floating animated gamepad icon */}
              <div
                className="absolute -bottom-4 -right-4 p-4 rounded-xl shadow-lg animate-bounce"
                style={{
                  background:
                    "linear-gradient(45deg, rgb(34, 211, 238), rgb(168, 85, 247))",
                }}
              >
                <Gamepad2 size={30} className="text-white" />
              </div>

              {/* Rating badge */}
              <div
                className="absolute p-3 rounded-lg shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300"
                style={{
                  left: "-32px",
                  top: "32px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="flex items-center gap-2 text-white text-sm">
                  <Star size={16} className="text-yellow-400" />
                  <span>4.8 Rating</span>
                </div>
              </div>

              {/* Players badge */}
              <div
                className="absolute p-3 rounded-lg shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300"
                style={{
                  right: "-24px",
                  top: "33%",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="flex items-center gap-2 text-white text-sm">
                  <Users size={16} className="text-green-400" />
                  <span>1M+ Players</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
