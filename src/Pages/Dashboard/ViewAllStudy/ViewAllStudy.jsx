// import React from 'react';
// import { useQuery } from '@tanstack/react-query';
// import useAuth from '../../../hooks/useAuth';
// import useAxiosSecure from '../../../hooks/useAxiosSecure';
// import { toast } from 'react-toastify';
// import { motion } from 'framer-motion';
// import { 
//   FaRedo, 
//   FaCalendarAlt, 
//   FaClock, 
//   FaCheckCircle, 
//   FaTimesCircle, 
//   FaBook,
//   FaPlusCircle,
//   FaChalkboardTeacher
// } from 'react-icons/fa';
// import { MdPendingActions, MdOutlineDateRange } from 'react-icons/md';

// const ViewAllStudy = () => {
//   const { user } = useAuth();
//   const axiosSecure = useAxiosSecure();

//   const { data: sessions = [], refetch, isLoading } = useQuery({
//     queryKey: ['study-sessions', user?.email],
//     enabled: !!user?.email,
//     queryFn: async () => {
//       const res = await axiosSecure.get(`/sessions?tutorEmail=${user.email}`);
//       return res.data;
//     },
//   });

//   const handleReapply = async (id) => {
//     try {
//       const res = await axiosSecure.patch(`/sessions/reapply/${id}`, {
//         status: 'pending',
//       });

//       if (res.data.modifiedCount > 0) {
//         toast.success('Approval request sent successfully!');
//         refetch();
//       }
//     } catch (err) {
//       toast.error('Failed to reapply. Please try again.');
//       console.error(err);
//     }
//   };

//   const statusIcons = {
//     pending: <MdPendingActions className="text-amber-500" size={16} />,
//     approved: <FaCheckCircle className="text-emerald-500" size={16} />,
//     rejected: <FaTimesCircle className="text-rose-500" size={16} />,
//   };

//   const getStatusBadge = (status) => {
//     const baseClasses = "px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-2";
    
//     switch(status) {
//       case 'pending':
//         return <span className={`${baseClasses} bg-amber-50 text-amber-800`}>
//           {statusIcons.pending} Pending
//         </span>;
//       case 'approved':
//         return <span className={`${baseClasses} bg-emerald-50 text-emerald-800`}>
//           {statusIcons.approved} Approved
//         </span>;
//       case 'rejected':
//         return <span className={`${baseClasses} bg-rose-50 text-rose-800`}>
//           {statusIcons.rejected} Rejected
//         </span>;
//       default:
//         return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
//           {status}
//         </span>;
//     }
//   };

//   return (
//     <motion.div
//       className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <div className="mb-8 text-center">
//         <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-3">
//           <FaChalkboardTeacher className="text-indigo-600 dark:text-indigo-400" /> 
//           My Study Sessions
//         </h2>
//         <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
//           Manage all your created study sessions. You can resubmit rejected sessions for approval.
//         </p>
//       </div>

