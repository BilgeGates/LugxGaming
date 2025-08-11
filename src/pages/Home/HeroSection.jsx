import React, { useState, useEffect } from "react";
import SearchBar from "../../components/common/SearchBar";
import { Gamepad2, Star, Users } from "lucide-react";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
          <div className="lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-400">
                <Gamepad2 size={24} />
                <span className="text-sm font-semibold tracking-wider uppercase">
                  Welcome to Lugx
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
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
              <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
                Discover amazing games from our curated collection. Search,
                filter, and find your next favorite game with advanced search
                capabilities.
              </p>

              {loading && (
                <div className="flex items-center gap-2 text-cyan-400">
                  <div className="w-4 h-4 border-2 border-cyan-200 border-t-cyan-400 rounded-full animate-spin"></div>
                  <span>Loading games...</span>
                </div>
              )}

              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                sortBy={sortBy}
                setSortBy={setSortBy}
                genres={genres}
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
              />

              {!loading && (
                <div className="flex items-center gap-6 text-sm text-gray-300 flex-wrap">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 ${
                        stat.clickable
                          ? "cursor-pointer hover:scale-105 transition-transform"
                          : ""
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

          <div className="lg:w-1/2 flex justify-center lg:justify-end mt-12 lg:mt-0">
            <div className="relative">
              <img
                src={heroImages[currentImageIndex]}
                alt="Gaming Hero"
                className="relative w-full max-w-lg h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-500"
              />

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

              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-cyan-500 to-purple-600 p-4 rounded-xl shadow-lg animate-bounce">
                <Gamepad2 size={30} className="text-white" />
              </div>

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
