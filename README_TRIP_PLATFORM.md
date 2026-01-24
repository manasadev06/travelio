# 🌍 Trip Sharing Platform

A comprehensive trip-sharing platform where content creators can upload their travel experiences and users can explore, like, comment, and review trips.

## 🚀 Features

### 👤 User Roles
- **Content Creators**: Can upload trips with detailed itineraries
- **Normal Users**: Can browse, like, comment, and review trips

### 📝 Trip Upload (Creator Feature)
- **Trip Information**: Title, destination, duration, description
- **Day-wise Itinerary**: Detailed daily plans with images
- **Cover Images**: Visual representation of trips
- **Validation**: Comprehensive input validation and error handling

### 🌍 Explore Trips (Public)
- **Search & Filter**: Search by title, destination, description
- **Sorting Options**: Latest, Top Rated, Most Liked, Most Discussed
- **Pagination**: Efficient loading of large trip collections
- **Responsive Design**: Mobile-friendly interface

### 📄 Trip Details
- **Comprehensive View**: Full trip information with day-wise itinerary
- **Social Features**: Like, comment, and review functionality
- **User Profiles**: Creator information and statistics
- **Interactive Tabs**: Organized content display

### 🤖 AI Planner
- **Visual Flowcharts**: Generate trip flowcharts using AI
- **Mermaid.js Integration**: Visualizes trip plans
- **External Service**: Connects to AI service (e.g., n8n) for generation

### 👍 Social Features
- **Likes**: One like per user per trip
- **Comments**: Threaded discussions with timestamps
- **Reviews**: Star ratings (1-5) with text reviews
- **User Interaction**: Real-time updates and engagement

### 🔐 Authentication
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Creator-only features for trip uploads
- **Protected Routes**: Middleware for authenticated endpoints
- **User Profiles**: Personal dashboard and statistics

## 🗄 Database Design (MongoDB)

### Core Collections
- **users**: User authentication and profiles
- **trips**: Main trip content with embedded:
    - `trip_days`: Day-wise itinerary details
    - `likes`: Array of user IDs
    - `comments`: Array of comment objects
    - `reviews`: Array of review objects
- **posts**: Community posts
- **aiplans**: AI generated trip plans history

## 🛠 Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** database (with Mongoose)
- **JWT** authentication
- **bcryptjs** password hashing
- **CORS** enabled

### Frontend
- **React** with functional components
- **React Router** for navigation
- **Mermaid.js** for AI flowcharts
- **CSS3** with modern styling
- **Responsive Design** principles

## 📁 Project Structure

```
backend/
├── models/             # Mongoose schemas (Trip, User, etc.)
├── routes/             # API routes (auth, trips, etc.)
├── middleware/         # Auth middleware
├── index.js            # Server entry point
└── .env                # Environment variables

frontend/src/
├── pages/
│   ├── UploadTrip.js   # Trip upload form
│   ├── ExploreTrips.js # Browse and search trips
│   ├── TripDetails.js  # Detailed trip view
│   ├── AIFlowchart.js  # AI Planner
│   └── ...
├── components/         # Reusable UI components
├── context/            # Auth context
└── api/                # Axios setup
```

## 🚀 Getting Started

### Database Setup
1. Ensure you have a MongoDB instance running (local or Atlas).
2. Configure `MONGO_URI` in the backend `.env` file.

### Backend Setup
```bash
cd backend
npm install
# Create a .env file with:
# MONGO_URI=mongodb://localhost:27017/travel_app
# JWT_SECRET=your_secret_key
# PORT=5000
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Trips
- `GET /api/trips` - Get all trips (with pagination)
- `POST /api/trips` - Create trip (creator only)
- `GET /api/trips/:id` - Get trip details
- `PUT /api/trips/:id` - Update trip (owner only)
- `DELETE /api/trips/:id` - Delete trip (owner only)

### Social Features
- `POST /api/trips/:id/like` - Like/unlike trip
- `POST /api/trips/:id/comments` - Add comment
- `POST /api/trips/:id/reviews` - Add review

### Users
- `GET /api/user/profile` - Get own profile
- `GET /api/users/:id` - Get public user profile

### AI Planner
- `POST /webhook/get-name` - (External) Generate AI plan

## 🧪 Testing

### API Testing
```bash
# Test trip creation
curl -X POST http://localhost:5000/api/trips \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Trip","destination":"Test","duration":3,"description":"Test description"}'
```

## 🚀 Deployment Notes

### Environment Variables
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=5000
```
