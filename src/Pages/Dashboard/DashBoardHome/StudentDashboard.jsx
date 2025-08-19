import React, { useEffect, useState } from "react";
import {
  BookOpen,
  MessageSquare,
  FileText,
  FolderOpen,
  CreditCard,
  Star,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/dashboard/student-overview?email=${user.email}`);
        setStats(res.data);
        setBookingData(res.data.sessionBookingCount || {});
      } catch (err) {
        console.error("Student dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchStats();
  }, [user?.email, axiosSecure]);

  // Transform data
  const chartData = Object.entries(bookingData).map(([subject, count]) => ({
    subject,
    bookings: count
  }));

  const StatCard = ({ icon: Icon, title, value, prefix = "", suffix = "" }) => (
    <div className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300">
      <div className="card-body p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-base-content/80 text-sm uppercase tracking-wide">
                {title}
              </h4>
            </div>
            {loading ? (
              <div className="skeleton h-8 w-16 rounded"></div>
            ) : (
              <p className="text-3xl font-bold text-base-content">
                {prefix}{value}{suffix}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const CustomBar = ({ data }) => {
    if (loading) {
      return (
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="skeleton h-4 w-20"></div>
              <div className="skeleton h-3 flex-1"></div>
              <div className="skeleton h-4 w-8"></div>
            </div>
          ))}
        </div>
      );
    }

    if (!data.length) return <div className="flex items-center justify-center h-64 text-base-content/60">No data available</div>;

    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.subject} className="flex items-center gap-3">
            <div className="w-20 text-sm font-medium text-base-content/70 truncate">
              {item.subject}
            </div>
            <div className="flex-1 bg-base-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(item.bookings / Math.max(...data.map(d => d.bookings))) * 100}%`
                }}
              />
            </div>
            <div className="w-8 text-sm font-bold text-base-content text-right">
              {item.bookings}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const CustomPie = ({ data }) => {
    if (loading) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-base-200/50">
                <div className="flex items-center gap-2">
                  <div className="skeleton w-4 h-4 rounded-full"></div>
                  <div className="skeleton h-4 w-20"></div>
                </div>
                <div className="text-right">
                  <div className="skeleton h-4 w-8 mb-1"></div>
                  <div className="skeleton h-3 w-12"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (!data.length) return <div className="flex items-center justify-center h-64 text-base-content/60">No data available</div>;

    const total = data.reduce((sum, item) => sum + item.bookings, 0);
    const colors = [
      "hsl(var(--p))",
      "hsl(var(--s))",
      "hsl(var(--a))",
      "hsl(var(--in))",
      "hsl(var(--su))"
    ];

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          {data.map((item, index) => {
            const percentage = ((item.bookings / total) * 100).toFixed(1);
            return (
              <div key={item.subject} className="flex items-center justify-between p-2 rounded-lg bg-base-200/50">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="text-sm font-medium text-base-content">{item.subject}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-base-content">{item.bookings}</div>
                  <div className="text-xs text-base-content/60">{percentage}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-base-200/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-base-content mb-2">
            Student Dashboard
          </h1>
          <p className="text-base-content/70 text-lg">
            Track your learning progress and achievements
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4 rounded-full" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <StatCard icon={BookOpen} title="Booked Sessions" value={stats.totalBookedSessions} />
          <StatCard icon={MessageSquare} title="Total Reviews" value={stats.totalReviews} />
          <StatCard icon={FileText} title="Total Notes" value={stats.totalNotes} />
          <StatCard icon={FolderOpen} title="Study Materials" value={stats.totalMaterials} />
          <StatCard icon={CreditCard} title="Total Spent" value={stats.totalSpent.toLocaleString()} prefix="৳" />
          <StatCard icon={Star} title="Average Rating" value={stats.averageRating} suffix="/5" />
        </div>

        {/* Charts */}
        {chartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-base-content">
                    Session Bookings
                  </h3>
                  <div className="badge badge-primary badge-outline">Bar Chart</div>
                </div>
                <CustomBar data={chartData} />
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-base-content">
                    Subject Distribution
                  </h3>
                  <div className="badge badge-secondary badge-outline">Breakdown</div>
                </div>
                <CustomPie data={chartData} />
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {chartData.length === 0 && (
          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body text-center py-12">
              <BookOpen className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-base-content mb-2">
                No Booking Data Available
              </h3>
              <p className="text-base-content/60">
                Start booking sessions to see your learning analytics here
              </p>
              <div className="mt-6">
                <button className="btn btn-primary">
                  Browse Sessions
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
