import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  }

  function toggleMobileMenu() {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  function handleLinkClick() {
    setIsMobileMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        🌍 TravelPlan
      </Link>

      <button 
        className="mobile-menu-btn" 
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? "✕" : "☰"}
      </button>

      <ul className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
        <li>
          <Link to="/" onClick={handleLinkClick}>Home</Link>
        </li>
        <li>
          <Link to="/explore" onClick={handleLinkClick}>Explore</Link>
        </li>
        <li>
          <Link to="/ai-planner" onClick={handleLinkClick}>🤖 AI Planner</Link>
        </li>
        
        {!user ? (
          <>
            <li>
              <Link to="/login" onClick={handleLinkClick}>Login</Link>
            </li>
            <li>
              <Link to="/register" className="btn-primary" onClick={handleLinkClick}>
                Get Started
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="welcome">👋 Hi, {user.name}</li>
            <li>
              <Link to="/dashboard" onClick={handleLinkClick}>Dashboard</Link>
            </li>
            <li>
              <Link to="/profile" onClick={handleLinkClick}>Profile</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
