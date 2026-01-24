import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

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

      const response = await api.get(`/trips?${params}`);
      const data = response.data;

      if (reset) {
        setTrips(data.trips);
      } else {
        setTrips(prev => [...prev, ...data.trips]);
      }
      setTotalPages(data.pagination.total_pages);
      setTotalItems(data.pagination.total_items);
      setCurrentPage(data.pagination.current_page);

    } catch (error) {
      console.error('Fetch trips error:', error);
      setError(error.response?.data?.message || 'Failed to fetch trips');
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

      const response = await api.get(`/search/trips?${params}`);
      const data = response.data;

      setTrips(data.trips);
      setTotalPages(data.pagination.total_pages);
      setTotalItems(data.pagination.total_items);
      setCurrentPage(data.pagination.current_page);

    } catch (error) {
      console.error('Search error:', error);
      setError(error.response?.data?.message || 'Search failed. Please try again.');
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
      const response = await api.post(`/trips/${tripId}/like`);
      const data = response.data;

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
    } catch (error) {
      console.error('Like error:', error);
      alert(error.response?.data?.message || 'Failed to like trip');
    }
  };

  useEffect(() => {
    fetchTrips(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, destinationFilter]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Explore Trips</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Discover amazing itineraries from travelers around the world</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <form onSubmit={handleSearch} className="flex-1 w-full flex gap-4">
              <div className="relative flex-grow">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search by title or destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                />
              </div>
              <button 
                type="submit" 
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Search
              </button>
            </form>

            <div className="w-full md:w-auto">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-48 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-white cursor-pointer"
              >
                <option value="created_at">Latest</option>
                <option value="like_count">Most Liked</option>
                <option value="average_rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading && trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Loading amazing trips...</p>
          </div>
        ) : (
          <>
            {trips.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="text-5xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No trips found</h3>
                <p className="text-gray-500 mb-6">Be the first to share your adventure!</p>
                <Link to="/upload-trip" className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg">
                  Create Trip
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                {trips.map(trip => (
                  <div key={trip.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col h-full">
                    <div className="relative pt-[66.67%] overflow-hidden bg-gray-100">
                      <Link to={`/trip/${trip.id}`} className="absolute inset-0">
                        <img 
                          src={trip.cover_image_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'} 
                          alt={trip.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </Link>
                      <button 
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                          trip.user_liked 
                            ? 'bg-red-500/90 text-white shadow-lg scale-110' 
                            : 'bg-white/80 text-gray-600 hover:bg-white hover:scale-110'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleLike(trip.id, trip.user_liked);
                        }}
                      >
                        <span className={`${trip.user_liked ? '' : 'grayscale'}`}>❤️</span> 
                        <span className="ml-1 text-xs font-bold">{trip.like_count}</span>
                      </button>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex justify-between items-center mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                          🕒 {trip.duration} days
                        </span>
                        <span className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-100 text-amber-600">
                          ⭐ {trip.average_rating ? trip.average_rating.toFixed(1) : 'New'}
                        </span>
                      </div>
                      
                      <Link to={`/trip/${trip.id}`} className="block mb-2">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-teal-600 transition-colors line-clamp-2">
                          {trip.title}
                        </h3>
                      </Link>
                      
                      <p className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-1.5">
                        <span>📍</span> {trip.destination}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={trip.creator_avatar_url || 'https://ui-avatars.com/api/?name=' + trip.creator_name} 
                            alt={trip.creator_name} 
                            className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                          />
                          <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">{trip.creator_name}</span>
                        </div>
                        <Link 
                          to={`/trip/${trip.id}`} 
                          className="text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentPage < totalPages && (
              <div className="text-center pb-12">
                <button 
                  className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-3 px-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                  onClick={() => fetchTrips(currentPage + 1)}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </span>
                  ) : (
                    'Load More Trips'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
