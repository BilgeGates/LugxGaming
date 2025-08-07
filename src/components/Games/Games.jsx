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
        if (!res.ok) {
          throw new Error(`HTTP Error: ${res.status}`);
        }

        const data = await res.json();

        const filtered = data.results.filter(
          (game) => game.rating >= 4.5 && game.ratings_count > 80
        );

        setTopGames(filtered.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch top-rated games:", err);
        setError("Failed to load games. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedGames();
  }, []);

  if (loading) return <p>Loading top games...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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

        <div className="games__item">
          {topGames.map((game) => (
            <article className="game__item" key={game.id}>
              <div className="game__item-image">
                <Link to={`/products/${game.id}`}>
                  <img
                    src={game.background_image}
                    alt={game.name}
                    loading="lazy"
                  />
                </Link>
              </div>
              <div className="game__item-content">
                <p>Category: {game.genres?.[0]?.name}</p>
                <h4>Game Name: {game.name}</h4>
                <Link to={`/products/${game.id}`}>
                  <button className="btn">Explore</button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Games;
