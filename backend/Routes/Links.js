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

router.put("/update-links/:subTopicId", async (req, res) => {
  const { levels } = req.body;
  const subTopicId = req.params.subTopicId;


  try {
    // Iterate through each level category
    for (const level in levels) {
      if (Array.isArray(levels[level])) {
        for (const item of levels[level]) {
          const { id, title, link, description, rating } = item;

          // Update existing record in the database
          const query = `
            UPDATE links 
            SET title = ?, link = ?, description = ?, rating = ? 
            WHERE id = ? AND subTopicId = ?;
          `;

          db.query(query, [title, link, description, rating, id, subTopicId], (err, results) => {
            if (err) {
              console.error("Error updating links:", err);
              return res.status(500).json({ error: "Database update failed" });
            }
          });
        }
      }
    }

    res.status(200).json({ message: "Links updated successfully!" });
  } catch (error) {
    console.error("Error updating links:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
