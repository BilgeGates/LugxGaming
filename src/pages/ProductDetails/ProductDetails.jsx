import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useParams, Link } from "react-router-dom";
import "./productdetails.css";

const API_KEY = "28dbf80fd39248b19263558419c182e3";

const ProductDetails = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);

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
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading game details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops! Something went wrong</h2>
        <p>Error: {error}</p>
        <Link to="/products" className="back-btn">
          ← Back to Products
        </Link>
      </div>
    );
  }

  if (!game) return null;

  const getRatingColor = (rating) => {
    const score = rating * 20;
    if (score < 60) return "#ff4444";
    if (score < 80) return "#ffaa00";
    return "#44ff44";
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

  const formatPlaytime = (hours) => {
    if (!hours) return "N/A";
    return `${hours} hours`;
  };

  const getRatingText = (rating) => {
    const score = rating * 20;
    if (score < 60) return "Mixed";
    if (score < 80) return "Good";
    if (score < 90) return "Great";
    return "Exceptional";
  };

  // Lazım olan məlumatları çıxarın
  const genres = game.genres || [];
  const platforms = game.platforms || [];
  const publishers = game.publishers || [];
  const developers = game.developers || [];
  const tags = game.tags?.slice(0, 8) || [];
  const screenshots = game.screenshots || [];

  const releaseDate = game.released;
  const rating = game.rating;
  const ratingCount = game.rating_count;
  const image = game.background_image;
  const name = game.name;
  const playtime = game.playtime;
  const metacritic = game.metacritic;
  const website = game.website;
  const esrbRating = game.esrb_rating?.name;

  const ratingScore = formatRatingScore(rating);
  const ratingColor = getRatingColor(rating);
  const ratingText = getRatingText(rating);

  return (
    <>
      <Navbar />

      {/* Hero Banner */}
      <div className="game-hero" style={{ backgroundImage: `url(${image})` }}>
        <div className="hero-overlay">
          <div className="container">
            <div className="breadcrumb">
              <Link to="/products">Products</Link> &gt; {name}
            </div>
            <h1 className="hero-title">{name}</h1>
            <div className="hero-meta">
              <span className="hero-rating" style={{ color: ratingColor }}>
                {ratingScore}/100 {ratingText}
              </span>
              {releaseDate && (
                <span className="hero-date">{formatDate(releaseDate)}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="game-details">
        <div className="container">
          <div className="details-grid">
            {/* Main Info Card */}
            <div className="main-info-card">
              <div className="game-image">
                <img src={image} alt={name} />
                <div className="image-overlay">
                  <div
                    className="rating-badge"
                    style={{ backgroundColor: ratingColor }}
                  >
                    {ratingScore}
                  </div>
                </div>
              </div>

              <div className="game-info">
                <h2>{name}</h2>

                {/* Rating Section */}
                <div className="rating-section">
                  <div className="rating-main">
                    <span
                      className="rating-score"
                      style={{ color: ratingColor }}
                    >
                      {ratingScore}/100
                    </span>
                    <span className="rating-text">{ratingText}</span>
                  </div>
                  <div className="rating-details">
                    <span>{ratingCount?.toLocaleString()} ratings</span>
                    {metacritic && (
                      <span className="metacritic">
                        Metacritic: {metacritic}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Info */}
                <div className="quick-info">
                  <div className="info-item">
                    <span className="label">Release Date:</span>
                    <span className="value">{formatDate(releaseDate)}</span>
                  </div>

                  <div className="info-item">
                    <span className="label">Playtime:</span>
                    <span className="value">{formatPlaytime(playtime)}</span>
                  </div>

                  {esrbRating && (
                    <div className="info-item">
                      <span className="label">ESRB Rating:</span>
                      <span className="value">{esrbRating}</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {genres.length > 0 && (
                  <div className="genres-section">
                    <h3>Genres</h3>
                    <div className="genre-tags">
                      {genres.map((genre) => (
                        <span key={genre.id} className="genre-tag">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Platforms */}
                {platforms.length > 0 && (
                  <div className="platforms-section">
                    <h3>Available on</h3>
                    <div className="platform-list">
                      {platforms.slice(0, 6).map((platform) => (
                        <span
                          key={platform.platform.id}
                          className="platform-tag"
                        >
                          {platform.platform.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="tags-section">
                    <h3>Tags</h3>
                    <div className="tags-list">
                      {tags.map((tag) => (
                        <span key={tag.id} className="tag-item">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Side Info */}
            <div className="side-info">
              {/* Publishers & Developers */}
              <div className="info-box">
                <h3>Game Details</h3>

                {developers.length > 0 && (
                  <div className="info-row">
                    <span className="info-label">Developer:</span>
                    <span className="info-value">
                      {developers.map((dev) => dev.name).join(", ")}
                    </span>
                  </div>
                )}

                {publishers.length > 0 && (
                  <div className="info-row">
                    <span className="info-label">Publisher:</span>
                    <span className="info-value">
                      {publishers.map((pub) => pub.name).join(", ")}
                    </span>
                  </div>
                )}

                {website && (
                  <div className="info-row">
                    <span className="info-label">Website:</span>
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="info-link"
                    >
                      Official Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          {game.description_raw && (
            <div className="description-section">
              <div className="description-card">
                <h3>About This Game</h3>
                <div
                  className={`description-content ${
                    !showFullDescription ? "collapsed" : ""
                  }`}
                >
                  <p>{game.description_raw}</p>
                </div>
                {game.description_raw.length > 300 && (
                  <button
                    className="show-more-btn"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ProductDetails;
