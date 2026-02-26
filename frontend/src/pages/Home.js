import { Link,useNavigate } from "react-router-dom";
import { destinations } from "../data/destinations";
import { useEffect, useState} from "react";
import { useAuth } from "../context/AuthContext";


 const heroImages = [
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2021&q=80",
    // 🏝 Tropical Beach
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2021&q=80",

  // 🏔 Mountains
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2021&q=80",

  // 🌆 Modern City
  "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?auto=format&fit=crop&w=2021&q=80",

  // 🏜 Desert
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2021&q=80",

  // 🌿 Lush Nature
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2021&q=80",

  // ❄️ Snow Landscape
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2021&q=80",

  // 🕌 Cultural Architecture
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2021&q=80",

  // 🌅 Golden Sunset
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2021&q=80"
    ];


export default function Home() {
  
   
  const [currentImage, setCurrentImage] = useState(0);
  const { user } = useAuth();
const navigate = useNavigate();

const handleStartSharing = () => {
  if (user) {
    navigate("/upload-trip");
  } else {
    navigate("/login");
  }
};

const handleGenerateTrip = () => {
  if (user) {
    navigate("/ai-planner");
  } else {
    navigate("/login");
  }
};



  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentImage(prev =>
      prev === heroImages.length - 1 ? 0 : prev + 1
    );
  }, 4000);

  return () => clearInterval(interval);
}, []);



  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
  {heroImages.map((image, index) => (
    <img
      key={index}
      src={image}
      alt="Travel Background"
      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
      style={{
        opacity: index === currentImage ? 1 : 0
      }}
    />

  ))}

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
        {/* Plan with AI Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div>
              <span className="text-teal-600 font-semibold uppercase tracking-wide">
                AI Powered
              </span>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
                Plan Your Entire Trip <br />
                In Seconds
              </h2>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Just enter your destination, number of days, and travel style.
                Our AI instantly creates a complete personalized itinerary —
                including places, activities, and hidden gems.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <p className="text-gray-700">Choose destination & duration</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <p className="text-gray-700">Select travel preferences</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <p className="text-gray-700">Get instant AI itinerary</p>
                </div>
              </div>

              <button onClick={handleGenerateTrip}
  className="inline-block px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg"
>
  🤖 Generate My Trip
</button>

            </div>

            {/* Right Mock AI Card */}
            <div className="relative">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  ✨ Your AI Itinerary
                </h3>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-800">
                      Day 1 – Explore the City
                    </h4>
                    <p className="text-sm text-gray-600">
                      Visit iconic landmarks, local markets, and sunset viewpoints.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-800">
                      Day 2 – Adventure & Nature
                    </h4>
                    <p className="text-sm text-gray-600">
                      Hiking trails, hidden waterfalls, and scenic spots.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-800">
                      Day 3 – Relax & Experience Culture
                    </h4>
                    <p className="text-sm text-gray-600">
                      Local cuisine, museums, and traditional performances.
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-teal-200 rounded-full blur-3xl opacity-40"></div>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <span className="text-teal-600 font-semibold uppercase tracking-wide">
            Loved by Travelers
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-12">
            What Our Users Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all">
              <p className="text-gray-600 mb-6">
                “The AI itinerary saved me hours of planning. It felt like having a personal travel assistant!”
              </p>
              <h4 className="font-bold text-gray-900">Aarav Sharma</h4>
              <p className="text-sm text-gray-500">Backpacker • India</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all">
              <p className="text-gray-600 mb-6">
                “I discovered hidden gems I would never have found on my own. Travelio is amazing!”
              </p>
              <h4 className="font-bold text-gray-900">Emily Carter</h4>
              <p className="text-sm text-gray-500">Photographer • USA</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all">
              <p className="text-gray-600 mb-6">
                “Uploading my travel memories and connecting with others made the trip even more special.”
              </p>
              <h4 className="font-bold text-gray-900">Luca Rossi</h4>
              <p className="text-sm text-gray-500">Explorer • Italy</p>
            </div>

          </div>
        </div>
      </section>


      {/* Upload Memories Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Left Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
                alt="Travel Memory"
                className="rounded-2xl object-cover h-64 w-full cover h-64 w-full transition duration-300 hover:scale-[1.02] hover:shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=800&q=80"
                alt="Travel Memory"
                className="rounded-2xl object-cover h-64 w-full mt-8 cover h-64 w-full transition duration-300 hover:scale-[1.02] hover:shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80"
                alt="Travel Memory"
                className="rounded-2xl object-cover h-64 w-full cover h-64 w-full transition duration-300 hover:scale-[1.02] hover:shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                alt="Travel Memory"
                className="rounded-2xl object-cover h-64 w-full mt-8 cover h-64 w-full transition duration-300 hover:scale-[1.02] hover:shadow-lg"
              />
            </div>

            {/* Right Content */}
            <div>
              <span className="text-teal-600 font-semibold uppercase tracking-wide">
                Community Driven
              </span>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
                Upload Your Travel Memories
              </h2>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Share your experiences online, upload photos, write travel stories,
                and inspire thousands of explorers around the world.
              </p>

              <ul className="space-y-4 mb-8 text-gray-700">
                <li>📸 Share photos & travel journals</li>
                <li>⭐ Get likes & reviews from travelers</li>
                <li>🌍 Inspire the community</li>
                <li>🏆 Build your travel profile</li>
              </ul>

              <button
  onClick={handleStartSharing}
  className="inline-block px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg"
>
  🚀 Start Sharing
</button>

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
            <Link to="/destinations" className="px-6 py-2 border-2 border-teal-600 text-teal-600 font-bold rounded-full hover:bg-teal-50 transition-colors">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {destinations.filter((destination) => destination.trending).map((destination) => (
              <div key={destination.id} className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-bold shadow-sm z-10 flex items-center gap-1">
                    ⭐ {destination.rating}
                  </div>
                  <img 
                    src={destination.cardImage} 
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
                    📍 {destination.country}
                  </p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{destination.description}</p>
                  <Link to={`/destination/${destination.slug}`} className="block w-full py-2 bg-gray-50 hover:bg-teal-600 hover:text-white text-gray-700 text-center rounded-lg font-medium transition-colors text-sm">
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
