import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Loading from '../../../../Components/Loading';
import Swal from 'sweetalert2';

const ViewAllStudyAdmin = () => {
  const axiosSecure = useAxiosSecure();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const [selectedSession, setSelectedSession] = useState(null);
  const [feeType, setFeeType] = useState('free');
  const [amount, setAmount] = useState(0);
  const [rejectionReason, setRejectionReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [updateData, setUpdateData] = useState({
    sessionTitle: '',
    registrationStartDate: '',
    registrationEndDate: '',
    classStartDate: '',
    classEndDate: '',
    registrationFee: 0,
  });

  const { data = {}, refetch, isLoading } = useQuery({
    queryKey: ['all-study-sessions', currentPage, itemsPerPage],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/sessions/all/admin?page=${currentPage}&limit=${itemsPerPage}`
      );
      return res.data;
    },
  });

  if (isLoading) return <Loading />;

  const sessions = data.sessions || [];
  const totalCount = data.totalCount || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleApproveClick = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
    setFeeType('free');
    setAmount(0);
  };

  const handleRejectClick = (session) => {
    setSelectedSession(session);
    setIsRejectModalOpen(true);
    setRejectionReason('');
    setFeedback('');
  };

  const handleReject = async () => {
    try {
      const res = await axiosSecure.patch(`/sessions/reject/${selectedSession._id}`, {
        status: 'rejected',
        rejectionReason,
        feedback,
        rejectedAt: new Date(),
      });
      if (res.data.modifiedCount > 0) {
        toast.success('Session rejected with feedback!');
        refetch();
        setIsRejectModalOpen(false);
      }
    } catch (err) {
      toast.error('Failed to reject session');
      console.error(err);
    }
  };

  const handleUpdateClick = (session) => {
    setSelectedSession(session);
    setUpdateData({
      sessionTitle: session.sessionTitle,
      registrationStartDate: session.registrationStartDate,
      registrationEndDate: session.registrationEndDate,
      classStartDate: session.classStartDate,
      classEndDate: session.classEndDate,
      registrationFee: session.registrationFee,
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async () => {
    try {
      const res = await axiosSecure.patch(`/update/${selectedSession._id}`, updateData);
      const msg = res.data?.message;

      if (msg === 'Update successful') {
        toast.success('Session updated successfully!');
        refetch();
        setIsUpdateModalOpen(false);
      } else if (msg === 'No changes were made') {
        toast.info('No changes were made.');
      } else if (msg === 'Session not found') {
        toast.error('Session not found.');
      } else {
        toast.error('Something went wrong.');
      }
    } catch (err) {
      toast.error('Failed to update session');
      console.error(err);
    }
  };

  const handleApproval = async () => {
    try {
      const res = await axiosSecure.patch(`/sessions/approve/${selectedSession._id}`, {
        status: 'approved',
        registrationFee: feeType === 'free' ? 0 : parseFloat(amount),
      });
      if (res.data.modifiedCount > 0) {
        toast.success('Session approved!');
        refetch();
        setIsModalOpen(false);
      }
    } catch (err) {
      toast.error('Failed to approve session');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this session?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6', // DaisyUI theme primary color এর সাথে মেলানো যায়
      cancelButtonColor: '#d33',     // DaisyUI theme error color
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/sessions/${id}`);
        if (res.data.deletedCount > 0) {
          toast.success('Session deleted!');
          refetch();
        }
      } catch (err) {
        toast.error('Failed to delete session');
        console.error(err);
      }
    }
  };

  return (
    <motion.div
      className="w-full bg-base-300 mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold text-primary text-center mb-2">
        All Study Sessions (Admin View)
      </h2>
      <p className="text-center text-base-content/70 mb-6">
        Approve or reject pending sessions. Update/delete approved ones.
      </p>

      <div className="mb-4 flex items-center justify-end gap-2">
        <label htmlFor="itemsPerPage" className="font-medium">
          Items per page:
        </label>
        <select
          id="itemsPerPage"
          className="select select-bordered w-24"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full border rounded-lg shadow-md">
          <thead className="bg-accent/10 text-base-content">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Tutor</th>
              <th>Status</th>
              <th>Reg. Fee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, index) => (
              <tr key={session._id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{session.sessionTitle}</td>
                <td>
                  <div>
                    <div className="font-medium">{session.tutorName}</div>
                    <div className="text-sm text-base-content/60">{session.tutorEmail}</div>
                  </div>
                </td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${session.status === 'pending'
                      ? 'badge badge-warning'
                      : session.status === 'approved'
                        ? 'badge badge-success'
                        : 'badge badge-neutral'
                      }`}
                  >
                    {session.status === 'pending' && session.isResubmitted
                      ? 'New Request Pending'
                      : session.status}
                  </span>
                </td>
                <td>{session.registrationFee}৳</td>
                <td className="space-x-2">
                  {session.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApproveClick(session)}
                        className="btn btn-sm btn-success"
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleRejectClick(session)}
                        className="btn btn-sm btn-error"
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                  {session.status === 'approved' && (
                    <>
                      <button
                        onClick={() => handleUpdateClick(session)}
                        className="btn btn-sm btn-info"
                        title="Update"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(session._id)}
                        className="btn btn-sm btn-outline btn-error"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        <button
          className="btn btn-sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page + 1}
            className={`btn btn-sm ${currentPage === page + 1 ? 'btn-primary' : ''}`}
            onClick={() => setCurrentPage(page + 1)}
          >
            {page + 1}
          </button>
        ))}

        <button
          className="btn btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      {/* Approval Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed z-50">
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center px-4">
          <Dialog.Panel className="bg-base-100 p-6 rounded-xl max-w-md w-full">
            <Dialog.Title className="text-lg font-bold mb-4">Approve Session</Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Is the session free or paid?</label>
                <select
                  className="select select-bordered w-full"
                  value={feeType}
                  onChange={(e) => setFeeType(e.target.value)}
                >
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              {feeType === 'paid' && (
                <div>
                  <label className="block mb-1 font-medium">Enter Amount (৳)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleApproval}>
                Confirm
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Rejection Modal */}
      <Dialog open={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} className="fixed z-50">
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center px-4">
          <Dialog.Panel className="bg-base-100 p-6 rounded-xl max-w-md w-full">
            <Dialog.Title className="text-lg font-bold mb-4">Reject Session</Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Rejection Reason *</label>
                <select
                  className="select select-bordered w-full"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="Incomplete Information">Incomplete Information</option>
                  <option value="Inappropriate Content">Inappropriate Content</option>
                  <option value="Schedule Conflict">Schedule Conflict</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Feedback for Tutor</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="textarea textarea-bordered w-full"
                  placeholder="Provide constructive feedback to help the tutor improve..."
                  rows={4}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="btn btn-outline" onClick={() => setIsRejectModalOpen(false)}>
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={handleReject}
                disabled={!rejectionReason}
              >
                Confirm Rejection
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Update Modal */}
      <Dialog open={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} className="fixed z-50">
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center px-4">
          <Dialog.Panel className="bg-base-100 p-6 rounded-xl max-w-md w-full">
            <Dialog.Title className="text-lg font-bold mb-4">Update Session</Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Session Title</label>
                <input
                  type="text"
                  name="sessionTitle"
                  value={updateData.sessionTitle}
                  onChange={handleUpdateChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Registration Start</label>
                  <input
                    type="date"
                    name="registrationStartDate"
                    value={updateData.registrationStartDate}
                    onChange={handleUpdateChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Registration End</label>
                  <input
                    type="date"
                    name="registrationEndDate"
                    value={updateData.registrationEndDate}
                    onChange={handleUpdateChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Class Start</label>
                  <input
                    type="date"
                    name="classStartDate"
                    value={updateData.classStartDate}
                    onChange={handleUpdateChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Class End</label>
                  <input
                    type="date"
                    name="classEndDate"
                    value={updateData.classEndDate}
                    onChange={handleUpdateChange}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">Registration Fee (৳)</label>
                <input
                  type="number"
                  name="registrationFee"
                  value={updateData.registrationFee}
                  onChange={handleUpdateChange}
                  className="input input-bordered w-full"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="btn btn-outline" onClick={() => setIsUpdateModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleUpdateSubmit}>
                Update
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </motion.div>
  );
};

export default ViewAllStudyAdmin;
