const express = require("express");
const router = express.Router();
const db = require("../storeTopic/db"); // Assuming db is your SQL database connection

// Endpoint to insert schedule data
router.post("/schedule/add", (req, res) => {
  const {
    topicId,
    subTopicId,
    time,
    date,
    channel,
    level,
  } = req.body;

  if (
    !topicId ||
    !subTopicId ||
    !time ||
    !date ||
    !channel ||
    !level 
    
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const checkQuery =
    "SELECT * FROM schedule WHERE topic_id = ? AND sub_topic_id = ?";

  db.query(checkQuery, [topicId, subTopicId], (err, results) => {
    if (err) {
      console.error("Error checking existing schedule:", err);
      return res.status(500).json({ error: "Database error." });
    }

    if (results.length > 0) {
      const updateQuery = `
                UPDATE schedule
                SET time = ?, date = ?, channel = ?, level = ?
                WHERE topic_id = ? AND sub_topic_id = ?
            `;

      const updateValues = [
        time,
        date,
        channel,
        level,
        topicId,
        subTopicId,
      ];

      db.query(updateQuery, updateValues, (err, result) => {
        if (err) {
          console.error("Error updating schedule:", err);
          return res.status(500).json({ error: "Database error." });
        }

        res.json({ message: "Schedule updated successfully." });
      });
    } else {
      const insertQuery = `
                INSERT INTO schedule (topic_id, sub_topic_id, time, date, channel, level)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

      const insertValues = [
        topicId,
        subTopicId,
        time,
        date,
        channel,
        level,
      ];

      db.query(insertQuery, insertValues, (err, result) => {
        if (err) {
          console.error("Error inserting schedule:", err);
          return res.status(500).json({ error: "Database error." });
        }

        res.json({ message: "Schedule added successfully." });
      });
    }
  });
});

// API endpoint to fetch live data
router.get("/live-data", async (req, res) => {
    const { topicId, subtopic } = req.query;
  
    // Validate query parameters
    if (!topicId || !subtopic) {
      return res.status(400).json({ error: "Missing topicId or subtopic parameter" });
    }
  
    try {
      // Query the database for live data
      const query = `
        SELECT channel, time, date, level
        FROM schedule 
        WHERE topic_id = ? AND sub_topic_id = ?
      `;
      db.query(query, [topicId, subtopic], (err, results) => {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ error: "Database error." });
        }
        if (results.length === 0) {
          return res.status(404).json({ message: "No live data found for this topic and subtopic." });
        }
        res.json(results[0]); // Send only the first result
      });
    } catch (error) {
      console.error("Error fetching live data:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  });
  
  

module.exports = router;
