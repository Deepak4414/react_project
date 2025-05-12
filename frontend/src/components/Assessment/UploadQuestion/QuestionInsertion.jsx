import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import './QuestionInsertion.css';

const QuestionInsertion = () => {
  const { state } = useLocation();
  const { course, branch, semester, subject } = state || {};
  
  const [globalSubject, setGlobalSubject] = useState(subject || '');
  const [globalTopic, setGlobalTopic] = useState('');
  const [globalSubtopic, setGlobalSubtopic] = useState('');
  
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      difficulty: 'basic',
      options: Array(4).fill().map(() => ({ text: '', isCorrect: false, explanation: '' }))
    }
  ]);

  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/subjects/${subject}`);
        setSubjects(res.data);
        
        if (subject) {
          const topicsRes = await axios.get(`http://localhost:5000/api/topics?subjectId=${subject}`);
          setTopics(topicsRes.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [subject]);

  const handleSubjectChange = async (e) => {
    const subjectId = e.target.value;
    setGlobalSubject(subjectId);
    setGlobalTopic('');
    setGlobalSubtopic('');
    
    try {
      const res = await axios.get(`http://localhost:5000/api/topics?subjectId=${subjectId}`);
      setTopics(res.data);
      setSubtopics([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTopicChange = async (e) => {
    const topicId = e.target.value;
    setGlobalTopic(topicId);
    setGlobalSubtopic('');
    
    try {
      const res = await axios.get(`http://localhost:5000/api/subtopics?topicId=${topicId}`);
      setSubtopics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex][field] = value;
    
    // If this is the isCorrect field being set to true, ensure only one option is correct
    if (field === 'isCorrect' && value) {
      updatedQuestions[questionIndex].options.forEach((opt, idx) => {
        if (idx !== optionIndex) opt.isCorrect = false;
      });
    }
    
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        difficulty: 'basic',
        options: Array(4).fill().map(() => ({ text: '', isCorrect: false, explanation: '' }))
      }
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    
    try {
      // Validate global fields
      if (!globalSubject || !globalTopic || !globalSubtopic) {
        throw new Error('Please select Subject, Topic and Subtopic for all questions');
      }
      
      // Validate each question
      for (const question of questions) {
        if (!question.questionText) {
          throw new Error('Question text is required for all questions');
        }
        
        if (question.options.length !== 4) {
          throw new Error('Each question must have exactly 4 options');
        }
        
        const correctOptions = question.options.filter(opt => opt.isCorrect);
        if (correctOptions.length !== 1) {
          throw new Error('Each question must have exactly one correct option');
        }
        
        for (const option of question.options) {
          if (!option.text) {
            throw new Error('All option texts must be filled');
          }
        }
      }
      
      // Prepare questions with global fields
      const questionsToSubmit = questions.map(question => ({
        ...question,
        subject: globalSubject,
        topic: globalTopic,
        subtopic: globalSubtopic
      }));
      
      await axios.post('http://localhost:5000/api/questions/bulk', { questions: questionsToSubmit });
      setMessage(`${questions.length} questions added successfully under selected subtopic!`);
      
      // Reset form with one empty question (keeping subject/topic/subtopic)
      setQuestions([
        {
          questionText: '',
          difficulty: 'basic',
          options: Array(4).fill().map(() => ({ text: '', isCorrect: false, explanation: '' }))
        }
      ]);
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || 'Error adding questions');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="question-insertion-container">
      <h2>Add New Questions</h2>
      {message && <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>{message}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="global-fields">
          <div className="form-group">
            <label>Subject:</label>
            <select 
              value={globalSubject} 
              onChange={handleSubjectChange}
              required
            >
              <option value="">Select Subject</option>
              {subjects.map(subj => (
                <option key={subj.subjectId} value={subj.subjectId}>{subj.subjectName}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Topic:</label>
            <select 
              value={globalTopic} 
              onChange={handleTopicChange}
              disabled={!globalSubject}
              required
            >
              <option value="">Select Topic</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>{topic.topic}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Subtopic:</label>
            <select 
              value={globalSubtopic} 
              onChange={(e) => setGlobalSubtopic(e.target.value)}
              disabled={!globalTopic}
              required
            >
              <option value="">Select Subtopic</option>
              {subtopics.map(subtopic => (
                <option key={subtopic.id} value={subtopic.id}>{subtopic.subTopic}</option>
              ))}
            </select>
          </div>
        </div>

        {questions.map((question, qIndex) => (
          <div key={qIndex} className="question-group">
            <div className="question-header">
              <h3>Question #{qIndex + 1}</h3>
              {questions.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeQuestion(qIndex)}
                  className="remove-question-btn"
                >
                  Remove Question
                </button>
              )}
            </div>
            
            <div className="form-group">
              <label>Question Text:</label>
              <textarea 
                value={question.questionText}
                onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Difficulty:</label>
              <select 
                value={question.difficulty}
                onChange={(e) => handleQuestionChange(qIndex, 'difficulty', e.target.value)}
              >
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="options-section">
              <h4>Options (Mark one as correct)</h4>
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="option-item">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, 'text', e.target.value)}
                    placeholder={`Option ${oIndex + 1}`}
                    required
                  />
                  <label className="correct-option-label">
                    <input
                      type="radio"
                      name={`correctOption-${qIndex}`}
                      checked={option.isCorrect}
                      onChange={() => handleOptionChange(qIndex, oIndex, 'isCorrect', true)}
                    />
                    Correct Answer
                  </label>
                  <textarea
                    value={option.explanation}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, 'explanation', e.target.value)}
                    placeholder="Explanation for this option"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="form-actions">
          <button type="button" onClick={addQuestion} className="add-question-btn">
            Add Another Question
          </button>
          <button type="submit" disabled={isSubmitting || !globalSubject || !globalTopic || !globalSubtopic}>
            {isSubmitting ? 'Saving...' : 'Save All Questions'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionInsertion;