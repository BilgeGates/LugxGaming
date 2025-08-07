import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBagShopping } from "react-icons/fa6";
import "./trendinggames.css";

const API_KEY = "28dbf80fd39248b19263558419c182e3";
const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=36`;

const TrendingGames = () => {
  const [games, setGames] = useState([]);
  const [visibleGames, setVisibleGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setGames(data.results);
        setVisibleGames(data.results.slice(0, 4));
      } catch (err) {
        console.error("Error loading games:", err);
      }
    };

    fetchGames();
  }, []);

  const getRatingColor = (rating) => {
    const score = rating * 20;

    if (score < 60) {
      return "#ff4444";
    } else if (score >= 60 && score < 80) {
      return "#ffaa00";
    } else {
      return "#44ff44";
    }
  };

  const formatRatingScore = (rating) => {
    return Math.round(rating * 20);
  };

  const renderGameCard = (game) => {
    const price = "Free";
    const genre = game.genres?.[0]?.name;
    const releaseDate = game.released;
    const rating = game.rating;
    const image = game.background_image;
    const name = game.name;
    const ratingScore = formatRatingScore(rating);
    const ratingColor = getRatingColor(rating);

    return (
      <article className="trending__item" key={game.id}>
        <div className="trending__item-image">
          <Link to={`/products/${game.id}`}>
            <img src={image} alt={name} />
          </Link>
        </div>
        <div className="trending__item-content">
          <div
            className="item__text"
            style={{
              position: "relative",
            }}
          >
            <p>
              <span className="category">Category:</span> {genre}
            </p>
            <h4>
              <span className="title">Game Name:</span> {name}
            </h4>

            <div className="game__date">
              <span className="date">Release Date:</span> {releaseDate}
            </div>
            <span
              className="game__rating-score"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                color: ratingColor,
                fontWeight: "bold",
                border: `1px solid ${ratingColor}`,
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "14px",
                display: "inline-block",
                minWidth: "35px",
                textAlign: "center",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              {ratingScore}
            </span>
          </div>
          <button className="btn">
            <FaBagShopping />
          </button>
          <span className="game__price">{price}</span>
        </div>
      </article>
    );
  };

  return (
    <section className="trending">
      <div className="container trending__container">
        <h6>Trending</h6>
        <div className="trending__title">
          <h2>Trending Games</h2>
          <Link to="/shop">
            <button className="btn">View All</button>
          </Link>
        </div>
        <div className="trending__items">
          {visibleGames.map((game) => renderGameCard(game))}
        </div>
      </div>
    </section>
  );
};

export default TrendingGames;
