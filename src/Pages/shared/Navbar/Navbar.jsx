import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { Link, NavLink } from "react-router";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <li>
        <NavLink to="/dashboard" className="btn btn-sm btn-outline btn-primary">Dashboard</NavLink>
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

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 items-center text-neutral font-medium">
          {navItems}

          {!user ? (
            <>
              <li><NavLink to="/login" className="btn btn-sm btn-outline btn-secondary">Login</NavLink></li>
              <li><NavLink to="/signup" className="btn btn-sm btn-outline btn-secondary">Sign Up</NavLink></li>
            </>
          ) : (
            <>
              <li>
                <button onClick={logout} className="btn btn-sm btn-error text-white">Logout</button>
              </li>
              <li>
                <img
                  src={user.photoURL || '/default-avatar.png'}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                />
              </li>
            </>
          )}
        </ul>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
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
                <li>
                  <NavLink to="/dashboard" className="btn btn-sm btn-outline btn-primary w-full">Dashboard</NavLink>
                </li>
                <li>
                  <button onClick={logout} className="btn btn-sm btn-error text-white w-full">Logout</button>
                </li>
                <li>
                  <div className="flex items-center gap-3">
                    <img
                      src={user.photoURL || '/default-avatar.png'}
                      alt="profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                    />
                    <span>{user.displayName || 'User'}</span>
                  </div>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
