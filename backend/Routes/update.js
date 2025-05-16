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

// // Update or add NPTEL videos for a subtopic
// router.put("/update-nptel/:subTopicId", (req, res) => {
//   const { subTopicId } = req.params;
//   const { links, ids, titles, descriptions, durations } = req.body;

//   db.query("START TRANSACTION", (err) => {
//     if (err) return res.status(500).json({ message: "Transaction start error" });

//     db.query("DELETE FROM nptel_videos WHERE sub_topic_id = ?", [subTopicId], (deleteErr) => {
//       if (deleteErr) {
//         db.query("ROLLBACK", () => {});
//         return res.status(500).json({ message: "Delete error" });
//       }

//       const queries = [];

//       for (let i = 0; i < links.length; i++) {
//         if (!links[i] || !titles[i]) continue;

//         if (ids[i] && !ids[i].startsWith("new-")) {
//           queries.push([
//             "UPDATE nptel_videos SET link = ?, title = ?, description = ?, duration = ? WHERE id = ?",
//             [
//               links[i],
//               titles[i],
//               descriptions[i] || "",
//               durations[i] || "",
//               ids[i],
//             ],
//           ]);
//         } else {
//           queries.push([
//             "INSERT INTO nptel_videos (sub_topic_id, link, title, description, duration) VALUES (?, ?, ?, ?, ?)",
//             [
//               subTopicId,
//               links[i],
//               titles[i],
//               descriptions[i] || "",
//               durations[i] || "",
//             ],
//           ]);
//         }
//       }

//       const runQueries = (index = 0) => {
//         if (index >= queries.length) {
//           db.query("COMMIT", (commitErr) => {
//             if (commitErr) {
//               console.error("Commit error:", commitErr);
//               return res.status(500).json({ message: "Commit error" });
//             }
//             res.json({ message: "NPTEL videos updated successfully" });
//           });
//           return;
//         }

//         const [sql, params] = queries[index];
//         db.query(sql, params, (queryErr) => {
//           if (queryErr) {
//             db.query("ROLLBACK", () => {});
//             console.error("Error updating NPTEL video:", queryErr);
//             return res.status(500).json({ message: "Server error during update" });
//           }
//           runQueries(index + 1);
//         });
//       };

//       runQueries();
//     });
//   });
// });

module.exports = router;
