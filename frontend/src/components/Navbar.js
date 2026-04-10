import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";
import "./Navbar.css";

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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  function handleAIPlannerClick(e) {
    if (!user) {
      e.preventDefault();
      toast.warning("Please login to continue");
      navigate("/login", { state: { from: "/ai-planner" } });
      setIsMobileMenuOpen(false);
    }
  }

  const getLinkClass = ({ isActive }) =>
    `nav-link${isActive ? " active" : ""}`;

  const getMobileLinkClass = ({ isActive }) =>
    `mobile-link${isActive ? " active" : ""}`;

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="logo-link">
          <img src={logo} alt="Travelio" className="logo-img" />
          <span className="logo-text">Travelio</span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="nav-links-desktop">
          <li>
            <NavLink to="/explore" className={getLinkClass} onClick={handleLinkClick}>
              Explore
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ai-planner"
              onClick={(e) => {
                handleAIPlannerClick(e);
              }}
              className={getLinkClass}
            >
              AI Planner
            </NavLink>
          </li>
          <li>
            <NavLink to="/my-trips" className={getLinkClass} onClick={handleLinkClick}>
              Trips
            </NavLink>
          </li>
        </ul>

        {/* Actions */}
        <div className="nav-actions">
          {!user ? (
            <>
              <NavLink to="/login" className="login-btn" onClick={handleLinkClick}>
                Login
              </NavLink>
              <Link to="/register" className="get-started-btn" onClick={handleLinkClick}>
                Get Started
              </Link>
            </>
          ) : (
            <div className="user-menu-wrapper" ref={dropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="user-menu-btn"
              >
                {user.name}
                <span className="caret">▾</span>
              </button>

              {isUserDropdownOpen && (
                <div className="dropdown-menu">
                  <NavLink
                    to="/profile"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="dropdown-item"
                  >
                    Profile
                  </NavLink>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="dropdown-item"
                  >
                    Dashboard
                  </NavLink>
                  <div className="dropdown-divider" />
                  <button onClick={handleLogout} className="dropdown-item logout">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Toggle */}
          <button
            className="mobile-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu${isMobileMenuOpen ? " open" : ""}`}>
        <NavLink to="/explore" className={getMobileLinkClass} onClick={handleLinkClick}>
          Explore
        </NavLink>
        <NavLink
          to="/ai-planner"
          onClick={(e) => {
            handleAIPlannerClick(e);
            handleLinkClick();
          }}
          className={getMobileLinkClass}
        >
          AI Planner
        </NavLink>
        <NavLink to="/my-trips" className={getMobileLinkClass} onClick={handleLinkClick}>
          Trips
        </NavLink>

        {!user ? (
          <>
            <NavLink to="/login" className={getMobileLinkClass} onClick={handleLinkClick}>
              Login
            </NavLink>
            <NavLink to="/register" className="mobile-get-started" onClick={handleLinkClick}>
              Get Started
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/profile" className={getMobileLinkClass} onClick={handleLinkClick}>
              Profile
            </NavLink>
            <NavLink to="/dashboard" className={getMobileLinkClass} onClick={handleLinkClick}>
              Dashboard
            </NavLink>
            <button onClick={handleLogout} className="mobile-link logout">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
