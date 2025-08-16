import { useState, useEffect, useCallback, useRef } from "react";

const useGameData = () => {
  const [allGames, setAllGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Cache for API responses
  const cacheRef = useRef(new Map());
  const abortControllerRef = useRef(null);

  const [genres] = useState([
    { id: "4", name: "Action" },
    { id: "3", name: "Adventure" },
    { id: "5", name: "RPG" },
    { id: "10", name: "Strategy" },
    { id: "2", name: "Shooter" },
    { id: "15", name: "Sports" },
    { id: "1", name: "Racing" },
    { id: "40", name: "Casual" },
    { id: "14", name: "Simulation" },
    { id: "7", name: "Puzzle" },
    { id: "11", name: "Arcade" },
    { id: "83", name: "Platformer" },
  ]);

  const API_KEY = "28dbf80fd39248b19263558419c182e3";
  const BASE_URL = "https://api.rawg.io/api";

  // Rate limiting
  const lastRequestTime = useRef(0);
  const REQUEST_DELAY = 100; // 100ms between requests

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Fetch initial games data
  useEffect(() => {
    let isMounted = true;

    const fetchInitialGames = async () => {
      setLoading(true);
      setError(null);

      const cacheKey = "initial_games";

      // Check cache first
      if (cacheRef.current.has(cacheKey)) {
        const cachedData = cacheRef.current.get(cacheKey);
        if (isMounted) {
          setAllGames(cachedData);
          setLoading(false);
        }
        return;
      }

      try {
        // Rate limiting
        const timeSinceLastRequest = Date.now() - lastRequestTime.current;
        if (timeSinceLastRequest < REQUEST_DELAY) {
          await delay(REQUEST_DELAY - timeSinceLastRequest);
        }
        lastRequestTime.current = Date.now();

        const response = await fetch(
          `${BASE_URL}/games?key=${API_KEY}&page_size=40&ordering=-rating,-released`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.results || !Array.isArray(data.results)) {
          throw new Error("Invalid API response format");
        }

        // Validate and filter games data
        const validGames = data.results.filter(
          (game) =>
            game && game.id && game.name && typeof game.name === "string"
        );

        if (isMounted) {
          setAllGames(validGames);
          // Cache the results
          cacheRef.current.set(cacheKey, validGames);
        }
      } catch (err) {
        console.error("Error fetching games:", err);
        if (isMounted) {
          setError(err.message || "Failed to load games");
          setAllGames([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInitialGames();

    return () => {
      isMounted = false;
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // Only run once on mount

  const searchGames = useCallback(
    async (term = "", genre = "", sort = "relevance") => {
      console.log("searchGames called:", { term, genre, sort });

      // Clear previous search if no term and no genre
      if (!term.trim() && !genre) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      // Create cache key
      const cacheKey = `search_${term}_${genre}_${sort}`;

      // Check cache first
      if (cacheRef.current.has(cacheKey)) {
        const cachedData = cacheRef.current.get(cacheKey);
        setSearchResults(cachedData);
        setShowResults(true);
        return;
      }

      try {
        // Rate limiting
        const timeSinceLastRequest = Date.now() - lastRequestTime.current;
        if (timeSinceLastRequest < REQUEST_DELAY) {
          await delay(REQUEST_DELAY - timeSinceLastRequest);
        }
        lastRequestTime.current = Date.now();

        let url = `${BASE_URL}/games?key=${API_KEY}&page_size=20`;

        // Add search term
        if (term && term.trim()) {
          url += `&search=${encodeURIComponent(term.trim())}`;
        }

        // Add genre filter
        if (genre) {
          url += `&genres=${encodeURIComponent(genre)}`;
        }

        // Add sorting
        switch (sort) {
          case "rating":
            url += "&ordering=-rating";
            break;
          case "released":
          case "release_date":
            url += "&ordering=-released";
            break;
          case "metacritic":
            url += "&ordering=-metacritic";
            break;
          case "name":
            url += "&ordering=name";
            break;
          case "popularity":
          case "relevance":
          default:
            url += "&ordering=-rating,-released";
            break;
        }

        console.log("Search URL:", url);

        const response = await fetch(url, {
          signal: abortControllerRef.current.signal,
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("RAWG API response:", data);

        if (!data.results || !Array.isArray(data.results)) {
          throw new Error("Invalid search response format");
        }

        // Validate and filter search results
        const validResults = data.results.filter(
          (game) =>
            game && game.id && game.name && typeof game.name === "string"
        );

        // Cache the results
        cacheRef.current.set(cacheKey, validResults);

        setSearchResults(validResults);
        setShowResults(true);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Search request was cancelled");
          return;
        }

        console.error("Search error:", error);
        setSearchResults([]);
        setShowResults(false);
        setError(error.message || "Search failed");
      }
    },
    [API_KEY]
  );

  const clearSearch = useCallback(() => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setSearchTerm("");
    setSelectedGenre("");
    setSortBy("relevance");
    setSearchResults([]);
    setShowResults(false);
    setShowFilters(false);
    setError(null);
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "N/A";
      }
      return date.getFullYear().toString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  }, []);

  const formatTimeAgo = useCallback((dateString) => {
    if (!dateString) return "N/A";

    try {
      const now = new Date();
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "N/A";
      }

      const diffInMinutes = Math.floor((now - date) / (1000 * 60));

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 30) return `${diffInDays}d ago`;

      const diffInMonths = Math.floor(diffInDays / 30);
      if (diffInMonths < 12) return `${diffInMonths}mo ago`;

      const diffInYears = Math.floor(diffInMonths / 12);
      return `${diffInYears}y ago`;
    } catch (error) {
      console.error("Error formatting time ago:", error);
      return "N/A";
    }
  }, []);

  // Clean up function
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Clear cache periodically (optional)
      if (cacheRef.current.size > 50) {
        cacheRef.current.clear();
      }
    };
  }, []);

  return {
    allGames,
    loading,
    error,
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
