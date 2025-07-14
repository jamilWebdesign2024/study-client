import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FaCalendarAlt, FaClock, FaBookOpen } from 'react-icons/fa';
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


    const isOngoing = (start, end) => {
        const now = dayjs();
        return now.isAfter(dayjs(start)) && now.isBefore(dayjs(end));
    };

    return (
        <motion.div
            className="max-w-7xl mx-auto px-4 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <h2 className="text-3xl font-bold text-center text-indigo-600 mb-2">
                Explore Available Study Sessions
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                Browse the latest approved sessions. Registration might still be open, so act fast! You can view more details by clicking the "Read More" button.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sessions.map((session, index) => {
                    const ongoing = isOngoing(session.registrationStartDate, session.registrationEndDate);

                    return (
                        <motion.div
                            key={session._id}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                            whileHover={{ y: -5 }}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
                                        <FaBookOpen className="text-indigo-500" /> {session.sessionTitle}
                                    </h3>

                                    <span
                                        className={`text-xs px-3 py-1 rounded-full text-white font-semibold ${ongoing ? 'bg-green-500' : 'bg-red-500'
                                            }`}
                                    >
                                        {ongoing ? 'Ongoing' : 'Closed'}
                                    </span>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed line-clamp-3">
                                    {session.description}
                                </p>

                                <div className="flex items-center justify-start gap-4 text-gray-500 text-sm mb-2">
                                    <div className="flex items-center gap-1">
                                        <FaCalendarAlt className="text-indigo-400" />
                                        <span>
                                            {session.registrationStartDate} - {session.registrationEndDate}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FaClock className="text-indigo-400" />
                                        <span>{session.sessionDuration} weeks</span>
                                    </div>
                                </div>
                            </div>

                            <Link to={`/view-details/${session._id}`}>
                                <div className="border-t px-6 py-4">
                                    <button className="w-full btn btn-sm btn-primary rounded-full hover:scale-[1.02] transition-transform">
                                        Read More
                                    </button>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default AvailableStudySessions;
