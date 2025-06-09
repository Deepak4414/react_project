const express = require("express");
const router = express.Router();
const db = require("../storeTopic/db");

// Delete a single link
router.delete("/delete-link/:id", (req, res) => {
  const { id } = req.params;
  console.log("Deleting link with ID:", id);

  db.query("DELETE FROM links WHERE id = ?", [id], (error, result) => {
    if (error) {
      console.error("Error deleting link:", error);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.json({ message: "Link deleted successfully" });
  });
});

// Delete a single NPTEL video
router.delete("/delete-nptel/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM nptel_videos WHERE id = ?", [id], (error, result) => {
    if (error) {
      console.error("Error deleting NPTEL video:", error);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "NPTEL video not found" });
    }

    res.json({ message: "NPTEL video deleted successfully" });
  });
});


// update or add links for a subtopic
router.put("/update-links/:subTopicId", (req, res) => {
  const { subTopicId } = req.params;
  const { levels } = req.body;

  db.query("START TRANSACTION", (err) => {
    if (err) return res.status(500).json({ message: "Transaction start error" });

    const queries = [];

    for (const [level, links] of Object.entries(levels)) {
      for (const link of links) {
        if (link.id && !String(link.id).startsWith("new-")) {
          // Existing link → UPDATE
          queries.push([
            `UPDATE links 
             SET title = ?, link = ?, description = ?, level = ? 
             WHERE id = ?`,
            [link.title, link.link, link.description, level, link.id]
          ]);
        } else {
          // New link → INSERT
          queries.push([
            `INSERT INTO links (subTopicId, level, title, link, description) 
             VALUES (?, ?, ?, ?, ?)`,
            [subTopicId, level, link.title, link.link, link.description]
          ]);
        }
      }
    }

    const runQueries = (index = 0) => {
      if (index >= queries.length) {
        db.query("COMMIT", (commitErr) => {
          if (commitErr) {
            console.error("Commit error:", commitErr);
            return res.status(500).json({ message: "Commit error" });
          }
          res.json({ message: "Links updated successfully" });
        });
        return;
      }

      const [sql, params] = queries[index];
      db.query(sql, params, (error) => {
        if (error) {
          db.query("ROLLBACK", () => {});
          console.error("Error running query:", error);
          return res.status(500).json({ message: "Server error during update/insert" });
        }
        runQueries(index + 1);
      });
    };

    runQueries();
  });
});


// update chapter 
// PUT /update-chapter/chapters/:id
router.put('/update-chapter-name/chapters/:id', async (req, res) => {
  const chapterId = req.params.id;
  const { chapter } = req.body;
  try {
    await db.query('UPDATE chapter SET chapter = ? WHERE id = ?', [chapter, chapterId]);
    res.status(200).json({ message: 'Chapter updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update chapter' });
  }
});

//edit topic 
// PUT /api/topics/:id
router.put('/update-topic-name/topics/:id', async (req, res) => {
  const topicId = req.params.id;
  const { topic } = req.body;

  try {
    await db.query('UPDATE topics SET topic = ? WHERE id = ?', [topic, topicId]);
    res.status(200).json({ message: 'Topic updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update topic' });
  }
});

//edit subtopic
// PUT /api/subtopics/:id
router.put('/update-subtopic-name/subtopics/:id', async (req, res) => {
  const subtopicId = req.params.id;
  const { subTopic } = req.body;

  try {
    await db.query('UPDATE subtopics SET subTopic = ? WHERE id = ?', [subTopic, subtopicId]);
    res.status(200).json({ message: 'Subtopic updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update subtopic' });
  }
});


module.exports = router;
