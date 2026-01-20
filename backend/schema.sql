-- TripAdvisor-style Travel App Database Schema
-- MySQL Database

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Destinations Table
CREATE TABLE destinations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    category VARCHAR(100),
    best_time_to_visit VARCHAR(255),
    average_price VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Reviews Table
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    destination_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_destination (user_id, destination_id),
    INDEX idx_destination (destination_id),
    INDEX idx_user (user_id)
);

-- AI Plans Table
CREATE TABLE ai_plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    prompt TEXT NOT NULL,
    text_plan LONGTEXT NOT NULL,
    mermaid_code LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
);

-- Bookings Table
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    destination_id INT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status ENUM('upcoming', 'completed', 'cancelled') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_destination (destination_id)
);

-- Insert Sample Data
INSERT INTO destinations (name, location, description, image_url, average_rating, total_reviews, category, best_time_to_visit, average_price) VALUES
('Bali Paradise', 'Bali, Indonesia', 'Bali is a tropical paradise that offers everything from pristine beaches to ancient temples. This Indonesian island is known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.', 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop', 4.9, 1247, 'Beach', 'April to October', '$1,299'),
('Paris Getaway', 'Paris, France', 'Paris, France''s capital, is a major European city and a global center for art, fashion, gastronomy and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and River Seine.', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop', 4.8, 2156, 'City', 'June to August', '$2,199'),
('Swiss Alps Adventure', 'Switzerland', 'Breathtaking mountain views, skiing, and charming alpine villages await in Switzerland.', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop', 4.7, 892, 'Mountain', 'December to March', '$2,899'),
('Tokyo Discovery', 'Tokyo, Japan', 'Modern metropolis meets ancient tradition in Japan''s vibrant capital city.', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop', 4.8, 1823, 'City', 'March to May, September to November', '$1,899'),
('Santorini Dreams', 'Santorini, Greece', 'Iconic white-washed buildings, stunning sunsets, and crystal-clear waters.', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop', 4.9, 1567, 'Island', 'May to October', '$1,599'),
('Dubai Luxury', 'Dubai, UAE', 'Experience futuristic architecture, luxury shopping, and desert adventures.', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop', 4.6, 743, 'City', 'November to March', '$1,799'),
('New York Explorer', 'New York, USA', 'The city that never sleeps offers Broadway shows, museums, and iconic landmarks.', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop', 4.7, 2341, 'City', 'April to June, September to October', '$1,499'),
('Maldives Retreat', 'Maldives', 'Luxury overwater bungalows, pristine beaches, and world-class diving.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', 4.9, 892, 'Beach', 'November to April', '$3,299'),
('Rome Heritage', 'Rome, Italy', 'Step back in time with ancient ruins, Renaissance art, and incredible cuisine.', 'https://images.unsplash.com/photo-1522806580425-6223db1e7d66?w=400&h=300&fit=crop', 4.8, 1678, 'Historical', 'April to June, September to October', '$1,699'),
('Iceland Adventure', 'Iceland', 'Northern lights, glaciers, hot springs, and dramatic landscapes await.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', 4.8, 543, 'Nature', 'June to August, December to January', '$2,199'),
('Marrakech Magic', 'Marrakech, Morocco', 'Explore vibrant souks, stunning palaces, and magic of North Africa.', 'https://images.unsplash.com/photo-1517897069063-9a427ee5d5a3?w=400&h=300&fit=crop', 4.6, 892, 'Cultural', 'March to May, September to November', '$1,299'),
('Costa Rica Eco', 'Costa Rica', 'Rainforests, wildlife, volcanoes, and sustainable tourism adventures.', 'https://images.unsplash.com/photo-1516549655169-26f2441a589f?w=400&h=300&fit=crop', 4.7, 654, 'Nature', 'December to April', '$1,299');
