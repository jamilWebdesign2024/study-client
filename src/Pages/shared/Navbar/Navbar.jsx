import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import Swal from "sweetalert2";
import {
  FaBars, FaTimes, FaUserCircle, FaGraduationCap,
  FaChalkboardTeacher, FaHome
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import ThemeToggle from "../../ThemeToggle";

const Navbar = () => {
  const { user, signOutUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const NavItem = ({ to, icon: Icon, label, end = false }) => (
    <NavLink
      to={to}
      end={end}
      children={({ isActive }) => {
        const activeStyles = isActive
          ? "text-primary font-semibold bg-primary/10"
          : "hover:bg-base-200 text-base-content";
        const underlineStyles = isActive ? "w-3/4" : "w-0 group-hover:w-3/4";

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
      confirmButtonColor: "hsl(var(--er))",
      cancelButtonColor: "hsl(var(--in))",
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
    <nav className="bg-base-100 border-b border-base-300 sticky top-0 z-50 shadow-sm w-full">
      {/* Container full width but with padding */}
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">
          
          {/* Left - Logo */}
          <Link
            to="/"
            className="text-2xl font-bold flex items-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-lg mr-2">Study</span>
            <span className="text-base-content">Sphere</span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex flex-1 justify-center">
            <ul className="flex gap-2">{navItems}</ul>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <ThemeToggle />

            {!user ? (
              <div className="hidden md:flex items-center gap-3">
                <NavLink
                  to="/login"
                  className="px-4 btn btn-outline rounded-xl py-2 text-base-content hover:bg-secondary/5 hover:text-primary transition-colors font-medium"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="px-4 py-2 btn btn-primary text-white rounded-lg font-medium shadow-md"
                >
                  Sign Up
                </NavLink>
              </div>
            ) : (
              <div className="hidden md:block relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 focus:outline-none group"
                >
                  <div className="relative">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="profile"
                        className="w-9 h-9 rounded-full object-cover border-2 border-base-100 shadow-md group-hover:border-primary transition-all"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-base-200 flex items-center justify-center border-2 border-base-100 shadow-md group-hover:border-primary transition-all">
                        <FaUserCircle className="text-2xl text-base-content" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-base-100"></div>
                  </div>
                  <span className="text-base-content font-medium hidden lg:inline-block">
                    {user.displayName?.split(' ')[0] || 'User'}
                  </span>
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-base-100 rounded-xl shadow-xl ring-1 ring-base-300 z-50 overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-primary to-secondary text-white">
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
                        className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-base-200 text-base-content transition-all"
                        onClick={() => setShowDropdown(false)}
                      >
                        Dashboard
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-base-200 text-base-content transition-all"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden ml-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-base-content hover:bg-base-200 transition-all"
              >
                {isMenuOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-base-100 border-t border-base-300 shadow-inner">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <div className="flex justify-center mb-2">
              <ul className="w-full">{navItems}</ul>
            </div>

            {!user ? (
              <div className="pt-2 border-t border-base-300">
                <NavLink
                  to="/login"
                  className="block px-4 btn-outline py-3 rounded-lg text-base font-medium text-base-content hover:bg-base-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-white btn btn-primary mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </NavLink>
              </div>
            ) : (
              <div className="pt-2 border-t border-base-300">
                <div className="flex items-center px-4 py-3 rounded-lg bg-base-200 mb-2">
                  {user.photoURL ? (
                    <div className="relative mr-3">
                      <img
                        src={user.photoURL}
                        alt="profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-base-100 shadow"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-base-100"></div>
                    </div>
                  ) : (
                    <div className="relative mr-3">
                      <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center border-2 border-base-100 shadow">
                        <FaUserCircle className="text-xl text-base-content" />
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-base-content">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-xs text-base-content/70">
                      {user.email}
                    </p>
                  </div>
                </div>
                <NavLink
                  to="/dashboard"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-base-content hover:bg-base-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-base-content hover:bg-base-200"
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