//       {isLoading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//         </div>
//       ) : (
//         <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-700">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
//               <thead className="bg-slate-50 dark:bg-slate-700/50">
//                 <tr>
//                   <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
//                     #
//                   </th>
//                   <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
//                     Title
//                   </th>
//                   <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
//                     <div className="flex items-center gap-2">
//                       <MdOutlineDateRange className="text-indigo-500" /> 
//                       Registration
//                     </div>
//                   </th>
//                   <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
//                     <div className="flex items-center gap-2">
//                       <FaCalendarAlt className="text-indigo-500" /> 
//                       Class Dates
//                     </div>
//                   </th>
//                   <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
//                     <div className="flex items-center gap-2">
//                       <FaClock className="text-indigo-500" /> 
//                       Duration
//                     </div>
//                   </th>
//                   <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
//                 {sessions.length === 0 ? (
//                   <tr>
//                     <td colSpan="7" className="px-6 py-8 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-full mb-4">
//                           <FaBook className="text-3xl text-indigo-500 dark:text-indigo-400" />
//                         </div>
//                         <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-1">
//                           No study sessions found
//                         </h3>
//                         <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
//                           Get started by creating your first study session
//                         </p>
//                         <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all">
//                           <FaPlusCircle className="mr-2" /> Create Session
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   sessions.map((session, index) => (
//                     <tr 
//                       key={session._id} 
//                       className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors group"
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-200">
//                         {index + 1}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
//                           {session.sessionTitle}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex flex-col text-sm text-slate-600 dark:text-slate-300">
//                           <span className="font-medium">{session.registrationStartDate}</span>
//                           <span className="text-xs text-slate-400 dark:text-slate-500">to</span>
//                           <span>{session.registrationEndDate}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex flex-col text-sm text-slate-600 dark:text-slate-300">
//                           <span className="font-medium">{session.classStartDate}</span>
//                           <span className="text-xs text-slate-400 dark:text-slate-500">to</span>
//                           <span>{session.classEndDate}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-center">
//                         <div className="flex items-center justify-center gap-1 text-sm text-slate-600 dark:text-slate-300">
//                           <span className="font-medium">{session.sessionDuration}</span>
//                           <span className="text-xs">weeks</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {getStatusBadge(session.status)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {session.status === 'rejected' ? (
//                           <button
//                             onClick={() => handleReapply(session._id)}
//                             className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium rounded-lg shadow-sm hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all"
//                           >
//                             <FaRedo className="mr-1.5" size={12} /> Resubmit
//                           </button>
//                         ) : (
//                           <span className="text-xs text-slate-400 dark:text-slate-500 italic">No actions</span>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default ViewAllStudy;





import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  FaRedo, 
  FaCalendarAlt, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaBook,
  FaPlusCircle,
  FaChalkboardTeacher
} from 'react-icons/fa';
import { MdPendingActions, MdOutlineDateRange } from 'react-icons/md';
import { Dialog } from '@headlessui/react';

const ViewAllStudy = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isViewRejectionModalOpen, setIsViewRejectionModalOpen] = useState(false);
  const [selectedRejectedSession, setSelectedRejectedSession] = useState(null);

  const { data: sessions = [], refetch, isLoading } = useQuery({
    queryKey: ['study-sessions', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/sessions?tutorEmail=${user.email}`);
      return res.data;
    },
  });

  const handleReapply = async (id) => {
    try {
      const res = await axiosSecure.patch(`/sessions/reapply/${id}`, {
        status: 'pending',
        isResubmitted: true
      });

      if (res.data.modifiedCount > 0) {
        toast.success('Approval request sent successfully!');
        refetch();
      }
    } catch (err) {
      toast.error('Failed to reapply. Please try again.');
      console.error(err);
    }
  };

  const statusIcons = {
    pending: <MdPendingActions className="text-amber-500" size={16} />,
    approved: <FaCheckCircle className="text-emerald-500" size={16} />,
    rejected: <FaTimesCircle className="text-rose-500" size={16} />,
  };

  const getStatusBadge = (status, session) => {
    const baseClasses = "px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-2";
    
    switch(status) {
      case 'pending':
        return <span className={`${baseClasses} bg-amber-50 text-amber-800`}>
          {statusIcons.pending} 
          {session.isResubmitted ? 'New Request Pending' : 'Pending'}
        </span>;
      case 'approved':
        return <span className={`${baseClasses} bg-emerald-50 text-emerald-800`}>
          {statusIcons.approved} Approved
        </span>;
      case 'rejected':
        return (
          <button 
            onClick={() => handleViewRejection(session)}
            className={`${baseClasses} bg-rose-50 text-rose-800 hover:bg-rose-100 transition-colors`}
          >
            {statusIcons.rejected} Rejected
          </button>
        );
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
          {status}
        </span>;
    }
  };

  const handleViewRejection = (session) => {
    setSelectedRejectedSession(session);
    setIsViewRejectionModalOpen(true);
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-3">
          <FaChalkboardTeacher className="text-indigo-600 dark:text-indigo-400" /> 
          My Study Sessions
        </h2>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Manage all your created study sessions. You can resubmit rejected sessions for approval.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-100 dark:border-slate-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    #
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <MdOutlineDateRange className="text-indigo-500" /> 
                      Registration
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-indigo-500" /> 
                      Class Dates
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-indigo-500" /> 
                      Duration
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-full mb-4">
                          <FaBook className="text-3xl text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-1">
                          No study sessions found
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                          Get started by creating your first study session
                        </p>
                        <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all">
                          <FaPlusCircle className="mr-2" /> Create Session
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sessions.map((session, index) => (
                    <tr 
                      key={session._id} 
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-200">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                          {session.sessionTitle}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col text-sm text-slate-600 dark:text-slate-300">
                          <span className="font-medium">{session.registrationStartDate}</span>
                          <span className="text-xs text-slate-400 dark:text-slate-500">to</span>
                          <span>{session.registrationEndDate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col text-sm text-slate-600 dark:text-slate-300">
                          <span className="font-medium">{session.classStartDate}</span>
                          <span className="text-xs text-slate-400 dark:text-slate-500">to</span>
                          <span>{session.classEndDate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-slate-600 dark:text-slate-300">
                          <span className="font-medium">{session.sessionDuration}</span>
                          <span className="text-xs">weeks</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(session.status, session)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {session.status === 'rejected' ? (
                          <button
                            onClick={() => handleReapply(session._id)}
                            className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium rounded-lg shadow-sm hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all"
                          >
                            <FaRedo className="mr-1.5" size={12} /> Resubmit
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 dark:text-slate-500 italic">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Rejection Modal */}
      <Dialog open={isViewRejectionModalOpen} onClose={() => setIsViewRejectionModalOpen(false)} className="fixed z-50">
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center px-4">
          <Dialog.Panel className="bg-white p-6 rounded-xl max-w-md w-full">
            <Dialog.Title className="text-lg font-bold mb-4 flex items-center gap-2 text-rose-600">
              <FaTimesCircle /> Session Rejected
            </Dialog.Title>
            
            {selectedRejectedSession && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-slate-800 mb-1">Session Title:</h3>
                  <p className="text-slate-600">{selectedRejectedSession.sessionTitle}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-slate-800 mb-1">Rejection Reason:</h3>
                  <p className="text-slate-600">{selectedRejectedSession.rejectionReason || "No reason provided"}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-slate-800 mb-1">Admin Feedback:</h3>
                  <p className="text-slate-600 whitespace-pre-line">
                    {selectedRejectedSession.feedback || "No additional feedback provided"}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button 
                className="btn btn-outline" 
                onClick={() => setIsViewRejectionModalOpen(false)}
              >
                Close
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  handleReapply(selectedRejectedSession._id);
                  setIsViewRejectionModalOpen(false);
                }}
              >
                <FaRedo className="mr-2" /> Resubmit for Approval
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </motion.div>
  );
};

export default ViewAllStudy;