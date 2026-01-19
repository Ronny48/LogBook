// src/components/AllVisits.jsx
import { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import Search from "./Search";
import VisitDetailsPopup from "./VisitDetailsPopup";

const statusStyles = {
  pending: {
    statusColor: "bg-yellow-100 text-yellow-700",
    statusBorder: "border-yellow-300",
  },
  completed: {
    statusColor: "bg-green-100 text-[#0f172a]",
    statusBorder: "border-green-300",
  },
  redirected: {
    statusColor: "bg-blue-100 text-blue-700",
    statusBorder: "border-blue-300",
  },
  default: {
    statusColor: "bg-gray-100 text-gray-700",
    statusBorder: "border-gray-300",
  },
};

export default function AllVisits({ searchQuery }) {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedVisitId, setSelectedVisitId] = useState(null);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch("http://localhost:3000/visits", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch visits");
        const json = await res.json();

        const mapped = json.data.map((v) => {
          const lower = v.status?.toLowerCase() ?? "default";
          const { statusColor, statusBorder } =
            statusStyles[lower] || statusStyles.default;

          return {
            id: v.id,
            name: v.name,
            status: v.status,
            statusColor,
            statusBorder,
            description: v.purpose,
            location: v.current_destination || "Reception",
            timeLabel: "Updated",
            time: new Date(v.updated_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            handledBy: v.received_by ?? null,
          };
        });

        setVisits(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, [searchQuery]);

  // UNUSED FUNCTION: handleFilterClick() - defined but never used (passed to Search but not called)
  const handleFilterClick = () => {
    console.log("Advanced Filters clicked");
  };

  const filtered = visits.filter((v) => {
    const matchesQuery = `${v.name} ${v.description}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesStatus =
      statusFilter === "" || v.status?.toLowerCase() === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="flex flex-col items-center w-full">
      <Search
        onChange={setQuery}
        onFilterClick={handleFilterClick}
        onStatusChange={setStatusFilter}
      />

      <div className="bg-[#0e1d3f] rounded-xl shadow p-6 w-full max-w-5xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">All Visits</h2>
          <p className="text-[#94a3b8] text-sm mt-1">
            Monitor the status of all registered visits and letters
          </p>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading visits…</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400">No visits match "{query}".</p>
        ) : (
          <div className="flex flex-col gap-6">
            {filtered.map((visit) => (
              <div
                key={visit.id}
                onClick={() => setSelectedVisitId(visit.id)}
                className="flex justify-between items-start bg-[#0b1220] border border-[#1f2937] rounded-lg p-4 cursor-pointer hover:border-[#00a261] hover:bg-[#0d1829] transition-all"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-lg text-white">
                      {visit.name}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${visit.statusColor} border ${visit.statusBorder}`}
                    >
                      {visit.status}
                    </span>
                  </div>
                  <div className="text-gray-200 text-sm pt-2 mb-1">
                    {visit.description}
                  </div>
                  <div className="flex flex-col gap-0.5 text-gray-400 mt-2">
                    <div>
                      <span className="mr-1">📍</span>
                      Current: {visit.location}
                    </div>
                    <div>
                      <span className="mr-1">⏰</span>
                      {visit.timeLabel}: {visit.time}
                    </div>
                    {visit.handledBy && (
                      <div>
                        Handled by:{" "}
                        <span className="font-medium">{visit.handledBy}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 min-w-[60px]">
                  <span className="text-xs font-semibold text-gray-400 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 mb-2">
                    ID: {visit.id}
                  </span>
                  <FaClock className="text-gray-400 text-lg" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedVisitId && (
        <VisitDetailsPopup
          visitId={selectedVisitId}
          onClose={() => setSelectedVisitId(null)}
        />
      )}
    </div>
  );
}
