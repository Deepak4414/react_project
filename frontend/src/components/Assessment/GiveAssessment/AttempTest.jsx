import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AttempTest.css';

const AttemptTest = ({ subtopic, topicId, subject, username }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <button className="attempt-test-button" onClick={openModal}>
                Attempt Test
            </button>
            
            {isModalOpen && (
                <TestModal
                    closeModal={closeModal}
                    subtopic={subtopic}
                    topicId={topicId}
                    subject={subject}
                    username={username}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    error={error}
                    setError={setError}
                />
            )}
        </>
    );
};

const TestModal = ({ closeModal, ...props }) => {
    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={closeModal}>
                    &times;
                </button>
                <TestContent {...props} closeModal={closeModal} />
            </div>
        </div>
    );
};

const TestContent = ({ 
    closeModal,
    subtopic,
    username,
    setIsLoading,
    setError
}) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(null);
    const [showReview, setShowReview] = useState(false);
    const [questions, setQuestions] = useState([]);
    useEffect(() => {
        const fetchQuestions = async () => {
            setIsLoading(true);
            setError(null);
            try {
              console.log(subtopic);
                const response = await axios.get('http://localhost:5000/api/questions', {
                    params: { subtopicId: subtopic }
                });
                console.log(response.data);
                setQuestions(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load questions');
                console.error('Error fetching questions:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (subtopic) {
            fetchQuestions();
        }
    }, [subtopic, setIsLoading, setError]);

    const handleAnswer = (questionId, option) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const calculateScore = () => {
        let correct = 0;
        questions.forEach(question => {
            const selectedOption = answers[question.id];
            if (selectedOption) {
                const isCorrect = question.options.find(
                    opt => opt.optionText === selectedOption
                )?.isCorrect;
                if (isCorrect) correct++;
            }
        });
        return Math.round((correct / questions.length) * 100);
    };

    const handleSubmit = async () => {
        const finalScore = calculateScore();
        setScore(finalScore);
        setIsSubmitted(true);
        
        try {
            await axios.post('/api/test-results', {
                username,
                subtopicId: subtopic.id,
                score: finalScore,
                responses: answers
            });
        } catch (err) {
            console.error('Error saving test results:', err);
            // Continue even if saving results fails - it's not critical for the user
        }
    };

    const toggleReview = () => {
        setShowReview(!showReview);
    };

    const getAnswerStatus = (question) => {
        const selectedOption = answers[question.id];
        if (!selectedOption) return 'unanswered';
        
        const isCorrect = question.options.find(
            opt => opt.optionText === selectedOption
        )?.isCorrect;
        
        return isCorrect ? 'correct' : 'incorrect';
    };

    const getCorrectAnswer = (question) => {
        return question.options.find(opt => opt.isCorrect)?.optionText || 'No correct answer marked';
    };

    if (!subtopic) {
        return <div className="test-content">No subtopic selected</div>;
    }

    // if (isLoading) {
    //     return <div className="test-content">Loading questions...</div>;
    // }

    // if (error) {
    //     return <div className="test-content error-message">{error}</div>;
    // }

    if (questions.length === 0 ) {
        return <div className="test-content">Assisment not Available for this Subtopic</div>;
    }

    return (
        <div className="test-content">
            <h2>Test: {subtopic.subTopic}</h2>
        
            {!isSubmitted ? (
                <div className="question-container">
                    <div className="progress-indicator">
                        Question {currentQuestion + 1} of {questions.length}
                    </div>
                    
                    <div className="question-card">
                        <h3>{questions[currentQuestion]?.questionText}</h3>
                        
                        <div className="options-list">
                            {questions[currentQuestion]?.options?.map((option, index) => (
                                <label key={option.id} className="option-item">
                                    <input
                                        type="radio"
                                        name={`question-${questions[currentQuestion].id}`}
                                        value={option.optionText}
                                        checked={answers[questions[currentQuestion].id] === option.optionText}
                                        onChange={() => handleAnswer(questions[currentQuestion].id, option.optionText)}
                                    />
                                    <span>{option.optionText}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="navigation-buttons">
                        <button 
                            onClick={handlePrevious} 
                            disabled={currentQuestion === 0}
                            className="nav-btn prev-btn"
                        >
                            Previous
                        </button>
                        
                        {currentQuestion < questions.length - 1 ? (
                            <button 
                                onClick={handleNext}
                                className="nav-btn next-btn"
                            >
                                Next
                            </button>
                        ) : (
                            <button 
                                onClick={handleSubmit} 
                                className="nav-btn submit-btn"
                                disabled={Object.keys(answers).length < questions.length}
                            >
                                Submit Test
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="results-container">
                    <h3>Test Completed!</h3>
                    <div className="score-display">
                        Your score: <span className={score >= 70 ? "high-score" : "low-score"}>{score}%</span>
                    </div>
                    
                    <div className="review-actions">
                        <button 
                            onClick={toggleReview} 
                            className="review-btn"
                        >
                            {showReview ? 'Hide Answers' : 'Review Answers'}
                        </button>
                        <button onClick={closeModal} className="close-results-btn">
                            Close Test
                        </button>
                    </div>
                    
                    {showReview && (
                        <div className="answers-review">
                            {questions.map((question, index) => (
                                <div 
                                    key={question.id} 
                                    className={`review-item ${getAnswerStatus(question)}`}
                                >
                                    <h4>Question {index + 1}: {question.questionText}</h4>
                                    <p>Your answer: {answers[question.id] || 'Not answered'}</p>
                                    <p>Correct answer: {getCorrectAnswer(question)}</p>
                                    {question.options.find(opt => opt.optionText === answers[question.id])?.explanation && (
                                        <p className="explanation">
                                            {question.options.find(opt => opt.optionText === answers[question.id])?.explanation}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AttemptTest;