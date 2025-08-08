import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../common.style.css";

const API_KEY = "28dbf80fd39248b19263558419c182e3";
const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=36`;

const TrendingGames = () => {
  const [games, setGames] = useState([]);
  const [visibleGames, setVisibleGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();
        setGames(data.results);
        setVisibleGames(data.results.slice(0, 4));
      } catch (err) {
        setError("Error loading genres:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const getRatingColor = (rating) => {
    const score = rating * 20;
    if (score < 60) return "#ff4444";
    if (score < 80) return "#ffaa00";
    return "#44ff44";
  };

  const formatRatingScore = (rating) => Math.round(rating * 20);

  const renderGameCard = (game) => {
    const genre = game.genres?.[0]?.name;
    const releaseDate = game.released;
    const rating = game.rating;
    const image = game.background_image;
    const name = game.name;
    const ratingScore = formatRatingScore(rating);
    const ratingColor = getRatingColor(rating);

    return (
      <div className="card" key={game.id}>
        <div className="card__image">
          <Link to={`/products/${game.id}`}>
            <img src={image} alt={name} />
          </Link>
        </div>
        <div className="card__content">
          <p>
            <span className="category">Category:</span> {genre}
          </p>
          <h4>
            <span className="title">Name:</span> {name}
          </h4>
          <p>
            <span className="date">Release Date:</span> {releaseDate}
          </p>
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
  };

  return (
    <section className="trending">
      <div className="container card__container">
        <h6>Trending</h6>
        <div className="card__header">
          <h2>Trending Games</h2>
          <Link to="/products">
            <button className="btn">View All</button>
          </Link>
        </div>

        {loading}
        {error}

        <div className="cards">{visibleGames.map(renderGameCard)}</div>
      </div>
    </section>
  );
};

export default TrendingGames;
