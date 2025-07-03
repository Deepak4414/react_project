const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Promise-based MySQL pool

// ================= Courses =================

// Get all courses
router.get("/courses", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM courses");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new course
router.post("/courses", async (req, res) => {
  const { courseName } = req.body;
  try {
    await db.query("INSERT INTO courses (courseName) VALUES (?)", [courseName]);
    res.json({ message: "Course added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a course
router.put("/courses/:id", async (req, res) => {
  const { id } = req.params;
  const { courseName } = req.body;
  try {
    await db.query("UPDATE courses SET courseName = ? WHERE courseId = ?", [courseName, id]);
    res.json({ message: "Course updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a course
router.delete("/courses/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM courses WHERE courseId = ?", [id]);
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= Branches =================
// API to fetch branches by course
router.get("/branches/:courseId", async (req, res) => {
  const { courseId } = req.params;

  try {
    const [results] = await db.query(
      "SELECT branchId, branchName FROM branches WHERE courseId = ?",
      [courseId]
    );

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No branches found for this course" });
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new branch under a course
router.post("/branches", async (req, res) => {
  const { branchName, courseId } = req.body;
  try {
    await db.query("INSERT INTO branches (branchName, courseId) VALUES (?, ?)", [branchName, courseId]);
    res.json({ message: "Branch added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a branch
router.put("/branches/:id", async (req, res) => {
  const { id } = req.params;
  const { branchName } = req.body;
  try {
    await db.query("UPDATE branches SET branchName = ? WHERE branchId = ?", [branchName, id]);
    res.json({ message: "Branch updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a branch
router.delete("/branches/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM branches WHERE branchId = ?", [id]);
    res.json({ message: "Branch deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= Semesters =================
// API to fetch semesters by branch
router.get("/semesters/:branchId", async (req, res) => {
  const { branchId } = req.params;

  try {
    const [results] = await db.query(
      "SELECT * FROM semesters WHERE branchId = ?",
      [branchId]
    );

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No semesters found for this branch" });
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a semester
router.post("/semesters", async (req, res) => {
  const { semesterName, branchId } = req.body;
  try {
    await db.query("INSERT INTO semesters (semesterName, branchId) VALUES (?, ?)", [semesterName, branchId]);
    res.json({ message: "Semester added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update semester
router.put("/semesters/:id", async (req, res) => {
  const { id } = req.params;
  const { semesterName } = req.body;
  try {
    await db.query("UPDATE semesters SET semesterName = ? WHERE semesterId = ?", [semesterName, id]);
    res.json({ message: "Semester updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete semester
router.delete("/semesters/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM semesters WHERE semesterId = ?", [id]);
    res.json({ message: "Semester deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= Subjects =================

// Get all subjects
router.get("/subjects/:semesterId", async (req, res) => {
  const { semesterId } = req.params;

  try {
    const [results] = await db.query(
      "SELECT * FROM subjects WHERE semesterId = ?",
      [semesterId]
    );

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No subjects found for this semester" });
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a subject
router.post("/subjects", async (req, res) => {
  const { subjectName, branchId, semesterId } = req.body;
  try {
    await db.query(
      "INSERT INTO subjects (subjectName, branchId, semesterId) VALUES (?, ?, ?)",
      [subjectName, branchId, semesterId]
    );
    res.json({ message: "Subject added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a subject
router.put("/subjects/:id", async (req, res) => {
  const { id } = req.params;
  const { subjectName } = req.body;
  try {
    await db.query("UPDATE subjects SET subjectName = ? WHERE subjectId = ?", [subjectName, id]);
    res.json({ message: "Subject updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a subject
router.delete("/subjects/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM subjects WHERE subjectId = ?", [id]);
    res.json({ message: "Subject deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= Faculty Registration =================
router.post("/faculty/register", async (req, res) => {
  const { username, password } = req.body;

  // Optional: validate username/password
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required." });
  }

  // Optional: check if username exists
  db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error." });

    if (result.length > 0) {
      return res.status(409).json({ message: "Username already exists." });
    }

    // Insert new faculty
    db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password], // use bcrypt.hash(password, saltRounds) if hashing
      (err, insertRes) => {
        if (err) return res.status(500).json({ message: "Registration failed." });
        return res.status(201).json({ message: "Faculty registered successfully." });
      }
    );
  });
});

module.exports = router;
