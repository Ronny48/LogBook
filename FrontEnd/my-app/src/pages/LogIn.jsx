// Login.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

const LogIn = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      sessionStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user?.role === "admin") {
        navigate("/dashboard");
      } else if (data.user?.role === "staff") {
        navigate("/dashboard_office");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="
        w-screen h-screen
        flex items-center justify-center
        bg-gray-100 p-4
      "
    >
      <div
        className="
          w-full max-w-2xl          /* center card, limit width for readability */
          bg-[#0f172a] rounded-2xl shadow-2xl
          flex flex-col
        "
      >
        {/* Logo */}
        <div className="flex justify-center items-center p-6">
          <img src={logo} alt="login" className="max-h-24 object-contain" />
        </div>

        {/* Heading */}
        <div className="flex flex-col items-center gap-2 px-6 text-center">
          <h1 className="text-white text-2xl font-bold">
            Visitor & Letter Tracking
          </h1>
          <p className="text-[#94a3b8]">
            Login, create visits, and view current visits.
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-6 flex-1 flex flex-col justify-center">
          <fieldset>
            <legend className="text-white font-bold text-lg mb-4">
              Log In
            </legend>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block mb-2 font-semibold text-white">
                  Username
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Admin"
                  className="
                    w-full px-3 py-3 rounded-lg
                    border border-[#1f2937] bg-[#0b1220] text-white
                  "
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-white">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="
                    w-full px-3 py-3 rounded-lg
                    border border-[#1f2937] bg-[#0b1220] text-white
                  "
                  required
                />
              </div>

              {error && <p className="text-red-500 text-center">{error}</p>}

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="
                    px-6 py-3 rounded-lg
                    bg-[#00a261] text-white font-semibold
                    hover:bg-[#116544] transition-colors
                  "
                >
                  Login
                </button>
              </div>
            </form>
          </fieldset>
        </div>
      </div>
      <div className="pl-2">
        <div className=" bg-[#0f172a] p-4 rounded-2xl text-gray-200">
          <h1 className="text-3xl font-bold p-3">For Testing Log-Ins.</h1>
          <ul>
            <div className="px-2 pb-2.5">
              <p className="font-bold text-2xl">Receptionist Page</p>
              <li>UserName: admin2 - Password: admin123</li>
            </div>
            <div className="px-2 pb-2.5">
              <p className="font-bold text-2xl">Office Pages</p>
              <li>UserName: officeA - Password: securet123</li>
              <li>UserName: officeB - Password: securet123</li>
              <li>UserName: Accounts - Password: securet123</li>
              <li>UserName: HR - Password: securet123</li>
            </div>
          </ul>
          <p className=" text-white ">
            Hint: Click on "Office Dashboard/Receptionist Desk" on the Navbar to{" "}
            <span className="font-bold">Logout</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
