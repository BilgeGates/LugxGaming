import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../../layout/Navbar/Navbar";
import Footer from "../../layout/Footer/Footer";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  ChevronDown,
  Star,
  Calendar,
  Users,
  TrendingUp,
  Gamepad2,
  Eye,
  Heart,
  ShoppingCart,
  ArrowUpDown,
} from "lucide-react";
import {
  getGenreIcon,
  getGenreGradient,
  getPlatformIcon,
  formatReleaseDate,
} from "../../utils/gameUtils";

const API_KEY = "28dbf80fd39248b19263558419c182e3";
const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=40`;
const GAMES_PER_PAGE = 12;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allGames, setAllGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [displayedGames, setDisplayedGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const genreFromUrl = searchParams.get("genre");
    if (genreFromUrl) {
      setActiveFilter(genreFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();

        const validGames = data.results.filter(
          (game) => game.genres && game.genres.length > 0
        );

        setAllGames(validGames);
        setFilteredGames(validGames);

        const uniqueGenres = [
          ...new Set(
            validGames.flatMap((game) =>
              game.genres.map((g) => g.name.toLowerCase())
            )
          ),
        ].sort();

        setGenres(uniqueGenres);
      } catch (err) {
        setError("Error loading games: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  useEffect(() => {
    let filtered = allGames;

    if (activeFilter !== "all") {
      const genreName = activeFilter.replace(".", "").replace(/-/g, " ");
      filtered = filtered.filter((game) =>
        game.genres.some(
          (g) => sanitizeGenreName(g.name.toLowerCase()) === genreName
        )
      );
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((game) =>
        game.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = sortGames(filtered, sortBy);

    setFilteredGames(filtered);
    setCurrentPage(1);
  }, [allGames, activeFilter, searchQuery, sortBy]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * GAMES_PER_PAGE;
    const endIndex = startIndex + GAMES_PER_PAGE;
    setDisplayedGames(filteredGames.slice(startIndex, endIndex));
  }, [filteredGames, currentPage]);

  const sortGames = (games, sortBy) => {
    const sortedGames = [...games];
    switch (sortBy) {
      case "name":
        return sortedGames.sort((a, b) => a.name.localeCompare(b.name));
      case "rating":
        return sortedGames.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "release_date":
        return sortedGames.sort(
          (a, b) => new Date(b.released || 0) - new Date(a.released || 0)
        );
      case "popularity":
      default:
        return sortedGames.sort(
          (a, b) => (b.ratings_count || 0) - (a.ratings_count || 0)
        );
    }
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);

    if (filter === "all") {
      searchParams.delete("genre");
    } else {
      searchParams.set("genre", filter);
    }
    setSearchParams(searchParams);
  };

  const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE);

  const sanitizeGenreName = (genre) => {
    return genre
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const formatRatingScore = (rating) => Math.round(rating * 20);

  const getRatingColor = (rating) => {
    const score = rating * 20;
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const GameCard = ({ game, index }) => {
    const primaryGenre = game.genres?.[0]?.name || "Unknown";
    const releaseDate = formatReleaseDate(game.released);
    const ratingScore = formatRatingScore(game.rating);
    const GenreIcon = getGenreIcon(primaryGenre);

    if (viewMode === "list") {
      return (
        <div
          className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-500 group animate-fade-in-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex gap-6">
            <div className="relative w-48 h-28 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={game.background_image || "/placeholder-game.jpg"}
                alt={game.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${getRatingColor(
                    game.rating
                  )} bg-black/70 backdrop-blur-sm`}
                >
                  {ratingScore}%
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <GenreIcon className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-400 font-medium">
                    {primaryGenre}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1">
                  {game.name}
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
                  {game.platforms?.slice(0, 3).map((p, idx) => {
                    const PlatformIcon = getPlatformIcon([p]);
                    return (
                      <PlatformIcon
                        key={idx}
                        className="w-5 h-5 text-gray-400"
                      />
                    );
                  })}
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

    return (
      <div
        className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10 animate-fade-in-up"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={game.background_image || "/placeholder-game.jpg"}
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 right-3">
            <div
              className={`px-3 py-1.5 rounded-full text-sm font-bold backdrop-blur-md border ${
                ratingScore >= 80
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : ratingScore >= 60
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  : "bg-red-500/20 text-red-400 border-red-500/30"
              }`}
            >
              {ratingScore}%
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button className="p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-cyan-500/50 transition-colors duration-300">
              <Heart className="w-5 h-5" />
            </button>
            <Link to={`/products/${game.id}`}>
              <button className="p-3 bg-cyan-500/80 backdrop-blur-sm rounded-full text-white hover:bg-cyan-500 transition-colors duration-300">
                <Eye className="w-5 h-5" />
              </button>
            </Link>
            <button className="p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-purple-500/50 transition-colors duration-300">
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute top-3 left-3">
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getGenreGradient(
                primaryGenre
              )} text-white backdrop-blur-sm flex items-center gap-1`}
            >
              <GenreIcon className="w-3 h-3" />
              {primaryGenre}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
              {game.name}
            </h3>

            <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {releaseDate}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {game.ratings_count || 0}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {game.platforms?.slice(0, 4).map((p, idx) => {
              const PlatformIcon = getPlatformIcon([p]);
              return (
                <PlatformIcon
                  key={idx}
                  className="w-5 h-5 text-gray-400 hover:text-white transition-colors"
                />
              );
            })}
          </div>

          <Link to={`/products/${game.id}`} className="block">
            <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-cyan-500/25">
              <Gamepad2 className="w-5 h-5" />
              Explore Game
            </button>
          </Link>
        </div>

        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    );
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-cyan-900/20" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative container mx-auto max-w-7xl px-6 text-white text-center">
          <div className="animate-fade-in-down">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Game Products
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
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
      </div>

      <section className="container mx-auto max-w-7xl px-6 pb-20">
        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white hover:border-cyan-500/50 transition-all duration-300"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-cyan-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-cyan-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-2 text-white focus:border-cyan-500 transition-all duration-300 cursor-pointer"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="release_date">Latest Release</option>
                  <option value="name">A-Z</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Genre Filters */}
          {showFilters && (
            <div className="animate-fade-in bg-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-cyan-400" />
                Filter by Genre
              </h3>

              <div className="flex flex-wrap gap-3">
                <button
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeFilter === "all"
                      ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25"
                      : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600/50 hover:border-cyan-500/50"
                  }`}
                  onClick={() => handleFilterClick("all")}
                >
                  All Games
                </button>

                {genres.map((genre, idx) => {
                  const genreFilter = sanitizeGenreName(genre);
                  const GenreIcon = getGenreIcon(capitalize(genre));

                  return (
                    <button
                      key={idx}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                        activeFilter === genreFilter
                          ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25"
                          : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600/50 hover:border-cyan-500/50"
                      }`}
                      onClick={() => handleFilterClick(genreFilter)}
                    >
                      <GenreIcon className="w-4 h-4" />
                      {capitalize(genre)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
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
                  {capitalize(activeFilter.replace(/-/g, " "))}
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

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 max-w-md mx-auto">
              <p className="text-red-400 font-semibold">{error}</p>
            </div>
          </div>
        )}

        {/* Games Grid/List */}
        {!loading && !error && (
          <>
            <div
              className={`${
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  : "space-y-6"
              }`}
            >
              {displayedGames.map((game, index) => (
                <GameCard key={game.id} game={game} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    currentPage === 1
                      ? "bg-gray-800/50 text-gray-500 cursor-not-allowed"
                      : "bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 text-white hover:border-cyan-500/50"
                  }`}
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + Math.max(1, currentPage - 2);
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        currentPage === page
                          ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg"
                          : "bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 text-gray-300 hover:border-cyan-500/50 hover:text-white"
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
                      : "bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 text-white hover:border-cyan-500/50"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Products;
