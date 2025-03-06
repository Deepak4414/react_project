import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const LiveChannelTime = () => {
  const location = useLocation();
  const { subject } = location.state || {};
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
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (subject) {
      axios
        .get(`http://localhost:5000/api/chapter/${subject}`)
        .then((response) => setChapters(response.data.chapter))
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [subject]);

  useEffect(() => {
    if (selectedChapter) {
      axios
        .get(`http://localhost:5000/api/topics/${selectedChapter}`)
        .then((response) => setTopics(response.data.topics))
        .catch((error) => console.error("Error fetching topics:", error));
    }
  }, [selectedChapter]);

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
    } catch (error) {
      console.error("Error adding schedule:", error);
      alert("An error occurred while adding the schedule. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Schedule a Live Channel</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="chapter" className="form-label">
            Select Chapter
          </label>
          <select
            id="chapter"
            className="form-select"
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
          >
            <option value="">Select Chapter</option>
            {chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.chapter}
              </option>
            ))}
          </select>
        </div>
        {selectedChapter.length > 0 && (
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
        )}

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
            <div className="mb-3">
              <label htmlFor="time" className="form-label">
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                className="form-control"
                value={formData.time}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="date" className="form-label">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="channel" className="form-label">
                Channel
              </label>
              <select
                id="channel"
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
              <label htmlFor="level" className="form-label">
                Level
              </label>
              <select
                id="level"
                name="level"
                className="form-select"
                value={formData.level}
                onChange={handleInputChange}
              >
                <option value="">-- Select Level --</option>
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <button type="submit" className="btn btn-success mb-3">
              Save Schedule
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default LiveChannelTime;
