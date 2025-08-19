import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaUserGraduate,
} from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import dayjs from "dayjs";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import Loading from "../../../../Components/Loading";

const ViewBookedSession = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { data: bookedSessions = [], isLoading } = useQuery({
    queryKey: ["bookedSessions", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookedSession/user?email=${user.email}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-base-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-3xl font-bold text-base-content text-center">
            My Booked Sessions
          </h2>
          <p className="text-center text-base-content/70 mt-2">
            Manage and review your enrolled learning sessions
          </p>
        </motion.div>

        {bookedSessions.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="card bg-base-100 shadow-xl"
          >
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Session</th>
                    <th>Tutor</th>
                    <th>Schedule</th>
                    <th>Fee</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookedSessions.map((session, idx) => (
                    <tr key={idx} className="hover">
                      {/* Session */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-primary/20 text-primary-content w-12 rounded-full flex items-center justify-center">
                              <FaUserGraduate className="text-primary" />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">
                              {session.sessionTitle}
                            </div>
                            <div className="text-sm opacity-70 flex items-center gap-1">
                              <IoTimeOutline />
                              {session.sessionDuration} weeks
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Tutor */}
                      <td>
                        <div className="font-medium">{session.tutorName}</div>
                        <div className="text-sm opacity-70">
                          {session.tutorEmail}
                        </div>
                      </td>

                      {/* Schedule */}
                      <td>
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="text-primary" />
                          {dayjs(session.classStartDate).format("MMM D")} -{" "}
                          {dayjs(session.classEndDate).format("MMM D, YYYY")}
                        </div>
                      </td>

                      {/* Fee */}
                      <td>
                        <div className="flex items-center gap-1">
                          <RiMoneyDollarCircleLine className="text-success" />
                          {session.registrationFee === 0
                            ? "Free"
                            : `${session.registrationFee}৳`}
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <div
                          className={`badge ${session.status === "booked"
                              ? "badge-success"
                              : session.status === "completed"
                                ? "badge-info"
                                : "badge-warning"
                            }`}
                        >
                          {session.status.charAt(0).toUpperCase() +
                            session.status.slice(1)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="text-right">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            navigate(`/view-details/${session.sessionId}`)
                          }
                          className="btn btn-ghost btn-sm text-primary"
                        >
                          View <FaArrowRight className="ml-1" />
                        </motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="mx-auto h-24 w-24 text-base-content/30 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-base-content">
              No sessions booked yet
            </h3>
            <p className="mt-1 text-sm text-base-content/70">
              Get started by exploring available learning sessions.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/sessions")}
                className="btn btn-primary"
              >
                Browse Sessions
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ViewBookedSession;
