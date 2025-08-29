import { useEffect } from "react";

const useSearchKeyboard = ({
  searchRef,
  showResults,
  showSuggestions,
  searchResults = [],
  recentSearches = [],
  popularGames = [],
  selectedResultIndex,
  setSelectedResultIndex,
  visibleCount,
  searchTerm,
  handleResultClick,
  handleGameSelect,
  onAddRecentSearch,
  setShowResults,
  setShowSuggestions,
  setShowFilters,
}) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        setShowFilters(false);
        setShowSuggestions(false);
        setSelectedResultIndex(-1);
      }
    };

    const handleKeyDown = (event) => {
      const currentResults = searchTerm.trim()
        ? searchResults
        : [...recentSearches, ...popularGames];

      if ((!showResults && !showSuggestions) || currentResults.length === 0)
        return;

      switch (event.key) {
        case "Escape":
          setShowResults(false);
          setShowSuggestions(false);
          setSelectedResultIndex(-1);
          break;
        case "ArrowDown":
          event.preventDefault();
          setSelectedResultIndex((prev) =>
            prev < Math.min(visibleCount - 1, currentResults.length - 1)
              ? prev + 1
              : prev
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedResultIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          event.preventDefault();
          if (selectedResultIndex >= 0 && currentResults[selectedResultIndex]) {
            const selectedGame = currentResults[selectedResultIndex];
            handleResultClick(selectedGame, handleGameSelect);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    searchRef,
    showResults,
    showSuggestions,
    searchResults,
    selectedResultIndex,
    handleResultClick,
    handleGameSelect,
    visibleCount,
    searchTerm,
    recentSearches,
    popularGames,
    onAddRecentSearch,
    setShowResults,
    setShowFilters,
    setShowSuggestions,
    setSelectedResultIndex,
  ]);

  return { handleKeyDown: (e) => {} };
};

export default useSearchKeyboard;
