import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Explore Destinations</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Discover amazing places around the world</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-grow w-full md:w-auto">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
              <input
                type="text"
                placeholder="Search destinations..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-64 flex-shrink-0">
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-white cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Sort by Rating</option>
                <option value="reviews">Sort by Popularity</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
          
          <div className="text-center mt-4 pt-4 border-t border-gray-50 text-sm font-medium text-gray-500">
            Showing {destinations.length} results
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
          {destinations.map(destination => (
            <Link 
              to={`/destination/${destination.id}`} 
              key={destination.id} 
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col h-full"
            >
              <div className="relative pt-[66.67%] overflow-hidden bg-gray-100">
                <img 
                  src={destination.image} 
                  alt={destination.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                  {destination.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-teal-600 transition-colors">{destination.name}</h3>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 flex-shrink-0 ml-2">
                    <span className="text-amber-400 text-sm">⭐</span>
                    <span className="font-bold text-gray-800 text-sm">{destination.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-1.5">
                  <span>📍</span> {destination.location}
                </p>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                  {destination.description}
                </p>
                
                <div className="mt-auto">
                  <span className="block w-full text-center py-2.5 rounded-lg bg-gray-50 text-teal-700 font-semibold text-sm group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    View Details
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {destinations.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
