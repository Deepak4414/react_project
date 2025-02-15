import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const SaveVfstrVideo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject } = location.state || {};

  const [videoForms, setVideoForms] = useState([]);
  const [videoNames, setVideoNames] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [subTopics, setSubTopics] = useState([]);
  const [selectedSubTopic, setSelectedSubTopic] = useState("");
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        if (subject) {
          const response = await axios.get(
            `http://localhost:5000/api/topics/?subjectId=${subject}`
          );
          setTopics(response.data);

        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };
    fetchTopics();
  }, [subject]);

  const fetchSubTopics = async (topicId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/subtopics?topicId=${topicId}`
      );
      setSubTopics(response.data);
    } catch (error) {
      console.error("Error fetching subtopics:", error);
    }
  };

  const handleTopicChange = (e) => {
    const topicId = e.target.value;
    setSelectedTopic(topicId);
    setSelectedSubTopic("");
    setSubTopics([]);
    if (topicId) fetchSubTopics(topicId);
  };

  // Handle adding a new video form
  const handleAddVideoForm = () => {
    setVideoForms([
      ...videoForms,
      {
        id: videoForms.length + 1,
        title: '',
        description: '',
        video: '',
        videoLevel: '',
        textFile: '',
      },
    ]);
  };

  // Handle removing a video form
  const handleRemoveVideoForm = (id) => {
    const updatedForms = videoForms.filter((form) => form.id !== id);
    setVideoForms(updatedForms);
  };

  // Handle changes in the form fields
  const handleFormChange = (id, field, value) => {
    const updatedForms = videoForms.map((form) =>
      form.id === id ? { ...form, [field]: value } : form
    );
    setVideoForms(updatedForms);
  };

  const handleUploadVideo = async (id) => {
    try {
      const form = videoForms.find((form) => form.id === id);
  
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("video", form.video);
      formData.append("videoLevel", form.videoLevel);
      formData.append("videoFile", form.textFile);
      formData.append("subject", subject || "default");
      formData.append("topicId", selectedTopic);
      formData.append("subTopicId", selectedSubTopic);
  
      const response = await axios.post(
        "http://localhost:5000/api/upload-vfstr-video",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      console.log("Video uploaded successfully:", response.data);
      alert("Video uploaded successfully!");
      navigate("/facultyindex/addvfstrvideo");
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Error uploading video. Please try again.");
    }
  };
  
  
  

  // Fetch video names and folder name from the backend
  useEffect(() => {
    const fetchVideoNames = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/vfstrvideos/${subject}`
        );

        setVideoNames(response.data[0]); // Video names
        setFolderName(response.data[1]); // Folder name
        console.log('Video names:', response.data[1]);
      } catch (error) {
        console.error('Error fetching video names:', error);
      }
    };

    if (subject) {
      fetchVideoNames();
    }
  }, [subject]);

  return (
    <>
      <div className="mb-3">
        <label htmlFor="topic" className="form-label">
          Select Topic
        </label>
        <select
          id="topic"
          className="form-select"
          value={selectedTopic}
          onChange={handleTopicChange}
        >
          <option value="">-- Select a Topic --</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.topic}
            </option>
          ))}
        </select>
      </div>

      {subTopics.length > 0 && (
        <div className="mb-3">
          <label htmlFor="subTopic" className="form-label">
            Select Subtopic
          </label>
          <select
            id="subTopic"
            className="form-select"
            value={selectedSubTopic}
            onChange={(e) => setSelectedSubTopic(e.target.value)}
          >
            <option value="">-- Select a Subtopic --</option>
            {subTopics.map((subTopic) => (
              <option key={subTopic.id} value={subTopic.id}>
                {subTopic.subTopic}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedSubTopic && (
        <>
          <div className="container mt-4">
            {/* Render video forms */}
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
                      onChange={(e) => handleFormChange(form.id, 'title', e.target.value)}
                      placeholder="Enter video title"
                    />
                  </div>
                  <div className="col-md-6">
                    <label>Video Name:</label>
                    <select
                      className="form-control"
                      value={form.video}
                      onChange={(e) => handleFormChange(form.id, 'video', e.target.value)}
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

                {/* Video Description and Video Level in the same row */}
                <div className="row mb-2">
                  <div className="col-md-6">
                    <label>Video Description:</label>
                    <textarea
                      className="form-control"
                      value={form.description}
                      onChange={(e) => handleFormChange(form.id, 'description', e.target.value)}
                      placeholder="Enter video description"
                    />
                  </div>
                  <div className="col-md-6">
                    <label>Level of Video:</label>
                    <select
                      className="form-control"
                      value={form.videoLevel}
                      onChange={(e) => handleFormChange(form.id, 'videoLevel', e.target.value)}
                    >
                      <option value="">-- Select a Level --</option>
                      <option value="Basic">Basic</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/*  File Input */}
                <div className="row mb-2">
                  <div className="col-md-6">
                    <label>File:</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => handleFormChange(form.id, 'textFile', e.target.files[0])}
                    />
                  </div>
                </div>

                {/* Upload and Remove Buttons */}
                <div className="row mb-2">
                  <div className="col-md-6">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleUploadVideo(form.id)}
                    >
                      Upload Video
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleRemoveVideoForm(form.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Video Form Button */}
            <button
              type="button"
              className="btn btn-primary mb-3"
              onClick={handleAddVideoForm}
            >
              Add VFSTR Video
            </button>
          </div>
        </>
      )}

    </>
  );
};

export default SaveVfstrVideo;