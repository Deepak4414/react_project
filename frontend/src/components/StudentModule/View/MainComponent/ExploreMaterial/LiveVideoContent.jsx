import React, { useEffect, useState } from "react";
import axios from "axios";

const LiveVideoContent = ({ subtopic, topicId }) => {
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/live-data`, {
          params: { topicId, subtopic },
        });

        setLiveData(response.data); // Update liveData with the response data
      } catch (err) {
        setError();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topicId, subtopic]);

  // Function to format date to DD/MM/YYYY
  const formatDate = (isoDate) => {
    const dateObj = new Date(isoDate);
    const day = String(dateObj.getDate()).padStart(2, "0"); // Ensure 2 digits
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.response?.data?.message || error.message}</div>;
  }

  if (!liveData) {
    return <div><img src="/image/cdot_logo.png" alt="Live Logo" style={{ width: "80px", height: "80px" }} />
    <p>No Suggested Session available.</p>
    </div>;
  }

  return (
    <div>
      <a href="http://192.168.68.10:9080">
        <img src="/image/cdot_logo.png" alt="Live Logo" style={{ width: "80px", height: "80px" }} />
      </a>
      <p>
        It is Available on <strong>{liveData.channel}</strong> channel at{" "}
        <strong>{liveData.time}</strong> on <strong>{formatDate(liveData.date)}</strong>.
        <br />
        <br />
        <strong>Level:</strong>{" "}
      <span style={{ textDecoration: liveData.level === "basic" ? "none" : "line-through" }}>
        Basic
      </span>{" "}
      <span style={{ textDecoration: liveData.level === "intermediate" ? "none" : "line-through" }}>
        Intermediate
      </span>{" "}
      <span style={{ textDecoration: liveData.level === "advanced" ? "none" : "line-through" }}>
        Advanced
      </span>
    </p>
    </div>
  );
};

export default LiveVideoContent;
