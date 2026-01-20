import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Profile.css";

export default function ProfileEdit() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    nationality: user?.nationality || "United States",
    bio: user?.bio || ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Fetch current profile data
    const fetchProfile = async () => {
      try {
        const response = await api.get("/user/profile");
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          nationality: response.data.nationality || "United States",
          bio: response.data.bio || ""
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!formData.name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    try {
      await api.put("/user/profile", {
        name: formData.name.trim(),
        nationality: formData.nationality,
        bio: formData.bio.trim()
      });

      setSuccess("Profile updated successfully!");
      
      // Update local user context if needed
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="profile-page page-transition">
      <div className="container">
        <div className="profile-edit-header">
          <h1>Edit Profile</h1>
          <p>Update your personal information</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="profile-edit-form">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Basic Information</h2>
              
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled // Email typically shouldn't be changeable
                />
                <small className="form-help">Contact support to change email</small>
              </div>

              <div className="form-group">
                <label className="form-label">Nationality</label>
                <select
                  name="nationality"
                  className="form-input"
                  value={formData.nationality}
                  onChange={handleInputChange}
                >
                  <option value="">Select your nationality</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                  <option value="India">India</option>
                  <option value="China">China</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Spain">Spain</option>
                  <option value="Italy">Italy</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Norway">Norway</option>
                  <option value="Denmark">Denmark</option>
                  <option value="Singapore">Singapore</option>
                  <option value="South Korea">South Korea</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  name="bio"
                  className="form-input"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  maxLength="500"
                />
                <small className="form-help">{formData.bio.length}/500 characters</small>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
