import "./App.css";
import Dashboard from "./pages/Dashboard";
import LogIn from "./pages/LogIn";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoutes";

import { Routes, Route } from "react-router-dom";
import Dashboard_Office from "./pages/Dashboard_Office";
import OfficeRoute from "./components/OfficeRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard_office"
        element={
          <OfficeRoute>
            <Dashboard_Office />
          </OfficeRoute>
        }
      />
      <Route path="/unauthorized" element={<Unauthorized />} />{" "}
      {/* new route */}
    </Routes>
  );
}

export default App;
