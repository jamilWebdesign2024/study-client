import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowRight,
  FaBookOpen,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaClock,
  FaSearch,
  FaUserGraduate,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Loading from "../../Components/Loading";

const StudySessions = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [filterStatus, setFilterStatus] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["approved-sessions", search, page, limit, filterStatus],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/sessions/all?page=${page}&limit=${limit}&search=${search}&status=approved`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const now = dayjs();
  const rawSessions = data?.sessions || [];
  const totalPages = data?.totalPages || 1;

  const getStatus = (session) => {
    const start = dayjs(session.registrationStartDate);
    const end = dayjs(session.registrationEndDate);
    if (now.isBefore(start)) return "upcoming";
    if (now.isAfter(end)) return "closed";
    return "ongoing";
  };

  const filteredSessions = rawSessions.filter((session) => {
    const status = getStatus(session);
    return filterStatus ? filterStatus === status : true;
  });

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto px-4 py-10 lg:px-10 min-h-screen bg-base-300"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-primary mb-2">Study Sessions</h2>
        <p className="text-base-content/70 max-w-2xl mx-auto">
          Browse and join our curated selection of learning opportunities
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-base-100 p-4 rounded-box shadow-sm"
      >
        <div className="relative w-full md:w-1/2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-base-content/50" />
          </div>
          <input
            className="input input-bordered w-full pl-10"
            placeholder="Search sessions..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex gap-3 items-center w-full md:w-auto">
          <select
            className="select select-bordered"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Sessions</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="closed">Closed</option>
          </select>

          <select
            className="select select-bordered"
            value={limit}
            onChange={(e) => {
              setLimit(parseInt(e.target.value));
              setPage(1);
            }}
          >
            <option value={6}>6 per page</option>
            <option value={10}>10 per page</option>
            <option value={15}>15 per page</option>
          </select>
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Loading />
        </motion.div>
      ) : isError ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="alert alert-error max-w-md mx-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error: {error.message}</span>
        </motion.div>
      ) : filteredSessions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10"
        >
          <div className="max-w-md mx-auto p-6 bg-base-200 rounded-box">
            <h3 className="text-lg font-medium text-base-content mb-2">
              No sessions found
            </h3>
            <p className="text-base-content/70">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredSessions.map((session) => {
              const status = getStatus(session);
              const statusColors = {
                upcoming: "bg-info text-info-content",
                ongoing: "bg-success text-success-content",
                closed: "bg-error text-base-content",
              };

              return (
                <motion.div
                  key={session._id}
                  variants={item}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="card bg-accent/3 shadow-md hover:shadow-lg transition-shadow rounded-xl"
                >

                  <div className="card-body p-0 ">
                    <div className={`p-6 ${status === "upcoming" ? "bg-accent/20" : status === "ongoing" ? "bg-accent/20" : "bg-accent/20"}`}>
                      <div className="flex justify-between items-start">
                        <h3 className="card-title text-base-content line-clamp-2">
                          {session.sessionTitle}
                        </h3>
                        <span
                          className={`badge ${statusColors[status]} px-3 py-2`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-base-content/80 mb-4 line-clamp-3">
                        {session.description}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <FaCalendarAlt />
                          </div>
                          <div>
                            <p className="text-xs text-base-content/50">Dates</p>
                            <p className="text-sm font-medium text-base-content">
                              {dayjs(session.registrationStartDate).format(
                                "MMM D"
                              )}{" "}
                              -{" "}
                              {dayjs(session.registrationEndDate).format(
                                "MMM D, YYYY"
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <FaClock />
                          </div>
                          <div>
                            <p className="text-xs text-base-content/50">Duration</p>
                            <p className="text-sm font-medium text-base-content">
                              {session.sessionDuration} weeks
                            </p>
                          </div>
                        </div>

                        {session.tutorName && (
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              <FaChalkboardTeacher />
                            </div>
                            <div>
                              <p className="text-xs text-base-content/50">Instructor</p>
                              <p className="text-sm font-medium text-base-content">
                                {session.tutorName}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <Link
                        to={`/view-details/${session._id}`}
                        className="btn btn-primary w-full"
                      >
                        View Details <FaArrowRight className="ml-2" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-base-content/70">
              Showing page {page} of {totalPages} • {filteredSessions.length}{" "}
              sessions
            </div>
            <div className="join">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="join-item btn btn-outline"
              >
                <FaChevronLeft />
              </button>

              {[...Array(totalPages).keys()].map((i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`join-item btn ${page === i + 1 ? "btn-active" : ""}`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="join-item btn btn-outline"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StudySessions;