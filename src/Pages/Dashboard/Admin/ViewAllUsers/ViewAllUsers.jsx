import React, { useEffect, useState } from 'react';
import { FaUserShield, FaSpinner, FaSearch } from 'react-icons/fa';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { motion } from 'framer-motion';
import Loading from '../../../../Components/Loading';

const ViewAllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateId, setUpdateId] = useState(null);

  // Fetch users from backend
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axiosSecure.get(`/users/search?keyword=${searchTerm}`);
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle role update
  const handleRoleChange = async (userId, newRole) => {
    setIsUpdating(true);
    setUpdateId(userId);
    try {
      const res = await axiosSecure.patch(`/users/role/${userId}`, { role: newRole });
      if (res.data.modifiedCount > 0) {
        await fetchUsers();
      }
    } catch (error) {
      console.error('Role update failed:', error);
    } finally {
      setIsUpdating(false);
      setUpdateId(null);
    }
  };

  // DaisyUI badge classes for roles
  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'badge badge-primary';
      case 'tutor':
        return 'badge badge-info';
      case 'student':
        return 'badge badge-success';
      default:
        return 'badge badge-ghost';
    }
  };

  // DaisyUI button classes for actions
  const getRoleButton = (role, action) => {
    const baseClass = 'btn btn-sm';
    switch (action) {
      case 'makeAdmin':
        return `${baseClass} btn-primary`;
      case 'removeAdmin':
        return `${baseClass} btn-error`;
      case 'makeTutor':
        return `${baseClass} btn-info`;
      case 'removeTutor':
        return `${baseClass} btn-warning`;
      default:
        return baseClass;
    }
  };

  return (
    <motion.div
      className="p-6 w-full mx-auto "
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-primary">User Management</h2>
        <p className="text-base-content mt-2">
          Search and manage user roles with ease. Use buttons to promote or demote users.
        </p>
      </div>

      <div className="flex justify-center mb-6 relative">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full max-w-md pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isLoading}
        />
        <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
        {isLoading && <FaSpinner className="absolute right-3 top-3.5 text-gray-400 animate-spin" />}
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg border border-base-300 w-full bg-base-300">
          <table className="table w-full text-center">
            <thead className="bg-primary text-primary-content text-base">
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
                  <td colSpan="5" className="py-8 text-gray-400">
                    {searchTerm ? 'No matching users found' : 'No users available'}
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    className="hover:bg-base-200 transition duration-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="font-semibold">{index + 1}</td>
                    <td className="font-medium">{user.name}</td>
                    <td className="text-gray-600 break-all">{user.email}</td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(user.role)}`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="grid grid-cols-2 gap-2 px-4">
                      {user.role !== 'admin' ? (
                        <button
                          onClick={() => handleRoleChange(user._id, 'admin')}
                          className={getRoleButton(user.role, 'makeAdmin')}
                          disabled={isUpdating && updateId === user._id}
                        >
                          {isUpdating && updateId === user._id ? (
                            <FaSpinner className="animate-spin mr-1" />
                          ) : (
                            <FaUserShield className="mr-1" />
                          )}
                          Make Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRoleChange(user._id, 'student')}
                          className={getRoleButton(user.role, 'removeAdmin')}
                          disabled={isUpdating && updateId === user._id}
                        >
                          {isUpdating && updateId === user._id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            'Remove Admin'
                          )}
                        </button>
                      )}

                      {user.role !== 'tutor' ? (
                        <button
                          onClick={() => handleRoleChange(user._id, 'tutor')}
                          className={getRoleButton(user.role, 'makeTutor')}
                          disabled={isUpdating && updateId === user._id}
                        >
                          {isUpdating && updateId === user._id ? (
                            <FaSpinner className="animate-spin mr-1" />
                          ) : (
                            <FaUserShield className="mr-1" />
                          )}
                          Make Tutor
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRoleChange(user._id, 'student')}
                          className={getRoleButton(user.role, 'removeTutor')}
                          disabled={isUpdating && updateId === user._id}
                        >
                          {isUpdating && updateId === user._id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            'Remove Tutor'
                          )}
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default ViewAllUsers;
