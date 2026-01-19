// OfficeRoute.jsx
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // or your own decode

export default function OfficeRoute({ children }) {
  const token = sessionStorage.getItem("token");
  if (!token) return <Navigate to="/unauthorized" replace />;

  try {
    const { role } = jwtDecode(token);
    if (role === "staff") {
      return children;
    }
  } catch (err) {
    console.error("Bad Token", err);
  }

  // If role/office doesn't match, boot them out
  return <Navigate to="/unauthorized" replace />;
}
