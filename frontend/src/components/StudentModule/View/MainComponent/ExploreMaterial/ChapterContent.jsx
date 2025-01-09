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

const ChapterContent = ({ subTopicData, username, id }) => {
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

  const renderCardContent = (item) => (
    <div key={item.id} className="card mb-3" style={{ width: '300px' }}>
      <div className="card-body" style={{ padding: '10px' }}>
        <h3
          className="card-title"
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {truncateText(item.title || "No Title Available", 100)}{" "}
          {isYouTubeLink(item.link) ? (
            <>
              <img
                src="/image/youtube_logo.png"
                alt="YouTube"
                className="youtube-logo"
                onClick={() => handleYouTubeClick(item.link)}
                style={{ marginLeft: "10px", cursor: "pointer" }} // Added margin for spacing
              />
            </>
          ) : (
            item.link && (
              <div className="d-flex align-items-center" style={{ marginLeft: "10px" }}> {/* Added margin for spacing */}
                <img
                  src="/image/link_logo.png"
                  alt="Link"
                  className="me-2"
                  style={{ width: "24px", cursor: "pointer" }}
                />
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  Link
                </a>
              </div>
            )
          )}
        </h3>
        <p className="card-text" style={{ fontSize: '14px' }}>
          {truncateText(item.description || "No Description Available", 1000)}
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
                <th colSpan={3} style={{ textAlign: 'center' }}> E Content from Internet</th>
                <th colSpan={1} style={{ textAlign: 'center' }}>Content from local server</th>
                <th></th>
              </tr>

              <tr>
                <th>Basic Level</th>
                <th>Intermediate Level</th>
                <th>Advanced Level</th>
                <th>NPTEL Content and VFSTR Content</th>
                <th>Live Video from local C.Dot BGC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {levels.basic && levels.basic.length > 0 ? (
                    levels.basic.map(renderCardContent)
                  ) : (
                    <p>No Basic Level Content Available</p>
                  )}
                </td>
                <td>
                  {levels.medium && levels.medium.length > 0 ? (
                    levels.medium.map(renderCardContent)
                  ) : (
                    <p>No Medium Level Content Available</p>
                  )}
                </td>
                <td>
                  {levels.advanced && levels.advanced.length > 0 ? (
                    levels.advanced.map(renderCardContent)
                  ) : (
                    <p>No Advanced Level Content Available</p>
                  )}
                </td>
                <td>
                  <NptelContent subtopic={id} />

                </td>
                <td>
                  <p>192.168.68.10:9080</p>

                  {/* <LiveVideoContent/> */}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {videoUrl && <VideoModal videoUrl={videoUrl} onClose={closeModal} />}
      {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
    </div>
  );
};

export default ChapterContent;
