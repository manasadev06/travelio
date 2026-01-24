import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

export default function UploadTrip() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    duration: "",
    description: "",
    cover_image_url: "",
  });

  const [tripDays, setTripDays] = useState([
    { day_number: 1, title: "", content: "", image_urls: [] },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  /* ---------------- BASIC FORM ---------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------------- DAY HANDLERS ---------------- */
  const handleDayChange = (index, field, value) => {
    setTripDays((prev) =>
      prev.map((day, i) =>
        i === index ? { ...day, [field]: value } : day
      )
    );
  };

  const addTripDay = () => {
    setTripDays((prev) => [
      ...prev,
      {
        day_number: prev.length + 1,
        title: "",
        content: "",
        image_urls: [],
      },
    ]);
  };

  const removeTripDay = (index) => {
    if (tripDays.length === 1) return;

    const updated = tripDays
      .filter((_, i) => i !== index)
      .map((day, i) => ({ ...day, day_number: i + 1 }));

    setTripDays(updated);
  };

  /* ---------------- IMAGE HANDLERS ---------------- */
  const addImageUrl = (dayIndex) => {
    setTripDays((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? { ...day, image_urls: [...day.image_urls, ""] }
          : day
      )
    );
  };

  const handleImageUrlChange = (dayIndex, imageIndex, value) => {
    setTripDays((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? {
            ...day,
            image_urls: day.image_urls.map((url, j) =>
              j === imageIndex ? value : url
            ),
          }
          : day
      )
    );
  };

  const removeImageUrl = (dayIndex, imageIndex) => {
    setTripDays((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? {
            ...day,
            image_urls: day.image_urls.filter(
              (_, j) => j !== imageIndex
            ),
          }
          : day
      )
    );
  };

  /* ---------------- VALIDATION ---------------- */
  const validateForm = () => {
    const errors = [];

    if (!formData.title.trim()) errors.push("Title required");
    if (!formData.destination.trim()) errors.push("Destination required");
    if (!formData.duration || formData.duration < 1)
      errors.push("Duration must be valid");
    if (formData.description.trim().length < 10)
      errors.push("Description too short");

    tripDays.forEach((day, i) => {
      if (!day.title.trim() || !day.content.trim()) {
        errors.push(`Day ${i + 1} incomplete`);
      }
    });

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
      return;
    }

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        duration: Number(formData.duration),
        trip_days: tripDays.map((day) => ({
          ...day,
          image_urls: day.image_urls.filter((u) => u.trim()),
        })),
      };

      await api.post("/trips", payload);

      setSuccess("Trip uploaded successfully");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Upload failed");
    } finally {
      setLoading(false);
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
          {/* Section: Trip Overview */}
          <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
              <span className="text-teal-600">📝</span> Trip Overview
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

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Cover Image URL</label>
                <input
                  name="cover_image_url"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="https://example.com/image.jpg"
                  value={formData.cover_image_url}
                  onChange={handleInputChange}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Trip Description</label>
                <textarea
                  name="description"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all h-32"
                  placeholder="Tell us about the highlights of your trip..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Section: Itinerary */}
          <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-teal-600">📅</span> Detailed Itinerary
              </h2>
              <button 
                type="button" 
                className="btn btn-secondary btn-small flex items-center gap-2 hover:bg-gray-100" 
                onClick={addTripDay}
              >
                <span>➕</span> Add Day
              </button>
            </div>

            <div className="space-y-6">
              {tripDays.map((day, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-teal-800">Day {day.day_number}</h3>
                    {tripDays.length > 1 && (
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                        onClick={() => removeTripDay(i)}
                        title="Remove Day"
                      >
                        🗑️
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Day Title</label>
                      <input
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                        placeholder="e.g. Arrival and Beach Relaxation"
                        value={day.title}
                        onChange={(e) => handleDayChange(i, "title", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Day Activities</label>
                      <textarea
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white h-24"
                        placeholder="Describe the activities for this day..."
                        value={day.content}
                        onChange={(e) => handleDayChange(i, "content", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Photos</label>
                      <div className="space-y-2">
                        {day.image_urls.map((url, j) => (
                          <div key={j} className="flex gap-2">
                            <input
                              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-sm"
                              placeholder="Image URL"
                              value={url}
                              onChange={(e) => handleImageUrlChange(i, j, e.target.value)}
                            />
                            <button
                              type="button"
                              className="text-gray-400 hover:text-red-500 px-2"
                              onClick={() => removeImageUrl(i, j)}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                      <button 
                        type="button" 
                        className="text-teal-600 text-sm font-medium hover:text-teal-800 hover:underline flex items-center gap-1 mt-2" 
                        onClick={() => addImageUrl(i)}
                      >
                        ➕ Add Photo URL
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <button 
                type="button" 
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-semibold hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-all flex justify-center items-center gap-2" 
                onClick={addTripDay}
              >
                <span>➕</span> Add Another Day
              </button>
            </div>
          </div>

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
