// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // ✅ useAuth hook

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { token, role, logout } = useAuth(); // ✅ use hook
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/dashboard' },
    { name: 'About Us', path: '/dashboard/about' },
    { name: 'Apply', path: '/dashboard/apply' },
  ];

  const isActive = (path) => location.pathname === path;
  const baseLinkClasses =
    'px-3 py-2 rounded-md text-sm font-medium transition duration-150';

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 shadow-2xl sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/dashboard"
              className="text-3xl font-black tracking-tighter"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600 hover:from-blue-500 hover:to-indigo-700 transition duration-300">
                MyApp
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex md:items-center">
            <div className="flex space-x-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`${baseLinkClasses} ${
                    isActive(link.path)
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Profile / Auth Section */}
            <div
              className="ml-8 flex items-center relative"
              ref={dropdownRef}
            >
              {token ? (
                <>
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="flex items-center text-gray-300 hover:text-white focus:outline-none transition duration-150 p-2 rounded-full hover:bg-gray-700"
                  >
                    <FaUserCircle className="h-7 w-7 text-indigo-400" />
                    <FaChevronDown
                      className={`ml-2 h-3 w-3 transition-transform ${
                        isProfileDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 top-10 mt-2 w-48 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-30">
                      <div className="py-1" role="menu">
                        <div className="px-4 py-2 text-sm text-gray-700 font-semibold border-b border-gray-100">
                          {role?.toUpperCase() || 'USER'}
                        </div>

                        {role !== 'admin' && (
                          <Link
                            to="/dashboard/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <FaUserCircle className="mr-3 h-4 w-4" /> View
                            Profile
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <FaSignOutAlt className="mr-3 h-4 w-4" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white px-3 py-1.5 rounded-full text-sm font-medium border border-gray-600 hover:border-indigo-400 transition duration-150"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium transition duration-150 shadow-md"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-700" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {token ? (
              <>
                {role !== 'admin' && (
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white bg-gray-700 hover:bg-gray-600 flex items-center px-3 py-2 rounded-md text-base font-medium transition duration-150"
                  >
                    <FaUserCircle className="h-5 w-5 mr-2" /> View Profile
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:bg-gray-700 w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium transition duration-150"
                >
                  <FaSignOutAlt className="h-5 w-5 mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium border border-gray-500"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-indigo-600 text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Register
                </Link>
              </>
            )}

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`${baseLinkClasses} block w-full text-left ${
                  isActive(link.path)
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
