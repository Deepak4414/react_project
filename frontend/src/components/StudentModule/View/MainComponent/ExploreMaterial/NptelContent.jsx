import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../Css/NptelContent.css";
import "./Table.css";
import VfstrVideo from "./VfstrVideo/VfstrVideo";

const NptelContent = ({ subtopic }) => {
  const [videos, setVideos] = useState([]);
  const [videoNames, setVideoNames] = useState([]);
  const [error, setError] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [title, setTitle] = useState([]);
  const [description, setDescription] = useState([]);
  const [selectedVideoName, setSelectedVideoName] = useState("");
  const [video_level, setVideoLevel] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/videos", {
          params: { subTopic: subtopic },
        });
        console.log(response.data);
        setVideos(response.data[1]);
        setVideoNames(response.data[2]);
        setTitle(response.data[3]);
        setDescription(response.data[4]);
        setVideoLevel(response.data[5]);
        setError("");
      } catch (err) {
        setVideos([]);
        setError("NPTEL videos not available for this subtopic");
      }
    };

    fetchVideos();
  }, [subtopic]);

  const openVideo = (videoPath, videoName) => {
    setSelectedVideo(videoPath);
    setSelectedVideoName(videoName);
  };

  const closeModal = () => {
    setSelectedVideo(null);
    setSelectedVideoName("");
  };

  const colortext = (text) => {
    let cleanedText = text
      .replace(/:\s*-\s*,?/g, '')
      .replace(/,\s+/g, ',');

    const timestampRegex = /\[?\d{1,2}:\d{2}(?:\s*-\s*\d{1,2}:\d{2})?\]?/g;
    const parts = cleanedText
      .split(/(\[?\d{1,2}:\d{2}(?:\s*-\s*\d{1,2}:\d{2})?\]?)/g)
      .map(part => part.trim())
      .filter(Boolean);

    const listItems = [];

    for (let i = 0; i < parts.length; i++) {
      const current = parts[i];
      const next = parts[i + 1];

      if (current.match(timestampRegex)) continue;

      if (next && next.match(timestampRegex)) {
        const timestamp = next.replace(/[\[\]]/g, '').trim();
        listItems.push(
          <li key={i} className="tooltip-container">
            <span className="tooltip-trigger">{current}</span>
            <span className="tooltip-box">{timestamp} min.</span>
          </li>
        );
        i++;
      } else {
        listItems.push(<li key={i}>{current}</li>);
      }
    }

    return <ul>{listItems}</ul>;
  };

  return (
    <div className="nptel-container" style={{ maxWidth: '1200px', margin: 'auto',minWidth: '250px' }}>
      {error && <p>{error}</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBlock: "10px" }}>
        {videos.map((videoPath, index) => (
          <div
            key={index}
            role="button"
            tabIndex={0}
            aria-label={`Play video titled ${title?.[index]}`}
            onClick={() => openVideo(videoPath, videoNames[index])}
            onKeyDown={(e) => e.key === 'Enter' && openVideo(videoPath, videoNames[index])}
            style={{
              width: "250px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              cursor: "pointer",
              textAlign: "center",
              backgroundColor: "#f9f9f9"
            }}
          >
            <h4 style={{ fontSize: '16px', fontWeight: "bold" }}>{title?.[index]}</h4>
            {/* description for nptel  */}
            <p style={{
               textAlign: "left", 
              }}
            >{colortext(description?.[index] || "")}</p>

            <img
              src="/image/image.png"
              alt={videoNames[index] || "Video"}
              style={{
                width: "60%",
                height: "auto",
                borderRadius: "4px",
                marginBottom: "10px"
              }}
            />
            <p>
              <strong>Level: </strong>
              <span style={{
                backgroundColor:
                  video_level[index] === "Basic" ? "#28a745" :
                  video_level[index] === "Intermediate" ? "#ffc107" :
                  "#dc3545",
                color: "white",
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "12px"
              }}>
                {video_level[index]}
              </span>
            </p>
          </div>
        ))}
      </div>

      <VfstrVideo subtopic={subtopic} />

      {selectedVideo && (
        <div className="nptel-modal-overlay">
          <div className="nptel-modal-content">
            <video
              width="500px"
              height="auto"
              controls
              style={{ border: "1px solid #ccc", borderRadius: "8px" }}
            >
              <source
                src={`http://localhost:5000/api/video?path=${encodeURIComponent(selectedVideo)}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <p><strong>Video Name:</strong> {selectedVideoName}</p>
            <button
              className="nptel-model-close"
              onClick={closeModal}
              style={{ marginTop: "10px" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NptelContent;