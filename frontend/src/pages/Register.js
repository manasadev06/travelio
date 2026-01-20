import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import "./Auth.css";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // validation
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2>Create Account</h2>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
            />

            <button className="btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="auth-text">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
