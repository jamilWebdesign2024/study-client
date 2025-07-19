
import React from 'react';
import { FaBars, FaHome, FaUser, FaBookOpen, FaUpload, FaUsers, FaClipboardCheck, FaArrowLeft, FaChalkboardTeacher, FaUserGraduate, FaFileAlt, FaTasks } from 'react-icons/fa';
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import { BsStickyFill } from "react-icons/bs";
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';

const DashboardLayout = () => {
    const { user } = useAuth();
    const { role, roleLoading } = useUserRole();
    const navigate = useNavigate();

    if (roleLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
        );
    }

    const renderRoleSidebar = () => {
        return (
            <>
                {/* Common to all roles */}
                <li>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' : 'hover:bg-blue-50 text-gray-700'}`
                        }
                    >
                        <FaHome className="text-lg" /> Overview
                    </NavLink>
                </li>
                {/* <li>
                    <NavLink
                        to="/dashboard/profile"
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' : 'hover:bg-blue-50 text-gray-700'}`
                        }
                    >
                        <FaUser className="text-lg" /> My Profile
                    </NavLink>
                </li> */}

                {/* Student Routes */}
                {!roleLoading && role === 'student' && (
                    <>
                        <li>
                            <NavLink
                                to="/dashboard/viewBookedSession"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-md' : 'hover:bg-green-50 text-gray-700'}`
                                }
                            >
                                <FaClipboardCheck className="text-lg" /> View Booked Session
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/dashboard/createNote"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md' : 'hover:bg-purple-50 text-gray-700'}`
                                }
                            >
                                <BsStickyFill className="text-lg" /> Create Note
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/dashboard/managePersonalNotes"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md' : 'hover:bg-amber-50 text-gray-700'}`
                                }
                            >
                                <FaTasks className="text-lg" /> Manage Personal Notes
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/dashboard/viewAllStudy/student"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md' : 'hover:bg-indigo-50 text-gray-700'}`
                                }
                            >
                                <FaBookOpen className="text-lg" /> View All Study
                            </NavLink>
                        </li>
                    </>
                )}

                {/* Tutor Routes */}
                {!roleLoading && role === 'tutor' && (
                    <>
                        <li>
                            <NavLink
                                to="/dashboard/createStudySession"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md' : 'hover:bg-indigo-50 text-gray-700'}`
                                }
                            >
                                <FaBookOpen className="text-lg" /> Create Study Session
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/dashboard/viewAllStudy"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md' : 'hover:bg-blue-50 text-gray-700'}`
                                }
                            >
                                <FaChalkboardTeacher className="text-lg" /> View All Study
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/dashboard/uploadMaterials"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md' : 'hover:bg-purple-50 text-gray-700'}`
                                }
                            >
                                <FaUpload className="text-lg" /> Upload Materials
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/dashboard/viewAllMaterials"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-teal-500 to-green-600 text-white shadow-md' : 'hover:bg-teal-50 text-gray-700'}`
                                }
                            >
                                <FaFileAlt className="text-lg" /> View All Materials
                            </NavLink>
                        </li>
                    </>
                )}

                {/* Admin Routes */}
                {!roleLoading && role === 'admin' && (
                    <>

                        <li>
                            <NavLink
                                to="/dashboard/admin-profile"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' : 'hover:bg-blue-50 text-gray-700'}`
                                }
                            >
                                <FaUser className="text-lg" /> My Profile
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/dashboard/viewAllUsers"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md' : 'hover:bg-purple-50 text-gray-700'}`
                                }
                            >
                                <FaUsers className="text-lg" /> View All Users
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/dashboard/viewAllStudyAdmin"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md' : 'hover:bg-indigo-50 text-gray-700'}`
                                }
                            >
                                <FaBookOpen className="text-lg" /> View All Study
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/dashboard/view-all-materials-admin"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md' : 'hover:bg-amber-50 text-gray-700'}`
                                }
                            >
                                <FaFileAlt className="text-lg" /> View All Materials
                            </NavLink>
                        </li>
                    </>
                )}

                {/* Back to Home */}
                <li className="mt-4 border-t border-gray-200 pt-3">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gray-100 text-gray-700 w-full text-left"
                    >
                        <FaArrowLeft className="text-lg" /> Back to Home
                    </button>
                </li>
            </>
        );
    };

    return (
        <div className="drawer lg:drawer-open bg-gray-50 min-h-screen">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                {/* Mobile top navbar */}
                <div className="lg:hidden flex justify-between items-center px-4 py-3 shadow-md bg-gradient-to-r from-blue-600 to-indigo-700 text-white sticky top-0 z-40">
                    <label htmlFor="dashboard-drawer" className="btn btn-ghost btn-circle text-white">
                        <FaBars className="text-xl" />
                    </label>
                    <Link to="/" className="text-2xl font-bold text-white cursor-pointer">
                        Study<span className="text-amber-300">Sphere</span>
                    </Link>
                </div>

                {/* Main content */}
                <div className="p-4 md:p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
                    <div className="">
                        <Outlet />
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="drawer-side z-50">
                <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
                <aside className="w-72 bg-white border-r border-gray-200 min-h-screen p-4 flex flex-col">
                    {/* Logo for desktop */}
                    <div className="hidden lg:block mb-6 px-2">
                        <Link to="/" className="text-2xl font-bold text-blue-600 cursor-pointer">
                            Study<span className="text-indigo-700">Sphere</span>
                        </Link>
                    </div>

                    {/* User profile */}
                    <div className="text-center mb-6 px-2 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                        <img
                            src={user?.photoURL || "https://i.ibb.co/6c8kdLyH/phoooot.jpg"}
                            alt="Profile"
                            className="w-16 h-16 rounded-full mx-auto border-4 border-white shadow-md"
                        />
                        <h2 className="mt-3 font-semibold text-gray-800">{user?.displayName || 'User'}</h2>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                role === 'tutor' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'
                            }`}>
                            {role} Panel
                        </span>
                    </div>

                    {/* Navigation */}
                    <ul className="menu flex-1 px-2 space-y-1 overflow-y-auto">{renderRoleSidebar()}</ul>

                    {/* Footer */}
                    <div className="px-2 pt-4 border-t border-gray-200 mt-auto">
                        <p className="text-xs text-gray-500 text-center">
                            © {new Date().getFullYear()} StudySphere. All rights reserved.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default DashboardLayout;
