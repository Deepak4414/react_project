import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../Css/ShowAllTopicAndSubtopic.css";

const UpdateTopic = () => {
  const location = useLocation();
  const { course, branch, semester, subject } = location.state || {};
  
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState({});
  const [subtopics, setSubtopics] = useState({});
  const [selectedSubtopicId, setSelectedSubtopicId] = useState(null);
  const [loading, setLoading] = useState(false);

  // For editing links
  const [levels, setLevels] = useState({
    basic: [],
    medium: [],
    advanced: [],
  });
  const [nptelVideos, setNptelVideos] = useState([]);
  const [newChapterName, setNewChapterName] = useState("");
  const [newTopicName, setNewTopicName] = useState("");
  const [newSubtopicName, setNewSubtopicName] = useState("");
  const [editingTopic, setEditingTopic] = useState(null);
  const [editingSubtopic, setEditingSubtopic] = useState(null);
  const [videoForms, setVideoForms] = useState([]); // For NPTEL video forms
  const [videoNames, setVideoNames] = useState([]);
  // Local state for each chapter/topic's input fields
  const [chapterInputs, setChapterInputs] = useState({});
  const [topicInputs, setTopicInputs] = useState({});
  const [subtopicInputs, setSubtopicInputs] = useState({});

  const [subjectName, setSubjectName] = useState("");
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/subject-name/${subject}`)
      .then((response) => {
        setSubjectName(response.data[0].subjectName);
      });
  }, [subject]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (!subject) return;

      try {
        setLoading(true);
        const chaptersRes = await axios.get(
          `http://localhost:5000/api/chapter/${subject}`
        );
        setChapters(chaptersRes.data.chapter);

        const topicsData = {};
        for (const chapter of chaptersRes.data.chapter) {
          const topicsRes = await axios.get(
            `http://localhost:5000/api/topics/${chapter.id}`
          );
          topicsData[chapter.id] = topicsRes.data.topics;

          // Initialize input states
          setTopicInputs((prev) => ({ ...prev, [chapter.id]: "" }));
        }
        setTopics(topicsData);

        const subtopicsData = {};
        for (const chapter of chaptersRes.data.chapter) {
          for (const topic of topicsData[chapter.id] || []) {
            const subtopicsRes = await axios.get(
              `http://localhost:5000/api/subtopics/${topic.id}`
            );
            subtopicsData[topic.id] = subtopicsRes.data;

            // Initialize input states
            setSubtopicInputs((prev) => ({ ...prev, [topic.id]: "" }));
          }
        }
        setSubtopics(subtopicsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subject]);

  // fetch nptel video names
  useEffect(() => {
    const fetchVideoNames = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/nptelvideos/${subject}`
        );
        setVideoNames(response.data[0]); // Assuming response.data[0] contains video names
      } catch (error) {
        console.error("Error fetching video names:", error);
      }
    };

    if (subject) {
      fetchVideoNames();
    }
  }, [subject]);

  // Fetch links when subtopic is selected
  useEffect(() => {
    if (selectedSubtopicId) {
      // Fetch links
      axios
        .get(`http://localhost:5000/api/links/${selectedSubtopicId}`)
        .then((response) => {
          const data = response.data;
          const categorizedLinks = { basic: [], medium: [], advanced: [] };

          data.forEach((link) => {
            if (categorizedLinks[link.level]) {
              categorizedLinks[link.level].push({
                id: link.id,
                title: link.title,
                link: link.link,
                description: link.description,
                rating: link.rating,
              });
            }
          });

          setLevels(categorizedLinks);
        })
        .catch((error) => console.error("Error fetching links:", error));

      // Fetch NPTEL videos
      setNptelVideos([]);
      axios
        .get(`http://localhost:5000/api/videos?subTopic=${selectedSubtopicId}`)
        .then((response) => {
          const data = response.data;

          if (
            Array.isArray(data) &&
            data.length === 6 &&
            data.every((arr) => Array.isArray(arr)) &&
            data[1].length > 0
          ) {
            // Convert to object array for pre-filling
            const prefilledForms = data[0].map((_, i) => ({
              id: data[0][i],
              video: data[2][i],
              title: data[3][i],
              description: data[4][i],
              videoLevel: data[5][i],
            }));
            setVideoForms(prefilledForms);
            setNptelVideos(data); // optional, if needed for another section
          } else {
            setVideoForms([]);
            setNptelVideos([]);
          }
        });
    }
  }, [selectedSubtopicId]);

  // Handle topic name change
  const handleTopicNameChange = (chapterId, topicId, newName) => {
    setTopics((prev) => {
      const newTopics = { ...prev };
      newTopics[chapterId] = newTopics[chapterId].map((topic) =>
        topic.id === topicId ? { ...topic, topic: newName } : topic
      );
      return newTopics;
    });
  };

  // Handle subtopic name change
  const handleSubtopicNameChange = (topicId, subtopicId, newName) => {
    setSubtopics((prev) => {
      const newSubtopics = { ...prev };
      newSubtopics[topicId] = newSubtopics[topicId].map((subtopic) =>
        subtopic.id === subtopicId
          ? { ...subtopic, subTopic: newName }
          : subtopic
      );
      return newSubtopics;
    });
  };

  // Save topic name to backend
  const saveTopicName = async (chapterId, topicId) => {
    try {
      const topic = topics[chapterId].find((t) => t.id === topicId);
      await axios.put(`http://localhost:5000/api/update-topic/${topicId}`, {
        topicName: topic.topic,
      });
      setEditingTopic(null);
    } catch (error) {
      console.error("Error updating topic:", error);
    }
  };

  // Save subtopic name to backend
  const saveSubtopicName = async (topicId, subtopicId) => {
    try {
      const subtopic = subtopics[topicId].find((s) => s.id === subtopicId);
      await axios.put(
        `http://localhost:5000/api/update-subtopic/${subtopicId}`,
        {
          subtopicName: subtopic.subTopic,
        }
      );
      setEditingSubtopic(null);
    } catch (error) {
      console.error("Error updating subtopic:", error);
    }
  };

  const handleAddChapter = async () => {
    const newChapterName = chapterInputs["new"];
    if (!newChapterName?.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/add-chapter/add-chapter",
        {
          subjectId: subject,
          courseId: course,
          branchId: branch,
          semesterId: semester,
          chapterName: newChapterName,
        }
      );

      const newChapter = {
        id: response.data.chapter.id,
        chapter: response.data.chapter.chapterName, // Normalize for frontend
      };

      setChapters([...chapters, newChapter]);
      setTopics({ ...topics, [newChapter.id]: [] });
      setChapterInputs({ ...chapterInputs, new: "" });
    } catch (error) {
      console.error("Error adding chapter:", error);
    }
  };

  // Delete chapter
  const handleDeleteChapter = async (chapterId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/delete/delete-chapter/${chapterId}`
      );
      setChapters(chapters.filter((chapter) => chapter.id !== chapterId));

      const newTopics = { ...topics };
      delete newTopics[chapterId];
      setTopics(newTopics);
    } catch (error) {
      console.error("Error deleting chapter:", error);
    }
  };

  // Add new topic to a specific chapter
  const handleAddTopic = async (chapterId) => {
    const topicName = topicInputs[chapterId];
    if (!topicName?.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/add-topic/add-topic",
        {
          topicName,
          chapterId,
          subjectId: subject,
          courseId: course,
          branchId: branch,
          semesterId: semester,
        }
      );

      setTopics((prev) => ({
        ...prev,
        [chapterId]: [...(prev[chapterId] || []), response.data.topic],
      }));

      setTopicInputs({ ...topicInputs, [chapterId]: "" });
    } catch (error) {
      console.error("Error adding topic:", error);
    }
  };

  // Delete topic
  const handleDeleteTopic = async (chapterId, topicId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/delete/delete-topic/${topicId}`
      );

      setTopics((prev) => ({
        ...prev,
        [chapterId]: prev[chapterId].filter((topic) => topic.id !== topicId),
      }));

      const newSubtopics = { ...subtopics };
      delete newSubtopics[topicId];
      setSubtopics(newSubtopics);
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

  // Add new subtopic to a specific topic
  const handleAddSubtopic = async (topicId) => {
    const subtopicName = subtopicInputs[topicId];
    if (!subtopicName?.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/add-subtopic/add-subtopic",
        {
          topicId,
          subtopicName,
        }
      );

      setSubtopics((prev) => ({
        ...prev,
        [topicId]: [...(prev[topicId] || []), response.data.subtopic],
      }));

      setSubtopicInputs({ ...subtopicInputs, [topicId]: "" });
    } catch (error) {
      console.error("Error adding subtopic:", error);
    }
  };

  const handleDeleteSubtopic = async (topicId, subtopicId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/delete/delete-subtopic/${subtopicId}`
      );

      setSubtopics((prev) => {
        const updatedSubtopics =
          prev[topicId]?.filter((subtopic) => subtopic.id !== subtopicId) || [];

        return {
          ...prev,
          [topicId]: updatedSubtopics,
        };
      });
    } catch (error) {
      console.error("Error deleting subtopic:", error);
    }
  };

  const handleDeleteLink = async (level, id) => {
    try {
      const newLevels = { ...levels };

      if (id && !String(id).startsWith("new-")) {
        await axios.delete(`http://localhost:5000/api/delete-link/${id}`);
        alert("Link deleted successfully!");
      }

      newLevels[level] = newLevels[level].filter(
        (link) => String(link.id) !== String(id)
      );
      setLevels(newLevels);
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const handleAddLink = (level) => {
    const newLevels = { ...levels };
    newLevels[level].push({
      id: `new-${Date.now()}`,
      title: "",
      link: "",
      description: "",
      rating: 0,
    });
    setLevels(newLevels);
  };

  const handleDeleteNptelLink = async (index) => {
    try {
      const videoId = nptelVideos[0]?.[index];

      // Skip API call if it's a new (unsaved) item
      if (videoId && !String(videoId).startsWith("new-")) {
        await axios.delete(
          `http://localhost:5000/api/delete/delete-nptel/${videoId}`
        );
        alert("NPTEL Videos deleted successfully!");
      }

      // Remove the item from all arrays
      const newNptelVideos = nptelVideos.map((arr) =>
        arr.filter((_, i) => i !== index)
      );
      setNptelVideos(newNptelVideos);
      // alert("NPTEL link deleted successfully!");
    } catch (error) {
      console.error("Error deleting NPTEL link:", error);
    }
  };

  const handleAddNptelLink = () => {
    const newNptelVideos =
      nptelVideos.length > 0
        ? nptelVideos.map((arr) => [...arr, ""])
        : [[], [], [], [], [], []].map((arr) => [...arr, ""]);

    if (newNptelVideos[0].length > 0) {
      const lastIndex = newNptelVideos[0].length - 1;
      newNptelVideos[0][lastIndex] = `new-${Date.now()}`;
      newNptelVideos[1][lastIndex] = "";
      newNptelVideos[2][lastIndex] = "";
      newNptelVideos[3][lastIndex] = "";
      newNptelVideos[4][lastIndex] = "";
      newNptelVideos[5][lastIndex] = ""; 
    }

    setNptelVideos(newNptelVideos);
  };

  const handleChange = (e, level, index, field) => {
    const newLevels = { ...levels };
    newLevels[level][index][field] = e.target.value;
    setLevels(newLevels);
  };

  const handleNptelChange = (e, index, field) => {
    const newNptelVideos = [...nptelVideos];
    newNptelVideos[field][index] = e.target.value;
    setNptelVideos(newNptelVideos);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update regular links
      await axios.put(
        `http://localhost:5000/api/update-links/${selectedSubtopicId}`,
        { levels }
      );
      // Update NPTEL videos
      if (nptelVideos.length > 0 && nptelVideos[0].length > 0) {
        // console.log("NPTEL Videos to update:", nptelVideos);
        const nptelData = {
          ids: nptelVideos[0], // Array of IDs
          
          videos: nptelVideos[2], // Array of video filenames (previously links)
          titles: nptelVideos[3], // Array of video titles
          descriptions: nptelVideos[4], // Array of descriptions
          levels: nptelVideos[5], // Array of video levels (Basic/Intermediate/Advanced)
          subTopic: selectedSubtopicId,
          folder_path: `D:/Videos/${subjectName}`, // Assuming the folder path is based on subject
        };


        await axios.put(
          `http://localhost:5000/api/update-nptel/${selectedSubtopicId}`,
          nptelData
        );
      }

      alert("Updated successfully!");
      setSelectedSubtopicId(null);
    } catch (error) {
      console.error("Error updating links:", error);
    }
  };

  // Update input states
  const handleChapterInputChange = (value) => {
    setChapterInputs({ ...chapterInputs, new: value });
  };

  const handleTopicInputChange = (chapterId, value) => {
    setTopicInputs({ ...topicInputs, [chapterId]: value });
  };

  const handleSubtopicInputChange = (topicId, value) => {
    setSubtopicInputs({ ...subtopicInputs, [topicId]: value });
  };

  const renderChapterColumns = () => {
    if (loading) return <div className="loading">Loading chapters...</div>;

    return (
      <div className="chapters-grid">
        {chapters.map((chapter, chapterIndex) => (
          <div key={chapter.id} className="chapter-column">
            <div className="chapter-header">
              <h5 className="chapter-title">
                {chapterIndex + 1}. {chapter.chapter}
              </h5>
              <button
                className="delete-btn"
                onClick={() => handleDeleteChapter(chapter.id)}
              >
                ×
              </button>
            </div>

            {/* Add Topic Section - Scoped to this chapter */}
            <div className="add-section">
              <input
                type="text"
                value={topicInputs[chapter.id] || ""}
                onChange={(e) =>
                  handleTopicInputChange(chapter.id, e.target.value)
                }
                placeholder="New Topic Name"
                className="add-input"
              />
              <button
                className="add-btn"
                onClick={() => handleAddTopic(chapter.id)}
              >
                +
              </button>
            </div>

            {/* Topics for this chapter */}
            <ul className="topics-list">
              {(topics[chapter.id] || []).map((topic, topicIndex) => (
                <li key={topic.id} className="topic-item">
                  <div className="topic-header">
                    <div className="topic-name">
                      {chapterIndex + 1}.{topicIndex + 1} {topic.topic}
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteTopic(chapter.id, topic.id)}
                    >
                      ×
                    </button>
                  </div>

                  {/* Add Subtopic Section - Scoped to this topic */}
                  <div className="add-section">
                    <input
                      type="text"
                      value={subtopicInputs[topic.id] || ""}
                      onChange={(e) =>
                        handleSubtopicInputChange(topic.id, e.target.value)
                      }
                      placeholder="New Subtopic Name"
                      className="add-input"
                    />
                    <button
                      className="add-btn"
                      onClick={() => handleAddSubtopic(topic.id)}
                    >
                      +
                    </button>
                  </div>

                  {/* Subtopics for this topic */}
                  <ul className="subtopics-list">
                    {(subtopics[topic.id] || []).map(
                      (subtopic, subtopicIndex) => (
                        <li key={subtopic.id} className="subtopic-item">
                          <div
                            onClick={() => setSelectedSubtopicId(subtopic.id)}
                            className="subtopic-name"
                          >
                            {chapterIndex + 1}.{topicIndex + 1}.
                            {subtopicIndex + 1} {subtopic.subTopic}
                          </div>
                          <button
                            className="delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSubtopic(topic.id, subtopic.id);
                            }}
                          >
                            ×
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Add Chapter Section */}
        <div className="add-chapter-section">
          <input
            type="text"
            value={chapterInputs["new"] || ""}
            onChange={(e) => handleChapterInputChange(e.target.value)}
            placeholder="New Chapter Name"
            className="add-input"
          />
          <button className="add-btn" onClick={handleAddChapter}>
            +
          </button>
        </div>
      </div>
    );
  };

  // ... (keep the existing renderLinkEditor function)
  const renderLinkEditor = () => {
    return (
      <div className="link-editor">
        <button
          className="back-button"
          onClick={() => setSelectedSubtopicId(null)}
        >
          ← Back to Chapters
        </button>

        <form onSubmit={handleSubmit}>
          <div className="link-sections">
            {["basic", "medium", "advanced"].map((level) => (
              <div key={level} className="link-section">
                <div className="section-header">
                  <h5 className="text-capitalize">{level} Level</h5>
                  <button
                    type="button"
                    className="add-link-btn"
                    onClick={() => handleAddLink(level)}
                  >
                    + Add Link
                  </button>
                </div>

                {levels[level].map((link, index) => (
                  <div key={link.id || index} className="link-item">
                    <button
                      type="button"
                      className="delete-link-btn"
                      onClick={() => handleDeleteLink(level, link.id)}
                    >
                      ×
                    </button>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Title"
                      value={link.title}
                      onChange={(e) => handleChange(e, level, index, "title")}
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Link"
                      value={link.link}
                      onChange={(e) => handleChange(e, level, index, "link")}
                    />
                    <textarea
                      className="form-control mb-2"
                      placeholder="Description"
                      rows="2"
                      value={link.description}
                      onChange={(e) =>
                        handleChange(e, level, index, "description")
                      }
                    />
                  </div>
                ))}
              </div>
            ))}

            <div className="link-section">
              <div className="section-header">
                <h5>NPTEL Videos</h5>
                <button
                  type="button"
                  className="add-link-btn"
                  onClick={handleAddNptelLink}
                >
                  + Add Video
                </button>
              </div>

              {Array.isArray(nptelVideos[1]) && nptelVideos[1].length === 0 ? (
                <p className="no-content">No NPTEL content available.</p>
              ) : (
                Array.isArray(nptelVideos[1]) &&
                nptelVideos[1].map((_, index) => (
                  <div
                    key={nptelVideos[0]?.[index] || index}
                    className="link-item"
                  >
                    <button
                      type="button"
                      className="delete-link-btn"
                      onClick={() => handleDeleteNptelLink(index)}
                    >
                      ×
                    </button>

                    <input
                      type="text"
                      className="form-control mb-2"
                      value={nptelVideos[3]?.[index] || ""}
                      onChange={(e) => handleNptelChange(e, index, 3)}
                      placeholder="Video Title"
                    />

                    {/* Replace the Link input with a video selection dropdown */}
                    <select
                      className="form-control mb-2"
                      value={nptelVideos[2]?.[index] || ""}
                      onChange={(e) => handleNptelChange(e, index, 2)}
                    >
                      <option value="">-- Select a Video --</option>
                      {videoNames.map((video, idx) => (
                        <option key={idx} value={video}>
                          {video}
                        </option>
                      ))}
                    </select>

                    <textarea
                      className="form-control mb-2"
                      value={nptelVideos[4]?.[index] || ""}
                      onChange={(e) => handleNptelChange(e, index, 4)}
                      placeholder="Video Description"
                      rows="2"
                    />

                    {/* Replace the text input with a dropdown for video level */}
                    <select
                      className="form-control"
                      value={nptelVideos[5]?.[index] || ""}
                      onChange={(e) => handleNptelChange(e, index, 5)}
                    >
                      <option value="">-- Select Level --</option>
                      <option value="Basic">Basic</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                ))
              )}
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Save Changes
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="update-topic-container">
      <h3 className="page-title">Update Course Content for "{subjectName}"</h3>

      {selectedSubtopicId ? renderLinkEditor() : renderChapterColumns()}
    </div>
  );
};

export default UpdateTopic;