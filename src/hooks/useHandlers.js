import { useState, useCallback } from "react";

// Custom hook to handle UI interactions for games: selection, rating, search, genre & sort changes
const useHandlers = (gameData, addToRecentViews, submitRating) => {
  // State for rating modal visibility
  const [showRatingModal, setShowRatingModal] = useState(false);

  // State for currently selected game (for modal or rating)
  const [selectedGame, setSelectedGame] = useState(null);

  // Destructure functions and state from gameData for easier access
  const {
    setSearchTerm, // Function to update search term state
    searchGames, // Function to trigger game search/fetch
    selectedGenre, // Currently selected genre ID
    sortBy, // Current sort order
    setSelectedGenre, // Function to update selected genre
    setSortBy, // Function to update sort order
    setShowResults, // Function to show search results
    clearSearch, // Function to clear search state
  } = gameData || {};

  // -------------------------------
  // Handler: When a game is selected
  // Add it to recent views if function provided
  // -------------------------------
  const handleGameSelect = useCallback(
    (game) => {
      if (game && addToRecentViews) {
        addToRecentViews(game);
      }
    },
    [addToRecentViews] // Depend on the function reference
  );

  // -------------------------------
  // Handler: Open rating modal for a game
  // Stops event propagation if called from a nested click
  // -------------------------------
  const openRatingModal = useCallback((game, e) => {
    if (e) e.stopPropagation(); // Prevent parent click triggers
    if (game) {
      setSelectedGame(game); // Set the game to be rated
      setShowRatingModal(true); // Show modal
    }
  }, []);

  // -------------------------------
  // Handler: Submit a rating for the selected game
  // Closes modal and clears selected game after submission
  // -------------------------------
  const handleRatingSubmit = useCallback(
    (rating) => {
      if (selectedGame && submitRating) {
        submitRating(selectedGame.id, rating); // Call parent submit function
        setShowRatingModal(false); // Close modal
        setSelectedGame(null); // Reset selected game
      }
    },
    [selectedGame, submitRating] // Depend on selected game & submit function
  );

  // -------------------------------
  // Handler: Perform search by term
  // Updates state and triggers searchGames function if valid term
  // -------------------------------
  const handleSearch = useCallback(
    (term) => {
      if (setSearchTerm) {
        setSearchTerm(term); // Update search term state
      }
      if (term && term.trim() && searchGames) {
        // Trigger search with current genre & sort order
        searchGames(term, selectedGenre, sortBy);
      } else if (setShowResults) {
        // Hide search results if no term
        setShowResults(false);
      }
    },
    [setSearchTerm, searchGames, sortBy, setShowResults, selectedGenre]
  );

  // -------------------------------
  // Handler: Change genre filter
  // Updates selected genre & triggers search with current term
  // -------------------------------
  const handleGenreSelect = useCallback(
    (genreID) => {
      if (setSelectedGenre && searchGames) {
        setSelectedGenre(genreID); // Update genre state
        searchGames(gameData?.searchTerm || "", genreID, sortBy); // Trigger search
      }
    },
    [setSelectedGenre, searchGames, gameData?.searchTerm, sortBy]
  );

  // -------------------------------
  // Handler: Change sort order
  // Updates sort state & triggers search with current term & genre
  // -------------------------------
  const handleSortChange = useCallback(
    (newSortBy) => {
      if (setSortBy && searchGames) {
        setSortBy(newSortBy); // Update sort state
        searchGames(gameData?.searchTerm || "", selectedGenre, newSortBy); // Trigger search
      }
    },
    [setSortBy, searchGames, gameData?.searchTerm, selectedGenre]
  );

  // -------------------------------
  // Handler: Clear search input and results
  // -------------------------------
  const handleClearSearch = useCallback(() => {
    if (clearSearch) {
      clearSearch(); // Call parent function to reset search state
    }
  }, [clearSearch]);

  // -------------------------------
  // Return modal states & all handlers to the component
  // -------------------------------
  return {
    // Modal state
    showRatingModal,
    selectedGame,
    setShowRatingModal,
    setSelectedGame,

    // Handlers
    handleGameSelect,
    openRatingModal,
    handleRatingSubmit,
    handleSearch,
    handleGenreSelect,
    handleSortChange,
    handleClearSearch,
  };
};

export default useHandlers;
