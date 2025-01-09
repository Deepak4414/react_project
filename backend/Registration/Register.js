const express = require('express');
const router = express.Router();
const db = require('../storeTopic/db');


router.post('/register', (req, res) => {
    const { name, email, username, password, role } = req.body;

    const query = 'INSERT INTO users (name, email, username, password, role) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, email, username, password,role], (err, result) => {
        if (err) {
            console.error('Error inserting user into the database:', err);
            res.status(500).json({ message: 'Error registering user' });
            return;
        }
        res.json({ message: 'User registered successfully!' });
    });
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