const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL2 pool

// Reorder chapters
router.post("/reorder-chapters", async (req, res) => {
  const { chapterIds } = req.body;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    for (let i = 0; i < chapterIds.length; i++) {
      await connection.query(
        "UPDATE chapter SET `order` = ? WHERE id = ?",
        [i + 1, chapterIds[i]]
      );
    }

    await connection.commit();
    res.status(200).json({ message: "Chapters reordered successfully" });
  } catch (err) {
    await connection.rollback();
    console.error("Error reordering chapters:", err);
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// Reorder topics
router.post("/reorder-topics", async (req, res) => {
  const { topicIds } = req.body;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    for (let i = 0; i < topicIds.length; i++) {
      await connection.query(
        "UPDATE topics SET `order` = ? WHERE id = ?",
        [i + 1, topicIds[i]]
      );
    }

    await connection.commit();
    res.status(200).json({ message: "Topics reordered successfully" });
  } catch (err) {
    await connection.rollback();
    console.error("Error reordering topics:", err);
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// Reorder subtopics
router.post("/reorder-subtopics", async (req, res) => {
  const { subtopicIds } = req.body;

  const connection = await db.getConnection(); // ✅ Get a connection from the pool

  try {
    await connection.beginTransaction();
    console.log("Reordering subtopics:", subtopicIds);

    for (let i = 0; i < subtopicIds.length; i++) {
      await connection.query(
        "UPDATE subtopics SET `order` = ? WHERE id = ?",
        [i + 1, subtopicIds[i]]
      );
    }

    await connection.commit();
    res.status(200).json({ message: "Subtopics reordered successfully" });
  } catch (err) {
    await connection.rollback();
    console.error("Error during reordering subtopics:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    connection.release(); // ✅ Always release connection
  }
});

module.exports = router;