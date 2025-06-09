// Import required libraries
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const addTopicRouter = require("./storeTopic/AddTopic"); // Adjust the path as necessary
const registerRouter = require('./Registration/Register');
const UserRouter = require('./Routes/User');
const db = require('./storeTopic/db');
const ratinglink =require('./Routes/Rating');
const liveChannelRouter = require('./Routes/LiveChannelTime'); // Import the LiveChannelTime router
const UploadVfstrVideo = require('./Routes/Upload-Vfstr-Video');
const VfstrVideo = require('./Routes/Vfstr-video'); 
const linksRouter = require("./Routes/Links"); // Import the links API
const facultydetails = require('./Routes/FacultyDetails');
const mannKiBaatRouter = require( './Routes/MannKiBaatRouter'); // Import the Mann Ki Baat router
const nptelvideofetch = require('./Routes/NptelVideo'); // Import the NptelVideoFetch router
const Question = require('./Routes/Questions'); // Import the Questions router


const addsubjectRouter = require('./storeTopic/addNewSubject'); // Import the AddSubject router
const addChapterRouter = require('./storeTopic/addChapter'); // Import the AddChapter router
const addNewTopic = require('./storeTopic/addnewTopic'); // Import the AddTopic router
const addSubTopicRouter = require('./storeTopic/addSubtopic'); // Import the AddSubTopic router
const deleteSubTopicRouter = require('./Routes/delete'); // Import the DeleteSubTopic router

//admin routes
const adminRouter = require('./Routes/admin'); // Import the Admin router

// drag and drop routes
const dragAndDropRouter = require('./Routes/drag-and-drop'); // Import the DragAndDrop


// Initialize Express app
const apiRoutes = require("./Routes/api");
const dotenv = require("dotenv");

const app = express();
// Middleware
app.use(cors());
app.use(bodyParser.json());
dotenv.config();

const updatelink= require("./Routes/update"); // Import the update router
const live = require("./Routes/ViewLiveChannelSchedule"); // Import the LiveChannelTime router
app.use("/api/", live); // Mount the live router


//===========================================
// add new chapter
app.use("/api/add-chapter/", addChapterRouter); // Mount the add chapter router
//=========================================
// add new topic
app.use("/api/add-topic/", addNewTopic); // Mount the add topic router
//=========================================
// add new subtopic
app.use("/api/add-subtopic/", addSubTopicRouter); // Mount the add subtopic router
//===========================================
// delete subtopic
app.use("/api/delete/", deleteSubTopicRouter); // Mount the delete subtopic router
//=========================================
// add new admin
app.use("/api/admin/", adminRouter); // Mount the admin router
//=========================================
// add drag and drop functionality
app.use("/api/drag-and-drop/", dragAndDropRouter); // Mount the drag and drop
//=========================================
//=========================================
//=========================================

// add new subject
app.use("/api/subjects/", addsubjectRouter); // Mount the add subject router

//==========================================
app.use("/api/mannKiBaat", mannKiBaatRouter);
//=================================================

//upadate the links and data like link
app.use("/api/", linksRouter); // Register the links API

//============================================================
// Routes
app.use("/api/", apiRoutes);
//=================================================
app.use("/api/", VfstrVideo);
// =================================================
app.use("/api/", UploadVfstrVideo);
// =================================================
app.use('/api/',liveChannelRouter);
// =================================================
app.use("/api/topics/", addTopicRouter); // Mount the topic router
// =================================================
//Router api for Registration of student
app.use('/api/',registerRouter);

//=================================================
app.use('/api/',UserRouter);

//=================================================
app.use('/api/',ratinglink);
//=================================================
// api for upload the faculty details
app.use('/api/',facultydetails);
// =================================================
app.use('/api/',addTopicRouter);

// =================================================
app.use('/api/',nptelvideofetch);

// =================================================
// api for upload the question paper
app.use('/api/',Question);

// =================================================
// update the links and data like link
app.use("/api/", updatelink); // Register the links API

//================================================
// Define API endpoint to fetch data
app.get("/api/data", (req, res) => {
  const query = "SELECT * FROM students"; // Replace with your SQL query
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(results); // Send data as JSON
    }
  });
});

// =================================================
// API to fetch courses
app.get("/api/courses", (req, res) => {
  const query = "SELECT * FROM courses";
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// API to fetch branches by course
app.get("/api/branches/:courseId", (req, res) => {
  const { courseId } = req.params; // Use the correct route parameter

  const query = "SELECT branchId, branchName FROM branches WHERE courseId = ?";
  db.query(query, [courseId], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length === 0) {
      return res
        .status(404)
        .send({ message: "No branches found for this course" });
    }

    res.json(results);
  });
});

// API to fetch semesters by branch
app.get("/api/semesters/:branchId", (req, res) => {
  const { branchId } = req.params; // Destructure branchId from the route parameter
  const query = "SELECT * FROM semesters WHERE branchId = ?";

  db.query(query, [branchId], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length === 0) {
      return res
        .status(404)
        .send({ message: "No semesters found for this branch" });
    }

    res.json(results);
  });
});

