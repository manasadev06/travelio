import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './TripDetails.css';

export default function TripDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review: ''
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Comment form state
  const [commentForm, setCommentForm] = useState({
    comment: ''
  });
  const [showCommentForm, setShowCommentForm] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`http://localhost:5000/api/trips/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTrip(data);
      } else {
        setError(response.statusText || 'Trip not found');
      }
    } catch (error) {
      console.error('Fetch trip error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Please login to like trips');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/trips/${id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTrip(prev => ({
          ...prev,
          user_liked: data.liked,
          like_count: data.liked ? prev.like_count + 1 : prev.like_count - 1
        }));
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please login to comment');
      return;
    }

    if (!commentForm.comment.trim()) {
      alert('Please enter a comment');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/trips/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          comment: commentForm.comment.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTrip(prev => ({
          ...prev,
          comments: [data.comment, ...prev.comments],
          comment_count: prev.comment_count + 1
        }));
        setCommentForm({ comment: '' });
        setShowCommentForm(false);
      } else {
        alert(data.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Comment error:', error);
      alert('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please login to review');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/trips/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: reviewForm.rating,
          review: reviewForm.review.trim() || null
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTrip(prev => ({
          ...prev,
          reviews: [data.review, ...prev.reviews],
          review_count: prev.review_count + 1,
          average_rating: ((prev.average_rating * prev.review_count) + reviewForm.rating) / (prev.review_count + 1)
        }));
        setReviewForm({ rating: 5, review: '' });
        setShowReviewForm(false);
      } else {
        alert(data.message || 'Failed to add review');
      }
    } catch (error) {
      console.error('Review error:', error);
      alert('Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 1; i <= 5; i++) {
      const filled = i <= fullStars;
      stars.push(
        <span
          key={i}
          className={`star ${filled ? 'filled' : 'empty'} ${interactive ? 'interactive' : ''}`}
          onClick={interactive && onChange ? () => onChange(i) : null}
        >
          ⭐
        </span>
      );
    }
    return stars;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="trip-details-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="trip-details-page">
        <div className="error-state">
          <div className="error-icon">❌</div>
          <h3>Trip Not Found</h3>
          <p>{error || 'The trip you are looking for does not exist.'}</p>
          <Link to="/explore" className="btn btn-primary">
            Browse Other Trips
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="trip-details-page">
      {/* Header Section */}
      <div className="trip-header">
        <div className="container">
          <div className="header-content">
            <div className="trip-image">
              {trip.cover_image_url ? (
                <img src={trip.cover_image_url} alt={trip.title} />
              ) : (
                <div className="trip-image-placeholder">
                  🌍 {trip.destination}
                </div>
              )}
            </div>

            <div className="trip-info">
              <div className="trip-breadcrumb">
                <Link to="/explore">Explore</Link> / {trip.destination}
              </div>

              <h1 className="trip-title">{trip.title}</h1>
              
              <div className="trip-meta">
                <div className="meta-item">
                  <span className="meta-icon">📍</span>
                  <span>{trip.destination}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">📅</span>
                  <span>{trip.duration} days</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">👤</span>
                  <Link to={`/user/${trip.creator_id}`} className="creator-link">
                    {trip.creator_name}
                  </Link>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">📆</span>
                  <span>{formatDate(trip.created_at)}</span>
                </div>
              </div>

              <div className="trip-stats">
                <div className="stat-item">
                  <div className="stat-value">
                    {trip.average_rating > 0 ? trip.average_rating.toFixed(1) : 'New'}
                  </div>
                  <div className="stat-label">Rating</div>
                  <div className="stat-stars">
                    {renderStars(trip.average_rating)}
                  </div>
                  {trip.review_count > 0 && (
                    <div className="stat-count">({trip.review_count} reviews)</div>
                  )}
                </div>

                <div className="stat-item">
                  <div className="stat-value">{trip.like_count}</div>
                  <div className="stat-label">Likes</div>
                </div>

                <div className="stat-item">
                  <div className="stat-value">{trip.comment_count}</div>
                  <div className="stat-label">Comments</div>
                </div>
              </div>

              <div className="trip-actions">
                <button
                  onClick={handleLike}
                  className={`like-btn ${trip.user_liked ? 'liked' : ''}`}
                >
                  {trip.user_liked ? '❤️ Liked' : '🤍 Like'}
                </button>

                {isAuthenticated && (
                  <>
                    <button
                      onClick={() => setShowCommentForm(!showCommentForm)}
                      className="btn btn-secondary"
                    >
                      💬 Comment
                    </button>

                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="btn btn-primary"
                    >
                      ⭐ Review
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="trip-content">
        <div className="container">
          <div className="content-layout">
            {/* Main Content */}
            <div className="main-content">
              {/* Tabs */}
              <div className="content-tabs">
                <button
                  className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={`tab ${activeTab === 'itinerary' ? 'active' : ''}`}
                  onClick={() => setActiveTab('itinerary')}
                >
                  Itinerary ({trip.day_count})
                </button>
                <button
                  className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews ({trip.review_count})
                </button>
                <button
                  className={`tab ${activeTab === 'comments' ? 'active' : ''}`}
                  onClick={() => setActiveTab('comments')}
                >
                  Comments ({trip.comment_count})
                </button>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="overview-content">
                    <h2>Trip Description</h2>
                    <div className="description">
                      {trip.description.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>

                    {trip.creator_avatar_url && (
                      <div className="creator-section">
                        <h3>About the Creator</h3>
                        <div className="creator-card">
                          <div className="creator-avatar">
                            <img src={trip.creator_avatar_url} alt={trip.creator_name} />
                          </div>
                          <div className="creator-info">
                            <h4>{trip.creator_name}</h4>
                            <p>Content Creator</p>
                            <Link to={`/user/${trip.creator_id}`} className="btn btn-secondary btn-sm">
                              View Profile
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Itinerary Tab */}
                {activeTab === 'itinerary' && (
                  <div className="itinerary-content">
                    <h2>Day-wise Itinerary</h2>
                    {trip.trip_days && trip.trip_days.length > 0 ? (
                      <div className="itinerary-days">
                        {trip.trip_days.map((day) => (
                          <div key={day.id} className="day-card">
                            <div className="day-header">
                              <h3>Day {day.day_number}: {day.title}</h3>
                            </div>
                            <div className="day-content">
                              <p>{day.content}</p>
                              {day.image_urls && day.image_urls.length > 0 && (
                                <div className="day-images">
                                  {day.image_urls.map((url, index) => (
                                    <img
                                      key={index}
                                      src={url}
                                      alt={`Day ${day.day_number} - Image ${index + 1}`}
                                      className="day-image"
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No detailed itinerary available.</p>
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="reviews-content">
                    <div className="section-header">
                      <h2>Reviews</h2>
                      {isAuthenticated && (
                        <button
                          onClick={() => setShowReviewForm(!showReviewForm)}
                          className="btn btn-primary"
                        >
                          Write Review
                        </button>
                      )}
                    </div>

                    {showReviewForm && (
                      <form onSubmit={handleReviewSubmit} className="review-form">
                        <div className="form-group">
                          <label>Rating</label>
                          <div className="rating-input">
                            {renderStars(reviewForm.rating, true, (rating) =>
                              setReviewForm(prev => ({ ...prev, rating }))
                            )}
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Review (Optional)</label>
                          <textarea
                            value={reviewForm.review}
                            onChange={(e) => setReviewForm(prev => ({ ...prev, review: e.target.value }))}
                            placeholder="Share your experience with this trip..."
                            rows="4"
                            maxLength="1000"
                          />
                        </div>

                        <div className="form-actions">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                          >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="btn btn-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}

                    {trip.reviews && trip.reviews.length > 0 ? (
                      <div className="reviews-list">
                        {trip.reviews.map((review) => (
                          <div key={review.id} className="review-card">
                            <div className="review-header">
                              <div className="reviewer-info">
                                {review.avatar_url && (
                                  <img src={review.avatar_url} alt={review.user_name} className="reviewer-avatar" />
                                )}
                                <div>
                                  <div className="reviewer-name">{review.user_name}</div>
                                  <div className="review-date">{formatDate(review.created_at)}</div>
                                </div>
                              </div>
                              <div className="review-rating">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                            {review.review && (
                              <div className="review-content">
                                <p>{review.review}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No reviews yet. Be the first to review this trip!</p>
                    )}
                  </div>
                )}

                {/* Comments Tab */}
                {activeTab === 'comments' && (
                  <div className="comments-content">
                    <div className="section-header">
                      <h2>Comments</h2>
                      {isAuthenticated && (
                        <button
                          onClick={() => setShowCommentForm(!showCommentForm)}
                          className="btn btn-primary"
                        >
                          Add Comment
                        </button>
                      )}
                    </div>

                    {showCommentForm && (
                      <form onSubmit={handleCommentSubmit} className="comment-form">
                        <div className="form-group">
                          <textarea
                            value={commentForm.comment}
                            onChange={(e) => setCommentForm(prev => ({ ...prev, comment: e.target.value }))}
                            placeholder="Share your thoughts about this trip..."
                            rows="3"
                            maxLength="500"
                            required
                          />
                        </div>

                        <div className="form-actions">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                          >
                            {submitting ? 'Posting...' : 'Post Comment'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowCommentForm(false)}
                            className="btn btn-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}

                    {trip.comments && trip.comments.length > 0 ? (
                      <div className="comments-list">
                        {trip.comments.map((comment) => (
                          <div key={comment.id} className="comment-card">
                            <div className="comment-header">
                              <div className="commenter-info">
                                {comment.avatar_url && (
                                  <img src={comment.avatar_url} alt={comment.user_name} className="commenter-avatar" />
                                )}
                                <div>
                                  <div className="commenter-name">{comment.user_name}</div>
                                  <div className="comment-date">{formatDate(comment.created_at)}</div>
                                </div>
                              </div>
                            </div>
                            <div className="comment-content">
                              <p>{comment.comment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No comments yet. Start the conversation!</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="sidebar">
              {/* Quick Actions */}
              <div className="sidebar-section">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <button
                    onClick={handleLike}
                    className={`like-btn ${trip.user_liked ? 'liked' : ''}`}
                  >
                    {trip.user_liked ? '❤️ Liked' : '🤍 Like'}
                  </button>

                  {isAuthenticated && (
                    <>
                      <button
                        onClick={() => setShowCommentForm(true)}
                        className="btn btn-secondary"
                      >
                        💬 Comment
                      </button>

                      <button
                        onClick={() => setShowReviewForm(true)}
                        className="btn btn-primary"
                      >
                        ⭐ Review
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Trip Stats */}
              <div className="sidebar-section">
                <h3>Trip Stats</h3>
                <div className="stats-list">
                  <div className="stat-row">
                    <span>Duration</span>
                    <span>{trip.duration} days</span>
                  </div>
                  <div className="stat-row">
                    <span>Likes</span>
                    <span>{trip.like_count}</span>
                  </div>
                  <div className="stat-row">
                    <span>Comments</span>
                    <span>{trip.comment_count}</span>
                  </div>
                  <div className="stat-row">
                    <span>Reviews</span>
                    <span>{trip.review_count}</span>
                  </div>
                  <div className="stat-row">
                    <span>Average Rating</span>
                    <span>
                      {trip.average_rating > 0 ? trip.average_rating.toFixed(1) : 'New'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="sidebar-section">
                <h3>Share Trip</h3>
                <div className="share-buttons">
                  <button className="share-btn">📋 Copy Link</button>
                  <button className="share-btn">📧 Email</button>
                  <button className="share-btn">💬 WhatsApp</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
