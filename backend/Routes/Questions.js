// routes/questions.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');



// API to bulk insert questions
router.post('/questions/bulk', async (req, res) => {
  const connection = await db.getConnection();
  try {
      await connection.beginTransaction();
      
      const { questions } = req.body;
      const insertedQuestions = [];
      
      for (const question of questions) {
          // Insert question
          const [result] = await connection.query(
              'INSERT INTO question (questionText, difficulty, subjectId, topicId, subtopicId) VALUES (?, ?, ?, ?, ?)',
              [question.questionText, question.difficulty, question.subject, question.topic, question.subtopic]
          );
          
          const questionId = result.insertId;
          insertedQuestions.push(questionId);
          
          // Insert options
          for (const option of question.options) {
              await connection.query(
                  'INSERT INTO `option` (questionId, optionText, isCorrect, explanation) VALUES (?, ?, ?, ?)',
                  [questionId, option.text, option.isCorrect, option.explanation]
              );
          }
      }
      
      await connection.commit();
      res.json({ 
          message: `${questions.length} questions added successfully`,
          questionIds: insertedQuestions
      });
  } catch (err) {
      await connection.rollback();
      console.error(err);
      res.status(500).json({ message: 'Error adding questions', error: err.message });
  } finally {
      connection.release();
  }
});

// API to get questions by subtopic
router.get('/questions', async (req, res) => {
  try {
      const { subtopicId } = req.query;
      
      if (!subtopicId) {
          return res.status(400).json({ message: 'subtopicId is required' });
      }

      // Get questions for this subtopic
      const [questions] = await db.query(`
          SELECT q.id, q.questionText, q.difficulty 
          FROM question q 
          WHERE q.subtopicId = ?
      `, [subtopicId]);

      // For each question, get its options
      for (const question of questions) {
          const [options] = await db.query(`
              SELECT id, optionText, isCorrect, explanation 
              FROM \`option\` 
              WHERE questionId = ?
          `, [question.id]);
          question.options = options;
      }

      res.json(questions);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
});

// API to submit test results
router.post('/test-results', async (req, res) => {
  try {
      const { username, subtopicId, score, responses } = req.body;
      
      await db.query(`
          INSERT INTO test_results 
          (username, subtopicId, score, responses, testDate) 
          VALUES (?, ?, ?, ?, NOW())
      `, [username, subtopicId, score, JSON.stringify(responses)]);

      res.json({ message: 'Test results saved successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error saving test results' });
  }
});

module.exports = router;