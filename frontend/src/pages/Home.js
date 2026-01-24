import { Link } from "react-router-dom";

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2021&q=80" 
            alt="Travel Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent"></div>
        </div>
        
        <div className="container relative z-10 px-4 text-center text-white">
          <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold mb-6 animate-fade-in border border-white/30">
            ✨ Experience the World
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-shadow animate-fade-in">
            Discover Your <br/>
            <span className="text-teal-400">Next Adventure</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in opacity-90">
            Plan your perfect trip with our AI-powered itinerary builder. 
            Explore hidden gems, share your stories, and connect with fellow travelers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to="/explore" className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-teal-900/20 flex items-center justify-center gap-2">
              🌍 Start Exploring
            </Link>
            <Link to="/ai-planner" className="px-8 py-4 bg-white hover:bg-gray-100 text-teal-900 font-bold rounded-full transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2">
              🤖 Plan with AI
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Travel with Us?</h2>
            <p className="text-lg text-gray-600">Everything you need for an unforgettable journey, all in one place.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🤖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Trip Planner</h3>
              <p className="text-gray-600 leading-relaxed">Get personalized itineraries tailored to your preferences in seconds. Save hours of research.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">👥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Driven</h3>
              <p className="text-gray-600 leading-relaxed">Read real reviews and stories from travelers who have been there. Get authentic recommendations.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-sky-50 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">📸</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Share Memories</h3>
              <p className="text-gray-600 leading-relaxed">Create beautiful travel journals to inspire others and keep your precious memories alive.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trending Destinations</h2>
              <p className="text-lg text-gray-600">Handpicked locations for your next unforgettable journey</p>
            </div>
            <Link to="/explore" className="px-6 py-2 border-2 border-teal-600 text-teal-600 font-bold rounded-full hover:bg-teal-50 transition-colors">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredDestinations.map((destination) => (
              <div key={destination.id} className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-bold shadow-sm z-10 flex items-center gap-1">
                    ⭐ {destination.rating}
                  </div>
                  <img 
                    src={destination.image} 
                    alt={destination.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-700 transition-colors">{destination.name}</h3>
                  </div>
                  <p className="text-teal-600 text-sm font-medium mb-3 flex items-center gap-1">
                    📍 {destination.location}
                  </p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{destination.description}</p>
                  <Link to={`/explore`} className="block w-full py-2 bg-gray-50 hover:bg-teal-600 hover:text-white text-gray-700 text-center rounded-lg font-medium transition-colors text-sm">
                    Explore Guide
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-teal-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container px-4 mx-auto relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">Join thousands of travelers sharing their experiences, planning trips, and discovering the world.</p>
          <Link to="/register" className="px-10 py-4 bg-white text-teal-900 font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg inline-flex items-center gap-2">
            🚀 Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
