import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "recent_views";

const useRecentViews = () => {
  const [recentViews, setRecentViews] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentViews));
    } catch {}
  }, [recentViews]);

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
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return {
    recentViews,
    addToRecentViews,
    clearRecentViews,
  };
};

export default useRecentViews;
