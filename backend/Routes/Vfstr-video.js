const express = require("express");
const router = express.Router();
const db = require("../storeTopic/db");
const fs = require("fs");
const path = require("path");

// pdf file path 
router.use("/videos", express.static(path.join("D:/Videos/VFSTR")));
router.get("/pdf", (req, res) => {
  const pdfPath = req.query.path;
  if (!pdfPath) return res.status(400).send("Missing PDF path");

  const absolutePath = path.resolve(pdfPath);
  res.sendFile(absolutePath);
});


router.get("/vfstr-videos", async (req, res) => {
  const { subTopic } = req.query;

  try {
    // Fetch video and PDF details from the database
    const files = await new Promise((resolve, reject) => {
      db.query(
        "SELECT id, title, description, video_name, video_level, file_name, file, faculty_name, subject FROM vfstr_videos WHERE subTopicId = ?",
        [subTopic],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });
    // console.log(files);

    if (!files || files.length === 0) {
      return res.status(404).json({ error: "No files found for this subtopic." });
    }

    // Convert BLOB to Base64 for PDF files
    const filesWithBase64 = files.map((file) => ({
      id: file.id,
      title: file.title,
      description: file.description,
      video_name: file.video_name,
      video_level: file.video_level,
      file_name: file.file_name,
      file: file.file,
      faculty_name: file.faculty_name,
    }));
    // If videos exist, fetch from folder
    if (files[0].video_name && files[0].video_name.length > 0) {
      try {
        const subjectResult = await new Promise((resolve, reject) => {
          db.query(
            "SELECT subjectName FROM subjects WHERE subjectId = ?",
            [files[0].subject],
            (err, results) => {
              if (err) reject(err);
              else resolve(results);
            }
          );
        });

        // Validate subjectResult before using it
        if (!subjectResult || subjectResult.length === 0 || !subjectResult[0].subjectName) {
          return res.json({
            videofiles: filesWithBase64,
            message: "No videos available for this subject.",
          });
        }
        const subjectName = subjectResult[0].subjectName;
        const VIDEO_FOLDER = path.join("D:/Videos/VFSTR", subjectName);
        fs.access(VIDEO_FOLDER, fs.constants.R_OK, (accessErr) => {
          if (accessErr) {
            console.error("Error accessing folder:", accessErr);
            return res.status(500).json({ error: "Video folder is not accessible." });
          }

          fs.readdir(VIDEO_FOLDER, (err, videoFiles) => {
            if (err) {
              console.error("Error reading folder:", err);
              return res.status(500).json({ error: "Failed to fetch video files." });
            }

            const filteredVideos = videoFiles.filter(
              (file) =>
                file.endsWith(".mp4") || file.endsWith(".avi") || file.endsWith(".mkv")
            );

            return res.json({
              videofiles: filesWithBase64,
              videos: filteredVideos,
              folder: VIDEO_FOLDER,
            });
          });
        });
      } catch (err) {
        console.error("Error fetching subject name:", err);
        return res.status(500).json({ error: "Failed to fetch subject details." });
      }
    } else {
      return res.json({ videofiles: filesWithBase64 });
    }
  } catch (error) {
    console.error("Error fetching files:", error);
    return res.status(500).json({ error: "Failed to fetch files." });
  }
});

module.exports = router;
