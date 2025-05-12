// routes/api.js
const express = require("express");
const chatbot = require("../controllers/chatbot");

const router = express.Router();

router.post("/chat", async (req, res) => {
  const subtopicName = "For loop in C";
  const level = "easy";
  const { message } = req.body;
  console.log("Received message:", message);
  if (message === undefined || message === null || message.trim() === "") {
    prompts = subtopicName;
  } else {
    prompts = message;
  }
  const response = await chatbot(prompts, level);
  res.json({ response });
});

module.exports = router;
