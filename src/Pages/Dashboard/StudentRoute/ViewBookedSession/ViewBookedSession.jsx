import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { FaArrowRight, FaCalendarAlt, FaUserGraduate, FaStar } from 'react-icons/fa';
import { IoTimeOutline } from 'react-icons/io5';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import dayjs from 'dayjs';
import useAuth from '../../../../hooks/useAuth';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const ViewBookedSession = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { data: bookedSessions = [], isLoading } = useQuery({
    queryKey: ['bookedSessions', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookedSession/user?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-800 text-center">My Booked Sessions</h2>
          <p className="text-center text-gray-500 mt-2">
            Manage and review your enrolled learning sessions
          </p>
        </motion.div>

        {bookedSessions.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Session
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tutor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookedSessions.map((session, idx) => (
                    <motion.tr
                      key={idx}
                      whileHover={{ backgroundColor: 'rgba(245, 243, 255, 0.5)' }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-indigo-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <FaUserGraduate className="text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{session.sessionTitle}</div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <IoTimeOutline className="mr-1" />
                              {session.sessionDuration} weeks
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{session.tutorName}</div>
                        <div className="text-sm text-gray-500">{session.tutorEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FaCalendarAlt className="mr-2 text-indigo-500" />
                          {dayjs(session.classStartDate).format('MMM D')} - {dayjs(session.classEndDate).format('MMM D, YYYY')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <RiMoneyDollarCircleLine className="mr-2 text-green-500" />
                          {session.registrationFee === 0 ? 'Free' : `${session.registrationFee}৳`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          session.status === 'booked' 
                            ? 'bg-green-100 text-green-800' 
                            : session.status === 'completed' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/view-details/${session.sessionId}`)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end w-full"
                        >
                          View <FaArrowRight className="ml-1" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No sessions booked yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by exploring available learning sessions.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/sessions')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Browse Sessions
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ViewBookedSession;