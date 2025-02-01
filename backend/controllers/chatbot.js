// controllers/chatbot.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const pool = require("../config/db");
require("dotenv").config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function chatbot(query) {
  let connection;
  try {
    // Connect to the database
    connection = await pool.getConnection();

    // Query the database for relevant data
    const sqlQuery = `
    SELECT 
  c.courseName AS course,
  b.branchName AS branch,
  s.semesterName AS semester,
  sub.subjectName AS subject,
  t.topic AS topic,
  st.subTopic AS subtopic,
  l.title AS link_title,
  l.link AS link_url,
  l.description AS link_description,
  l.level AS link_level
FROM 
  courses c
JOIN 
  branches b ON c.courseId = b.courseId
JOIN 
  semesters s ON b.branchId = s.branchId
JOIN 
  subjects sub ON s.semesterId = sub.semesterId AND b.branchId = sub.branchId
JOIN 
  topics t ON sub.subjectId = t.subjectId AND c.courseId = t.courseId AND b.branchId = t.branchId AND s.semesterId = t.semesterId
JOIN 
  subtopics st ON t.id = st.topicId
LEFT JOIN 
  links l ON st.id = l.subTopicId
ORDER BY 
  c.courseName, b.branchName, s.semesterName, sub.subjectName, t.topic, st.subTopic
  `;

    const [results] = await connection.query(sqlQuery, [
      `%${query}%`,
      `%${query}%`,
    ]);

    // Prepare the context for the AI model
    const context = results
      .map(
        (result) =>
          `Subject: ${result.subject}, Subtopic: ${result.subtopic}, Link: ${result.link_url}, Description: ${result.link_description}, NPTEL Video: ${result.nptel_video}, Rating: ${result.avg_rating}`
      )
      .join("\n");

    // Generate AI response using Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
    You are a highly knowledgeable AI assistant. Answer the user's query as accurately as possible.

    If the query relates to C programming, prioritize the following database context:
    ${context || "No relevant database data available."}

    However, if the query is general knowledge or outside the database scope, use your own knowledge to provide an accurate answer.

    User Query:
    ${query}
    `;

    const result = await model.generateContent(prompt);
    // console.log(result.response.text());
    const response = await result.response.text();

    // Return the AI-generated response
    return response;
  } catch (error) {
    console.error("Chatbot error:", error);
    return "Sorry, I encountered an error while processing your request.";
  } finally {
    if (connection) connection.release();
  }
}

module.exports = chatbot;
