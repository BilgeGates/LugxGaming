import React from "react";
import useGameData from "./useGameData";
import GameCard from "../common/GameCard";

const GamesList = () => {
  const {
    allGames,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    searchGames,
    searchResults,
    showResults,
    clearSearch,
    genres,
    selectedGenre,
    setSelectedGenre,
    sortBy,
    setSortBy,
  } = useGameData();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter")
              searchGames(searchTerm, selectedGenre, sortBy);
          }}
          className="flex-grow border p-2 rounded"
        />

        <button
          onClick={() => searchGames(searchTerm, selectedGenre, sortBy)}
          className="btn bg-cyan-600 hover:bg-cyan-700 text-white px-4 rounded"
        >
          Search
        </button>
        <button
          onClick={clearSearch}
          className="btn border border-gray-400 px-4 rounded"
        >
          Clear
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="relevance">Relevance</option>
          <option value="rating">Rating</option>
          <option value="released">Release Date</option>
          <option value="metacritic">Metacritic</option>
        </select>
      </div>

      {loading && <p className="text-center text-gray-500">Loading games...</p>}
      {error && (
        <p className="text-center text-red-500 font-semibold">{error}</p>
      )}

      {!loading && !error && (
        <>
          {showResults ? (
            searchResults.length > 0 ? (
              searchResults.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  variant="default"
                  onSelect={() => window.open(`/products/${game.id}`, "_self")}
                  userRating={game.rating}
                  showActions={false}
                />
              ))
            ) : (
              <p className="text-center text-gray-600">No results found.</p>
            )
          ) : (
            allGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                variant="default"
                onSelect={() => window.open(`/products/${game.id}`, "_self")}
                userRating={game.rating}
                showActions={false}
              />
            ))
          )}
        </>
      )}
    </div>
  );
};

export default GamesList;
