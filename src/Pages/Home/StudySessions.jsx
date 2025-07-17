import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  FaSearch,
  FaSpinner,
  FaCalendarAlt,
  FaClock,
  FaUserGraduate,
  FaChalkboardTeacher
} from 'react-icons/fa';
import Loading from '../../components/Loading';
import { Link } from 'react-router';
import dayjs from 'dayjs';
import useAxiosSecure from '../../hooks/useAxiosSecure';

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
    queryKey: ['study-sessions', searchTerm, category],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await axiosSecure.get(
        `/sessions/all?page=${pageParam}&limit=${PAGE_SIZE}&search=${searchTerm}&category=${category}`
      );
      return res.data;
    },
    getNextPageParam: (lastPage) => lastPage?.hasMore ? lastPage.page + 1 : undefined,
    retry: 2,
    retryDelay: 1000
  });

  const allSessions = data?.pages.flatMap(page => page?.sessions || []) || [];

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
    <div className='bg-base-300 min-h-screen'>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
            Explore Study Sessions
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">
            Discover various study sessions, filter by category or status
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-6 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-2">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search sessions..."
              className="input input-bordered w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="select select-bordered"
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
            className="select select-bordered"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="closed">Closed</option>
          </select>

          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        {isLoading && <Loading />}

        {isError && (
          <div className="alert alert-error mb-6">
            <div>
              <span>Error loading sessions: {error.message}</span>
              <button
                onClick={() => refetch()}
                className="btn btn-sm btn-ghost ml-2"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!isLoading && !isError && (
          <InfiniteScroll
            dataLength={allSessions.length}
            next={fetchNextPage}
            hasMore={hasNextPage || false}
            loader={
              <div className="text-center py-4">
                <FaSpinner className="animate-spin text-2xl mx-auto" />
              </div>
            }
            endMessage={
              <p className="text-center py-4 text-gray-500">
                {allSessions.length > 0 ? "No more sessions to load" : "No sessions found"}
              </p>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {allSessions
                .filter((session) => {
                  const sessionStatus = getSessionStatus(session.registrationStartDate, session.registrationEndDate);
                  return !status || sessionStatus === status;
                })
                .map((session) => {
                  const sessionStatus = getSessionStatus(session.registrationStartDate, session.registrationEndDate);

                  return (
                    <div
                      key={session._id}
                      className="bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="relative">
                        <img
                          src={session.image || '/default-session.jpg'}
                          alt={session.sessionTitle || 'Study Session'}
                          className="w-full h-56 object-cover"
                          onError={(e) => {
                            e.target.src = '/default-session.jpg';
                          }}
                        />
                        <span className={`absolute top-3 left-3 ${sessionStatus === 'upcoming' ? 'bg-blue-500' : sessionStatus === 'ongoing' ? 'bg-green-500' : sessionStatus === 'closed' ? 'bg-gray-500' : 'bg-yellow-500'} text-white text-xs font-semibold px-3 py-1 rounded-full shadow`}>
                          {sessionStatus.charAt(0).toUpperCase() + sessionStatus.slice(1)}
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <h2 className="text-lg font-bold text-gray-800 line-clamp-1">
                          {session.sessionTitle || 'Untitled Session'}
                        </h2>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {session.description || 'No description available'}
                        </p>

                        <div className="space-y-2 text-sm mt-3">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-primary" />
                            <span>
                              {session.registrationStartDate ? dayjs(session.registrationStartDate).format('MMM D') : 'N/A'} -{' '}
                              {session.registrationEndDate ? dayjs(session.registrationEndDate).format('MMM D, YYYY') : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaClock className="text-primary" />
                            <span>{session.sessionDuration || 0} week program</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaUserGraduate className="text-primary" />
                            <span>{session.enrolledStudents || 0} students enrolled</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-slate-400 mt-2">
                          {session.tutorName && (
                            <div className="text-sm font-medium">
                              <FaChalkboardTeacher className="inline mr-1 text-primary" />
                              <span className="text-gray-600">Tutor: </span>
                              <span className="text-primary">{session.tutorName}</span>
                            </div>
                          )}

                          <Link
                            to={`/sessions/${session._id}`}
                            className="btn btn-sm btn-primary px-4"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
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
