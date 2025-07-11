import React from 'react';
import { FaBars } from 'react-icons/fa';
import { Link, NavLink, Outlet } from 'react-router';


const DashboardLayout = () => {
    return (
        <div className="drawer lg:drawer-open bg-base-100 text-neutral min-h-screen">
            {/* ✅ Mobile Navbar with drawer toggle */}
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                {/* Top bar for mobile */}
                <div className="lg:hidden flex justify-between items-center px-4 py-2 shadow bg-white sticky top-0 z-40">
                    <label htmlFor="dashboard-drawer" className="btn btn-ghost text-lg">
                        <FaBars />
                    </label>
                    <Link to="/" className="text-2xl font-bold text-primary cursor-pointer">
                        Study<span className="text-secondary">Sphere</span>
                    </Link>
                </div>

                {/* Main Content */}
                <div className="p-4">
                    <Outlet></Outlet> {/* 👉 This renders nested dashboard pages */}
                </div>
            </div>

            {/* ✅ Sidebar */}
            <div className="drawer-side z-50">
                <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
                <aside className="w-72 bg-white border-r border-gray-200 min-h-screen p-4">
                    <Link to="/"><div className="text-2xl font-bold text-primary mb-6 text-center cursor-pointer">
                        Study<span className="text-secondary">Sphere</span>
                    </div>
                    </Link>

                    <ul className="menu text-base-content space-y-1">
                        {/* 👉 Sidebar links will be added later like below */}

                        <li>
                            <NavLink to="/dashboard/createStudySession" className="...">Create study session
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/viewAllStudy" className="...">View all study</NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/viewAllStudy" className="...">View all study</NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/viewAllStudy" className="...">View all study</NavLink>
                        </li>

                    </ul>
                </aside>
            </div>
        </div>
    );
};

export default DashboardLayout;



// Create study session
// View all study sessions created by a tutor
// Upload materials
// View all materials
