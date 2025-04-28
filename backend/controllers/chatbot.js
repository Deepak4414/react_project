const fetch = require("node-fetch");
const pool = require("../config/db");
require("dotenv").config();

async function chatbot(query) {
  let connection;
  try {
    // Connect to the database
    connection = await pool.getConnection();

    // Get relevant context from DB
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

    const [results] = await connection.query(sqlQuery);
    // Prepare prompt context
    const context = results
      .map(
        (result) =>
          `Subject: ${result.subject}, Subtopic: ${result.subtopic}, Link: ${result.link_url}, Description: ${result.link_description}, Level: ${result.link_level}`
      )
      .join("\n");
    const prompt = `
You are a highly knowledgeable AI assistant. Answer the user's query as accurately as possible.

If the query relates to C programming, prioritize the following database context:
${context || "No relevant database data available."}

If the query is general or not covered in the context, use your knowledge to provide a helpful answer.

User Query:
${query}
    `;
    // Call Gemini REST API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
console.log("Gemini API response:", data.candidates?.[0]?.content?.parts?.[0]?.text);
    if (!response.ok) {
      console.error("Gemini API error:", data);
      throw new Error(data.error?.message || "Unknown error");
    }

    const resultText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't find a helpful answer.";

    return resultText;
  } catch (error) {
    console.error("Chatbot error:", error);
    return "Sorry, I encountered an error while processing your request.";
  } finally {
    if (connection) connection.release();
  }
}

module.exports = chatbot;
