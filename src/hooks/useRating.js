import { useCallback, useState } from "react";

const useRating = () => {
  const [gameRatings, setGameRatings] = useState({});

  const submitRating = useCallback((gameId, rating) => {
    setGameRatings((prev) => ({
      ...prev,
      [gameId]: {
        rating,
        ratedAt: new Date().toISOString(),
      },
    }));
  }, []);

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

  return {
    gameRatings,
    submitRating,
    getUserRating,
    getRatingColor,
  };
};
export default useRating;
