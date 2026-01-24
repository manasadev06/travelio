import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen bg-gray-50 pt-8 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 animate-fade-in">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-white">
              {formData.name.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{formData.name}</h1>
            <p className="text-gray-500 mb-6 flex items-center justify-center md:justify-start gap-2">
              <span>📧</span> {formData.email}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {!isEditing ? (
                <button
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-md" 
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                  <button 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-all" 
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              )}
              <button 
                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-6 py-2.5 rounded-lg font-medium transition-all" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in delay-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Personal Information</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-lg font-medium text-gray-800 bg-gray-50 px-4 py-3 rounded-lg border border-transparent">{formData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="text-lg font-medium text-gray-800 bg-gray-50 px-4 py-3 rounded-lg border border-transparent">{formData.email}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Nationality</label>
                    {isEditing ? (
                      <select
                        name="nationality"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
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
                      <p className="text-lg font-medium text-gray-800 bg-gray-50 px-4 py-3 rounded-lg border border-transparent">{formData.nationality}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in delay-200 h-full">
              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Account Stats</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-teal-50 border border-teal-100 transition-transform hover:scale-105">
                  <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-2xl">
                    📅
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">12</h3>
                    <p className="text-sm font-medium text-gray-500">Total Trips</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100 transition-transform hover:scale-105">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-2xl">
                    ⭐
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">2,450</h3>
                    <p className="text-sm font-medium text-gray-500">Reward Points</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100 transition-transform hover:scale-105">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">
                    🌍
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">8</h3>
                    <p className="text-sm font-medium text-gray-500">Countries Visited</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-50 border border-purple-100 transition-transform hover:scale-105">
                  <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-2xl">
                    💎
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Gold</h3>
                    <p className="text-sm font-medium text-gray-500">Member Status</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
