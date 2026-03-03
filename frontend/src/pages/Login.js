import { useState ,useEffect} from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import Toast from "../components/Toast";
import { useLocation } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
const location = useLocation();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 HANDLE INPUT CHANGE
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  useEffect(() => {
  if (location.state?.message) {
    setToast({
      message: location.state.message,
      type: "success",
    });
  }
}, [location.state]);

  // 🔹 HANDLE LOGIN SUBMIT
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.email || !form.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      const data = res.data;

      // ✅ Save JWT
      login(data.token);

      // ✅ Show success toast
      setToast({ 
  message: "Welcome back! Your journey continues.", 
  type: "success" 
});
const location = useLocation();
const from = location.state?.from || "/";
navigate(from);

      // ✅ Delay navigation so toast is visible
      setTimeout(() => {
         navigate("/");
      }, 2000);

    } catch (err) {
      setToast({ message: "Login failed ❌", type: "error" });
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 page-wrapper">
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl animate-fade-in border border-gray-100">
        
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome Back! 👋
          </h1>
          <p className="text-gray-600">
            We missed you! Sign in to continue your journey.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-sm font-medium rounded-full text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-lg disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-teal-600 hover:text-teal-500"
              >
                Create one now
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}