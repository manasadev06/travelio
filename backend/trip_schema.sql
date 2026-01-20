-- Trip Sharing Platform Database Schema
-- Clean, scalable design for content creators and social features

-- Users Table - Authentication and user profiles


CREATE DATABASE IF NOT EXISTS travel_app;
USE travel_app;



CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('creator', 'user') DEFAULT 'user',
    bio TEXT,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Trips Table - Main content created by users
CREATE TABLE trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    duration INT NOT NULL COMMENT 'Number of days',
    description TEXT NOT NULL,
    cover_image_url VARCHAR(500),
    status ENUM('draft', 'published') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_creator (creator_id),
    INDEX idx_destination (destination),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Trip Days Table - Day-wise itinerary for each trip
CREATE TABLE trip_days (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    day_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_urls JSON COMMENT 'Array of image URLs for this day',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    UNIQUE KEY unique_trip_day (trip_id, day_number),
    INDEX idx_trip_day (trip_id, day_number)
);

-- Trip Images Table - Individual images for trips (alternative to JSON)
CREATE TABLE trip_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    day_number INT,
    image_url VARCHAR(500) NOT NULL,
    caption VARCHAR(255),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    INDEX idx_trip (trip_id),
    INDEX idx_day (trip_id, day_number)
);

-- Likes Table - User likes on trips
CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    trip_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_trip_like (user_id, trip_id),
    INDEX idx_trip_likes (trip_id),
    INDEX idx_user_likes (user_id)
);

-- Comments Table - User comments on trips
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    trip_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    INDEX idx_trip_comments (trip_id, created_at),
    INDEX idx_user_comments (user_id)
);

-- Reviews Table - User ratings and reviews on trips
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    trip_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_trip_review (user_id, trip_id),
    INDEX idx_trip_reviews (trip_id),
    INDEX idx_user_reviews (user_id),
    INDEX idx_rating (rating)
);

-- Trip Stats View - Aggregated statistics for trips
CREATE VIEW trip_stats AS
SELECT 
    t.id,
    t.title,
    t.destination,
    t.creator_id,
    u.name as creator_name,
    u.avatar_url as creator_avatar,
    t.duration,
    t.description,
    t.cover_image_url,
    t.created_at,
    COUNT(DISTINCT l.id) as like_count,
    COUNT(DISTINCT c.id) as comment_count,
    COUNT(DISTINCT r.id) as review_count,
    COALESCE(AVG(r.rating), 0) as average_rating,
    COUNT(DISTINCT td.id) as day_count
FROM trips t
LEFT JOIN users u ON t.creator_id = u.id
LEFT JOIN likes l ON t.id = l.trip_id
LEFT JOIN comments c ON t.id = c.trip_id
LEFT JOIN reviews r ON t.id = r.trip_id
LEFT JOIN trip_days td ON t.id = td.trip_id
WHERE t.status = 'published'
GROUP BY t.id, t.title, t.destination, t.creator_id, u.name, u.avatar_url, 
         t.duration, t.description, t.cover_image_url, t.created_at;

-- User Stats View - Creator statistics
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    u.bio,
    u.avatar_url,
    u.created_at,
    COUNT(DISTINCT t.id) as trip_count,
    COUNT(DISTINCT l.id) as total_likes_received,
    COALESCE(AVG(r.rating), 0) as average_rating_received
FROM users u
LEFT JOIN trips t ON u.id = t.creator_id AND t.status = 'published'
LEFT JOIN likes l ON t.id = l.trip_id
LEFT JOIN reviews r ON t.id = r.trip_id
GROUP BY u.id, u.name, u.email, u.role, u.bio, u.avatar_url, u.created_at;

-- Triggers for maintaining denormalized counts (optional for performance)

-- Update trip like count trigger (if using denormalized column)
-- DELIMITER //
-- CREATE TRIGGER update_trip_like_count
-- AFTER INSERT ON likes
-- FOR EACH ROW
-- BEGIN
--     UPDATE trips SET like_count = (
--         SELECT COUNT(*) FROM likes WHERE trip_id = NEW.trip_id
--     ) WHERE id = NEW.trip_id;
-- END//
-- DELIMITER ;

-- Sample Data for Testing
INSERT INTO users (name, email, password, role, bio) VALUES
('John Traveler', 'john@example.com', '$2a$10$example_hash_1', 'creator', 'Adventure seeker and travel blogger'),
('Sarah Explorer', 'sarah@example.com', '$2a$10$example_hash_2', 'creator', 'Cultural immersion enthusiast'),
('Mike Wanderer', 'mike@example.com', '$2a$10$example_hash_3', 'user', 'Weekend traveler');

-- Sample Trip Data
INSERT INTO trips (creator_id, title, destination, duration, description, cover_image_url) VALUES
(1, 'Amazing Bali Adventure', 'Bali, Indonesia', 7, 'A week-long journey through the beautiful island of Bali, exploring temples, beaches, and rice terraces.', 'https://example.com/bali-cover.jpg'),
(2, 'Tokyo Street Food Tour', 'Tokyo, Japan', 5, 'Five days of discovering the best street food in Tokyo, from ramen to sushi and everything in between.', 'https://example.com/tokyo-cover.jpg');

-- Sample Trip Days
INSERT INTO trip_days (trip_id, day_number, title, content) VALUES
(1, 1, 'Arrival in Ubud', 'Arrived at Ngurah Rai Airport and transferred to Ubud. Checked into a beautiful villa surrounded by rice fields.'),
(1, 2, 'Temple Exploration', 'Visited Tirta Empul water temple and participated in the purification ritual. Evening visit to Ubud Palace.'),
(2, 1, 'Shibuya & Harajuku', 'Started the day in Shibuya crossing, explored Harajuku fashion district, and tried amazing crepes.'),
(2, 2, 'Tsukiji Fish Market', 'Early morning visit to Tsukiji for the freshest sushi breakfast. Explored the outer market.');

-- Sample Likes, Comments, Reviews
INSERT INTO likes (user_id, trip_id) VALUES (3, 1), (3, 2);
INSERT INTO comments (user_id, trip_id, comment) VALUES 
(3, 1, 'This looks amazing! I want to visit Bali too!'),
(3, 2, 'Great food recommendations. Thanks for sharing!');
INSERT INTO reviews (user_id, trip_id, rating, review) VALUES
(3, 1, 5, 'Perfect itinerary! Very detailed and helpful.'),
(3, 2, 4, 'Great guide, but would love more budget options.');




SHOW TABLES;
DESCRIBE users;
select * from users;