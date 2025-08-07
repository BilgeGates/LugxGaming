import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./categories.css";

const API_KEY = "28dbf80fd39248b19263558419c182e3";
const API_URL = `https://api.rawg.io/api/genres?key=${API_KEY}`;

const Categories = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();
        setGenres(data.results.slice(0, 5));
      } catch (err) {
        setError("Error loading genres:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return (
    <section className="categories">
      <div className="container categories__container">
        <h6>Categories</h6>
        <h2>Top Categories</h2>

        {loading}
        {error}

        <div className="categories__cards">
          {genres.map((genre, index) => (
            <article className="categories__card" key={index}>
              <h4>{genre.name}</h4>
              <div className="categories__card-image">
                <Link to={`/products/${genre.id}`}>
                  <img src={genre.image_background} alt={genre.name} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
