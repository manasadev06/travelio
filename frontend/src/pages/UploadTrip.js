import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./UploadTrip.css";

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

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          duration: Number(formData.duration),
          trip_days: tripDays.map((day) => ({
            ...day,
            image_urls: day.image_urls.filter((u) => u.trim()),
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Upload failed");

      setSuccess("Trip uploaded successfully");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="upload-trip-page">
      <div className="container">
        <h1>Upload Trip</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Trip Title"
            value={formData.title}
            onChange={handleInputChange}
          />

          <input
            name="destination"
            placeholder="Destination"
            value={formData.destination}
            onChange={handleInputChange}
          />

          <input
            type="number"
            name="duration"
            placeholder="Duration (days)"
            value={formData.duration}
            onChange={handleInputChange}
          />

          <textarea
            name="description"
            placeholder="Trip description"
            value={formData.description}
            onChange={handleInputChange}
          />

          <input
            name="cover_image_url"
            placeholder="Cover image URL (optional)"
            value={formData.cover_image_url}
            onChange={handleInputChange}
          />

          {tripDays.map((day, i) => (
            <div key={i} className="trip-day">
              <h3>Day {day.day_number}</h3>

              <input
                placeholder="Day title"
                value={day.title}
                onChange={(e) =>
                  handleDayChange(i, "title", e.target.value)
                }
              />

              <textarea
                placeholder="Day content"
                value={day.content}
                onChange={(e) =>
                  handleDayChange(i, "content", e.target.value)
                }
              />

              {day.image_urls.map((url, j) => (
                <div key={j}>
                  <input
                    placeholder="Image URL"
                    value={url}
                    onChange={(e) =>
                      handleImageUrlChange(i, j, e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeImageUrl(i, j)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button type="button" onClick={() => addImageUrl(i)}>
                Add Image
              </button>

              {tripDays.length > 1 && (
                <button type="button" onClick={() => removeTripDay(i)}>
                  Remove Day
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addTripDay}>
            Add Day
          </button>

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload Trip"}
          </button>
        </form>
      </div>
    </div>
  );
}
