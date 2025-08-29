import { useState, useCallback, useRef, useEffect } from "react";

const useSearch = ({ handleSearch, onAddRecentSearch } = {}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [visibleCount, setVisibleCount] = useState(7);
  const [loadingMore, setLoadingMore] = useState(false);

  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const debouncedSearch = useCallback(
    (value, genre, sort) => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

      if (value.trim() || genre) {
        setIsSearching(true);
        setShowSuggestions(false);
        setShowResults(true);
      }

      searchTimeoutRef.current = setTimeout(async () => {
        if (handleSearch) await handleSearch(value, genre, sort);
        setVisibleCount(7);
        setIsSearching(false);
      }, 300);
    },
    [handleSearch]
  );

  const handleInputChange = useCallback(
    (value) => {
      setSearchTerm(value);
      setSelectedResultIndex(-1);

      if (value.trim()) {
        setShowResults(true);
        setShowSuggestions(false);
        debouncedSearch(value, selectedGenre, sortBy);
      } else {
        setShowResults(false);
        setShowSuggestions(true);
        setIsSearching(false);
      }
    },
    [debouncedSearch, selectedGenre, sortBy]
  );

  const handleInputFocus = useCallback(() => {
    if (!searchTerm.trim()) {
      setShowSuggestions(true);
      setShowResults(false);
    } else {
      setShowResults(true);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleClearSearch = useCallback((clearFn) => {
    if (clearFn) clearFn();
    setSearchTerm("");
    setShowResults(false);
    setShowSuggestions(true);
    setSelectedResultIndex(-1);
    setVisibleCount(7);
    setIsSearching(false);
  }, []);

  const handleFilterChange = useCallback(
    (filterType, value) => {
      if (filterType === "genre") setSelectedGenre(value);
      else if (filterType === "sort") setSortBy(value);

      const newGenre = filterType === "genre" ? value : selectedGenre;
      const newSort = filterType === "sort" ? value : sortBy;

      setShowResults(true);
      setShowSuggestions(false);
      debouncedSearch(searchTerm, newGenre, newSort);
    },
    [selectedGenre, sortBy, searchTerm, debouncedSearch]
  );

  const handleResultClick = useCallback(
    (game, handleGameSelect) => {
      handleGameSelect?.(game);
      onAddRecentSearch?.(game);
      setShowResults(false);
      setShowSuggestions(false);
      setSelectedResultIndex(-1);
      setVisibleCount(7);
    },
    [onAddRecentSearch]
  );

  const handlePopularGenreClick = useCallback(
    (genre) => {
      setSelectedGenre(genre.id);
      setSearchTerm("");
      setShowResults(true);
      setShowSuggestions(false);
      handleSearch?.("", genre.id, sortBy);
      setVisibleCount(7);
    },
    [handleSearch, sortBy]
  );

  const loadMoreResults = useCallback(() => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((v) => v + 7);
      setLoadingMore(false);
    }, 700);
  }, []);

  const resetSearch = useCallback(() => {
    setSearchTerm("");
    setSelectedGenre("");
    setSortBy("relevance");
    setShowFilters(false);
    setShowResults(false);
    setShowSuggestions(false);
    setSelectedResultIndex(-1);
    setIsSearching(false);
    setVisibleCount(7);
    setLoadingMore(false);
  }, []);

  return {
    searchTerm,
    selectedGenre,
    sortBy,
    showFilters,
    showResults,
    showSuggestions,
    selectedResultIndex,
    isSearching,
    visibleCount,
    loadingMore,

    setSearchTerm,
    setSelectedGenre,
    setSortBy,
    setShowFilters,
    setShowResults,
    setShowSuggestions,
    setSelectedResultIndex,
    setVisibleCount,

    handleInputChange,
    handleInputFocus,
    handleClearSearch,
    handleFilterChange,
    handleResultClick,
    handlePopularGenreClick,
    handleSearch,
    loadMoreResults,
    resetSearch,
    debouncedSearch,
  };
};

export default useSearch;
