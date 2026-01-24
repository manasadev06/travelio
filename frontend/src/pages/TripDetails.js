import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(`/trips/${id}`);
      setTrip(response.data);
    } catch (error) {
      console.error('Fetch trip error:', error);
      setError(error.response?.statusText || 'Trip not found');
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
      const response = await api.post(`/trips/${id}/like`);
      const data = response.data;
      
      setTrip(prev => ({
        ...prev,
        user_liked: data.liked,
        like_count: data.liked ? prev.like_count + 1 : prev.like_count - 1
      }));
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
      const response = await api.post(`/trips/${id}/comments`, {
        comment: commentForm.comment.trim()
      });
      const data = response.data;

      setTrip(prev => ({
        ...prev,
        comments: [data.comment, ...prev.comments],
        comment_count: prev.comment_count + 1
      }));
      setCommentForm({ comment: '' });
      setShowCommentForm(false);
    } catch (error) {
      console.error('Comment error:', error);
      alert(error.response?.data?.message || 'Failed to add comment');
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
      const response = await api.post(`/trips/${id}/reviews`, {
        rating: reviewForm.rating,
        review: reviewForm.review.trim() || null
      });
      const data = response.data;

      setTrip(prev => ({
        ...prev,
        reviews: [data.review, ...prev.reviews],
        review_count: prev.review_count + 1,
        average_rating: ((prev.average_rating * prev.review_count) + reviewForm.rating) / (prev.review_count + 1)
      }));
      setReviewForm({ rating: 5, review: '' });
      setShowReviewForm(false);
    } catch (error) {
      console.error('Review error:', error);
      alert(error.response?.data?.message || 'Failed to add review');
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
          className={`text-2xl transition-all duration-200 ${
            filled ? 'text-yellow-400' : 'text-gray-300'
          } ${
            interactive ? 'cursor-pointer hover:scale-110 hover:text-yellow-500' : 'cursor-default'
          }`}
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
      <div className="min-h-[60vh] flex items-center justify-center w-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Oops!</h2>
            <p className="text-gray-600 mb-8">{error || 'Trip not found'}</p>
            <Link to="/explore" className="btn btn-primary">Back to Explore</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <img 
          src={trip.cover_image_url || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=80'} 
          alt={trip.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
          <div className="container pb-12 text-white">
            <div className="max-w-4xl animate-fade-in">
              <span className="inline-block px-3 py-1 bg-teal-600/90 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
                📍 {trip.destination}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">{trip.title}</h1>
              <div className="flex flex-wrap gap-6 text-lg items-center">
                <span className="flex items-center gap-2">
                  🕒 {trip.duration} Days
                </span>
                <span className="flex items-center gap-2">
                  ⭐ {trip.average_rating ? trip.average_rating.toFixed(1) : 'New'} 
                  <span className="text-sm opacity-80">({trip.review_count} reviews)</span>
                </span>
                <div className="flex items-center gap-2 ml-auto md:ml-0">
                  <img 
                    src={trip.creator_avatar_url || 'https://ui-avatars.com/api/?name=' + trip.creator_name} 
                    alt={trip.creator_name} 
                    className="w-8 h-8 rounded-full border-2 border-white" 
                  />
                  <span className="text-sm font-medium">By {trip.creator_name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container -mt-8 relative z-10 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card bg-white shadow-xl overflow-hidden animate-fade-in">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {['overview', 'itinerary', 'reviews'].map((tab) => (
                  <button 
                    key={tab}
                    className={`px-6 py-4 font-semibold text-sm uppercase tracking-wider transition-colors whitespace-nowrap
                      ${activeTab === tab 
                        ? 'text-teal-700 border-b-2 border-teal-700 bg-teal-50/50' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'reviews' ? `Reviews (${trip.review_count})` : tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 md:p-8">
                {activeTab === 'overview' && (
                  <div className="animate-fade-in space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-4 text-gray-800">About this Trip</h2>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">{trip.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100">
                      <button 
                        className={`btn ${trip.user_liked ? 'bg-red-50 text-red-600 border border-red-200' : 'btn-outline'} gap-2`}
                        onClick={handleLike}
                      >
                        {trip.user_liked ? '❤️ Liked' : '🤍 Like Trip'} 
                        <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-bold ml-1">
                          {trip.like_count}
                        </span>
                      </button>
                      <button 
                        className="btn btn-secondary gap-2"
                        onClick={() => {
                          setActiveTab('reviews');
                          setTimeout(() => {
                            document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        }}
                      >
                        💬 Comments <span className="text-xs opacity-70">({trip.comment_count})</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'itinerary' && (
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold mb-8 text-gray-800">Day by Day Itinerary</h2>
                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                      {trip.trip_days.map((day, index) => (
                        <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-teal-600 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            {day.day_number}
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-lg text-gray-800 mb-2">Day {day.day_number}: {day.title}</h3>
                            <p className="text-gray-600 mb-4 text-sm leading-relaxed">{day.content}</p>
                            {day.image_urls && day.image_urls.length > 0 && (
                              <div className="grid grid-cols-2 gap-2 mt-4">
                                {day.image_urls.map((url, imgIndex) => (
                                  <img 
                                    key={imgIndex} 
                                    src={url} 
                                    alt={`Day ${day.day_number} - ${imgIndex + 1}`} 
                                    className="rounded-lg h-24 w-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="animate-fade-in space-y-10">
                    {/* Reviews */}
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
                        {!showReviewForm && (
                          <button className="btn btn-primary btn-small" onClick={() => setShowReviewForm(true)}>
                            Write a Review
                          </button>
                        )}
                      </div>

                      {showReviewForm && (
                        <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 animate-fade-in">
                          <div className="mb-4">
                            <label className="block font-medium mb-2">Your Rating</label>
                            <div className="flex gap-2 text-2xl">
                              {renderStars(reviewForm.rating, true, (rating) => setReviewForm(prev => ({ ...prev, rating })))}
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block font-medium mb-2">Your Experience</label>
                            <textarea
                              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              rows="4"
                              placeholder="Share your experience..."
                              value={reviewForm.review}
                              onChange={(e) => setReviewForm(prev => ({ ...prev, review: e.target.value }))}
                              required
                            ></textarea>
                          </div>
                          <div className="flex gap-3 justify-end">
                            <button type="button" className="btn btn-secondary btn-small" onClick={() => setShowReviewForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary btn-small" disabled={submitting}>
                              {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="space-y-6">
                        {trip.reviews.length === 0 ? (
                          <p className="text-gray-500 italic text-center py-8">No reviews yet. Be the first to review!</p>
                        ) : (
                          trip.reviews.map((review, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <img src={review.avatar_url || 'https://ui-avatars.com/api/?name=' + review.user_name} alt={review.user_name} className="w-10 h-10 rounded-full bg-gray-200" />
                                  <div>
                                    <span className="block font-semibold text-gray-900">{review.user_name}</span>
                                    <span className="text-xs text-gray-500">{formatDate(review.created_at)}</span>
                                  </div>
                                </div>
                                <div className="flex text-yellow-400 text-sm">{renderStars(review.rating)}</div>
                              </div>
                              <p className="text-gray-700 text-sm leading-relaxed">{review.review}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Comments */}
                    <div id="comments-section" className="pt-8 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Comments & Questions</h2>
                        {!showCommentForm && (
                          <button className="btn btn-outline btn-small" onClick={() => setShowCommentForm(true)}>
                            Add Comment
                          </button>
                        )}
                      </div>

                      {showCommentForm && (
                        <form onSubmit={handleCommentSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 animate-fade-in">
                          <div className="mb-4">
                            <textarea
                              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              rows="3"
                              placeholder="Ask a question or share a thought..."
                              value={commentForm.comment}
                              onChange={(e) => setCommentForm({ comment: e.target.value })}
                              required
                            ></textarea>
                          </div>
                          <div className="flex gap-3 justify-end">
                            <button type="button" className="btn btn-secondary btn-small" onClick={() => setShowCommentForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary btn-small" disabled={submitting}>
                              {submitting ? 'Posting...' : 'Post Comment'}
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="space-y-4">
                        {trip.comments.length === 0 ? (
                          <p className="text-gray-500 italic text-center py-4">No comments yet.</p>
                        ) : (
                          trip.comments.map((comment, index) => (
                            <div key={index} className="flex gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                              <img src={comment.avatar_url || 'https://ui-avatars.com/api/?name=' + comment.user_name} alt={comment.user_name} className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="flex justify-between items-baseline mb-1">
                                  <span className="font-semibold text-sm text-gray-900">{comment.user_name}</span>
                                  <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                                </div>
                                <p className="text-gray-700 text-sm">{comment.comment}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card p-6 bg-white shadow-lg animate-fade-in" style={{animationDelay: '0.1s'}}>
              <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">About the Creator</h3>
              <div className="flex flex-col items-center text-center">
                <img src={trip.creator_avatar_url || 'https://ui-avatars.com/api/?name=' + trip.creator_name} alt={trip.creator_name} className="w-20 h-20 rounded-full mb-3 ring-4 ring-teal-50" />
                <h4 className="font-bold text-lg mb-1">{trip.creator_name}</h4>
                <p className="text-sm text-gray-500 mb-4">Travel Enthusiast</p>
                <Link to={`/user/${trip.creator_id}`} className="btn btn-outline w-full justify-center">View Profile</Link>
              </div>
            </div>

            <div className="card p-6 bg-gradient-to-br from-teal-700 to-teal-900 text-white shadow-lg animate-fade-in" style={{animationDelay: '0.2s'}}>
              <h3 className="font-bold text-xl mb-2">Inspired?</h3>
              <p className="opacity-90 mb-6 text-sm">Use our AI planner to customize this itinerary or create a similar adventure tailored just for you.</p>
              <Link to="/ai-planner" className="btn bg-white text-teal-800 hover:bg-teal-50 w-full justify-center font-bold border-none">
                ✨ Start AI Planner
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
