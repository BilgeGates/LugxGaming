import { useState } from "react";

const useRecentViews = () => {
  const [recentViews, setRecentViews] = useState([]);

  const addToRecentViews = (gameData) => {
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
      const newRecentViews = [processedGame, ...filtered];
      return newRecentViews.slice(0, 40);
    });
  };

  const clearRecentViews = () => {
    setRecentViews([]);
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
    recentViews,
    addToRecentViews,
    clearRecentViews,
    formatTimeAgo,
  };
};

export default useRecentViews;
