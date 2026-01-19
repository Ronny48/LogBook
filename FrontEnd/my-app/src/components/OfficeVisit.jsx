import { useEffect, useState } from "react";
import {
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  X,
  Package,
} from "lucide-react";

// Accept searchTerm and statusFilter as props
export default function OfficeVisit({ searchTerm = "", statusFilter = "" }) {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [receivedBy, setReceivedBy] = useState("");
  const [redirectDestination, setRedirectDestination] = useState("");

  // Fetch visits for this office
  // UNUSED: 'office' variable set but never used
  const office = localStorage.getItem("office") || "Office A";
  const [destinations, setDestinations] = useState([]);

  const fetchVisits = async () => {
    try {
      const token = sessionStorage.getItem("token");
      // Optionally add query params for status, limit, offset if needed
      const res = await fetch(`http://localhost:3000/visits/office`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setVisits(data.data || []);
    } catch (err) {
      alert("Failed to fetch visits", err);
    } finally {
      setLoading(false);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const token = sessionStorage.getItem("token");

  // UNUSED FUNCTION: redirectVisit() - defined but never called in component
  async function redirectVisit(visitId, newDestinationId) {
    const res = await fetch(`${API_URL}/visits/${visitId}/receive`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        receivedBy: receivedBy.trim(), // match backend column
        nextDestination: Number(newDestinationId),
      }),
    });
    console.log(receivedBy);

    if (!res.ok) throw new Error("Failed to redirect");
    return res.json(); // optional: contains your { message: "updated" }
  }

  useEffect(() => {
    fetchVisits();
  }, [office]); // UNUSED: 'office' is in dependency array but not actively used in effect

  const handleReceive = (visit) => {
    setSelectedVisit(visit);
    setShowReceiveModal(true);
  };

  const handleRedirect = (visit) => {
    setSelectedVisit(visit);
    setShowRedirectModal(true);
  };

  // PATCH to backend to complete a visit
  const handleCompleteVisit = async () => {
    if (!receivedBy.trim()) return;
    try {
      const token = sessionStorage.getItem("token");
      await fetch(`http://localhost:3000/visits/${selectedVisit.id}/receive`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receivedBy }),
      });
      setShowReceiveModal(false);
      setSelectedVisit(null);
      setReceivedBy("");
      fetchVisits();
    } catch (err) {
      alert("Failed to complete visit", err);
    }
  };

  // PATCH to backend to redirect a visit

  const handleCancel = () => {
    setShowReceiveModal(false);
    setShowRedirectModal(false);
    setSelectedVisit(null);
    setReceivedBy("");
    setRedirectDestination("");
  };

  // Map backend data to UI fields
  const mappedVisits = visits.map((visit) => ({
    id: visit.id,
    name: visit.name,
    purpose: visit.purpose,
    location: visit.current_destination || "",
    arrivalTime: visit.created_at ? visit.created_at.split(" ")[1] : "",
    status: visit.status,
    type:
      visit.purpose && visit.purpose.toLowerCase().includes("package")
        ? "letter"
        : "person",
    handledBy: visit.handledBy,
  }));

  // Filter by search term and status
  const filteredVisits = mappedVisits.filter((visit) => {
    const matchesSearch =
      visit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? visit.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const pendingVisits = filteredVisits.filter(
    (visit) => visit.status === "pending"
  );
  // UNUSED: completedVisits - filtered but never rendered in JSX
  const completedVisits = filteredVisits.filter(
    (visit) => visit.status === "completed"
  );
  // UNUSED: redirectedVisits - filtered but never rendered in JSX
  const redirectedVisits = filteredVisits.filter(
    (visit) => visit.status === "redirected"
  );

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    fetch("http://localhost:3000/destinations", {
      headers: { Authorization: `Bearer ${token}` }, // if you protect it
    })
      .then((res) => res.json())
      .then((result) => {
        setDestinations(result.data || []);
      })
      .catch((err) => console.error("Failed to load destinations", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#0e1d3f] rounded-2xl p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">All Visits</h1>
          <p className="text-gray-200">
            Monitor the status of all registered visits and letters
          </p>
        </div>
        {loading && (
          <div className="text-center text-gray-200 py-8">
            Loading visits...
          </div>
        )}
        {/* Show message if no visits match search/filter */}
        {!loading && filteredVisits.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No visits found matching your search/filter.
          </div>
        )}

        {/* Status Tabs - UNUSED: Tab button exists but has no onClick or tab switching logic */}
        <div className="flex mb-6 border-b border-gray-200">
          <button className="px-4 py-2 font-medium text-gray-200 border-b-2 ">
            All Visits
          </button>
        </div>

        {/* Visits List */}
        <div className="space-y-4">
          {/* Pending Visits */}
          {pendingVisits.map((visit) => (
            <div
              key={visit.id}
              className="bg-[#0b1220] rounded-lg shadow-sm border bordr-[#0b1220] p-6"
            >
              <div className="flex items-center justify-between">
                {/* Left side - Visitor info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        visit.type === "letter"
                          ? "bg-purple-100"
                          : "bg-blue-100"
                      }`}
                    >
                      {visit.type === "letter" ? (
                        <Package className="w-5 h-5 text-purple-600" />
                      ) : (
                        <User className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-100">
                        {visit.name}{" "}
                        <span className="text-sm font-normal text-gray-200">
                          (
                          {visit.status.charAt(0).toUpperCase() +
                            visit.status.slice(1)}
                          )
                        </span>
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </span>
                        <span className="text-sm text-gray-200">
                          ID: {visit.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-3 font-medium">
                    {visit.purpose}
                  </p>

                  <div className="flex flex-col gap-2 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-300" />
                      <span className="text-gray-300">
                        Current: {visit.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-300" />
                      <span className="text-gray-300">
                        Arrived: {visit.arrivalTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side - Action buttons */}
                <div className="flex flex-col gap-3 ml-6">
                  <button
                    onClick={() => handleReceive(visit)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Receive
                  </button>
                  <button
                    onClick={() => handleRedirect(visit)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <XCircle className="w-4 h-4" />
                    Redirect
                  </button>
                </div>
              </div>

              {/* Time indicator */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span>Waiting for action</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Receive Visit Modal */}
        {showReceiveModal && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0e1d3f] rounded-lg shadow-xl max-w-md w-full">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-white">
                  Receive Visit
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-100" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <p className="text-gray-200 text-sm mb-6">
                  Mark this visit as completed and received.
                </p>

                {/* Visitor Info */}
                <div className="bg-[#0b1220] rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-100 text-lg mb-1">
                    {selectedVisit?.name}
                  </h4>
                  <p className="text-gray-200 text-sm">
                    {selectedVisit?.purpose}
                  </p>
                </div>

                {/* Received By Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Received By
                  </label>
                  <input
                    type="text"
                    value={receivedBy}
                    onChange={(e) => setReceivedBy(e.target.value)}
                    placeholder="Your name"
                    className="w-full text-white placeholder:text-gray-500 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCompleteVisit}
                    disabled={!receivedBy.trim()}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:text-black disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Complete Visit
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Redirect Visit Modal */}
        {showRedirectModal && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0e1d3f]   rounded-lg shadow-xl max-w-md w-full">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-white">
                  Redirect Visit
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-100" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <p className="text-gray-200 text-sm mb-6">
                  Redirect this visit to another department.
                </p>

                {/* Visitor Info */}
                <div className="bg-[#0b1220] rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-100 text-lg mb-1">
                    {selectedVisit?.name}
                  </h4>
                  <p className="text-gray-200 text-sm">
                    {selectedVisit?.purpose}
                  </p>
                </div>

                {/* Received By Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-100 mb-2">
                    Received By
                  </label>
                  <input
                    type="text"
                    value={receivedBy}
                    onChange={(e) => setReceivedBy(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3 py-2 bg-[#0b1220] text-white placeholder:text-gray-500 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Redirect To Dropdown */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-100 mb-2">
                    Redirect To
                  </label>

                  <select
                    className="w-full p-3 rounded-md border text-gray-300 bg-[#0b1220]"
                    value={redirectDestination}
                    onChange={(e) => setRedirectDestination(e.target.value)}
                    required
                  >
                    <option value="">Select destination</option>
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      redirectVisit(selectedVisit.id, redirectDestination)
                        .then(() => {
                          // ✅ close the modal
                          setShowRedirectModal(false);
                          // reset form fields
                          setSelectedVisit(null);
                          setReceivedBy("");
                          setRedirectDestination("");
                          // refresh list
                          fetchVisits();
                        })
                        .catch((err) => alert("Failed to redirect visit", err));
                    }}
                    disabled={!receivedBy.trim() || !redirectDestination.trim()}
                    className="flex-1 bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:text-black disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Redirect Visit
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats footer */}
        {filteredVisits.length > 0 && (
          <div className="mt-8 bg-[#0b1220] rounded-lg shadow-sm border border-[#0b1220] p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-200">
                Total visits:{" "}
                <span className="font-semibold text-gray-300">
                  {filteredVisits.length}
                </span>
                <span className="mx-2">•</span>
                Pending:{" "}
                <span className="font-semibold text-yellow-600">
                  {pendingVisits.length}
                </span>
                <span className="mx-2">•</span>
                Completed:{" "}
                <span className="font-semibold text-green-600">
                  {completedVisits.length}
                </span>
                <span className="mx-2">•</span>
                Redirected:{" "}
                <span className="font-semibold text-blue-600">
                  {redirectedVisits.length}
                </span>
              </span>
              <span className="text-gray-300">Last updated: just now</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
