import { Grid3X3, List, ArrowUpDown } from "lucide-react"; // UI icons

// Controls component: responsible for sorting games and toggling view mode (grid/list)
const Controls = ({ sortBy, handleSortChange, viewMode, setViewMode }) => {
  return (
    <div className="mb-8">
      {/* Container: Flex to space sort dropdown and view mode buttons apart */}
      <div className="flex justify-between items-center">
        {/* -------------------------
            Sort Dropdown
        ------------------------- */}
        <div className="relative">
          <select
            value={sortBy} // Current selected sort option
            onChange={(e) => handleSortChange(e.target.value)} // Call parent handler on change
            className="appearance-none bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-2 pr-10 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
          >
            {/* Options for sorting */}
            <option value="popularity">Most Popular</option>
            <option value="relevance">Most Relevant</option>
            <option value="rating">Rating</option>
            <option value="released">Release Date</option>
            <option value="metacritic">Metacritic Score</option>
            <option value="name">A-Z</option>
          </select>

          {/* Sort icon overlayed inside the select */}
          <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* -------------------------
            View Mode Toggle Buttons
        ------------------------- */}
        <div className="flex bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-1">
          {/* Grid View Button */}
          <button
            onClick={() => setViewMode("grid")} // Switch to grid mode
            className={`p-2 rounded-md transition-all duration-300 ${
              viewMode === "grid"
                ? "bg-cyan-500 text-white shadow-lg" // Active styling
                : "text-gray-400 hover:text-white hover:bg-gray-800/50" // Inactive styling
            }`}
          >
            <Grid3X3 className="w-4 h-4" /> {/* Grid icon */}
          </button>

          {/* List View Button */}
          <button
            onClick={() => setViewMode("list")} // Switch to list mode
            className={`p-2 rounded-md transition-all duration-300 ${
              viewMode === "list"
                ? "bg-cyan-500 text-white shadow-lg" // Active styling
                : "text-gray-400 hover:text-white hover:bg-gray-800/50" // Inactive styling
            }`}
          >
            <List className="w-4 h-4" /> {/* List icon */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
