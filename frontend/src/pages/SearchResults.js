import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

      const response = await fetch(`http://localhost:3002/api/search/trips?${params}`);
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
      const response = await fetch(`http://localhost:3002/api/trips/${tripId}/like`, {
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
        stars.push(<span key={i} className="text-yellow-400">⭐</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">⭐</span>);
      }
    }
    return stars;
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 page-wrapper">
        <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-xl animate-fade-in border border-gray-100">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Search Query</h3>
          <p className="text-gray-600 mb-6">Please enter a search term to find trips.</p>
          <Link to="/explore" className="btn btn-primary w-full justify-center">
            Browse All Trips
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 page-wrapper">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">🔍 Search Results</h1>
          <p className="text-lg text-gray-600">
            Searching for: <span className="font-bold text-teal-600">"{query}"</span>
          </p>
        </div>

        {/* Results Summary */}
        {totalItems > 0 && (
          <div className="mb-8 flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 animate-fade-in">
            <p className="text-gray-700 font-medium">Found <span className="text-teal-600 font-bold">{totalItems}</span> trips matching your search</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md animate-fade-in">
            <div className="flex">
              <div className="flex-shrink-0 text-red-500">⚠️</div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && currentPage === 1 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Searching for trips...</p>
          </div>
        )}

        {/* Search Results */}
        {!loading && trips.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 group flex flex-col h-full">
                <div className="relative h-56 overflow-hidden flex-shrink-0">
                  <Link to={`/trip/${trip.id}`} className="block h-full">
                    {trip.cover_image_url ? (
                      <img 
                        src={trip.cover_image_url} 
                        alt={trip.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-teal-50 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
                        🌍
                      </div>
                    )}
                  </Link>
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={() => handleLike(trip.id, trip.user_liked)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md transition-all flex items-center gap-1 backdrop-blur-sm
                        ${trip.user_liked 
                          ? 'bg-red-50 text-red-500 border border-red-100 hover:bg-red-100' 
                          : 'bg-white/90 text-gray-600 hover:bg-white'
                        }`}
                    >
                      {trip.user_liked ? '❤️ Liked' : '🤍 Like'}
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                     <span className="px-2 py-1 bg-black/60 text-white text-xs font-bold rounded backdrop-blur-sm">
                       📍 {trip.destination}
                     </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      <span>📅 {trip.duration} Days</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                      ⭐ {trip.average_rating > 0 ? trip.average_rating.toFixed(1) : 'New'}
                    </div>
                  </div>

                  <Link to={`/trip/${trip.id}`} className="block mb-3">
                    <h3 
                      className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: trip.title.replace(new RegExp(`(${query})`, 'gi'), '<mark class="bg-yellow-200 text-gray-900 rounded px-0.5">$1</mark>')
                      }}
                    />
                  </Link>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                    {trip.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                    <div className="flex items-center gap-2">
                      <img 
                        src={trip.creator_avatar_url || 'https://ui-avatars.com/api/?name=' + trip.creator_name} 
                        alt={trip.creator_name}
                        className="w-8 h-8 rounded-full border border-gray-100" 
                      />
                      <span className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">
                        <Link to={`/user/${trip.creator_id}`}>{trip.creator_name}</Link>
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><span className="text-red-400">❤️</span> {trip.like_count}</span>
                      <span className="flex items-center gap-1"><span className="text-blue-400">💬</span> {trip.comment_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && trips.length === 0 && !error && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-dashed border-gray-300 animate-fade-in max-w-2xl mx-auto">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-8">We couldn't find any trips matching "{query}". Try different keywords or browse all trips.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/explore" className="btn btn-primary">
                Browse All Trips
              </Link>
              <Link to="/upload-trip" className="btn btn-outline">
                Create New Trip
              </Link>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {!loading && trips.length > 0 && currentPage < totalPages && (
          <div className="flex justify-center mt-12 mb-8">
            <button 
              onClick={loadMore} 
              className="btn btn-secondary btn-large shadow-sm hover:shadow-md"
            >
              Load More Results
            </button>
          </div>
        )}

        {/* Search Suggestions */}
        {!loading && trips.length === 0 && !error && (
          <div className="mt-12 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Search Suggestions:</h3>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2"><span className="text-teal-500">•</span> Try different keywords (e.g., "beach", "mountain", "city")</li>
                <li className="flex items-center gap-2"><span className="text-teal-500">•</span> Search for specific destinations (e.g., "Bali", "Paris", "Tokyo")</li>
                <li className="flex items-center gap-2"><span className="text-teal-500">•</span> Use broader terms (e.g., "adventure", "relaxation", "culture")</li>
                <li className="flex items-center gap-2"><span className="text-teal-500">•</span> Check spelling of your search terms</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
