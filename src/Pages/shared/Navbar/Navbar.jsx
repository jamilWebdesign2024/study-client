import { useEffect, useRef, useState } from "react";
// React Router navigation and linking
import { Link, NavLink, useNavigate } from "react-router";
import Swal from "sweetalert2"; // For logout confirmation alerts
import { FaBars, FaTimes } from "react-icons/fa"; // Hamburger and close icons
import useAuth from "../../../hooks/useAuth"; // Custom hook for auth context

const Navbar = () => {
  const { user, signOutUser } = useAuth(); // Get current user and logout function
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu toggle
  const [showDropdown, setShowDropdown] = useState(false); // User dropdown toggle
  const dropdownRef = useRef(null); // Ref for closing dropdown on outside click
  const navigate = useNavigate(); // For navigation after logout

  // Close dropdown if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle user logout
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
      Swal.fire({
        icon: "success",
        title: "Logged out successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/");
    }
  };




  

  // Common nav items for both desktop and mobile
  const navItems = (
    <>
      <li>
        <NavLink to="/tutors" className={({ isActive }) => isActive ? 'text-primary font-semibold' : ''}>
          Tutors
        </NavLink>
      </li>
      <li>
        <NavLink to="/sessions" className={({ isActive }) => isActive ? 'text-primary font-semibold' : ''}>
          Study Sessions
        </NavLink>
      </li>
    </>
  );

  return (
    <nav className="bg-base-100 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary">
          Study<span className="text-secondary">Sphere</span>
        </Link>

        {/* Desktop menu (visible on md and larger screens) */}
        <ul className="hidden md:flex gap-6 items-center text-neutral font-medium">
          {navItems}

          {/* If user is not logged in */}
          {!user ? (
            <>
              <li><NavLink to="/login" className="btn btn-sm btn-outline btn-secondary">Login</NavLink></li>
              <li><NavLink to="/signup" className="btn btn-sm btn-outline btn-secondary">Sign Up</NavLink></li>
            </>
          ) : (
            <>
              {/* Profile image + dropdown */}
              <li className="relative" ref={dropdownRef}>
                <img
                  onClick={() => setShowDropdown(!showDropdown)}
                  src={user.photoURL || '/default-avatar.png'}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary cursor-pointer"
                />
                
                {/* Dropdown menu when image is clicked */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded-lg z-50 p-4">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <img
                        src={user?.photoURL || "/default-avatar.png"}
                        className="w-16 h-16 rounded-full border-2 border-primary"
                        alt="user"
                      />
                      <h3 className="text-lg font-semibold text-neutral">{user.displayName || "User"}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <NavLink
                        to="/dashboard"
                        className="btn btn-sm btn-primary w-full"
                        onClick={() => setShowDropdown(false)}
                      >
                        Dashboard
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="btn btn-sm btn-error w-full text-white"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </li>
            </>
          )}
        </ul>

        {/* Mobile menu toggle button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown (only shown when menu is open) */}
      {isMenuOpen && (
        <div className="md:hidden bg-base-100 px-6 pb-4 shadow">
          <ul className="space-y-3 text-neutral">
            {navItems}
            {!user ? (
              <>
                <li><NavLink to="/login" className="btn btn-sm btn-outline btn-secondary w-full">Login</NavLink></li>
                <li><NavLink to="/signup" className="btn btn-sm btn-outline btn-secondary w-full">Sign Up</NavLink></li>
              </>
            ) : (
              <>
                <li className="flex items-center gap-3">
                  <img
                    src={user.photoURL || '/default-avatar.png'}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                  />
                  <span>{user.displayName || 'User'}</span>
                </li>
                <li><NavLink to="/dashboard" className="btn btn-sm btn-outline btn-primary w-full">Dashboard</NavLink></li>
                <li><button onClick={handleLogout} className="btn btn-sm btn-error w-full text-white">Logout</button></li>
                <li><p className="text-xs text-center text-gray-500">{user.email}</p></li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
