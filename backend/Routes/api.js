// routes/api.js
const express = require("express");
const chatbot = require("../controllers/chatbot");

const router = express.Router();

router.post("/chat", async (req, res) => {
 const { message } = req.body;
  const response = await chatbot(message);
  res.json({ response });
});

module.exports = router;