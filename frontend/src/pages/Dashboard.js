import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-teal-700 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-12 px-4 md:px-8 animate-fade-in">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Welcome back, <span className="text-teal-700">{user?.name || 'Traveler'}</span>! 👋
            </h1>
            <p className="text-lg text-gray-600">Manage your travel plans and bookings</p>
          </div>
          <button 
            className="btn bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 transition-all px-6 py-2.5 rounded-xl font-semibold shadow-sm" 
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 border-l-4 border-l-teal-600">
            <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center text-3xl">📋</div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">{savedPlans.length}</h3>
              <p className="text-sm font-medium text-gray-500">Saved Plans</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 border-l-4 border-l-emerald-500">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-3xl">📅</div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">{bookings.filter(b => b.status === 'upcoming').length}</h3>
              <p className="text-sm font-medium text-gray-500">Upcoming Trips</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 border-l-4 border-l-blue-500">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-3xl">✅</div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">{bookings.filter(b => b.status === 'completed').length}</h3>
              <p className="text-sm font-medium text-gray-500">Completed Trips</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300 border-l-4 border-l-amber-400">
            <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-3xl">⭐</div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">2,450</h3>
              <p className="text-sm font-medium text-gray-500">Reward Points</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button 
              className={`px-8 py-5 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-2
                ${activeTab === 'plans' 
                  ? 'text-teal-700 border-b-2 border-teal-700 bg-teal-50/50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              onClick={() => setActiveTab('plans')}
            >
              <span className="text-xl">🤖</span> AI Plans
            </button>
            <button 
              className={`px-8 py-5 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-2
                ${activeTab === 'bookings' 
                  ? 'text-teal-700 border-b-2 border-teal-700 bg-teal-50/50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              onClick={() => setActiveTab('bookings')}
            >
              <span className="text-xl">✈️</span> Bookings
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8 bg-gray-50/30">
            {activeTab === 'plans' && (
              <div className="animate-fade-in space-y-8">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span className="text-3xl">🤖</span> Saved AI Trip Plans
                </h2>
                
                {savedPlans.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
                    <div className="text-6xl mb-6 opacity-20">📋</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No saved plans yet</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Start planning your dream trips with our AI Trip Planner! It's fast, easy, and personalized.</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate('/ai-planner')}
                    >
                      Create Your First Plan
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {savedPlans.map((plan) => (
                      <div key={plan.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:text-teal-700 transition-colors">{plan.prompt}</h3>
                          <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-1 rounded-lg whitespace-nowrap ml-2">{plan.createdAt}</span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl mb-6 flex-grow">
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">{plan.textPlan}</p>
                        </div>
                        <div className="flex gap-3 mt-auto">
                          <button 
                            className="btn btn-primary btn-small flex-1"
                            onClick={() => handleViewPlan(plan)}
                          >
                            View Plan
                          </button>
                          <button 
                            className="btn btn-secondary btn-small bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-200 border-red-100"
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
              <div className="animate-fade-in space-y-8">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span className="text-3xl">✈️</span> Your Bookings
                </h2>
                
                {bookings.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
                    <div className="text-6xl mb-6 opacity-20">✈️</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No bookings yet</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Explore amazing destinations and book your next adventure with us!</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate('/explore')}
                    >
                      Explore Destinations
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {bookings.map((booking) => {
                      const status = getStatusBadge(booking.status);
                      let statusClasses = "bg-gray-100 text-gray-600";
                      if (status.class === 'upcoming') statusClasses = "bg-emerald-100 text-emerald-700 border border-emerald-200";
                      if (status.class === 'completed') statusClasses = "bg-blue-100 text-blue-700 border border-blue-200";
                      if (status.class === 'cancelled') statusClasses = "bg-red-100 text-red-700 border border-red-200";

                      return (
                        <div key={booking.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col h-full">
                          <div className="relative h-48 overflow-hidden">
                            <img 
                              src={booking.image} 
                              alt={booking.destination} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${statusClasses}`}>
                              {status.text}
                            </div>
                          </div>
                          <div className="p-6 flex flex-col flex-grow">
                            <h3 className="font-bold text-xl text-gray-800 mb-4 group-hover:text-teal-700 transition-colors">{booking.destination}</h3>
                            <div className="space-y-3 mb-6 flex-grow">
                              <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                                <span className="text-gray-500">Check-in</span>
                                <span className="font-semibold text-gray-800">{booking.checkIn}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                                <span className="text-gray-500">Check-out</span>
                                <span className="font-semibold text-gray-800">{booking.checkOut}</span>
                              </div>
                              <div className="flex justify-between items-center pt-1">
                                <span className="text-gray-500">Total Price</span>
                                <span className="font-bold text-lg text-teal-700">${booking.price}</span>
                              </div>
                            </div>
                            <button 
                              className="btn btn-primary w-full mt-auto"
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
    </div>
  );
}
