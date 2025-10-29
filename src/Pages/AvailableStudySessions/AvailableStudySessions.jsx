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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', duration: 0.6 }
    }
  };

  return (
    <motion.div
      className="w-full py-10 px-4 sm:px-6 lg:px-12 bg-base-200/50"
      initial="hidden"
      animate="visible"
    >

      {/* Title */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8 text-center sm:text-left">
        <div className="space-y-1">
          <h2 className="jost text-3xl sm:text-4xl md:text-4xl font-bold text-primary">Featured Study Sessions</h2>
          <p className="text-base opacity-70">
            Explore the most popular learning sessions
          </p>
        </div>
        <button className="btn btn-outline btn-sm w-fit mx-auto sm:mx-0 rounded-lg btn-primary hover:bg-primary hover:text-base-content">
          View All
        </button>
      </div>


      {/* Grid Cards */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sessions
          .filter((s) => s.status === 'approved')
          .slice(0, 8)
          .map((session) => (
            <motion.div
              key={session._id}
              variants={cardVariants}
              className="bg-secondary/5 shadow-md hover:shadow-xl border border-base-200 rounded-xl p-5 transition-all duration-300 group flex flex-col justify-between"
              whileHover={{ scale: 1.02 }}
            >
              {/* Category */}
              <div className="mb-3">
                <span className="badge badge-secondary text-xs">
                  {session.subject || "Education"}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-base mb-3 line-clamp-2">
                {session.sessionTitle}
              </h3>

              {/* Details */}
              <div className="text-xs text-base-content/70 space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-primary text-xs" />
                  <span>
                    {dayjs(session.registrationStartDate).format("MMM D")} -{" "}
                    {dayjs(session.registrationEndDate).format("MMM D")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FaClock className="text-primary text-xs" />
                  <span>{session.sessionDuration} Weeks</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaUserGraduate className="text-primary text-xs" />
                  <span>{session.enrolledStudents || 0} Students</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaChalkboardTeacher className="text-primary text-xs" />
                  <span>{session.tutorName}</span>
                </div>
              </div>

              {/* Bottom section */}
              <div className="flex items-center justify-between mt-auto">
                <div className="text-xs">
                  {
                    session.isPaid ? (
                      <>
                        <span className="line-through opacity-50">${session.originalPrice}</span>
                        <span className="font-bold text-error ml-1">${session.price}</span>
                      </>
                    ) : (
                      <span className="font-bold text-success">Free</span>
                    )
                  }
                </div>

                <Link to={`/view-details/${session._id}`}>
                  <button className="btn btn-link text-xs p-0 gap-1 text-primary no-underline">
                    View More <FaArrowRight className="text-xs" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
      </motion.div>

      {/* Show More */}
      {
        sessions.length > 8 && (
          <div className="text-center mt-10">
            <Link to="/all-sessions">
              <button className="btn btn-outline btn-primary">
                View All Sessions <FaArrowRight className="ml-2" />
              </button>
            </Link>
          </div>
        )
      }
    </motion.div>
  );
};

export default AvailableStudySessions;
