import React from 'react';
import { FaBars } from 'react-icons/fa';
import { Link, NavLink, Outlet } from 'react-router';
import useUserRole from '../hooks/useUserRole';

const DashboardLayout = () => {
    const { role, roleLoading } = useUserRole();

    // Gradient colors for different roles
    const roleGradients = {
        admin: 'from-purple-600 to-blue-500',
        tutor: 'from-emerald-600 to-teal-500',
        student: 'from-amber-600 to-orange-500'
    };

    const currentGradient = roleGradients[role] || 'from-gray-600 to-gray-500';

    return (
        <div className="drawer lg:drawer-open bg-gray-50 min-h-screen">
            {/* Mobile Navbar with drawer toggle */}
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                {/* Top bar for mobile */}
                <div className={`lg:hidden flex justify-between items-center px-6 py-4 shadow-md sticky top-0 z-40 bg-gradient-to-r ${currentGradient}`}>
                    <label htmlFor="dashboard-drawer" className="btn btn-ghost btn-circle text-white">
                        <FaBars className="text-xl" />
                    </label>
                    <Link to="/" className="text-2xl font-bold text-white cursor-pointer">
                        Study<span className="text-amber-300">Sphere</span>
                    </Link>
                </div>

                {/* Main Content */}
                <div className="p-6">
                    <Outlet />
                </div>
            </div>

            {/* Sidebar */}
            <div className="drawer-side z-50">
                <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
                <aside className={`w-80 min-h-screen bg-gradient-to-b ${currentGradient} text-white`}>
                    <div className="p-6 flex flex-col h-full">
                        {/* Logo */}
                        <Link to="/" className="mb-8">
                            <div className="text-3xl font-bold text-white text-center cursor-pointer">
                                Study<span className="text-amber-300">Sphere</span>
                            </div>
                            {role && (
                                <div className="badge badge-accent mt-2 capitalize">
                                    {role} Dashboard
                                </div>
                            )}
                        </Link>

                        {/* Navigation */}
                        <ul className="menu flex-1 space-y-2">
                            {/* Tutor Routes */}
                            {!roleLoading && role === 'tutor' && (
                                <>
                                    <li>
                                        <NavLink 
                                            to="/dashboard/createStudySession" 
                                            className="hover:bg-white/20 rounded-lg transition-all"
                                            activeClassName="bg-white/30 font-semibold"
                                        >
                                            Create Study Session
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/dashboard/viewAllStudy" 
                                            className="hover:bg-white/20 rounded-lg transition-all"
                                            activeClassName="bg-white/30 font-semibold"
                                        >
                                            View All Studies
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/dashboard/uploadMaterials" 
                                            className="hover:bg-white/20 rounded-lg transition-all"
                                            activeClassName="bg-white/30 font-semibold"
                                        >
                                            Upload Materials
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/dashboard/viewAllMaterials" 
                                            className="hover:bg-white/20 rounded-lg transition-all"
                                            activeClassName="bg-white/30 font-semibold"
                                        >
                                            View All Materials
                                        </NavLink>
                                    </li>
                                </>
                            )}

                            {/* Student Routes */}
                            {!roleLoading && role === "student" && (
                                <>
                                    <li>
                                        <NavLink 
                                            to="/dashboard/viewBookedSession" 
                                            className="hover:bg-white/20 rounded-lg transition-all"
                                            activeClassName="bg-white/30 font-semibold"
                                        >
                                            Booked Sessions
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/dashboard/createNote" 
                                            className="hover:bg-white/20 rounded-lg transition-all"
                                            activeClassName="bg-white/30 font-semibold"
                                        >
                                            Create Note
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/dashboard/managePersonalNotes" 
                                            className="hover:bg-white/20 rounded-lg transition-all"
                                            activeClassName="bg-white/30 font-semibold"
                                        >
                                            My Notes
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/dashboard/viewAllStudy/student" 
                                            className="hover:bg-white/20 rounded-lg transition-all"
                                            activeClassName="bg-white/30 font-semibold"
                                        >
                                            Available Studies
                                        </NavLink>
                                    </li>
                                </>
                            )}

                            {/* Admin Routes */}
                            {!roleLoading && role === 'admin' && (
                                <>
                                    <li>
                                        <NavLink 
                                            to="/dashboard/viewAllUsers" 
                                            className="hover:bg-white/20 rounded-lg transition-all"
                                            activeClassName="bg-white/30 font-semibold"
                                        >
                                            Manage Users
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/dashboard/viewAllStudyAdmin" 
                                            className="hover:bg-white/20 rounded-lg transition-all"
                                            activeClassName="bg-white/30 font-semibold"
                                        >
                                            All Studies
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/dashboard/view-all-materials-admin" 
                                            className="hover:bg-white/20 rounded-lg transition-all"
                                            activeClassName="bg-white/30 font-semibold"
                                        >
                                            All Materials
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>

                        {/* Bottom section */}
                        <div className="mt-auto pt-4 border-t border-white/20">
                            <Link 
                                to="/profile" 
                                className="flex items-center space-x-3 hover:bg-white/20 p-3 rounded-lg transition-all"
                            >
                                <div className="avatar placeholder">
                                    <div className="bg-white text-neutral-content rounded-full w-10">
                                        <span className="text-xs">{role?.charAt(0).toUpperCase()}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-medium">My Profile</p>
                                    <p className="text-sm opacity-80 capitalize">{role}</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default DashboardLayout;