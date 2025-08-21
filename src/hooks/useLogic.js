import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { sortGames } from "../utils";

// Number of games to display per page (for pagination)
const GAMES_PER_PAGE = 24;

// Mapping of URL-friendly genre keys to their actual genre ID"s
// This is used to filter games based on their genres
const genreMapping = {
  action: "4",
  adventure: "3",
  "role-playing-games-rpg": "5",
  strategy: "10",
  shooter: "2",
  sports: "15",
  racing: "1",
  puzzle: "7",
  casual: "40",
  simulation: "14",
  platformer: "83",
  arcade: "11",
};

// Custom hook to manage game list logic: filtering, sorting, search, and pagination
const useLogic = (gameData, searchResults, showResults) => {
  // URL search parameters, e.g., ?filter=action
  const [searchParams, setSearchParams] = useSearchParams();

  // State for filtered games after applying filter/search/sort
  const [filteredGames, setFilteredGames] = useState([]);

  // State for the subset of games to display on the current page
  const [displayedGames, setDisplayedGames] = useState([]);

  // Currently active genre filter (default "all" = no filter)
  const [activeFilter, setActiveFilter] = useState("all");

  // Current page number for pagination (starts at 1)
  const [currentPage, setCurrentPage] = useState(1);

  // Display mode for the UI: "grid" or "list"
  const [viewMode, setViewMode] = useState("grid");

  // Destructure gameData with default values
  const {
    allGames = [], // all available games
    searchTerm = "", // text search input
    sortBy = "popularity", // default sort criteria
  } = gameData || {};

  // -------------------------------
  // Effect: Sync state with URL filter
  // -------------------------------
  useEffect(() => {
    // Get "filter" parameter from the URL
    const filterFromURL = searchParams.get("filter");

    // Only proceed if filter exists in URL and is in the mapping
    if (filterFromURL && genreMapping[filterFromURL]) {
      // Update active filter state
      setActiveFilter(filterFromURL);

      // Map URL key to actual genre ID
      const genreID = genreMapping[filterFromURL];

      // Optional: Trigger external gameData functions if available
      // NOTE: There may be a typo: `searchGenres` should probably be `searchGames`
      if (gameData?.setSelectedGenre && gameData?.searchGenres) {
        // Update the selected genre in parent or global state
        gameData.setSelectedGenre(genreID);

        // Trigger search for games with this genre and current sort order
        gameData.searchGames("", genreID, sortBy);
      }
    }
  }, [searchParams, gameData, sortBy]);
  // Dependencies: rerun effect when URL params, gameData object, or sort criteria change

  // -------------------------------
  // Effect: Filter, search, and sort games
  // -------------------------------
  useEffect(() => {
    let filtered = [];

    try {
      if (showResults && searchResults?.length > 0) {
        // If search results are coming from an API, use them directly
        filtered = searchResults;
      } else if (activeFilter !== "all" && genreMapping[activeFilter]) {
        // Filter allGames based on selected genre
        const genreID = genreMapping[activeFilter];

        filtered = allGames.filter(
          (game) =>
            game.genres &&
            game.genres.some((g) => g.id && g.id.toString() === genreID)
        );
      } else {
        // If no filter is applied, use all games
        filtered = allGames;
      }

      // Apply text search (only if showResults is false)
      if (searchResults && searchTerm.trim() && !showResults) {
        filtered = filtered.filter(
          (game) =>
            game.name &&
            game.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Sort the filtered games based on the sortBy criteria
      filtered = sortGames(filtered, sortBy);

      // Update filteredGames state
      setFilteredGames(filtered);

      // Reset pagination to page 1 whenever filtering changes
      setCurrentPage(1);
    } catch (error) {
      console.log("Error filtering games:", error);
      setFilteredGames([]);
    }
  }, [allGames, activeFilter, searchTerm, sortBy, searchResults, showResults]);
  // Dependencies: rerun when any relevant data, filter, search term, or sort changes

  // -------------------------------
  // Effect: Pagination - compute displayed games for current page
  // -------------------------------
  useEffect(() => {
    const startIndex = (currentPage - 1) * GAMES_PER_PAGE;
    const endIndex = startIndex + GAMES_PER_PAGE;

    // Slice the filtered games array to only include games for the current page
    setDisplayedGames(filteredGames.slice(startIndex, endIndex));
  }, [filteredGames, currentPage]);
  // Dependencies: rerun when filteredGames or currentPage changes

  // -------------------------------
  // Memoized calculation of total pages
  // -------------------------------
  const totalPages = useMemo(
    () => Math.ceil(filteredGames.length / GAMES_PER_PAGE),
    [filteredGames]
  );

  // -------------------------------
  // Callback: Clear the active filter
  // -------------------------------
  const handleFilterClear = useCallback(() => {
    // Reset active filter state
    setActiveFilter("all");

    // Remove "filter" parameter from the URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("filter");
    setSearchParams(newSearchParams);
  }, [searchParams, setSearchParams]);

  // -------------------------------
  // Return state and action handlers to component
  // -------------------------------
  return {
    // State
    filteredGames,
    displayedGames,
    activeFilter,
    currentPage,
    viewMode,
    totalPages,
    genreMapping,

    // Actions
    setActiveFilter,
    setCurrentPage,
    setViewMode,
    handleFilterClear,
  };
};

export default useLogic;
