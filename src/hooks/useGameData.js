import { useState, useEffect } from "react";

const API_KEY = "28dbf80fd39248b19263558419c182e3";
const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=40`;

export default function useGameData() {
  const [allGames, setAllGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setAllGames(data.results || []);
      } catch (err) {
        console.error("Error fetching games:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const searchGames = async (term, genre = "", sort = "relevance") => {
    if (term.trim() === "" && genre === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    try {
      let url = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=15`;

      if (term.trim()) url += `&search=${encodeURIComponent(term)}`;
      if (genre) url += `&genres=${genre}`;
      if (sort === "rating") url += `&ordering=-rating`;
      else if (sort === "released") url += `&ordering=-released`;
      else if (sort === "metacritic") url += `&ordering=-metacritic`;

      const response = await fetch(url);
      const data = await response.json();
      setSearchResults(data.results || []);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedGenre("");
    setSortBy("relevance");
    setSearchResults([]);
    setShowResults(false);
    setShowFilters(false);
  };

  return {
    allGames,
    loading,
    searchTerm,
    setSearchTerm,
    showFilters,
    setShowFilters,
    selectedGenre,
    setSelectedGenre,
    sortBy,
    setSortBy,
    searchResults,
    showResults,
    setShowResults,
    searchGames,
    clearSearch,
  };
}
