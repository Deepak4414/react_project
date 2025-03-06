import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../../Css/RatingTooltip.css";
import RatingModel from "../../../SubComponent/RatingModal";

const Rating = ({ item, username }) => {
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [existingRating, setExistingRating] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExistingRating = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/fetch-rating/${item}/${username}`
                );
                if (response.status === 200) {
                    setExistingRating(response.data.rating);
                } else {
                    setError(`Failed to fetch existing rating: ${response.statusText}`);
                }
            } catch (error) {
                setError();
            }
        };
        fetchExistingRating();
    }, [item, username]);

    const handleRatingSubmit = async (e, itemId) => {
        e.preventDefault();
        const ratingValue = e.target.ratingValue.value;

        // Validate rating value
        if (ratingValue < 1 || ratingValue > 5) {
            setError("Invalid rating value. Please enter a value between 1 and 5.");
            return;
        }

        try {
            if (existingRating) {
                // Update existing rating
                const response = await axios.put(`http://localhost:5000/api/rating/${itemId}/${username}`, {
                    rating: ratingValue,
                });

                if (response.status === 200) {
                    setFeedbackMessage(`Rating for item ${itemId} updated to ${ratingValue} stars!`);
                } else {
                    setError(`Failed to update rating: ${response.statusText}`);
                }
            } else {
                // Create new rating
                const response = await axios.post("http://localhost:5000/api/rating", {
                    itemId,
                    username,
                    rating: ratingValue,
                });

                if (response.status === 200) {
                    setFeedbackMessage(`Thank you for rating item ${itemId} as ${ratingValue} stars!`);
                } else {
                    setError(`Failed to submit rating: ${response.statusText}`);
                }
            }
        } catch (error) {
            setError(`Error submitting rating: ${error.message}`);
        }

        e.target.reset(); // Reset the form after submission
    };

    return (
        <div className="rating-component">
            <form
                onSubmit={(e) => handleRatingSubmit(e, item)}
                className="rating-form"
            >
                <label htmlFor={`ratingValue-${item}`}>User`s Rating:</label>
                <br />
                <input
                    type="number"
                    id={`ratingValue-${item}`}
                    name="ratingValue"
                    min="1"
                    max="5"
                    required
                    className="rating-input"
                    defaultValue={existingRating || ""}
                />
                <button type="submit" className="rating-submit-btn">
                    {existingRating ? "Update" : "Submit"}
                </button>
            </form>
            {feedbackMessage && (
                <p className="rating-feedback">
                    {feedbackMessage}
                    <RatingModel />
                </p>
            )}
            {error && (
                <p className="rating-error">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Rating;