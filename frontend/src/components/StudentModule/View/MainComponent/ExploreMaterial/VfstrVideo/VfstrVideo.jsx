import React, { useState, useEffect } from "react";
import axios from "axios";
import base64 from "base64-js";

const VfstrVideo = ({ subtopic }) => {
  const [vfstrFiles, setVfstrFiles] = useState([]);
  const [error, setError] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoName, setSelectedVideoName] = useState("");
  const [videoPath, setVideoPath] = useState("");

  useEffect(() => {
    const fetchVfstrFiles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/vfstr-videos", {
          params: { subTopic: subtopic },
        });
        setVfstrFiles(response.data.videofiles || []);
        setVideoPath(response.data.folder);
        setError("");
      } catch (err) {
        console.error(err);
        setVfstrFiles([]);
        setError(err.response?.data?.error || "Failed to fetch Vfstr videos and PDFs.");
      }
    };

    fetchVfstrFiles();
  }, [subtopic]);

  const getFileExtension = (fileName) => {
    if (!fileName) return "";
    return fileName.split(".").pop().toLowerCase();
  };

  const openPDF = (base64String, fileName) => {
    if (!base64String) {
      alert("File data is missing.");
      return;
    }

    const byteCharacters = base64.toByteArray(base64String);
    const blob = new Blob([byteCharacters], { type: "application/pdf" });
    const fileUrl = URL.createObjectURL(blob);

    const newTab = window.open();
    if (newTab) {
      newTab.document.write(`<iframe src="${fileUrl}" width="100%" height="100%"></iframe>`);
    } else {
      alert("Please allow popups to view the PDF.");
    }
  };

  const openVideoModal = (videoName, videoPath) => {
    setSelectedVideo(`${videoPath}\\${videoName}`);
    setSelectedVideoName(videoName);
  };

  const closeModal = () => {
    setSelectedVideo(null);
    setSelectedVideoName("");
  };

  return (
    <div className="vfstr-container" style={{ width: "100%" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {vfstrFiles.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {vfstrFiles.map((file, index) => (
            <div
              key={index}
              style={{
                width: "250px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <h5>{file.title || "No Title"}</h5>
              <p>{file.description || "No Description"}</p>

              {/* PDF Handling */}
              {file.file_name && getFileExtension(file.file_name) === "pdf" ? (
                <img
                  src="/image/link_logo.png"
                  alt="PDF"
                  style={{
                    width: "20%",
                    height: "auto",
                    borderRadius: "4px",
                    marginBottom: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => openPDF(file.file, file.file_name)}
                />
              ) : null}

              {/* Video Handling */}
              {file.video_name && getFileExtension(file.video_name) === "mp4" ? (
                <img
                  src="/image/logo.svg"
                  alt="Video"
                  style={{
                    width: "60%",
                    height: "auto",
                    borderRadius: "4px",
                    marginBottom: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => openVideoModal(file.video_name, videoPath)}
                />
              ) : null}
              <p>
                <strong>Level:</strong>{" "}
                <span style={{ textDecoration: file.video_level === "Basic" ? "none" : "line-through" }}>
                  Basic
                </span>{" "}
                <span style={{ textDecoration: file.video_level === "Intermediate" ? "none" : "line-through" }}>
                  Intermediate
                </span>{" "}
                <span style={{ textDecoration: file.video_level === "Advanced" ? "none" : "line-through" }}>
                  Advance
                </span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Video Display */}
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
                src={`http://localhost:5000/api/video?path=${encodeURIComponent(selectedVideo)}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

            <p>
              <strong>Video Name:</strong> {selectedVideoName}
            </p>

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

export default VfstrVideo;