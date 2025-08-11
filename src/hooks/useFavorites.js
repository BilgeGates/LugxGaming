import { useState } from "react";

const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [pinnedFavorites, setPinnedFavorites] = useState([]);

  const toggleFavorite = (game) => {
    const gameId = typeof game === "object" ? game.id : game;
    const gameData = typeof game === "object" ? game : null;

    setFavorites((prev) => {
      const exists = prev.find((fav) => fav.id === gameId);
      if (exists) {
        setPinnedFavorites((prevPinned) =>
          prevPinned.filter((pin) => pin.id !== gameId)
        );
        return prev.filter((fav) => fav.id !== gameId);
      } else {
        return gameData ? [...prev, gameData] : prev;
      }
    });
  };

  const togglePin = (gameId) => {
    const game = favorites.find((fav) => fav.id === gameId);
    if (!game) return;

    setPinnedFavorites((prev) => {
      const exists = prev.find((pin) => pin.id === gameId);
      if (exists) {
        return prev.filter((pin) => pin.id !== gameId);
      } else {
        return [...prev, game];
      }
    });
  };

  const removeFavorite = (gameId) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== gameId));
    setPinnedFavorites((prev) => prev.filter((pin) => pin.id !== gameId));
  };

  const isGameFavorited = (gameId) => {
    return favorites.some((fav) => fav.id === gameId);
  };

  const isGamePinned = (gameId) => {
    return pinnedFavorites.some((pin) => pin.id === gameId);
  };

  const getSortedFavorites = () => {
    const pinned = pinnedFavorites;
    const unpinned = favorites.filter(
      (fav) => !pinnedFavorites.some((pin) => pin.id === fav.id)
    );
    return [...pinned, ...unpinned];
  };

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
