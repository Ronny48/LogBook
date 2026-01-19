import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function VisitDetailsPopup({ visitId, onClose }) {
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisitDetails = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/visits/${visitId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch visit details");
        const data = await res.json();
        setVisit(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitDetails();
  }, [visitId]);

  if (loading)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#0f172a] rounded-2xl p-6 text-white max-w-2xl w-full mx-4">
          <p>Loading details...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#0f172a] rounded-2xl p-6 text-white max-w-2xl w-full mx-4">
          <p className="text-red-500">Error: {error}</p>
          <button
            onClick={onClose}
            className="mt-4 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );

  if (!visit)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#0f172a] rounded-2xl p-6 text-white max-w-2xl w-full mx-4">
          <p>No visit found</p>
          <button
            onClick={onClose}
            className="mt-4 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f172a] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#0f172a] border-b border-[#1f2937] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Visit Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Visitor Info */}
          <div className="bg-[#0b1220] border border-[#1f2937] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Visitor Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Name</p>
                <p className="text-white font-medium">{visit.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Telephone</p>
                <p className="text-white font-medium">{visit.telephone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Purpose</p>
                <p className="text-white font-medium">{visit.purpose}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    visit.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : visit.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {visit.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Current Location</p>
                <p className="text-white font-medium">
                  {visit.current_destination || "Reception"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Created At</p>
                <p className="text-white font-medium">
                  {new Date(visit.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Journey History */}
          {visit.history && visit.history.length > 0 && (
            <div className="bg-[#0b1220] border border-[#1f2937] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Journey History
              </h3>
              <div className="space-y-3">
                {visit.history.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 pb-3 border-b border-[#1f2937] last:border-b-0"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-[#00a261] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <p className="text-white">
                        <span className="font-semibold">
                          {entry.from_destination || "Reception"}
                        </span>
                        {" → "}
                        <span className="font-semibold">
                          {entry.to_destination || "Completed"}
                        </span>
                      </p>
                      <p className="text-sm text-gray-400">
                        Received by: {entry.received_by}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#0b1220] border-t border-[#1f2937] p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
