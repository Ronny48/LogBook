// src/components/Search.jsx
import { FaSearch } from "react-icons/fa";
// UNUSED IMPORT: FaFilter icon - imported but never used
// import { FaFilter } from "react-icons/fa";

export default function Search({ onChange, onStatusChange, onFilterClick }) {
  // UNUSED PROP: onFilterClick - passed in but never used in component
  return (
    <div className="flex justify-center py-[20px] w-full">
      <div className="flex items-center bg-[#0e1d3f] rounded-xl shadow p-4 w-full max-w-5xl gap-4 flex-wrap">
        <div className="flex items-center bg-[#0b1220] rounded-md px-3 py-2 flex-1 min-w-[250px]">
          <FaSearch className="text-gray-300 mr-2" />
          <input
            type="text"
            placeholder="Search visits by name or purpose..."
            className="bg-transparent outline-none w-full text-gray-400"
            onChange={(e) => onChange(e.target.value)}
          />
        </div>

        <select
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-[#0b1220] text-gray-200 border border-gray-600 rounded-md px-4 py-2 text-sm hover:bg-[#112a62]"
        >
          <option value="">Advanced Filters</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="redirected">Redirected</option>
        </select>
      </div>
    </div>
  );
}
