const express = require("express");
const router = express.Router();
const db = require("./db"); // Database connection object

router.post("/add-topic", async (req, res) => {
  const { topicName,chapterId, subjectId,courseId, branchId, semesterId, } = req.body;
  try {
    // Check if the topic already exists
    const existingTopic = await db.query(
      "SELECT * FROM topics WHERE topic = ? AND subjectId = ?",
      [topicName, subjectId]
    );

    if (existingTopic.length > 0) {
      return res.status(400).json({ message: "Topic already exists." });
    }

    // Insert new topic
    const result = await db.query(
      "INSERT INTO topics (topic, chapterId, courseId, branchId, semesterId, subjectId) VALUES (?, ?,?, ?, ?, ?)",
      [topicName, chapterId, courseId, branchId, semesterId, subjectId]
      
    );

    res.status(201).json({
      message: "Topic added successfully.",
      topic: {
        id: result.insertId,
        topic: topicName,
      },
    });
  } catch (error) {
    console.error("Error adding topic:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
