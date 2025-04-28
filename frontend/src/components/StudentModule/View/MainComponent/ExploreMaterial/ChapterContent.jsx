import React, { useState } from "react";
import "./Table.css";
import "../../../Css/VideoModal.css";
import Rating from './Function/Rating';
import NptelContent from "./NptelContent";
import RatingTooltip from "./Function/RatingTooltip";
import LiveVideoContent from "./LiveVideoContent";


const VideoModal = ({ videoUrl, onClose }) => {
  return (
    <div className="video-modal">
      <div className="video-modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <iframe
          width="560"
          height="315"
          src={videoUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

const ChapterContent = ({ subTopicData, username, id, topicId }) => {
  // console.log(subTopicData, username, id, topicId);
  const [videoUrl, setVideoUrl] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const { title, levels } = subTopicData;

  const isYouTubeLink = (link) => {
    return link && (link.includes("youtube.com") || link.includes("youtu.be"));
  };

  const handleYouTubeClick = (link) => {
    const embedUrl = link.includes("youtube.com")
      ? link.replace("watch?v=", "embed/")
      : link.replace("youtu.be/", "www.youtube.com/embed/");
    setVideoUrl(embedUrl);
  };

  const closeModal = () => {
    setVideoUrl(null);
  };

  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

 
  const colortext = (text) => {
    // Step 1: Clean `:-`, `: -`, `: -,` patterns to just `:`
    let cleanedText = text
      .replace(/:\s*-\s*,?/g, '')  // remove ": -", ":-", ": -,"
      .replace(/,\s+/g, ',');      // remove space after commas
  
    // Step 2: Define regex for timestamps
    const timestampRegex = /\[?\d{1,2}:\d{2}(?:\s*-\s*\d{1,2}:\d{2})?\]?/g;
  
    // Step 3: Split into parts around timestamps
    const parts = cleanedText
      .split(/(\[?\d{1,2}:\d{2}(?:\s*-\s*\d{1,2}:\d{2})?\]?)/g)
      .map(part => part.trim())
      .filter(Boolean);
  
    const listItems = [];
  
    // Step 4: Format each topic + tooltip inside <li>
    for (let i = 0; i < parts.length; i++) {
      const current = parts[i];
      const next = parts[i + 1];
  
      if (current.match(timestampRegex)) continue;
  
      if (next && next.match(timestampRegex)) {
        const timestamp = next.replace(/[\[\]]/g, '').trim();
  
        listItems.push(
          <li key={i} className="tooltip-container" >
            <span className="tooltip-trigger">{current}</span>
            <span className="tooltip-box">{timestamp} min.</span>
          </li>
        );
  
        i++; // Skip timestamp
      } else {
        listItems.push(<li key={i}>{current}</li>);
      }
    }
  
    return <ul>{listItems}</ul>;
  };
  

  const renderCardContent = (item) => (
    <div key={item.id} className="card mb-1" style={{ width: '250px' }}>
      <div className="card-body" style={{ padding: '10px' }}>
        <h3
          className="card-title"
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          {isYouTubeLink(item.link) ? (
            <span>
              {truncateText(item.title || "No Title Available", 10000)}{" "}
              <img
                src="/image/youtube_logo.png"
                alt="YouTube"
                className="youtube-logo"
                onClick={() => handleYouTubeClick(item.link)}
                style={{ cursor: "pointer" }}
              />
            </span>
          ) : (
            <span>
              {truncateText(item.title || "No Title Available", 10000)}{" "}


              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm"
              >
                <img
                  src="/image/link_logo.png"
                  alt="Link"
                  className="me-2"
                  style={{ width: "30px", cursor: "pointer" }}
                />
              </a>
            </span>
          )}
        </h3>
        <p className="card-text" style={{ fontSize: '14px' }}>
          {colortext(item.description || "No Description Available")}
        </p>
        <p>
          Rating:{" "}
          <RatingTooltip
            itemId={item.id}
            username={username.username}
            rating={item.rating || 0}
          />
        </p>
        <Rating item={item.id} username={username.username} />
      </div>
    </div>
  );
  return (
    <div className="containers">
  <div className="chapter">
    <div className="topic">
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr >
            <th colSpan={3} style={{ textAlign: 'center', width: '48%', fontSize: '20px'}}> E-Content from Internet</th>
            <th rowSpan={2} style={{ textAlign: 'center', width: '16%',lineHeight: '3' }}>Content from local server
            NPTEL and VFSTR Content
            </th>
            <th rowSpan={2} style={{ textAlign: 'center', width: '16%', fontSize: '14px'}}>Live Video from local C-DoT BBG</th>
          </tr>

          <tr>
            <th style={{ textAlign: 'center',width: '16%',lineHeight: '3'}}>Basic Level</th>
            <th style={{ textAlign: 'center',width: '16%',lineHeight: '3' }}>Intermediate Level</th>
            <th style={{ textAlign: 'center',width: '16%',lineHeight: '3' }}>Advanced Level</th>
            {/* <th style={{ width: '16%',textAlign:'left'  }}>NPTEL and VFSTR Content</th> */}

          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ width: '16%' }}>
              {levels.basic && levels.basic.length > 0 ? (
                levels.basic.map(renderCardContent)
              ) : (
                <p  style={{ width: '250px' }}>No Basic Level Content Available</p>
              )}
            </td>
            <td style={{ width: '16%' }}>
              {levels.medium && levels.medium.length > 0 ? (
                levels.medium.map(renderCardContent)
              ) : (
                <p  style={{ width: '250px' }}>No Medium Level Content Available</p>
              )}
            </td>
            <td style={{ width: '16%' }}>
              {levels.advanced && levels.advanced.length > 0 ? (
                levels.advanced.map(renderCardContent)
              ) : (
                <p style={{ width: '250px' }}>No Advanced Level Content Available</p>
              )}
            </td>
            <td style={{ width: '16%' }}>
              <NptelContent subtopic={id} />

            </td>
            <td style={{ width: '16%' }}>

              <LiveVideoContent subtopic={id} topicId={topicId} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  {videoUrl && <VideoModal videoUrl={videoUrl} onClose={closeModal} />}
  {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
</div>  );
};

export default ChapterContent;
