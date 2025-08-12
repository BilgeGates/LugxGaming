import React, { useState } from "react";
import useGameData from "../../../hooks/useGameData";
import GameCard from "../../common/GameCard";

const TrendingSection = () => {
  const { allGames, loading, error } = useGameData();
  const [modalOpen, setModalOpen] = useState(false);

  const visibleGames = Array.isArray(allGames) ? allGames.slice(0, 4) : [];

  return (
    <section className="trending-section py-16 text-white min-h-[600px]">
      <div className="container mx-auto max-w-7xl px-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <div>
            <h6 className="text-cyan-400 uppercase tracking-widest font-semibold mb-1 text-sm sm:text-base">
              Trending
            </h6>
            <h2 className="text-4xl font-extrabold leading-tight">
              Trending Games
            </h2>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            aria-label="View all trending games"
            className="inline-block bg-cyan-500 hover:bg-purple-700 transition-colors text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-cyan-600/30 focus:outline-none focus:ring-4 focus:ring-cyan-400"
          >
            View All
          </button>
        </header>

        {loading && (
          <p className="text-center text-lg text-gray-300 animate-pulse">
            Loading games...
          </p>
        )}
        {error && (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {visibleGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                variant="default"
                onSelect={() => window.open(`/products/${game.id}`, "_self")}
                userRating={game.rating}
                showActions={false}
              />
            ))}
          </div>
        )}

        {modalOpen && (
          <Modal title="All Trending Games" onClose={() => setModalOpen(false)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-h-[70vh] overflow-y-auto p-2">
              {allGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  variant="default"
                  onSelect={() => window.open(`/products/${game.id}`, "_self")}
                  userRating={game.rating}
                  showActions={false}
                />
              ))}
            </div>
          </Modal>
        )}
      </div>
    </section>
  );
};

const Modal = ({ children, onClose, title }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4"
    aria-modal="true"
    role="dialog"
    aria-labelledby="modal-title"
  >
    <div className="bg-white rounded-3xl max-w-7xl w-full max-h-full overflow-auto p-8 shadow-2xl relative">
      <h2
        id="modal-title"
        className="text-3xl font-bold text-gray-900 mb-6 select-none"
      >
        {title}
      </h2>
      <button
        onClick={onClose}
        aria-label="Close modal"
        className="absolute top-5 right-5 text-gray-600 hover:text-gray-900 transition text-3xl font-bold focus:outline-none"
      >
        &times;
      </button>
      {children}
    </div>
  </div>
);

export default TrendingSection;
