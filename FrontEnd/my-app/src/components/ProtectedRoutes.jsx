// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem("token"); // must exist AND be valid
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}
