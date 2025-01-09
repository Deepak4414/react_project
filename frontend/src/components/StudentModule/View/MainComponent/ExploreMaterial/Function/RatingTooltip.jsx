import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../../Css/RatingTooltip.css";

const RatingTooltip = ({ itemId, username }) => {
  const [ratingDistribution, setRatingDistribution] = useState([0, 0, 0, 0, 0]);
  const [totalRatings, setTotalRatings] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  // Fetch rating distribution and calculate overall rating
  useEffect(() => {
    const fetchRatingDistribution = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/rating/${itemId}`,
          {
            params: { username },
          }
        );
        const distribution = response.data;
        setRatingDistribution(distribution);

        // Calculate total ratings and average rating
        const total = distribution.reduce((acc, count) => acc + count, 0);
        const average =
          distribution.reduce(
            (acc, count, index) => acc + count * (index + 1),
            0
          ) / (total || 1);

        setTotalRatings(total);
        setAverageRating(average.toFixed(1));
      } catch (error) {
        console.error("Error fetching rating distribution:", error);
      }
    };

    fetchRatingDistribution();
  }, [itemId, username]);

  const renderBarGraph = () => {
    return (
      <div className="rating-bar-graph">
        {ratingDistribution.map((count, index) => {
          const percentage = ((count / (totalRatings || 1)) * 100).toFixed(1);
          return (
            <div key={index} className="rating-bar-item">
              <div className="rating-bar-label">{index+1} star</div>
              <div className="rating-bar">
                <div
                  className="rating-bar-fill"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="rating-bar-percentage">{percentage}%</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="rating-tooltip">
      <div className="tooltip-text">
        <h3 className="rating-overall">
          {averageRating} out of 5 ({totalRatings} ratings)
        </h3>
        {renderBarGraph()}
      </div>
      <span className="hoverable-stars">
        {"⭐".repeat(Math.round(averageRating)) || "N/A"}
      </span>
    </div>
  );
};

export default RatingTooltip;
