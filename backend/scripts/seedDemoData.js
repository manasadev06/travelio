const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("../config/db");
const User = require("../models/user.model");
const Trip = require("../models/Trip");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const demoPassword = "password123";

const demoUsers = [
  {
    name: "Aarav Mehta",
    email: "aarav.creator@travelio.demo",
    role: "creator",
    avatar_url: "https://ui-avatars.com/api/?name=Aarav+Mehta&background=0284c7&color=fff",
    bio: "Beach cafes, budget stays, and slow coastal itineraries.",
  },
  {
    name: "Mira Kapoor",
    email: "mira.mountains@travelio.demo",
    role: "creator",
    avatar_url: "https://ui-avatars.com/api/?name=Mira+Kapoor&background=0f766e&color=fff",
    bio: "Mountain routes, snow trails, and beginner-friendly hikes.",
  },
  {
    name: "Kabir Rao",
    email: "kabir.heritage@travelio.demo",
    role: "creator",
    avatar_url: "https://ui-avatars.com/api/?name=Kabir+Rao&background=9333ea&color=fff",
    bio: "Heritage walks, old cities, forts, and food markets.",
  },
  {
    name: "Nisha Iyer",
    email: "nisha.food@travelio.demo",
    role: "creator",
    avatar_url: "https://ui-avatars.com/api/?name=Nisha+Iyer&background=ea580c&color=fff",
    bio: "Food trails, temple towns, and culture-rich weekends.",
  },
  {
    name: "Rohan Das",
    email: "rohan.user@travelio.demo",
    role: "user",
    avatar_url: "https://ui-avatars.com/api/?name=Rohan+Das&background=475569&color=fff",
    bio: "Weekend traveler collecting practical trip notes.",
  },
  {
    name: "Tanya Shah",
    email: "tanya.user@travelio.demo",
    role: "user",
    avatar_url: "https://ui-avatars.com/api/?name=Tanya+Shah&background=be123c&color=fff",
    bio: "Loves hidden beaches, homestays, and street food.",
  },
];

