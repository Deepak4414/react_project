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
        "SELECT id, videoName, folder_path,title,description,video_level FROM nptel_videos WHERE subTopicId = ?",
        [subTopic],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    if (videos.length === 0) {
      return res.status(200).json([[], [], [], [], [], []]);
    }
    const id = videos.map(({ id }) => id);
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
      return res.status(200).json([[], [], [], [], [], []]);
    }

    res.json([id, verifiedVideos,videoNames,title,description,video_level]); // Send verified video paths
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
  const subjectId = req.params.subject;
  // Get subject name from DB
  const subjectQuery = "SELECT * FROM subjects WHERE subjectId = ?";

  db.query(subjectQuery, [subjectId], (err, results) => {
    if (err) {
      console.error("Error fetching subject name:", err);
      return res.status(500).send("Failed to fetch videos.");
    }

    if (results.length === 0 || !results[0].subjectName) {
      return res.status(404).send("Subject not found.");
    }

    const subjectName = results[0].subjectName;
    const VIDEO_FOLDER = path.join("D:/Videos", subjectName);

    // ✅ Check if folder exists, create if not
    if (!fs.existsSync(VIDEO_FOLDER)) {
      try {
        fs.mkdirSync(VIDEO_FOLDER, { recursive: true });
        console.log(`Created folder: ${VIDEO_FOLDER}`);
      } catch (mkdirErr) {
        console.error("Error creating folder:", mkdirErr);
        return res.status(500).send("Failed to create video folder.");
      }
    }

    // ✅ Read files if folder exists (or just created)
    fs.readdir(VIDEO_FOLDER, (readErr, files) => {
      if (readErr) {
        console.error("Error reading folder:", readErr);
        return res.status(500).send("Failed to fetch videos.");
      }

      const videoFiles = files.filter(
        (file) =>
          file.endsWith(".mp4") ||
          file.endsWith(".avi") ||
          file.endsWith(".mkv")
      );

      res.json([videoFiles, VIDEO_FOLDER]);
    });
  });
});



//update nptel video [if new than insert into nptel_videos table else update the existing video]
router.put("/update-nptel/:subTopicId", async (req, res) => {
  const { subTopicId } = req.params;
  const {
    ids,
    videos,
    titles,
    descriptions,
    levels,
    folder_path,
  } = req.body;
  try {
    for (let i = 0; i < videos.length; i++) {
      const id = ids[i];
      const title = titles[i];
      const description = descriptions[i];
      const videoLevel = levels[i];
      const video = videos[i];
      const videoFolder = folder_path;

      const isNew = !id || id.toString().startsWith("new-");

      if (isNew) {
        // INSERT
        await db.query(
          "INSERT INTO nptel_videos (title, description, video_level, videoName, subTopicId, folder_path) VALUES (?, ?, ?, ?, ?, ?)",
          [title, description, videoLevel, video, subTopicId, videoFolder]
        );
      } else {
        // UPDATE
        await db.query(
          "UPDATE nptel_videos SET title = ?, description = ?, video_level = ?, videoName = ?, subTopicId = ?, folder_path = ? WHERE id = ?",
          [title, description, videoLevel, video, subTopicId, videoFolder, id]
        );
      }
    }

    res.status(200).json({ success: true, message: "NPTEL videos processed successfully." });
  } catch (error) {
    console.error("Error updating/inserting NPTEL videos:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
});


module.exports = router;
