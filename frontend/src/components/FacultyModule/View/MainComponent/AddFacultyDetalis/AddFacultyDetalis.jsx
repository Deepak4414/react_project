import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddFacultyDetails.css";

const AddFacultyDetails = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/api/upload-faculty-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message);
      setSubmitted(true);
      // Show alert message before navigating
      alert("Faculty details uploaded successfully!");
      // Navigate to previous page after successful submission
      navigate(-1);

    } catch (error) {
      setMessage("File upload failed");
    }
  };

  return (
    <div className="containers">
      <h2 className="title">Upload Faculty Details</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <label htmlFor="Faculty Name">Faculty Name</label>
        <input
          type="text"
          className="input-field"
          placeholder="Enter Faculty Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor="Faculty Photo">Faculty Photo</label>
        <input type="file" className="file-input" onChange={handleFileChange} required />
        <button type="submit" className="upload-button">Upload</button>
      </form>
      {submitted && <p className="message">{message}</p>}
    </div>
  );
};

export default AddFacultyDetails;