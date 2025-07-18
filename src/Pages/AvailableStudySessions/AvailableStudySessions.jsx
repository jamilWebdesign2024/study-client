import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import {
  FaCalendarAlt,
  FaClock,
  FaBookOpen,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaArrowRight
} from 'react-icons/fa';
import { Link } from 'react-router';

const AvailableStudySessions = () => {
  const axiosSecure = useAxiosSecure();

  const { data: sessions = [] } = useQuery({
    queryKey: ['available-study-sessions'],
    queryFn: async () => {
      const res = await axiosSecure.get('/sessions/home');
      return res.data;
    }
  });

  const getSessionStatus = (start, end) => {
    const now = dayjs();
    if (now.isBefore(dayjs(start))) return 'upcoming';
    if (now.isAfter(dayjs(end))) return 'closed';
    return 'ongoing';
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Section Title */}
      <div className="text-center mb-12">
        <motion.h2
          className="text-4xl font-bold text-[var(--color-primary)] mb-3"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          Explore Study Sessions
        </motion.h2>
        <p className="text-lg text-[var(--color-neutral)] max-w-3xl mx-auto">
          Join interactive learning experiences with expert tutors and peers.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions
          .filter((session) => session.status === 'approved')
          .slice(0, 6)
          .map((session) => {
            const status = getSessionStatus(
              session.registrationStartDate,
              session.registrationEndDate
            );

            return (
              <motion.div
                key={session._id}
                className="study-card"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Card Header */}
                <div className="card-header">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-[var(--color-neutral)] flex items-center gap-2">
                      <FaBookOpen className="session-meta-icon" />
                      {session.sessionTitle}
                    </h3>
                    <span className={`session-status ${status}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
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

                {/* Card Footer */}
                <div className="card-footer">
                  <Link to={`/view-details/${session._id}`}>
                    <button className="btn-card">
                      View Details <FaArrowRight />
                    </button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
      </div>
    </motion.div>
  );
};

export default AvailableStudySessions;
