const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../storeTopic/db");
require("dotenv").config(); // For environment variables

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "deepak";
// User Registration
router.post("/register", async (req, res) => {
  const { name, email, username, password, role } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const query =
      "INSERT INTO users (name, email, username, password, role) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [name, email, username, hashedPassword, role], (err) => {
      if (err) {
        console.error("Error inserting user into the database:", err);
        return res.status(500).json({ message: "Error registering user" });
      }
      res.json({ message: "User registered successfully!" });
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});
// Login endpoint
router.post('/login', async (req, res) => {
  const { username, password, role } = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND role = ?';
  db.query(query, [username, role], async (err, results) => {
      if (err) {
          console.error('Error logging in:', err);
          res.status(500).json({ message: 'Error logging in' });
          return;
      }

      if (results.length > 0) {
          const user = results[0];

          try {
              const isMatch = await bcrypt.compare(password, user.password);
              if (isMatch) {
                  // Generate a JWT token
                  const token = jwt.sign(
                      { id: user.id, username: user.username, role: user.role }, // Payload
                      process.env.JWT_SECRET, // Secret key
                      { expiresIn: '1h' } // Token expiration
                  );

                  // Send the token to the client
                  res.json({ message: 'Login successful!', success: true, token });
              } else {
                  res.status(401).json({ message: 'Invalid credentials', success: false });
              }
          } catch (error) {
              console.error('Error comparing passwords:', error);
              res.status(500).json({ message: 'Error logging in' });
          }
      } else {
          res.status(401).json({ message: 'Invalid credentials', success: false });
      }
  });
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.', success: false });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
          return res.status(403).json({ message: 'Invalid or expired token.', success: false });
      }

      req.user = user; // Attach the user payload to the request object
      next(); // Proceed to the next middleware or route handler
  });
};

// Protected route
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}!`, user: req.user });
});

module.exports = router;