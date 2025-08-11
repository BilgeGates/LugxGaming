import { useState, useCallback } from "react";

const useRecentViews = () => {
  const [recentViews, setRecentViews] = useState([]);

  const addToRecentViews = useCallback((gameData) => {
    const processedGame = {
      id: gameData.id,
      name: gameData.name,
      background_image: gameData.background_image,
      rating: gameData.rating,
      released: gameData.released,
      genres: gameData.genres || [],
      metacritic: gameData.metacritic,
      viewedAt: new Date().toISOString(),
    };

    setRecentViews((prev) => {
      const filtered = prev.filter((item) => item.id !== gameData.id);
      return [processedGame, ...filtered].slice(0, 40);
    });
  }, []);

  const clearRecentViews = useCallback(() => {
    setRecentViews([]);
  }, []);

  return {
    recentViews,
    addToRecentViews,
    clearRecentViews,
  };
};

export default useRecentViews;
