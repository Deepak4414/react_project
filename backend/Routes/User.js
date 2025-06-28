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

const bcrypt = require("bcrypt");

router.post("/verify-password", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT password FROM users WHERE username = ? LIMIT 1";

  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ success: false });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const user = results[0];

    try {
      const match = await bcrypt.compare(password, user.password); 

      if (match) {
        return res.json({ success: true });
      } else {
        return res.status(401).json({ success: false, message: "Incorrect password" });
      }
    } catch (error) {
      console.error("Bcrypt error:", error);
      return res.status(500).json({ success: false });
    }
  });
});



module.exports = router;
