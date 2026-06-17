import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Explore.css";

const categories = [
  "All",
  "Beaches",
  "Mountains",
  "Cities",
  "Temples",
  "Food",
  "Adventure",
  "Hidden Gems",
];

const initialPosts = [
  {
    id: 1,
    creator: "Aarav Mehta",
    avatar: "AM",
    location: "Goa, India",
    title: "Sunset Cafes and Quiet Beaches in South Goa",
    description:
      "A slow weekend through Palolem, butterfly beach, old Portuguese lanes, and the kind of seafood shacks you remember for years.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    category: "Beaches",
    rating: 4.8,
    likes: 1284,
    comments: 86,
    tags: ["beach", "goa", "sunset", "cafes"],
    postedTime: "2h ago",
    detailSlug: "goa",
    place: {
      bestTime: "November to February",
      idealDays: "3 days",
      budget: "Rs. 12,000 - Rs. 18,000",
      highlights: ["Palolem Beach", "Cabo de Rama", "Cola Lagoon"],
    },
    itinerary: ["Sunset at Palolem", "Cafe hop in Agonda", "Morning kayak at Cola Lagoon"],
    reviews: [
      { user: "Tanya", rating: 5, text: "Perfect for a slow beach trip without the loud party crowd." },
      { user: "Rohan", rating: 4, text: "Cabo de Rama at sunset was the best part of the route." },
    ],
  },
  {
    id: 2,
    creator: "Mira Kapoor",
    avatar: "MK",
    location: "Manali, India",
    title: "Snow Trails Above Old Manali",
    description:
      "Pine forests, warm thukpa, mountain cafes, and a beginner-friendly hiking route with unreal views after sunrise.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    category: "Mountains",
    rating: 4.9,
    likes: 2140,
    comments: 132,
    tags: ["mountains", "manali", "hiking", "snow"],
    postedTime: "5h ago",
    detailSlug: "goa",
    place: {
      bestTime: "December to March",
      idealDays: "4 days",
      budget: "Rs. 14,000 - Rs. 22,000",
      highlights: ["Old Manali", "Solang Valley", "Jogini Falls"],
    },
    itinerary: ["Old Manali cafes", "Solang snow trail", "Jogini Falls hike"],
    reviews: [
      { user: "Neel", rating: 5, text: "The sunrise hike was cold but completely worth it." },
      { user: "Aisha", rating: 5, text: "Great balance of food, snow, and quiet mountain lanes." },
    ],
  },
  {
    id: 3,
    creator: "Kabir Rao",
    avatar: "KR",
    location: "Jaipur, India",
    title: "A Pink City Walk Through Forts and Bazaars",
    description:
      "Amber Fort in the morning, block-print markets by noon, and rooftop views of Hawa Mahal when the city turns gold.",
    image:
      "https://images.unsplash.com/photo-1599661046827-dacff0d9e0b6?auto=format&fit=crop&w=1400&q=80",
    category: "Cities",
    rating: 4.7,
    likes: 963,
    comments: 71,
    tags: ["jaipur", "heritage", "forts", "markets"],
    postedTime: "1d ago",
    detailSlug: "jaipur",
    place: {
      bestTime: "October to March",
      idealDays: "2 days",
      budget: "Rs. 9,000 - Rs. 15,000",
      highlights: ["Amber Fort", "Hawa Mahal", "Johari Bazaar"],
    },
    itinerary: ["Amber Fort morning", "City Palace walk", "Rooftop dinner near Hawa Mahal"],
    reviews: [
      { user: "Megha", rating: 5, text: "The market stops made the itinerary feel very local." },
      { user: "Arjun", rating: 4, text: "Start early for Amber Fort to avoid the crowd." },
    ],
  },
  {
    id: 4,
    creator: "Nisha Iyer",
    avatar: "NI",
    location: "Varanasi, India",
    title: "Dawn on the Ghats",
    description:
      "A reflective morning boat ride, temple bells, hidden tea stalls, and the calm side of one of India's oldest cities.",
    image:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1400&q=80",
    category: "Temples",
    rating: 4.9,
    likes: 1876,
    comments: 148,
    tags: ["varanasi", "temples", "ghats", "spiritual"],
    postedTime: "1d ago",
    detailSlug: "kyoto",
    place: {
      bestTime: "November to February",
      idealDays: "2 days",
      budget: "Rs. 7,000 - Rs. 12,000",
      highlights: ["Dashashwamedh Ghat", "Assi Ghat", "Kashi Vishwanath"],
    },
    itinerary: ["Sunrise boat ride", "Temple lane walk", "Evening Ganga aarti"],
    reviews: [
      { user: "Priya", rating: 5, text: "The sunrise boat ride felt peaceful and unreal." },
      { user: "Kunal", rating: 5, text: "Aarti is crowded, but the energy is unforgettable." },
    ],
  },
  {
    id: 5,
    creator: "Dev Sen",
    avatar: "DS",
    location: "Kochi, India",
    title: "Kerala Plates Worth Planning Around",
    description:
      "Appam, stew, banana leaf meals, coastal grills, and a tiny spice shop that became the best accidental stop of the trip.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80",
    category: "Food",
    rating: 4.6,
    likes: 742,
    comments: 59,
    tags: ["kerala", "food", "spices", "kochi"],
    postedTime: "2d ago",
    detailSlug: "osaka",
    place: {
      bestTime: "September to March",
      idealDays: "3 days",
      budget: "Rs. 10,000 - Rs. 16,000",
      highlights: ["Fort Kochi", "Jew Town", "Marine Drive"],
    },
    itinerary: ["Fort Kochi breakfast", "Spice market stop", "Seafood dinner by the coast"],
    reviews: [
      { user: "Ananya", rating: 4, text: "The appam and stew recommendation was excellent." },
      { user: "Joel", rating: 5, text: "Best food-focused route I have tried in Kochi." },
    ],
  },
  {
    id: 6,
    creator: "Sara Thomas",
    avatar: "ST",
    location: "Rishikesh, India",
    title: "Rafting, River Cafes, and Cliffside Mornings",
    description:
      "A high-energy route for first-time river rafters with yoga mornings, suspension bridges, and lazy Ganga-side evenings.",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=80",
    category: "Adventure",
    rating: 4.8,
    likes: 1530,
    comments: 104,
    tags: ["adventure", "rafting", "rishikesh", "river"],
    postedTime: "3d ago",
    detailSlug: "bali",
    place: {
      bestTime: "September to June",
      idealDays: "3 days",
      budget: "Rs. 8,000 - Rs. 14,000",
      highlights: ["River rafting", "Laxman Jhula", "Beatles Ashram"],
    },
    itinerary: ["Morning rafting", "Cafe by the river", "Beatles Ashram walk"],
    reviews: [
      { user: "Kabir", rating: 5, text: "Rafting was safe, fun, and beginner friendly." },
      { user: "Sana", rating: 4, text: "Book rafting early; afternoon slots get packed." },
    ],
  },
  {
    id: 7,
    creator: "Ishan Bose",
    avatar: "IB",
    location: "Gokarna, India",
    title: "A Hidden Coastal Trail Beyond the Main Beach",
    description:
      "A quieter alternative to the obvious beach route, with cliff paths, small coves, and sunset spots locals still recommend.",
    image:
      "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1400&q=80",
    category: "Hidden Gems",
    rating: 4.7,
    likes: 1198,
    comments: 94,
    tags: ["hidden gems", "gokarna", "coast", "trail"],
    postedTime: "4d ago",
    detailSlug: "goa",
    place: {
      bestTime: "October to March",
      idealDays: "2 days",
      budget: "Rs. 7,500 - Rs. 13,000",
      highlights: ["Om Beach", "Half Moon Beach", "Paradise Beach"],
    },
    itinerary: ["Om Beach start", "Half Moon cliff trail", "Paradise Beach sunset"],
    reviews: [
      { user: "Ritika", rating: 5, text: "Felt quieter and more raw than the usual beach plans." },
      { user: "Varun", rating: 4, text: "Carry water for the trail; shade is limited." },
    ],
  },
  {
    id: 8,
    creator: "Leah Dsouza",
    avatar: "LD",
    location: "Munnar, India",
    title: "Tea Gardens, Misty Roads, and Slow Viewpoints",
    description:
      "A calm hill route through tea estates, valley viewpoints, roadside corn stalls, and a sunrise that rolls in with the fog.",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=80",
    category: "Mountains",
    rating: 4.8,
    likes: 1342,
    comments: 81,
    tags: ["munnar", "tea gardens", "viewpoints", "kerala"],
    postedTime: "5d ago",
    detailSlug: "bali",
    place: {
      bestTime: "September to May",
      idealDays: "3 days",
      budget: "Rs. 11,000 - Rs. 17,000",
      highlights: ["Kolukkumalai", "Eravikulam", "Mattupetty Dam"],
    },
    itinerary: ["Tea estate walk", "Kolukkumalai sunrise", "Mattupetty picnic stop"],
    reviews: [
      { user: "Madhav", rating: 5, text: "Kolukkumalai sunrise was the highlight of my Kerala trip." },
      { user: "Ira", rating: 4, text: "Great route if you want a quiet hill-station break." },
    ],
  },
  {
    id: 9,
    creator: "Zoya Khan",
    avatar: "ZK",
    location: "Hyderabad, India",
    title: "Biryani, Charminar, and Old City Evenings",
    description:
      "A city trail built around food, pearls, heritage lanes, Irani chai, and a night view from Necklace Road.",
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1400&q=80",
    category: "Food",
    rating: 4.7,
    likes: 1106,
    comments: 68,
    tags: ["hyderabad", "biryani", "old city", "food"],
    postedTime: "6d ago",
    detailSlug: "hyderabad",
    place: {
      bestTime: "October to February",
      idealDays: "2 days",
      budget: "Rs. 6,000 - Rs. 11,000",
      highlights: ["Charminar", "Laad Bazaar", "Necklace Road"],
    },
    itinerary: ["Charminar walk", "Biryani lunch", "Irani chai and pearl shopping"],
    reviews: [
      { user: "Sameer", rating: 5, text: "Food stops were spot on, especially the chai break." },
      { user: "Diya", rating: 4, text: "Old City is busy, but the route is easy to follow." },
    ],
  },
];

