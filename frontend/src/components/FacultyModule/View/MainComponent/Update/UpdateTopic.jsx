import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
    const [levels, setLevels] = useState({
        basic: [],
        medium: [],
        advanced: [],
    });

    useEffect(() => {
        if (subject) {
            axios.get(`http://localhost:5000/api/chapter/${subject}`)
                .then(response => setChapters(response.data.chapter))
                .catch(error => console.error("Error fetching chapters:", error));
        }
    }, [subject]);

    useEffect(() => {
        if (selectedChapter) {
            axios.get(`http://localhost:5000/api/topics/${selectedChapter}`)
                .then(response => setTopics(response.data.topics))
                .catch(error => console.error("Error fetching topics:", error));
        }
    }, [selectedChapter]);

    useEffect(() => {
        if (selectedTopic) {
            axios.get(`http://localhost:5000/api/subtopics/${selectedTopic}`)
                .then(response => setSubtopics(response.data))
                .catch(error => console.error("Error fetching subtopics:", error));
        }
    }, [selectedTopic]);

    useEffect(() => {
        if (selectedSubTopic) {
            axios.get(`http://localhost:5000/api/links/${selectedSubTopic}`)
                .then(response => {
                    const data = response.data;
                    const categorizedLinks = { basic: [], medium: [], advanced: [] };

                    data.forEach(link => {
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
                .catch(error => console.error("Error fetching links:", error));
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
            await axios.put(`http://localhost:5000/api/update-links/${selectedSubTopic}`, { levels });
            alert("Updated successfully!");
            navigate("/facultyindex/update");
        } catch (error) {
            console.error("Error updating links:", error);
        }
    };

    return (
        <div className="container my-5">
            <div className="row">
                {/* Left Side - Update Form */}
                <div className="col-md-6">
                    <div className="p-4 border rounded shadow-sm bg-white">
                        <h2 className="text-center mb-4 text-primary">Update Topic Details</h2>
                        <form onSubmit={handleSubmit}>
                            {/* Chapter Dropdown */}
                            <div className="mb-3">
                                <label htmlFor="chapter" className="form-label">Chapter</label>
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
                                <label htmlFor="topic" className="form-label">Topic</label>
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
                                <label htmlFor="subtopic" className="form-label">Subtopic</label>
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
                                <div key={level}>
                                    <h4 className="text-capitalize">{level} Level</h4>
                                    {levels[level].map((link, index) => (
                                        <div key={link.id} className="mb-3 border p-3 rounded">
                                            <div className="mb-2">
                                                <label className="form-label">Title</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={link.title}
                                                    onChange={(e) => handleChange(e, level, index, "title")}
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">Link</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={link.link}
                                                    onChange={(e) => handleChange(e, level, index, "link")}
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">Description</label>
                                                <textarea
                                                    className="form-control"
                                                    value={link.description}
                                                    onChange={(e) => handleChange(e, level, index, "description")}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
    
                            <button type="submit" className="btn btn-primary w-100 py-3">
                                Update Topic
                            </button>
                        </form>
                    </div>
                </div>
    
                {/* Right Side - Live Preview */}
                <div className="col-md-6">
                    <div className="p-4 border rounded shadow-sm bg-light h-100 overflow-auto">
                        <h3 className="text-center text-secondary mb-4">Live Preview</h3>
                        {["basic", "medium", "advanced"].map((level) => (
                            <div key={level} className="mb-4">
                                <h5 className="text-capitalize text-primary">{level} Level</h5>
                                {levels[level].length === 0 ? (
                                    <p className="text-muted">No links available.</p>
                                ) : (
                                    levels[level].map((link, index) => (
                                        <div key={link.id || index} className="mb-3 border-start ps-3">
                                            <p><strong>Title:</strong> {link.title}</p>
                                            <p><strong>Link:</strong> <a href={link.link} target="_blank" rel="noopener noreferrer">{link.link}</a></p>
                                            <p><strong>Description:</strong> {link.description}</p>
                                            <hr />
                                        </div>
                                    ))
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
    
};

export default UpdateTopic;
