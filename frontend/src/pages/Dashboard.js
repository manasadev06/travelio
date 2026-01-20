import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('plans');
  const [savedPlans, setSavedPlans] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockSavedPlans = [
    {
      id: 1,
      prompt: "3 day trip to Manali",
      textPlan: "Day 1: Arrive in Manali, check into hotel, explore Mall Road\nDay 2: Rohtang Pass visit, Solang Valley activities\nDay 3: Hadimba Temple, Manu Temple, departure",
      mermaidCode: `graph TD
    A[Day 1: Arrival] --> B[Check into Hotel]
    B --> C[Explore Mall Road]
    C --> D[Local Dinner]
    D --> E[Day 2: Rohtang Pass]
    E --> F[Solang Valley]
    F --> G[Adventure Activities]
    G --> H[Day 3: Temples]
    H --> I[Hadimba Temple]
    I --> J[Manu Temple]
    J --> K[Departure]`,
      createdAt: "2024-01-15",
      saved: true
    },
    {
      id: 2,
      prompt: "Weekend getaway to Goa",
      textPlan: "Day 1: Beach relaxation, water sports, night market\nDay 2: Old Goa churches, spice plantation, beach sunset",
      mermaidCode: `graph TD
    A[Day 1: Beach Day] --> B[Water Sports]
    B --> C[Beach Relaxation]
    C --> D[Night Market]
    D --> E[Day 2: Sightseeing]
    E --> F[Old Goa Churches]
    F --> G[Spice Plantation]
    G --> H[Beach Sunset]
    H --> I[Departure]`,
      createdAt: "2024-01-10",
      saved: true
    },
    {
      id: 3,
      prompt: "One week in Kerala backwaters",
      textPlan: "Day 1-3: Alleppey houseboat experience, village visits\nDay 4-5: Munnar tea gardens, spice plantations\nDay 6-7: Kovalam beach, backwater sunset cruise",
      mermaidCode: `graph TD
    A[Day 1: Alleppey] --> B[Houseboat Check-in]
    B --> C[Village Visit]
    C --> D[Day 2: Village Experience]
    D --> E[Day 3: Munnar]
    E --> F[Tea Gardens]
    F --> G[Spice Plantations]
    G --> H[Day 4: Kovalam]
    H --> I[Beach Activities]
    I --> J[Day 5: Sunset Cruise]
    J --> K[Day 6: Departure]`,
      createdAt: "2024-01-05",
      saved: true
    }
  ];

  const mockBookings = [
    {
      id: 1,
      destination: "Bali, Indonesia",
      destinationId: 1,
      checkIn: "2024-02-15",
      checkOut: "2024-02-22",
      status: "upcoming",
      price: 1299,
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      destination: "Paris, France",
      destinationId: 2,
      checkIn: "2024-01-10",
      checkOut: "2024-01-17",
      status: "completed",
      price: 2199,
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      destination: "Tokyo, Japan",
      destinationId: 4,
      checkIn: "2024-03-05",
      checkOut: "2024-03-12",
      status: "upcoming",
      price: 1899,
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&h=200&fit=crop"
    }
  ];

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setSavedPlans(mockSavedPlans);
      setBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeletePlan = (planId) => {
    setSavedPlans(savedPlans.filter(plan => plan.id !== planId));
  };

  const handleViewPlan = (plan) => {
    navigate('/ai-planner', { state: { plan } });
  };

  const handleViewBooking = (booking) => {
    navigate(`/destination/${booking.destinationId}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'upcoming':
        return { class: 'upcoming', text: 'Upcoming' };
      case 'completed':
        return { class: 'completed', text: 'Completed' };
      case 'cancelled':
        return { class: 'cancelled', text: 'Cancelled' };
      default:
        return { class: 'pending', text: 'Pending' };
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page page-transition">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome back, {user?.name || 'Traveler'}! 👋</h1>
            <p className="welcome-subtitle">Manage your travel plans and bookings</p>
          </div>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3 className="stat-number">{savedPlans.length}</h3>
              <p className="stat-label">Saved Plans</p>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3 className="stat-number">{bookings.filter(b => b.status === 'upcoming').length}</h3>
              <p className="stat-label">Upcoming Trips</p>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3 className="stat-number">{bookings.filter(b => b.status === 'completed').length}</h3>
              <p className="stat-label">Completed Trips</p>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3 className="stat-number">2,450</h3>
              <p className="stat-label">Reward Points</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-content">
          {/* Tabs */}
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'plans' ? 'active' : ''}`}
              onClick={() => setActiveTab('plans')}
            >
              🤖 AI Plans
            </button>
            <button 
              className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              ✈️ Bookings
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'plans' && (
            <div className="plans-section">
              <h2 className="section-title">🤖 Saved AI Trip Plans</h2>
              
              {savedPlans.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No saved plans yet</h3>
                  <p>Start planning your trips with our AI Trip Planner!</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/ai-planner')}
                  >
                    Create Your First Plan
                  </button>
                </div>
              ) : (
                <div className="plans-grid">
                  {savedPlans.map((plan) => (
                    <div key={plan.id} className="plan-card">
                      <div className="plan-header">
                        <h3>{plan.prompt}</h3>
                        <span className="plan-date">{plan.createdAt}</span>
                      </div>
                      <div className="plan-preview">
                        <p>{plan.textPlan.substring(0, 100)}...</p>
                      </div>
                      <div className="plan-actions">
                        <button 
                          className="btn btn-primary btn-small"
                          onClick={() => handleViewPlan(plan)}
                        >
                          View Full Plan
                        </button>
                        <button 
                          className="btn btn-secondary btn-small"
                          onClick={() => handleDeletePlan(plan.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-section">
              <h2 className="section-title">✈️ Your Bookings</h2>
              
              {bookings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">✈️</div>
                  <h3>No bookings yet</h3>
                  <p>Explore destinations and book your next adventure!</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/explore')}
                  >
                    Explore Destinations
                  </button>
                </div>
              ) : (
                <div className="bookings-grid">
                  {bookings.map((booking) => {
                    const status = getStatusBadge(booking.status);
                    return (
                      <div key={booking.id} className="booking-card">
                        <div className="booking-image">
                          <img src={booking.image} alt={booking.destination} />
                          <div className={`status-badge ${status.class}`}>
                            {status.text}
                          </div>
                        </div>
                        <div className="booking-content">
                          <h3>{booking.destination}</h3>
                          <div className="booking-dates">
                            <div className="date-item">
                              <span className="date-label">Check-in:</span>
                              <span className="date-value">{booking.checkIn}</span>
                            </div>
                            <div className="date-item">
                              <span className="date-label">Check-out:</span>
                              <span className="date-value">{booking.checkOut}</span>
                            </div>
                          </div>
                          <div className="booking-price">
                            <span className="price-label">Price:</span>
                            <span className="price-value">${booking.price}</span>
                          </div>
                        </div>
                        <div className="booking-actions">
                          <button 
                            className="btn btn-primary btn-small"
                            onClick={() => handleViewBooking(booking)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
