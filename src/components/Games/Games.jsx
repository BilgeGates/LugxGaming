import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./games.css";

const API_KEY = "28dbf80fd39248b19263558419c182e3";
const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=40&ordering=-rating`;

const Games = () => {
  const [topGames, setTopGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopRatedGames = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const data = await res.json();
        const filtered = data.results.filter((game) => game.rating >= 4.8);
        setTopGames(filtered.slice(0, 4));
      } catch (err) {
        setError("Error loading genres:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedGames();
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
      <div className="game__item" key={game.id}>
        <div className="game__item-image">
          <Link to={`/products/${game.id}`}>
            <img src={image} alt={name} />
          </Link>
        </div>
        <div className="game__item-content">
          <p>
            <span className="category">Category:</span> {genre}
          </p>
          <h4>
            <span className="title">Name:</span> {name}
          </h4>
          <p className="game__date">
            <span className="date">Release Date:</span> {releaseDate}
          </p>
          <span
            className="game__rating-score"
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
            <button className="btn">Explore</button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <section className="games">
      <div className="container games__container">
        <h6>Top Games</h6>
        <div className="games__title">
          <h2>Most Played</h2>
          <Link to="/shop">
            <button className="btn">View All</button>
          </Link>
        </div>

        {loading}
        {error}

        <div className="game__items">{topGames.map(renderGameCard)}</div>
      </div>
    </section>
  );
};

export default Games;
