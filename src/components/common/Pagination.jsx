import React from "react";

// Pagination component: renders pagination buttons for product lists
const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  // If there is only 1 page or none, don't render pagination
  if (totalPages <= 1) return null;

  return (
    <div className="mt-16 flex items-center justify-center gap-2">
      {/* -------------------------
            Previous Page Button
        ------------------------- */}
      <button
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} // Go to previous page, min = 1
        disabled={currentPage === 1} // Disable if on first page
        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
          currentPage === 1
            ? "bg-gray-800/50 text-gray-500 cursor-not-allowed" // Disabled styling
            : "bg-gray-900/50 text-white hover:bg-gray-700/50" // Active styling
        }`}
      >
        Previous
      </button>

      {/* -------------------------
            Page Number Buttons
        ------------------------- */}
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        // Compute page number to show
        const page = i + Math.max(1, currentPage - 2);
        if (page > totalPages) return null; // Skip if page exceeds total

        return (
          <button
            key={page}
            onClick={() => setCurrentPage(page)} // Switch to selected page
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              currentPage === page
                ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white" // Active page style
                : "bg-gray-900/50 text-gray-300 hover:text-white" // Inactive page style
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* -------------------------
            Next Page Button
        ------------------------- */}
      <button
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} // Go to next page, max = totalPages
        disabled={currentPage === totalPages} // Disable if on last page
        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
          currentPage === totalPages
            ? "bg-gray-800/50 text-gray-500 cursor-not-allowed" // Disabled styling
            : "bg-gray-900/50 text-white hover:bg-gray-700/50" // Active styling
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