// API to fetch subjects by semester
app.get("/api/subjects/:semesterId", (req, res) => {
  const { semesterId } = req.params; // Destructure semesterId from the route parameter
  const query = "SELECT * FROM subjects WHERE semesterId = ?";

  db.query(query, [semesterId], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length === 0) {
      return res
        .status(404)
        .send({ message: "No subjects found for this semester" });
    }

    res.json(results);
  });
});

// API to fetch subjects-name by subjectId
app.get("/api/subject-name/:subjectId", (req, res) => {
  const { subjectId } = req.params; // Destructure semesterId from the route parameter
  const query = "SELECT subjectName FROM subjects WHERE subjectId = ?";

  db.query(query, [subjectId], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length === 0) {
      return res
        .status(404)
        .send({ message: "No subjects found for this semester" });
    }

    res.json(results);
  });
});

// =================================================
app.get('/api/chapter/:subjectId', (req, res) => {
  const { subjectId } = req.params; 
  // Fetch topics from the database
  // db.query('SELECT id,topic FROM topics WHERE subjectId = ?', [subjectId], (err, results) => {
  db.query('SELECT id,chapter FROM chapter WHERE subjectId = ? ORDER BY `order`', [subjectId], (err, results) => {
    if (err) {
      console.error('Error fetching topics:', err); // Log the error
      return res.status(500).send('Error fetching topics');
    }
    // Send the topics as a JSON response
    res.json({ chapter: results });
  });
});
app.get('/api/topics/:chapterId', (req, res) => {
  const { chapterId } = req.params;  
  // Fetch topics from the database
  db.query('SELECT id,topic FROM topics WHERE chapterId = ? ORDER BY `order`', [chapterId], (err, results) => {
    if (err) {
      console.error('Error fetching topics:', err); // Log the error
      return res.status(500).send('Error fetching topics');
    }
    // Send the topics as a JSON response
    res.json({ topics: results });
  });
});

app.get('/api/subtopics/:topicId', async (req, res) => {
  const { topicId } = req.params;
  // console.log('Topic IDs:', topicId);

  try {
    const results = await new Promise((resolve, reject) => {
      db.query('SELECT id,subTopic FROM subtopics WHERE topicId = ? ORDER BY `order`', [topicId], (err, results) => {
        // console.log('Fetched Subtopics:', results);
        if (err) {
          console.error('Error fetching subtopics:', err);
          return reject(err);
        }
        resolve(results);
      });
    });

    if (results.length === 0) {
      return res.status(404).send('No subtopics found for this topic ID');
    }

    res.json(results);
  } catch (error) {
    console.error('Error fetching subtopics:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/content/:subtopicName', async (req, res) => {
  try {
    const { subtopicName } = req.params;
    // Execute the database query
    const content = await new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM links WHERE subTopicId = ?',
        [subtopicName],
        (err, results) => {
          if (err) {
            console.error('Database query error:', err);
            return reject(err);
          }
          resolve(results);
        }
      );
    });


    // Check if content is empty
    if (content.length === 0) {
      return res.status(404).send('No content found for this subtopic');
    }

    // Extract IDs from the content
    const ids = content.map(item => item.title);
    
    // Send the grouped content as a JSON response
    res.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).send(`Error fetching content: ${error.message}`);
  }
});




// ================================================================
// this is for livechanneltime fetch topic data 

app.get('/api/topics', async (req, res) => {
  const { subjectId } = req.query;  // Extract subjectId from query parameters
  // console.log('Subject ID:', subjectId);

  // Validate if subjectId is provided
  if (!subjectId) {
    return res.status(400).json({ message: 'Subject ID is required' });
  }

  try {
    // Use a promise-based approach to fetch topics
    db.query('SELECT DISTINCT topic,id FROM topics WHERE subjectId = ?', [subjectId], (err, results) => {
      //console.log('Fetched Topics:', results);
      if (err) {
        // console.error('Error fetching topics:', err);
        return res.status(500).json({ message: 'Error fetching topics', error: err.message });
      }

      // Check if topics are found
      if (results.length === 0) {
        return res.status(404).json({ message: 'No topics found for the given Subject ID' });
      }

      // Send the fetched topics back to the client
      res.status(200).json(results); // Ensure only the results are sent
    });
  } catch (error) {
    console.error('Unexpected error fetching topics:', error);
    res.status(500).json({ message: 'An unexpected error occurred', error: error.message });
  }
});
//===============================================================
// this is for livechanneltime fetch subtopic data 

app.get("/api/subtopics", (req, res) => {
  const { topicId } = req.query;

  if (!topicId) {
      return res.status(400).json({ error: "topicId is required" });
  }

  const query = "SELECT subTopic,id FROM subtopics WHERE topicId = ?";

  db.query(query, [topicId], (err, results) => {
      if (err) {
          console.error("Error fetching subtopics:", err);
          return res.status(500).json({ error: "Database error" });
      }

      res.json(results);
  });
});

// ================================================================
// Home Route
app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});
// const { authenticateToken } = require("./Registration/Register");
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});