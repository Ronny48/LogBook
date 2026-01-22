import { useState } from "react";
import { useEffect } from "react";

const AddVisit = ({ onClose }) => {
  const [name, setName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [destination, setDestination] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [purpose, setPurpose] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem("token");

      const res = await fetch(`${API_URL}/visits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          purpose,
          telephone,
          // backend expects this key
          initialDestination: destination || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Server error:", err);
        alert(err.error || "Failed to create visit");
        return;
      }

      const data = await res.json();
      console.log("Visit created with ID:", data.id);
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error—please try again.");
    }

    // ✅ close the modal only when the POST worke
    onClose?.();

    // reset form fields
    setName("");
    setTelephone("");
    setDestination("");
    setPurpose("");
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    fetch(`${API_URL}/destinations`, {
      headers: { Authorization: `Bearer ${token}` }, // if you protect it
    })
      .then((res) => res.json())
      .then((result) => {
        setDestinations(result.data || []);
      })
      .catch((err) => console.error("Failed to load destinations", err));
  }, []);

  // ✅ all fields must have something to enable the button
  const isValid = name.trim() && destination.trim() && purpose.trim();

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0e1d3f] rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl text-white font-bold mb-1">Add New Visit</h2>
        <p className="mb-6 text-gray-300">
          Register a new visitor or letter in the system
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex-1">
              <label className="block mb-1 text-white font-medium">
                Visitor/Letter Name
              </label>
              <input
                type="text"
                className="w-full p-3 rounded-md placeholder:text-gray-500 border bg-[#0b1220] text-white"
                placeholder="Lesley Asare"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex-1">
              <label className="block mb-1 text-white font-medium">
                Telephone
              </label>
              <input
                type="tel"
                className="w-full p-3 rounded-md placeholder:text-gray-500 border bg-[#0b1220] text-white"
                placeholder="eg. 054XXXXXXX"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                pattern="[0-9]{10,}" // ✅ at least 10 digits
                minLength={10}
                required
              />
            </div>

            <div className="flex-1">
              <label className="block mb-1 text-white font-medium">
                Initial Destination
              </label>
              <select
                className="w-full p-3 rounded-md border text-gray-300 bg-[#0b1220]"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
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
          </div>

          <div className="mb-6">
            <label className="block mb-1 text-white font-medium">
              Purpose of Visit
            </label>
            <textarea
              className="w-full p-3 rounded-md border placeholder:text-gray-500 bg-[#0b1220] text-white"
              placeholder="Meeting with CEO, Letter delivery, etc."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!isValid} // 👈 disable until all fields filled
              className="flex-1 bg-green-800 text-white px-6 py-2 rounded-md font-semibold shadow hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Visit
            </button>
            <button
              type="button"
              className="flex-1 bg-gray-200 px-6 py-2 rounded-md font-semibold"
              onClick={() => {
                setName("");
                setDestination("");
                setPurpose("");
                onClose?.();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVisit;
