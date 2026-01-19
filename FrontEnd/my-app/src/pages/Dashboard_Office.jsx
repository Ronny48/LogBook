import { useEffect, useState } from "react";
import Cards from "../components/Cards";
import CurrentUser from "../components/CurrentUser";
import Navbar from "../components/Navbar";
import OfficeBtn from "../components/OfficeBtn";
import OfficeVisit from "../components/OfficeVisit";
import Search from "../components/Search";

const Dashboard_Office = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const destinationId = storedUser.destination_id || null;
  console.log("Dashboard_Office: destinationId", destinationId);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!destinationId) return;
        const res = await fetch(
          `http://localhost:3000/stats/office?destinationId=${destinationId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to load stats");
        const data = await res.json();
        console.log("Dashboard_Office: stats response", data);
        setStats(data);
      } catch (err) {
        console.error("Stats fetch error:", err);
      }
    };

    fetchStats();
  }, [destinationId]);

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4">
      <div className="bg-[#0f172a] flex min-h-screen flex-col items-center p-4">
        <div className="flex flex-col items-center w-full gap-6">
          <Navbar role="Office Dashboard" />
          <div className="mt-[80px]">
            <CurrentUser
              Dash="Office Dashboard"
              text={`Manage visits assigned to your office`}
              control={<OfficeBtn />}
            />
            <Cards stats={stats} />
            <Search onChange={setSearchTerm} onStatusChange={setStatusFilter} />
            <OfficeVisit searchTerm={searchTerm} statusFilter={statusFilter} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard_Office;
