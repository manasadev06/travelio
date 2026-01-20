const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ 
      success: false,
      message: "No token provided" 
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "Token format is invalid" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");
    req.user = decoded;
    next();
  } catch (err) {
    let message = "Invalid token";
    if (err.name === 'TokenExpiredError') {
      message = "Token has expired";
    } else if (err.name === 'JsonWebTokenError') {
      message = "Malformed token";
    }
    
    return res.status(401).json({ 
      success: false,
      message 
    });
  }
};
