import { FaPlus } from "react-icons/fa";
const ReceptionBtn = ({ onClick }) => {
  return (
    <div>
      <button
        onClick={onClick}
        className="flex items-center gap-1 bg-green-800 rounded-2xl px-4 py-2 hover:bg-green-700 border border-[#112a62] "
      >
        <FaPlus className="text-white" />
        <span className="font-semibold text-sm text-gray-200">New Visit</span>
      </button>
    </div>
  );
};

export default ReceptionBtn;
