import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-[#0f172a] rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">
          🚫 Access Denied
        </h1>
        <p className="text-gray-200 mb-6">
          Oops! You don’t have permission to view this page.
        </p>

        <button
          onClick={() => navigate("/")}
          className="inline-block px-6 py-3 rounded-lg bg-[#00a261] text-white font-semibold hover:bg-[#116544] transition-colors"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