const trendingDestinations = [
  { name: "Goa", description: "Beaches, cafes, and late sunsets", posts: "3.4k", rating: 4.8 },
  { name: "Manali", description: "Snow trails and mountain stays", posts: "2.8k", rating: 4.9 },
  { name: "Jaipur", description: "Forts, bazaars, and royal streets", posts: "2.1k", rating: 4.7 },
  { name: "Kerala", description: "Backwaters, food, and green escapes", posts: "1.9k", rating: 4.8 },
  { name: "Varanasi", description: "Ghats, temples, and timeless rituals", posts: "1.5k", rating: 4.9 },
];

const creatorSuggestions = [
  { id: 1, name: "Rhea Travels", niche: "Budget itineraries", followers: "48.2k" },
  { id: 2, name: "The Hill Journal", niche: "Mountain escapes", followers: "32.8k" },
  { id: 3, name: "Fork & Footsteps", niche: "Food trails", followers: "27.4k" },
  { id: 4, name: "Hidden India", niche: "Offbeat places", followers: "51.6k" },
];

export default function Explore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});
  const [followingCreators, setFollowingCreators] = useState({});

  const filteredPosts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return initialPosts.filter((post) => {
      const matchesCategory = activeCategory === "All" || post.category === activeCategory;
      const searchableText = [
        post.title,
        post.location,
        post.creator,
        post.description,
        post.category,
        post.place.bestTime,
        post.place.idealDays,
        post.place.budget,
        ...post.place.highlights,
        ...post.itinerary,
        ...post.reviews.map((review) => `${review.user} ${review.text}`),
        ...post.tags,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!query || searchableText.includes(query));
    });
  }, [activeCategory, searchTerm]);

  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleSave = (postId) => {
    setSavedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleFollow = (creatorId) => {
    setFollowingCreators((prev) => ({ ...prev, [creatorId]: !prev[creatorId] }));
  };

  const getLikeCount = (post) => post.likes + (likedPosts[post.id] ? 1 : 0);

  return (
    <main className="explore-social-page">
      <section className="explore-hero">
        <div className="explore-hero-content">
          <p className="explore-kicker">Travelio Explore</p>
          <h1>Explore Travel Stories</h1>
          <p>
            Discover destinations, creators, reviews, hidden gems, and real travel
            moments from people planning their next story.
          </p>

          <div className="explore-search-card">
            <span className="search-icon" aria-hidden="true">Search</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search destinations, creators, tags..."
              aria-label="Search travel stories"
            />
          </div>

          <div className="category-filters" aria-label="Explore categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`category-pill ${activeCategory === category ? "active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="explore-layout">
        <div className="travel-feed">
          <div className="feed-heading">
            <div>
              <h2>Travel Social Feed</h2>
              <p>{filteredPosts.length} stories found</p>
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="explore-empty-state">
              <div className="empty-icon">No results</div>
              <h3>No travel stories found.</h3>
              <p>Try another destination or category.</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <article className="travel-post-card" key={post.id}>
                <div className="post-image-wrap">
                  <img src={post.image} alt={post.title} />
                  <span className="post-category">{post.category}</span>
                </div>

                <div className="post-content">
                  <div className="creator-row">
                    <div className="creator-avatar">{post.avatar}</div>
                    <div className="creator-meta">
                      <h3>{post.creator}</h3>
                      <p>{post.location}</p>
                    </div>
                    <span className="posted-time">{post.postedTime}</span>
                  </div>

                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-description">{post.description}</p>

                  <div className="post-tags">
                    {post.tags.map((tag) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>

                  <div className="post-rating">
                    <span className="rating-star">?</span>
                    <strong>{post.rating.toFixed(1)}</strong>
                    <span>traveler rating</span>
                  </div>

                  <div className="place-info-grid">
                    <div>
                      <span>Best time</span>
                      <strong>{post.place.bestTime}</strong>
                    </div>
                    <div>
                      <span>Ideal trip</span>
                      <strong>{post.place.idealDays}</strong>
                    </div>
                    <div>
                      <span>Budget</span>
                      <strong>{post.place.budget}</strong>
                    </div>
                  </div>

                  <div className="post-section-block">
                    <h4>Place highlights</h4>
                    <div className="highlight-list">
                      {post.place.highlights.map((highlight) => (
                        <span key={highlight}>{highlight}</span>
                      ))}
                    </div>
                  </div>

                  <div className="post-section-block">
                    <h4>Mini itinerary</h4>
                    <ol className="mini-itinerary">
                      {post.itinerary.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="review-strip">
                    {post.reviews.map((review) => (
                      <div className="review-card" key={`${post.id}-${review.user}`}>
                        <div>
                          <strong>{review.user}</strong>
                          <span>? {review.rating}</span>
                        </div>
                        <p>{review.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="post-actions">
                    <button
                      type="button"
                      className={`action-btn ${likedPosts[post.id] ? "liked" : ""}`}
                      onClick={() => toggleLike(post.id)}
                    >
                      {likedPosts[post.id] ? "Liked" : "Like"} · {getLikeCount(post)}
                    </button>
                    <button type="button" className="action-btn">
                      Comment · {post.comments}
                    </button>
                    <button
                      type="button"
                      className={`action-btn ${savedPosts[post.id] ? "saved" : ""}`}
                      onClick={() => toggleSave(post.id)}
                    >
                      {savedPosts[post.id] ? "Saved" : "Save"}
                    </button>
                    <Link to={`/destination/${post.detailSlug}`} className="view-details-btn">
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <aside className="explore-sidebar">
          <section className="sidebar-panel">
            <div className="sidebar-heading">
              <h2>Trending Destinations</h2>
              <p>Popular this week</p>
            </div>
            <div className="trending-list">
              {trendingDestinations.map((destination) => (
                <div className="trending-card" key={destination.name}>
                  <div>
                    <h3>{destination.name}</h3>
                    <p>{destination.description}</p>
                  </div>
                  <div className="trend-stats">
                    <span>{destination.posts} posts</span>
                    <strong>? {destination.rating}</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="sidebar-panel">
            <div className="sidebar-heading">
              <h2>Top Travel Creators</h2>
              <p>Fresh voices to follow</p>
            </div>
            <div className="creator-list">
              {creatorSuggestions.map((creator) => (
                <div className="suggested-creator" key={creator.id}>
                  <div className="creator-avatar small">
                    {creator.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="suggested-creator-info">
                    <h3>{creator.name}</h3>
                    <p>{creator.niche} · {creator.followers}</p>
                  </div>
                  <button
                    type="button"
                    className={`follow-btn ${followingCreators[creator.id] ? "following" : ""}`}
                    onClick={() => toggleFollow(creator.id)}
                  >
                    {followingCreators[creator.id] ? "Following" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

