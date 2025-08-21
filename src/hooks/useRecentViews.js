import { useCallback } from "react";
import useLocalStorage from "./useLocalStorage";

const useRecentViews = () => {
  const [recentViews, setRecentViews] = useLocalStorage("recentViews", []);

  const addToRecentViews = useCallback(
    (gameData) => {
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
        return [processedGame, ...filtered].slice(0, 100);
      });
    },
    [setRecentViews]
  );

  const clearRecentViews = useCallback(() => {
    setRecentViews([]);
  }, [setRecentViews]);

  return {
    recentViews,
    addToRecentViews,
    clearRecentViews,
  };
};

export default useRecentViews;