const demoTrips = [
  {
    ownerEmail: "aarav.creator@travelio.demo",
    title: "Sunset Cafes and Quiet Beaches in South Goa",
    destination: "Goa, India",
    trip_type: "Friends",
    duration: 3,
    short_summary: "A relaxed South Goa route through Palolem, Agonda, seafood shacks, and cliffside sunsets.",
    description:
      "A social, slow-paced Goa plan for people who want beaches, cafes, scenic drives, and local food without the loud party circuit. Best for small groups, couples, or solo travelers who like relaxed evenings.",
    itinerary:
      "Day 1: Check in near Palolem, walk the beach, and catch sunset at a shack.\nDay 2: Ride to Agonda, stop at Cabo de Rama, and eat seafood by the coast.\nDay 3: Kayak around Cola Lagoon, cafe hop, and leave after brunch.",
    trip_days: [
      {
        day_number: 1,
        title: "Palolem arrival",
        content: "Check in, walk Palolem Beach, try a seafood thali, and watch sunset from a beach cafe.",
        image_urls: [],
      },
      {
        day_number: 2,
        title: "Agonda and Cabo de Rama",
        content: "Take a scooter ride to Agonda, visit Cabo de Rama Fort, and stop for coastal views.",
        image_urls: [],
      },
      {
        day_number: 3,
        title: "Cola Lagoon morning",
        content: "Start early with kayaking, eat brunch, and pick up souvenirs before checkout.",
        image_urls: [],
      },
    ],
    total_budget: 16500,
    accommodation_cost: 6500,
    travel_cost: 4200,
    food_misc_cost: 5800,
    accommodation_type: "Beach homestay",
    accommodation_name: "Palolem Blue Stay",
    weather: "Sunny",
    best_time_to_visit: "November to February",
    tags: ["travelio-demo", "beach", "goa", "cafes", "sunset", "friends"],
    cover_image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    comments: [
      { userEmail: "tanya.user@travelio.demo", comment: "This route feels perfect for a calm beach weekend." },
      { userEmail: "rohan.user@travelio.demo", comment: "Cabo de Rama at sunset is now on my list." },
    ],
    reviews: [
      { userEmail: "tanya.user@travelio.demo", rating: 5, review: "Loved the balance of beaches, cafes, and quiet stops." },
      { userEmail: "rohan.user@travelio.demo", rating: 4, review: "Very practical budget split and easy to follow." },
    ],
    likeEmails: ["mira.mountains@travelio.demo", "kabir.heritage@travelio.demo", "tanya.user@travelio.demo"],
  },
  {
    ownerEmail: "mira.mountains@travelio.demo",
    title: "Snow Trails Above Old Manali",
    destination: "Manali, India",
    trip_type: "Adventure",
    duration: 4,
    short_summary: "A mountain escape with Old Manali cafes, Solang Valley snow, and a beginner-friendly hike.",
    description:
      "A cozy Manali plan for first-time snow travelers. It mixes short hikes, mountain food, riverside cafes, and enough buffer time for weather changes.",
    itinerary:
      "Day 1: Old Manali cafes and riverside walk.\nDay 2: Solang Valley snow activities.\nDay 3: Jogini Falls hike and local market.\nDay 4: Slow breakfast and departure.",
    trip_days: [
      { day_number: 1, title: "Old Manali", content: "Cafe hop, explore lanes, and sit by the Beas River.", image_urls: [] },
      { day_number: 2, title: "Solang snow day", content: "Try snow activities, take photos, and return before dark.", image_urls: [] },
      { day_number: 3, title: "Jogini hike", content: "Do the waterfall trail and end with hot thukpa.", image_urls: [] },
      { day_number: 4, title: "Departure", content: "Shop locally, pack slowly, and leave after breakfast.", image_urls: [] },
    ],
    total_budget: 21500,
    accommodation_cost: 8600,
    travel_cost: 7200,
    food_misc_cost: 5700,
    accommodation_type: "Mountain hostel",
    accommodation_name: "Pine Trail House",
    weather: "Cold",
    best_time_to_visit: "December to March",
    tags: ["travelio-demo", "mountains", "manali", "snow", "hiking", "adventure"],
    cover_image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    comments: [
      { userEmail: "aarav.creator@travelio.demo", comment: "This looks like a great first snow itinerary." },
      { userEmail: "rohan.user@travelio.demo", comment: "Helpful that the plan leaves weather buffer." },
    ],
    reviews: [
      { userEmail: "aarav.creator@travelio.demo", rating: 5, review: "The Jogini hike note is very useful for beginners." },
      { userEmail: "tanya.user@travelio.demo", rating: 5, review: "Saved this for winter. The budget looks realistic." },
    ],
    likeEmails: ["aarav.creator@travelio.demo", "nisha.food@travelio.demo", "rohan.user@travelio.demo", "tanya.user@travelio.demo"],
  },
  {
    ownerEmail: "kabir.heritage@travelio.demo",
    title: "A Pink City Walk Through Forts and Bazaars",
    destination: "Jaipur, India",
    trip_type: "Family",
    duration: 2,
    short_summary: "A compact Jaipur plan covering Amber Fort, Hawa Mahal, City Palace, and old bazaars.",
    description:
      "A culture-heavy Jaipur weekend with early fort visits, local shopping, rooftop food, and time for photos around the old city.",
    itinerary:
      "Day 1: Amber Fort, City Palace, and Hawa Mahal rooftop dinner.\nDay 2: Patrika Gate, Johari Bazaar, block prints, and departure.",
    trip_days: [
      { day_number: 1, title: "Royal Jaipur", content: "Start early at Amber Fort, visit City Palace, and end near Hawa Mahal.", image_urls: [] },
      { day_number: 2, title: "Markets and color", content: "Visit Patrika Gate and shop in Johari Bazaar before leaving.", image_urls: [] },
    ],
    total_budget: 13800,
    accommodation_cost: 5200,
    travel_cost: 3600,
    food_misc_cost: 5000,
    accommodation_type: "Boutique hotel",
    accommodation_name: "Pink Courtyard Stay",
    weather: "Sunny",
    best_time_to_visit: "October to March",
    tags: ["travelio-demo", "jaipur", "cities", "forts", "heritage", "markets"],
    cover_image: "https://images.unsplash.com/photo-1599661046827-dacff0d9e0b6?auto=format&fit=crop&w=1400&q=80",
    comments: [
      { userEmail: "nisha.food@travelio.demo", comment: "The rooftop dinner idea is a strong finish." },
      { userEmail: "tanya.user@travelio.demo", comment: "Love that this is doable in just two days." },
    ],
    reviews: [
      { userEmail: "nisha.food@travelio.demo", rating: 4, review: "Great city flow, especially if you start early." },
      { userEmail: "rohan.user@travelio.demo", rating: 5, review: "The market suggestions make this feel local." },
    ],
    likeEmails: ["aarav.creator@travelio.demo", "mira.mountains@travelio.demo", "nisha.food@travelio.demo"],
  },
  {
    ownerEmail: "nisha.food@travelio.demo",
    title: "Kerala Food Trail Through Fort Kochi",
    destination: "Kochi, India",
    trip_type: "Food",
    duration: 3,
    short_summary: "A food-forward Kochi route with appam, seafood, spice markets, cafes, and heritage streets.",
    description:
      "A delicious Kochi itinerary for travelers who plan around meals. It includes classic Kerala breakfasts, spice shops, Fort Kochi lanes, and sunset near the Chinese fishing nets.",
    itinerary:
      "Day 1: Fort Kochi walk, appam breakfast, and fishing net sunset.\nDay 2: Jew Town, spice market, seafood lunch, and cafe crawl.\nDay 3: Museum stop, banana leaf meal, and departure.",
    trip_days: [
      { day_number: 1, title: "Fort Kochi flavors", content: "Start with appam and stew, walk heritage lanes, and watch sunset.", image_urls: [] },
      { day_number: 2, title: "Spices and seafood", content: "Shop spices in Jew Town and try a coastal seafood lunch.", image_urls: [] },
      { day_number: 3, title: "Classic Kerala meal", content: "Finish with a banana leaf meal and short museum stop.", image_urls: [] },
    ],
    total_budget: 14500,
    accommodation_cost: 6000,
    travel_cost: 3000,
    food_misc_cost: 5500,
    accommodation_type: "Heritage homestay",
    accommodation_name: "Fort Lane House",
    weather: "Mixed",
    best_time_to_visit: "September to March",
    tags: ["travelio-demo", "kerala", "kochi", "food", "spices", "seafood"],
    cover_image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80",
    comments: [
      { userEmail: "kabir.heritage@travelio.demo", comment: "Food plus heritage lanes is such a good combo." },
      { userEmail: "mira.mountains@travelio.demo", comment: "Saving this for a monsoon break." },
    ],
    reviews: [
      { userEmail: "kabir.heritage@travelio.demo", rating: 5, review: "The Jew Town and spice market pairing is excellent." },
      { userEmail: "aarav.creator@travelio.demo", rating: 4, review: "Great food stops, especially for first-time Kochi visitors." },
    ],
    likeEmails: ["kabir.heritage@travelio.demo", "mira.mountains@travelio.demo", "tanya.user@travelio.demo"],
  },
  {
    ownerEmail: "mira.mountains@travelio.demo",
    title: "Rafting and River Cafes in Rishikesh",
    destination: "Rishikesh, India",
    trip_type: "Adventure",
    duration: 3,
    short_summary: "A high-energy Rishikesh plan with rafting, riverside cafes, ashram walks, and evening aarti.",
    description:
      "A social adventure trip for first-time rafters. It keeps mornings active and evenings relaxed with cafes, ghats, and short walks.",
    itinerary:
      "Day 1: Arrive, cafe hop, and Ganga aarti.\nDay 2: Morning rafting and Beatles Ashram.\nDay 3: Bridge walk, brunch, and departure.",
    trip_days: [
      { day_number: 1, title: "Arrive by the river", content: "Settle in, walk near the bridge, and attend evening aarti.", image_urls: [] },
      { day_number: 2, title: "Rafting day", content: "Book a morning rafting slot and spend the evening at Beatles Ashram.", image_urls: [] },
      { day_number: 3, title: "Slow departure", content: "Do a short bridge walk, brunch, and leave after checkout.", image_urls: [] },
    ],
    total_budget: 12500,
    accommodation_cost: 4500,
    travel_cost: 4200,
    food_misc_cost: 3800,
    accommodation_type: "Riverside hostel",
    accommodation_name: "Ganga View Dorms",
    weather: "Sunny",
    best_time_to_visit: "September to June",
    tags: ["travelio-demo", "rishikesh", "adventure", "rafting", "river", "cafes"],
    cover_image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=80",
    comments: [
      { userEmail: "rohan.user@travelio.demo", comment: "The rafting plus aarti combo sounds perfect." },
      { userEmail: "nisha.food@travelio.demo", comment: "Would love cafe names in the next version." },
    ],
    reviews: [
      { userEmail: "rohan.user@travelio.demo", rating: 5, review: "Beginner-friendly and not too rushed." },
      { userEmail: "tanya.user@travelio.demo", rating: 4, review: "Good budget and activity mix." },
    ],
    likeEmails: ["aarav.creator@travelio.demo", "kabir.heritage@travelio.demo", "rohan.user@travelio.demo"],
  },
  {
    ownerEmail: "aarav.creator@travelio.demo",
    title: "Hidden Coastal Trail Around Gokarna",
    destination: "Gokarna, India",
    trip_type: "Solo",
    duration: 2,
    short_summary: "A quieter Gokarna trail connecting Om Beach, Half Moon Beach, and sunset coves.",
    description:
      "A short hidden-gem route for travelers who want coastal views, cliff walks, and quieter beaches without overplanning.",
    itinerary:
      "Day 1: Om Beach, cliff walk, and Half Moon Beach.\nDay 2: Paradise Beach sunrise, brunch, and departure.",
    trip_days: [
      { day_number: 1, title: "Cliff trail", content: "Start from Om Beach and walk toward Half Moon Beach before sunset.", image_urls: [] },
      { day_number: 2, title: "Paradise morning", content: "Catch sunrise near Paradise Beach and keep the rest flexible.", image_urls: [] },
    ],
    total_budget: 9800,
    accommodation_cost: 3600,
    travel_cost: 3000,
    food_misc_cost: 3200,
    accommodation_type: "Hostel",
    accommodation_name: "Cove Backpackers",
    weather: "Sunny",
    best_time_to_visit: "October to March",
    tags: ["travelio-demo", "gokarna", "hidden gems", "beach", "solo", "trail"],
    cover_image: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1400&q=80",
    comments: [
      { userEmail: "mira.mountains@travelio.demo", comment: "This sounds peaceful and easy to do solo." },
      { userEmail: "tanya.user@travelio.demo", comment: "The trail note is super helpful." },
    ],
    reviews: [
      { userEmail: "mira.mountains@travelio.demo", rating: 4, review: "A compact hidden-beach plan with enough flexibility." },
      { userEmail: "nisha.food@travelio.demo", rating: 5, review: "Perfect short escape if you want less crowd." },
    ],
    likeEmails: ["mira.mountains@travelio.demo", "nisha.food@travelio.demo", "tanya.user@travelio.demo"],
  },
];

