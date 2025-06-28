const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Database connection object
router.delete("/delete-subtopic/:subtopic_id", async (req, res) => {
  const { subtopic_id } = req.params;
  try {
    const existingSubtopic = await db.query(
      "SELECT * FROM subtopics WHERE id = ?",
      [subtopic_id]
    );

    if (existingSubtopic.length === 0) {
      return res.status(404).json({ message: "Subtopic not found." });
    }

    await db.query("DELETE FROM subtopics WHERE id = ?", [subtopic_id]);

    res.status(200).json({ message: "Subtopic deleted successfully." });
  } catch (error) {
    console.error("Error deleting subtopic:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
router.delete("/delete-topic/:topic_id", async (req, res) => {
  const { topic_id } = req.params;
  try {
    const existingtopic = await db.query("SELECT * FROM topics WHERE id = ?", [
      topic_id,
    ]);

    if (existingtopic.length === 0) {
      return res.status(404).json({ message: "topic not found." });
    }

    await db.query("DELETE FROM topics WHERE id = ?", [topic_id]);

    res.status(200).json({ message: "topic deleted successfully." });
  } catch (error) {
    console.error("Error deleting topic:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
router.delete("/delete-chapter/:chapter_id", async (req, res) => {
  const { chapter_id } = req.params;
  try {
    const existingchapter = await db.query(
      "SELECT * FROM chapter WHERE id = ?",
      [chapter_id]
    );

    if (existingchapter.length === 0) {
      return res.status(404).json({ message: "chapter not found." });
    }

    await db.query("DELETE FROM chapter WHERE id = ?", [chapter_id]);

    res.status(200).json({ message: "chapter deleted successfully." });
  } catch (error) {
    console.error("Error deleting chapter:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
router.delete("/delete-nptel/:subtopic_id", async (req, res) => {
  const { subtopic_id } = req.params;
  try {
    const existingSubtopic = await db.query(
      "SELECT * FROM nptel_videos WHERE id = ?",
      [subtopic_id]
    );

    if (existingSubtopic.length === 0) {
      return res.status(404).json({ message: "chapter not found." });
    }

    await db.query("DELETE FROM nptel_videos WHERE id = ?", [subtopic_id]);

    res.status(200).json({ message: "chapter deleted successfully." });
  } catch (error) {
    console.error("Error deleting chapter:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// DELETE VFSTR video by ID
router.delete("/delete-vfstr/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the VFSTR video exists
    const [existing] = await db.query("SELECT * FROM vfstr_videos WHERE id = ?", [id]);

    if (!existing || existing.length === 0) {
      return res.status(404).json({ message: "VFSTR video not found." });
    }

    // Delete the VFSTR video
    await db.query("DELETE FROM vfstr_videos WHERE id = ?", [id]);

    res.status(200).json({ message: "VFSTR video deleted successfully." });
  } catch (error) {
    console.error("Error deleting VFSTR video:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
