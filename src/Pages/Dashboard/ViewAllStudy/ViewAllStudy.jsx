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
  FaChalkboardTeacher,
  FaInfoCircle
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
    pending: <MdPendingActions className="text-warning" size={16} />,
    approved: <FaCheckCircle className="text-success" size={16} />,
    rejected: <FaTimesCircle className="text-error" size={16} />,
  };

  const getStatusBadge = (status, session) => {
    const baseClasses = "badge gap-2 font-semibold";

    switch (status) {
      case 'pending':
        return <span className={`${baseClasses} badge-warning`}>
          {statusIcons.pending}
          {session.isResubmitted ? 'Resubmitted' : 'Pending Review'}
        </span>;
      case 'approved':
        return <span className={`${baseClasses} badge-success`}>
          {statusIcons.approved} Approved
        </span>;
      case 'rejected':
        return (
          <button
            onClick={() => handleViewRejection(session)}
            className={`${baseClasses} badge-error hover:opacity-90 transition-opacity`}
          >
            {statusIcons.rejected} View Details
          </button>
        );
      default:
        return <span className={`${baseClasses} badge-neutral`}>
          {status}
        </span>;
    }
  };

  const handleViewRejection = (session) => {
    setSelectedRejectedSession(session);
    setIsViewRejectionModalOpen(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-full mb-4">
            <FaChalkboardTeacher className="text-4xl text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Study Sessions</h1>
          <p className="text-base-content/70 max-w-2xl mx-auto">
            Manage all your created study sessions. Track their status and resubmit rejected sessions for approval.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="stat bg-base-100 rounded-box shadow">
            <div className="stat-figure text-primary">
              <FaChalkboardTeacher className="text-3xl" />
            </div>
            <div className="stat-title">Total Sessions</div>
            <div className="stat-value">{sessions.length}</div>
          </div>

          <div className="stat bg-base-100 rounded-box shadow">
            <div className="stat-figure text-success">
              <FaCheckCircle className="text-3xl" />
            </div>
            <div className="stat-title">Approved</div>
            <div className="stat-value">
              {sessions.filter(s => s.status === 'approved').length}
            </div>
          </div>

          <div className="stat bg-base-100 rounded-box shadow">
            <div className="stat-figure text-warning">
              <MdPendingActions className="text-3xl" />
            </div>
            <div className="stat-title">Pending</div>
            <div className="stat-value">
              {sessions.filter(s => s.status === 'pending').length}
            </div>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="bg-base-100 rounded-box shadow-xl overflow-hidden">
          {sessions.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="p-4 bg-primary/20 rounded-full mb-4">
                  <FaBook className="text-3xl text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No study sessions found</h3>
                <p className="text-base-content/70 mb-6 max-w-md">
                  Get started by creating your first study session to share your knowledge with students.
                </p>
                <Link to="/dashboard/createStudySession">
                  <button className="btn btn-primary">
                    <FaPlusCircle className="mr-2" /> Create Your First Session
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="bg-accent/20 text-base-content">
                    <th className="text-base-content/70">Session</th>
                    <th className="text-base-content/70">
                      <div className="flex items-center gap-2">
                        <MdOutlineDateRange /> Registration
                      </div>
                    </th>
                    <th className="text-base-content/70">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt /> Class Dates
                      </div>
                    </th>
                    <th className="text-base-content/70">
                      <div className="flex items-center gap-2">
                        <FaClock /> Duration
                      </div>
                    </th>
                    <th className="text-base-content/70">Status</th>
                    <th className="text-base-content/70">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session, index) => (
                    <tr key={session._id} className="hover">
                      <td>
                        <div className="flex flex-col">
                          <div className="font-bold">{session.sessionTitle}</div>
                          <div className="text-sm text-base-content/70 line-clamp-1">
                            {session.description}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col text-sm">
                          <span className="font-medium">{session.registrationStartDate}</span>
                          <span className="text-xs text-base-content/50">to</span>
                          <span>{session.registrationEndDate}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col text-sm">
                          <span className="font-medium">{session.classStartDate}</span>
                          <span className="text-xs text-base-content/50">to</span>
                          <span>{session.classEndDate}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-1 text-sm font-medium">
                          {session.sessionDuration} weeks
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(session.status, session)}
                      </td>
                      <td>
                        {session.status === 'rejected' ? (
                          <button
                            onClick={() => handleReapply(session._id)}
                            className="btn btn-warning btn-sm"
                            title="Resubmit for approval"
                          >
                            <FaRedo className="mr-1" /> Resubmit
                          </button>
                        ) : (
                          <div className="text-xs text-base-content/50 italic">No actions available</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* View Rejection Modal */}
        <Dialog
          open={isViewRejectionModalOpen}
          onClose={() => setIsViewRejectionModalOpen(false)}
          className="modal modal-open"
        >
          <div className="modal-box">
            <Dialog.Title className="flex items-center gap-2 text-error font-bold text-lg mb-4">
              <FaInfoCircle /> Session Rejection Details
            </Dialog.Title>

            {selectedRejectedSession && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Session Title:</h3>
                  <p className="text-base-content/80">{selectedRejectedSession.sessionTitle}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1">Rejection Reason:</h3>
                  <p className="text-base-content/80 bg-error/10 p-3 rounded-box">
                    {selectedRejectedSession.rejectionReason || "No specific reason provided"}
                  </p>
                </div>

                {selectedRejectedSession.feedback && (
                  <div>
                    <h3 className="font-semibold mb-1">Admin Feedback:</h3>
                    <p className="text-base-content/80 bg-warning/10 p-3 rounded-box whitespace-pre-line">
                      {selectedRejectedSession.feedback}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="modal-action">
              <button
                className="btn btn-ghost"
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
          </div>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default ViewAllStudy;