import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Explore.css";

export default function Explore() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  const allDestinations = [
    {
      id: 1,
      name: "Bali Paradise",
      location: "Bali, Indonesia",
      description: "Discover tropical beaches, ancient temples, and vibrant culture in this Indonesian paradise.",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 1247,
      category: "Beach"
    },
    {
      id: 2,
      name: "Paris Getaway",
      location: "Paris, France",
      description: "Experience the city of lights with world-class art, cuisine, and iconic landmarks.",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 2156,
      category: "City"
    },
    {
      id: 3,
      name: "Swiss Alps Adventure",
      location: "Switzerland",
      description: "Breathtaking mountain views, skiing, and charming alpine villages await in Switzerland.",
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 892,
      category: "Mountain"
    },
    {
      id: 4,
      name: "Tokyo Discovery",
      location: "Tokyo, Japan",
      description: "Modern metropolis meets ancient tradition in Japan's vibrant capital city.",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 1823,
      category: "City"
    },
    {
      id: 5,
      name: "Santorini Dreams",
      location: "Santorini, Greece",
      description: "Iconic white-washed buildings, stunning sunsets, and crystal-clear waters.",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 1567,
      category: "Island"
    },
    {
      id: 6,
      name: "Dubai Luxury",
      location: "Dubai, UAE",
      description: "Experience futuristic architecture, luxury shopping, and desert adventures.",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop",
      rating: 4.6,
      reviews: 743,
      category: "City"
    },
    {
      id: 7,
      name: "New York Explorer",
      location: "New York, USA",
      description: "The city that never sleeps offers Broadway shows, museums, and iconic landmarks.",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 2341,
      category: "City"
    },
    {
      id: 8,
      name: "Maldives Retreat",
      location: "Maldives",
      description: "Luxury overwater bungalows, pristine beaches, and world-class diving.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 892,
      category: "Beach"
    },
    {
      id: 9,
      name: "Rome Heritage",
      location: "Rome, Italy",
      description: "Step back in time with ancient ruins, Renaissance art, and incredible cuisine.",
      image: "https://images.unsplash.com/photo-1522806580425-6223db1e7d66?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 1678,
      category: "Historical"
    },
    {
      id: 10,
      name: "Iceland Adventure",
      location: "Iceland",
      description: "Northern lights, glaciers, hot springs, and dramatic landscapes await.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 543,
      category: "Nature"
    },
    {
      id: 11,
      name: "Marrakech Magic",
      location: "Marrakech, Morocco",
      description: "Explore vibrant souks, stunning palaces, and the magic of North Africa.",
      image: "https://images.unsplash.com/photo-1517897069063-9a427ee5d5a3?w=400&h=300&fit=crop",
      rating: 4.6,
      reviews: 892,
      category: "Cultural"
    },
    {
      id: 12,
      name: "Costa Rica Eco",
      location: "Costa Rica",
      description: "Rainforests, wildlife, volcanoes, and sustainable tourism adventures.",
      image: "https://images.unsplash.com/photo-1516549655169-26f2441a589f?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 654,
      category: "Nature"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDestinations(allDestinations);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = destinations;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort destinations
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews - a.reviews;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setDestinations(filtered);
  }, [searchTerm, sortBy]);

  if (loading) {
    return (
      <div className="explore-page">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="explore-page page-transition">
      <div className="container">
        {/* Header */}
        <div className="explore-header">
          <h1 className="page-title">Explore Destinations</h1>
          <p className="page-subtitle">Discover amazing places around the world</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-container">
            <div className="search-box">
              <input
                type="text"
                className="form-input"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="sort-box">
              <select
                className="form-input"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Sort by Rating</option>
                <option value="reviews">Sort by Reviews</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>

          <div className="results-count">
            {destinations.length} destinations found
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="destinations-grid">
          {destinations.map((destination) => (
            <Link key={destination.id} to={`/destination/${destination.id}`} className="destination-card">
              <div className="destination-image">
                <img src={destination.image} alt={destination.name} />
                <div className="destination-category">{destination.category}</div>
              </div>
              
              <div className="destination-content">
                <div className="destination-header">
                  <h3 className="destination-name">{destination.name}</h3>
                  <div className="destination-rating">
                    <span className="stars">⭐</span>
                    <span className="rating-value">{destination.rating}</span>
                    <span className="reviews">({destination.reviews})</span>
                  </div>
                </div>
                
                <p className="destination-location">📍 {destination.location}</p>
                <p className="destination-description">{destination.description}</p>
                
                <button className="btn btn-primary btn-small">
                  View Details
                </button>
              </div>
            </Link>
          ))}
        </div>

        {destinations.length === 0 && (
          <div className="no-results">
            <h3>No destinations found</h3>
            <p>Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
