import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaCheck, FaTimes, FaUsers, FaClock, FaChartPie, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AdminDashboard = () => {
    const axiosSecure = useAxiosSecure();
    const [activeTab, setActiveTab] = useState('overview');

    const { data: sessions = [] } = useQuery({
        queryKey: ['admin-sessions'],
        queryFn: async () => {
            const res = await axiosSecure.get('/sessions/admin');
            console.log(res.data);
            
            return res.data;
        }
    });

    // Calculate statistics
    const approvedSessions = sessions.filter(session => session.status === 'approved');
    const pendingSessions = sessions.filter(session => session.status === 'pending');
    const rejectedSessions = sessions.filter(session => session.status === 'rejected');

    const totalSessions = sessions.length;
    const totalStudents = sessions.reduce((sum, session) => sum + (session.enrolledStudents || 0), 0);
    const upcomingSessions = sessions.filter(session => {
        return new Date(session.registrationStartDate) > new Date();
    });

    return (
        <motion.div 
            className="max-w-7xl mx-auto px-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold text-primary mb-6">Admin Dashboard</h1>
            
            {/* Dashboard Tabs */}
            <div className="tabs tabs-boxed mb-8">
                <button 
                    className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button 
                    className={`tab ${activeTab === 'sessions' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('sessions')}
                >
                    All Sessions
                </button>
                <button 
                    className={`tab ${activeTab === 'approvals' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('approvals')}
                >
                    Pending Approvals
                </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Stats Cards */}
                    <div className="stats bg-white shadow">
                        <div className="stat">
                            <div className="stat-figure text-primary">
                                <FaChartPie className="text-2xl" />
                            </div>
                            <div className="stat-title">Total Sessions</div>
                            <div className="stat-value">{totalSessions}</div>
                        </div>
                    </div>

                    <div className="stats bg-white shadow">
                        <div className="stat">
                            <div className="stat-figure text-green-500">
                                <FaCheck className="text-2xl" />
                            </div>
                            <div className="stat-title">Approved</div>
                            <div className="stat-value">{approvedSessions.length}</div>
                        </div>
                    </div>

                    <div className="stats bg-white shadow">
                        <div className="stat">
                            <div className="stat-figure text-yellow-500">
                                <FaClock className="text-2xl" />
                            </div>
                            <div className="stat-title">Pending</div>
                            <div className="stat-value">{pendingSessions.length}</div>
                        </div>
                    </div>

                    <div className="stats bg-white shadow">
                        <div className="stat">
                            <div className="stat-figure text-red-500">
                                <FaTimes className="text-2xl" />
                            </div>
                            <div className="stat-title">Rejected</div>
                            <div className="stat-value">{rejectedSessions.length}</div>
                        </div>
                    </div>

                    <div className="stats bg-white shadow col-span-2">
                        <div className="stat">
                            <div className="stat-figure text-blue-500">
                                <FaUsers className="text-2xl" />
                            </div>
                            <div className="stat-title">Total Students Enrolled</div>
                            <div className="stat-value">{totalStudents}</div>
                        </div>
                    </div>

                    <div className="stats bg-white shadow col-span-2">
                        <div className="stat">
                            <div className="stat-figure text-purple-500">
                                <FaCalendarAlt className="text-2xl" />
                            </div>
                            <div className="stat-title">Upcoming Sessions</div>
                            <div className="stat-value">{upcomingSessions.length}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* All Sessions Tab */}
            {activeTab === 'sessions' && (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Tutor</th>
                                <th>Status</th>
                                <th>Students</th>
                                <th>Dates</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map(session => (
                                <tr key={session._id}>
                                    <td>{session.sessionTitle}</td>
                                    <td>{session.tutorName}</td>
                                    <td>
                                        <span className={`badge ${
                                            session.status === 'approved' ? 'badge-success' :
                                            session.status === 'pending' ? 'badge-warning' : 'badge-error'
                                        }`}>
                                            {session.status}
                                        </span>
                                    </td>
                                    <td>{session.enrolledStudents || 0}</td>
                                    <td>
                                        {new Date(session.classStartDate).toLocaleDateString()} - {' '}
                                        {new Date(session.classEndDate).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <button className="btn btn-xs btn-info mr-2">View</button>
                                        {session.status === 'approved' && (
                                            <button className="btn btn-xs btn-warning">Edit</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pending Approvals Tab */}
            {activeTab === 'approvals' && (
                <div className="space-y-4">
                    {pendingSessions.length === 0 ? (
                        <div className="alert alert-info">
                            No pending sessions for approval
                        </div>
                    ) : (
                        pendingSessions.map(session => (
                            <div key={session._id} className="card bg-white shadow-lg">
                                <div className="card-body">
                                    <h2 className="card-title">{session.sessionTitle}</h2>
                                    <p>By: {session.tutorName} ({session.tutorEmail})</p>
                                    <p>Dates: {new Date(session.classStartDate).toLocaleDateString()} - {' '}
                                    {new Date(session.classEndDate).toLocaleDateString()}</p>
                                    <div className="card-actions justify-end mt-4">
                                        <button className="btn btn-success btn-sm">
                                            <FaCheck /> Approve
                                        </button>
                                        <button className="btn btn-error btn-sm">
                                            <FaTimes /> Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default AdminDashboard;