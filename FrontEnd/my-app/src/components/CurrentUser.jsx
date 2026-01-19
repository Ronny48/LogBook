// UNUSED IMPORT: ReceptionBtn - imported but not used in this component
import ReceptionBtn from "./ReceptionBtn";
// UNUSED IMPORT: useState - commented out and never used
// import { useState } from "react";

const CurrentUser = ({ Dash, text, control }) => {
  // UNUSED CODE: useState hook - never used in component
  // const [showAddVisit, setShowAddVisit] = useState(false);

  return (
    <div className="flex justify-center pb-[12px] w-full">
      <div className="bg-[#0f172a] flex gap-80 md:gap-110 lg:gap-130">
        <div>
          <div className="font-[700] text-white text-2xl">{Dash}</div>
          <div className="text-gray-400">{text}</div>
        </div>
        <div>{control}</div>
        {/* UNUSED CODE: commented JSX for Popup component - no longer used */}
        {/* {showAddVisit && <Popup onClose={() => setShowAddVisit(false)} />} */}
      </div>
    </div>
  );
};

export default CurrentUser;
