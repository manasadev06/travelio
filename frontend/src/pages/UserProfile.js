import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  
  const [profileUser, setProfileUser] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const isOwn = isAuthenticated && user && parseInt(id) === user.id;
    setIsOwnProfile(isOwn);
    fetchUserProfile();
  }, [id, isAuthenticated, user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const endpoint = isOwnProfile ? '/api/user/profile' : `/api/users/${id}`;
      const token = localStorage.getItem('token');
      
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:3002${endpoint}`, { headers });
      const data = await response.json();

      if (response.ok) {
        setProfileUser(data);
        setUserTrips(data.trips || []);
      } else {
        setError(data.message || 'User not found');
      }
    } catch (error) {
      console.error('Fetch user profile error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">⭐</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">⭐</span>);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-100">
          <div className="text-4xl mb-4">❌</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">User Not Found</h3>
          <p className="text-gray-600 mb-6">{error || 'The user you are looking for does not exist.'}</p>
          <Link to="/explore" className="inline-block px-6 py-2 bg-teal-600 text-white rounded-full font-bold hover:bg-teal-700 transition-colors">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 page-wrapper">
      {/* Profile Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0">
              {profileUser.avatar_url ? (
                <img src={profileUser.avatar_url} alt={profileUser.name} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-teal-100 flex items-center justify-center text-4xl font-bold text-teal-700 border-4 border-white shadow-lg">
                  {profileUser.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{profileUser.name}</h1>
                <div className="inline-block">
                  {profileUser.role === 'creator' ? (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold flex items-center gap-1">
                      👤 Content Creator
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold flex items-center gap-1">
                      👤 Travel Enthusiast
                    </span>
                  )}
                </div>
              </div>

              <div className="max-w-2xl mb-6">
                {profileUser.bio ? (
                  <p className="text-gray-600 leading-relaxed">{profileUser.bio}</p>
                ) : (
                  <p className="text-gray-400 italic">No bio available</p>
                )}
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-12 p-4 bg-gray-50 rounded-xl inline-flex border border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{profileUser.trip_count || 0}</div>
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Trips</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{profileUser.total_likes_received || 0}</div>
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Likes</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1">
                    {profileUser.average_rating_received > 0 
                      ? profileUser.average_rating_received.toFixed(1) 
                      : 'New'}
                    {profileUser.average_rating_received > 0 && <span className="text-yellow-400 text-lg">⭐</span>}
                  </div>
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Rating</div>
                </div>

                <div className="text-center pl-6 border-l border-gray-200">
                  <div className="text-base font-semibold text-gray-900">{formatDate(profileUser.created_at)}</div>
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Joined</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Trips Section */}
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <span className="text-teal-600">🌍</span>
              {isOwnProfile ? 'My Trips' : `${profileUser.name}'s Trips`}
            </h2>

            {userTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userTrips.map((trip) => (
                  <div key={trip.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 group">
                    <div className="relative h-48 overflow-hidden">
                      {trip.cover_image_url ? (
                        <img 
                          src={trip.cover_image_url} 
                          alt={trip.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-teal-50 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
                          🌍
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                        ⭐ {trip.average_rating > 0 ? trip.average_rating.toFixed(1) : 'New'}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-teal-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                          📍 {trip.destination}
                        </span>
                        <span className="text-gray-400 text-xs flex items-center gap-1">
                          📅 {trip.duration} Days
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-teal-600 transition-colors">
                        {trip.title}
                      </h3>

                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 h-[4.5em]">
                        {trip.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><span className="text-red-400">❤️</span> {trip.like_count}</span>
                          <span className="flex items-center gap-1"><span className="text-blue-400">💬</span> {trip.comment_count}</span>
                        </div>
                        <Link to={`/trip/${trip.id}`} className="text-teal-600 font-bold text-sm hover:underline">
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                <div className="text-6xl mb-4 opacity-50">🗺️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {isOwnProfile ? 'No Trips Yet' : 'No Trips Available'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {isOwnProfile
                    ? 'Start sharing your travel experiences by uploading your first trip!'
                    : `${profileUser.name} hasn't shared any trips yet.`}
                </p>
                {isOwnProfile && profileUser.role === 'creator' && (
                  <Link to="/upload-trip" className="inline-block px-6 py-3 bg-teal-600 text-white rounded-full font-bold hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    📝 Upload Your First Trip
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Additional Sections for Own Profile */}
          {isOwnProfile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in" style={{animationDelay: '0.1s'}}>
              {/* Settings Section */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-gray-500">⚙️</span> Account Settings
                </h2>
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-3 border-b border-gray-50">
                    <div>
                      <h4 className="font-semibold text-gray-900">Email</h4>
                      <p className="text-sm text-gray-500">{profileUser.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-50">
                    <div>
                      <h4 className="font-semibold text-gray-900">Account Type</h4>
                      <p className="text-sm text-gray-500">
                        {profileUser.role === 'creator' 
                          ? 'Content Creator - Can upload trips' 
                          : 'Regular User - Can browse and interact'}
                      </p>
                    </div>
                    {profileUser.role === 'user' && (
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
                        Request Creator Access
                      </button>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">Member Since</h4>
                      <p className="text-sm text-gray-500">{formatDate(profileUser.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Section */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-gray-500">⚡</span> Quick Actions
                </h2>
                <div className="space-y-4">
                  {profileUser.role === 'creator' && (
                    <Link to="/upload-trip" className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-teal-500 hover:bg-teal-50 hover:shadow-md transition-all group">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📝</div>
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-teal-700">Upload New Trip</h4>
                        <p className="text-sm text-gray-500">Share your latest travel experience</p>
                      </div>
                    </Link>
                  )}

                  <Link to="/explore" className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-teal-500 hover:bg-teal-50 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform">🌍</div>
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-teal-700">Explore Trips</h4>
                      <p className="text-sm text-gray-500">Discover amazing travel experiences</p>
                    </div>
                  </Link>

                  <Link to="/dashboard" className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-teal-500 hover:bg-teal-50 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📊</div>
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-teal-700">Dashboard</h4>
                      <p className="text-sm text-gray-500">View your activity and statistics</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
