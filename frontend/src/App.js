import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ExploreTrips from "./pages/ExploreTrips";
import DestinationDetails from "./pages/DestinationDetails";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import UploadTrip from "./pages/UploadTrip";
import TripDetails from "./pages/TripDetails";
import UserProfile from "./pages/UserProfile";
import SearchResults from "./pages/SearchResults";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/protectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIFlowchart from "./pages/AIFlowchart";


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
          <Navbar />
          <main className="flex-grow pt-[70px]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/upload-trip" element={<UploadTrip />} />
              <Route path="/explore" element={<ExploreTrips />} />
              <Route path="/trip/:id" element={<TripDetails />} />
              <Route path="/user/:id" element={<UserProfile />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/destination/:id" element={<DestinationDetails />} />
              <Route path="/ai-planner" element={<AIFlowchart />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
