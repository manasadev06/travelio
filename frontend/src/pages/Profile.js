import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    nationality: "India"
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Here you would typically make an API call to save the profile
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    setFormData({
      name: user?.name || "John Doe",
      email: user?.email || "john.doe@example.com",
      nationality: "India"
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-page page-transition">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {formData.name.charAt(0).toUpperCase()}
            </div>
            <div className="avatar-info">
              <h1 className="profile-name">{formData.name}</h1>
              <p className="profile-email">{formData.email}</p>
            </div>
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <button 
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button className="btn btn-success" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            )}
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {/* Personal Information */}
          <div className="profile-section">
            <h2 className="section-title">Personal Information</h2>
            <div className="info-grid">
              <div className="info-group">
                <label className="info-label">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="info-value">{formData.name}</p>
                )}
              </div>

              <div className="info-group">
                <label className="info-label">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="info-value">{formData.email}</p>
                )}
              </div>

              
              <div className="info-group">
                <label className="info-label">Nationality</label>
                {isEditing ? (
                  <select
                    name="nationality"
                    className="form-input"
                    value={formData.nationality}
                    onChange={handleInputChange}
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Japan">Japan</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="info-value">{formData.nationality}</p>
                )}
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="profile-section">
            <h2 className="section-title">Account Statistics</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <h3 className="stat-number">12</h3>
                  <p className="stat-label">Total Trips</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <h3 className="stat-number">2,450</h3>
                  <p className="stat-label">Reward Points</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🌍</div>
                <div className="stat-info">
                  <h3 className="stat-number">8</h3>
                  <p className="stat-label">Countries Visited</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">💎</div>
                <div className="stat-info">
                  <h3 className="stat-number">Gold</h3>
                  <p className="stat-label">Member Status</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
