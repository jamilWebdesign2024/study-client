import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  FaSearch,
  FaSpinner,
  FaCalendarAlt,
  FaClock,
  FaBookOpen,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaArrowRight
} from 'react-icons/fa';
import { Link } from 'react-router';
import dayjs from 'dayjs';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Loading from '../../Components/Loading';

const StudySessions = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['study-sessions', searchTerm, category, status, page, pageSize],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/sessions/all?page=${page}&limit=${pageSize}&search=${searchTerm}&category=${category}&status=${status}`
      );
      return {
        sessions: res.data?.sessions || res.data || [],
        total: res.data?.total || 0
      };
    },
    retry: 2,
    retryDelay: 1000
  });

  const allSessions = (data?.sessions || []).filter(session => session.status === 'approved');
  const totalPages = Math.ceil((data?.total || 0) / pageSize);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    refetch();
  };

  const handlePageSizeChange = (size) => {
    setPageSize(Number(size));
    setPage(1);
    refetch();
  };

  const getSessionStatus = (start, end) => {
    const now = dayjs();
    const startDate = dayjs(start);
    const endDate = dayjs(end);
    if (!startDate.isValid() || !endDate.isValid()) return 'unknown';
    if (now.isBefore(startDate)) return 'upcoming';
    if (now.isAfter(endDate)) return 'closed';
    return 'ongoing';
  };

  return (
    <div className="bg-base-300 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-primary mb-3">
            Explore Approved Study Sessions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Browse through all approved study sessions and find the perfect learning opportunity
          </p>
        </motion.div>

        <motion.form 
          onSubmit={handleSearch} 
          className="mb-8 bg-white p-4 rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
              <FaSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search sessions..."
                className="bg-transparent w-full focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="select select-bordered flex-1 max-w-xs"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="Language">Language</option>
              <option value="Programming">Programming</option>
              <option value="Business">Business</option>
            </select>

            <select
              className="select select-bordered flex-1 max-w-xs"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="closed">Closed</option>
            </select>

            <button 
              type="submit" 
              className="btn btn-primary flex-1 max-w-xs"
            >
              Apply Filters
            </button>
          </div>
        </motion.form>

        {isLoading && <Loading />}

        {isError && (
          <motion.div 
            className="alert alert-error mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div>
              <span>Error loading sessions: {error.message}</span>
              <button
                onClick={() => refetch()}
                className="btn btn-sm btn-ghost ml-2"
              >
                Retry
              </button>
            </div>
          </motion.div>
        )}

        {/* Pagination Top */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span>Items per page:</span>
            <select 
              className="select select-bordered select-sm"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(e.target.value)}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button 
              className="btn btn-sm"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Prev
            </button>
            <span className="flex items-center px-4">
              Page {page} of {totalPages || 1}
            </span>
            <button 
              className="btn btn-sm"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </div>

        {/* Sessions List */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allSessions.length > 0 ? (
              allSessions.map((session) => {
                const sessionStatus = getSessionStatus(session.registrationStartDate, session.registrationEndDate);

                return (
                  <motion.div
                    key={session._id}
                    className="card bg-white shadow-md rounded-lg overflow-hidden"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="card-body p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                          <FaBookOpen className="text-primary" />
                          {session.sessionTitle}
                        </h3>
                        <span className={`badge ${
                          sessionStatus === 'upcoming' ? 'badge-info' :
                          sessionStatus === 'ongoing' ? 'badge-success' :
                          'badge-neutral'
                        }`}>
                          {sessionStatus.charAt(0).toUpperCase() + sessionStatus.slice(1)}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-3">
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

                      <div className="mt-6">
                        <Link to={`/sessions/${session._id}`}>
                          <button className="btn btn-primary w-full">
                            View Details <FaArrowRight />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  No approved sessions found matching your criteria
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination Bottom */}
        {allSessions.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <button 
                className="btn btn-sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Prev
              </button>
              <span className="flex items-center px-4">
                Page {page} of {totalPages || 1}
              </span>
              <button 
                className="btn btn-sm"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudySessions;