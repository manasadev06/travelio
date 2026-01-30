import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api"; // Uncommented for API usage

export default function UploadTrip() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // 1. Trip Basics
    title: "",
    destination: "",
    trip_type: "Solo",
    duration: "",
    
    // 2. Trip Description
    short_summary: "",
    description: "",
    
    // 3. Itinerary
    itinerary: "",
    
    // 4. Budget Details
    total_budget: "",
    accommodation_cost: "",
    travel_cost: "",
    food_misc_cost: "",
    
    // 5. Accommodation
    accommodation_type: "Hotel",
    accommodation_name: "",
    
    // 6. Weather & Best Time
    weather: "Sunny",
    best_time_to_visit: "",
    
    // 7. Media
    cover_image: null,
    
    // 8. Tags
    tags: "",
    
    // 9. Visibility
    is_public: "true", // "true" or "false" string for radio
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  /* ---------------- HANDLERS ---------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, cover_image: e.target.files[0] }));
    }
  };

  /* ---------------- VALIDATION ---------------- */
  const validateForm = () => {
    const errors = [];
    if (!formData.title.trim()) errors.push("Title is required");
    if (!formData.destination.trim()) errors.push("Destination is required");
    if (!formData.duration || formData.duration < 1) errors.push("Valid duration is required");
    if (!formData.short_summary.trim()) errors.push("Short summary is required");
    if (!formData.description.trim()) errors.push("Detailed description is required");
    if (!formData.itinerary.trim()) errors.push("Itinerary is required");
    
    if (!formData.total_budget || formData.total_budget < 0) errors.push("Total budget is required");
    if (!formData.accommodation_cost || formData.accommodation_cost < 0) errors.push("Accommodation cost is required");
    if (!formData.travel_cost || formData.travel_cost < 0) errors.push("Travel cost is required");
    if (!formData.food_misc_cost || formData.food_misc_cost < 0) errors.push("Food & Misc cost is required");
    
    if (!formData.accommodation_type) errors.push("Accommodation type is required");
    if (!formData.weather) errors.push("Weather is required");
    if (!formData.best_time_to_visit.trim()) errors.push("Best time to visit is required");
    
    if (!formData.cover_image) errors.push("Cover image is required");
    if (!formData.tags.trim()) errors.push("Tags are required");

    return errors;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationErrors = validateForm();
    if (validationErrors.length) {
      setError(validationErrors.join(", "));
      window.scrollTo(0, 0);
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach((key) => {
        if (key === "tags") {
          // Parse tags string to array then stringify for backend
          const tagsArray = formData.tags.split(",").map(tag => tag.trim()).filter(Boolean);
          data.append("tags", JSON.stringify(tagsArray));
        } else if (key !== "cover_image") {
          data.append(key, formData[key]);
        }
      });

      // Append file
      if (formData.cover_image) {
        data.append("cover_image", formData.cover_image);
      }

      // API Call
      await api.post("/trips", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Trip uploaded successfully!");
      setLoading(false);
      
      // Navigate after delay
      setTimeout(() => navigate("/explore"), 2000);
    } catch (err) {
      console.error("Upload error:", err);
      if (err.response && err.response.data) {
        console.error("Server Error Details:", err.response.data);
      }
      setError(err.response?.data?.message || "Failed to upload trip");
    } finally {setLoading(false);
      window.scrollTo(0, 0);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 page-wrapper">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Upload New Trip</h1>
          <p className="text-lg text-gray-600">Share your travel experience with the world</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md shadow-sm animate-fade-in">
            <div className="flex">
              <div className="flex-shrink-0">⚠️</div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-md shadow-sm animate-fade-in">
            <div className="flex">
              <div className="flex-shrink-0">✅</div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 1. Trip Basics */}
          <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
              <span className="text-teal-600">📝</span> Trip Basics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Trip Title</label>
                <input
                  name="title"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="e.g. Magical Week in Bali"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Destination</label>
                <input
                  name="destination"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="e.g. Bali, Indonesia"
                  value={formData.destination}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Trip Type</label>
                <select
                  name="trip_type"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white"
                  value={formData.trip_type}
                  onChange={handleInputChange}
                >
                  <option value="Solo">Solo</option>
                  <option value="Couple">Couple</option>
                  <option value="Friends">Friends</option>
                  <option value="Family">Family</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Duration (Days)</label>
                <input
                  type="number"
                  name="duration"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="e.g. 7"
                  min="1"
                  value={formData.duration}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* 2. Trip Description */}
          <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
              <span className="text-teal-600">📄</span> Trip Description
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Short Summary</label>
                <input
                  name="short_summary"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="Brief overview (1-2 lines)"
                  value={formData.short_summary}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Detailed Description</label>
                <textarea
                  name="description"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all h-32"
                  placeholder="Tell us all about your trip..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* 3. Itinerary */}
          <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
              <span className="text-teal-600">📅</span> Itinerary
            </h2>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Day-wise Itinerary</label>
              <textarea
                name="itinerary"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all h-48"
                placeholder="Day 1: Arrival...&#10;Day 2: City Tour..."
                value={formData.itinerary}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* 4. Budget Details */}
          <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
              <span className="text-teal-600">💰</span> Budget Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Total Budget</label>
                <input
                  type="number"
                  name="total_budget"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                  min="0"
                  value={formData.total_budget}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Accommodation Cost</label>
                <input
                  type="number"
                  name="accommodation_cost"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                  min="0"
                  value={formData.accommodation_cost}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Travel Cost</label>
                <input
                  type="number"
                  name="travel_cost"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                  min="0"
                  value={formData.travel_cost}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Food & Misc Cost</label>
                <input
                  type="number"
                  name="food_misc_cost"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                  min="0"
                  value={formData.food_misc_cost}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* 5. Accommodation */}
          <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
              <span className="text-teal-600">🏨</span> Accommodation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Accommodation Type</label>
                <select
                  name="accommodation_type"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white"
                  value={formData.accommodation_type}
                  onChange={handleInputChange}
                >
                  <option value="Hotel">Hotel</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Airbnb">Airbnb</option>
                  <option value="Friend/Relative">Friend/Relative</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Accommodation Name (Optional)</label>
                <input
                  name="accommodation_name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="e.g. Grand Hotel"
                  value={formData.accommodation_name}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* 6. Weather & Best Time */}
          <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
              <span className="text-teal-600">🌤️</span> Weather & Best Time
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Weather During Trip</label>
                <select
                  name="weather"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white"
                  value={formData.weather}
                  onChange={handleInputChange}
                >
                  <option value="Sunny">Sunny</option>
                  <option value="Rainy">Rainy</option>
                  <option value="Cold">Cold</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Best Time to Visit</label>
                <input
                  name="best_time_to_visit"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="e.g. May to September"
                  value={formData.best_time_to_visit}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* 7. Media & Tags & Visibility */}
          <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
              <span className="text-teal-600">📷</span> Media & Details
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white"
                />
                <p className="text-xs text-gray-500">Upload a cover image for your trip.</p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Tags</label>
                <input
                  name="tags"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="e.g. Budget, Adventure, Beach (comma separated)"
                  value={formData.tags}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Visibility</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="is_public"
                      value="true"
                      checked={formData.is_public === "true"}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-teal-600 focus:ring-teal-500 border-gray-300"
                    />
                    <span className="text-gray-700">Public</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="is_public"
                      value="false"
                      checked={formData.is_public === "false"}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-teal-600 focus:ring-teal-500 border-gray-300"
                    />
                    <span className="text-gray-700">Private</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              className="w-full md:w-auto px-8 py-4 bg-teal-600 text-white text-lg font-bold rounded-full shadow-lg hover:bg-teal-700 hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading Trip...
                </>
              ) : (
                <>🚀 Publish Trip</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
