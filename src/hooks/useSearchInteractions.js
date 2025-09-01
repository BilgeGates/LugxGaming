import { useCallback } from "react";

const useSearchInteractions = ({
  handleGameSelect,
  onAddRecentSearch,
  setShowResults,
  setSelectedResultIndex,
  resetVisibleCount,
  toggleFavorite,
  openRatingModal,
}) => {
  const handleResultClick = useCallback(
    (game) => {
      handleGameSelect(game);
      if (onAddRecentSearch) {
        onAddRecentSearch(game);
      }
      setShowResults(false);
      setSelectedResultIndex(-1);
      resetVisibleCount();
    },
    [
      handleGameSelect,
      onAddRecentSearch,
      setShowResults,
      setSelectedResultIndex,
      resetVisibleCount,
    ]
  );

  const handleFavoriteToggle = useCallback(
    (e, game) => {
      e.preventDefault();
      e.stopPropagation();

      if (toggleFavorite && typeof toggleFavorite === "function") {
        toggleFavorite(game);
      }
    },
    [toggleFavorite]
  );

  const handleRatingClick = useCallback(
    (e, game) => {
      e.preventDefault();
      e.stopPropagation();
      if (openRatingModal) {
        openRatingModal(game, e);
      }
    },
    [openRatingModal]
  );

  return {
    handleResultClick,
    handleFavoriteToggle,
    handleRatingClick,
  };
};

export default useSearchInteractions;
