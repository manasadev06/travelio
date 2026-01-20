import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './UserProfile.css';

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

      const response = await fetch(`http://localhost:5000${endpoint}`, { headers });
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
        stars.push(<span key={i} className="star filled">⭐</span>);
      } else {
        stars.push(<span key={i} className="star empty">⭐</span>);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="user-profile-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="user-profile-page">
        <div className="error-state">
          <div className="error-icon">❌</div>
          <h3>User Not Found</h3>
          <p>{error || 'The user you are looking for does not exist.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="container">
          <div className="header-content">
            <div className="profile-avatar">
              {profileUser.avatar_url ? (
                <img src={profileUser.avatar_url} alt={profileUser.name} />
              ) : (
                <div className="avatar-placeholder">
                  {profileUser.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="profile-info">
              <div className="profile-name-section">
                <h1 className="profile-name">{profileUser.name}</h1>
                <div className="profile-role">
                  {profileUser.role === 'creator' ? (
                    <span className="role-badge creator">👤 Content Creator</span>
                  ) : (
                    <span className="role-badge user">👤 Travel Enthusiast</span>
                  )}
                </div>
              </div>

              <div className="profile-bio">
                {profileUser.bio ? (
                  <p>{profileUser.bio}</p>
                ) : (
                  <p className="no-bio">No bio available</p>
                )}
              </div>

              <div className="profile-stats">
                <div className="stat-item">
                  <div className="stat-value">{profileUser.trip_count || 0}</div>
                  <div className="stat-label">Trips</div>
                </div>

                <div className="stat-item">
                  <div className="stat-value">{profileUser.total_likes_received || 0}</div>
                  <div className="stat-label">Likes</div>
                </div>

                <div className="stat-item">
                  <div className="stat-value">
                    {profileUser.average_rating_received > 0 
                      ? profileUser.average_rating_received.toFixed(1) 
                      : 'New'}
                  </div>
                  <div className="stat-label">Rating</div>
                  {profileUser.average_rating_received > 0 && (
                    <div className="stat-stars">
                      {renderStars(profileUser.average_rating_received)}
                    </div>
                  )}
                </div>

                <div className="stat-item">
                  <div className="stat-value">
                    {formatDate(profileUser.created_at)}
                  </div>
                  <div className="stat-label">Joined</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        <div className="container">
          <div className="content-section">
            <h2 className="section-title">
              {isOwnProfile ? 'My Trips' : `${profileUser.name}'s Trips`}
            </h2>

            {userTrips.length > 0 ? (
              <div className="trips-grid">
                {userTrips.map((trip) => (
                  <div key={trip.id} className="trip-card">
                    <div className="trip-image">
                      {trip.cover_image_url ? (
                        <img src={trip.cover_image_url} alt={trip.title} />
                      ) : (
                        <div className="trip-image-placeholder">
                          🌍 {trip.destination}
                        </div>
                      )}
                    </div>

                    <div className="trip-content">
                      <h3 className="trip-title">{trip.title}</h3>
                      <div className="trip-destination">📍 {trip.destination}</div>
                      <div className="trip-duration">📅 {trip.duration} days</div>

                      <p className="trip-description">
                        {trip.description.length > 150
                          ? `${trip.description.substring(0, 150)}...`
                          : trip.description}
                      </p>

                      <div className="trip-stats">
                        <div className="stat-item">
                          <span className="stat-icon">⭐</span>
                          <span className="stat-value">
                            {trip.average_rating > 0 ? trip.average_rating.toFixed(1) : 'New'}
                          </span>
                          {trip.review_count > 0 && (
                            <span className="stat-count">({trip.review_count})</span>
                          )}
                        </div>

                        <div className="stat-item">
                          <span className="stat-icon">❤️</span>
                          <span className="stat-value">{trip.like_count}</span>
                        </div>

                        <div className="stat-item">
                          <span className="stat-icon">💬</span>
                          <span className="stat-value">{trip.comment_count}</span>
                        </div>
                      </div>

                      <div className="trip-actions">
                        <a href={`/trip/${trip.id}`} className="btn btn-primary">
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🗺️</div>
                <h3>
                  {isOwnProfile ? 'No Trips Yet' : 'No Trips Available'}
                </h3>
                <p>
                  {isOwnProfile
                    ? 'Start sharing your travel experiences by uploading your first trip!'
                    : `${profileUser.name} hasn\'t shared any trips yet.`}
                </p>
                {isOwnProfile && profileUser.role === 'creator' && (
                  <a href="/upload-trip" className="btn btn-primary">
                    📝 Upload Your First Trip
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Additional Sections for Own Profile */}
          {isOwnProfile && (
            <>
              <div className="content-section">
                <h2 className="section-title">Account Settings</h2>
                <div className="settings-card">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Email</h4>
                      <p>{profileUser.email}</p>
                    </div>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Account Type</h4>
                      <p>
                        {profileUser.role === 'creator' 
                          ? 'Content Creator - Can upload trips' 
                          : 'Regular User - Can browse and interact'}
                      </p>
                    </div>
                    {profileUser.role === 'user' && (
                      <button className="btn btn-secondary">
                        Request Creator Access
                      </button>
                    )}
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Member Since</h4>
                      <p>{formatDate(profileUser.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="content-section">
                <h2 className="section-title">Quick Actions</h2>
                <div className="quick-actions">
                  {profileUser.role === 'creator' && (
                    <a href="/upload-trip" className="action-card">
                      <div className="action-icon">📝</div>
                      <div className="action-content">
                        <h4>Upload New Trip</h4>
                        <p>Share your latest travel experience</p>
                      </div>
                    </a>
                  )}

                  <a href="/explore" className="action-card">
                    <div className="action-icon">🌍</div>
                    <div className="action-content">
                      <h4>Explore Trips</h4>
                      <p>Discover amazing travel experiences</p>
                    </div>
                  </a>

                  <a href="/dashboard" className="action-card">
                    <div className="action-icon">📊</div>
                    <div className="action-content">
                      <h4>Dashboard</h4>
                      <p>View your activity and statistics</p>
                    </div>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
