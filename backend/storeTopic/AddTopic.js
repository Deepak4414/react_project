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

  const connection = db; // using mysql connection object

  connection.beginTransaction(async (err) => {
    if (err) {
      return res.status(500).json({ message: "Transaction error", error: err.message });
    }

    try {
      let chapterIdToUse = chapterId;
      let topicId;

      // Insert chapter if needed
      if (isAddingNewChapter) {
        const chapterResult = await query(
          "INSERT INTO chapter (chapter, courseId, branchId, semesterId, subjectId) VALUES (?, ?, ?, ?, ?)",
          [chapterId, courseId, branchId, semesterId, subjectId]
        );
        chapterIdToUse = chapterResult.insertId;
      } else {
        const existingChapter = await query(
          "SELECT id FROM chapter WHERE id = ? AND courseId = ? AND branchId = ? AND semesterId = ? AND subjectId = ?",
          [chapterId, courseId, branchId, semesterId, subjectId]
        );
        if (!existingChapter.length) {
          throw new Error("Selected chapter not found.");
        }
        chapterIdToUse = existingChapter[0].id;
      }

      // Insert topic if needed
      if (isAddingNewTopic) {
        const topicResult = await query(
          "INSERT INTO topics (topic, chapterId, courseId, branchId, semesterId, subjectId) VALUES (?, ?, ?, ?, ?, ?)",
          [topic, chapterIdToUse, courseId, branchId, semesterId, subjectId]
        );
        topicId = topicResult.insertId;
      } else {
        const existingTopic = await query(
          "SELECT id FROM topics WHERE chapterId = ? AND courseId = ? AND branchId = ? AND semesterId = ? AND subjectId = ?",
          [chapterIdToUse, courseId, branchId, semesterId, subjectId]
        );
        if (!existingTopic.length) {
          throw new Error("Selected topic not found.");
        }
        topicId = existingTopic[0].id;
      }

      // Insert subtopic
      const subTopicResult = await query(
        "INSERT INTO subtopics (subTopic, topicId) VALUES (?, ?)",
        [subTopic, topicId]
      );
      const subTopicId = subTopicResult.insertId;

      // Insert links
      const linkPromises = Object.keys(levels).flatMap((level) =>
        levels[level].map((link) => {
          const { title, link: linkUrl, description } = link;
          return query(
            "INSERT INTO links (title, link, description, subTopicId, level) VALUES (?, ?, ?, ?, ?)",
            [title, linkUrl, description, subTopicId, level]
          );
        })
      );

      // Insert NPTEL videos
      const videoPromises = nptelVideos.map(({ title, description, video, videoLevel }) =>
        query(
          "INSERT INTO nptel_videos (title, description, video_level, videoName, subTopicId, folder_path) VALUES (?, ?, ?, ?, ?, ?)",
          [title, description, videoLevel, video, subTopicId, videoFolder]
        )
      );

      await Promise.all([...linkPromises, ...videoPromises]);

      // Commit the transaction if everything succeeds
      connection.commit((commitErr) => {
        if (commitErr) {
          connection.rollback(() => {
            res.status(500).json({ message: "Commit failed", error: commitErr.message });
          });
        } else {
          res.status(200).json({
            message: "All data inserted successfully.",
          });
        }
      });
    } catch (error) {
      // Rollback on any error
      connection.rollback(() => {
        console.error("Transaction failed:", error);
        res.status(500).json({
          message: "Transaction failed, all changes rolled back.",
          error: error.message,
        });
      });
    }
  });
});

module.exports = router;
