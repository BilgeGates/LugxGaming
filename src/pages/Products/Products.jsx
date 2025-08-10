import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./products.css";

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
    if (score < 60) return "#ff4444";
    if (score < 80) return "#ffaa00";
    return "#44ff44";
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

      <div className="banner__image" id="BannerImage">
        <header>
          <div className="container info__container">
            <h2>Products</h2>
            <div className="breadcrumb">
              <Link to="/">Home</Link> &gt; Products
            </div>
          </div>
        </header>
      </div>

      <section className="products">
        <div className="container products__container">
          <div className="controls-wrapper">
            <div className="controls-container">
              <button
                className={`btn genre__btn ${
                  activeFilter === "all" ? "active" : ""
                }`}
                onClick={() => handleFilterClick("all")}
              >
                All
              </button>

              {genres.map((genre, index) => {
                const genreFilter = sanitizeGenreName(genre);
                return (
                  <button
                    key={index}
                    className={`btn genre__btn ${
                      activeFilter === genreFilter ? "active" : ""
                    }`}
                    onClick={() => handleFilterClick(genreFilter)}
                  >
                    {capitalize(genre)}
                  </button>
                );
              })}
            </div>
          </div>

          {loading && <p>Loading games...</p>}
          {error && <p className="error">{error}</p>}

          <div className="cards" id="productsItems">
            {displayedGames.map((game) => {
              const primaryGenre = game.genres?.[0]?.name || "Unknown";
              const releaseDate = formatReleaseDate(game.released);
              const ratingScore = formatRatingScore(game.rating);
              const ratingColor = getRatingColor(game.rating);

              return (
                <div
                  key={game.id}
                  className="card"
                  style={{ position: "relative" }}
                >
                  <div className="card__image">
                    <Link to={`/products/${game.id}`}>
                      <img
                        src={game.background_image || "/placeholder-game.jpg"}
                        alt={game.name}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "/placeholder-game.jpg";
                        }}
                      />
                    </Link>
                  </div>

                  <div className="card__content">
                    <p>
                      <span className="category">Category:</span> {primaryGenre}
                    </p>
                    <h4>
                      <span className="title">Name:</span> {game.name}
                    </h4>
                    <div>
                      <span className="date">Release Date:</span> {releaseDate}
                    </div>

                    <span
                      className="rating-score"
                      style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        color: ratingColor,
                        fontWeight: "bold",
                        border: `1px solid ${ratingColor}`,
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "14px",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        minWidth: "35px",
                        textAlign: "center",
                      }}
                    >
                      {ratingScore}
                    </span>

                    <Link to={`/products/${game.id}`}>
                      <button className="btn card__btn">Explore</button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination__btn"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  className={`pagination__btn ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="pagination__btn"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>

              <div className="pagination__info">
                Showing {(currentPage - 1) * GAMES_PER_PAGE + 1}-
                {Math.min(currentPage * GAMES_PER_PAGE, filteredGames.length)}{" "}
                of {filteredGames.length} games
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Products;
