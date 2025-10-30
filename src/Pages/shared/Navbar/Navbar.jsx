import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import Swal from "sweetalert2";
import {
  FaBars, FaTimes, FaUserCircle, FaGraduationCap,
  FaHome, FaCaretDown
} from "react-icons/fa";
import { LiaBlogger } from "react-icons/lia";
import useAuth from "../../../hooks/useAuth";
import ThemeToggle from "../../ThemeToggle";
import { MdRoundaboutLeft } from "react-icons/md";
import { MdDashboard } from "react-icons/md";

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
      className="flex items-center gap-2"
      children={({ isActive }) => {
        const activeStyles = isActive
          ? "text-primary bg-primary/10 font-semibold"
          : "hover:text-primary hover:bg-base-200";
        return (
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${activeStyles}`}
          >
            <Icon className="text-sm" />
            <span>{label}</span>
          </div>
        );
      }}
      onClick={() => setIsMenuOpen(false)}
    />
  );

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
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (result.isConfirmed) {
      await signOutUser();
      setShowDropdown(false);
      setIsMenuOpen(false);
      Swal.fire({ icon: "success", title: "Logged Out", timer: 1200, showConfirmButton: false });
      navigate("/");
    }
  };

  const navItems = (
    <>
      <li><NavItem to="/" icon={FaHome} label="Home" end /></li>
      <li><NavItem to="/all-study-sessions" icon={FaGraduationCap} label="Sessions" /></li>
      <li><NavItem to="/blog" icon={LiaBlogger} label="Blog" /></li>
      <li><NavItem to="/about" icon={MdRoundaboutLeft} label="About" /></li>
      {user && (
        <li>
          <NavLink
            to="/dashboard"
            className="flex gap-2 px-3 py-2 rounded-lg text-sm hover:bg-base-200"
            onClick={() => setIsMenuOpen(false)}
          >
            <MdDashboard />
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <nav className="bg-base-100/95 backdrop-blur-lg border-b border-base-300 sticky top-0 z-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-16 w-full">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
            <div className="bg-primary p-2 rounded-xl shadow-lg transition-all duration-300 text-primary-content">
              <FaGraduationCap className="text-xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary">StudySphere</span>
              <span className="text-xs text-base-content/60 -mt-1">Learn & Grow</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex gap-1 border border-base-300 bg-base-200/50 rounded-xl px-3 py-1">
            {navItems}
          </ul>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {!user ? (
              <div className="hidden md:flex items-center gap-3">
                <NavLink to="/login" className="text-sm px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg">
                  Login
                </NavLink>
                <NavLink to="/signup" className="text-sm px-4 py-2 bg-primary text-white rounded-lg">
                  Sign Up
                </NavLink>
              </div>
            ) : (
              <div ref={dropdownRef} className="hidden md:block relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-base-200 text-sm"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} className="w-8 h-8 rounded-lg object-cover" />
                  ) : <FaUserCircle className="text-lg" />}
                  <FaCaretDown className={`text-xs transition ${showDropdown ? "rotate-180" : ""}`} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-base-100 rounded-lg shadow-lg border border-base-300 p-2 z-50">
                    <NavLink to="/profile" className="block px-3 py-2 rounded-lg hover:bg-base-200 text-sm" onClick={() => setShowDropdown(false)}>
                      Profile
                    </NavLink>
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-error hover:bg-error/10 text-sm rounded-lg">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-base-200">
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-base-100 border-t border-base-300">
          <ul className="flex flex-col p-3 gap-1">{navItems}</ul>
          <div className="px-3 pb-3 border-t border-base-300">
            {!user ? (
              <>
                <NavLink to="/login" className="block px-4 py-2 rounded-lg hover:bg-base-200 text-sm" onClick={() => setIsMenuOpen(false)}>Login</NavLink>
                <NavLink to="/signup" className="block px-4 py-2 bg-primary text-white rounded-lg text-sm" onClick={() => setIsMenuOpen(false)}>Sign Up</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/profile" className="block px-4 py-2 rounded-lg hover:bg-base-200 text-sm" onClick={() => setIsMenuOpen(false)}>Profile</NavLink>
                <button onClick={handleLogout} className="w-full px-4 py-2 rounded-lg hover:bg-error/10 text-error text-sm">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
