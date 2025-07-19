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
      className="max-w-7xl mx-auto px-4 py-10"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-primary mb-2">Study Sessions</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse and join our curated selection of learning opportunities
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm"
      >
        <div className="relative w-full md:w-1/2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
            className="select select-bordered focus:ring-2 focus:ring-primary focus:border-transparent"
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
            className="select select-bordered focus:ring-2 focus:ring-primary focus:border-transparent"
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
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-gray-600">Loading sessions...</p>
        </motion.div>
      ) : isError ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="alert alert-error max-w-md mx-auto"
        >
          <div>
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
          </div>
        </motion.div>
      ) : filteredSessions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10"
        >
          <div className="max-w-md mx-auto p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No sessions found
            </h3>
            <p className="text-gray-600">
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
                upcoming: "bg-blue-400 text-white",
                ongoing: "bg-green-200 text-green-800",
                closed: "bg-gray-100 text-gray-800",
              };

              return (
                <motion.div
                  key={session._id}
                  variants={item}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col"
                >
                  <div className=" flex-grow">
                    <div className="flex justify-between items-start mb-3 bg-gradient-to-r from-primary/30 to-secondary/30 p-6">
                      <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                        {session.sessionTitle}
                      </h3>
                      <span
                        className={`px-3 py-2 rounded-full text-xs font-semibold ${statusColors[status]}`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>

                    <div className="p-6">
                      <p className="text-gray-600 mb-4 line-clamp-3">
                      {session.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/20 text-primary">
                          <FaCalendarAlt />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Dates</p>
                          <p className="text-sm font-medium">
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
                        <div className="p-2 rounded-lg bg-primary/20 text-primary">
                          <FaClock />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Duration</p>
                          <p className="text-sm font-medium">
                            {session.sessionDuration} weeks
                          </p>
                        </div>
                      </div>

                      {session.tutorName && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/20 text-primary">
                            <FaChalkboardTeacher />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Instructor</p>
                            <p className="text-sm font-medium">
                              {session.tutorName}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <Link
                      to={`/view-details/${session._id}`}
                      className="btn btn-primary w-full flex items-center justify-between"
                    >
                      View Details
                      <FaArrowRight />
                    </Link>
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
            <div className="text-sm text-gray-600">
              Showing page {page} of {totalPages} • {filteredSessions.length}{" "}
              sessions
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`p-2 rounded-lg ${
                  page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-primary/20 text-primary hover:bg-opacity-20"
                }`}
              >
                <FaChevronLeft />
              </button>

              {[...Array(totalPages).keys()].map((i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    page === i + 1
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className={`p-2 rounded-lg ${
                  page === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-primary/20 text-primary hover:bg-opacity-20"
                }`}
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