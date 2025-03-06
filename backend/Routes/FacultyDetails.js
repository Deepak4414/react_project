const express = require("express");
const router = express.Router();
const db = require("../storeTopic/db");
const multer = require("multer");
const path = require("path");

// Define the directory where images are stored
const IMAGE_DIRECTORY = "D:/Videos/Faculty_Photo";

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: IMAGE_DIRECTORY,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// API to Handle Faculty-Photo-Upload
router.post("/upload-faculty-photo", upload.single("file"), (req, res) => {
  const { name } = req.body;
  const fileName = req.file.filename;

  const sql = "INSERT INTO faculty (name, photo) VALUES (?, ?)";
  db.query(sql, [name, fileName], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "File uploaded successfully", file: fileName });
  });
});


// API to get faculty image by name
router.get("/faculty/image/:name", (req, res) => {
  const facultyName = req.params.name;

  const query = `SELECT photo FROM faculty WHERE name = ? LIMIT 1`;

  db.query(query, [facultyName], (err, result) => {
    if (err) {
      console.error("Error fetching faculty image:", err);
      return res.status(500).json({ message: "Server error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Faculty image not found" });
    }
    const imageName = result[0].photo;
    const imagePath = path.join("D:/Videos/Faculty_Photo", imageName); // Corrected path forma
    res.sendFile(imagePath, (err) => {
      if (err) {
          res.status(404).send("Faculty not found");
      }
  });
    // const imagePath = path.join(IMAGE_DIRECTORY, imageName);
    // res.sendFile(imagePath);
  });
});

// Get all faculties
router.get('/fetch-faculties', async (req, res) => {
  try {
    const query = "SELECT * FROM faculty";
    db.query(query, (err, result) => {
      if (err) {
        res.status(500).json({ message: 'Error fetching faculties' });
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching faculties' });
  }
});

module.exports = router;
