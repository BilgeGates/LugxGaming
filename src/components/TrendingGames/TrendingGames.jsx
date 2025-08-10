import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_KEY = "28dbf80fd39248b19263558419c182e3";
const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=40`;

const TrendingGames = () => {
  const [games, setGames] = useState([]);
  const [visibleGames, setVisibleGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();
        setGames(data.results);
        setVisibleGames(data.results.slice(0, 4));
      } catch (err) {
        setError("Error loading games: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const formatRatingScore = (rating) => Math.round(rating * 20);

  return (
    <section className="trending py-16 bg-gradient-to-tr from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto max-w-7xl px-6">
        <h6 className="text-cyan-400 uppercase tracking-widest font-semibold mb-2">
          Trending
        </h6>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-extrabold">Trending Games</h2>
          <button
            onClick={() => navigate("/products")}
            className="btn bg-cyan-500 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            View All
          </button>
        </div>

        {loading && (
          <p className="text-center text-lg text-gray-300">Loading games...</p>
        )}

        {error && (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {visibleGames.map((game) => {
            const genre = game.genres?.[0]?.name || "Unknown";
            const releaseDate = game.released || "TBA";
            const rating = game.rating || 0;
            const image = game.background_image;
            const name = game.name;
            const ratingScore = formatRatingScore(rating);

            return (
              <div
                key={game.id}
                className="relative bg-gray-900 bg-opacity-40 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition"
              >
                <img
                  onClick={() => navigate(`/products/${game.id}`)}
                  src={image}
                  alt={name}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                />

                <span
                  className={`absolute top-3 right-3 px-3 py-1 text-sm font-bold rounded-full border shadow-md
                    ${
                      ratingScore < 60
                        ? "bg-red-600 text-white border-red-700"
                        : ratingScore < 80
                        ? "bg-yellow-400 text-gray-900 border-yellow-500"
                        : "bg-green-600 text-white border-green-700"
                    }
                  `}
                  title={`Rating: ${ratingScore}%`}
                >
                  {ratingScore}
                </span>

                <div className="p-4">
                  <p className="text-sm text-cyan-400 mb-1">
                    Category: <span className="text-white">{genre}</span>
                  </p>
                  <h4 className="text-xl font-semibold mb-2">{name}</h4>
                  <p className="text-gray-300 mb-4">
                    Release Date: {releaseDate}
                  </p>
                  <button
                    onClick={() => navigate(`/products/${game.id}`)}
                    className="btn bg-cyan-500 hover:bg-purple-700 w-full py-2 rounded-lg text-white font-semibold transition"
                  >
                    Explore
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrendingGames;
