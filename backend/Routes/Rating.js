const express = require("express");
const router = express.Router();
const db = require("../storeTopic/db"); // Assuming db is your SQL database connection

// GET /api/rating/:item - Fetch rating distribution for a specific item
router.get('/rating/:item', (req, res) => {
    const item = req.params.item;
    const username = req.query.username;
    const query = `
        SELECT rating, COUNT(*) AS count
        FROM rating
        WHERE item_id = ?        
        GROUP BY rating
        ORDER BY rating;
    `;

    db.query(query, [item], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Map results to an array of counts [count1, count2, count3, count4, count5]
        const distribution = [0, 0, 0, 0, 0];
        results.forEach((row) => {
            distribution[row.rating - 1] = row.count;
        });
        res.json(distribution);
    });
});

// POST /api/rating - Insert rating into the table
router.post("/rating", async (req, res) => {
    const { itemId,username, rating } = req.body;
    // Input validation
    if (!itemId || !username || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    try {
        // Check if the user has already rated this item
        const checkQuery = 'SELECT * FROM rating WHERE user_id = ? AND item_id = ?';
        const existingRating = await new Promise((resolve, reject) => {
            db.query(checkQuery, [username, itemId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });

        if (existingRating.length > 0) {
            // User has already rated this item
            return res.status(400).json({ message: 'You have already rated this item' });
        }

        // Insert the new rating
        const insertQuery = 'INSERT INTO rating (item_id, user_id, rating) VALUES (?, ?, ?)';
        await new Promise((resolve, reject) => {
            db.query(insertQuery, [itemId, username, rating], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });

        // Send success response
        res.status(200).json({ message: 'Rating submitted successfully' });
    } catch (error) {
        console.error('Error inserting rating:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// API endpoint to fetch existing rating
router.get('/fetch-rating/:item/:username', (req, res) => {
    try {
        const item = req.params.item;
        const username = req.params.username;

        // Query to fetch the existing rating
        const query = 'SELECT rating FROM rating WHERE item_id = ? AND user_id = ?';

        // Execute the query
        db.query(query, [item, username], (err, results) => {
            if (err) {
                // Return a 500 error if there's an internal server error
                res.status(500).json({ error: 'Internal server error' });
            } else if (results.length > 0) {
                // Return the existing rating
                res.status(200).json({ rating: results[0].rating });
            } else {
                // Return a 404 error if the rating is not found
                res.status(404).json({ error: 'Rating not found' });
            }
        });
    } catch (error) {
        // Return a 500 error if there's an internal server error
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to update an existing rating
router.put('/rating/:itemId/:username', (req, res) => {
    const { itemId, username } = req.params;
    const { rating } = req.body;
    const query = `
      UPDATE rating
      SET rating = ?
      WHERE item_id = ? AND user_id = ?;
    `;
  
    db.query(query, [rating, itemId, username], (err, results) => {
      if (err) {
        console.error('Error updating rating:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Rating not found' });
      }
  
      res.send({ message: `Rating for item ${itemId} updated to ${rating} stars!` });
    });
  });
  

module.exports = router;
