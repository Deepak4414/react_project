import React, { useState } from 'react';
import axios from 'axios';
import '../../../../Css/RatingTooltip.css';
import RatingModel from '../../../SubComponent/RatingModal';
const Rating = ({ item, username }) => {
    const [feedbackMessage, setFeedbackMessage] = useState("");
    
    const handleRatingSubmit = async (e, itemId) => {
        e.preventDefault();
        const ratingValue = e.target.ratingValue.value;

        try {
            const response = await axios.post('http://localhost:5000/api/rating', {
                itemId,
                username,
                rating: ratingValue,
            });

            if (response.status === 200) {
                setFeedbackMessage(`Thank you for rating item ${itemId} as ${ratingValue} stars!`);
            } else {
                setFeedbackMessage("Failed to submit rating. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting rating:", error);
            if (error.response && error.response.status === 400) {
                setFeedbackMessage('You have already rated this item');
            } else {
                setFeedbackMessage('An error occurred. Please try again.');
            }
        }

        e.target.reset(); // Reset the form after submission
    };

    return (
        <div className="rating-component">
            <form
                onSubmit={(e) => handleRatingSubmit(e, item)}
                className="rating-form"
            >
                <label htmlFor={`ratingValue-${item}`}>
                    My Rating:
                </label>
                <br />  
                <input
                    type="number"
                    id={`ratingValue-${item}`}
                    name="ratingValue"
                    min="1"
                    max="5"
                    required
                    className="rating-input"
                />
                <button type="submit" className="rating-submit-btn">
                    Submit
                </button>
            </form>
            {feedbackMessage && <p className="rating-feedback">{feedbackMessage}<RatingModel/></p>}
        </div>
    );
};

export default Rating;
