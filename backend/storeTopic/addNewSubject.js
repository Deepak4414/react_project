const express = require("express");
const router = express.Router();
const db = require("./db"); // Database connection object
 
router.post("/add-subject", async (req, res) => {
    const { subjectName, semesterId, branchId } = req.body;
    
    try {
        // Check if the subject already exists
        const existingSubject = await db.query(
        "SELECT * FROM subjects WHERE subjectName = ? AND semesterId = ?",
        [subjectName, semesterId]
        );
    
        if (existingSubject.length > 0) {
        return res.status(400).json({ message: "Subject already exists." });
        }
    
        // Insert new subject
        const result = await db.query(
        "INSERT INTO subjects (subjectName, branchId, semesterId) VALUES (?, ?, ?)",
        [subjectName, branchId, semesterId]
        );
    
        res.status(201).json({ message: "Subject added successfully.", subjectId: result.insertId });
    } catch (error) {
        console.error("Error adding subject:", error);
        res.status(500).json({ message: "Internal server error." });
    }
    }
    );

module.exports = router;
