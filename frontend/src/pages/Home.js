import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const featuredDestinations = [
    {
      id: 1,
      name: "Bali, Indonesia",
      location: "Indonesia",
      description: "Tropical paradise with stunning beaches and vibrant culture",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 1247
    },
    {
      id: 2,
      name: "Paris, France",
      location: "France",
      description: "City of lights with world-class art and cuisine",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 2156
    },
    {
      id: 3,
      name: "Tokyo, Japan",
      location: "Japan",
      description: "Modern metropolis blending tradition and innovation",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 1823
    },
    {
      id: 4,
      name: "Santorini, Greece",
      location: "Greece",
      description: "Iconic white-washed buildings and breathtaking sunsets",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 987
    }
  ];

  return (
    <div className="home page-transition">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Discover Your Perfect Journey</h1>
          <p className="hero-subtitle">
            Explore amazing destinations, plan trips with AI, and create unforgettable memories
          </p>
          <div className="hero-buttons">
            <Link to="/upload-trip" className="btn btn-primary btn-large">
              📝 Upload Trip
            </Link>
            <Link to="/explore" className="btn btn-secondary btn-large">
              Explore Trips
            </Link>
            <Link to="/ai-planner" className="btn btn-secondary btn-large">
              🤖 AI Trip Planner
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="featured-destinations">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Destinations</h2>
            <p className="section-subtitle">Handpicked locations for your next unforgettable journey</p>
          </div>
          
          <div className="destinations-grid">
            {featuredDestinations.map((destination) => (
              <Link key={destination.id} to={`/destination/${destination.id}`} className="destination-card-link">
                <div className="destination-card">
                  <div className="destination-image">
                    <img src={destination.image} alt={destination.name} />
                    <div className="destination-rating">
                      <span className="stars">⭐</span>
                      <span className="rating-value">{destination.rating}</span>
                      <span className="reviews">({destination.reviews})</span>
                    </div>
                  </div>
                  <div className="destination-content">
                    <h3 className="destination-name">{destination.name}</h3>
                    <p className="destination-location">📍 {destination.location}</p>
                    <p className="destination-description">{destination.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="view-all-container">
            <Link to="/explore" className="btn btn-primary">
              View All Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* AI Planner CTA Section */}
      <section className="ai-planner-cta">
        <div className="container">
          <div className="cta-content">
            <div className="cta-text">
              <h2>Plan Your Trip with AI</h2>
              <p>Get personalized itineraries powered by artificial intelligence. Just describe your dream trip and let our AI create the perfect plan for you.</p>
              <ul className="ai-features">
                <li>✨ Personalized recommendations</li>
                <li>📅 Day-by-day itineraries</li>
                <li>🗺️ Visual flowcharts</li>
                <li>💰 Budget-friendly suggestions</li>
              </ul>
            </div>
            <div className="cta-visual">
              <div className="ai-icon">🤖</div>
              <Link to="/ai-planner" className="btn btn-primary btn-large">
                Try AI Planner
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose TravelPlan</h2>
            <p className="section-subtitle">Everything you need for perfect travel planning</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Explore</h3>
              <p>Discover amazing destinations curated by travel experts around the world.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Planning</h3>
              <p>Get intelligent trip recommendations and personalized itineraries instantly.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Reviews</h3>
              <p>Read authentic reviews from fellow travelers to make informed decisions.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3>Save Plans</h3>
              <p>Save your favorite destinations and AI-generated plans for future trips.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Secure</h3>
              <p>Book with confidence knowing your data and payments are protected.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Personalized</h3>
              <p>Get recommendations tailored to your preferences and travel style.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
