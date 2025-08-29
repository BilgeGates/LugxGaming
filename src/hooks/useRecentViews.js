import { useCallback, useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

const useRecentViews = () => {
  const [recentViews, setRecentViews] = useLocalStorage("recentViews", []);

  useEffect(() => {
    const cleanupOldData = () => {
      if (recentViews.length > 0) {
        const needsUpdate = recentViews.some((game) => {
          if (
            typeof game.viewedAt === "string" ||
            (typeof game.viewedAt === "number" && game.viewedAt < 1000000000000)
          ) {
            return true;
          }
          return false;
        });

        if (needsUpdate) {
          console.log("Updating old recent views data format...");
          const updatedViews = recentViews.map((game) => ({
            ...game,
            viewedAt: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000, // Son 7 gün ərzində random
          }));
          setRecentViews(updatedViews);
        }
      }
    };

    cleanupOldData();
  }, [recentViews, setRecentViews]);

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
        viewedAt: Date.now(),
      };

      console.log(
        "Adding to recent views:",
        processedGame.name,
        "viewedAt:",
        processedGame.viewedAt
      );

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

  const debugRecentViews = useCallback(() => {
    console.log(
      "Recent Views Debug:",
      recentViews.map((game) => ({
        name: game.name,
        viewedAt: game.viewedAt,
        viewedAtType: typeof game.viewedAt,
        formattedDate: new Date(game.viewedAt).toString(),
      }))
    );
  }, [recentViews]);

  return {
    recentViews,
    addToRecentViews,
    clearRecentViews,
    debugRecentViews, // Debug üçün
  };
};

export default useRecentViews;
