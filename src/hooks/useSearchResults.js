import { useState, useCallback } from "react";

const useSearchResults = () => {
  const [visibleCount, setVisibleCount] = useState(7);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMoreResults = useCallback((currentResultsLength) => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 7, currentResultsLength));
      setLoadingMore(false);
    }, 700);
  }, []);

  const resetVisibleCount = useCallback(() => {
    setVisibleCount(7);
  }, []);

  const handleResultsScroll = useCallback(
    (e, currentResults) => {
      const target = e.target;

      if (
        !loadingMore &&
        target.scrollTop + target.clientHeight >= target.scrollHeight - 20 &&
        visibleCount < currentResults.length
      ) {
        loadMoreResults(currentResults.length);
      }
    },
    [loadingMore, visibleCount, loadMoreResults]
  );

  return {
    visibleCount,
    loadingMore,
    setVisibleCount,
    loadMoreResults,
    resetVisibleCount,
    handleResultsScroll,
  };
};

export default useSearchResults;
