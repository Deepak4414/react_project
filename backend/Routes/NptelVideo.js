const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const db = require("../storeTopic/db");
const app = express();
app.use(cors());

// Fetch video details for a specific subTopic
router.get("/videos", async (req, res) => {
  const { subTopic } = req.query;
  try {
    // Query database for video details
    const videos = await new Promise((resolve, reject) => {
      db.query(
        "SELECT videoName, folder_path,title,description,video_level FROM nptel_videos WHERE subTopicId = ?",
        [subTopic],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    if (videos.length === 0) {
      return res.status(404).json({ error: "No videos found for the given subtopic." });
    }
    const videoNames = videos.map(({ videoName }) => videoName);
    const title = videos.map(({title})=>title);
    const description = videos.map(({description})=>description);
    const video_level = videos.map(({video_level})=>video_level);
    // Verify existence of videos in their respective folders
    const verifiedVideos = videos
      .map(({ videoName, folder_path }) => {
        const videoFullPath = path.join(folder_path, videoName);
        return fs.existsSync(videoFullPath) ? videoFullPath : null;
      })
      .filter((video) => video !== null);

    if (verifiedVideos.length === 0) {
      return res.status(404).json({ error: "No valid videos found." });
    }

    res.json([verifiedVideos,videoNames,title,description,video_level]); // Send verified video paths
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: "Failed to fetch videos." });
  }
});

// Endpoint to stream a video
router.get("/video", (req, res) => {
  const videoPath = req.query.path;
  if (!videoPath || !fs.existsSync(videoPath)) {
    return res.status(404).json({ error: "Video not found." });
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res.status(416).send("Requested range not satisfiable.");
      return;
    }

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});


// Video folder
router.get("/nptelvideos/:subject", (req, res) => {
  const subject = req.params.subject;
  // fetch subject name from subject id
  const subjectName = "select * from subjects where subjectId = ?";
  db.query(subjectName, subject, (err, results) => {
    if (err) {
      console.error("Error fetching subject name:", err);
      return res.status(500).send("Failed to fetch videos.");
    }
    if(results[0].subjectName.length){
    // fetch video files from the subject folder
    const VIDEO_FOLDER = `D:/Videos/${results[0].subjectName}`;
    fs.readdir(VIDEO_FOLDER, (err, files) => {
      if (err) {
        console.error("Error reading folder:", err);
        return res.status(500).send("Failed to fetch videos.");
      }
      const videoFiles = files.filter(
        (file) =>
          file.endsWith(".mp4") ||
          file.endsWith(".avi") ||
          file.endsWith(".mkv")
      );

      res.json([videoFiles,VIDEO_FOLDER]);
    });
  }
  else{
    res.json({message:"No videos available for this subject"})
  }
  });
});


module.exports = router;
