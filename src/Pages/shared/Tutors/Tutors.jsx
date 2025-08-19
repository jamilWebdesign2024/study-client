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
      className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-2">
          <FaChalkboardTeacher className="text-primary" /> Our Expert Tutors
        </h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
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
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
        </div>
      </div>

      {isLoading ? (
        <Loading></Loading>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">Failed to load tutors: {error.message}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary mt-4">
            Retry
          </button>
        </div>
      ) : tutors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'No tutors found matching your search.' : 'No tutors available at the moment.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((tutor, index) => (
            <motion.div
              key={tutor._id}
              className="bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
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
              <p className="text-gray-600">{tutor.email}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Tutors;



// import { useQuery } from '@tanstack/react-query';
// import { FaChalkboardTeacher, FaSearch, FaStar, FaEnvelope, FaGraduationCap, FaUsers, FaFilter } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import useAxiosSecure from '../../../hooks/useAxiosSecure';
// import { useState } from 'react';
// import Loading from '../../../Components/Loading';

// const Tutors = () => {
//   const axiosSecure = useAxiosSecure();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [viewMode, setViewMode] = useState('grid'); // grid or list

//   // Fetch tutors using TanStack Query
//   const {
//     data: tutors = [],
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ['tutors', searchTerm],
//     queryFn: async () => {
//       const res = await axiosSecure.get(`/users/tutors?search=${searchTerm}`);
//       return res.data;
//     },
//     staleTime: 5 * 60 * 1000,
//     retry: 2,
//   });

//   const TutorCard = ({ tutor, index }) => (
//     <motion.div
//       className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group"
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: index * 0.1, duration: 0.5 }}
//       whileHover={{ y: -5 }}
//     >
//       <div className="card-body p-0">
//         {/* Header with gradient overlay */}
//         <div className="relative h-20 bg-gradient-to-r from-primary to-secondary rounded-t-2xl overflow-hidden">
//           <div className="absolute inset-0 bg-black bg-opacity-10"></div>
//           <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
//             <div className="avatar">
//               <div className="w-20 rounded-full ring ring-base-100 ring-offset-2 ring-offset-base-100">
//                 <img
//                   src={tutor.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name)}&background=random&size=128`}
//                   alt={tutor.name}
//                   className="object-cover"
//                   onError={(e) => {
//                     e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name)}&background=random&size=128`;
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="pt-12 pb-6 px-6 text-center">
//           <h3 className="card-title text-lg font-bold text-base-content justify-center mb-1">
//             {tutor.name}
//           </h3>

//           <div className="flex items-center justify-center gap-1 mb-3">
//             <FaEnvelope className="text-base-content opacity-60 text-sm" />
//             <p className="text-base-content opacity-70 text-sm">{tutor.email}</p>
//           </div>

//           {/* Stats */}
//           <div className="stats stats-horizontal bg-base-200 shadow-inner rounded-lg mb-4 scale-90">
//             <div className="stat py-2 px-3">
//               <div className="stat-figure text-primary">
//                 <FaUsers className="text-lg" />
//               </div>
//               <div className="stat-title text-xs">Students</div>
//               <div className="stat-value text-lg text-base-content">
//                 {tutor.students || Math.floor(Math.random() * 200) + 50}
//               </div>
//             </div>

//             <div className="stat py-2 px-3">
//               <div className="stat-figure text-secondary">
//                 <FaStar className="text-lg" />
//               </div>
//               <div className="stat-title text-xs">Rating</div>
//               <div className="stat-value text-lg text-base-content">
//                 {tutor.rating || (4.5 + Math.random() * 0.4).toFixed(1)}
//               </div>
//             </div>
//           </div>

//           {/* Specialization Badge */}
//           {tutor.specialization && (
//             <div className="badge badge-primary badge-lg mb-3 gap-1">
//               <FaGraduationCap className="text-xs" />
//               {tutor.specialization}
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="card-actions justify-center gap-2">
//             <button className="btn btn-primary btn-sm">
//               View Profile
//             </button>
//             <button className="btn btn-outline btn-sm">
//               Contact
//             </button>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );

//   const TutorListItem = ({ tutor, index }) => (
//     <motion.div
//       className="card card-side bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 mb-4"
//       initial={{ opacity: 0, x: -30 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ delay: index * 0.1, duration: 0.5 }}
//     >
//       <figure className="w-24 h-24 ml-4 my-4">
//         <div className="avatar">
//           <div className="w-20 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
//             <img
//               src={tutor.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name)}&background=random&size=128`}
//               alt={tutor.name}
//               className="object-cover"
//               onError={(e) => {
//                 e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name)}&background=random&size=128`;
//               }}
//             />
//           </div>
//         </div>
//       </figure>

