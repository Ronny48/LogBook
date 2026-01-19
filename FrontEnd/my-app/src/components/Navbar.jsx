import { FaUserFriends } from "react-icons/fa";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Navbar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const ok = window.confirm("Do you really want to log out?");
    if (!ok) return; // user clicked Cancel
    sessionStorage.removeItem("token");
    navigate("/");
  };
  return (
    <div className="flex justify-center fixed top-0 w-full">
      <div className="flex items-center justify-between bg-[#0e1d3f] p-2 w-full max-w-[940px]">
        <div className="flex items-center p-1">
          <FaUserFriends className="text-gray-100" />
          <span className="text-[14px] font-[600] text-white ml-2">
            Visitor Tracking
          </span>
        </div>
        <div>
          <img src={Logo} height={70} width={70} alt="Logo" />
        </div>
        <div className="text-right">
          <div
            className="font-[400] text-white text-[12px] cursor-pointer hover:text-red-400"
            role="button"
            tabIndex={0}
            title="Logout"
            aria-label="Logout"
            onClick={handleLogout}
            onKeyDown={(e) => e.key === "Enter" && handleLogout()}
          >
            {role}
          </div>
          <div className="text-[10px] text-gray-400">Active</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
