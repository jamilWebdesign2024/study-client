import React, { useEffect, useState } from 'react';
import { FaUserShield } from 'react-icons/fa';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { motion } from 'framer-motion';

const ViewAllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await axiosSecure.get(`/users/search?keyword=${searchTerm}`);
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  // Handle role update
  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await axiosSecure.patch(`/users/role/${userId}`, { role: newRole });
      if (res.data.modifiedCount > 0) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Role update failed:', error);
    }
  };

  // 🔖 Role badge styling
  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-600/20 text-black';
      case 'tutor':
        return 'bg-blue-600/20 text-black';
      case 'student':
        return 'bg-green-600/20 text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-primary">User Management</h2>
        <p className="text-gray-500 mt-2">
          Search and manage user roles with ease. Use buttons to promote or demote users.
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="🔍 Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full max-w-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="table w-full text-center">
          <thead className="bg-primary text-white text-base">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <motion.tr
                  key={user._id}
                  className="hover:bg-gray-100 transition duration-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="font-semibold">{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${getRoleBadge(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="grid grid-cols-2 gap-3">
                    {user.role !== 'admin' ? (
                      <button
                        onClick={() => handleRoleChange(user._id, 'admin')}
                        className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <FaUserShield className="mr-1" /> Make Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRoleChange(user._id, 'student')}
                        className="btn btn-sm bg-red-600 hover:bg-red-700 text-white"
                      >
                        Remove Admin
                      </button>
                    )}

                    {user.role !== 'tutor' ? (
                      <button
                        onClick={() => handleRoleChange(user._id, 'tutor')}
                        className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <FaUserShield className="mr-1" /> Make Tutor
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRoleChange(user._id, 'student')}
                        className="btn btn-sm bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        Remove Tutor
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ViewAllUsers;
