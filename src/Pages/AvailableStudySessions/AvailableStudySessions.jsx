import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FaArrowRight, FaClock, FaCalendarAlt } from 'react-icons/fa';
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
      className="w-full py-10 px-4 sm:px-6 lg:px-12 bg-base-100"
      initial="hidden"
      animate="visible"
    >

      {/* Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12 text-center sm:text-left">
        <div className="space-y-2">
          <h2 className="jost text-3xl sm:text-4xl md:text-4xl font-bold text-primary">
            Featured Study Sessions
          </h2>
          <p className="text-lg opacity-70">
            Explore the most popular learning sessions
          </p>
        </div>
        <Link to="/all-sessions">
          <button className="btn btn-outline btn-md w-fit mx-auto sm:mx-0 rounded-lg btn-primary hover:bg-primary hover:text-white">
            View All Sessions
          </button>
        </Link>
      </div>

      {/* Grid Cards */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sessions
          .filter((s) => s.status === 'approved')
          .slice(0, 8)
          .map((session) => (
            <motion.div
              key={session._id}
              variants={cardVariants}
              className="bg-base-100 shadow-md hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col border border-base-200"
              whileHover={{ y: -4 }}
            >

              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={session.image}
                  alt={session.sessionTitle}
                  className="w-full h-full object-cover"
                />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-base-100 text-base-content text-xs font-medium px-3 py-1 rounded-md shadow-sm">
                    {session.category}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 flex-1 flex flex-col bg-base-100">
                
                {/* Tutor Name */}
                <div className="text-sm text-base-content/60 mb-2">
                  by {session.tutorName}
                </div>

                {/* Session Title */}
                <h3 className="font-bold text-lg mb-3 line-clamp-2 leading-tight text-base-content">
                  {session.sessionTitle}
                </h3>

                {/* Stats Row */}
                <div className="flex items-center gap-3 mb-4 text-sm">
                  <div className="flex items-center gap-1.5 text-warning">
                    <FaClock className="w-3.5 h-3.5" />
                    <span className="text-base-content/70">{session.sessionDuration} Weeks</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-info">
                    <FaCalendarAlt className="w-3.5 h-3.5" />
                    <span className="text-base-content/70">{dayjs(session.registrationStartDate).format('MMM D')}</span>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-base-200">
                  <div className="flex items-center gap-2">
                    {session.registrationFee > 0 ? (
                      <>
                        <span className="text-base-content/40 line-through text-sm">
                          ${session.registrationFee}
                        </span>
                        <span className="text-success font-bold text-lg">Free</span>
                      </>
                    ) : (
                      <span className="text-success font-bold text-lg">Free</span>
                    )}
                  </div>

                  <Link to={`/view-details/${session._id}`}>
                    <button className="text-base-content font-medium text-sm flex items-center gap-1 hover:text-primary transition-colors">
                      View More <FaArrowRight className="text-xs" />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
      </motion.div>

      {/* Show More */}
      {sessions.length > 8 && (
        <div className="text-center mt-12">
          <Link to="/all-sessions">
            <button className="btn btn-outline btn-primary btn-lg rounded-lg">
              View All Sessions <FaArrowRight className="ml-2" />
            </button>
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default AvailableStudySessions;