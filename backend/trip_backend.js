const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'travel_app',
  waitForConnections: true,
  connectionLimit: 10
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Creator Role Middleware - Only content creators can access certain routes
const requireCreator = (req, res, next) => {
  if (req.user.role !== 'creator') {
    return res.status(403).json({ message: 'Creator role required' });
  }
  next();
};

// Helper function to execute queries
const executeQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Validation helpers
const validateTripData = (data) => {
  const errors = [];
  
  if (!data.title || data.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }
  
  if (!data.destination || data.destination.trim().length < 2) {
    errors.push('Destination is required');
  }
  
  if (!data.duration || data.duration < 1 || data.duration > 365) {
    errors.push('Duration must be between 1 and 365 days');
  }
  
  if (!data.description || data.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters long');
  }
  
  return errors;
};

const validateReviewData = (data) => {
  const errors = [];
  
  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.push('Rating must be between 1 and 5');
  }
  
  if (data.review && data.review.trim().length > 1000) {
    errors.push('Review must be less than 1000 characters');
  }
  
  return errors;
};

// ==================== AUTHENTICATION ROUTES ====================

// Register with role support
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await executeQuery('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user with role
    await executeQuery(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', 
      [name, email, hashedPassword, role]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const users = await executeQuery('SELECT id, name, email, password_hash, role FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ==================== TRIP ROUTES ====================

// Create Trip (Creator only)
app.post('/api/trips', authenticateToken, requireCreator, async (req, res) => {
  try {
    const { title, destination, duration, description, cover_image_url, trip_days } = req.body;
    const creatorId = req.user.id;

    // Validate trip data
    const validationErrors = validateTripData({ title, destination, duration, description });
    if (validationErrors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }

    // Start transaction
    await executeQuery('START TRANSACTION');

    try {
      // Insert trip
      const tripResult = await executeQuery(
        'INSERT INTO trips (creator_id, title, destination, duration, description, cover_image_url) VALUES (?, ?, ?, ?, ?, ?)',
        [creatorId, title, destination, duration, description, cover_image_url]
      );

      const tripId = tripResult.insertId;

      // Insert trip days if provided
      if (trip_days && Array.isArray(trip_days) && trip_days.length > 0) {
        for (const day of trip_days) {
          if (!day.day_number || !day.title || !day.content) {
            throw new Error('Invalid trip day data');
          }

          await executeQuery(
            'INSERT INTO trip_days (trip_id, day_number, title, content, image_urls) VALUES (?, ?, ?, ?, ?)',
            [tripId, day.day_number, day.title, day.content, JSON.stringify(day.image_urls || [])]
          );
        }
      }

      await executeQuery('COMMIT');

      res.status(201).json({
        message: 'Trip created successfully',
        trip_id: tripId
      });

    } catch (error) {
      await executeQuery('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get All Trips (Public)
app.get('/api/trips', async (req, res) => {
  try {
    const { page = 1, limit = 12, destination, sort = 'created_at' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT ts.*, 
             CASE WHEN l.user_id IS NOT NULL THEN true ELSE false END as user_liked
      FROM trip_stats ts
      LEFT JOIN likes l ON ts.id = l.trip_id AND l.user_id = ?
      WHERE 1=1
    `;
    
    let params = [];

    // Add destination filter
    if (destination) {
      query += ' AND ts.destination LIKE ?';
      params.push(`%${destination}%`);
    }

    // Add sorting
    const validSorts = ['created_at', 'average_rating', 'like_count', 'comment_count'];
    const sortBy = validSorts.includes(sort) ? sort : 'created_at';
    query += ` ORDER BY ts.${sortBy} DESC`;

    // Add pagination
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const trips = await executeQuery(query, req.user ? [req.user.id] : [null], ...params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM trip_stats WHERE 1=1';
    let countParams = [];
    
    if (destination) {
      countQuery += ' AND destination LIKE ?';
      countParams.push(`%${destination}%`);
    }

    const countResult = await executeQuery(countQuery, countParams);
    const total = countResult[0].total;

    res.status(200).json({
      trips,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get Trip Details (Public)
app.get('/api/trips/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get trip details with stats
    const tripQuery = `
      SELECT ts.*,
             CASE WHEN l.user_id IS NOT NULL THEN true ELSE false END as user_liked
      FROM trip_stats ts
      LEFT JOIN likes l ON ts.id = l.trip_id AND l.user_id = ?
      WHERE ts.id = ?
    `;

    const trips = await executeQuery(tripQuery, req.user ? [req.user.id, id] : [null, id]);

    if (trips.length === 0) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const trip = trips[0];

    // Get trip days
    const tripDays = await executeQuery(
      'SELECT * FROM trip_days WHERE trip_id = ? ORDER BY day_number',
      [id]
    );

    // Get comments with user info
    const comments = await executeQuery(
      `SELECT c.id, c.comment, c.created_at, u.name as user_name, u.avatar_url
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.trip_id = ?
       ORDER BY c.created_at DESC`,
      [id]
    );

    // Get reviews with user info
    const reviews = await executeQuery(
      `SELECT r.id, r.rating, r.review, r.created_at, u.name as user_name, u.avatar_url
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.trip_id = ?
       ORDER BY r.created_at DESC`,
      [id]
    );

    res.status(200).json({
      ...trip,
      trip_days: tripDays,
      comments,
      reviews
    });

  } catch (error) {
    console.error('Get trip details error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update Trip (Creator only, owner verification)
app.put('/api/trips/:id', authenticateToken, requireCreator, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, destination, duration, description, cover_image_url } = req.body;
    const creatorId = req.user.id;

    // Check if user owns the trip
    const tripCheck = await executeQuery('SELECT creator_id FROM trips WHERE id = ?', [id]);
    if (tripCheck.length === 0) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (tripCheck[0].creator_id !== creatorId) {
      return res.status(403).json({ message: 'You can only edit your own trips' });
    }

    // Validate trip data
    const validationErrors = validateTripData({ title, destination, duration, description });
    if (validationErrors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }

    // Update trip
    await executeQuery(
      'UPDATE trips SET title = ?, destination = ?, duration = ?, description = ?, cover_image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, destination, duration, description, cover_image_url, id]
    );

    res.status(200).json({ message: 'Trip updated successfully' });

  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete Trip (Creator only, owner verification)
app.delete('/api/trips/:id', authenticateToken, requireCreator, async (req, res) => {
  try {
    const { id } = req.params;
    const creatorId = req.user.id;

    // Check if user owns the trip
    const tripCheck = await executeQuery('SELECT creator_id FROM trips WHERE id = ?', [id]);
    if (tripCheck.length === 0) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (tripCheck[0].creator_id !== creatorId) {
      return res.status(403).json({ message: 'You can only delete your own trips' });
    }

    // Delete trip (cascade will handle related records)
    await executeQuery('DELETE FROM trips WHERE id = ?', [id]);

    res.status(200).json({ message: 'Trip deleted successfully' });

  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ==================== SOCIAL FEATURES ROUTES ====================

// Like/Unlike Trip
app.post('/api/trips/:id/like', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if trip exists
    const tripCheck = await executeQuery('SELECT id FROM trips WHERE id = ? AND status = "published"', [id]);
    if (tripCheck.length === 0) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if already liked
    const existingLike = await executeQuery('SELECT id FROM likes WHERE user_id = ? AND trip_id = ?', [userId, id]);

    if (existingLike.length > 0) {
      // Unlike
      await executeQuery('DELETE FROM likes WHERE user_id = ? AND trip_id = ?', [userId, id]);
      res.status(200).json({ message: 'Trip unliked', liked: false });
    } else {
      // Like
      await executeQuery('INSERT INTO likes (user_id, trip_id) VALUES (?, ?)', [userId, id]);
      res.status(200).json({ message: 'Trip liked', liked: true });
    }

  } catch (error) {
    console.error('Like trip error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add Comment
app.post('/api/trips/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    if (!comment || comment.trim().length < 1) {
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }

    if (comment.trim().length > 500) {
      return res.status(400).json({ message: 'Comment must be less than 500 characters' });
    }

    // Check if trip exists
    const tripCheck = await executeQuery('SELECT id FROM trips WHERE id = ? AND status = "published"', [id]);
    if (tripCheck.length === 0) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Add comment
    const result = await executeQuery(
      'INSERT INTO comments (user_id, trip_id, comment) VALUES (?, ?, ?)',
      [userId, id, comment.trim()]
    );

    // Get the comment with user info
    const newComment = await executeQuery(
      `SELECT c.id, c.comment, c.created_at, u.name as user_name, u.avatar_url
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment[0]
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add Review
app.post('/api/trips/:id/reviews', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;

    // Validate review data
    const validationErrors = validateReviewData({ rating, review });
    if (validationErrors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }

    // Check if trip exists
    const tripCheck = await executeQuery('SELECT id FROM trips WHERE id = ? AND status = "published"', [id]);
    if (tripCheck.length === 0) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user already reviewed
    const existingReview = await executeQuery('SELECT id FROM reviews WHERE user_id = ? AND trip_id = ?', [userId, id]);
    if (existingReview.length > 0) {
      return res.status(400).json({ message: 'You have already reviewed this trip' });
    }

    // Add review
    const result = await executeQuery(
      'INSERT INTO reviews (user_id, trip_id, rating, review) VALUES (?, ?, ?, ?)',
      [userId, id, rating, review ? review.trim() : null]
    );

    // Get the review with user info
    const newReview = await executeQuery(
      `SELECT r.id, r.rating, r.review, r.created_at, u.name as user_name, u.avatar_url
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: 'Review added successfully',
      review: newReview[0]
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ==================== USER PROFILE ROUTES ====================

// Get User Profile (Public)
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get user info and stats
    const userQuery = `
      SELECT u.id, u.name, u.bio, u.avatar_url, u.role, u.created_at,
             COALESCE(us.trip_count, 0) as trip_count,
             COALESCE(us.total_likes_received, 0) as total_likes_received,
             COALESCE(us.average_rating_received, 0) as average_rating_received
      FROM users u
      LEFT JOIN user_stats us ON u.id = us.id
      WHERE u.id = ?
    `;

    const users = await executeQuery(userQuery, [id]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // Get user's trips
    const trips = await executeQuery(
      `SELECT ts.*
       FROM trip_stats ts
       WHERE ts.creator_id = ?
       ORDER BY ts.created_at DESC`,
      [id]
    );

    res.status(200).json({
      ...user,
      trips
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get Current User Profile (Authenticated)
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user info and stats
    const userQuery = `
      SELECT u.id, u.name, u.email, u.bio, u.avatar_url, u.role, u.created_at,
             COALESCE(us.trip_count, 0) as trip_count,
             COALESCE(us.total_likes_received, 0) as total_likes_received,
             COALESCE(us.average_rating_received, 0) as average_rating_received
      FROM users u
      LEFT JOIN user_stats us ON u.id = us.id
      WHERE u.id = ?
    `;

    const users = await executeQuery(userQuery, [userId]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // Get user's trips
    const trips = await executeQuery(
      `SELECT ts.*
       FROM trip_stats ts
       WHERE ts.creator_id = ?
       ORDER BY ts.created_at DESC`,
      [userId]
    );

    res.status(200).json({
      ...user,
      trips
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update User Profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name, bio, avatar_url } = req.body;
    const userId = req.user.id;

    // Validate input
    if (name && name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters long' });
    }

    if (bio && bio.length > 500) {
      return res.status(400).json({ message: 'Bio must be less than 500 characters' });
    }

    // Update user profile
    await executeQuery(
      'UPDATE users SET name = COALESCE(?, name), bio = COALESCE(?, bio), avatar_url = COALESCE(?, avatar_url), updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name ? name.trim() : null, bio ? bio.trim() : null, avatar_url, userId]
    );

    res.status(200).json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ==================== SEARCH ROUTES ====================

// Search Trips
app.get('/api/search/trips', async (req, res) => {
  try {
    const { q, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const searchTerm = `%${q.trim()}%`;

    // Search in title, destination, and description
    const searchQuery = `
      SELECT ts.*,
             CASE WHEN l.user_id IS NOT NULL THEN true ELSE false END as user_liked,
             MATCH(ts.title, ts.destination, ts.description) AGAINST(?) as relevance_score
      FROM trip_stats ts
      LEFT JOIN likes l ON ts.id = l.trip_id AND l.user_id = ?
      WHERE ts.title LIKE ? OR ts.destination LIKE ? OR ts.description LIKE ?
      ORDER BY relevance_score DESC, ts.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const trips = await executeQuery(
      searchQuery,
      req.user ? [req.user.id, searchTerm, searchTerm, searchTerm, searchTerm, parseInt(limit), parseInt(offset)] : [null, searchTerm, searchTerm, searchTerm, searchTerm, parseInt(limit), parseInt(offset)]
    );

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM trip_stats ts
      WHERE ts.title LIKE ? OR ts.destination LIKE ? OR ts.description LIKE ?
    `;

    const countResult = await executeQuery(countQuery, [searchTerm, searchTerm, searchTerm]);
    const total = countResult[0].total;

    res.status(200).json({
      trips,
      query: q.trim(),
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Search trips error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ==================== ERROR HANDLING ====================

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`🚀 Trip Sharing Platform Server running on port ${PORT}`);
  console.log(`📱 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🔐 JWT Secret: ${JWT_SECRET.substring(0, 10)}...`);
});

module.exports = { app, executeQuery };
