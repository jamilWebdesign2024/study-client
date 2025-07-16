import React from 'react';
import { FaBars, FaHome } from 'react-icons/fa';
import { Link, NavLink, Outlet } from 'react-router';
import useUserRole from '../../../../hooks/useUserRole';

const DashboardLayout = () => {
    const { role, roleLoading } = useUserRole();

    // Very light gradient colors for different roles
    const roleGradients = {
        admin: 'from-purple-100 to-blue-100',
        tutor: 'from-emerald-100 to-teal-100',
        student: 'from-amber-100 to-orange-100'
    };

    const currentGradient = roleGradients[role] || 'from-gray-100 to-gray-200';

    return (
        <div className="drawer lg:drawer-open bg-gray-50 min-h-screen">
            {/* Mobile Navbar with drawer toggle */}
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                {/* Top bar for mobile */}
                <div className={`lg:hidden flex justify-between items-center px-6 py-4 shadow-md sticky top-0 z-40 bg-gradient-to-r ${currentGradient}`}>
                    <label htmlFor="dashboard-drawer" className="btn btn-ghost btn-circle text-gray-700">
                        <FaBars className="text-xl" />
                    </label>
                    <Link to="/" className="text-2xl font-bold text-gray-700 cursor-pointer">
                        Study<span className="text-amber-500">Sphere</span>
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
                <aside className={`w-80 min-h-screen bg-gradient-to-b ${currentGradient}`}>
                    <div className="p-6 flex flex-col h-full">
                        {/* Profile at the absolute top */}
                        <div className="flex items-center space-x-3 bg-white/30 p-4 rounded-lg mb-8 shadow-sm">
                            <div className="avatar placeholder">
                                <div className="bg-gray-700 text-white rounded-full w-12">
                                    <span className="text-lg font-bold">{role?.charAt(0).toUpperCase()}</span>
                                </div>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">My Profile</p>
                                <p className="text-sm text-gray-600 capitalize">{role}</p>
                            </div>
                        </div>

                        {/* Logo below profile */}
                        <Link to="/" className="mb-8 text-center">
                            <div className="text-3xl font-bold text-gray-700 cursor-pointer">
                                Study<span className="text-amber-500">Sphere</span>
                            </div>
                            <div className="badge bg-gray-700 text-white mt-2 capitalize border-none">
                                {role} Dashboard
                            </div>
                        </Link>

                        {/* Navigation */}
                        <ul className="menu flex-1 space-y-1">
                            {/* Tutor Routes */}
                            {!roleLoading && role === 'tutor' && (
                                <>
                                    <li>
                                        <NavLink 
                                            to="/dashboard/createStudySession" 
                                            className="hover:bg-white/50 text-gray-700 rounded-lg transition-all duration-200"
                                            activeClassName="bg-white/70 font-semibold"
                                        >
                                            ✏️ Create Study Session
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/dashboard/viewAllStudy" 
                                            className="hover:bg-white/50 text-gray-700 rounded-lg transition-all duration-200"
                                            activeClassName="bg-white/70 font-semibold"
                                        >
                                            📚 View All Studies
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/dashboard/uploadMaterials" 
                                            className="hover:bg-white/50 text-gray-700 rounded-lg transition-all duration-200"
                                            activeClassName="bg-white/70 font-semibold"
                                        >
                                            📤 Upload Materials
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/dashboard/viewAllMaterials" 
                                            className="hover:bg-white/50 text-gray-700 rounded-lg transition-all duration-200"
                                            activeClassName="bg-white/70 font-semibold"
                                        >
                                            📂 View All Materials
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
                                            className="hover:bg-white/50 text-gray-700 rounded-lg transition-all duration-200"
                                            activeClassName="bg-white/70 font-semibold"
                                        >
                                            🗓️ Booked Sessions
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/dashboard/createNote" 
                                            className="hover:bg-white/50 text-gray-700 rounded-lg transition-all duration-200"
                                            activeClassName="bg-white/70 font-semibold"
                                        >
                                            ✍️ Create Note
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/dashboard/managePersonalNotes" 
                                            className="hover:bg-white/50 text-gray-700 rounded-lg transition-all duration-200"
                                            activeClassName="bg-white/70 font-semibold"
                                        >
                                            📝 My Notes
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/dashboard/viewAllStudy/student" 
                                            className="hover:bg-white/50 text-gray-700 rounded-lg transition-all duration-200"
                                            activeClassName="bg-white/70 font-semibold"
                                        >
                                            🔍 Available Studies
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
                                            className="hover:bg-white/50 text-gray-700 rounded-lg transition-all duration-200"
                                            activeClassName="bg-white/70 font-semibold"
                                        >
                                            👥 Manage Users
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/dashboard/viewAllStudyAdmin" 
                                            className="hover:bg-white/50 text-gray-700 rounded-lg transition-all duration-200"
                                            activeClassName="bg-white/70 font-semibold"
                                        >
                                            📊 All Studies
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink 
                                            to="/dashboard/view-all-materials-admin" 
                                            className="hover:bg-white/50 text-gray-700 rounded-lg transition-all duration-200"
                                            activeClassName="bg-white/70 font-semibold"
                                        >
                                            🗄️ All Materials
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>

                        {/* Bottom section - Back to Home */}
                        <div className="mt-auto pt-4 border-t border-gray-300">
                            <Link 
                                to="/" 
                                className="flex items-center justify-center space-x-2 hover:bg-white/50 p-3 rounded-lg transition-all duration-200 text-gray-700"
                            >
                                <FaHome className="text-lg" />
                                <span className="font-medium">Back to Home</span>
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default DashboardLayout;