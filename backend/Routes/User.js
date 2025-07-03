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


router.get("/faculty/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const [rows] = await db.query("SELECT name, email FROM users WHERE username = ?", [username]);
    if (rows.length === 0) return res.status(404).json({ message: "Faculty not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching faculty:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/faculty/update-profile/:username", async (req, res) => {
  const { username } = req.params;
  const { name, email } = req.body;
  try {
    await db.query("UPDATE users SET name = ?, email = ? WHERE username = ?", [name, email, username]);
    res.json({ message: "Profile updated successfully" });

  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Update failed" });
  }
});
// Change password with old password check
router.put("/faculty/change-password/:username", (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const username = req.params.username;


  const query = "SELECT password FROM users WHERE username = ? LIMIT 1";

  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = results[0];

    try {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Old password is incorrect" });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      const updateQuery = "UPDATE users SET password = ? WHERE username = ?";
      db.query(updateQuery, [hashedNewPassword, username], (updateErr) => {
        if (updateErr) {
          console.error("Password update error:", updateErr);
          return res.status(500).json({ success: false, message: "Password update failed" });
        }

        return res.json({ success: true, message: "Password changed successfully" });
      });
    } catch (error) {
      console.error("Bcrypt error:", error);
      return res.status(500).json({ success: false, message: "Encryption error" });
    }
  });
});

module.exports = router;
