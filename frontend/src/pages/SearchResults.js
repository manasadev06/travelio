import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ExploreTrips.css'; // Reuse the same styles

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const query = searchParams.get('q') || '';
  
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (query) {
      searchTrips(query, 1);
    }
  }, [query]);

  const searchTrips = async (searchQuery, page = 1) => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        q: searchQuery.trim(),
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

  const loadMore = () => {
    if (currentPage < totalPages) {
      searchTrips(query, currentPage + 1);
    }
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

  if (!query) {
    return (
      <div className="explore-trips-page">
        <div className="container">
          <div className="error-state">
            <div className="error-icon">🔍</div>
            <h3>No Search Query</h3>
            <p>Please enter a search term to find trips.</p>
            <Link to="/explore" className="btn btn-primary">
              Browse All Trips
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="explore-trips-page">
      <div className="container">
        <div className="explore-header">
          <h1>🔍 Search Results</h1>
          <p>Searching for: "{query}"</p>
        </div>

        {/* Results Summary */}
        {totalItems > 0 && (
          <div className="results-summary">
            <p>Found {totalItems} trips matching "{query}"</p>
          </div>
        )}

        {/* Error Message */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Loading State */}
        {loading && currentPage === 1 && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Searching for trips...</p>
          </div>
        )}

        {/* Search Results */}
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
                    <h3 className="trip-title">
                      {trip.title.replace(new RegExp(`(${query})`, 'gi'), '<mark>$1</mark>')}
                    </h3>
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
            <div className="empty-icon">🔍</div>
            <h3>No trips found</h3>
            <p>No trips match your search for "{query}". Try different keywords or browse all trips.</p>
            <Link to="/explore" className="btn btn-primary">
              Browse All Trips
            </Link>
          </div>
        )}

        {/* Load More Button */}
        {!loading && trips.length > 0 && currentPage < totalPages && (
          <div className="load-more-container">
            <button onClick={loadMore} className="btn btn-secondary">
              Load More Results
            </button>
          </div>
        )}

        {/* Search Suggestions */}
        {!loading && trips.length === 0 && !error && (
          <div className="search-suggestions">
            <h3>Search Suggestions:</h3>
            <ul>
              <li>Try different keywords (e.g., "beach", "mountain", "city")</li>
              <li>Search for destinations (e.g., "Bali", "Paris", "Tokyo")</li>
              <li>Use broader terms (e.g., "adventure", "relaxation", "culture")</li>
              <li>Browse all trips to discover popular destinations</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
