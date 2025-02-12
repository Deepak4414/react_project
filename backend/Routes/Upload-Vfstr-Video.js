const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("../storeTopic/db");
const router = express.Router();

// Ensure folder exists before saving files
const ensureUploadFolderExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = req.body.subject || "default"; // Default folder if subject is missing
    const uploadPath = path.join(__dirname, `../uploads/${folderName}`);

    ensureUploadFolderExists(uploadPath); // Ensure folder exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Handle video & file upload
router.post("/upload-vfstr-video", upload.single("videoFile"), (req, res) => {
  try {
    const { title, description,video, videoLevel, subject, topicId, subTopicId } = req.body;
    const videoFile = req.file;

    // Set default values for empty fields
    const videoName = video ? video : null;
    const fileName = videoFile ? videoFile.originalname : null;
    const fileBuffer = videoFile ? fs.readFileSync(videoFile.path) : null;

    // Save video details to the database
    const videoData = {
      title: title || null, // If empty, insert NULL
      description: description || null,
      video_name: videoName,
      video_level: videoLevel || null,
      file_name: fileName,
      file: fileBuffer, // Store BLOB or NULL
      topicId: topicId || null,
      subTopicId: subTopicId || null,
      subject: subject || null,
    };

    // Insert into database
    const query = "INSERT INTO vfstr_videos SET ?";
    db.query(query, videoData, (err, result) => {
      if (err) {
        console.error("Error inserting:", err);
        return res.status(500).json({ message: "Error inserting data into database." });
      }
      res.status(201).json({ message: "Video uploaded successfully!", videoData });
    });
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
    const VIDEO_FOLDER = `D:/Videos/VFSTR/${results[0].subjectName}`;
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
