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
  const [loading, setLoading] = useState(false)

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
        setLoading(true)
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
        setLoading(false)
      } catch (err) {
        console.error("Admin dashboard fetch failed", err);
      }
    };

    fetchStats();
  }, [axiosSecure]);
  if(loading)return <Loading></Loading>

  // Prepare chart data with fallback to avoid empty charts
  const sessionLabels = Object.keys(tutorSessions);
  const sessionValues = Object.values(tutorSessions);
 
  const pieData = {
    labels: sessionLabels.length ? sessionLabels : ["No Data"],
    datasets: [
      {
        data: sessionValues.length ? sessionValues : [1],
        backgroundColor: ["#60a5fa", "#f87171", "#34d399", "#fbbf24", "#a78bfa"],
      },
    ],
  };

  const barData = {
    labels: sessionLabels.length ? sessionLabels : ["No Data"],
    datasets: [
      {
        label: "Bookings per Session",
        data: sessionValues.length ? sessionValues : [0],
        backgroundColor: "#4f46e5",
      },
    ],
  };

  return (
    <div className="w-full bg-base-300 mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-primary text-center mb-10">
        Admin Dashboard Overview
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="card bg-base-100 shadow p-4">
          <FaUsers className="text-2xl text-primary" />
          <h4 className="font-bold text-lg">Total Users</h4>
          <p className="text-3xl">{stats.totalUsers}</p>
        </div>
        <div className="card bg-base-100 shadow p-4">
          <FaUserTie className="text-2xl text-secondary" />
          <h4 className="font-bold text-lg">Total Tutors</h4>
          <p className="text-3xl">{stats.totalTutors}</p>
        </div>
        <div className="card bg-base-100 shadow p-4">
          <FaClipboardList className="text-2xl text-accent" />
          <h4 className="font-bold text-lg">Total Bookings</h4>
          <p className="text-3xl">{stats.totalBookings}</p>
        </div>
        <div className="card bg-base-100 shadow p-4">
          <FaBookOpen className="text-2xl text-info" />
          <h4 className="font-bold text-lg">Total Sessions</h4>
          <p className="text-3xl">{stats.totalSessions}</p>
        </div>
        <div className="card bg-base-100 shadow p-4">
          <FaComments className="text-2xl text-success" />
          <h4 className="font-bold text-lg">Total Reviews</h4>
          <p className="text-3xl">{stats.totalReviews}</p>
        </div>
        <div className="card bg-base-100 shadow p-4">
          <FaChalkboardTeacher className="text-2xl text-warning" />
          <h4 className="font-bold text-lg">Total Materials</h4>
          <p className="text-3xl">{stats.totalMaterials}</p>
        </div>
        <div className="card bg-base-100 shadow p-4">
          <FaMoneyCheck className="text-2xl text-pink-600" />
          <h4 className="font-bold text-lg">Total Revenue</h4>
          <p className="text-3xl">৳{stats.totalRevenue}</p>
        </div>
        <div className="card bg-base-100 shadow p-4">
          <FaStar className="text-2xl text-yellow-400" />
          <h4 className="font-bold text-lg">Average Rating</h4>
          <p className="text-3xl">{stats.averageRating}</p>
        </div>
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