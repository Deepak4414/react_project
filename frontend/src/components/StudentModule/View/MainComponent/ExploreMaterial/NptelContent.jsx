import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../Css/NptelContent.css";

const NptelContent = ({ subtopic }) => {
  const [videos, setVideos] = useState([]);
  const [videoNames, setVideoNames] = useState([]);
  const [error, setError] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedVideoName, setSelectedVideoName] = useState("");
  const [video_level, setVideoLevel] = useState([]);
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/videos", {
          params: { subTopic: subtopic },
        });
        setVideos(response.data[0]);
        setVideoNames(response.data[1]);
        setTitle(response.data[2]);
        setDescription(response.data[3]);
        setVideoLevel(response.data[4]);
        setError("");
      } catch (err) {
        setVideos([]);
        setError(err.response?.data?.error || "Failed to fetch videos.");
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

  return (
    <div className="nptel-container" style={{ width: '200px' }}>
      {/* <h2>Videos for Subtopic: {subtopic}</h2> */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {videos.map((videoPath, index) => (
          <div
            key={index}
            style={{
              width: "250px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              cursor: "pointer",
              textAlign: "center",
            }}
            onClick={() => openVideo(videoPath, videoNames[index])}
          >
            <h3>{title[index]}</h3>
            <p>{description[index]}</p>
            <p>{video_level[index]}</p>
            <img
              src="/image/image.png" // Replace with actual thumbnail source
              alt={videoNames[index] || "Video"}
              style={{
                width: "60%",
                height: "auto",
                borderRadius: "4px",
                marginBottom: "10px",
              }}
            />
            <p>
              <strong>Level:</strong>{" "}
              <span style={{ textDecoration: video_level[index] === "Basic" ? "none" : "line-through" }}>
                Basic
              </span>{" "}
              <span style={{ textDecoration: video_level[index] === "Intermediate" ? "none" : "line-through" }}>
                Intermediate
              </span>{" "}
              <span style={{ textDecoration: video_level[index] === "Advanced" ? "none" : "line-through" }}>
                Advance
              </span>
            </p>

          </div>
        ))}
      </div>

      {selectedVideo && (
        <div className="nptel-modal-overlay">
          <div className="nptel-modal-content">
            <h3>Subtopic: {subtopic}</h3>

            <video
              width="500px"
              height="auto"
              controls
              style={{ border: "1px solid #ccc", borderRadius: "8px" }}
            >
              <source
                src={`http://localhost:5000/api/video?path=${encodeURIComponent(
                  selectedVideo
                )}`}
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
