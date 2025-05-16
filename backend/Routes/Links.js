const express = require("express");
const router = express.Router();
const db = require("../storeTopic/db"); // Adjust the path as necessary
const mysql = require("mysql2/promise");

// API to fetch links by subTopicId
router.get("/links/:subTopicId", async (req, res) => {
  const { subTopicId } = req.params;
  // const {} = req.body;
  console.log(req.body.levels);
  if (!subTopicId) {
    return res.status(400).json({ error: "subTopicId is required" });
  }

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(
        "SELECT id, title, description,link,level FROM links WHERE subTopicId = ?",
        [subTopicId],
        (err, results) => {
          if (err) {
            console.error("Error fetching links:", err);
            return reject(err);
          }
          resolve(results);
        }
      );
    });

    if (results.length === 0) {
      return res.status(404).json({ message: "No links found for this subTopicId" });
    }

    res.json(results);
  } catch (error) {
    console.error("Error fetching links:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
