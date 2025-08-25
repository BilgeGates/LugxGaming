import { useCallback } from "react";
import useLocalStorage from "./useLocalStorage";

const useRating = () => {
  const [gameRatings, setGameRatings] = useLocalStorage("gameRatings", {});

  const submitRating = useCallback(
    (gameId, rating) => {
      setGameRatings((prev) => ({
        ...prev,
        [gameId]: {
          rating,
          ratedAt: new Date().toISOString(),
        },
      }));
    },
    [setGameRatings]
  );

  const getUserRating = useCallback(
    (gameId) => {
      return gameRatings[gameId]?.rating || 0;
    },
    [gameRatings]
  );

  const getRatingColor = useCallback((rating) => {
    if (rating >= 4.5) return "text-green-500";
    if (rating >= 4) return "text-yellow-500";
    if (rating >= 3) return "text-orange-500";
    return "text-red-500";
  }, []);

  const removeRating = useCallback(
    (gameId) => {
      setGameRatings((prev) => {
        const updated = { ...prev };
        delete updated[gameId];
        return updated;
      });
    },
    [setGameRatings]
  );

  const getAllRatings = useCallback(() => {
    return gameRatings;
  }, [gameRatings]);

  return {
    gameRatings,
    submitRating,
    getUserRating,
    getRatingColor,
    removeRating,
    getAllRatings,
  };
};

export default useRating;
