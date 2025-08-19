import React from 'react';
import {
    FaBars, FaHome, FaUser, FaBookOpen, FaUpload,
    FaUsers, FaClipboardCheck, FaArrowLeft,
    FaChalkboardTeacher, FaFileAlt, FaTasks
} from 'react-icons/fa';
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import { BsStickyFill } from "react-icons/bs";
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';
import Loading from '../Components/Loading';

const DashboardLayout = () => {
    const { user } = useAuth();
    const { role, roleLoading } = useUserRole();
    const navigate = useNavigate();

    if (roleLoading) {
        return <Loading />;
    }

    const renderRoleSidebar = () => (
        <>
            {/* Common to all roles */}
            <li>
                <NavLink
                    to="/dashboard"
                    className='flex items-center gap-3 p-3 rounded-lg transition-all'
                >
                    <FaHome className="text-lg" /> Overview
                </NavLink>
            </li>

            {/* Student Routes */}
            {!roleLoading && role === 'student' && (
                <>
                    <NavLink
                        to="/dashboard/student-profile"
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg transition-all 
              ${isActive ? 'bg-primary text-primary-content shadow-md' : 'hover:bg-base-200'}`
                        }
                    >
                        <FaUser className="text-lg" /> My Profile
                    </NavLink>

                    <li>
                        <NavLink
                            to="/dashboard/viewBookedSession"
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-3 rounded-lg transition-all 
                ${isActive ? 'bg-primary text-primary-content shadow-md' : 'hover:bg-base-200'}`
                            }
                        >
                            <FaClipboardCheck className="text-lg" /> View Booked Session
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/dashboard/createNote"
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-3 rounded-lg transition-all 
                ${isActive ? 'bg-primary text-primary-content shadow-md' : 'hover:bg-base-200'}`
                            }
                        >
                            <BsStickyFill className="text-lg" /> Create Note
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/dashboard/managePersonalNotes"
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-3 rounded-lg transition-all 
                ${isActive ? 'bg-primary text-primary-content shadow-md' : 'hover:bg-base-200'}`
                            }
                        >
                            <FaTasks className="text-lg" /> Manage Personal Notes
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/dashboard/viewAllStudy/student"
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-3 rounded-lg transition-all 
                ${isActive ? 'bg-primary text-primary-content shadow-md' : 'hover:bg-base-200'}`
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
                    <NavLink
                        to="/dashboard/tutor-profile"
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg transition-all 
              ${isActive ? 'bg-primary text-primary-content shadow-md' : 'hover:bg-base-200'}`
                        }
                    >
                        <FaUser className="text-lg" /> My Profile
                    </NavLink>

                    <li>
                        <NavLink
                            to="/dashboard/createStudySession"
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-3 rounded-lg transition-all 
                ${isActive ? 'bg-primary text-primary-content shadow-md' : 'hover:bg-base-200'}`
                            }
                        >
                            <FaBookOpen className="text-lg" /> Create Study Session
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/dashboard/viewAllStudy"
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-3 rounded-lg transition-all 
                ${isActive ? 'bg-primary text-primary-content shadow-md' : 'hover:bg-base-200'}`
                            }
                        >
                            <FaChalkboardTeacher className="text-lg" /> View All Study
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/dashboard/uploadMaterials"
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-3 rounded-lg transition-all 
                ${isActive ? 'bg-primary text-primary-content shadow-md' : 'hover:bg-base-200'}`
                            }
                        >
                            <FaUpload className="text-lg" /> Upload Materials
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/dashboard/viewAllMaterials"
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-3 rounded-lg transition-all 
                ${isActive ? 'bg-primary text-primary-content shadow-md' : 'hover:bg-base-200'}`
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
                                `flex items-center gap-3 p-3 rounded-lg transition-all 
                ${isActive ? 'bg-primary text-primary-content shadow-md' : 'hover:bg-base-200'}`
                            }
                        >
                            <FaUser className="text-lg" /> My Profile
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/dashboard/viewAllUsers"
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-3 rounded-lg transition-all 
                ${isActive ? 'bg-primary text-primary-content shadow-md' : 'hover:bg-base-200'}`
                            }
                        >
                            <FaUsers className="text-lg" /> View All Users
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/dashboard/viewAllStudyAdmin"
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-3 rounded-lg transition-all 
                ${isActive ? 'bg-primary text-primary-content shadow-md' : 'hover:bg-base-200'}`
                            }
                        >
                            <FaBookOpen className="text-lg" /> View All Study
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/dashboard/view-all-materials-admin"
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-3 rounded-lg transition-all 
                ${isActive ? 'bg-primary text-primary-content shadow-md' : 'hover:bg-base-200'}`
                            }
                        >
                            <FaFileAlt className="text-lg" /> View All Materials
                        </NavLink>
                    </li>
                </>
            )}

            {/* Back to Home */}
            <li className="mt-4 border-t border-base-300 pt-3">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-base-200 w-full text-left"
                >
                    <FaArrowLeft className="text-lg" /> Back to Home
                </button>
            </li>
        </>
    );

    return (
        <div className="drawer lg:drawer-open bg-base-100 min-h-screen">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                {/* Mobile top navbar */}
                <div className="lg:hidden flex justify-between items-center px-4 py-3 shadow-md bg-primary text-primary-content sticky top-0 z-40">
                    <label htmlFor="dashboard-drawer" className="btn btn-ghost btn-circle text-primary-content">
                        <FaBars className="text-xl" />
                    </label>
                    <Link to="/" className="text-2xl font-bold cursor-pointer">
                        Study<span className="text-secondary">Sphere</span>
                    </Link>
                </div>

                {/* Main content */}
                <div className="p-4 md:p-6 bg-base-200 min-h-screen">
                    <Outlet />
                </div>
            </div>

            {/* Sidebar */}
            <div className="drawer-side z-50">
                <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
                <aside className="w-72 bg-base-100 border-r border-base-300 min-h-screen p-4 flex flex-col">
                    {/* Logo */}
                    <div className="hidden lg:block mb-6 px-2">
                        <Link to="/" className="text-2xl font-bold text-primary cursor-pointer">
                            Study<span className="text-secondary">Sphere</span>
                        </Link>
                    </div>

                    {/* User profile */}
                    <div className="text-center mb-6 px-2 py-4 bg-base-200 rounded-xl">
                        <img
                            src={user?.photoURL || "https://i.ibb.co/6c8kdLyH/phoooot.jpg"}
                            alt="Profile"
                            className="w-16 h-16 rounded-full mx-auto border-4 border-base-100 shadow-md"
                        />
                        <h2 className="mt-3 font-semibold">{user?.displayName || 'User'}</h2>
                        <p className="text-sm opacity-70">{user?.email}</p>
                        <span className="badge badge-outline mt-2 capitalize">{role} Panel</span>
                    </div>

                    {/* Navigation */}
                    <ul className="menu flex-1 px-2 space-y-1 overflow-y-auto">{renderRoleSidebar()}</ul>

                    {/* Footer */}
                    <div className="px-2 pt-4 border-t border-base-300 mt-auto">
                        <p className="text-xs opacity-70 text-center">
                            © {new Date().getFullYear()} StudySphere. All rights reserved.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default DashboardLayout;
