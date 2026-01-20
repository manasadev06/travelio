import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ExploreTrips.css';

export default function ExploreTrips() {
  const { user, isAuthenticated } = useAuth();
  
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchTrips = async (page = 1, reset = false) => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page,
        limit: 12,
        sort: sortBy
      });

      if (destinationFilter) {
        params.append('destination', destinationFilter);
      }

      const response = await fetch(`http://localhost:5000/api/trips?${params}`);
      const data = await response.json();

      if (response.ok) {
        if (reset) {
          setTrips(data.trips);
        } else {
          setTrips(prev => [...prev, ...data.trips]);
        }
        setTotalPages(data.pagination.total_pages);
        setTotalItems(data.pagination.total_items);
        setCurrentPage(data.pagination.current_page);
      } else {
        setError(data.message || 'Failed to fetch trips');
      }
    } catch (error) {
      console.error('Fetch trips error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const searchTrips = async (query, page = 1) => {
    if (!query.trim()) {
      fetchTrips(1, true);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        q: query.trim(),
        page,
        limit: 12
      });

      const response = await fetch(`http://localhost:5000/api/search/trips?${params}`);
      const data = await response.json();

      if (response.ok) {
        setTrips(data.trips);
        setTotalPages(data.pagination.total_pages);
        setTotalItems(data.pagination.total_items);
        setCurrentPage(data.pagination.current_page);
      } else {
        setError(data.message || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchTrips(searchQuery, 1);
  };

  const handleLike = async (tripId, currentlyLiked) => {
    if (!isAuthenticated) {
      alert('Please login to like trips');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/trips/${tripId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Update the trip in the local state
        setTrips(prev => prev.map(trip => {
          if (trip.id === tripId) {
            return {
              ...trip,
              user_liked: data.liked,
              like_count: data.liked ? trip.like_count + 1 : trip.like_count - 1
            };
          }
          return trip;
        }));
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchTrips(1, true);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
    fetchTrips(1, true);
  };

  const loadMore = () => {
    if (currentPage < totalPages) {
      fetchTrips(currentPage + 1, false);
    }
  };

  useEffect(() => {
    fetchTrips(1, true);
  }, [sortBy, destinationFilter]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star filled">⭐</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star half">⭐</span>);
      } else {
        stars.push(<span key={i} className="star empty">⭐</span>);
      }
    }
    return stars;
  };

  return (
    <div className="explore-trips-page">
      <div className="container">
        <div className="explore-header">
          <h1>🌍 Explore Trips</h1>
          <p>Discover amazing travel experiences shared by our community</p>
        </div>

        {/* Search and Filters */}
        <div className="search-filters">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trips, destinations..."
                className="search-input"
              />
              <button type="submit" className="btn btn-primary">
                🔍 Search
              </button>
            </div>
          </form>

          <div className="filters">
            <div className="filter-group">
              <label>Destination</label>
              <input
                type="text"
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value)}
                placeholder="Filter by destination"
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="filter-select"
              >
                <option value="created_at">Latest</option>
                <option value="average_rating">Top Rated</option>
                <option value="like_count">Most Liked</option>
                <option value="comment_count">Most Discussed</option>
              </select>
            </div>

            {isAuthenticated && user?.role === 'creator' && (
              <Link to="/upload-trip" className="btn btn-primary">
                📝 Upload Trip
              </Link>
            )}
          </div>
        </div>

        {/* Results Summary */}
        {totalItems > 0 && (
          <div className="results-summary">
            <p>Found {totalItems} amazing trips</p>
          </div>
        )}

        {/* Error Message */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Loading State */}
        {loading && currentPage === 1 && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading amazing trips...</p>
          </div>
        )}

        {/* Trips Grid */}
        {!loading && trips.length > 0 && (
          <div className="trips-grid">
            {trips.map((trip) => (
              <div key={trip.id} className="trip-card">
                <Link to={`/trip/${trip.id}`} className="trip-link">
                  <div className="trip-image">
                    {trip.cover_image_url ? (
                      <img src={trip.cover_image_url} alt={trip.title} />
                    ) : (
                      <div className="trip-image-placeholder">
                        🌍 {trip.destination}
                      </div>
                    )}
                  </div>
                </Link>

                <div className="trip-content">
                  <div className="trip-header">
                    <h3 className="trip-title">{trip.title}</h3>
                    <div className="trip-destination">
                      📍 {trip.destination}
                    </div>
                  </div>

                  <div className="trip-meta">
                    <span className="trip-duration">📅 {trip.duration} days</span>
                    <span className="trip-creator">
                      by <Link to={`/user/${trip.creator_id}`}>{trip.creator_name}</Link>
                    </span>
                  </div>

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
                    <button
                      onClick={() => handleLike(trip.id, trip.user_liked)}
                      className={`like-btn ${trip.user_liked ? 'liked' : ''}`}
                    >
                      {trip.user_liked ? '❤️ Liked' : '🤍 Like'}
                    </button>

                    <Link to={`/trip/${trip.id}`} className="btn btn-primary btn-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && trips.length === 0 && !error && (
          <div className="empty-state">
            <div className="empty-icon">🗺️</div>
            <h3>No trips found</h3>
            <p>
              {searchQuery || destinationFilter
                ? 'Try adjusting your search or filters'
                : 'Be the first to share an amazing trip!'}
            </p>
            {isAuthenticated && user?.role === 'creator' && (
              <Link to="/upload-trip" className="btn btn-primary">
                📝 Upload Your First Trip
              </Link>
            )}
          </div>
        )}

        {/* Load More Button */}
        {!loading && trips.length > 0 && currentPage < totalPages && (
          <div className="load-more-container">
            <button onClick={loadMore} className="btn btn-secondary">
              Load More Trips
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