async function seedDemoData() {
  await connectDB();

  const password = await bcrypt.hash(demoPassword, 10);
  const usersByEmail = new Map();

  for (const demoUser of demoUsers) {
    const user = await User.findOneAndUpdate(
      { email: demoUser.email },
      { ...demoUser, password },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    usersByEmail.set(user.email, user);
  }

  await Trip.deleteMany({ tags: "travelio-demo" });

  for (const demoTrip of demoTrips) {
    const owner = usersByEmail.get(demoTrip.ownerEmail);
    const comments = demoTrip.comments.map((comment) => {
      const user = usersByEmail.get(comment.userEmail);
      return {
        user_id: user._id,
        user_name: user.name,
        avatar_url: user.avatar_url,
        comment: comment.comment,
        created_at: new Date(),
      };
    });
    const reviews = demoTrip.reviews.map((review) => {
      const user = usersByEmail.get(review.userEmail);
      return {
        user_id: user._id,
        user_name: user.name,
        avatar_url: user.avatar_url,
        rating: review.rating,
        review: review.review,
        created_at: new Date(),
      };
    });
    const likes = demoTrip.likeEmails.map((email) => usersByEmail.get(email)._id);

    await Trip.create({
      ...demoTrip,
      user: owner._id,
      creator_id: owner._id,
      comments,
      reviews,
      likes,
      is_public: true,
    });
  }

  console.log(`Seeded ${demoUsers.length} users and ${demoTrips.length} trips.`);
  console.log("Demo login password for seeded users:", demoPassword);
  await mongoose.connection.close();
}

seedDemoData().catch(async (error) => {
  console.error("Seed failed:", error);
  await mongoose.connection.close();
  process.exit(1);
});
