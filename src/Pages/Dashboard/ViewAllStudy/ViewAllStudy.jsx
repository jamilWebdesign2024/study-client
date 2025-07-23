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
import Loading from '../../../Components/Loading';
import { Link } from 'react-router';

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

    switch (status) {
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
        <h2 className="text-3xl font-bold text-secondary mb-2 flex items-center justify-center gap-3">
          <FaChalkboardTeacher className="text-indigo-600 dark:text-indigo-400" />
          My Study Sessions
        </h2>
        <p className="text-primary max-w-2xl mx-auto">
          Manage all your created study sessions. You can resubmit rejected sessions for approval.
        </p>
      </div>

      {isLoading ? (
        <Loading></Loading>
      ) : (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-base-200">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead className="bg-base-200 text-base-content">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>
                    <div className="flex items-center gap-2">
                      <MdOutlineDateRange /> Registration
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt /> Class Dates
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center gap-2">
                      <FaClock /> Duration
                    </div>
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="p-4 bg-indigo-100 rounded-full mb-4">
                          <FaBook className="text-3xl text-indigo-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-1">
                          No study sessions found
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Get started by creating your first study session
                        </p>
                        <Link to="/dashboard/createStudySession">
                            <button className="btn btn-primary btn-sm">
                          <FaPlusCircle className="mr-2" /> Create Session
                        </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sessions.map((session, index) => (
                    <tr key={session._id} className="hover">
                      <td>{index + 1}</td>
                      <td>{session.sessionTitle}</td>
                      <td>
                        <div className="flex flex-col text-sm">
                          <span className="font-medium">{session.registrationStartDate}</span>
                          <span className="text-xs text-gray-400">to</span>
                          <span>{session.registrationEndDate}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col text-sm">
                          <span className="font-medium">{session.classStartDate}</span>
                          <span className="text-xs text-gray-400">to</span>
                          <span>{session.classEndDate}</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm">
                          <span className="font-medium">{session.sessionDuration}</span>
                          <span className="text-xs">weeks</span>
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(session.status, session)}
                      </td>
                      <td>
                        {session.status === 'rejected' ? (
                          <button
                            onClick={() => handleReapply(session._id)}
                            className="btn btn-warning btn-xs"
                          >
                            <FaRedo className="mr-1.5" size={12} /> Resubmit
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No actions</span>
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
        <div className="fixed inset-0 bg-black/80 bg-opacity-30 flex items-center justify-center px-4">
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
                className="btn bg-red-700 text-white rounded-lg"
                onClick={() => setIsViewRejectionModalOpen(false)}
              >
                Close
              </button>
              <button
                className="btn btn-primary bg-blue-700"
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