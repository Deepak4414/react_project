import React, { useState, useEffect } from "react";
import axios from "axios";

const NptelContent = ({ subject, onVideoDataChange, onFolderNameChange }) => {
    const [videoForms, setVideoForms] = useState([]);
    const [videoNames, setVideoNames] = useState([]);
    const [folderName,setFolderName] = useState("");

    const handleAddVideoForm = () => {
        setVideoForms([...videoForms, { id: videoForms.length + 1, title: "", description: "", video: "" }]);
    };

    const handleRemoveVideoForm = (id) => {
        const updatedForms = videoForms.filter((form) => form.id !== id);
        setVideoForms(updatedForms);
        onVideoDataChange(updatedForms);
    };

    const handleFormChange = (id, field, value) => {
        const updatedForms = videoForms.map((form) =>
            form.id === id ? { ...form, [field]: value } : form
        );
        setVideoForms(updatedForms);
        onVideoDataChange(updatedForms);
    };

    useEffect(() => {
        const fetchVideoNames = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/nptelvideos/${subject}`
                );
                setVideoNames(response.data[0]);
                setFolderName(response.data[1]);
                onFolderNameChange(response.data[1]);
            } catch (error) {
                console.error("Error fetching video names:", error);
            }
        };
        fetchVideoNames();
    }, [subject,onFolderNameChange]);

    return (
<div className="container mt-4">
  {videoForms.map((form) => (
    <div key={form.id} className="border p-3 mb-3">
      {/* Video Title and Video Name in the same row */}
      <div className="row mb-2">
        <div className="col-md-6">
          <label>Video Title:</label>
          <input
            type="text"
            className="form-control"
            value={form.title}
            onChange={(e) => handleFormChange(form.id, "title", e.target.value)}
            placeholder="Enter video title"
          />
        </div>
        <div className="col-md-6">
          <label>Video Name:</label>
          <select
            className="form-control"
            value={form.video}
            onChange={(e) => handleFormChange(form.id, "video", e.target.value)}
          >
            <option value="">-- Select a Video --</option>
            {videoNames.map((video, index) => (
              <option key={index} value={video}>
                {video}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Video Description in a separate row */}
      <div className="row mb-2">
        <div className="col-md-12">
          <label>Video Description:</label>
          <textarea
            className="form-control"
            value={form.description}
            onChange={(e) => handleFormChange(form.id, "description", e.target.value)}
            placeholder="Enter video description"
          />
        </div>
      </div>

      
      {/* Remove Button */}
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => handleRemoveVideoForm(form.id)}
      >
        Remove
      </button>
    </div>
  ))}

  {/* Add NPTEL Video Button */}
  <button type="button" className="btn btn-primary mb-3" onClick={handleAddVideoForm}>
    Add NPTEL Video
  </button>
</div>
    );
};

export default NptelContent;
