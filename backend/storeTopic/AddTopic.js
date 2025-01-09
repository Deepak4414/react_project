const express = require("express");
const router = express.Router();
const db = require("./db"); // Database connection object

// Helper function for query execution using promises
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

router.post("/add-topic", async (req, res) => {
  const {
    selectedTopic,
    subTopic,
    isAddingNewTopic,
    courseId,
    branchId,
    semesterId,
    subjectId,
    levels,
    nptelVideos,
    videoFolder,
  } = req.body;

  try {
    let topicId;

    // Add a new topic or retrieve an existing one
    if (isAddingNewTopic) {
      const topicResult = await query(
        "INSERT INTO topics (topic, courseId, branchId, semesterId, subjectId) VALUES (?, ?, ?, ?, ?)",
        [selectedTopic, courseId, branchId, semesterId, subjectId]
      );
      topicId = topicResult.insertId;
    } else {
      const existingTopic = await query(
        "SELECT id FROM topics WHERE topic = ? AND courseId = ? AND branchId = ? AND semesterId = ? AND subjectId = ?",
        [selectedTopic, courseId, branchId, semesterId, subjectId]
      );

      if (!existingTopic.length) {
        return res.status(404).json({ message: "Selected topic not found." });
      }

      topicId = existingTopic[0].id;
    }

    // Add the subtopic
    const subTopicResult = await query(
      "INSERT INTO subtopics (subTopic, topicId) VALUES (?, ?)",
      [subTopic, topicId]
    );
    const subTopicId = subTopicResult.insertId;

    // Insert links (basic, medium, advanced)
    const linkPromises = Object.keys(levels).flatMap((level) =>
      levels[level].map((link) => {
        const { title, link: linkUrl, description, rating } = link;
        return query(
          "INSERT INTO links (title, link, description, rating, subTopicId, level) VALUES (?, ?, ?, ?, ?, ?)",
          [title, linkUrl, description, rating, subTopicId, level]
        );
      })
    );

    // Insert NPTEL videos
    
    const videoPromises = nptelVideos.map(({ title, description, video }) =>
      query(
        "INSERT INTO nptel_videos (title, description, videoName, subTopicId, folder_path) VALUES (?, ?, ?, ?, ?)",
        [title, description, video, subTopicId, videoFolder]
      )
    );

    // Wait for all insertions to complete
    await Promise.all([...linkPromises, ...videoPromises]);

    res.status(200).json({
      message: "Topic, subtopic, links, and NPTEL videos added successfully.",
    });
  } catch (error) {
    console.error("Error adding topic, subtopic, and links:", error);
    res.status(500).json({
      message: "Error adding topic, subtopic, and links.",
      error: error.message,
    });
  }
});

module.exports = router;
