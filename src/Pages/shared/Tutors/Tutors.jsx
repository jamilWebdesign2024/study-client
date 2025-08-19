import { useQuery } from '@tanstack/react-query';
import { FaChalkboardTeacher, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useState } from 'react';
import Loading from '../../../Components/Loading';

const Tutors = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch tutors using TanStack Query
  const {
    data: tutors = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['tutors', searchTerm],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/tutors?search=${searchTerm}`);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return (
    <motion.div
      className="p-4 md:p-8 max-w-7xl mx-auto bg-base-300 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-2">
          <FaChalkboardTeacher className="text-primary" /> Our Expert Tutors
        </h1>
        <p className="text-base-content opacity-70 mt-2 max-w-2xl mx-auto">
          Meet our qualified tutors ready to guide your learning journey.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search tutors by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <FaSearch className="absolute left-3 top-3.5 text-base-content opacity-60" />
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-error text-lg">Failed to load tutors: {error.message}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary mt-4">
            Retry
          </button>
        </div>
      ) : tutors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-base-content opacity-70 text-lg">
            {searchTerm ? 'No tutors found matching your search.' : 'No tutors available at the moment.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {tutors.map((tutor, index) => (
            <motion.div
              key={tutor._id}
              className="card bg-accent/3 shadow-xl rounded-2xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="avatar mb-4">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                  <img
                    src={tutor.photo || '/default-avatar.png'}
                    alt={tutor.name}
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-primary">{tutor.name}</h3>
              <p className="text-base-content opacity-70">{tutor.email}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Tutors;
