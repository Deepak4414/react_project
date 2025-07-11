const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("../storeTopic/db");
const router = express.Router();

/// Ensure folder exists before moving file
const ensureUploadFolderExists = (uploadPath) => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
};

//  First, store file in memory (so we can parse text fields first)
const upload = multer({ storage: multer.memoryStorage() });

// Middleware to handle request body before setting destination
const processUpload = (req, res, next) => {
  upload.fields([{ name: "videoFile", maxCount: 1 }])(req, res, (err) => {
    if (err) return res.status(400).json({ message: "File upload error", error: err });

    const subjectId=req.body.subject;
    const subjectName = "select * from subjects where subjectId = ?";
    db.query(subjectName, subjectId, (err, results) => {
      if (err) {
        return res.status(400).json({ message: "Error fetching subject", error: err });
        }
    
    const subject = results[0].subjectName || "default"; // Use "default" if missing
    req.uploadPath = `/home/vignan/videos/VFSTR/${subject}/FILES`;
    ensureUploadFolderExists(req.uploadPath);
    next();
  });
});
};

// 2️⃣ Upload video route (Moves file after parsing body)
router.post("/upload-vfstr-video", processUpload, (req, res) => {
  try {
    const { id, title, description, video, videoLevel, subject, topicId, subTopicId, facultyName } = req.body;

    if (!subject) {
      return res.status(400).json({ message: "Subject is missing in request body" });
    }

    const videoFile = req.files?.["videoFile"]?.[0] || null;
    let filePath = null;
    let fileName = null;

    if (videoFile) {
      fileName = `${Date.now()}-${videoFile.originalname}`;
      filePath = path.join(req.uploadPath, fileName);
      fs.writeFileSync(filePath, videoFile.buffer);
    }

    // Common video data for both insert/update
    const videoData = {
      title: title || null,
      description: description || null,
      video_name: video || null,
      video_level: videoLevel || null,
      faculty_name: facultyName || null,
      topicId: topicId || null,
      subTopicId: subTopicId || null,
      subject: subject || null,
    };

    // Only update file info if a new file is uploaded
    if (fileName && filePath) {
      videoData.file_name = fileName;
      videoData.file = filePath;
    }

    if (id && !id.toString().startsWith("new-")) {
      // 🔁 UPDATE
      db.query("UPDATE vfstr_videos SET ? WHERE id = ?", [videoData, id], (err, result) => {
        if (err) {
          console.error("Database update error:", err);
          return res.status(500).json({ message: "Error updating video." });
        }
        return res.status(200).json({ message: "Video updated successfully!", videoData });
      });
    } else {
      // ➕ INSERT
      db.query("INSERT INTO vfstr_videos SET ?", videoData, (err, result) => {
        if (err) {
          console.error("Database insert error:", err);
          return res.status(500).json({ message: "Error inserting data into database." });
        }
        return res.status(201).json({ message: "Video uploaded successfully!", videoData });
      });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});



// Video folder
router.get("/vfstrvideos/:subject", (req, res) => {
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
    const VIDEO_FOLDER = `/home/vignan/Videos/VFSTR/${results[0].subjectName}`;
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