const express = require("express");
const router = express.Router();
const db = require("./db"); // Database connection object
// const authenticateUser = require("../authMiddleware");

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
    chapterId,
    isAddingNewChapter,
    topic,
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
// console.log(req.body);
  try {
    let chapterIdToUse = chapterId; // Default to provided chapterId
    let topicId;

    // Add a new chapter if required
    if (isAddingNewChapter) {
      const chapterResult = await query(
        "INSERT INTO chapter (chapter, courseId, branchId, semesterId, subjectId) VALUES (?, ?, ?, ?, ?)",
        [chapterId, courseId, branchId, semesterId, subjectId]
      );
      chapterIdToUse = chapterResult.insertId; // Use the newly added chapter ID
    } else {
      // Check if the chapter exists
      const existingChapter = await query(
        "SELECT id FROM chapter WHERE id = ? AND courseId = ? AND branchId = ? AND semesterId = ? AND subjectId = ?",
        [chapterId, courseId, branchId, semesterId, subjectId]
      );
      if (!existingChapter.length) {
        return res.status(404).json({ message: "Selected chapter not found." });
      }
      chapterIdToUse = existingChapter[0].id;
      
    }

    // Add a new topic if required
    if (isAddingNewTopic) {
      
      const topicResult = await query(
        "INSERT INTO topics (topic, chapterId, courseId, branchId, semesterId, subjectId) VALUES (?, ?, ?, ?, ?, ?)",
        [topic, chapterIdToUse, courseId, branchId, semesterId, subjectId]
      );
      topicId = topicResult.insertId; // Use the newly added topic ID
    } else {
     
      // Check if the topic exists
      const existingTopic = await query(
        "SELECT id FROM topics WHERE  chapterId = ? AND courseId = ? AND branchId = ? AND semesterId = ? AND subjectId = ?",
        [chapterIdToUse, courseId, branchId, semesterId, subjectId]
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
    const subTopicId = subTopicResult.insertId; // Use the newly added subtopic ID

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
 
    const videoPromises = nptelVideos.map(({ title, description, video,videoLevel }) =>
      query(
        "INSERT INTO nptel_videos (title, description,video_level, videoName, subTopicId, folder_path) VALUES (?, ?, ?, ?, ?, ?)",
        [title, description,videoLevel, video, subTopicId, videoFolder]
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
