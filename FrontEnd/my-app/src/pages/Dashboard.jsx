import AddVisit from "../components/AddVisit";
import AllVisits from "../components/AllVisits";
import Cards from "../components/Cards";
import CurrentUser from "../components/CurrentUser";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import ReceptionBtn from "../components/ReceptionBtn";

const Dashboard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`${API_URL}/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Stats fetch error:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4">
      <div className="bg-[#0f172a] flex min-h-screen flex-col items-center p-4">
        <div className="flex flex-col items-center w-full gap-6">
          <Navbar role="Reception Desk" />
          <div className="mt-[80px]">
            <CurrentUser
              Dash="Reception Dashboard"
              text="Track and manage all visitors and letters"
              onOpen={() => setShowPopup(true)}
              control={<ReceptionBtn onClick={() => setShowPopup(true)} />}
            />
            <Cards stats={stats} />
            {showPopup && <AddVisit onClose={() => setShowPopup(false)} />}
            <AllVisits />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
