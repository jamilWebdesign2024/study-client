import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { FaBars, FaTimes, FaUserCircle, FaGraduationCap, FaChalkboardTeacher, FaHome } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const Navbar = () => {
  const { user, signOutUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // NavItem component to properly scope isActive
  const NavItem = ({ to, icon: Icon, label, end = false }) => (
    <NavLink 
      to={to}
      end={end}
      children={({ isActive }) => {
        const activeStyles = isActive 
          ? 'text-primary font-semibold bg-primary/10' 
          : 'hover:bg-gray-100 text-gray-700 hover:text-primary';
        const underlineStyles = isActive ? 'w-3/4' : 'w-0 group-hover:w-3/4';
        
        return (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all relative group ${activeStyles}`}>
            <Icon className="text-lg" />
            {label}
            <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-300 ${underlineStyles}`}></span>
          </div>
        );
      }}
      onClick={() => setIsMenuOpen(false)}
    />
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, log me out!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await signOutUser();
      setShowDropdown(false);
      setIsMenuOpen(false);
      Swal.fire({
        icon: "success",
        title: "Logged out successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/");
    }
  };

  // Common nav items with icons using NavItem component
  const navItems = (
    <>
      <li className="mx-1">
        <NavItem to="/" icon={FaHome} label="Home" end />
      </li>
      <li className="mx-1">
        <NavItem to="/tutors" icon={FaChalkboardTeacher} label="Tutors" />
      </li>
      <li className="mx-1">
        <NavItem to="/all-study-sessions" icon={FaGraduationCap} label="Study Sessions" />
      </li>
    </>
  );

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side - Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold flex items-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1 rounded-lg mr-2">Study</span>
            <span className="text-gray-800">Sphere</span>
          </Link>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex mx-4 flex-1 justify-center">
            <ul className="flex">
              {navItems}
            </ul>
          </div>

          {/* Right side - Auth controls */}
          <div className="flex items-center">
            {!user ? (
              <div className="hidden md:flex items-center gap-3">
                <NavLink 
                  to="/login" 
                  className="px-4 py-2 text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/signup" 
                  className="px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-md"
                >
                  Sign Up
                </NavLink>
              </div>
            ) : (
              <div className="hidden md:block relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 focus:outline-none group"
                  aria-label="User menu"
                  aria-expanded={showDropdown}
                >
                  <div className="relative">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="profile"
                        className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-md group-hover:border-primary transition-all"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow-md group-hover:border-primary transition-all">
                        <FaUserCircle className="text-2xl text-gray-600" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="text-gray-700 font-medium hidden lg:inline-block">
                    {user.displayName?.split(' ')[0] || 'User'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl ring-1 ring-gray-200 z-50 overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-primary to-blue-600 text-white">
                      <div className="flex items-center gap-3">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            className="w-12 h-12 rounded-full border-2 border-white"
                            alt="user"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border-2 border-white">
                            <FaUserCircle className="text-3xl text-white" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold truncate">
                            {user.displayName || "User"}
                          </h3>
                          <p className="text-xs text-white/90 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <NavLink
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 transition-all"
                        onClick={() => setShowDropdown(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        Dashboard
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden ml-4">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none transition-all"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <FaTimes className="h-5 w-5" />
                ) : (
                  <FaBars className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-inner">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <div className="flex justify-center mb-2">
              <ul className="w-full">
                {navItems}
              </ul>
            </div>
            
            {!user ? (
              <div className="pt-2 border-t border-gray-100">
                <NavLink 
                  to="/login" 
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/signup" 
                  className="block px-4 py-3 rounded-lg text-base font-medium text-white bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </NavLink>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center px-4 py-3 rounded-lg bg-gray-50 mb-2">
                  {user.photoURL ? (
                    <div className="relative mr-3">
                      <img
                        src={user.photoURL}
                        alt="profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  ) : (
                    <div className="relative mr-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow">
                        <FaUserCircle className="text-xl text-gray-600" />
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </div>
                <NavLink 
                  to="/dashboard" 
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;