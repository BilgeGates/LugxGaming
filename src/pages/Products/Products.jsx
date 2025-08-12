import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../layout/Navbar/Navbar";
import Footer from "../../layout/Footer/Footer";

const API_KEY = "28dbf80fd39248b19263558419c182e3";
const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=40`;
const GAMES_PER_PAGE = 8;

const Products = () => {
  const [allGames, setAllGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [displayedGames, setDisplayedGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

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
    const startIndex = (currentPage - 1) * GAMES_PER_PAGE;
    const endIndex = startIndex + GAMES_PER_PAGE;
    setDisplayedGames(filteredGames.slice(startIndex, endIndex));
  }, [filteredGames, currentPage]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);

    if (filter === "all") {
      setFilteredGames(allGames);
    } else {
      const genreName = filter.replace(".", "").replace(/-/g, " ");
      const filtered = allGames.filter((game) =>
        game.genres.some(
          (g) => sanitizeGenreName(g.name.toLowerCase()) === genreName
        )
      );
      setFilteredGames(filtered);
    }
  };

  const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getRatingColor = (rating) => {
    const score = rating * 20;
    if (score < 60) return "text-red-500";
    if (score < 80) return "text-yellow-400";
    return "text-green-500";
  };

  const formatRatingScore = (rating) => Math.round(rating * 20);

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const sanitizeGenreName = (genre) => {
    return genre
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");
  };

  const formatReleaseDate = (dateString) => {
    if (!dateString || dateString === "Unknown") return "Unknown";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Unknown";

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}.${month}.${year}`;
    } catch (error) {
      return "Unknown";
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <>
      <Navbar />

      <div className="py-12 mb-8">
        <div className="container mx-auto max-w-7xl px-6 text-white">
          <h2 className="text-4xl font-extrabold mb-2">Products</h2>
          <nav className="text-cyan-300 text-sm">
            <Link to="/" className="hover:underline">
              Home
            </Link>{" "}
            &gt; <span className="font-semibold">Products</span>
          </nav>
        </div>
      </div>

      <section className="container mx-auto max-w-7xl px-6 pb-12">
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            className={`px-4 py-2 rounded-full font-semibold transition ${
              activeFilter === "all"
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/50"
                : "bg-gray-200 text-gray-700 hover:bg-cyan-300 hover:text-white"
            }`}
            onClick={() => handleFilterClick("all")}
          >
            All
          </button>

          {genres.map((genre, idx) => {
            const genreFilter = sanitizeGenreName(genre);
            return (
              <button
                key={idx}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  activeFilter === genreFilter
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/50"
                    : "bg-gray-200 text-gray-700 hover:bg-cyan-300 hover:text-white"
                }`}
                onClick={() => handleFilterClick(genreFilter)}
              >
                {capitalize(genre)}
              </button>
            );
          })}
        </div>

        {loading && (
          <p className="text-center text-lg text-gray-500 animate-pulse">
            Loading games...
          </p>
        )}
        {error && (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedGames.map((game) => {
            const primaryGenre = game.genres?.[0]?.name || "Unknown";
            const releaseDate = formatReleaseDate(game.released);
            const ratingScore = formatRatingScore(game.rating);

            return (
              <div
                key={game.id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer relative group"
              >
                <Link to={`/products/${game.id}`} className="block">
                  <img
                    src={game.background_image || "/placeholder-game.jpg"}
                    alt={game.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/placeholder-game.jpg";
                    }}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <span
                  className={`absolute top-3 right-3 px-3 py-1 text-sm font-bold rounded-full border shadow-md ${
                    ratingScore < 60
                      ? "bg-red-600 text-white border-red-700"
                      : ratingScore < 80
                      ? "bg-yellow-400 text-gray-900 border-yellow-500"
                      : "bg-green-600 text-white border-green-700"
                  }`}
                  title={`Rating: ${ratingScore}%`}
                >
                  {ratingScore}
                </span>

                <div className="p-4">
                  <p className="text-sm text-cyan-400 mb-1">
                    Category: <span className="text-white">{primaryGenre}</span>
                  </p>
                  <h4 className="text-xl font-semibold mb-2">{game.name}</h4>
                  <p className="text-gray-300 mb-4">
                    Release Date: {releaseDate}
                  </p>
                  <Link to={`/products/${game.id}`}>
                    <button className="w-full bg-cyan-500 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition">
                      Explore
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                currentPage === 1
                  ? "bg-gray-400 cursor-not-allowed text-gray-700"
                  : "bg-cyan-500 hover:bg-purple-700 text-white"
              }`}
            >
              Previous
            </button>

            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  currentPage === page
                    ? "bg-purple-700 text-white shadow-lg"
                    : "bg-gray-200 text-gray-800 hover:bg-cyan-300 hover:text-white"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                currentPage === totalPages
                  ? "bg-gray-400 cursor-not-allowed text-gray-700"
                  : "bg-cyan-500 hover:bg-purple-700 text-white"
              }`}
            >
              Next
            </button>

            <div className="w-full text-center text-gray-400 mt-4 select-none">
              Showing{" "}
              <span className="font-semibold">
                {(currentPage - 1) * GAMES_PER_PAGE + 1}
              </span>
              -
              <span className="font-semibold">
                {Math.min(currentPage * GAMES_PER_PAGE, filteredGames.length)}
              </span>{" "}
              of <span className="font-semibold">{filteredGames.length}</span>{" "}
              games
            </div>
          </div>
        )}
      </section>

      <Footer />
    </>
  );
};

export default Products;
