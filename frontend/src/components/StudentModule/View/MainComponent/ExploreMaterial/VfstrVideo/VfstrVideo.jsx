import React, { useState, useEffect } from "react";
import axios from "axios";

const VfstrVideo = ({ subtopic }) => {
  const [vfstrFiles, setVfstrFiles] = useState([]);
  const [error, setError] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoName, setSelectedVideoName] = useState("");
  const [folder, setFolder] = useState("");
  useEffect(() => {
    const fetchVfstrFiles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/vfstr-videos", {
          params: { subTopic: subtopic },
        });

        // console.log("Vfstr Files:", response.data);
        setVfstrFiles(response.data.videofiles || []);
        setFolder(response.data.folder);
        setError("");
      } catch (err) {
        console.error("Error fetching files:", err);
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

  const openPDF = (pdfPath) => {
    if (!pdfPath) {
      alert("PDF file path is missing.");
      return;
    }

    // Convert Windows path to a valid URL format
    const formattedPath = pdfPath.replace(/\\/g, "/").replace("D:/Videos/VFSTR/", "");


    // Construct URL and open PDF
    const fileUrl = `http://localhost:5000/api/pdf?path=${encodeURIComponent(formattedPath)}`;
    window.open(fileUrl, "_blank");
  };

  const openVideoModal = (videoName, videoPath) => {
    
    if (!videoName) {
      alert("Invalid video file.");
      return;
    }
    const fullPath = `${videoPath}/${videoName}`.replace(/\\/g, "/");
    setSelectedVideo(fullPath);
    setSelectedVideoName(videoName);
  };

  const closeModal = () => {
    setSelectedVideo(null);
    setSelectedVideoName("");
  };

  return (
    <div className="vfstr-container" style={{ width: "100%" }}>
      {error && <p>{error}</p>}

      {vfstrFiles.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {vfstrFiles.map((file, index) => (
            <React.Fragment key={index}>
              {/* PDF Card */}
              {file.file_name && getFileExtension(file.file_name) === "pdf" && (
                <div
                  style={{
                    width: "250px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  <h4 style={{ fontSize: "16px", fontWeight: "bold" }}>{file.title || "No Title"}</h4>
                  <p style={{ fontSize: "15px" }}>{file.description || "No Description"}</p>

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
                    onClick={() => openPDF(file.file)}
                  />
                 
                 {file.file_level?.length > 0 && (
                    <p>
                      <strong>Level:</strong>{" "}
                      <span style={{ textDecoration: file.file_level === "Basic" ? "none" : "line-through" }}>Basic</span>{" "}
                      <span style={{ textDecoration: file.file_level === "Intermediate" ? "none" : "line-through" }}>
                        Intermediate
                      </span>{" "}
                      <span style={{ textDecoration: file.file_level === "Advanced" ? "none" : "line-through" }}>
                        Advanced
                      </span>
                    </p>
                  )}
                </div>
              )}

              {/* Video Card */}
              {file.video_name && getFileExtension(file.video_name) === "mp4" && (
                <div
                  style={{
                    width: "250px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  <h4 style={{ fontSize: "16px", fontWeight: "bold" }}>{file.title || "No Title"}</h4>
                  <p style={{ fontSize: "15px" }}>{file.description || "No Description"}</p>

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
                    onClick={() => openVideoModal(file.video_name, folder)}
                  />
                {file.file_level?.length > 0 && (
                  <p>
                    <strong>Level:</strong>{" "}
                    <span style={{ textDecoration: file.video_level === "Basic" ? "none" : "line-through" }}>Basic</span>{" "}
                    <span style={{ textDecoration: file.video_level === "Intermediate" ? "none" : "line-through" }}>
                      Intermediate
                    </span>{" "}
                    <span style={{ textDecoration: file.video_level === "Advanced" ? "none" : "line-through" }}>
                      Advanced
                    </span>
                  </p>
                )}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Video Modal */}
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
