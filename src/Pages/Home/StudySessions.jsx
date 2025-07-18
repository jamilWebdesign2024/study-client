import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteQuery } from '@tanstack/react-query';
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

const PAGE_SIZE = 6;

const StudySessions = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey: ['study-sessions', searchTerm, category, status],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await axiosSecure.get(
        `/sessions/all?page=${pageParam}&limit=${PAGE_SIZE}&search=${searchTerm}&category=${category}&status=${status}`
      );
      return {
        sessions: res.data?.sessions || res.data || [],
        page: res.data?.page || pageParam,
        hasMore: res.data?.hasMore || false
      };
    },
    getNextPageParam: (lastPage) => lastPage?.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 0,
    retry: 2,
    retryDelay: 1000
  });

  // Filter to only show approved sessions
  const allSessions = data?.pages.flatMap(page => 
    (page?.sessions || []).filter(session => session.status === 'approved')
  ) || [];

  const handleSearch = (e) => {
    e.preventDefault();
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

        {!isLoading && !isError && (
          <InfiniteScroll
            dataLength={allSessions.length}
            next={fetchNextPage}
            hasMore={hasNextPage || false}
            loader={<div className="text-center py-8"><FaSpinner className="animate-spin text-2xl mx-auto text-primary" /></div>}
            endMessage={
              <p className="text-center py-8 text-gray-500">
                {allSessions.length > 0 
                  ? "You've reached the end!" 
                  : "No approved sessions found matching your criteria"}
              </p>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allSessions.map((session) => {
                const sessionStatus = getSessionStatus(session.registrationStartDate, session.registrationEndDate);

                return (
                  <motion.div
                    key={session._id}
                    className="study-card"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="card-header">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-[var(--color-neutral)] flex items-center gap-2">
                          <FaBookOpen className="session-meta-icon" />
                          {session.sessionTitle}
                        </h3>
                        <span className={`session-status ${sessionStatus}`}>
                          {sessionStatus.charAt(0).toUpperCase() + sessionStatus.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="card-body">
                      <p className="text-[var(--color-neutral)] mb-4 line-clamp-3">
                        {session.description}
                      </p>

                      <div className="space-y-3 mt-4">
                        <div className="session-meta">
                          <FaCalendarAlt className="session-meta-icon" />
                          <span>
                            {dayjs(session.registrationStartDate).format('MMM D')} -{' '}
                            {dayjs(session.registrationEndDate).format('MMM D, YYYY')}
                          </span>
                        </div>
                        <div className="session-meta">
                          <FaClock className="session-meta-icon" />
                          <span>{session.sessionDuration} week program</span>
                        </div>
                        <div className="session-meta">
                          <FaUserGraduate className="session-meta-icon" />
                          <span>{session.enrolledStudents || 0} students enrolled</span>
                        </div>
                        {session.tutorName && (
                          <div className="session-meta">
                            <FaChalkboardTeacher className="session-meta-icon" />
                            <span>Taught by {session.tutorName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="card-footer">
                      <Link to={`/sessions/${session._id}`}>
                        <button className="btn-card">
                          View Details <FaArrowRight />
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default StudySessions;