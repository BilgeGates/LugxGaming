import { useState, useEffect } from "react";

const API_KEY = "28dbf80fd39248b19263558419c182e3";
const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=40`;

const useGameData = () => {
  const [allGames, setAllGames] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setAllGames(data.results || []);
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchGames = async (term, genre = "", sort = "relevance") => {
    if (term.trim() === "" && genre === "") {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      let searchURL = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=15`;

      if (term.trim()) {
        searchURL += `&search=${encodeURIComponent(term)}`;
      }

      if (genre) {
        searchURL += `&genres=${genre}`;
      }

      if (sort === "rating") {
        searchURL += `&ordering=-rating`;
      } else if (sort === "released") {
        searchURL += `&ordering=-released`;
      } else if (sort === "metacritic") {
        searchURL += `&ordering=-metacritic`;
      }

      const response = await fetch(searchURL);
      const data = await response.json();

      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      const localResults = allGames.filter(
        (game) =>
          game.name.toLowerCase().includes(term.toLowerCase()) ||
          (game.genres &&
            game.genres.some((genre) =>
              genre.name.toLowerCase().includes(term.toLowerCase())
            ))
      );
      setSearchResults(localResults);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return {
    allGames,
    searchResults,
    loading,
    isSearching,
    fetchGames,
    searchGames,
    setSearchResults,
  };
};

export default useGameData;
