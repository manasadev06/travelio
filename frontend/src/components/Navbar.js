import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  }

  function toggleMobileMenu() {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  function handleLinkClick() {
    setIsMobileMenuOpen(false);
  }

  return (
    <nav className={`fixed top-0 left-0 w-full h-[70px] z-50 transition-all duration-300 px-4 md:px-8 flex items-center justify-between
      ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
      
      <Link to="/" className="text-2xl font-bold text-teal-700 flex items-center gap-2 hover:scale-105 transition-transform">
        🌍 TravelPlan
      </Link>

      <button
        className="md:hidden text-2xl text-gray-700 p-2 focus:outline-none"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? "✕" : "☰"}
      </button>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center gap-1 list-none">
        <li>
          <NavLink to="/" className={({ isActive }) => `px-4 py-2 rounded-full font-medium transition-all ${isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50 hover:text-teal-600'}`}>
            🏠 Home
          </NavLink>
        </li>
        {user && (
          <li>
            <NavLink to="/upload-trip" className={({ isActive }) => `px-4 py-2 rounded-full font-medium transition-all ${isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50 hover:text-teal-600'}`}>
              � Upload Trip
            </NavLink>
          </li>
        )}
        <li>
          <NavLink to="/ai-planner" className={({ isActive }) => `px-4 py-2 rounded-full font-medium transition-all ${isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50 hover:text-teal-600'}`}>
            🤖 AI Planner
          </NavLink>
        </li>

        {!user ? (
          <>
            <li className="ml-4">
              <NavLink to="/login" className="px-5 py-2 font-semibold text-gray-600 hover:text-teal-700 transition-colors">
                Login
              </NavLink>
            </li>
            <li>
              <Link to="/register" className="px-5 py-2.5 bg-teal-600 text-white rounded-full font-bold shadow-md hover:bg-teal-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                Get Started
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => `px-4 py-2 rounded-full font-medium transition-all ${isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50 hover:text-teal-600'}`}>
                📊 Dashboard
              </NavLink>
            </li>
            <li className="ml-2 relative" ref={dropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="px-4 py-2 rounded-full font-medium text-gray-600 hover:bg-gray-50 hover:text-teal-600 flex items-center gap-2 transition-all"
              >
                👤 {user.name}
                <span className={`text-sm transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                  <NavLink
                    to="/profile"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className={({ isActive }) => `block px-4 py-3 rounded-t-xl transition-all ${isActive ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    👤 My Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-b-xl text-red-600 hover:bg-red-50 transition-all font-medium text-sm border-t border-gray-100"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </li>
          </>
        )}
      </ul>

      {/* Mobile Menu */}
      <div className={`absolute top-[70px] left-0 w-full bg-white border-b border-gray-100 shadow-xl flex flex-col p-6 gap-4 md:hidden transition-all duration-300 ease-in-out origin-top
        ${isMobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
        
        <NavLink to="/" onClick={handleLinkClick} className={({ isActive }) => `p-3 rounded-xl flex items-center gap-3 ${isActive ? 'bg-teal-50 text-teal-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
          🏠 Home
        </NavLink>
        
        {user && (
          <NavLink to="/upload-trip" onClick={handleLinkClick} className={({ isActive }) => `p-3 rounded-xl flex items-center gap-3 ${isActive ? 'bg-teal-50 text-teal-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
            � Upload Trip
          </NavLink>
        )}
        
        <NavLink to="/ai-planner" onClick={handleLinkClick} className={({ isActive }) => `p-3 rounded-xl flex items-center gap-3 ${isActive ? 'bg-teal-50 text-teal-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
          🤖 AI Planner
        </NavLink>

        {!user ? (
          <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-gray-100">
            <Link to="/login" onClick={handleLinkClick} className="w-full py-3 text-center font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">
              Login
            </Link>
            <Link to="/register" onClick={handleLinkClick} className="w-full py-3 text-center font-bold text-white bg-teal-600 rounded-xl shadow-md hover:bg-teal-700">
              Get Started
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-gray-100">
            <NavLink to="/dashboard" onClick={handleLinkClick} className="p-3 rounded-xl text-gray-600 hover:bg-gray-50 flex items-center gap-3">
              📊 Dashboard
            </NavLink>
            <NavLink to="/profile" onClick={handleLinkClick} className="p-3 rounded-xl text-gray-600 hover:bg-gray-50 flex items-center gap-3">
              👤 Profile
            </NavLink>
            <button onClick={handleLogout} className="w-full mt-2 py-3 text-center font-bold text-red-600 border border-red-100 bg-red-50 rounded-xl hover:bg-red-100">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
