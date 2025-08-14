import { useState, useEffect } from "react";

const useGameData = () => {
  const [allGames, setAllGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");

  const [genres] = useState([
    { id: "4", name: "Action" },
    { id: "3", name: "Adventure" },
    { id: "5", name: "RPG" },
    { id: "10", name: "Strategy" },
    { id: "2", name: "Shooter" },
    { id: "40", name: "Casual" },
    { id: "14", name: "Simulation" },
    { id: "7", name: "Puzzle" },
    { id: "11", name: "Arcade" },
    { id: "83", name: "Platformer" },
  ]);

  const API_KEY = "28dbf80fd39248b19263558419c182e3";

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${API_KEY}&page_size=40`
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setAllGames(data.results || []);
      } catch (err) {
        setError(err.message || "Unknown error");
        setAllGames([]);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [error]);

  const searchGames = async (term, genre = "", sort = "relevance") => {
    console.log("searchGames called:", { term, genre, sort }); // ①
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

      console.log("RAWG API response:", data); // ②

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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).getFullYear();
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
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
    genres,
    formatDate,
    formatTimeAgo,
  };
};

export default useGameData;
