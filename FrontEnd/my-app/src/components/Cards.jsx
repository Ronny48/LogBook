import { FaUsers, FaClock, FaCheckCircle } from "react-icons/fa";

const Cards = ({ stats }) => (
  <div className="flex flex-row gap-6 w-full items-center">
    {/* Total */}
    <Card
      title="Total Visits"
      value={stats.total}
      subtitle="Today"
      icon={<FaUsers className="text-gray-200 text-2xl" />}
    />
    {/* Pending */}
    <Card
      title="Pending"
      value={stats.pending}
      subtitle="Awaiting receipt"
      valueClass="text-orange-500"
      icon={<FaClock className="text-orange-400 text-2xl" />}
    />
    {/* Completed */}
    <Card
      title="Completed"
      value={stats.completed}
      subtitle="Successfully received"
      valueClass="text-green-600"
      icon={<FaCheckCircle className="text-green-500 text-2xl" />}
    />
  </div>
);

const Card = ({ title, value, subtitle, icon, valueClass }) => (
  <div className="flex justify-between items-center bg-[#0e1d3f] rounded-xl shadow p-6 w-full max-w-5xl">
    <div>
      <div className="text-gray-200 font-semibold">{title}</div>
      <div className={`text-2xl font-bold mt-2 ${valueClass || "text-white"}`}>
        {value}
      </div>
      <div className="text-sm text-gray-300 mt-1">{subtitle}</div>
    </div>
    {icon}
  </div>
);

export default Cards;
