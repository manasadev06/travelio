import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Destination Not Found</h2>
          <p className="text-gray-600 mb-8">The destination you're looking for doesn't exist or has been removed.</p>
          <Link to="/explore" className="btn btn-primary">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <img 
          src={destination.image} 
          alt={destination.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <div className="max-w-4xl">
              <span className="inline-block px-3 py-1 bg-teal-600/90 text-white rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
                📍 {destination.location}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">{destination.name}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-xl">⭐</span>
                  <span className="font-bold text-xl">{destination.rating}</span>
                  <span className="text-sm opacity-80">({destination.totalReviews} reviews)</span>
                </div>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm border border-white/30">
                  {destination.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-10 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About {destination.name}</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{destination.description}</p>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {destination.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-teal-200 transition-colors">
                    <span className="text-2xl">✨</span>
                    <span className="font-medium text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
                <button 
                  className="btn btn-primary"
                  onClick={handleWriteReview}
                >
                  Write Review
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 animate-fade-in">
                  <h3 className="font-bold text-lg mb-4 text-gray-800">Write Your Review</h3>
                  <form onSubmit={handleSubmitReview}>
                    <div className="mb-4">
                      <label className="block font-medium mb-2 text-gray-700">Rating</label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
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
                    <div className="mb-6">
                      <label className="block font-medium mb-2 text-gray-700">Comment</label>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        rows="4"
                        placeholder="Share your experience..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                        required
                      ></textarea>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => setShowReviewForm(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Submit Review
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <span className="block font-semibold text-gray-900">{review.userName}</span>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-yellow-700 font-bold text-sm">
                        <span>⭐</span>
                        <span className="ml-1">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
                    <button className="text-sm text-gray-500 hover:text-teal-600 flex items-center gap-1 transition-colors">
                      👍 Helpful ({review.helpful})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-bold text-xl text-gray-800 mb-6 border-b border-gray-100 pb-4">Quick Info</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2">🗓️ Best Time</span>
                  <span className="font-semibold text-gray-800">{destination.bestTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2">💰 Avg Price</span>
                  <span className="font-semibold text-teal-700">{destination.averagePrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2">🏷️ Category</span>
                  <span className="font-semibold text-gray-800">{destination.category}</span>
                </div>
              </div>
            </div>

            {/* AI Planner CTA */}
            <div className="bg-gradient-to-br from-teal-700 to-teal-900 text-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-9xl opacity-10 -mr-8 -mt-8">🤖</div>
              <h3 className="font-bold text-2xl mb-3 relative z-10">Plan with AI</h3>
              <p className="text-teal-100 mb-6 relative z-10">Get a personalized itinerary for {destination.name} powered by artificial intelligence.</p>
              <button 
                className="w-full py-3 bg-white text-teal-800 rounded-xl font-bold hover:bg-teal-50 hover:scale-[1.02] transition-all shadow-md relative z-10"
                onClick={handlePlanWithAI}
              >
                Generate AI Plan
              </button>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Ready to go?</h3>
              <div className="space-y-3">
                <button className="btn btn-primary w-full justify-center py-3 text-lg">
                  Book This Destination
                </button>
                <button className="btn btn-secondary w-full justify-center">
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
