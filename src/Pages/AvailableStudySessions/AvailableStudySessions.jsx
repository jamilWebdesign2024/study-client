import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import {
  FaCalendarAlt,
  FaClock,
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', duration: 0.6, bounce: 0.3 }
    }
  };
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', duration: 0.8, bounce: 0.4 }
    }
  };

  return (
    <motion.div
      className="w-full px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20 mt-8 sm:mt-12 bg-base-300"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Section Title */}
      <div className="text-center mb-10 sm:mb-12">
        <motion.h2
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-3 sm:mb-4"
          variants={titleVariants}
        >
          Explore Study Sessions
        </motion.h2>
        <motion.p
          className="text-base sm:text-lg text-base-content/70 max-w-2xl sm:max-w-3xl mx-auto"
          variants={titleVariants}
          transition={{ delay: 0.2 }}
        >
          Join interactive learning experiences with expert tutors and peers.
        </motion.p>
      </div>

      {/* Cards Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {sessions
          .filter((session) => session.status === 'approved')
          .slice(0, 6)
          .map((session, index) => {
            const status = getSessionStatus(
              session.registrationStartDate,
              session.registrationEndDate
            );

            return (
              <motion.div
                key={session._id}
                className="card bg-accent/3 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-200 h-full flex flex-col relative overflow-hidden group"
                variants={cardVariants}
                whileHover={{
                  scale: 1.02,
                  transition: { type: 'spring', bounce: 0.4, duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Status Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <motion.div
                    className={`badge text-xs font-semibold ${status === 'upcoming'
                        ? 'badge-info'
                        : status === 'ongoing'
                          ? 'badge-success'
                          : 'badge-error'
                      }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5, type: 'spring' }}
                  >
                    {status}
                  </motion.div>
                </div>

                {/* Card Body */}
                <div className="card-body flex-1 flex flex-col justify-between p-6">
                  <div className="flex-1">
                    <motion.h3
                      className="card-title text-base sm:text-lg font-bold text-base-content mb-2 sm:mb-3 line-clamp-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      {session.sessionTitle}
                    </motion.h3>

                    <motion.p
                      className="text-sm text-base-content/70 mb-3 sm:mb-4 line-clamp-1 sm:line-clamp-2 leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                    >
                      {session.description}
                    </motion.p>

                    {/* Session Details */}
                    <motion.div
                      className="space-y-2 sm:space-y-3 text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 text-base-content/80">
                        <FaCalendarAlt className="text-primary text-xs flex-shrink-0" />
                        <span className="truncate">
                          {dayjs(session.registrationStartDate).format('MMM D')} -{' '}
                          {dayjs(session.registrationEndDate).format('MMM D, YYYY')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 text-base-content/80">
                        <FaClock className="text-primary text-xs flex-shrink-0" />
                        <span>{session.sessionDuration} week program</span>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 text-base-content/80">
                        <FaUserGraduate className="text-primary text-xs flex-shrink-0" />
                        <span>{session.enrolledStudents || 0} students enrolled</span>
                      </div>

                      {session.tutorName && (
                        <div className="flex items-center gap-2 sm:gap-3 text-base-content/80">
                          <FaChalkboardTeacher className="text-primary text-xs flex-shrink-0" />
                          <span className="truncate">Taught by {session.tutorName}</span>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* See More Button */}
                  <motion.div
                    className="card-actions justify-end pt-4 sm:pt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.6 }}
                  >
                    <Link to={`/view-details/${session._id}`} className="w-full">
                      <motion.button
                        className="btn btn-primary btn-sm w-full group/btn"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>See More</span>
                        <FaArrowRight className="ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </motion.button>
                    </Link>
                  </motion.div>
                </div>

                {/* Hover Effect Background */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </motion.div>
            );
          })}
      </motion.div>

      {/* Show More Sessions Link */}
      {sessions.filter((s) => s.status === 'approved').length > 6 && (
        <motion.div
          className="text-center mt-10 sm:mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link to="/all-sessions">
            <button className="btn btn-outline btn-primary">
              View All Sessions
              <FaArrowRight className="ml-2" />
            </button>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AvailableStudySessions;
