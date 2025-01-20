const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require('../storeTopic/db');
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
router.post('/login', (req, res) => {
    const { username, password,role } = req.body;

    const query = 'SELECT * FROM users WHERE username = ? AND password = ? and role= ? ';
    db.query(query, [username, password, role], (err, results) => {
        if (err) {
            console.error('Error logging in:', err);
            res.status(500).json({ message: 'Error logging in' });
            return;
        }
        if (results.length > 0) {
            res.json({ message: 'Login successful!', success: true });
            
        } else {
            res.status(401).json({ message: 'Invalid credentials', success: false });
        }
    });
});

module.exports = router;