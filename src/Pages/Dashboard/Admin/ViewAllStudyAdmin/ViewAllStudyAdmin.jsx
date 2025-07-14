import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';

const ViewAllStudyAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [feeType, setFeeType] = useState('free');
  const [amount, setAmount] = useState(0);
  const [updateData, setUpdateData] = useState({
    sessionTitle: '',
    registrationStartDate: '',
    registrationEndDate: '',
    classStartDate: '',
    classEndDate: '',
    registrationFee: 0,
  });

  const { data: sessions = [], refetch } = useQuery({
    queryKey: ['all-study-sessions'],
    queryFn: async () => {
      const res = await axiosSecure.get('/sessions/all');
      return res.data;
    }
  });

  const handleApproveClick = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
    setFeeType('free');
    setAmount(0);
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
    setUpdateData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateSubmit = async () => {
    try {
      const res = await axiosSecure.patch(`/update/${selectedSession._id}`, updateData);

      const msg = res.data?.message;

      if (msg === "Update successful") {
        toast.success("Session updated successfully!");
        refetch();
        setIsUpdateModalOpen(false);
      } else if (msg === "No changes were made") {
        toast.info("No changes were made.");
      } else if (msg === "Session not found") {
        toast.error("Session not found.");
      } else {
        toast.error("Something went wrong.");
      }
    } catch (err) {
      toast.error("Failed to update session");
      console.error(err);
    }
  };



  const handleApproval = async () => {
    try {
      const res = await axiosSecure.patch(`/sessions/approve/${selectedSession._id}`, {
        status: 'approved',
        registrationFee: feeType === 'free' ? 0 : parseFloat(amount)
      });
      if (res.data.modifiedCount > 0) {
        toast.success('Session approved!');
        refetch();
        setIsModalOpen(false);
      }
    } catch (err) {
      toast.error('Failed to approve session');
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await axiosSecure.patch(`/sessions/reject/${id}`, { status: 'rejected' });
      if (res.data.modifiedCount > 0) {
        toast.success('Session rejected!');
        refetch();
      }
    } catch (err) {
      toast.error('Failed to reject session');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axiosSecure.delete(`/sessions/${id}`);
      if (res.data.deletedCount > 0) {
        toast.success('Session deleted!');
        refetch();
      }
    } catch (err) {
      toast.error('Failed to delete session');
    }
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold text-purple-600 text-center mb-2">
        All Study Sessions (Admin View)
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Approve or reject pending sessions. Update/delete approved ones.
      </p>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full border rounded-lg shadow-md">
          <thead className="bg-purple-100 text-gray-800">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Tutor</th>
              <th>Dates</th>
              <th>Status</th>
              <th>Reg. Fee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, index) => (
              <tr key={session._id}>
                <td>{index + 1}</td>
                <td>{session.sessionTitle}</td>
                <td>
                  <div>
                    <div className="font-medium">{session.tutorName}</div>
                    <div className="text-sm text-gray-500">{session.tutorEmail}</div>
                  </div>
                </td>
                <td>
                  <div>
                    Reg: {session.registrationStartDate} → {session.registrationEndDate}
                  </div>
                  <div>
                    Class: {session.classStartDate} → {session.classEndDate}
                  </div>
                </td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${session.status === 'pending'
                        ? 'bg-yellow-500'
                        : session.status === 'approved'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                  >
                    {session.status}
                  </span>
                </td>
                <td>{session.registrationFee}৳</td>
                <td className="space-x-2">
                  {session.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApproveClick(session)}
                        className="btn btn-sm btn-success"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleReject(session._id)}
                        className="btn btn-sm btn-error"
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
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(session._id)}
                        className="btn btn-sm btn-outline btn-error"
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

      {/* Approval Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed z-50">
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center px-4">
          <Dialog.Panel className="bg-white p-6 rounded-xl max-w-md w-full">
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

      {/* Update Modal */}
      <Dialog open={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} className="fixed z-50">
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center px-4">
          <Dialog.Panel className="bg-white p-6 rounded-xl max-w-md w-full">
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