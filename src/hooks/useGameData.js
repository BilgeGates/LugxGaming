import { useState, useEffect } from "react";

import gamesData from "../db.json";

import {
  searchGames,
  formatDate,
  formatTimeAgo,
  formatReleaseDate,
} from "../utils";

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

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      try {
        const games = gamesData.games || gamesData;
        setAllGames(Array.isArray(games) ? games : []);
      } catch (err) {
        console.error("Error loading games data:", err);
        setError("Failed to load games data");
        setAllGames([]);
      } finally {
        setLoading(false);
      }
    }, 100);
  }, []);

  const performSearch = (term, genre = "", sort = "relevance") => {
    if (term.trim() === "" && genre === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const results = searchGames(allGames, term, genre, sort);
    setSearchResults(results);
    setShowResults(true);
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
    // Data
    allGames,
    loading,
    error,
    genres,

    // Search state
    searchTerm,
    setSearchTerm,
    selectedGenre,
    setSelectedGenre,
    sortBy,
    setSortBy,
    searchResults,
    showResults,
    setShowResults,

    // UI state
    showFilters,
    setShowFilters,

    // Actions
    searchGames: performSearch,
    clearSearch,

    // Date formatting

    formatDate,
    formatTimeAgo,
    formatReleaseDate,
  };
};

export default useGameData;
