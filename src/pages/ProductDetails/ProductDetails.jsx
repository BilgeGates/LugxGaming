import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Star,
  Calendar,
  Clock,
  ExternalLink,
  ArrowLeft,
  User,
  Building,
  Globe,
  Target,
  Monitor,
  Tag,
  BookOpen,
  Info,
  Gamepad2,
  TrendingUp,
  Award,
  ChevronRight,
} from "lucide-react";
import Navbar from "../../layout/Navbar/Navbar";
import Footer from "../../layout/Footer/Footer";

const API_KEY = "28dbf80fd39248b19263558419c182e3";

const ProductDetails = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [similarGames, setSimilarGames] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  useEffect(() => {
    async function fetchGame() {
      try {
        const res = await fetch(
          `https://api.rawg.io/api/games/${id}?key=${API_KEY}`
        );
        if (!res.ok) throw new Error("Game not found");
        const data = await res.json();
        setGame(data);
        console.log(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGame();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 flex flex-col items-center justify-center text-white">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 border-l-pink-500 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>
        <p className="text-xl font-semibold mt-6 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
          Loading game details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 flex flex-col items-center justify-center text-white px-4">
        <div className="text-center max-w-lg">
          <div className="flex justify-center mb-6">
            <Gamepad2 className="w-24 h-24 text-red-400" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent mb-4">
            Game Not Found
          </h2>
          <p className="text-gray-300 text-lg mb-8">Error: {error}</p>
          <a
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white font-bold rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-900 transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Game Library
          </a>
        </div>
      </div>
    );
  }

  if (!game) return null;

  const getRatingColor = (rating) => {
    const score = rating * 20;
    if (score < 60) return "from-red-500 to-red-600";
    if (score < 80) return "from-yellow-500 to-orange-500";
    return "from-green-500 to-emerald-500";
  };

  const formatRatingScore = (rating) => Math.round(rating * 20);

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPlaytime = (hours) => (hours ? `${hours} hours` : "N/A");

  const getRatingText = (rating) => {
    const score = rating * 20;
    if (score < 60) return "Mixed Reviews";
    if (score < 80) return "Positive";
    if (score < 90) return "Very Positive";
    return "Overwhelmingly Positive";
  };

  const genres = game.genres || [];
  const platforms = game.platforms || [];
  const publishers = game.publishers || [];
  const developers = game.developers || [];
  const tags = game.tags?.slice(0, 12) || [];

  const ratingScore = formatRatingScore(game.rating);
  const ratingGradient = getRatingColor(game.rating);
  const ratingText = getRatingText(game.rating);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white">
        <div
          className="relative h-screen bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${game.background_image})`,
          }}
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
            <div className="absolute bottom-20 right-20 w-1 h-1 bg-pink-400 rounded-full animate-pulse"></div>
          </div>
          <div className="relative z-10 h-full flex items-end">
            <div className="w-full max-w-7xl mx-auto px-6 pb-20">
              <nav className="mb-6">
                <a
                  href="/products"
                  className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 hover:underline underline-offset-4"
                >
                  <Gamepad2 className="w-5 h-5" />
                  Game Library
                </a>
                <ChevronRight className="inline w-4 h-4 mx-3 text-gray-500" />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-medium">
                  {game.name}
                </span>
              </nav>
              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-2xl">
                  {game.name}
                </span>
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-lg">
                <div
                  className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${ratingGradient} rounded-full font-bold shadow-lg`}
                >
                  <Star className="w-5 h-5 fill-current" />
                  {ratingScore}/100 • {ratingText}
                </div>
                {game.released && (
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-700/50">
                    <Calendar className="w-5 h-5" />
                    {formatDate(game.released)}
                  </div>
                )}
                {game.playtime > 0 && (
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-700/50">
                    <Clock className="w-5 h-5" />
                    {formatPlaytime(game.playtime)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="relative -mt-40 z-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              <div className="xl:col-span-3 space-y-8">
                <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-zinc-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700/30">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="relative flex-shrink-0">
                      <img
                        src={game.background_image}
                        alt={game.name}
                        className="w-full lg:w-80 h-64 lg:h-96 object-cover rounded-2xl shadow-xl ring-4 ring-gray-700/50"
                      />
                      <div
                        className={`absolute -top-3 -right-3 bg-gradient-to-r ${ratingGradient} text-white px-4 py-2 rounded-xl font-bold shadow-lg transform rotate-12`}
                      >
                        {ratingScore}
                      </div>
                    </div>
                    <div className="flex-1 space-y-6">
                      <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                          {game.name}
                        </h2>
                        <p className="text-gray-400 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {developers.map((dev) => dev.name).join(", ")}
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-slate-900/50 to-zinc-900/50 rounded-2xl p-6 border border-gray-700/30">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div
                              className={`text-2xl font-bold bg-gradient-to-r ${ratingGradient} bg-clip-text text-transparent`}
                            >
                              {ratingScore}
                            </div>
                            <div className="text-sm text-gray-400">
                              User Score
                            </div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-yellow-400">
                              {game.metacritic || "N/A"}
                            </div>
                            <div className="text-sm text-gray-400">
                              Metacritic
                            </div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-400">
                              {(game.rating_count || 0).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-400">Reviews</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-400">
                              {game.playtime || 0}h
                            </div>
                            <div className="text-sm text-gray-400">
                              Playtime
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900/40 rounded-xl p-4 border border-gray-700/30">
                          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                            <Calendar className="w-4 h-4" />
                            Release Date
                          </div>
                          <div className="font-semibold">
                            {formatDate(game.released)}
                          </div>
                        </div>
                        {game.esrb_rating && (
                          <div className="bg-slate-900/40 rounded-xl p-4 border border-gray-700/30">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                              <Award className="w-4 h-4" />
                              ESRB Rating
                            </div>
                            <div className="font-semibold">
                              {game.esrb_rating.name}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {genres.length > 0 && (
                    <div className="mt-8">
                      <h3 className="flex items-center gap-2 text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        <Target className="w-6 h-6 text-blue-400" />
                        Genres
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {genres.map((genre, index) => (
                          <span
                            key={genre.id}
                            className={`px-4 py-2 bg-gradient-to-r ${
                              index % 3 === 0
                                ? "from-blue-600 to-blue-700"
                                : index % 3 === 1
                                ? "from-purple-600 to-purple-700"
                                : "from-cyan-600 to-cyan-700"
                            } text-white text-sm rounded-full font-medium hover:scale-105 transform transition-all duration-300 cursor-default shadow-lg`}
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {platforms.length > 0 && (
                    <div className="mt-6">
                      <h3 className="flex items-center gap-2 text-xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        <Monitor className="w-6 h-6 text-green-400" />
                        Available Platforms
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {platforms.slice(0, 8).map((platform) => (
                          <div
                            key={platform.platform.id}
                            className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 backdrop-blur-sm text-gray-300 text-sm rounded-lg px-3 py-2 text-center border border-gray-600/30 hover:border-blue-500/50 transition-all duration-300"
                          >
                            {platform.platform.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {tags.length > 0 && (
                    <div className="mt-6">
                      <h3 className="flex items-center gap-2 text-xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
                        <Tag className="w-6 h-6 text-pink-400" />
                        Game Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="px-3 py-1 bg-gray-700/40 text-gray-300 text-xs rounded-md border border-gray-600/40 hover:bg-gray-600/40 hover:text-white transition-all duration-300 cursor-default"
                          >
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {game.description_raw && (
                  <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-zinc-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700/30">
                    <h3 className="flex items-center gap-2 text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      <BookOpen className="w-8 h-8 text-blue-400" />
                      About This Game
                    </h3>
                    <div
                      className={`text-gray-300 leading-relaxed text-lg ${
                        !showFullDescription ? "line-clamp-6" : ""
                      }`}
                    >
                      <p>{game.description_raw}</p>
                    </div>
                    {game.description_raw.length > 400 && (
                      <button
                        className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 shadow-lg"
                        onClick={() =>
                          setShowFullDescription(!showFullDescription)
                        }
                      >
                        <BookOpen className="w-4 h-4" />
                        {showFullDescription ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="xl:col-span-1 space-y-6">
                <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-zinc-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-700/30">
                  <h3 className="flex items-center gap-2 text-xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    <Info className="w-6 h-6 text-cyan-400" />
                    Game Information
                  </h3>
                  <div className="space-y-4">
                    {developers.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                          <User className="w-4 h-4" />
                          Developer
                        </div>
                        <div className="font-medium">
                          {developers.map((dev) => dev.name).join(", ")}
                        </div>
                      </div>
                    )}
                    {publishers.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                          <Building className="w-4 h-4" />
                          Publisher
                        </div>
                        <div className="font-medium">
                          {publishers.map((pub) => pub.name).join(", ")}
                        </div>
                      </div>
                    )}
                    {game.website && (
                      <div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                          <Globe className="w-4 h-4" />
                          Official Website
                        </div>
                        <a
                          href={game.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 hover:underline"
                        >
                          Visit Website
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-zinc-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-700/30">
                  <h3 className="flex items-center gap-2 text-xl font-bold mb-6 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                    You Might Also Like
                  </h3>
                  {loadingSimilar ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {similarGames.slice(0, 4).map((similarGame) => (
                        <div
                          key={similarGame.id}
                          className="flex gap-3 p-3 bg-slate-900/40 rounded-xl hover:bg-slate-900/60 transition-all duration-300 border border-gray-700/20 hover:border-blue-500/30 cursor-pointer group"
                        >
                          <img
                            src={similarGame.background_image}
                            alt={similarGame.name}
                            className="w-16 h-12 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-white truncate group-hover:text-blue-300 transition-colors">
                              {similarGame.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="inline-flex items-center gap-1 text-xs text-green-400">
                                <Star className="w-3 h-3 fill-current" />
                                {Math.round(similarGame.rating * 20)}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(similarGame.released).getFullYear()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-20"></div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
