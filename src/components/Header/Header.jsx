import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Gamepad2,
  Star,
  Calendar,
  Users,
  TrendingUp,
} from "lucide-react";

const API_KEY = "28dbf80fd39248b19263558419c182e3";
const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=40`;

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [allGames, setAllGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
  }, []);

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

  const handleSearch = async (term) => {
    if (term.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);

    try {
      const searchURL = `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(
        term
      )}&page_size=10`;
      const response = await fetch(searchURL);
      const data = await response.json();

      setSearchResults(data.results || []);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
      const localResults = allGames.filter(
        (game) =>
          game.name.toLowerCase().includes(term.toLowerCase()) ||
          (game.genres &&
            game.genres.some((genre) =>
              genre.name.toLowerCase().includes(term.toLowerCase())
            ))
      );
      setSearchResults(localResults);
      setShowResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      handleSearch(value);
    }, 500);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowResults(false);
  };

  // Burada oyun seçiləndə productdetails səhifəsinə yönləndiririk
  const handleGameSelect = (game) => {
    navigate(`/products/${game.id}`);
    clearSearch();
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-green-500";
    if (rating >= 4) return "text-yellow-500";
    if (rating >= 3) return "text-orange-500";
    return "text-red-500";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).getFullYear();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden pt-20">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-pink-500 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-cyan-500 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-32 w-24 h-24 bg-yellow-500 rounded-full animate-ping"></div>
        <div className="absolute bottom-10 right-10 w-12 h-12 bg-green-500 rounded-full animate-spin"></div>
      </div>

      <header className="relative z-10">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between min-h-[80vh]">
            {/* Left side - Text and search */}
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
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                    Gaming
                  </span>{" "}
                  Site Ever!
                </h1>

                <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
                  LUGX Gaming will help you find the best games. Search among
                  thousands of games and discover your favorite one.
                </p>

                {loading && (
                  <div className="flex items-center gap-2 text-cyan-400">
                    <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                    <span>Loading games...</span>
                  </div>
                )}
              </div>

              {/* Search section */}
              <div className="relative">
                <div className="relative flex items-center">
                  <div className="relative flex-1">
                    <Search
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleInputChange}
                      placeholder="Search by game name or genre... (e.g. GTA, RPG, Action)"
                      className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
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
                    onClick={() => handleSearch(searchTerm)}
                    disabled={isSearching}
                    className="ml-4 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50"
                  >
                    {isSearching ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Searching...
                      </div>
                    ) : (
                      "Search"
                    )}
                  </button>
                </div>

                {/* Search results */}
                {showResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl max-h-96 overflow-y-auto z-50">
                    {searchResults.length > 0 ? (
                      <div className="p-4">
                        <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                          <Search size={16} />
                          Found games ({searchResults.length})
                        </h3>
                        <div className="space-y-3">
                          {searchResults.map((game) => (
                            <div
                              key={game.id}
                              onClick={() => handleGameSelect(game)}
                              className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors group"
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
                                <div className="flex items-center gap-4 text-sm text-gray-600">
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
                              <div className="text-right">
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
                        <Search
                          size={48}
                          className="mx-auto mb-4 text-gray-400"
                        />
                        <h3 className="text-lg font-semibold mb-2">
                          No results found
                        </h3>
                        <p>
                          No games matched your search for "{searchTerm}". Try
                          searching for something else.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Popular searches */}
              <div className="flex flex-wrap gap-2">
                <span className="text-gray-400 text-sm">Popular searches:</span>
                {[
                  "Action",
                  "RPG",
                  "Adventure",
                  "Shooter",
                  "Strategy",
                  "Sports",
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchTerm(tag);
                      handleSearch(tag);
                    }}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-cyan-400 text-sm rounded-full transition-colors cursor-pointer hover:scale-105 transform duration-200"
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              {/* Statistics */}
              {!loading && allGames.length > 0 && (
                <div className="flex items-center gap-6 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-cyan-400" />
                    <span>{allGames.length} games loaded</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-yellow-400" />
                    <span>RAWG Database</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right side - Image */}
            <div className="lg:w-1/2 flex justify-center lg:justify-end mt-12 lg:mt-0">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <img
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop&crop=center"
                  alt="Gaming Hero"
                  className="relative w-full max-w-lg h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-cyan-500 to-purple-600 p-4 rounded-xl shadow-lg animate-bounce">
                  <Gamepad2 size={32} className="text-white" />
                </div>

                {/* Floating game cards */}
                <div className="absolute -left-8 top-8 bg-white/10 backdrop-blur-md p-3 rounded-lg shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Star size={16} className="text-yellow-400" />
                    <span>4.8 Rating</span>
                  </div>
                </div>

                <div className="absolute -right-6 top-1/3 bg-white/10 backdrop-blur-md p-3 rounded-lg shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
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
