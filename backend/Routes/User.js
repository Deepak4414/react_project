const express = require("express");
const router = express.Router();
const db = require("../storeTopic/db");

router.get("/user", (req, res) => {
  // Fetch topics from the database
  const { username } = req.query;
  db.query(
    "SELECT * FROM users where username= ? ",
    [username],
    (err, results) => {
      if (err) {
        console.error("Error fetching topics:", err); // Log the error
        return res.status(500).send("Error fetching topics");
      }
      // Check if user exists
      if (results.length === 0) {
        return res.status(404).send("User  not found");
      }
      // Send the user data as a JSON response
      res.json({ results });
    }
  );
});

module.exports = router;
