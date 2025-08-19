import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaUserTie,
  FaClipboardList,
  FaBookOpen,
  FaComments,
  FaChalkboardTeacher,
  FaMoneyCheck,
  FaStar,
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import Loading from "../../../Components/Loading";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTutors: 0,
    totalSessions: 0,
    totalBookings: 0,
    totalReviews: 0,
    totalNotes: 0,
    totalMaterials: 0,
    totalRevenue: 0,
    averageRating: 0,
  });

  const [tutorSessions, setTutorSessions] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/dashboard/admin-overview");

        setStats({
          totalUsers: res.data.totalUsers || 0,
          totalTutors: res.data.totalTutors || 0,
          totalSessions: res.data.totalSessions || 0,
          totalBookings: res.data.totalBookings || 0,
          totalReviews: res.data.totalReviews || 0,
          totalNotes: res.data.totalNotes || 0,
          totalMaterials: res.data.totalMaterials || 0,
          totalRevenue: res.data.totalRevenue || 0,
          averageRating: res.data.averageRating || 0,
        });

        setTutorSessions(res.data.sessionBookingCount || {});
        setLoading(false);
      } catch (err) {
        console.error("Admin dashboard fetch failed", err);
        setLoading(false);
      }
    };

    fetchStats();
  }, [axiosSecure]);

  if (loading) return <Loading />;

  const sessionLabels = Object.keys(tutorSessions);
  const sessionValues = Object.values(tutorSessions);

  const pieData = {
    labels: sessionLabels.length ? sessionLabels : ["No Data"],
    datasets: [
      {
        data: sessionValues.length ? sessionValues : [1],
        backgroundColor: ["primary", "secondary", "accent", "info", "warning"].map(
          (color) => `var(--${color})`
        ),
      },
    ],
  };

  const barData = {
    labels: sessionLabels.length ? sessionLabels : ["No Data"],
    datasets: [
      {
        label: "Bookings per Session",
        data: sessionValues.length ? sessionValues : [0],
        backgroundColor: "var(--primary)",
      },
    ],
  };

  const statsData = [
    { icon: <FaUsers className="text-2xl" />, title: "Total Users", value: stats.totalUsers, color: "primary" },
    { icon: <FaUserTie className="text-2xl" />, title: "Total Tutors", value: stats.totalTutors, color: "secondary" },
    { icon: <FaClipboardList className="text-2xl" />, title: "Total Bookings", value: stats.totalBookings, color: "accent" },
    { icon: <FaBookOpen className="text-2xl" />, title: "Total Sessions", value: stats.totalSessions, color: "info" },
    { icon: <FaComments className="text-2xl" />, title: "Total Reviews", value: stats.totalReviews, color: "success" },
    { icon: <FaChalkboardTeacher className="text-2xl" />, title: "Total Materials", value: stats.totalMaterials, color: "warning" },
    { icon: <FaMoneyCheck className="text-2xl" />, title: "Total Revenue", value: `৳${stats.totalRevenue}`, color: "primary" },
    { icon: <FaStar className="text-2xl" />, title: "Average Rating", value: stats.averageRating, color: "warning" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-10">Admin Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statsData.map((stat, idx) => (
          <div key={idx} className="card bg-base-100 shadow p-4">
            <div className={`text-${stat.color}`}>{stat.icon}</div>
            <h4 className="font-bold text-lg">{stat.title}</h4>
            <p className="text-3xl">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      {sessionLabels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="card bg-base-100 shadow p-4">
            <h4 className="font-bold text-lg mb-2">Bookings Per Session (Bar)</h4>
            <div style={{ height: 300 }}>
              <Bar data={barData} options={{ responsive: true }} />
            </div>
          </div>

          <div className="card bg-base-100 shadow p-4">
            <h4 className="font-bold text-lg mb-2">Session Booking Share (Pie)</h4>
            <div style={{ height: 300 }}>
              <Pie data={pieData} options={{ responsive: true }} />
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No session booking data available</p>
      )}
    </div>
  );
};

export default AdminDashboard;
