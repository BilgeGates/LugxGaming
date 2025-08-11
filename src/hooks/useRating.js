import { useState } from "react";

const useRating = () => {
  const [gameRatings, setGameRatings] = useState({});

  const submitRating = (gameId, rating) => {
    setGameRatings((prev) => ({
      ...prev,
      [gameId]: {
        rating,
        ratedAt: new Date().toISOString(),
      },
    }));
  };

  const getUserRating = (gameId) => {
    return gameRatings[gameId]?.rating || 0;
  };

  const getRatingDate = (gameId) => {
    return gameRatings[gameId]?.ratedAt || null;
  };

  const hasUserRated = (gameId) => {
    return gameRatings[gameId] !== undefined;
  };

  const removeRating = (gameId) => {
    setGameRatings((prev) => {
      const { [gameId]: removed, ...rest } = prev;
      return rest;
    });
  };

  const getAllRatedGames = () => {
    return Object.entries(gameRatings).map(([gameId, data]) => ({
      gameId: parseInt(gameId),
      ...data,
    }));
  };

  const getAverageRating = () => {
    const ratings = Object.values(gameRatings);
    if (ratings.length === 0) return 0;

    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  return {
    gameRatings,
    submitRating,
    getUserRating,
    getRatingDate,
    hasUserRated,
    removeRating,
    getAllRatedGames,
    getAverageRating,
  };
};

export default useRating;
