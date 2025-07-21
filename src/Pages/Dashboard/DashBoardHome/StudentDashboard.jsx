// ✅ FRONTEND: StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  FaBookOpen,
  FaComments,
  FaStickyNote,
  FaFileAlt,
  FaMoneyCheckAlt,
  FaStar,
} from "react-icons/fa";
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
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";


ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const StudentDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalBookedSessions: 0,
    totalReviews: 0,
    totalNotes: 0,
    totalMaterials: 0,
    totalSpent: 0,
    averageRating: 0,
  });

  const [bookingData, setBookingData] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosSecure.get(`/dashboard/student-overview?email=${user.email}`);
        setStats(res.data);
        setBookingData(res.data.sessionBookingCount || {});
      } catch (err) {
        console.error("Student dashboard fetch failed", err);
      }
    };

    if (user?.email) fetchStats();
  }, [user?.email, axiosSecure]);

  const pieData = {
    labels: Object.keys(bookingData),
    datasets: [
      {
        data: Object.values(bookingData),
        backgroundColor: ["#60a5fa", "#f87171", "#34d399", "#fbbf24", "#a78bfa"],
      },
    ],
  };

  const barData = {
    labels: Object.keys(bookingData),
    datasets: [
      {
        label: "Bookings",
        data: Object.values(bookingData),
        backgroundColor: "#4f46e5",
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-primary text-center mb-10">
        Student Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="card bg-base-100 shadow p-4">
          <FaBookOpen className="text-2xl text-info" />
          <h4 className="font-bold text-lg">Booked Sessions</h4>
          <p className="text-3xl">{stats.totalBookedSessions}</p>
        </div>
        <div className="card bg-base-100 shadow p-4">
          <FaComments className="text-2xl text-success" />
          <h4 className="font-bold text-lg">Total Reviews</h4>
          <p className="text-3xl">{stats.totalReviews}</p>
        </div>
        <div className="card bg-base-100 shadow p-4">
          <FaStickyNote className="text-2xl text-yellow-500" />
          <h4 className="font-bold text-lg">Total Notes</h4>
          <p className="text-3xl">{stats.totalNotes}</p>
        </div>
        <div className="card bg-base-100 shadow p-4">
          <FaFileAlt className="text-2xl text-warning" />
          <h4 className="font-bold text-lg">Total Materials</h4>
          <p className="text-3xl">{stats.totalMaterials}</p>
        </div>
        <div className="card bg-base-100 shadow p-4">
          <FaMoneyCheckAlt className="text-2xl text-pink-600" />
          <h4 className="font-bold text-lg">Total Spent</h4>
          <p className="text-3xl">৳{stats.totalSpent}</p>
        </div>
        <div className="card bg-base-100 shadow p-4">
          <FaStar className="text-2xl text-yellow-400" />
          <h4 className="font-bold text-lg">Average Rating</h4>
          <p className="text-3xl">{stats.averageRating}</p>
        </div>
      </div>

      {Object.keys(bookingData).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="card bg-base-100 shadow p-4">
            <h4 className="font-bold text-lg mb-2">Bookings per Session (Bar)</h4>
            <Bar data={barData} options={{ responsive: true }} />
          </div>

          <div className="card bg-base-100 shadow p-4">
            <h4 className="font-bold text-lg mb-2">Session Share (Pie)</h4>
            <Pie data={pieData} options={{ responsive: true }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;