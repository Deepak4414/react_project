import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateTopic = () => {
  const location = useLocation();
  const { course, branch, semester, subject } = location.state || {};
  const navigate = useNavigate();

  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSubTopic, setSelectedSubTopic] = useState("");
  const [nptelVideos, setNptelVideos] = useState([]);

  const [levels, setLevels] = useState({
    basic: [],
    medium: [],
    advanced: [],
  });

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

  useEffect(() => {
    if (selectedTopic) {
      axios
        .get(`http://localhost:5000/api/subtopics/${selectedTopic}`)
        .then((response) => setSubtopics(response.data))
        .catch((error) => console.error("Error fetching subtopics:", error));
    }
  }, [selectedTopic]);

  useEffect(() => {
    if (selectedSubTopic) {
      axios
        .get(`http://localhost:5000/api/links/${selectedSubTopic}`)
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
    }
  }, [selectedSubTopic]);

  useEffect(() => {
    setNptelVideos([]); // Clear previous data immediately

    if (selectedSubTopic) {
      axios
        .get(`http://localhost:5000/api/videos?subTopic=${selectedSubTopic}`)
        .then((response) => {
          const data = response.data;

          // Check if valid structured data is returned
          if (
            Array.isArray(data) &&
            data.length === 5 &&
            data.every((arr) => Array.isArray(arr)) &&
            data[0].length > 0
          ) {
            setNptelVideos(data);
          } else {
            setNptelVideos([]); // Set to empty if invalid or empty data
          }
        })
        .catch((error) => {
          console.error("Error fetching NPTEL videos:", error);
          setNptelVideos([]); // Clear on error too
        });
    }
  }, [selectedSubTopic]);

  const handleChange = (e, level, index, field) => {
    const newLevels = { ...levels };
    newLevels[level][index][field] = e.target.value;
    setLevels(newLevels);
  };

  const handleSubmit = async (e) => {
    console.log("Levels:", levels);
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/update-links/${selectedSubTopic}`,
        { levels }
      );
      alert("Updated successfully!");
      navigate("/facultyindex/update");
    } catch (error) {
      console.error("Error updating links:", error);
    }
  };
  const handleNptelChange = (e, index, field) => {
    const newNptelVideos = [...nptelVideos]; // Create a shallow copy of the whole nptelVideos array
    newNptelVideos[field][index] = e.target.value; // Modify the appropriate field based on index
    setNptelVideos(newNptelVideos); // Update the state with the modified array
  };
  

  return (
    <div className="">
      <div className="row">
        {/* Left Side - Editable Fields (20%) */}
        <div className="col-md-3">
          <div className="p-3 border rounded shadow-sm bg-white">
            <h5 className="text-center text-primary mb-3">Edit Topic</h5>
            <form onSubmit={handleSubmit}>
              {/* Chapter Dropdown */}
              <div className="mb-3">
                <label htmlFor="chapter" className="form-label">
                  Chapter
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

              {/* Topic Dropdown */}
              <div className="mb-3">
                <label htmlFor="topic" className="form-label">
                  Topic
                </label>
                <select
                  id="topic"
                  className="form-select"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  disabled={!selectedChapter}
                >
                  <option value="">Select Topic</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.topic}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subtopic Dropdown */}
              <div className="mb-3">
                <label htmlFor="subtopic" className="form-label">
                  Subtopic
                </label>
                <select
                  id="subtopic"
                  className="form-select"
                  value={selectedSubTopic}
                  onChange={(e) => setSelectedSubTopic(e.target.value)}
                  disabled={!selectedTopic}
                >
                  <option value="">Select Subtopic</option>
                  {subtopics.map((subTopic) => (
                    <option key={subTopic.id} value={subTopic.id}>
                      {subTopic.subTopic}
                    </option>
                  ))}
                </select>
              </div>

              {/* Editable Link Fields */}
              {["basic", "medium", "advanced"].map((level) => (
                <div key={level} className="mb-3">
                  <h6 className="text-capitalize text-secondary mt-3">
                    {level} Level
                  </h6>
                  {levels[level].map((link, index) => (
                    <div
                      key={link.id || index}
                      className="mb-2 p-2 border rounded bg-light"
                    >
                      <input
                        type="text"
                        className="form-control form-control-sm mb-1"
                        placeholder="Title"
                        value={link.title}
                        onChange={(e) => handleChange(e, level, index, "title")}
                      />
                      <input
                        type="text"
                        className="form-control form-control-sm mb-1"
                        placeholder="Link"
                        value={link.link}
                        onChange={(e) => handleChange(e, level, index, "link")}
                      />
                      <textarea
                        className="form-control form-control-sm"
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
             {/* Live Preview of NPTEL Videos */}
<td
  style={{
    width: "25%",
    wordWrap: "break-word",
    whiteSpace: "normal",
  }}
>
  {nptelVideos[0]?.length === 0 || nptelVideos[0] === undefined ? (
    <p className="text-muted">No NPTEL content</p>
  ) : (
    nptelVideos[0].map((_, index) => (
      <div key={index} className="mb-3 border-bottom pb-2">
        {/* Editable Title */}
        <input
          type="text"
          className="form-control form-control-sm mb-1"
          value={nptelVideos[2][index]} // Title field
          onChange={(e) => handleNptelChange(e, index, 2)} // Update the title field
          placeholder="Title"
        />

        {/* Editable Link */}
        <input
          type="text"
          className="form-control form-control-sm mb-1"
          value={nptelVideos[0][index]} // Link field
          onChange={(e) => handleNptelChange(e, index, 0)} // Update the link field
          placeholder="Link"
        />

        {/* Editable Description */}
        <textarea
          className="form-control form-control-sm mb-1"
          value={nptelVideos[3][index]} // Description field
          onChange={(e) => handleNptelChange(e, index, 3)} // Update the description field
          placeholder="Description"
          rows="2"
        />
      </div>
    ))
  )}
</td>


              <button type="submit" className="btn btn-primary w-100 mt-3">
                Update
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-9">
          <div className="p-4 border rounded shadow-sm bg-light h-100 overflow-auto">
            <h4 className="text-center text-secondary mb-4">Live Preview</h4>
            <div className="table-responsive">
              <table
                className="table table-bordered"
                style={{ tableLayout: "fixed", width: "100%" }}
              >
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "25%" }}>Basic</th>
                    <th style={{ width: "25%" }}>Intermediate</th>
                    <th style={{ width: "25%" }}>Advanced</th>
                    <th style={{ width: "25%" }}>Local Server</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {["basic", "medium", "advanced"].map((level) => (
                      <td
                        key={level}
                        style={{
                          width: "25%",
                          wordWrap: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        {levels[level].length === 0 ? (
                          <p className="text-muted">No links</p>
                        ) : (
                          levels[level].map((link, index) => (
                            <div
                              key={link.id || index}
                              className="mb-3 border-bottom pb-2"
                            >
                              <p>
                                <strong>{link.title}</strong>
                              </p>
                              <p>
                                <a
                                  href={link.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    src="/image/youtube_logo.png"
                                    alt=""
                                    style={{ width: "40px", height: "30px" }}
                                  />
                                </a>
                              </p>
                              <p className="small text-muted">
                                {link.description}
                              </p>
                            </div>
                          ))
                        )}
                      </td>
                    ))}

                    {/* NPTEL Content */}
                    <td
                      style={{
                        width: "25%",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {nptelVideos.length === 0 ||
                      nptelVideos[0].length === 0 ? (
                        <p className="text-muted">No NPTEL content</p>
                      ) : (
                        nptelVideos[0].map((_, index) => (
                          <div key={index} className="mb-3 border-bottom pb-2">
                            <p>
                              <strong>{nptelVideos[2][index]}</strong>
                            </p>
                            <p>
                              <a
                                href={nptelVideos[0][index]}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src="/image/image.png"
                                  alt=""
                                  style={{ width: "80px", height: "30px" }}
                                />
                              </a>
                            </p>
                            <p className="small text-muted">
                              {nptelVideos[3][index]}
                            </p>
                            <p className="badge bg-secondary">
                              {nptelVideos[4][index]}
                            </p>
                          </div>
                        ))
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTopic;
