// pages/study/StudySessions.jsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import {
  FaCalendarAlt,
  FaClock,
  FaBookOpen,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaArrowRight,
  FaSearch,
  FaSpinner
} from 'react-icons/fa';
import { Link } from 'react-router';
import Pagination from './Pagination';
import useAxiosSecure from '../../hooks/useAxiosSecure';


const StudySessions = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: sessionsData, isLoading, isError, error } = useQuery({
  queryKey: ['study-sessions', searchTerm, page, pageSize],
  queryFn: async () => {
    const res = await axiosSecure.get(
      `/sessions/all?search=${searchTerm}&page=${page}&limit=${pageSize}`
    );
    return res.data;
  },
  keepPreviousData: true,
});
  const sessions = sessionsData?.sessions || [];
  const totalSessions = sessionsData?.total || 0;
  const totalPages = Math.ceil(totalSessions / pageSize);

  const getSessionStatus = (start, end) => {
    const now = dayjs();
    if (now.isBefore(dayjs(start))) return 'upcoming';
    if (now.isAfter(dayjs(end))) return 'closed';
    return 'ongoing';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <motion.h2
          className="text-4xl font-bold text-primary mb-3"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          All Study Sessions
        </motion.h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Browse and join our comprehensive collection of study sessions
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <form onSubmit={handleSearch} className="w-full md:w-1/2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search sessions by title, tutor or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          </div>
        </form>

        <div className="flex items-center gap-2">
          <span className="text-gray-600">Show:</span>
          <select 
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="select select-bordered select-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-gray-600">per page</span>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-primary" />
        </div>
      )}

      {isError && (
        <div className="alert alert-error shadow-lg max-w-2xl mx-auto">
          <div>
            <span>Error loading sessions: {error.message}</span>
          </div>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {sessions.map((session) => {
              const status = getSessionStatus(
                session.registrationStartDate,
                session.registrationEndDate
              );

              return (
                <motion.div
                  key={session._id}
                  className="card bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FaBookOpen className="text-primary" />
                        {session.sessionTitle}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          status === 'upcoming'
                            ? 'bg-blue-100 text-blue-800'
                            : status === 'ongoing'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-600 line-clamp-3">
                        {session.description}
                      </p>

                      <div className="space-y-3 mt-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <FaCalendarAlt className="text-primary" />
                          <span>
                            {dayjs(session.registrationStartDate).format('MMM D')} -{' '}
                            {dayjs(session.registrationEndDate).format('MMM D, YYYY')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <FaClock className="text-primary" />
                          <span>{session.sessionDuration} week program</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <FaUserGraduate className="text-primary" />
                          <span>{session.enrolledStudents || 0} students enrolled</span>
                        </div>
                        {session.tutorName && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <FaChalkboardTeacher className="text-primary" />
                            <span>Taught by {session.tutorName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Link to={`/sessions/${session._id}`}>
                      <button className="btn btn-primary w-full">
                        View Details <FaArrowRight className="ml-2" />
                      </button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination Section */}
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          )}

          {/* Total Count Info */}
          <div className="text-center mt-4 text-gray-500">
            Showing {(page - 1) * pageSize + 1} to{' '}
            {Math.min(page * pageSize, totalSessions)} of {totalSessions} sessions
          </div>
        </>
      )}
    </motion.div>
  );
};

export default StudySessions;
