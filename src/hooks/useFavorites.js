import { useCallback, useState, useMemo } from "react";

const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [pinnedFavorites, setPinnedFavorites] = useState([]);

  const toggleFavorite = useCallback((game) => {
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
  }, []);

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
    [favorites]
  );

  const removeFavorite = useCallback((gameId) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== gameId));
    setPinnedFavorites((prev) => prev.filter((pin) => pin !== gameId));
  }, []);

  const isGameFavorited = useCallback(
    (gameId) => {
      return favorites.some((fav) => fav.id === gameId);
    },
    [favorites]
  );

  const isGamePinned = useCallback(
    (gameId) => {
      return pinnedFavorites.includes(gameId);
    },
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
