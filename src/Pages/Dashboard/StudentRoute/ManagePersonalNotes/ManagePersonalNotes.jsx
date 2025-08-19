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
    FiBookmark,
    FiEye,
    FiFilter,
    FiMoreVertical
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
    const [viewMode, setViewMode] = useState('grid'); // grid or list
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
                confirmButtonText: 'Continue',
                customClass: {
                    confirmButton: 'btn btn-success'
                }
            });
        },
        onError: (error) => {
            console.error('Error deleting note:', error);
            toast.error('Failed to delete note', {
                position: "top-right",
                autoClose: 3000,
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
                confirmButtonText: 'Continue',
                customClass: {
                    confirmButton: 'btn btn-success'
                }
            });
        },
        onError: (error) => {
            console.error('Error updating note:', error);
            toast.error('Failed to update note', {
                position: "top-right",
                autoClose: 3000,
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
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            customClass: {
                confirmButton: 'btn btn-error',
                cancelButton: 'btn btn-neutral'
            }
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
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-base-300 w-full">
            {/* Update Note Modal */}
            <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
                <div className="modal-box w-11/12 max-w-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <FiEdit className="text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-base-content">Update Note</h3>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="btn btn-sm btn-circle btn-ghost"
                        >
                            <FiX size={18} />
                        </button>
                    </div>

                    <form onSubmit={handleUpdateSubmit} className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-base-content">Title</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered w-full focus:input-primary"
                                value={updateData.title}
                                onChange={(e) => setUpdateData({ ...updateData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-base-content">Description</span>
                            </label>
                            <textarea
                                rows={8}
                                className="textarea textarea-bordered resize-none focus:textarea-primary"
                                value={updateData.description}
                                onChange={(e) => setUpdateData({ ...updateData, description: e.target.value })}
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="btn btn-neutral"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={updateNoteMutation.isLoading}
                                className="btn btn-primary"
                            >
                                {updateNoteMutation.isLoading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm mr-2"></span>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <FiEdit className="mr-2" />
                                        Update Note
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setIsModalOpen(false)}>close</button>
                </form>
            </dialog>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4"
                    >
                        <div className="p-3 bg-primary rounded-2xl">
                            <FiBookmark className="text-primary-content text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-base-content mb-1">
                                Personal Notes
                            </h1>
                            <div className="flex items-center gap-4 text-base-content/70">
                                <span className="flex items-center gap-1">
                                    <FiFileText size={16} />
                                    {filteredNotes.length} notes
                                </span>
                                <span className="flex items-center gap-1">
                                    <FiClock size={16} />
                                    Last updated today
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-3"
                    >
                        <Link
                            to="/dashboard/createNote"
                            className="btn btn-primary"
                        >
                            <FiPlus className="mr-2" />
                            New Note
                        </Link>
                    </motion.div>
                </div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-base-200 rounded-2xl p-6 mb-8"
                >
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        <div className="flex-1 max-w-xl">
                            <div className="relative">
                                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                                <input
                                    type="text"
                                    placeholder="Search notes by title or content..."
                                    className="input input-bordered w-full pl-12 bg-base-100"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="btn-group">
                                <button
                                    className={`btn btn-sm ${viewMode === 'grid' ? 'btn-active' : 'btn-outline'}`}
                                    onClick={() => setViewMode('grid')}
                                >
                                    Grid
                                </button>
                                <button
                                    className={`btn btn-sm ${viewMode === 'list' ? 'btn-active' : 'btn-outline'}`}
                                    onClick={() => setViewMode('list')}
                                >
                                    List
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Notes Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {filteredNotes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-32 h-32 bg-base-200 rounded-full flex items-center justify-center mb-6">
                                <FiFileText className="text-5xl text-base-content/30" />
                            </div>
                            <h2 className="text-2xl font-semibold text-base-content mb-2">
                                {searchTerm ? 'No notes found' : 'Your note collection is empty'}
                            </h2>
                            <p className="text-base-content/70 max-w-md mb-8">
                                {searchTerm
                                    ? 'Try adjusting your search terms or create a new note to get started.'
                                    : 'Start building your knowledge base by creating your first note. Capture ideas, insights, and important information.'}
                            </p>
                            <Link
                                to="/dashboard/createNote"
                                className="btn btn-primary btn-lg"
                            >
                                <FiPlus className="mr-2" />
                                Create First Note
                            </Link>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredNotes.map((note, index) => (
                                <motion.div
                                    key={note._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group"
                                >
                                    <div className="card bg-base-100 border border-base-300 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                                        <div className="card-body">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-success rounded-full"></div>
                                                    <span className="text-xs font-medium text-success uppercase tracking-wider">
                                                        {note.status || 'active'}
                                                    </span>
                                                </div>
                                                <div className="dropdown dropdown-end">
                                                    <button tabIndex={0} className="btn btn-sm btn-ghost btn-circle opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <FiMoreVertical />
                                                    </button>
                                                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-40 border border-base-300">
                                                        <li>
                                                            <button onClick={() => openUpdateModal(note)}>
                                                                <FiEdit />
                                                                Edit
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={() => handleDelete(note._id)}
                                                                className="text-error hover:bg-error/10"
                                                            >
                                                                <FiTrash2 />
                                                                Delete
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <h2 className="card-title text-lg mb-3 line-clamp-2">
                                                {note.title}
                                            </h2>

                                            <p className="text-base-content/70 text-sm line-clamp-4 mb-4">
                                                {note.description}
                                            </p>

                                            <div className="flex items-center justify-between text-xs text-base-content/60 pt-4 border-t border-base-300">
                                                <div className="flex items-center gap-1">
                                                    <FiCalendar />
                                                    {new Date(note.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FiClock />
                                                    {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredNotes.map((note, index) => (
                                <motion.div
                                    key={note._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="card bg-base-100 border border-base-300 hover:border-primary/50 transition-all duration-300"
                                >
                                    <div className="card-body">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-2 h-2 bg-success rounded-full"></div>
                                                    <span className="text-xs font-medium text-success uppercase tracking-wider">
                                                        {note.status || 'active'}
                                                    </span>
                                                    <span className="text-xs text-base-content/60">
                                                        {new Date(note.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
                                                <p className="text-base-content/70 line-clamp-2">{note.description}</p>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button
                                                    onClick={() => openUpdateModal(note)}
                                                    className="btn btn-sm btn-outline btn-primary"
                                                >
                                                    <FiEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(note._id)}
                                                    className="btn btn-sm btn-outline btn-error"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ManagePersonalNotes;