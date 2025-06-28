import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const SaveVfstrVideo = (selectedSubTopicId) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject } = location.state || {};

  const [videoForms, setVideoForms] = useState([]);
  const [videoNames, setVideoNames] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [subTopics, setSubTopics] = useState([]);
  const [selectedSubTopic, setSelectedSubTopic] = useState("");
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState('');

  useEffect(() => {
    if (subject) {
      axios.get(`http://localhost:5000/api/chapter/${subject}`)
        .then(res => setChapters(res.data.chapter))
        .catch(err => console.error("Chapter fetch error:", err));
    }
  }, [subject]);

  useEffect(() => {
    if (selectedChapter) {
      axios.get(`http://localhost:5000/api/topics/${selectedChapter}`)
        .then(res => setTopics(res.data.topics))
        .catch(err => console.error("Topic fetch error:", err));
    }
  }, [selectedChapter]);

  useEffect(() => {
    if (subject) {
      axios.get(`http://localhost:5000/api/vfstrvideos/${subject}`)
        .then(res => {
          setVideoNames(res.data[0]);
          setFolderName(res.data[1]);
        })
        .catch(err => console.error("Video names fetch error:", err));
    }
  }, [subject]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/fetch-faculties')
      .then(res => setFaculties(res.data))
      .catch(err => console.error("Faculty fetch error:", err));
  }, []);

  const fetchSubTopics = async (topicId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/subtopics?topicId=${topicId}`);
      setSubTopics(res.data);
    } catch (err) {
      console.error("Subtopic fetch error:", err);
    }
  };

  const handleTopicChange = (e) => {
    const id = e.target.value;
    setSelectedTopic(id);
    setSelectedSubTopic("");
    fetchSubTopics(id);
  };

  const handleAddVideoForm = () => {
    setVideoForms([...videoForms, {
      id: videoForms.length + 1,
      title: "",
      description: "",
      video: "",
      videoLevel: "",
      textFile: ""
    }]);
  };

  const handleRemoveVideoForm = (id) => {
    setVideoForms(videoForms.filter(f => f.id !== id));
  };

  const handleFormChange = (id, field, value) => {
    setVideoForms(videoForms.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const handleUploadVideo = async (id) => {
    try {
      const form = videoForms.find(f => f.id === id);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("video", form.video);
      formData.append("videoLevel", form.videoLevel);
      formData.append("videoFile", form.textFile);
      formData.append("subject", subject || "default");
      formData.append("topicId", selectedTopic);
      formData.append("subTopicId", selectedSubTopic);
      formData.append("facultyName", selectedFaculty);

      await axios.post("http://localhost:5000/api/upload-vfstr-video", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Video uploaded successfully!");
      navigate("/facultyindex/addvfstrvideo");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed.");
    }
  };

  const handleFacultyChange = (e) => setSelectedFaculty(e.target.value);

  return (
    <div className="container my-4">
      <div className="row">
        {/* Left Column: Form */}
        <div className="col-md-6">
          {/* <h4 className="mb-3">Upload VFSTR Video</h4> */}

          {/* <div className="mb-3">
            <label className="form-label">Select Chapter</label>
            <select className="form-select" value={selectedChapter} onChange={(e) => setSelectedChapter(e.target.value)}>
              <option value="">-- Select Chapter --</option>
              {chapters.map(ch => (
                <option key={ch.id} value={ch.id}>{ch.chapter}</option>
              ))}
            </select>
          </div>

          {selectedChapter && (
            <>
              <div className="mb-3">
                <label className="form-label">Select Topic</label>
                <select className="form-select" value={selectedTopic} onChange={handleTopicChange}>
                  <option value="">-- Select Topic --</option>
                  {topics.map(topic => (
                    <option key={topic.id} value={topic.id}>{topic.topic}</option>
                  ))}
                </select>
              </div>

              {subTopics.length > 0 && (
                <div className="mb-3">
                  <label className="form-label">Select Subtopic</label>
                  <select className="form-select" value={selectedSubTopic} onChange={(e) => setSelectedSubTopic(e.target.value)}>
                    <option value="">-- Select Subtopic --</option>
                    {subTopics.map(st => (
                      <option key={st.id} value={st.id}>{st.subTopic}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )} */}
          {selectedSubTopicId && (
            <div>
              {videoForms.map(form => (
                <div key={form.id} className="border p-3 rounded mb-4 shadow-sm bg-light">
                  <div className="mb-2">
                    <label>Video Title</label>
                    <input type="text" className="form-control" value={form.title} onChange={(e) => handleFormChange(form.id, "title", e.target.value)} />
                  </div>

                  <div className="mb-2">
                    <label>Video Description</label>
                    <textarea className="form-control" value={form.description} onChange={(e) => handleFormChange(form.id, "description", e.target.value)} />
                  </div>

                  <div className="mb-2">
                    <label>Video File Name</label>
                    <select className="form-control" value={form.video} onChange={(e) => handleFormChange(form.id, "video", e.target.value)}>
                      <option value="">-- Select Video --</option>
                      {videoNames.map((v, i) => (
                        <option key={i} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-2">
                    <label>Level</label>
                    <select className="form-control" value={form.videoLevel} onChange={(e) => handleFormChange(form.id, "videoLevel", e.target.value)}>
                      <option value="">-- Select Level --</option>
                      <option value="Basic">Basic</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="mb-2">
                    <label>Upload PDF</label>
                    <input type="file" accept=".pdf" className="form-control" onChange={(e) => handleFormChange(form.id, "textFile", e.target.files[0])} />
                  </div>

                  <div className="mb-2">
                    <label>Faculty Name</label>
                    <select className="form-control" value={selectedFaculty} onChange={handleFacultyChange}>
                      <option value="">-- Select Faculty --</option>
                      {faculties.map(f => (
                        <option key={f._id} value={f.name}>{f.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    <button className="btn btn-success" onClick={() => handleUploadVideo(form.id)}>Upload</button>
                    <button className="btn btn-outline-danger" onClick={() => handleRemoveVideoForm(form.id)}>Remove</button>
                  </div>
                </div>
              ))}

              <button className="btn btn-primary" onClick={handleAddVideoForm}>+ Add Video</button>
            </div>
          )}
        </div>

        {/* Right Column: Preview
        <div className="col-md-6">
          <h5 className="mb-3">Live Preview</h5>
          {videoForms.map(form => (
            <div key={form.id} className="card mb-3 shadow-sm">
              <div className="card-body">
                <h6 className="card-title">{form.title || "Untitled Video"}</h6>
                <p className="card-text">{form.description || "No description provided."}</p>
                <p><strong>Level:</strong> {form.videoLevel || "N/A"}</p>
                <p><strong>Video File:</strong> {form.video || "Not selected"}</p>
                <p><strong>Faculty:</strong> {selectedFaculty || "N/A"}</p>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default SaveVfstrVideo;
