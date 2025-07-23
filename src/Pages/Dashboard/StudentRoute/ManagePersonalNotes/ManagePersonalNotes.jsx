import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  FiEdit, 
  FiTrash2, 
  FiPlus, 
  FiSearch, 
  FiFileText, 
  FiLoader, 
  FiX,
  FiClock,
  FiCalendar,
  FiBookmark
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { Link } from 'react-router';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import useAuth from '../../../../hooks/useAuth';
import Loading from '../../../../Components/Loading';

const ManagePersonalNotes = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);
    const [updateData, setUpdateData] = useState({
        title: '',
        description: ''
    });

    // Fetch notes using React Query
    const { data: notes = [], isLoading } = useQuery({
        queryKey: ['notes', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/notes?email=${user.email}`);
            return res.data.data || res.data; 
        },
        enabled: !!user?.email,
    });

    // Delete note mutation
    const deleteNoteMutation = useMutation({
        mutationFn: (id) => axiosSecure.delete(`/notes/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['notes', user?.email]);
            Swal.fire({
                title: 'Deleted!',
                text: 'Your note has been deleted.',
                icon: 'success',
                confirmButtonColor: '#4F46E5',
                background: '#fff',
            });
        },
        onError: (error) => {
            console.error('Error deleting note:', error);
            toast.error('Failed to delete note', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    });

    // Update note mutation
    const updateNoteMutation = useMutation({
        mutationFn: ({ id, data }) => axiosSecure.patch(`/notes/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['notes', user?.email]);
            setIsModalOpen(false);
            Swal.fire({
                title: 'Updated!',
                text: 'Your note has been updated.',
                icon: 'success',
                confirmButtonColor: '#4F46E5',
                background: '#fff',
            });
        },
        onError: (error) => {
            console.error('Error updating note:', error);
            toast.error('Failed to update note', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4F46E5',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            background: '#fff',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteNoteMutation.mutate(id);
            }
        });
    };

    const openUpdateModal = (note) => {
        setCurrentNote(note);
        setUpdateData({
            title: note.title,
            description: note.description
        });
        setIsModalOpen(true);
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        if (!updateData.title || !updateData.description) {
            toast.error('Title and description are required');
            return;
        }
        updateNoteMutation.mutate({ 
            id: currentNote._id, 
            data: {
                title: updateData.title,
                description: updateData.description
            } 
        });
    };

    const filteredNotes = Array.isArray(notes)
        ? notes.filter(note =>
            note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    if (isLoading) {
        return (
            <Loading></Loading>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8"
        >
            {/* Update Note Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl shadow-lg w-full max-w-md"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Update Note</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleUpdateSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        value={updateData.title}
                                        onChange={(e) => setUpdateData({...updateData, title: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        rows={6}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        value={updateData.description}
                                        onChange={(e) => setUpdateData({...updateData, description: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updateNoteMutation.isLoading}
                                        className={`px-6 py-2 border border-transparent rounded-lg shadow-sm text-white font-medium ${
                                            updateNoteMutation.isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                                        } transition-colors`}
                                    >
                                        {updateNoteMutation.isLoading ? (
                                            <span className="flex items-center justify-center">
                                                <FiLoader className="animate-spin mr-2" />
                                                Updating...
                                            </span>
                                        ) : (
                                            'Update Note'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 rounded-xl">
                            <FiBookmark className="text-indigo-600 text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">My Notes</h2>
                            <p className="text-gray-600 flex items-center">
                                <FiFileText className="mr-2" />
                                {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
                            </p>
                        </div>
                    </div>
                    <Link
                        to="/dashboard/createNote"
                        className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-md hover:shadow-indigo-200"
                    >
                        <FiPlus className="text-lg" />
                        <span>Create New</span>
                    </Link>
                </div>

                <div className="mb-8 relative max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiSearch className="text-gray-400 text-lg" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by title or content..."
                        className="pl-12 pr-5 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 shadow-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {filteredNotes.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-2xl mx-auto">
                        <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiFileText className="text-3xl text-indigo-500" />
                        </div>
                        <h3 className="text-2xl font-medium text-gray-900 mb-3">
                            {searchTerm ? 'No notes found' : 'No notes yet'}
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {searchTerm 
                                ? 'Try adjusting your search or create a new note'
                                : 'Get started by creating your first note'}
                        </p>
                        <Link
                            to="/dashboard/createNote"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-md"
                        >
                            <FiPlus />
                            Create Note
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNotes.map((note) => (
                            <motion.div
                                key={note._id}
                                whileHover={{ y: -8, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                            >
                                <div className="p-6 flex flex-col h-full">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                                            <span className="text-xs font-medium text-indigo-600">
                                                {note.status || 'active'}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                                            {note.title}
                                        </h3>
                                        <p className="text-gray-600 mb-5 line-clamp-3">
                                            {note.description}
                                        </p>
                                    </div>
                                    
                                    <div className="mt-auto">
                                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-5">
                                            <div className="flex items-center gap-1">
                                                <FiCalendar className="text-gray-400" />
                                                <span>
                                                    {new Date(note.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FiClock className="text-gray-400" />
                                                <span>
                                                    {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => openUpdateModal(note)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                                            >
                                                <FiEdit className="text-indigo-500" />
                                                <span>Edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(note._id)}
                                                disabled={deleteNoteMutation.isLoading}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent rounded-lg text-white bg-red-500 hover:bg-red-600 transition-all disabled:opacity-70"
                                            >
                                                {deleteNoteMutation.isLoading ? (
                                                    <FiLoader className="animate-spin" />
                                                ) : (
                                                    <FiTrash2 />
                                                )}
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ManagePersonalNotes;