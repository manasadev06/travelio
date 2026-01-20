import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./DestinationDetails.css";

export default function DestinationDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });

  // Mock destination data
  const destinations = {
    1: {
      id: 1,
      name: "Bali Paradise",
      location: "Bali, Indonesia",
      description: "Bali is a tropical paradise that offers everything from pristine beaches to ancient temples. This Indonesian island is known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs. The island is home to religious sites such as cliffside Uluwatu Temple. To the south, the beachside city of Kuta has lively bars, while Seminyak, Sanur and Nusa Dua are popular resort towns. The island is also known for its yoga and meditation retreats.",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1200&h=600&fit=crop",
      rating: 4.9,
      totalReviews: 1247,
      category: "Beach",
      bestTime: "April to October",
      averagePrice: "$1,299",
      highlights: ["Beautiful Beaches", "Ancient Temples", "Rice Terraces", "Surfing Spots"]
    },
    2: {
      id: 2,
      name: "Paris Getaway",
      location: "Paris, France",
      description: "Paris, France's capital, is a major European city and a global center for art, fashion, gastronomy and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine. Beyond such landmarks as the Eiffel Tower and the 12th-century, Gothic Notre-Dame cathedral, the city is known for its cafe culture and designer boutiques along the Rue du Faubourg Saint-Honoré.",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=600&fit=crop",
      rating: 4.8,
      totalReviews: 2156,
      category: "City",
      bestTime: "June to August",
      averagePrice: "$2,199",
      highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame", "Champs-Élysées"]
    }
  };

  // Mock reviews data
  const mockReviews = [
    {
      id: 1,
      userName: "Sarah Johnson",
      rating: 5,
      comment: "Absolutely breathtaking destination! The beaches are pristine and the local culture is so welcoming. Would definitely recommend to anyone looking for a tropical paradise.",
      date: "2024-01-15",
      helpful: 23
    },
    {
      id: 2,
      userName: "Mike Chen",
      rating: 4,
      comment: "Great experience overall. The temples are amazing and the food is incredible. Only downside was the crowds during peak season.",
      date: "2024-01-10",
      helpful: 15
    },
    {
      id: 3,
      userName: "Emma Wilson",
      rating: 5,
      comment: "This was my dream vacation! Everything exceeded my expectations. The local guides were knowledgeable and the accommodations were perfect.",
      date: "2024-01-05",
      helpful: 31
    },
    {
      id: 4,
      userName: "David Brown",
      rating: 4,
      comment: "Beautiful destination with lots to see and do. The scenery is stunning and the people are friendly. Would love to visit again!",
      date: "2023-12-28",
      helpful: 18
    },
    {
      id: 5,
      userName: "Lisa Anderson",
      rating: 5,
      comment: "Paradise on earth! The beaches are clean, the water is clear, and there are so many activities to choose from. Highly recommend!",
      date: "2023-12-20",
      helpful: 27
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDestination(destinations[id] || destinations[1]);
      setReviews(mockReviews);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowReviewForm(true);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    // Create new review
    const newReview = {
      id: reviews.length + 1,
      userName: user?.name || "Anonymous",
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: new Date().toISOString().split('T')[0],
      helpful: 0
    };

    // Add review to the list
    setReviews([newReview, ...reviews]);
    
    // Update destination rating
    if (destination) {
      const newTotalReviews = destination.totalReviews + 1;
      const newRating = ((destination.rating * destination.totalReviews) + reviewForm.rating) / newTotalReviews;
      setDestination({
        ...destination,
        rating: Math.round(newRating * 10) / 10,
        totalReviews: newTotalReviews
      });
    }

    // Reset form
    setReviewForm({ rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  const handlePlanWithAI = () => {
    navigate('/ai-planner');
  };

  if (loading) {
    return (
      <div className="destination-details-page">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="destination-details-page">
        <div className="not-found">
          <h2>Destination Not Found</h2>
          <p>The destination you're looking for doesn't exist.</p>
          <Link to="/explore" className="btn btn-primary">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="destination-details-page page-transition">
      {/* Hero Banner */}
      <section className="destination-hero">
        <div className="hero-image">
          <img src={destination.image} alt={destination.name} />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="destination-header">
              <div>
                <h1 className="destination-title">{destination.name}</h1>
                <p className="destination-location">📍 {destination.location}</p>
              </div>
              <div className="destination-meta">
                <div className="rating-display">
                  <span className="stars">⭐</span>
                  <span className="rating-value">{destination.rating}</span>
                  <span className="reviews-count">({destination.totalReviews} reviews)</span>
                </div>
                <span className="category-badge">{destination.category}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Main Content */}
        <div className="destination-content">
          {/* Left Column */}
          <div className="main-column">
            {/* Description */}
            <section className="description-section">
              <h2>About {destination.name}</h2>
              <p className="destination-description">{destination.description}</p>
            </section>

            {/* Highlights */}
            <section className="highlights-section">
              <h2>Highlights</h2>
              <div className="highlights-grid">
                {destination.highlights.map((highlight, index) => (
                  <div key={index} className="highlight-item">
                    <span className="highlight-icon">✨</span>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews Section */}
            <section className="reviews-section">
              <div className="reviews-header">
                <h2>Reviews</h2>
                <button 
                  className="btn btn-primary"
                  onClick={handleWriteReview}
                >
                  Write Review
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="review-form">
                  <h3>Write Your Review</h3>
                  <form onSubmit={handleSubmitReview}>
                    <div className="form-group">
                      <label className="form-label">Rating</label>
                      <select
                        className="form-input"
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})}
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                        <option value={4}>⭐⭐⭐⭐ Very Good</option>
                        <option value={3}>⭐⭐⭐ Good</option>
                        <option value={2}>⭐⭐ Fair</option>
                        <option value={1}>⭐ Poor</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Comment</label>
                      <textarea
                        className="form-input"
                        rows="4"
                        placeholder="Share your experience..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                        required
                      ></textarea>
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">
                        Submit Review
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => setShowReviewForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Reviews List */}
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <span className="reviewer-name">{review.userName}</span>
                        <span className="review-date">{review.date}</span>
                      </div>
                      <div className="review-rating">
                        <span className="stars">⭐</span>
                        <span>{review.rating}</span>
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                    <div className="review-footer">
                      <button className="helpful-btn">
                        👍 Helpful ({review.helpful})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="sidebar">
            {/* Quick Info */}
            <div className="info-card">
              <h3>Quick Info</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Best Time to Visit</span>
                  <span className="info-value">{destination.bestTime}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Average Price</span>
                  <span className="info-value">{destination.averagePrice}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Category</span>
                  <span className="info-value">{destination.category}</span>
                </div>
              </div>
            </div>

            {/* AI Planner CTA */}
            <div className="info-card ai-planner-card">
              <h3>🤖 Plan with AI</h3>
              <p>Get a personalized itinerary for {destination.name} powered by artificial intelligence.</p>
              <button className="btn btn-primary" onClick={handlePlanWithAI}>
                Generate AI Plan
              </button>
            </div>

            {/* Actions */}
            <div className="info-card">
              <h3>Actions</h3>
              <div className="action-buttons">
                <button className="btn btn-primary btn-large">
                  Book This Destination
                </button>
                <button className="btn btn-secondary">
                  Save to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
