import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const LiveChannelTime = () => {
  const location = useLocation();
  const { subject } = location.state || {};
  const navigate = useNavigate();

  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [subTopics, setSubTopics] = useState([]);
  const [selectedSubTopic, setSelectedSubTopic] = useState("");

  const [formData, setFormData] = useState({
    time: "",
    date: "",
    channel: "",
    level: "",
  });

  useEffect(() => {
    if (subject) {
      axios
        .get(`http://localhost:5000/api/chapter/${subject}`)
        .then((res) => setChapters(res.data.chapter))
        .catch((err) => console.error("Error fetching chapters:", err));
    }
  }, [subject]);

  useEffect(() => {
    if (selectedChapter) {
      axios
        .get(`http://localhost:5000/api/topics/${selectedChapter}`)
        .then((res) => setTopics(res.data.topics))
        .catch((err) => console.error("Error fetching topics:", err));
    }
  }, [selectedChapter]);

  const fetchSubTopics = async (topicId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/subtopics?topicId=${topicId}`);
      setSubTopics(res.data);
    } catch (err) {
      console.error("Error fetching subtopics:", err);
    }
  };

  const handleTopicChange = (e) => {
    const topicId = e.target.value;
    setSelectedTopic(topicId);
    setSelectedSubTopic("");
    setSubTopics([]);
    if (topicId) fetchSubTopics(topicId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTopic || !selectedSubTopic) {
      alert("Please select both topic and subtopic.");
      return;
    }

    const requestData = {
      topicId: selectedTopic,
      subTopicId: selectedSubTopic,
      ...formData,
    };

    try {
      await axios.post("http://localhost:5000/api/schedule/add", requestData);
      alert("Schedule added successfully.");
      navigate(-1);
    } catch (err) {
      console.error("Error adding schedule:", err);
      alert("An error occurred while adding the schedule.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Schedule a Live Channel</h2>
      <div className="row">
        {/* Left Side: Form */}
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Select Chapter</label>
              <select
                className="form-select"
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
              >
                <option value="">Select Chapter</option>
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.chapter}
                  </option>
                ))}
              </select>
            </div>

            {selectedChapter && (
              <div className="mb-3">
                <label className="form-label">Select Topic</label>
                <select
                  className="form-select"
                  value={selectedTopic}
                  onChange={handleTopicChange}
                >
                  <option value="">Select Topic</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.topic}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {subTopics.length > 0 && (
              <div className="mb-3">
                <label className="form-label">Select Subtopic</label>
                <select
                  className="form-select"
                  value={selectedSubTopic}
                  onChange={(e) => setSelectedSubTopic(e.target.value)}
                >
                  <option value="">Select Subtopic</option>
                  {subTopics.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.subTopic}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedSubTopic && (
              <>
                <div className="mb-3">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    name="time"
                    className="form-control"
                    value={formData.time}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    className="form-control"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Channel</label>
                  <select
                    name="channel"
                    className="form-control"
                    value={formData.channel}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a channel</option>
                    <option value="DD SWAYAM PRABHA 1">DD SWAYAM PRABHA 1</option>
                    <option value="DD SWAYAM PRABHA 2">DD SWAYAM PRABHA 2</option>
                    <option value="DD SWAYAM PRABHA 3">DD SWAYAM PRABHA 3</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Level</label>
                  <select
                    name="level"
                    className="form-select"
                    value={formData.level}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Level</option>
                    <option value="basic">Basic</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-success">
                  Save Schedule
                </button>
              </>
            )}
          </form>
        </div>

        {/* Right Side: Live Preview */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <strong>Live Preview</strong>
            </div>
            <div className="card-body">
              <p><strong>Chapter:</strong> {chapters.find(c => c.id == selectedChapter)?.chapter ||"Not selected" }</p>
              <p><strong>Topic:</strong> {topics.find(t => t.id == selectedTopic)?.topic || "Not selected"}</p>
              <p><strong>Subtopic:</strong> {subTopics.find(s => s.id == selectedSubTopic)?.subTopic || "Not selected"}</p>
              <p><strong>Date:</strong> {formData.date || "Not selected"}</p>
              <p><strong>Time:</strong> {formData.time || "Not selected"}</p>
              <p><strong>Channel:</strong> {formData.channel || "Not selected"}</p>
              <p><strong>Level:</strong> {formData.level || "Not selected"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChannelTime;
