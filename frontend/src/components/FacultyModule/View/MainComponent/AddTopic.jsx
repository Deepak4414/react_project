import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import NptelContent from "./NptelContent";
import Link from "./Link";

const AddTopic = () => {
    const navigate = useNavigate();
    const { state } = useLocation();

    const { course, branch, semester, subject } = state || {};

    const [chapters, setChapters] = useState([]);
    const [topics, setTopics] = useState([]);
    const [subTopic, setSubTopic] = useState("");
    const [levels, setLevels] = useState({
        basic: [],
        medium: [],
        advanced: [],
    });
    const [selectedChapter, setSelectedChapter] = useState("");
    const [newChapter, setNewChapter] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("");
    const [isAddingNewChapter, setIsAddingNewChapter] = useState(false);
    const [newTopic, setNewTopic] = useState("");
    const [isAddingNewTopic, setIsAddingNewTopic] = useState(false);
    const [loading, setLoading] = useState(false);
    const [nptelData, setNptelData] = useState([]);
    const [folderName, setFolderName] = useState("");

    // Fetch chapters for the subject
    useEffect(() => {
        const fetchChapters = async () => {
            setLoading(true);
            try {
                if (subject) {
                    const response = await axios.get(
                        `http://localhost:5000/api/chapter/${subject}`
                    );
                    setChapters(response.data.chapter);
                }
            } catch (error) {
                console.error("Error fetching chapters:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchChapters();
    }, [subject]);

    // Fetch topics for the selected chapter
    useEffect(() => {
        const fetchTopics = async () => {
            setLoading(true);
            try {
                if (selectedChapter) {
                    
                    const response = await axios.get(
                        `http://localhost:5000/api/topics/${selectedChapter}`
                    );
                    setTopics(response.data.topics);
                }
            } catch (error) {
                console.error("Error fetching topics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTopics();
    }, [selectedChapter]);

    const handleVideoDataChange = (updatedData) => {
        setNptelData(updatedData);
    };
   
    const handleFolderNameChange = (folderName) => {
        setFolderName(folderName);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedChapter) {
            alert("Please select a chapter.");
            return;
        }
        if (!selectedTopic && !newTopic) {
            alert("Please select a topic or enter a new topic.");
            return;
        }
        if (!subTopic) {
            alert("Please enter a subtopic.");
            return;
        }

        const requestData = {
            chapterId: isAddingNewChapter ? newChapter : selectedChapter,
            isAddingNewChapter,
            topic: isAddingNewTopic ? newTopic : selectedTopic,
            isAddingNewTopic,
            subTopic,
            courseId: course,
            branchId: branch,
            semesterId: semester,
            subjectId: subject,
            levels,
            nptelVideos: nptelData,
            videoFolder: folderName,
            
        };

        try {
            const response = await axios.post(
                "http://localhost:5000/api/topics/add-topic",
                requestData
            );
            alert("Topic and links added successfully:", response.data);
            navigate(-1);
        } catch (error) {
            console.error("Error adding topic:", error);
            alert("An error occurred while adding the topic. Please try again.");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Add Topic</h2>
            {loading ? (
                <p>Loading data...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    {/* Chapter Dropdown */}
                    <div className="mb-3">
                        <label htmlFor="chapter" className="form-label">
                            Select Chapter
                        </label>
                        <select
                            id="chapter"
                            className="form-select"
                            value={selectedChapter}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSelectedChapter(value);  
                                setIsAddingNewChapter(value === "add_new_chapter");
                            }}
                        >
                            <option value="">-- Select a Chapter --</option>
                            {chapters.map((chapter) => (
                                <option key={chapter.id} value={chapter.id}>
                                    {chapter.chapter}
                                </option>
                            ))}
                            <option value="add_new_chapter">Add New Chapter</option>
                        </select>
                    </div>
                    
                    {/* New chapter Input */}
                    {isAddingNewChapter && (
                        <div className="mb-3">
                            <label htmlFor="newChapter" className="form-label">
                                New Chapter Name
                            </label>
                            <input
                                type="text"
                                id="newChapter"
                                className="form-control"
                                value={newChapter}
                                onChange={(e) => setNewChapter(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Topic Dropdown */}
                    <div className="mb-3">
                        <label htmlFor="topic" className="form-label">
                            Select Topic
                        </label>
                        <select
                            id="topic"
                            className="form-select"
                            value={selectedTopic}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSelectedTopic(value);
                                setIsAddingNewTopic(value === "add_new_topic");
                            }}
                        >
                            <option value="">-- Select a Topic --</option>
                            {topics.map((topic) => (
                                <option key={topic.id} value={topic.id}>
                                    {topic.topic}
                                </option>
                            ))}
                            <option value="add_new_topic">Add New Topic</option>
                        </select>
                    </div>

                    {/* New Topic Input */}
                    {isAddingNewTopic && (
                        <div className="mb-3">
                            <label htmlFor="newTopic" className="form-label">
                                New Topic Name
                            </label>
                            <input
                                type="text"
                                id="newTopic"
                                className="form-control"
                                value={newTopic}
                                onChange={(e) => setNewTopic(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Subtopic Input */}
                    <div className="mb-3">
                        <label htmlFor="subTopic" className="form-label">
                            Subtopic Name
                        </label>
                        <input
                            type="text"
                            id="subTopic"
                            className="form-control"
                            value={subTopic}
                            onChange={(e) => setSubTopic(e.target.value)}
                        />
                    </div>

                    {/* Levels */}
                    {["basic", "medium", "advanced"].map((level) => (
                        <div key={level} className="mb-4">
                            <h4 className="text-capitalize">{level} Level</h4>
                            {levels[level].map((item, index) => (
                                <Link
                                    key={`${level}-${index}`}
                                    level={level}
                                    index={index}
                                    data={item}
                                    handleInputChange={(level, index, field, value) =>
                                        setLevels((prev) => ({
                                            ...prev,
                                            [level]: prev[level].map((link, i) =>
                                                i === index ? { ...link, [field]: value } : link
                                            ),
                                        }))
                                    }
                                    removeLink={() =>
                                        setLevels((prev) => ({
                                            ...prev,
                                            [level]: prev[level].filter((_, i) => i !== index),
                                        }))
                                    }
                                />
                            ))}
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() =>
                                    setLevels((prev) => ({
                                        ...prev,
                                        [level]: [
                                            ...prev[level],
                                            { title: "", link: "", description: "", rating: 0 },
                                        ],
                                    }))
                                }
                            >
                                Add {level.charAt(0).toUpperCase() + level.slice(1)} Link
                            </button>
                        </div>
                    ))}

                    {/* NPTEL Content */}
                    <NptelContent
                        subject={subject}
                        onVideoDataChange={handleVideoDataChange}
                        onFolderNameChange={handleFolderNameChange}
                    />

                    <button type="submit" className="btn btn-success">
                        Save Topic
                    </button>
                </form>
            )}
        </div>
    );
};

export default AddTopic;
