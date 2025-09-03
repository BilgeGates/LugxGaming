import { Grid3X3, List } from "lucide-react";

// Controls component: responsible for sorting games and toggling view mode (grid/list)
const Controls = ({ viewMode, setViewMode }) => {
  return (
    <div className="mb-8 ">
      {/* Container: Flex to space sort dropdown and view mode buttons apart */}
      <div className="flex justify-between items-center ">
        {/* -------------------------
            View Mode Toggle Buttons
        ------------------------- */}
        <div className="flex gap-1 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-1">
          {/* Grid View Button */}
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-all duration-300 ${
              viewMode === "grid"
                ? "bg-purple-600 text-white shadow-lg shadow-cyan-500/25"
                : "text-white hover:bg-gray-800/50"
            }`}
          >
            <Grid3X3 className="w-5 h-5" />
          </button>

          {/* List View Button */}
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-all duration-300 ${
              viewMode === "list"
                ? "bg-purple-600 text-white shadow-lg shadow-cyan-500/25"
                : "text-white hover:bg-gray-800/50"
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
