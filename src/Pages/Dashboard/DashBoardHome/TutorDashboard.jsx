import React, { useEffect, useState } from "react";
import {
  FaBookOpen,
  FaChartBar,
  FaCheckCircle,
  FaStar,
  FaUsers,
  FaChalkboardTeacher,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const TutorDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalSessions: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalReviews: 0,
    averageRating: 0,
    sessionBookingCount: {},
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosSecure.get(
          `/dashboard/tutor-overview?email=${user.email}`
        );
        setStats(res.data || {});
      } catch (err) {
        console.error("Failed to fetch tutor dashboard stats", err);
      }
    };

    if (user?.email) {
      fetchStats();
    }
  }, [user?.email, axiosSecure]);

  const sessionTitles = Object.keys(stats.sessionBookingCount || {});
  const bookingCounts = Object.values(stats.sessionBookingCount || {});

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-primary text-center">
        Tutor Dashboard Overview
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="card bg-base-100 shadow p-4">
          <FaChalkboardTeacher className="text-2xl text-primary" />
          <h4 className="font-bold text-lg">My Sessions</h4>
          <p className="text-3xl">{stats.totalSessions || 0}</p>
        </div>

        <div className="card bg-base-100 shadow p-4">
          <FaUsers className="text-2xl text-primary" />
          <h4 className="font-bold text-lg">Booked Sessions</h4>
          <p className="text-3xl">{stats.totalBookings || 0}</p>
        </div>

        <div className="card bg-base-100 shadow p-4">
          <FaMoneyCheckAlt className="text-2xl text-primary" />
          <h4 className="font-bold text-lg">Total Revenue</h4>
          <p className="text-3xl">৳{stats.totalRevenue || 0}</p>
        </div>

        <div className="card bg-base-100 shadow p-4">
          <FaStar className="text-2xl text-yellow-500" />
          <h4 className="font-bold text-lg">Average Rating</h4>
          <p className="text-3xl">{stats.averageRating || 0}</p>
        </div>

        <div className="card bg-base-100 shadow p-4">
          <FaBookOpen className="text-2xl text-secondary" />
          <h4 className="font-bold text-lg">Total Reviews</h4>
          <p className="text-3xl">{stats.totalReviews || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="card bg-base-100 shadow p-4">
          <h4 className="font-bold text-lg mb-2">Session Bookings</h4>
          {bookingCounts.length > 0 ? (
            <Bar
              data={{
                labels: sessionTitles,
                datasets: [
                  {
                    label: "Students Booked",
                    data: bookingCounts,
                    backgroundColor: "rgba(59,130,246,0.6)",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
              }}
            />
          ) : (
            <p className="text-center text-gray-400">No bookings yet</p>
          )}
        </div>

        <div className="card bg-base-100 shadow p-4">
          <h4 className="font-bold text-lg mb-2">Bookings Distribution</h4>
          {bookingCounts.length > 0 ? (
            <Doughnut
              data={{
                labels: sessionTitles,
                datasets: [
                  {
                    label: "Bookings",
                    data: bookingCounts,
                    backgroundColor: [
                      "#60a5fa",
                      "#818cf8",
                      "#34d399",
                      "#f87171",
                      "#fbbf24",
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "right",
                  },
                },
              }}
            />
          ) : (
            <p className="text-center text-gray-400">No bookings to display</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
