import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaRedo } from 'react-icons/fa';

const ViewAllStudy = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch sessions using TanStack Query
  const { data: sessions = [], refetch } = useQuery({
    queryKey: ['study-sessions', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/sessions?tutorEmail=${user.email}`);
      return res.data;
    },
  });

  // Reapply handler - only for rejected sessions
  const handleReapply = async (id) => {
    try {
      const res = await axiosSecure.patch(`/sessions/reapply/${id}`, {
        status: 'pending',
      });

      if (res.data.modifiedCount > 0) {
        toast.success('Approval request sent again!');
        refetch();
      }
    } catch (err) {
      toast.error('Failed to reapply');
      console.error(err);
    }
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold text-blue-600 text-center mb-2">
        My Study Sessions
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
        View all sessions you created. You can resend approval request if your session was rejected.
      </p>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full border rounded-lg shadow-md">
          <thead className="bg-blue-100 text-gray-800">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Reg. Date</th>
              <th>Class Date</th>
              <th>Duration (wks)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No sessions found.
                </td>
              </tr>
            ) : (
              sessions.map((session, index) => (
                <tr key={session._id}>
                  <td>{index + 1}</td>
                  <td>{session.sessionTitle}</td>
                  <td>
                    {session.registrationStartDate} <br /> to <br />
                    {session.registrationEndDate}
                  </td>
                  <td>
                    {session.classStartDate} <br /> to <br />
                    {session.classEndDate}
                  </td>
                  <td className="text-center">{session.sessionDuration}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        session.status === 'pending'
                          ? 'bg-yellow-500'
                          : session.status === 'approved'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                    >
                      {session.status}
                    </span>
                  </td>
                  <td>
                    {session.status === 'rejected' ? (
                      <button
                        onClick={() => handleReapply(session._id)}
                        className="btn btn-sm btn-outline btn-warning flex items-center gap-2"
                      >
                        <FaRedo /> Reapply
                      </button>
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ViewAllStudy;