//       <div className="card-body flex-row justify-between items-center">
//         <div className="flex-1">
//           <h3 className="card-title text-base-content">{tutor.name}</h3>
//           <p className="text-base-content opacity-70">{tutor.email}</p>
//           {tutor.specialization && (
//             <div className="badge badge-primary mt-2 gap-1">
//               <FaGraduationCap className="text-xs" />
//               {tutor.specialization}
//             </div>
//           )}
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="stats bg-base-200 shadow-inner">
//             <div className="stat py-2 px-4">
//               <div className="stat-title text-xs">Students</div>
//               <div className="stat-value text-sm text-base-content">
//                 {tutor.students || Math.floor(Math.random() * 200) + 50}
//               </div>
//             </div>
//           </div>

//           <div className="card-actions">
//             <button className="btn btn-primary btn-sm">View Profile</button>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );

//   return (
//     <div className="min-h-screen bg-base-200">
//       {/* Hero Section */}
//       <div className="hero bg-gradient-to-r from-primary to-secondary text-primary-content py-16">
//         <div className="hero-content text-center max-w-4xl">
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <div className="flex items-center justify-center gap-3 mb-4">
//               <FaChalkboardTeacher className="text-4xl" />
//               <h1 className="text-4xl md:text-5xl font-bold">Our Expert Tutors</h1>
//             </div>
//             <p className="text-lg md:text-xl opacity-90 max-w-2xl">
//               Connect with qualified educators who are passionate about helping you achieve your learning goals
//             </p>
//           </motion.div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Search and Filter Section */}
//         <motion.div
//           className="card bg-base-100 shadow-lg mb-8"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//         >
//           <div className="card-body">
//             <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//               {/* Search Bar */}
//               <div className="form-control flex-1 max-w-md">
//                 <div className="input-group">
//                   <span className="bg-base-200">
//                     <FaSearch className="text-base-content opacity-60" />
//                   </span>
//                   <input
//                     type="text"
//                     placeholder="Search tutors by name..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="input input-bordered flex-1 focus:outline-none focus:border-primary"
//                   />
//                 </div>
//               </div>

//               {/* View Toggle */}
//               <div className="flex items-center gap-2">
//                 <span className="text-base-content opacity-70 text-sm">View:</span>
//                 <div className="btn-group">
//                   <button
//                     className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
//                     onClick={() => setViewMode('grid')}
//                   >
//                     Grid
//                   </button>
//                   <button
//                     className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
//                     onClick={() => setViewMode('list')}
//                   >
//                     List
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Content Area */}
//         {isLoading ? (
//           <div className="flex justify-center py-16">
//             <Loading />
//           </div>
//         ) : isError ? (
//           <motion.div
//             className="card bg-error text-error-content shadow-lg max-w-md mx-auto"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             <div className="card-body text-center">
//               <h3 className="card-title justify-center">Oops! Something went wrong</h3>
//               <p>Failed to load tutors: {error?.message}</p>
//               <div className="card-actions justify-center mt-4">
//                 <button
//                   onClick={() => window.location.reload()}
//                   className="btn btn-outline btn-error-content"
//                 >
//                   Try Again
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         ) : tutors.length === 0 ? (
//           <motion.div
//             className="card bg-base-100 shadow-lg max-w-md mx-auto"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             <div className="card-body text-center">
//               <div className="text-6xl opacity-50 mb-4">
//                 <FaChalkboardTeacher />
//               </div>
//               <h3 className="card-title justify-center text-base-content">No Tutors Found</h3>
//               <p className="text-base-content opacity-70">
//                 {searchTerm
//                   ? 'No tutors match your search criteria. Try different keywords.'
//                   : 'No tutors are available at the moment. Please check back later.'}
//               </p>
//             </div>
//           </motion.div>
//         ) : (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5, delay: 0.3 }}
//           >
//             {/* Results Count */}
//             <div className="flex justify-between items-center mb-6">
//               <p className="text-base-content opacity-70">
//                 Showing {tutors.length} tutor{tutors.length !== 1 ? 's' : ''}
//                 {searchTerm && ` for "${searchTerm}"`}
//               </p>
//             </div>

//             {/* Tutors Grid/List */}
//             {viewMode === 'grid' ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {tutors.map((tutor, index) => (
//                   <TutorCard key={tutor._id} tutor={tutor} index={index} />
//                 ))}
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {tutors.map((tutor, index) => (
//                   <TutorListItem key={tutor._id} tutor={tutor} index={index} />
//                 ))}
//               </div>
//             )}
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Tutors;