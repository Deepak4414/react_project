const express = require("express");
const router = express.Router();
const db = require("./db"); // Database connection object

router.post("/add-subtopic", async (req, res) => {
  const { subtopicName, topicId } = req.body;

  try {
    // Check if the subtopic already exists
    const existingSubtopic = await db.query(
      "SELECT * FROM subtopics WHERE subTopic = ? AND topicId = ?",
      [subtopicName, topicId]
    );

    if (existingSubtopic.length > 0) {
      return res.status(400).json({ message: "Subtopic already exists." });
    }

    // Insert new subtopic
    const result = await db.query(
      "INSERT INTO subtopics (subTopic, topicId) VALUES (?, ?)",
      [subtopicName, topicId]
    );

    res.status(201).json({
      message: "Subtopic added successfully.",
      subtopic: {
        id: result.insertId,
        subTopic: subtopicName,
      },
    });
  } catch (error) {
    console.error("Error adding subtopic:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
