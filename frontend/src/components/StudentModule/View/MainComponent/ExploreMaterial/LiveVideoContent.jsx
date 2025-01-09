import React from "react";
import Rating from './Function/Rating';

const LiveVideoContent = () => {
  const liveVideoContent = [
    { id: 1, title: "Live Video Session 1", description: "Introduction to React", link: "https://live.com/video1", rating: 4 },
    { id: 2, title: "Live Video Session 2", description: "Advanced JavaScript Concepts", link: "https://live.com/video2", rating: 5 },
    { id: 3, title: "Live Video Session 3", description: "Node.js Basics", link: "https://live.com/video3", rating: 3 },
  ];

  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const renderCardContent = (item) => (
    <div key={item.id} className="card mb-3">
      <div className="card-body">
        <h3
          className="card-title"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {truncateText(item.title || "No Title Available", 50)}
        </h3>
        <p className="card-text">
          {truncateText(item.description || "No Description Available", 1000)}
        </p>
        <p>Rating: {"⭐".repeat(item.rating) || "N/A"}</p>
        {
          <img
            src="/image/live_video.png"
            alt="YouTube"
            className="youtube-logo"
            onClick={() => (item.link)}
          />
         }
        <Rating item={item.id} />
      </div>
    </div>
  );

  return (
    <div>
      {liveVideoContent.map(renderCardContent)}
    </div>
  );
};

export default LiveVideoContent;
