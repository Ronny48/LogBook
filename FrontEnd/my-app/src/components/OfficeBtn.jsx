// OfficeButton.jsx
const OfficeButton = () => {
  // grab whatever you stashed after login
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const office = storedUser.destination_name || "Unknown Office"; // fallback

  return (
    <button className="px-4 py-1 border border-[#2b4b94] rounded-full text-white">
      {office}
    </button>
  );
};

export default OfficeButton;
