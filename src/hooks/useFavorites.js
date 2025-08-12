import { useCallback, useMemo } from "react";
import useLocalStorage from "./useLocalStorage";

const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage("favorites", []);
  const [pinnedFavorites, setPinnedFavorites] = useLocalStorage(
    "pinnedFavorites",
    []
  );

  const toggleFavorite = useCallback(
    (game) => {
      const gameId = typeof game === "object" ? game.id : game;
      const gameData = typeof game === "object" ? game : null;

      setFavorites((prev) => {
        const exists = prev.find((fav) => fav.id === gameId);
        if (exists) {
          setPinnedFavorites((prevPinned) =>
            prevPinned.filter((pin) => pin !== gameId)
          );
          return prev.filter((fav) => fav.id !== gameId);
        } else {
          return gameData ? [...prev, gameData] : prev;
        }
      });
    },
    [setFavorites, setPinnedFavorites]
  );

  const togglePin = useCallback(
    (gameId) => {
      const isFavorited = favorites.some((fav) => fav.id === gameId);
      if (!isFavorited) return;

      setPinnedFavorites((prev) => {
        const exists = prev.includes(gameId);
        if (exists) {
          return prev.filter((pin) => pin !== gameId);
        } else {
          return [...prev, gameId];
        }
      });
    },
    [favorites, setPinnedFavorites]
  );

  const removeFavorite = useCallback(
    (gameId) => {
      setFavorites((prev) => prev.filter((fav) => fav.id !== gameId));
      setPinnedFavorites((prev) => prev.filter((pin) => pin !== gameId));
    },
    [setFavorites, setPinnedFavorites]
  );

  const isGameFavorited = useCallback(
    (gameId) => favorites.some((fav) => fav.id === gameId),
    [favorites]
  );

  const isGamePinned = useCallback(
    (gameId) => pinnedFavorites.includes(gameId),
    [pinnedFavorites]
  );

  const getSortedFavorites = useMemo(() => {
    const pinned = favorites.filter((game) =>
      pinnedFavorites.includes(game.id)
    );
    const unpinned = favorites.filter(
      (game) => !pinnedFavorites.includes(game.id)
    );
    return [...pinned, ...unpinned];
  }, [favorites, pinnedFavorites]);

  return {
    favorites,
    pinnedFavorites,
    toggleFavorite,
    togglePin,
    removeFavorite,
    isGameFavorited,
    isGamePinned,
    getSortedFavorites,
  };
};

export default useFavorites;
