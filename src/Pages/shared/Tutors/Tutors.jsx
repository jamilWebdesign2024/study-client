import { useQuery } from '@tanstack/react-query';
import { FaChalkboardTeacher, FaSearch, FaStar, FaBookOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useState } from 'react';


const Tutors = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch tutors using TanStack Query
  const { 
    data: tutors = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['tutors', searchTerm], // Cache key with searchTerm dependency
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/tutors?search=${searchTerm}`);
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 2, // Retry twice on failure
  });

  return (
    <motion.div
      className="p-4 md:p-8 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-2">
          <FaChalkboardTeacher className="text-primary" /> Our Expert Tutors
        </h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Meet our qualified tutors who are ready to help you achieve your academic goals.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search tutors by name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">
            Failed to load tutors: {error.message}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary mt-4"
          >
            Retry
          </button>
        </div>
      ) : tutors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm 
              ? "No tutors found matching your search." 
              : "No tutors available at the moment."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((tutor, index) => (
            <motion.div
              key={tutor._id}
              className="card bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Tutor card content remains the same */}
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="avatar">
                    <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img 
                        src={tutor.image || '/default-avatar.png'} 
                        alt={tutor.name} 
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{tutor.name}</h3>
                    <p className="text-gray-600">{tutor.email}</p>
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < (tutor.rating || 4) ? 'text-yellow-400' : 'text-gray-300'} />
                    ))}
                  </div>
                  <span className="text-gray-600">({tutor.reviews || 12} reviews)</span>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Subjects</h4>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects?.slice(0, 3).map((subject, i) => (
                      <span key={i} className="badge badge-outline badge-primary">
                        {subject}
                      </span>
                    ))}
                    {tutor.subjects?.length > 3 && (
                      <span className="badge badge-outline">+{tutor.subjects.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center text-gray-600">
                    <FaBookOpen className="mr-2" />
                    <span>{tutor.sessions || 45} sessions</span>
                  </div>
                  <div className="text-lg font-bold text-primary">
                    ${tutor.hourlyRate || 25}/hr
                  </div>
                </div>

                <button className="btn btn-primary w-full">
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Tutors;