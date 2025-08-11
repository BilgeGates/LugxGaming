import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Gamepad2, Star, Users, TrendingUp, Heart, Search } from "lucide-react";

import SearchBar from "../../components/common/SearchBar";
import FavoritesModal from "../../components/common/FavoritesModal";
import RecentModal from "./RecentModal";
import RatingModal from "../../components/common/RatingModal";

const API_KEY = "28dbf80fd39248b19263558419c182e3";
const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=40`;

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [allGames, setAllGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [favorites, setFavorites] = useState([]);
  const [pinnedFavorites, setPinnedFavorites] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [gameRatings, setGameRatings] = useState({});
  const [recentViews, setRecentViews] = useState([]);
  const [showRecentModal, setShowRecentModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingGameData, setRatingGameData] = useState(null);

  const navigate = useNavigate();

  const heroImages = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop&crop=center",
  ];

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

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("gameFavorites");
      const savedPinnedFavorites = localStorage.getItem("gamePinnedFavorites");
      const savedGameRatings = localStorage.getItem("gameRatings");
      const savedRecentViews = localStorage.getItem("gameRecentViews");

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
      if (savedPinnedFavorites) {
        setPinnedFavorites(JSON.parse(savedPinnedFavorites));
      }
      if (savedGameRatings) {
        setGameRatings(JSON.parse(savedGameRatings));
      }
      if (savedRecentViews) {
        setRecentViews(JSON.parse(savedRecentViews));
      }
    } catch (error) {
      console.error("localStorage oxuma xətası:", error);
    }
  }, []);

  useEffect(() => {
    fetchGames();

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("gameFavorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Favorites localStorage yazma xətası:", error);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "gamePinnedFavorites",
        JSON.stringify(pinnedFavorites)
      );
    } catch (error) {
      console.error("PinnedFavorites localStorage yazma xətası:", error);
    }
  }, [pinnedFavorites]);

  useEffect(() => {
    try {
      localStorage.setItem("gameRatings", JSON.stringify(gameRatings));
    } catch (error) {
      console.error("GameRatings localStorage yazma xətası:", error);
    }
  }, [gameRatings]);

  useEffect(() => {
    try {
      localStorage.setItem("gameRecentViews", JSON.stringify(recentViews));
    } catch (error) {
      console.error("RecentViews localStorage yazma xətası:", error);
    }
  }, [recentViews]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setAllGames(data.results || []);
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term, genre = "", sort = "relevance") => {
    if (term.trim() === "" && genre === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);

    try {
      let searchURL = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=15`;

      if (term.trim()) searchURL += `&search=${encodeURIComponent(term)}`;
      if (genre) searchURL += `&genres=${genre}`;
      if (sort === "rating") searchURL += `&ordering=-rating`;
      else if (sort === "released") searchURL += `&ordering=-released`;
      else if (sort === "metacritic") searchURL += `&ordering=-metacritic`;

      const response = await fetch(searchURL);
      const data = await response.json();
      const results = data.results || [];

      setSearchResults(results);
      setShowResults(true);

      if (results.length > 0 && term.trim()) {
        addSearchResultsToRecent(results.slice(0, 100)); // İlk 5 nəticəni əlavə et
      }
    } catch (error) {
      console.error("Search error:", error);
      const localResults = allGames.filter(
        (game) =>
          game.name.toLowerCase().includes(term.toLowerCase()) ||
          (game.genres &&
            game.genres.some((genreObj) =>
              genreObj.name.toLowerCase().includes(term.toLowerCase())
            ))
      );
      setSearchResults(localResults);
      setShowResults(true);

      if (localResults.length > 0 && term.trim()) {
        addSearchResultsToRecent(localResults.slice(0, 100));
      }
    } finally {
      setIsSearching(false);
    }
  };

  const addSearchResultsToRecent = (games) => {
    games.forEach((game) => {
      const gameData = {
        id: game.id,
        name: game.name,
        background_image: game.background_image,
        rating: game.rating,
        released: game.released,
        genres: game.genres || [],
        metacritic: game.metacritic,
        viewedAt: new Date().toISOString(),
      };
      addToRecentViews(gameData);
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedGenre("");
    setSortBy("relevance");
    setSearchResults([]);
    setShowResults(false);
    setShowFilters(false);
  };

  const handleGameSelect = (game) => {
    const gameData = {
      id: game.id,
      name: game.name,
      background_image: game.background_image,
      rating: game.rating,
      released: game.released,
      genres: game.genres || [],
      metacritic: game.metacritic,
      viewedAt: new Date().toISOString(),
    };
    addToRecentViews(gameData);
    navigate(`/products/${game.id}`);
    clearSearch();
    setShowFavoritesModal(false);
    setShowRecentModal(false);
  };

  const addToRecentViews = (gameData) => {
    setRecentViews((prev) => {
      const filtered = prev.filter((item) => item.id !== gameData.id);
      return [gameData, ...filtered].slice(0, 20);
    });
  };

  const clearRecentViews = () => {
    setRecentViews([]);
    try {
      localStorage.removeItem("gameRecentViews");
    } catch (error) {
      console.error("RecentViews localStorage silmə xətası:", error);
    }
  };

  const toggleFavorite = (game) => {
    const gameId = typeof game === "object" ? game.id : game;
    const gameData =
      typeof game === "object"
        ? game
        : searchResults.find((g) => g.id === gameId) ||
          allGames.find((g) => g.id === gameId);

    setFavorites((prev) => {
      const exists = prev.find((fav) => fav.id === gameId);
      if (exists) {
        setPinnedFavorites((prevPinned) =>
          prevPinned.filter((pin) => pin.id !== gameId)
        );
        return prev.filter((fav) => fav.id !== gameId);
      } else {
        return [...prev, gameData];
      }
    });
  };

  const togglePin = (gameId) => {
    const game = favorites.find((fav) => fav.id === gameId);
    if (!game) return;
    setPinnedFavorites((prev) => {
      const exists = prev.find((pin) => pin.id === gameId);
      return exists ? prev.filter((pin) => pin.id !== gameId) : [...prev, game];
    });
  };

  const removeFavorite = (gameId) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== gameId));
    setPinnedFavorites((prev) => prev.filter((pin) => pin.id !== gameId));
  };

  const openRatingModal = (game, event) => {
    event?.stopPropagation();
    setRatingGameData(game);
    setShowRatingModal(true);
  };

  const getUserRating = (gameId) => gameRatings[gameId]?.rating || 0;

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-green-500";
    if (rating >= 4) return "text-yellow-500";
    if (rating >= 3) return "text-orange-500";
    return "text-red-500";
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).getFullYear() : "N/A";

  const isGameFavorited = (gameId) =>
    favorites.some((fav) => fav.id === gameId);
  const isGamePinned = (gameId) =>
    pinnedFavorites.some((pin) => pin.id === gameId);
  const getSortedFavorites = () => {
    const pinned = pinnedFavorites;
    const unpinned = favorites.filter(
      (fav) => !pinnedFavorites.some((pin) => pin.id === fav.id)
    );
    return [...pinned, ...unpinned];
  };

  const stats = [
    {
      icon: TrendingUp,
      label: `${allGames.length} games`,
      color: "text-cyan-400",
    },
    {
      icon: Heart,
      label: `${favorites.length} favorites`,
      color: "text-red-400",
      onClick: () => setShowFavoritesModal(true),
      clickable: true,
    },
    {
      icon: Search,
      label: `${recentViews.length} recent`,
      color: "text-blue-400",
      onClick: () => setShowRecentModal(true),
      clickable: true,
    },
  ];

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgb(88, 28, 135), rgb(30, 58, 138), rgb(67, 56, 202))",
      }}
    >
      {/* Modallar */}
      <FavoritesModal
        show={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        favorites={favorites}
        pinnedFavorites={pinnedFavorites}
        toggleFavorite={toggleFavorite}
        togglePin={togglePin}
        removeFavorite={removeFavorite}
        handleGameSelect={handleGameSelect}
        getSortedFavorites={getSortedFavorites}
        isGamePinned={isGamePinned}
        getUserRating={getUserRating}
        openRatingModal={openRatingModal}
        getRatingColor={getRatingColor}
        formatDate={formatDate}
      />
      <RecentModal
        show={showRecentModal}
        onClose={() => setShowRecentModal(false)}
        recentViews={recentViews}
        clearRecentViews={clearRecentViews}
        handleGameSelect={handleGameSelect}
        formatTimeAgo={formatTimeAgo}
        getUserRating={getUserRating}
        openRatingModal={openRatingModal}
        toggleFavorite={toggleFavorite}
        isGameFavorited={isGameFavorited}
      />
      <RatingModal
        show={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        game={ratingGameData}
        onSubmitRating={(rating) => {
          if (ratingGameData) {
            setGameRatings((prev) => ({
              ...prev,
              [ratingGameData.id]: {
                rating,
                ratedAt: new Date().toISOString(),
              },
            }));
            setShowRatingModal(false);
            setRatingGameData(null);
          }
        }}
      />

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
              </div>

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
                openRatingModal={openRatingModal}
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
                    />
                  ))}
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
    </div>
  );
};

export default Header;
