const express = require("express");
const router = express.Router();
const db = require("./db"); // Database connection object

router.post("/add-chapter", async (req, res) => {
  const { chapterName, subjectId, courseId, branchId, semesterId } = req.body;

  try {
    // Check if the chapter already exists
    const existingChapter = await db.query(
      "SELECT * FROM chapter WHERE chapter = ? AND subjectId = ?",
      [chapterName, subjectId]
    );

    if (existingChapter.length > 0) {
      return res.status(400).json({ message: "Chapter already exists." });
    }

    // Insert new chapter
    const result = await db.query(
      "INSERT INTO chapter (chapter, courseId, branchId, semesterId, subjectId) VALUES (?, ?, ?, ?, ?)",
      [chapterName, courseId, branchId, semesterId, subjectId]
    );

    res.status(201).json({
      message: "Chapter added successfully.",
      chapter: {
        id: result.insertId,
        chapterName: chapterName,
      },
    });
  } catch (error) {
    console.error("Error adding chapter:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
